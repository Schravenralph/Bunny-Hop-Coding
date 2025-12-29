// Main application logic for Bunny Hop Coding Adventure

let game;
let pyodide;
let currentLevel = 1;
let isExecuting = false;

// Expose game to window for testing
window.game = null;

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', async () => {
    const canvas = document.getElementById('gameCanvas');
    game = new BunnyHopGame(canvas);
    window.game = game;
    
    // Populate level selector
    populateLevelSelector();
    
    // Initialize Pyodide
    try {
        pyodide = await loadPyodide();
        // Expose to window for testing and debugging
        window.pyodide = pyodide;
        console.log('Pyodide loaded successfully');
    } catch (error) {
        console.error('Failed to load Pyodide:', error);
        alert('Failed to load Python interpreter. Please refresh the page.');
        return;
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Load first level
    loadLevel(1);
});

function populateLevelSelector() {
    const select = document.getElementById('levelSelect');
    select.innerHTML = '';
    
    // Sort levels by number
    const levelNumbers = Object.keys(levels).map(Number).sort((a, b) => a - b);
    
    levelNumbers.forEach(levelNum => {
        const level = levels[levelNum];
        const option = document.createElement('option');
        option.value = levelNum;
        option.textContent = `Level ${levelNum}: ${level.name}`;
        select.appendChild(option);
    });
}

function setupEventListeners() {
    // Level selector
    document.getElementById('levelSelect').addEventListener('change', (e) => {
        const level = parseInt(e.target.value);
        loadLevel(level);
    });
    
    // Run button
    document.getElementById('runBtn').addEventListener('click', () => {
        runCode();
    });
    
    // Reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
        resetGame();
    });
    
    // Replay button
    document.getElementById('replayBtn').addEventListener('click', () => {
        loadLevel(currentLevel);
    });
    
    // Hint button
    document.getElementById('hintBtn').addEventListener('click', () => {
        showHint();
    });
}

function loadLevel(levelNumber) {
    currentLevel = levelNumber;
    const level = levels[levelNumber];
    
    if (!level) {
        alert('Level not found!');
        return;
    }
    
    // Update UI
    // Use startCode if available, otherwise use default template
    const defaultCode = getDefaultCode(levelNumber);
    document.getElementById('codeEditor').value = level.startCode || level.hint || defaultCode;
    // Support both 'instructions' (plural) and 'instruction' (singular) for backwards compatibility
    const instructionText = level.instructions || (level.instruction ? `<p><strong>${level.instruction}</strong></p><p>Level: ${level.name}</p>` : `<p>Level: ${level.name}</p>`);
    document.getElementById('instructions').innerHTML = instructionText;
    
    // Update level selector
    document.getElementById('levelSelect').value = levelNumber;
    
    // Load level into game
    game.loadLevel(level);
    game.draw();
    
    // Reset stats
    updateStats();
    
    // Clear message
    const messageEl = document.getElementById('gameMessage');
    messageEl.textContent = '';
    messageEl.className = 'game-message';
}

async function runCode() {
    if (isExecuting) {
        return;
    }
    
    isExecuting = true;
    const code = document.getElementById('codeEditor').value;
    const runBtn = document.getElementById('runBtn');
    runBtn.disabled = true;
    runBtn.textContent = '⏳ Running...';
    
    // Reset game state
    game.reset();
    game.start();
    
    // Set up Python environment
    setupPythonEnvironment();
    
    try {
        // Execute Python code
        await executePythonCode(code);
    } catch (error) {
        console.error('Error executing code:', error);
        showMessage('Error: ' + error.message, 'error');
        game.stop();
    } finally {
        isExecuting = false;
        runBtn.disabled = false;
        runBtn.textContent = '▶️ Run Code';
    }
}

