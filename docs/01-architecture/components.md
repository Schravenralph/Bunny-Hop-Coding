# Component Documentation

## Overview

This document provides detailed documentation of all components in the Bunny Hop Coding Adventure system.

## Component Hierarchy

```
index.html (Root)
├── Header
│   ├── Title
│   ├── Level Selector
│   └── Replay Button
├── Game Container
│   ├── Code Panel
│   │   ├── Code Header
│   │   ├── Code Editor
│   │   └── Code Help
│   └── Game Panel
│       ├── Game Stats
│       ├── Game Canvas
│       └── Game Message
└── Instructions Panel
    └── Instructions Content
```

## Core Components

### 1. BunnyHopGame Class (`game.js`)

The main game engine class that handles all game logic, physics, and rendering.

#### Properties

**Game State**
- `canvas`: HTMLCanvasElement - The canvas element
- `ctx`: CanvasRenderingContext2D - 2D rendering context
- `width`: number - Canvas width (800)
- `height`: number - Canvas height (600)
- `isRunning`: boolean - Whether game loop is active
- `levelComplete`: boolean - Whether level is completed
- `animationId`: number - requestAnimationFrame ID

**Bunny (Player)**
- `bunny`: object
  - `x`, `y`: number - Position
  - `width`, `height`: number - Dimensions (40x50)
  - `vx`, `vy`: number - Velocity
  - `onGround`: boolean - Ground collision state
  - `jumping`: boolean - Jump state
  - `color`: string - Color (#FF69B4)

**Game Elements**
- `platforms`: Array - Static platforms
- `movingPlatforms`: Array - Dynamic platforms
- `carrots`: Array - Carrot collectibles
- `stars`: Array - Star collectibles
- `coins`: Array - Coin collectibles
- `obstacles`: Array - Hazard objects
- `goal`: object - Level completion target

**Physics**
- `gravity`: number - Gravity constant (0.8)
- `groundY`: number - Ground level Y coordinate

**Statistics**
- `carrotCount`: number - Collected items count
- `moveCount`: number - Total moves executed
- `currentTime`: number - Elapsed time in seconds
- `startTime`: number - Game start timestamp

**Game State (for reset)**
- `gameState`: object
  - `bunnyX`, `bunnyY`: number - Initial position
  - `collectedCarrots`: Array - Collected item IDs
  - `moveHistory`: Array - Move action history

#### Methods

**Lifecycle**
- `loadLevel(levelData)` - Initialize level
- `start()` - Start game loop
- `stop()` - Stop game loop
- `reset()` - Reset to initial state
- `animate()` - Main animation loop

**Update Logic**
- `update()` - Update physics and game state
- `checkCollisions()` - Handle all collisions

**Rendering**
- `draw()` - Main render method
- `drawBunny()` - Render player character
- `drawPlatforms()` - Render all platforms
- `drawCarrots()` - Render carrot collectibles
- `drawStars()` - Render star collectibles
- `drawCoins()` - Render coin collectibles
- `drawObstacles()` - Render hazard objects
- `drawGoal()` - Render completion flag

**Player Actions (Python API)**
- `moveRight(steps)` - Move bunny right
- `moveLeft(steps)` - Move bunny left
- `jump()` - Make bunny jump
- `wait(seconds)` - Wait (handled by main.js)
- `collect()` - Collect nearby items

### 2. Main Application (`main.js`)

The application controller that orchestrates all components.

#### Global Variables
- `game`: BunnyHopGame instance
- `pyodide`: Pyodide runtime instance
- `currentLevel`: number - Current level number
- `isExecuting`: boolean - Code execution state

#### Functions

**Initialization**
- `DOMContentLoaded` event handler - Initialize app
- `populateLevelSelector()` - Populate level dropdown
- `setupEventListeners()` - Attach event handlers

**Level Management**
- `loadLevel(levelNumber)` - Load and initialize level
  - Updates UI
  - Loads level data into game
  - Resets game state
  - Updates instructions

**Code Execution**
- `runCode()` - Execute user Python code
  - Validates execution state
  - Resets game
  - Sets up Python environment
  - Executes code
  - Handles errors

- `setupPythonEnvironment()` - Configure Python API
  - Expose game object to Python
  - Define Python functions
  - Set up async variables

- `executePythonCode(code)` - Process and run code
  - Preprocess code (handle "Try:" lines)
  - Split into chunks (handle wait/sleep)
  - Execute chunks sequentially
  - Process actions with timing

- `processActionsWithTiming()` - Game animation loop
  - Continuous update/draw cycle
  - Check for completion
  - Handle stationary detection
  - Timeout protection (30s max)

**UI Management**
- `updateStats()` - Update statistics display
- `showMessage(message, type)` - Display user messages
- `showHint()` - Load hint into editor
- `resetGame()` - Reset game state
- `getDefaultCode(levelNum)` - Get default code template

### 3. Level Definitions (`levels.js`)

Level data structure and definitions.

#### Structure
```javascript
const levels = {
  1: {
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
    goal: object,
    hint: string,
    startCode?: string,
    requiredCarrots?: number
  },
  // ... more levels
}
```

#### Level Properties

**Basic Info**
- `name`: string - Level name
- `instructions`: string - HTML instructions
- `hint`: string - Hint code (optional)
- `startCode`: string - Initial code (optional)

**Positioning**
- `startX`, `startY`: number - Bunny start position
- `groundY`: number - Ground level Y coordinate

**Game Elements**
- `platforms`: Array of platform objects
  - `x`, `y`: number - Position
  - `width`, `height`: number - Dimensions
  - `moving`: boolean - Is moving platform
  - `moveSpeed`: number - Movement speed
  - `moveRange`: number - Movement range
  - `moveX`: boolean - Move in X direction
  - `moveY`: boolean - Move in Y direction

- `carrots`, `stars`, `coins`: Array of collectibles
  - `id`: string - Unique identifier
  - `x`, `y`: number - Position

- `obstacles`: Array of hazard objects
  - `x`, `y`: number - Position
  - `width`, `height`: number - Dimensions

- `goal`: object - Completion target
  - `x`, `y`: number - Position
  - `width`, `height`: number - Dimensions

**Requirements**
- `requiredCarrots`: number - Minimum collectibles needed

### 4. HTML Structure (`index.html`)

#### Sections

**Header**
- Title: "🐰 Bunny Hop Coding Adventure 🐰"
- Level selector dropdown
- Replay button

**Game Container** (Grid Layout)
- Code Panel (Left)
  - Code header with title and buttons
  - Code editor textarea
  - Code help section with function list

- Game Panel (Right)
  - Game stats (carrots, moves, time)
  - Game canvas (800x600)
  - Game message display

**Instructions Panel**
- Level instructions HTML content

#### Scripts Loaded
1. Pyodide CDN (v0.24.1)
2. `game.js` - Game engine
3. `levels.js` - Level data
4. `main.js` - Application logic

### 5. Styling (`style.css`)

#### Key Styles

**Layout**
- Responsive grid (2 columns → 1 column on mobile)
- Flexbox for component alignment
- Max-width container (1600px)

**Color Scheme**
- Primary: #667eea (purple-blue)
- Secondary: #764ba2 (purple)
- Accent: #ffd700 (gold for hints)
- Background: Gradient (purple to blue)

**Components**
- Rounded corners (15px border-radius)
- Box shadows for depth
- Smooth transitions
- Hover effects on buttons

**Canvas**
- Border: 3px solid #667eea
- Background: #87ceeb (sky blue)
- Centered with max-width

## Component Interactions

### Code Execution Flow
```
User clicks "Run Code"
  → main.js: runCode()
    → game.reset()
    → game.start()
    → setupPythonEnvironment()
    → executePythonCode()
      → Process code chunks
      → pyodide.runPython() for each chunk
        → Python functions call game methods
          → game.update() / game.draw() loop
```

### Level Loading Flow
```
User selects level
  → main.js: loadLevel()
    → Update UI (editor, instructions)
    → game.loadLevel(levelData)
      → Initialize game elements
      → Reset game state
    → game.draw() (initial render)
```

### Collision Detection Flow
```
game.update()
  → checkCollisions()
    → Ground collision check
    → Platform collision check
    → Collectible collision check
    → Obstacle collision check
    → Goal collision check
```

## Data Structures

### Platform Object
```javascript
{
  x: number,
  y: number,
  width: number,
  height: number,
  moving?: boolean,
  moveSpeed?: number,
  moveRange?: number,
  moveX?: boolean,
  moveY?: boolean,
  originalX?: number,
  originalY?: number,
  directionX?: number,
  directionY?: number
}
```

### Collectible Object
```javascript
{
  id: string,
  x: number,
  y: number
}
```

### Game State Object
```javascript
{
  bunnyX: number,
  bunnyY: number,
  collectedCarrots: Array<string>,
  moveHistory: Array<{action: string, ...}>
}
```

---

*Last Updated*: 2025-01-30

