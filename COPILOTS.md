# COPILOTS.md — Bunny Hop Coding Adventure Copilot Operating Rules

You are working in the Bunny Hop Coding Adventure repository. Treat this file as the entry point and source of truth for how to work in this codebase.

## 0) First step for every task (MANDATORY)

Before writing or changing code:

1. Read:
   - `docs/01-architecture/architecture.md`
   - `docs/02-development/README.md`
   - `docs/01-architecture/components.md`
2. If the task is UI-related, also read:
   - `style.css` (for styling patterns)
   - `index.html` (for HTML structure)
3. If the task involves game mechanics, also read:
   - `docs/05-product/mechanics.md`
   - `docs/05-product/levels.md`
4. If the task involves adding levels, also read:
   - `levels.js` (for level structure examples)

If any instruction conflicts, follow this priority:
`COPILOTS.md` > `docs/01-architecture/architecture.md` > `docs/02-development/README.md` > everything else.

## 1) Repo facts (do not guess)

- **No package manager**: This is a pure client-side project with no npm/yarn/pnpm
- **No build tools**: No webpack, vite, or other bundlers
- **No dependencies**: Only external dependency is Pyodide (loaded via CDN)
- **Runtime**: Runs entirely in the browser
- **Python execution**: Pyodide v0.24.1 (via CDN)
- **File structure**: Flat structure with core files in root directory

## 2) Project structure

- **`index.html`**: Main HTML structure, UI layout, and Pyodide CDN loading
- **`style.css`**: All styling and responsive design
- **`game.js`**: Core game engine (`BunnyHopGame` class)
  - Physics simulation
  - Rendering (Canvas API)
  - Collision detection
  - Game state management
- **`main.js`**: Application controller
  - Pyodide initialization
  - Python environment setup
  - Code execution orchestration
  - Event handling
  - Level management
- **`levels.js`**: Level definitions (object with numeric keys 1-15+)
- **`docs/`**: Documentation directory
  - `docs/01-architecture/`: System architecture and component design
  - `docs/02-development/`: Development guide and workflows
  - `docs/04-policies/`: Development policies
  - `docs/05-product/`: Game design and level documentation
  - `docs/06-adr/`: Architecture Decision Records

## 3) Hard boundaries (MUST / MUST NOT)

### No build tools or package managers

- MUST NOT introduce npm, yarn, pnpm, or any package manager
- MUST NOT introduce webpack, vite, rollup, or any bundler
- MUST NOT require a build step to run the application
- All code MUST run directly in the browser from source files

### External dependencies

- ONLY Pyodide is allowed as an external dependency (via CDN)
- MUST NOT add other npm packages or CDN libraries without explicit approval
- Pyodide version: v0.24.1 (do not upgrade without testing)

### File organization

- Core game files MUST remain in the root directory
- Documentation MUST be in `docs/` subdirectories
- MUST NOT create complex nested directory structures
- Keep the project structure flat and simple

### Code execution safety

- Python code MUST run in isolated Pyodide environment
- MUST NOT allow file system access
- MUST NOT allow network access from Python code
- MUST implement timeout protection for code execution (30 second max)
- MUST handle errors gracefully with user-friendly messages

### Type rules (JavaScript)

- Use modern ES6+ JavaScript features
- Use descriptive variable and function names
- Use camelCase for variables and functions
- Use PascalCase for classes
- Add comments for complex logic
- MUST NOT use `eval()` or `Function()` constructor for user code

### Python API rules

- Python function names MUST use snake_case
- Python functions MUST have clear docstrings
- Python functions MUST be exposed via `setupPythonEnvironment()` in `main.js`
- Python functions MUST call corresponding JavaScript methods in `game.js`

## 4) Decision-making rules (how to choose an approach)

When deciding between approaches, prefer:

1. The option that maintains simplicity and requires no build tools
2. The option that keeps the project running directly in the browser
3. The option that minimizes changes to existing architecture patterns
4. The option that keeps the educational focus clear for kids learning to code
5. Small, incremental steps that keep the game playable
6. Solutions that align with existing patterns in `game.js` and `main.js`

If unsure, choose the simpler approach that avoids introducing new dependencies or build complexity.

## 5) Architecture patterns (current direction)

### Game loop pattern

- Continuous update/render cycle using `requestAnimationFrame()`
- Frame-based animation targeting 60fps
- State management between frames
- Game loop MUST be in `game.js` (`update()` and `draw()` methods)

### Component separation

- Clear separation of concerns:
  - UI: `index.html` and `style.css`
  - Application logic: `main.js`
  - Game engine: `game.js`
  - Data: `levels.js`
