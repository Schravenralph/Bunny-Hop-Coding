# Playwright Test Timeout and Hang Prevention Policy

## Problem Statement

Playwright end-to-end tests can hang indefinitely when:
- Waiting for external resources (CDN, Pyodide, etc.) that take 30-90+ seconds to load
- Async operations that never resolve or reject
- Infinite loops in `waitForFunction` calls
- Browser processes that don't terminate properly
- Network timeouts without proper error handling
- Missing cleanup in `afterAll` hooks

When tests hang, terminal commands can become unresponsive, blocking development workflows.

## Policy

### 1. Always Set Explicit Timeouts

**Required:** Every async operation in Playwright tests MUST have an explicit timeout.

```javascript
// ✅ GOOD: Explicit timeout
await page.waitForFunction(() => window.pyodide !== undefined, { timeout: 90000 });

// ❌ BAD: No timeout (uses default, may be too short or too long)
await page.waitForFunction(() => window.pyodide !== undefined);
```

**Global Test Timeout:**
```javascript
// Set at the top of test file
test.setTimeout(120000); // 2 minutes for slow operations like Pyodide
```

### 2. Use Process-Level Timeouts for Test Commands

**Required:** When running Playwright tests via terminal, always use a process timeout wrapper.

```bash
# ✅ GOOD: Use timeout command to kill stuck processes
timeout 180 npx playwright test --timeout=120000

# ❌ BAD: No process timeout - can hang indefinitely
npx playwright test
```

**Recommended timeout values:**
- Fast tests (< 10s): `timeout 60`
- Medium tests (10-60s): `timeout 180`
- Slow tests (Pyodide, etc.): `timeout 300` (5 minutes)

### 3. Implement Proper Cleanup

**Required:** All test files MUST have `beforeAll` and `afterAll` hooks for resource cleanup.

```javascript
// ✅ GOOD: Proper cleanup
let server;
let browser;

test.beforeAll(async () => {
  server = await startServer();
  browser = await playwright.chromium.launch();
});

test.afterAll(async () => {
  if (server) await server.close();
  if (browser) await browser.close();
});
```

**Critical:** Always check if resources exist before closing to avoid errors.

### 4. Avoid Infinite Wait Loops

**Required:** Never use `while(true)` or infinite loops without break conditions.

```javascript
// ✅ GOOD: Loop with timeout and break condition
const startTime = Date.now();
const maxWait = 90000;

while (!condition && (Date.now() - startTime) < maxWait) {
  await page.waitForTimeout(1000);
  condition = await page.evaluate(() => window.pyodide !== undefined);
}

if (!condition) {
  throw new Error('Operation timed out');
}

// ❌ BAD: Infinite loop
while (!condition) {
  await page.waitForTimeout(1000);
  condition = await page.evaluate(() => window.pyodide !== undefined);
}
```

### 5. Use Race Conditions for Multiple Wait Strategies

**Required:** When waiting for slow-loading resources, use `Promise.race()` with timeout.

```javascript
// ✅ GOOD: Race condition with timeout
await Promise.race([
  page.waitForFunction(() => window.pyodide !== undefined, { timeout: 90000 }),
  new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Timeout')), 95000)
  )
]);

// ❌ BAD: Single wait strategy
await page.waitForFunction(() => window.pyodide !== undefined, { timeout: 90000 });
```

### 6. Handle Network and CDN Failures Gracefully

**Required:** Tests that depend on external resources MUST handle failures.

```javascript
// ✅ GOOD: Graceful failure handling
test('Loads Pyodide', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error));
  
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForFunction(() => window.pyodide !== undefined, { timeout: 90000 });
  } catch (error) {
    if (error.message.includes('net::ERR_')) {
      test.skip(); // Skip if network issue
      return;
    }
    throw error;
  }
});
```

### 7. Use `waitUntil` Options Appropriately

**Required:** Choose the right `waitUntil` option for the page load strategy.

```javascript
// ✅ GOOD: Use domcontentloaded for faster tests
await page.goto(url, { waitUntil: 'domcontentloaded' });

// ✅ GOOD: Use networkidle for pages that need all resources
await page.goto(url, { waitUntil: 'networkidle' });

// ❌ BAD: Default waitUntil may wait too long
await page.goto(url);
```

**Guidelines:**
- `domcontentloaded`: Fast, good for most tests
- `load`: Waits for all resources, slower
- `networkidle`: Waits for network to be idle, can be very slow
- `commit`: Fastest, but may not wait for scripts

