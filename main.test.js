// Unit tests for main.js - Main application logic

const fs = require('fs');
const path = require('path');

// Set up DOM environment
document.body.innerHTML = `
    <select id="levelSelect"></select>
    <button id="runBtn">Run</button>
    <button id="resetBtn">Reset</button>
    <button id="replayBtn">Replay</button>
    <button id="hintBtn">Hint</button>
    <textarea id="codeEditor"></textarea>
    <div id="instructions"></div>
    <div id="gameMessage"></div>
    <span id="carrotCount">0</span>
    <span id="moveCount">0</span>
    <span id="timeCount">0</span>
    <canvas id="gameCanvas" width="800" height="600"></canvas>
`;

// Mock loadPyodide
global.loadPyodide = jest.fn(() => Promise.resolve({
    globals: { set: jest.fn() },
    runPython: jest.fn()
}));

// Read and evaluate the modules in order
const gameCode = fs.readFileSync(path.join(__dirname, 'game.js'), 'utf8');
eval(gameCode);
// After eval, BunnyHopGame should be in the current scope
// Store it in global for main.js to access
if (typeof BunnyHopGame !== 'undefined') {
    global.BunnyHopGame = BunnyHopGame;
}

const levelsCode = fs.readFileSync(path.join(__dirname, 'levels.js'), 'utf8');
eval(levelsCode);
// After eval, levels should be in the current scope
if (typeof levels !== 'undefined') {
    global.levels = levels;
}

