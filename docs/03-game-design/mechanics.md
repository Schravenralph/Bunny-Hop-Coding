# Game Mechanics Documentation

## Overview

This document describes the game mechanics, physics, and rules of the Bunny Hop Coding Adventure.

## Physics System

### Gravity
- **Gravity Constant**: 0.8 pixels per frame²
- **Applied To**: Bunny when not on ground
- **Effect**: Pulls bunny downward continuously

### Movement
- **Horizontal Speed**: 3 pixels per step
- **Friction**: 0.9 (10% reduction per frame)
- **Direction**: Left or right
- **Air Control**: Bunny can move while in air

### Jumping
- **Jump Velocity**: -15 pixels per frame (upward)
- **Jump Condition**: Must be on ground and not already jumping
- **Jump Height**: Approximately 150-200 pixels
- **Jump Duration**: ~1-2 seconds depending on platform height

### Collision Detection

#### Ground Collision
- **Detection**: Bunny's bottom edge touches ground level
- **Effect**: Stops vertical velocity, sets `onGround = true`
- **Condition**: Only applies when `vy >= 0` (falling)

#### Platform Collision
- **Detection**: Bunny's bottom edge within 20 pixels of platform top
- **Effect**: Stops vertical velocity, positions bunny on platform
- **Condition**: Only applies when `vy >= 0` (falling)
- **Types**: Static platforms and moving platforms

#### Moving Platform Behavior
- **Movement**: Horizontal (default) or vertical (if `moveY = true`)
- **Speed**: Configurable via `moveSpeed` (default: 1.5)
- **Range**: Configurable via `moveRange` (default: 100 pixels)
- **Bunny Movement**: Bunny moves with platform when standing on it
- **Direction**: Reverses at range boundaries

#### Collectible Collision
- **Detection**: Distance-based (25-30 pixel radius)
- **Effect**: Adds to collected items, updates count
- **Types**: Carrots, stars, coins
- **State**: Tracked in `collectedCarrots` array

#### Obstacle Collision
- **Detection**: Bounding box overlap
- **Effect**: Resets bunny to start position
- **Types**: Spikes (red blocks with spikes on top)
- **Prevention**: Jump over obstacles

#### Goal Collision
- **Detection**: Bounding box overlap
- **Effect**: Checks completion conditions
- **Conditions**: 
  - All collectibles collected
  - Required carrot count met (if specified)
  - Level marked as complete

### Boundary Checks
- **Left Boundary**: `x >= 0`
- **Right Boundary**: `x + width <= canvas.width`
- **Top Boundary**: `y >= 0`
- **Bottom**: Handled by ground collision

## Game Elements

### Bunny (Player Character)
- **Size**: 40x50 pixels
- **Color**: White body, pink nose
- **Features**: Ears, eyes, whiskers, feet
- **States**: 
  - `onGround`: Boolean
  - `jumping`: Boolean
  - `vx`, `vy`: Velocity components

### Platforms
- **Static Platforms**:
  - Brown base (#8B4513)
  - Green grass top (#228B22)
  - Solid collision

- **Moving Platforms**:
  - Darker brown (#654321)
  - Gold arrow indicator
  - Moves horizontally or vertically
  - Bunny moves with platform

### Collectibles

#### Carrots
- **Shape**: Orange triangle with green top
- **Size**: ~30x20 pixels
- **Collection**: Distance-based (25 pixels)
- **Value**: 1 item

#### Stars
- **Shape**: 5-pointed star
- **Size**: ~20 pixels diameter
- **Color**: Gold (#FFD700)
- **Collection**: Distance-based (20 pixels)
- **Value**: 1 item

#### Coins
- **Shape**: Circle
- **Size**: ~16 pixels diameter
- **Color**: Gold (#FFD700) with orange border
- **Collection**: Distance-based (20 pixels)
- **Value**: 1 item

### Obstacles
- **Spikes**:
  - Red base (#8B0000)
  - Red spikes on top (#FF0000)
  - Hazard: Resets bunny on contact
  - Avoidance: Jump over

### Goal
- **Flag Pole**: Gold (#FFD700), 10 pixels wide
- **Flag**: Green (#00FF00), triangular
- **Size**: 50x50 pixels
- **Effect**: Completes level when reached with conditions met

## Game Rules

### Level Completion
A level is completed when:
1. Bunny reaches the goal (flag)
2. All collectibles are collected (or required count met)
3. No obstacles hit

### Level Failure
A level fails when:
1. Bunny hits an obstacle (resets to start)
2. Code execution times out (30 seconds)
3. Bunny gets stuck (no progress)

### Statistics Tracking

#### Carrot Count
- Tracks all collected items (carrots, stars, coins)
- Increments on collection
- Resets on level reset
- Used for completion check

#### Move Count
- Tracks total movement actions
- Increments on: `moveRight()`, `moveLeft()`, `jump()`
- Resets on level reset
- Used for optimization challenges

#### Time Count
- Tracks elapsed time in seconds
- Starts when code execution begins
- Stops on level completion
- Used for speed challenges

## Game Loop

### Update Cycle
1. Update moving platforms
2. Apply gravity to bunny
3. Update bunny position (x += vx, y += vy)
4. Apply friction to horizontal velocity
5. Check all collisions
6. Update statistics

### Render Cycle
1. Clear canvas (sky blue background)
2. Draw ground (brown with grass)
3. Draw static platforms
4. Draw moving platforms
5. Draw obstacles
6. Draw collectibles (if not collected)
7. Draw goal
8. Draw bunny

### Frame Rate
- **Target**: 60 FPS
- **Method**: `requestAnimationFrame()`
- **Timing**: ~16ms per frame

## Code Execution Model

### Execution Flow
1. User clicks "Run Code"
2. Game resets and starts
3. Python code is preprocessed
4. Code is split into chunks (by wait/sleep)
5. Each chunk is executed sequentially
6. Game loop runs during execution
7. Execution completes when:
   - Level completes
   - Bunny is stationary for 30 frames
   - 30 second timeout reached

### Wait/Sleep Handling
- `wait(seconds)`: Pauses code execution
- `sleep(milliseconds)`: Pauses code execution (converted to seconds)
- Maximum wait: 10 seconds per call
- Game continues animating during wait

### Code Preprocessing
- "Try:" lines are commented out
- Code is split at top-level wait/sleep calls
- Loops and conditionals are preserved
- Comments are preserved

## State Management

### Game State Object
```javascript
{
    bunnyX: number,           // Initial X position
    bunnyY: number,           // Initial Y position
    collectedCarrots: Array,  // Collected item IDs
    moveHistory: Array        // Action history
}
```

### State Persistence
- Initial state saved on level load
- Used for reset functionality
- Tracks collected items across resets
- Maintains move history

### Reset Behavior
- Resets bunny to initial position
- Clears collected items
- Resets statistics
- Maintains level data
- Redraws game

## Performance Considerations

### Optimization Strategies
1. **Collision Detection**: Bounding box checks only
2. **Rendering**: Only redraw changed elements
3. **Code Execution**: Chunked execution prevents blocking
4. **Animation**: requestAnimationFrame for smooth updates
5. **Memory**: Proper cleanup on reset

### Performance Limits
- Maximum execution time: 30 seconds
- Stationary detection: 30 frames
- Wait time cap: 10 seconds
- Code chunk size: Limited by browser

## Accessibility

### Visual Feedback
- Clear visual indicators for all states
- Color-coded elements
- Statistics display
- Message system for feedback

### Error Handling
- Python errors displayed to user
- Timeout warnings
- Collision feedback (reset on obstacle)
- Completion celebration

---

*Last Updated*: 2025-01-30