function setupPythonEnvironment() {
    // Expose game object to Python
    pyodide.globals.set('game', game);
    
    // Initialize wait/sleep promise variables (used by _wait_js and _sleep_js functions)
    pyodide.globals.set('_waitPromise', null);
    pyodide.globals.set('_sleepPromise', null);
    
    // Set up Python functions that call JavaScript
    pyodide.runPython(`
# game is available in global namespace via pyodide.globals.set()

def move_right(steps=1):
    """Move the bunny to the right"""
    game.moveRight(steps)

def move_left(steps=1):
    """Move the bunny to the left"""
    game.moveLeft(steps)

def jump():
    """Make the bunny jump"""
    game.jump()

def collect():
    """Collect item at current position"""
    game.collect()

def wait(seconds):
    """Wait for specified seconds - this will be handled by JavaScript"""
    import js
    js._waitPromise = float(seconds)

def sleep(milliseconds):
    """Sleep for specified milliseconds (converted to seconds) - this will be handled by JavaScript"""
    import js
    js._sleepPromise = float(milliseconds) / 1000.0

def get_position():
    """Get the current bunny position (x, y)"""
    return [game.bunny.x, game.bunny.y]

def get_carrot_count():
    """Get the number of items collected"""
    return game.carrotCount

def is_on_ground():
    """Check if the bunny is on the ground"""
    return game.bunny.onGround

def can_jump():
    """Check if the bunny can jump"""
    return game.bunny.onGround and not game.bunny.jumping
`);
}

async function executePythonCode(code) {
    // Preprocess code to handle wait()/sleep() calls and comment out "Try:" lines
    let processedCode = code;
    
    // Comment out lines starting with "Try:" or "Try." (with period or colon)
    processedCode = processedCode.split('\n').map(line => {
        const trimmed = line.trim();
        // Match "Try:" or "Try." (case insensitive, with period or colon)
        if (/^[Tt]ry[.:]\s*/.test(trimmed)) {
            return '#' + line;
        }
        return line;
    }).join('\n');
    
    // Execute the entire code block properly
    // Handle wait() and sleep() calls by processing code in chunks at top level
    try {
        // For simple sequential code, split by wait() calls at the top level only
        // This preserves loops and conditionals while allowing waits between statements
        const MAX_WAIT_TIME = 10.0; // Cap wait time to prevent hangs
        
        // Simple approach: split code by top-level wait() calls only
        const codeChunks = [];
        const lines = processedCode.split('\n');
        let currentChunk = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();
            const leadingSpaces = line.length - line.trimStart().length;
            
            // Check for wait() or sleep() at top level (no leading spaces)
            const waitMatch = trimmed.match(/wait\s*\(\s*([0-9.]+)\s*\)/);
            const sleepMatch = trimmed.match(/sleep\s*\(\s*([0-9.]+)\s*\)/);
            
            if ((waitMatch || sleepMatch) && leadingSpaces === 0) {
                // Top-level wait/sleep - split here
                if (currentChunk.length > 0) {
                    codeChunks.push({ type: 'code', content: currentChunk.join('\n') });
                    currentChunk = [];
                }
                const waitTime = waitMatch ? 
                    Math.min(parseFloat(waitMatch[1]), MAX_WAIT_TIME) : 
                    Math.min(parseFloat(sleepMatch[1]) / 1000.0, MAX_WAIT_TIME);
                codeChunks.push({ type: 'wait', seconds: waitTime });
            } else {
                currentChunk.push(line);
            }
        }
        
        if (currentChunk.length > 0) {
            codeChunks.push({ type: 'code', content: currentChunk.join('\n') });
        }
        
        // If no waits were found, execute all code at once
        if (codeChunks.length === 1 && codeChunks[0].type === 'code') {
            pyodide.runPython(codeChunks[0].content);
        } else {
            // Execute chunks with waits
            for (const chunk of codeChunks) {
                if (chunk.type === 'wait') {
                    await new Promise(resolve => setTimeout(resolve, chunk.seconds * 1000));
                } else if (chunk.type === 'code' && chunk.content.trim()) {
                    try {
                        pyodide.runPython(chunk.content);
                        // Small delay to allow game to update
                        await new Promise(resolve => setTimeout(resolve, 50));
                    } catch (error) {
                        throw new Error(error.toString());
                    }
                }
            }
        }
        
    } catch (error) {
        throw new Error(error.toString());
    }
    
    // Process actions with timing
    await processActionsWithTiming();
    
    // Check for level completion
    setTimeout(() => {
        if (game.levelComplete) {
            showMessage('🎉 Level Complete! 🎉', 'success');
            game.stop();
            
            // Auto-advance to next level after 2 seconds
            setTimeout(() => {
                const nextLevel = currentLevel + 1;
                if (levels[nextLevel]) {
                    if (confirm('Great job! Move to next level?')) {
                        loadLevel(nextLevel);
                    }
                } else {
                    showMessage('🎊 Congratulations! You completed all levels! 🎊', 'success');
                }
            }, 2000);
        } else {
            // Check if bunny reached goal but didn't collect required carrots
            const goal = game.goal;
            if (goal && 
                game.bunny.x + game.bunny.width > goal.x &&
                game.bunny.x < goal.x + goal.width &&
                game.bunny.y + game.bunny.height > goal.y &&
                game.bunny.y < goal.y + goal.height) {
                const level = levels[currentLevel];
                const requiredCarrots = (level.carrots || []).length + (level.stars || []).length + (level.coins || []).length;
                if (requiredCarrots > 0 && game.carrotCount < requiredCarrots) {
                    showMessage(`Collect all ${requiredCarrots} items first!`, 'error');
                }
            }
        }
    }, 100);
}