### 8. Monitor and Log Long-Running Operations

**Required:** Log progress for operations that take > 10 seconds.

```javascript
// ✅ GOOD: Progress logging
console.log('Waiting for Pyodide to load...');
const startTime = Date.now();

while (!loaded && (Date.now() - startTime) < maxWait) {
  if ((Date.now() - startTime) % 10000 < 1000) {
    console.log(`Still waiting... ${Math.floor((Date.now() - startTime) / 1000)}s`);
  }
  await page.waitForTimeout(1000);
}
```

### 9. Kill Stuck Browser Processes

**Required:** If tests hang, kill browser processes before retrying.

```bash
# Kill all Chromium/Chrome processes
pkill -f chromium
pkill -f chrome

# Or more specifically for Playwright
pkill -f playwright
```

**Automated cleanup script:**
```bash
#!/bin/bash
# cleanup-playwright.sh
pkill -f playwright || true
pkill -f chromium || true
rm -rf test-results/ || true
```

### 10. Use Test Isolation

**Required:** Each test should be independent and not rely on previous test state.

```javascript
// ✅ GOOD: Each test sets up its own state
test('Test 1', async ({ page }) => {
  await page.goto(url);
  // Test code
});

test('Test 2', async ({ page }) => {
  await page.goto(url); // Fresh page
  // Test code
});

// ❌ BAD: Tests depend on each other
test('Test 1', async ({ page }) => {
  await page.goto(url);
  // Sets up state
});

test('Test 2', async ({ page }) => {
  // Assumes Test 1 ran first - FRAGILE!
});
```

## Implementation Checklist

When writing Playwright tests, ensure:

- [ ] Global `test.setTimeout()` is set appropriately
- [ ] All `waitFor*` calls have explicit timeouts
- [ ] `beforeAll` and `afterAll` hooks clean up resources
- [ ] No infinite loops without timeout/break conditions
- [ ] Network failures are handled gracefully
- [ ] Process-level timeout wrapper is used in CI/CD
- [ ] Long operations (>10s) have progress logging
- [ ] Tests are isolated and independent
- [ ] Browser processes are killed if tests hang

## Example: Complete Test File Template

```javascript
const { test, expect } = require('@playwright/test');

// Set global timeout
test.setTimeout(120000); // 2 minutes

let server;
let serverPort = 3000;

// Helper with timeout
async function waitForPyodide(page, maxWait = 90000) {
  const startTime = Date.now();
  
  while ((Date.now() - startTime) < maxWait) {
    const loaded = await page.evaluate(() => window.pyodide !== undefined);
    if (loaded) {
      await page.waitForTimeout(2000); // Wait for setup
      return;
    }
    await page.waitForTimeout(1000);
  }
  
  throw new Error('Pyodide failed to load within timeout');
}

test.beforeAll(async () => {
  server = await startServer();
});

test.afterAll(async () => {
  if (server) {
    await new Promise(resolve => {
      server.close(() => resolve());
    });
  }
});

test('Example test', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error));
  
  try {
    await page.goto(`http://localhost:${serverPort}`, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 
    });
    
    await waitForPyodide(page);
    
    // Test code here
    
  } catch (error) {
    if (error.message.includes('net::ERR_')) {
      test.skip();
      return;
    }
    throw error;
  }
});
```

## CI/CD Integration

In CI/CD pipelines, always use process timeouts:

```yaml
# GitHub Actions example
- name: Run Playwright tests
  run: timeout 300 npx playwright test --timeout=120000
  timeout-minutes: 5
```

```json
// package.json scripts
{
  "scripts": {
    "test:e2e": "timeout 300 npx playwright test --timeout=120000",
    "test:e2e:ci": "timeout 600 npx playwright test --timeout=120000 --workers=1"
  }
}
```

## Emergency Recovery

If tests are stuck:

1. **Kill the process:**
   ```bash
   pkill -9 -f playwright
   pkill -9 -f node
   ```

2. **Clean up:**
   ```bash
   rm -rf test-results/
   rm -rf .playwright/
   ```

3. **Restart with timeout:**
   ```bash
   timeout 180 npx playwright test --timeout=120000
   ```

## Related Policies

- See `testing-policy.md` for general testing guidelines
- See `async-operations-policy.md` for async operation handling

## Revision History

- **2024-01-XX**: Initial policy created after Playwright test hang issues
- Documents fixes for: Pyodide loading timeouts, infinite wait loops, missing cleanup