const mainCode = fs.readFileSync(path.join(__dirname, 'main.js'), 'utf8');
// Modify main code to use global.BunnyHopGame and global.levels
// Replace references to BunnyHopGame and levels with global versions
const modifiedMainCode = mainCode
    .replace(/new BunnyHopGame\(/g, 'new global.BunnyHopGame(')
    .replace(/\blevels\b/g, 'global.levels');
eval(modifiedMainCode);

// Functions should now be available in the current scope
// Access them directly (they're function declarations, so they're hoisted)
const populateLevelSelector = eval('populateLevelSelector');
const loadLevel = eval('loadLevel');
const updateStats = eval('updateStats');
const showMessage = eval('showMessage');
const showHint = eval('showHint');
const resetGame = eval('resetGame');
const getDefaultCode = eval('getDefaultCode');
const setupPythonEnvironment = eval('setupPythonEnvironment');
const setupEventListeners = eval('setupEventListeners');
let game = eval('game');
let currentLevel = eval('currentLevel');

// Make BunnyHopGame available for tests (it should be from the eval or global)
const BunnyHopGameForTests = typeof BunnyHopGame !== 'undefined' ? BunnyHopGame : (global.BunnyHopGame || eval('BunnyHopGame'));

describe('Main Application Functions', () => {
    let canvas;

    beforeEach(() => {
        canvas = document.getElementById('gameCanvas');
        // Reset game if it exists
        if (typeof game !== 'undefined') {
            game = undefined;
        }
        // Reset currentLevel
        if (typeof currentLevel !== 'undefined') {
            currentLevel = 1;
        }
        // Reset isExecuting
        if (typeof isExecuting !== 'undefined') {
            isExecuting = false;
        }
    });

    describe('populateLevelSelector', () => {
        test('should populate level selector with all levels', () => {
            populateLevelSelector();
            const select = document.getElementById('levelSelect');
            const options = Array.from(select.options);

            expect(options.length).toBeGreaterThan(0);
            expect(options[0].value).toBe('1');
            expect(options[0].textContent).toContain('Level 1');
        });

        test('should sort levels by number', () => {
            populateLevelSelector();
            const select = document.getElementById('levelSelect');
            const options = Array.from(select.options);
            const values = options.map(opt => parseInt(opt.value));

            for (let i = 1; i < values.length; i++) {
                expect(values[i]).toBeGreaterThan(values[i - 1]);
            }
        });
    });

    describe('loadLevel', () => {
        beforeEach(() => {
            // Initialize game
            game = new BunnyHopGameForTests(canvas);
        });

        test('should load level data into game', () => {
            loadLevel(1);

            expect(currentLevel).toBe(1);
            expect(game.bunny.x).toBe(50);
            expect(game.bunny.y).toBe(400);
        });

        test('should update code editor with level startCode or hint', () => {
            loadLevel(1);
            const editor = document.getElementById('codeEditor');

            expect(editor.value).toBeTruthy();
        });

        test('should update instructions panel', () => {
            loadLevel(1);
            const instructions = document.getElementById('instructions');

            expect(instructions.innerHTML).toBeTruthy();
            expect(instructions.innerHTML).toContain('Welcome');
        });

        test('should update level selector value', () => {
            loadLevel(2);
            const select = document.getElementById('levelSelect');

            expect(select.value).toBe('2');
        });

        test('should reset stats display', () => {
            loadLevel(1);
            const carrotCount = document.getElementById('carrotCount');
            const moveCount = document.getElementById('moveCount');

            expect(carrotCount.textContent).toBe('0');
            expect(moveCount.textContent).toBe('0');
        });

        test('should clear game message', () => {
            const messageEl = document.getElementById('gameMessage');
            messageEl.textContent = 'Test message';
            messageEl.className = 'error';

            loadLevel(1);

            expect(messageEl.textContent).toBe('');
            expect(messageEl.className).toBe('game-message');
        });

        test('should handle missing level gracefully', () => {
            const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

            loadLevel(999);

            expect(alertSpy).toHaveBeenCalledWith('Level not found!');
            alertSpy.mockRestore();
        });
    });

    describe('updateStats', () => {
        beforeEach(() => {
            game = new BunnyHopGameForTests(canvas);
        });

        test('should update stats display with current game values', () => {
            game.carrotCount = 5;
            game.moveCount = 10;
            game.currentTime = 15;

            updateStats();

            expect(document.getElementById('carrotCount').textContent).toBe('5');
            expect(document.getElementById('moveCount').textContent).toBe('10');
            expect(document.getElementById('timeCount').textContent).toBe('15');
        });
    });

    describe('showMessage', () => {
        test('should display message in game message element', () => {
            showMessage('Test message', 'success');

            const messageEl = document.getElementById('gameMessage');
            expect(messageEl.textContent).toBe('Test message');
            expect(messageEl.className).toContain('success');
        });

        test('should default to info type', () => {
            showMessage('Test message');

            const messageEl = document.getElementById('gameMessage');
            expect(messageEl.className).toContain('info');
        });
    });

    describe('showHint', () => {
        beforeEach(() => {
            game = new BunnyHopGameForTests(canvas);
            currentLevel = 1;
        });

        test('should load hint into code editor', () => {
            showHint();

            const editor = document.getElementById('codeEditor');
            expect(editor.value).toBeTruthy();
        });

        test('should show message when hint is loaded', () => {
            showHint();

            const messageEl = document.getElementById('gameMessage');
            expect(messageEl.textContent).toContain('Hint loaded');
        });

        test('should handle level without hint', () => {
            // Create a level without hint
            const originalLevel = levels[1];
            levels[1] = { ...originalLevel, hint: undefined };
            currentLevel = 1;

            showHint();

            const messageEl = document.getElementById('gameMessage');
            expect(messageEl.textContent).toContain('No hint available');

            // Restore original level
            levels[1] = originalLevel;
        });
    });

    describe('resetGame', () => {
        beforeEach(() => {
            game = new BunnyHopGameForTests(canvas);
            game.isRunning = true;
            game.carrotCount = 5;
        });

        test('should stop and reset game', () => {
            resetGame();

            expect(game.isRunning).toBe(false);
            expect(game.carrotCount).toBe(0);
        });

        test('should update stats display', () => {
            resetGame();

            expect(document.getElementById('carrotCount').textContent).toBe('0');
        });

        test('should clear game message', () => {
            const messageEl = document.getElementById('gameMessage');
            messageEl.textContent = 'Test';
            messageEl.className = 'error';

            resetGame();

            expect(messageEl.textContent).toBe('');
            expect(messageEl.className).toBe('game-message');
        });
    });

    describe('getDefaultCode', () => {
        test('should return default code for level 1', () => {
            const code = getDefaultCode(1);

            expect(code).toContain('move_right');
        });

        test('should return default code for multiple levels', () => {
            for (let i = 1; i <= 20; i++) {
                const code = getDefaultCode(i);
                expect(typeof code).toBe('string');
                expect(code.length).toBeGreaterThan(0);
            }
        });

        test('should return default template for unknown level', () => {
            const code = getDefaultCode(999);

            expect(code).toContain('Write your code here');
        });
    });

    describe('setupPythonEnvironment', () => {
        beforeEach(() => {
            // Mock pyodide
            global.pyodide = {
                globals: {
                    set: jest.fn()
                },
                runPython: jest.fn()
            };
        });

        test('should set up Python environment', () => {
            setupPythonEnvironment();

            expect(pyodide.globals.set).toHaveBeenCalledWith('game', expect.any(Object));
            expect(pyodide.runPython).toHaveBeenCalled();
        });

        test('should define Python functions', () => {
            setupPythonEnvironment();

            const pythonCode = pyodide.runPython.mock.calls[0][0];
            expect(pythonCode).toContain('def move_right');
            expect(pythonCode).toContain('def move_left');
            expect(pythonCode).toContain('def jump');
            expect(pythonCode).toContain('def collect');
            expect(pythonCode).toContain('def wait');
            expect(pythonCode).toContain('def sleep');
            expect(pythonCode).toContain('def get_position');
            expect(pythonCode).toContain('def get_carrot_count');
            expect(pythonCode).toContain('def is_on_ground');
            expect(pythonCode).toContain('def can_jump');
        });
    });

    describe('Event Listeners Setup', () => {
        beforeEach(() => {
            // BunnyHopGame should be available from game.js eval
            game = new BunnyHopGameForTests(canvas);
        });

        test('should set up level selector event listener', () => {
            const select = document.getElementById('levelSelect');
            const changeEvent = new Event('change');
            select.value = '2';

            setupEventListeners();
            select.dispatchEvent(changeEvent);

            expect(currentLevel).toBe(2);
        });

        test('should set up reset button event listener', () => {
            game.isRunning = true;
            const resetBtn = document.getElementById('resetBtn');
            const clickEvent = new Event('click');

            setupEventListeners();
            resetBtn.dispatchEvent(clickEvent);

            expect(game.isRunning).toBe(false);
        });

        test('should set up replay button event listener', () => {
            currentLevel = 2;
            const replayBtn = document.getElementById('replayBtn');
            const clickEvent = new Event('click');
            const loadLevelSpy = jest.spyOn(global, 'loadLevel');

            setupEventListeners();
            replayBtn.dispatchEvent(clickEvent);

            expect(loadLevelSpy).toHaveBeenCalledWith(2);
            loadLevelSpy.mockRestore();
        });

        test('should set up hint button event listener', () => {
            const hintBtn = document.getElementById('hintBtn');
            const clickEvent = new Event('click');
            const showHintSpy = jest.spyOn(global, 'showHint');

            setupEventListeners();
            hintBtn.dispatchEvent(clickEvent);

            expect(showHintSpy).toHaveBeenCalled();
            showHintSpy.mockRestore();
        });
    });
});