async function processActionsWithTiming() {
    // Process the code execution and handle timing
    // Since Python runs synchronously, we need to handle timing in JavaScript
    
    const maxExecutionTime = 30000; // 30 seconds max
    const startTime = Date.now();
    let stationaryCount = 0;
    const stationaryThreshold = 30; // Number of frames bunny must be stationary
    
    while (Date.now() - startTime < maxExecutionTime) {
        game.update();
        game.draw();
        updateStats();
        
        // Check for completion
        if (game.levelComplete) {
            break;
        }
        
        // Small delay for animation (60fps)
        await new Promise(resolve => setTimeout(resolve, 16));
        
        // Check if bunny stopped moving and is on ground (end of code execution)
        const isStationary = Math.abs(game.bunny.vx) < 0.1 && 
                            Math.abs(game.bunny.vy) < 0.1 && 
                            game.bunny.onGround && 
                            !game.bunny.jumping;
        
        if (isStationary) {
            stationaryCount++;
            if (stationaryCount >= stationaryThreshold) {
                // Bunny has been stationary for a while, code execution is likely complete
                // Give it a moment to see if level completes
                await new Promise(resolve => setTimeout(resolve, 500));
                break;
            }
        } else {
            // Reset counter if bunny starts moving again
            stationaryCount = 0;
        }
    }
    
    // If we hit max time, stop the game
    if (Date.now() - startTime >= maxExecutionTime) {
        game.stop();
        showMessage('Code execution timed out (30 seconds max)', 'error');
    }
}

function resetGame() {
    game.stop();
    game.reset();
    updateStats();
    const messageEl = document.getElementById('gameMessage');
    messageEl.textContent = '';
    messageEl.className = 'game-message';
}

function updateStats() {
    document.getElementById('carrotCount').textContent = game.carrotCount;
    document.getElementById('moveCount').textContent = game.moveCount;
    document.getElementById('timeCount').textContent = game.currentTime;
}

function showMessage(message, type = 'info') {
    const messageEl = document.getElementById('gameMessage');
    messageEl.textContent = message;
    messageEl.className = `game-message ${type}`;
}

function showHint() {
    const level = levels[currentLevel];
    if (!level || !level.hint) {
        showMessage('No hint available for this level.', 'info');
        return;
    }
    // Comment out "Try:" if present in hint
    let hintCode = level.hint;
    hintCode = hintCode.split('\n').map(line => {
        const trimmed = line.trim();
        // Match "Try:" or "Try." (case insensitive, with or without period/colon)
        if (/^[Tt]ry[.:]\s*/.test(trimmed)) {
            return '#' + line;
        }
        return line;
    }).join('\n');
    document.getElementById('codeEditor').value = hintCode;
    showMessage('Hint loaded! Modify it to solve the level.', 'info');
}