- MUST NOT mix concerns (e.g., don't put game logic in HTML)

### API bridge pattern

- Python-to-JavaScript bridge via Pyodide
- Exposed game methods as Python functions
- Async handling for timing operations (`wait()`, `sleep()`)
- Bridge setup MUST be in `setupPythonEnvironment()` in `main.js`

### State management

- Game state object for persistence (`gameState` in `BunnyHopGame`)
- Reset capability via state snapshot
- Level-specific state initialization
- State MUST be resetable without page reload

## 6) Adding new features

### Adding a new level

1. Open `levels.js`
2. Add a new level object with the next sequential number
3. Follow the level schema:
   ```javascript
   {
     name: string,
     instructions: string (HTML),
     startX: number,
     startY: number,
     groundY: number,
     platforms: Array,
     carrots: Array,
     stars: Array,
     coins: Array,
     obstacles: Array,
     goal: { x, y, width, height },
     hint: string,
     startCode?: string,
     requiredCarrots?: number
   }
   ```
4. The level will automatically appear in the dropdown

### Adding a new Python function

1. Add method to `BunnyHopGame` class in `game.js`
2. Expose in `setupPythonEnvironment()` in `main.js` as a Python function
3. Add to help section in `index.html` (`<li><code>function_name()</code> - Description</li>`)
4. Update `docs/01-architecture/architecture.md` if it's a significant addition

### Adding new game elements

1. Add to level data structure in `levels.js`
2. Add rendering method in `game.js` (e.g., `drawNewElement()`)
3. Add to `draw()` method call sequence
4. Add collision detection in `checkCollisions()` if needed
5. Update game state initialization if needed

### Modifying game physics

- Edit constants in `BunnyHopGame` constructor:
  - `gravity`: Gravity strength (default: 0.8)
  - Movement speed: In `moveRight()`/`moveLeft()` (default: 3)
  - Jump strength: In `jump()` (default: -15)
  - Friction: In `update()` (default: 0.9)
- Test thoroughly after physics changes
- Document significant physics changes

## 7) Testing strategy

### Manual testing (primary method)

- Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- Test all levels load correctly
- Test code execution works
- Test collision detection accuracy
- Test moving platforms
- Test collectibles
- Test level completion triggers
- Test reset functionality
- Test responsive design on mobile

### Browser console

- Check for JavaScript errors
- Check for Python execution errors
- Use `console.log()` for debugging (remove before committing)
- Use browser DevTools for performance profiling

### No automated tests

- This project does not have automated test infrastructure
- All testing is manual
- Focus on ensuring the game works in target browsers

## 8) "AI memory" update policy

The docs in `docs/01-architecture/`, `docs/02-development/`, and `docs/05-product/` are the project's long-term memory.

### When to update memory docs

Update memory docs ONLY when you:

- introduce/change an architectural rule or boundary
- add a new major component or game element type
- define a new repeatable pattern (e.g., how levels are structured)
- change Python API significantly
- add new game mechanics
- change physics constants that affect gameplay

Do NOT update memory docs for:

- bug fixes
- small refactors
- one-off implementation details
- normal feature work that follows existing patterns
- adding new levels (unless level structure changes)

### Where to record changes

- Architecture decisions: `docs/01-architecture/architecture.md` or `docs/06-adr/` (create ADR files)
- Development patterns: `docs/02-development/README.md`
- Game mechanics: `docs/05-product/mechanics.md`
- Level design: `docs/05-product/levels.md`
- Repo facts + rules summary: This file (`COPILOTS.md`)

### How to update memory (format)

- Keep entries concise
- Use MUST/MUST NOT language for rules
- Include file paths for enforcement locations when relevant
- For ADRs, follow the format: `000X-short-description.md`

## 9) Output expectations for every coding task

For each task you perform:

- Make the smallest change set that solves the task
- Do not introduce new dependencies unless explicitly required
- If you touch architecture/tooling, ensure memory docs are updated accordingly
- Ensure the game can still run in a browser after changes (open `index.html`)
- Test the change manually in at least one browser
- Ensure no JavaScript errors in console
- Ensure Python code execution still works
- Remove any debug `console.log()` statements before completing

## 10) Standard workflow (no commands needed)

This project requires no build commands. To work:

1. Open `index.html` in a web browser
2. Wait for Pyodide to load (~5-10 seconds on first load)
3. Test your changes
4. Use browser DevTools for debugging

### File editing

- Edit files directly in your text editor/IDE
- Refresh browser to see changes
- No compilation or build step required

## 11) Domain-specific rules

### Educational focus

- Code MUST be readable and educational
- Comments SHOULD explain complex logic
- Function names MUST be clear and descriptive
- The game is for kids learning Python, so keep it simple and fun

### Level progression

- Levels MUST progress from simple to complex
- Each level SHOULD teach a specific concept
- Hints SHOULD guide without giving away the solution
- Instructions MUST be clear and age-appropriate

### Python API design

- Functions MUST be intuitive for beginners
- Function names MUST match their purpose clearly
- Docstrings MUST explain what each function does
- Functions SHOULD provide helpful error messages

### Game performance

- Target 60fps for smooth gameplay
- Optimize collision detection
- Only redraw when necessary
- Handle large code blocks efficiently (chunk execution)

### Browser compatibility

- MUST work in modern browsers (Chrome, Firefox, Safari, Edge)
- MUST handle Pyodide loading gracefully
- MUST provide user feedback during loading
- MUST work without internet after initial Pyodide load (if cached)

---

End of instructions. Follow them strictly.

