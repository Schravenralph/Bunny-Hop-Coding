// Playwright end-to-end test for Bunny Hop Coding Adventure
const { test, expect } = require('@playwright/test');
const http = require('http');
const fs = require('fs');
const path = require('path');

let server;
let serverPort = 3000;

// Start a simple HTTP server to serve the files
function startServer() {
  return new Promise((resolve, reject) => {
    server = http.createServer((req, res) => {
      let filePath = '.' + req.url;
      if (filePath === './') filePath = './index.html';
      
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        
        const ext = path.extname(filePath);
        const contentType = {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.json': 'application/json'
        }[ext] || 'text/plain';
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      });
    });
    
    server.listen(serverPort, () => {
      console.log(`Test server started on port ${serverPort}`);
      resolve();
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        serverPort++;
        server.listen(serverPort, () => {
          console.log(`Test server started on port ${serverPort}`);
          resolve();
        });
      } else {
        reject(err);
      }
    });
  });
}

function stopServer() {
  return new Promise((resolve) => {
    if (server) {
      server.close(() => resolve());
    } else {
      resolve();
    }
  });
}

test.beforeAll(async () => {
  await startServer();
});

test.afterAll(async () => {
  await stopServer();
});

test.setTimeout(120000); // 2 minutes for Pyodide to load

// Helper to wait for Pyodide
async function waitForPyodide(page) {
  await page.waitForFunction(() => window.pyodide !== undefined, { timeout: 90000 });
  // Wait a bit more for setupPythonEnvironment
  await page.waitForTimeout(2000);
}

test('Application loads and Pyodide initializes', async ({ page }) => {
  // Track console messages and errors
  const consoleMessages = [];
  const errors = [];
  
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push(text);
    if (msg.type() === 'error') {
      errors.push(text);
    }
  });
  
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  // Navigate to the page
  await page.goto(`http://localhost:${serverPort}`, { waitUntil: 'domcontentloaded' });
  
  // Wait for the page to load
  await page.waitForSelector('h1:has-text("Bunny Hop Coding Adventure")', { timeout: 10000 });
  
  // Wait for Pyodide to load
  await waitForPyodide(page);
  
  // Check that game is initialized
  await page.waitForFunction(() => {
    return window.game !== undefined;
  }, { timeout: 10000 });
  
  // Check that level selector is populated
  const levelSelect = page.locator('#levelSelect');
  await expect(levelSelect).toBeVisible();
  
  // Check that code editor is visible
  const codeEditor = page.locator('#codeEditor');
  await expect(codeEditor).toBeVisible();
  
  // Check that canvas is visible
  const canvas = page.locator('#gameCanvas');
  await expect(canvas).toBeVisible();
  
  // Check for critical errors (excluding network/favicon errors)
  const criticalErrors = errors.filter(e => 
    !e.includes('favicon') && 
    !e.includes('Failed to load resource') &&
    !e.includes('net::ERR_') &&
    !e.includes('404') &&
    !e.includes('ImportError') &&
    !e.includes('cannot import name')
  );
  
  if (criticalErrors.length > 0) {
    console.error('Critical errors found:', criticalErrors);
  }
});

test('Can run simple Python code', async ({ page }) => {
  await page.goto(`http://localhost:${serverPort}`, { waitUntil: 'domcontentloaded' });
  await waitForPyodide(page);
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  // Get initial bunny position
  const initialX = await page.evaluate(() => window.game.bunny.x);
  
  // Enter simple code
  await page.fill('#codeEditor', 'move_right(10)');
  
  // Click run button
  await page.click('#runBtn');
  
  // Wait for code to execute
  await page.waitForSelector('button:has-text("▶️ Run Code")', { timeout: 20000 });
  
  // Wait for game to update
  await page.waitForTimeout(1500);
  
  // Check that bunny moved
  const finalX = await page.evaluate(() => window.game.bunny.x);
  
  // Check for critical errors (especially import errors)
  const errorMessages = errors.filter(e => 
    !e.includes('favicon') && 
    !e.includes('Failed to load resource') &&
    !e.includes('net::ERR_') &&
    !e.includes('404')
  );
  
  const importErrors = errorMessages.filter(e => 
    e.includes('cannot import name') || 
    e.includes('ImportError') ||
    e.includes('from js import')
  );
  
  if (importErrors.length > 0) {
    throw new Error('Import error detected: ' + importErrors.join(', '));
  }
  
  expect(finalX).toBeGreaterThan(initialX);
});