// Get default code template for level
function getDefaultCode(levelNum) {
    const templates = {
        1: "# Move the bunny to the flag!\nmove_right(20)",
        2: "# Jump over the gap!\nmove_right(10)\njump()\nmove_right(10)",
        3: "# Collect all carrots!\nmove_right(5)\ncollect()\nmove_right(5)\ncollect()\nmove_right(5)\ncollect()\nmove_right(5)",
        4: "# Jump over the spikes!\nmove_right(8)\njump()\nwait(0.5)\nmove_right(8)\njump()\nwait(0.5)\nmove_right(10)",
        5: "# Jump to the platforms!\nmove_right(8)\njump()\nwait(0.3)\nmove_right(8)\njump()\nwait(0.3)\nmove_right(8)\njump()\nwait(0.3)\nmove_right(5)",
        6: "# Go as fast as you can!\nmove_right(25)",
        7: "# Navigate the maze!\nmove_right(6)\njump()\nwait(0.3)\nmove_right(8)\njump()\nwait(0.3)\nmove_right(6)\njump()\nwait(0.3)\nmove_right(5)",
        8: "# Ultimate challenge!\nmove_right(5)\ncollect()\nmove_right(5)\njump()\nwait(0.3)\nmove_right(3)\ncollect()\njump()\nwait(0.3)\nmove_right(8)\ncollect()\nmove_right(5)",
        9: "# Reach the highest platform!\nmove_right(5)\njump()\nwait(0.8)\nmove_right(5)\njump()\nwait(0.8)\nmove_right(5)\njump()\nwait(0.8)\nmove_right(5)\njump()\nwait(0.8)\nmove_right(3)",
        10: "# Collect all 6 carrots!\nmove_right(3)\ncollect()\nmove_right(5)\njump()\nwait(0.5)\ncollect()\nmove_right(5)\njump()\nwait(0.5)\ncollect()\nmove_right(5)\ncollect()\nmove_right(3)\ncollect()\nmove_right(3)\ncollect()\nmove_right(3)",
        11: "# Jump over all spikes!\nmove_right(5)\njump()\nwait(0.6)\nmove_right(5)\njump()\nwait(0.6)\nmove_right(5)\njump()\nwait(0.6)\nmove_right(5)\njump()\nwait(0.6)\nmove_right(3)",
        12: "# Follow the zigzag path!\nmove_right(5)\njump()\nwait(0.5)\nmove_right(5)\njump()\nwait(0.5)\nmove_left(5)\njump()\nwait(0.5)\nmove_right(5)\njump()\nwait(0.5)\nmove_right(5)\njump()\nwait(0.5)\nmove_right(3)",
        13: "# Master challenge - plan carefully!\nmove_right(4)\ncollect()\njump()\nwait(0.5)\nmove_right(3)\ncollect()\njump()\nwait(0.5)\nmove_right(3)\ncollect()\njump()\nwait(0.5)\nmove_right(4)\ncollect()\nmove_right(3)",
        14: "# Precise parkour moves!\nmove_right(3)\njump()\nwait(0.5)\nmove_right(3)\njump()\nwait(0.5)\nmove_right(3)\njump()\nwait(0.5)\nmove_right(3)\njump()\nwait(0.5)\nmove_right(3)\njump()\nwait(0.5)\nmove_right(3)",
        15: "# Find all carrots in the maze!\nmove_right(4)\ncollect()\njump()\nwait(0.5)\ncollect()\nmove_right(4)\ncollect()\njump()\nwait(0.5)\ncollect()\nmove_right(4)\ncollect()\nmove_left(15)\ncollect()\nmove_right(20)",
        16: "# Practice moving the bunny!\nmove_right(10)\nmove_right(10)",
        17: "# Practice jumping!\nmove_right(8)\njump()\nwait(0.5)\nmove_right(8)",
        18: "# Practice collecting!\nmove_right(6)\ncollect()\nmove_right(6)\ncollect()\nmove_right(6)\ncollect()\nmove_right(4)",
        19: "# Practice avoiding obstacles!\nmove_right(6)\njump()\nwait(0.3)\nmove_right(6)\njump()\nwait(0.3)\nmove_right(8)",
        20: "# Practice platform hopping!\nmove_right(6)\njump()\nwait(0.5)\nmove_right(6)\njump()\nwait(0.5)\nmove_right(6)\njump()\nwait(0.5)\nmove_right(4)"
    };
    return templates[levelNum] || "# Write your code here!\n";
}
