# Python API Reference

## Overview

The Bunny Hop Coding Adventure exposes a Python API that allows users to control the bunny character through Python code. All functions are executed in the browser using Pyodide.

## Available Functions

### Movement Functions

#### `move_right(steps=1)`
Move the bunny to the right.

**Parameters:**
- `steps` (int, optional): Number of steps to move. Default: 1

**Example:**
```python
move_right(10)  # Move 10 steps right
move_right()    # Move 1 step right
```

**Notes:**
- Each step moves the bunny approximately 3 pixels
- Movement is affected by friction
- Bunny can move while in the air

---

#### `move_left(steps=1)`
Move the bunny to the left.

**Parameters:**
- `steps` (int, optional): Number of steps to move. Default: 1

**Example:**
```python
move_left(5)   # Move 5 steps left
move_left()    # Move 1 step left
```

**Notes:**
- Each step moves the bunny approximately 3 pixels
- Movement is affected by friction
- Bunny can move while in the air

---

### Jumping Functions

#### `jump()`
Make the bunny jump.

**Parameters:** None

**Example:**
```python
jump()  # Make the bunny jump
```

**Notes:**
- Bunny can only jump when on the ground
- Jump height is fixed (~15 pixels upward velocity)
- Use `wait()` after jump to allow landing
- Bunny cannot jump while already jumping

---

### Timing Functions

#### `wait(seconds)`
Wait for a specified number of seconds before continuing.

**Parameters:**
- `seconds` (float): Number of seconds to wait

**Example:**
```python
wait(0.5)   # Wait half a second
wait(2.0)   # Wait 2 seconds
```

**Notes:**
- Maximum wait time is 10 seconds (capped for safety)
- Use this to time jumps and movements
- Code execution pauses during wait

---

#### `sleep(milliseconds)`
Sleep for a specified number of milliseconds.

**Parameters:**
- `milliseconds` (float): Number of milliseconds to sleep

**Example:**
```python
sleep(500)  # Sleep for 500 milliseconds (0.5 seconds)
sleep(1000) # Sleep for 1 second
```

**Notes:**
- Automatically converted to seconds internally
- Maximum sleep time is 10 seconds (capped for safety)
- Alternative to `wait()` with millisecond precision

---

### Collection Functions

#### `collect()`
Collect items (carrots, stars, coins) near the bunny's current position.

**Parameters:** None

**Example:**
```python
collect()  # Collect nearby items
```

**Notes:**
- Collects items within 30 pixels of bunny
- Automatically detects carrots, stars, and coins
- Updates carrot count when items are collected
- Can be called multiple times safely

---

### Query Functions

#### `get_position()`
Get the bunny's current position.

**Returns:**
- `list`: `[x, y]` coordinates

**Example:**
```python
pos = get_position()
x, y = pos
print(f"Bunny is at ({x}, {y})")
```

**Notes:**
- Returns list with x and y coordinates
- Coordinates are in pixels
- (0, 0) is top-left corner

---

#### `get_carrot_count()`
Get the number of items collected.

**Returns:**
- `int`: Number of items collected

**Example:**
```python
count = get_carrot_count()
print(f"Collected {count} items")
```

**Notes:**
- Counts all collectibles (carrots, stars, coins)
- Returns 0 if no items collected
- Updates in real-time

---

#### `is_on_ground()`
Check if the bunny is on the ground or a platform.

**Returns:**
- `bool`: `True` if on ground, `False` otherwise

**Example:**
```python
if is_on_ground():
    jump()
else:
    wait(0.1)
```

**Notes:**
- Returns `True` when bunny is on ground or platform
- Returns `False` when bunny is in the air
- Useful for conditional jumping

---

#### `can_jump()`
Check if the bunny can jump (is on ground and not already jumping).

**Returns:**
- `bool`: `True` if can jump, `False` otherwise

**Example:**
```python
if can_jump():
    jump()
```

**Notes:**
- More specific than `is_on_ground()`
- Checks both ground state and jump state
- Prevents double-jumping

---

## Python Features

### Supported Python Features

The code editor supports standard Python syntax:

- **Variables**: `x = 10`
- **Loops**: `for i in range(5):`, `while condition:`
- **Conditionals**: `if`, `elif`, `else`
- **Functions**: Define your own functions
- **Lists**: `[1, 2, 3]`
- **Dictionaries**: `{'key': 'value'}`
- **Comments**: `# This is a comment`

### Example: Using Loops

```python
# Move right 5 times
for i in range(5):
    move_right(2)
    wait(0.1)
```

### Example: Using Conditionals

```python
# Jump if on ground
if is_on_ground():
    jump()
    wait(0.5)
```

### Example: Combining Functions

```python
# Collect all carrots in a path
for i in range(10):
    move_right(3)
    collect()
    wait(0.2)
```

## Best Practices

### 1. Use `wait()` After Jumps
```python
jump()
wait(0.5)  # Wait for bunny to land
move_right(5)
```

### 2. Check State Before Actions
```python
if can_jump():
    jump()
```

### 3. Use Loops for Repetition
```python
# Instead of:
move_right(1)
move_right(1)
move_right(1)

# Use:
for i in range(3):
    move_right(1)
```

### 4. Collect Items Regularly
```python
move_right(5)
collect()  # Collect after moving
```

### 5. Plan Your Route
```python
# Think about the path before coding
move_right(10)
jump()
wait(0.5)
collect()
move_right(5)
```

## Common Patterns

### Pattern 1: Jump Over Gap
```python
move_right(8)
jump()
wait(0.5)
move_right(8)
```

### Pattern 2: Collect Multiple Items
```python
for i in range(3):
    move_right(5)
    collect()
    wait(0.2)
```

### Pattern 3: Platform Hopping
```python
for i in range(3):
    move_right(5)
    jump()
    wait(0.8)  # Wait to land on platform
```

### Pattern 4: Conditional Movement
```python
while get_carrot_count() < 3:
    move_right(2)
    collect()
    wait(0.1)
```

## Limitations

### Execution Limits
- Maximum execution time: 30 seconds
- Maximum wait/sleep time: 10 seconds per call
- Code execution stops if bunny is stationary for too long

### Function Limitations
- No file I/O
- No network access
- No system calls
- Limited to exposed game API

### Physics Limitations
- Fixed gravity and jump strength
- Movement affected by friction
- Collision detection is pixel-based

## Error Handling

### Common Errors

**"Bunny cannot jump"**
- Bunny is not on ground
- Bunny is already jumping
- Solution: Check `can_jump()` before jumping

**"Code execution timed out"**
- Code ran longer than 30 seconds
- Solution: Optimize code or break into smaller chunks

**"Invalid function call"**
- Function name misspelled
- Wrong number of parameters
- Solution: Check function names and parameters

---

*Last Updated*: 2025-01-30