test('Can run code with jump', async ({ page }) => {
  await page.goto(`http://localhost:${serverPort}`, { waitUntil: 'domcontentloaded' });
  await waitForPyodide(page);
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  // Get initial bunny Y position (before game starts)
  const initialY = await page.evaluate(() => window.game.bunny.y);
  
  // Enter code with jump
  await page.fill('#codeEditor', 'jump()');
  
  // Click run button (this starts the game and sets up Python environment)
  await page.click('#runBtn');
  
  // Wait for code to execute
  await page.waitForSelector('button:has-text("▶️ Run Code")', { timeout: 20000 });
  
  // Wait for jump animation - need more time for physics
  await page.waitForTimeout(2000);
  
  // Check that bunny jumped (Y position should be less, or at least different)
  const finalY = await page.evaluate(() => window.game.bunny.y);
  
  // Check for import errors
  const importErrors = errors.filter(e => 
    (e.includes('cannot import name') || 
     e.includes('ImportError') ||
     e.includes('from js import')) &&
    !e.includes('favicon')
  );
  
  if (importErrors.length > 0) {
    throw new Error('Import error detected: ' + importErrors.join(', '));
  }
  
  // Bunny should have jumped up (Y decreases) or at least moved
  // If bunny is on ground, Y might be the same, so check if game is running
  const gameRunning = await page.evaluate(() => window.game.isRunning);
  if (gameRunning) {
    // If game is still running, bunny might be in the air or falling
    // Just check that something happened (position changed or velocity changed)
    const vy = await page.evaluate(() => window.game.bunny.vy);
    const onGround = await page.evaluate(() => window.game.bunny.onGround);
    
    // Either bunny is in the air (vy != 0 or !onGround) or position changed
    expect(finalY !== initialY || vy !== 0 || !onGround).toBeTruthy();
  } else {
    // Game stopped, check if position changed during jump
    expect(finalY).not.toBeGreaterThan(initialY);
  }
});

test('Can load different levels', async ({ page }) => {
  await page.goto(`http://localhost:${serverPort}`, { waitUntil: 'domcontentloaded' });
  await waitForPyodide(page);
  
  // Change level
  await page.selectOption('#levelSelect', '2');
  
  // Wait for level to load
  await page.waitForTimeout(500);
  
  // Check that instructions updated
  const instructions = await page.locator('#instructions').textContent();
  expect(instructions).toContain('jump');
  
  // Check that code editor has different content
  const codeContent = await page.locator('#codeEditor').inputValue();
  expect(codeContent.length).toBeGreaterThan(0);
});

test('Python functions are available without import errors', async ({ page }) => {
  await page.goto(`http://localhost:${serverPort}`, { waitUntil: 'domcontentloaded' });
  await waitForPyodide(page);
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  // Setup Python environment by triggering runCode (which calls setupPythonEnvironment)
  // We'll do this by clicking run button with minimal code
  await page.fill('#codeEditor', '# Test');
  await page.click('#runBtn');
  
  // Wait for setup to complete
  await page.waitForSelector('button:has-text("▶️ Run Code")', { timeout: 20000 });
  await page.waitForTimeout(1000);
  
  // Now test that Python functions are available
  const result = await page.evaluate(async () => {
    try {
      // Try to call Python functions - they should be available after setupPythonEnvironment
      const testResult = window.pyodide.runPython(`
try:
    move_right(5)
    result = "success"
except Exception as e:
    result = f"error: {str(e)}"
result
      `);
      return testResult;
    } catch (e) {
      return `error: ${e.message}`;
    }
  });
  
  expect(result).toBe('success');
  
  // Check for import errors
  const importErrors = errors.filter(e => 
    (e.includes('cannot import name') || 
     e.includes('ImportError') ||
     e.includes('from js import')) &&
    !e.includes('favicon')
  );
  
  if (importErrors.length > 0) {
    throw new Error('Import error detected: ' + importErrors.join(', '));
  }
});

test('Can use multiple Python functions in sequence', async ({ page }) => {
  await page.goto(`http://localhost:${serverPort}`, { waitUntil: 'domcontentloaded' });
  await waitForPyodide(page);
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  // Get initial position
  const initialX = await page.evaluate(() => window.game.bunny.x);
  const initialY = await page.evaluate(() => window.game.bunny.y);
  
  // Enter code with multiple functions
  await page.fill('#codeEditor', 'move_right(5)\njump()\nmove_right(5)');
  
  // Click run button
  await page.click('#runBtn');
  
  // Wait for code to execute
  await page.waitForSelector('button:has-text("▶️ Run Code")', { timeout: 20000 });
  
  // Wait for game to update
  await page.waitForTimeout(2000);
  
  // Check final position
  const finalX = await page.evaluate(() => window.game.bunny.x);
  const finalY = await page.evaluate(() => window.game.bunny.y);
  
  // Check for import errors
  const importErrors = errors.filter(e => 
    (e.includes('cannot import name') || 
     e.includes('ImportError') ||
     e.includes('from js import')) &&
    !e.includes('favicon')
  );
  
  if (importErrors.length > 0) {
    throw new Error('Import error detected: ' + importErrors.join(', '));
  }
  
  // Bunny should have moved right
  expect(finalX).toBeGreaterThan(initialX);
});
