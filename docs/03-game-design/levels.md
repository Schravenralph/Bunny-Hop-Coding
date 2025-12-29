# Level Design Documentation

## Overview

The Bunny Hop Coding Adventure features 15 progressive levels designed to teach Python programming concepts through gameplay. Each level introduces new concepts and challenges.

## Level Progression

### Beginner Levels (1-5)
**Focus**: Basic movement and simple actions

1. **First Hop** - Basic movement
2. **Double Jump** - Jumping mechanics
3. **Collect Carrots** - Collection mechanics
4. **Avoid Obstacles** - Hazard avoidance
5. **Platform Hopping** - Multi-platform navigation

### Intermediate Levels (6-10)
**Focus**: Timing, loops, and conditional logic

6. **Speed Challenge** - Optimization
7. **Maze Runner** - Complex navigation
8. **Multi-Bunny Challenge** - Combining skills
9. **High Jump** - Vertical navigation
10. **Carrot Collector** - Multiple collectibles

### Advanced Levels (11-15)
**Focus**: Complex problem-solving

11. **Spike Field** - Precision timing
12. **The Zigzag** - Pattern recognition
13. **Master Challenge** - All skills combined
14. **Bunny Parkour** - Precision movement
15. **Carrot Maze** - Exploration and planning

## Level Structure

### Level Schema

Each level follows this structure:

```javascript
{
    name: string,              // Level name
    instructions: string,     // HTML instructions
    startX: number,           // Bunny start X
    startY: number,           // Bunny start Y
    groundY: number,          // Ground level Y
    platforms: Array,         // Static platforms
    movingPlatforms: Array,   // Dynamic platforms
    carrots: Array,           // Carrot collectibles
    stars: Array,             // Star collectibles
    coins: Array,             // Coin collectibles
    obstacles: Array,         // Hazard objects
    goal: object,            // Completion target
    hint: string,            // Hint code
    startCode?: string,      // Initial code (optional)
    requiredCarrots?: number // Minimum collectibles
}
```

## Level Details

### Level 1: First Hop
**Learning Objective**: Basic movement

- Simple horizontal movement
- No obstacles or collectibles
- Introduces `move_right()` function

**Solution Pattern**:
```python
move_right(20)
```

---

### Level 2: Double Jump
**Learning Objective**: Jumping mechanics

- Gap in ground
- Introduces `jump()` function
- Teaches timing with `wait()`

**Solution Pattern**:
```python
move_right(10)
jump()
move_right(10)
```

---

### Level 3: Collect Carrots
**Learning Objective**: Collection mechanics

- Multiple carrots to collect
- Introduces `collect()` function
- Teaches sequential actions

**Solution Pattern**:
```python
move_right(5)
collect()
move_right(5)
collect()
move_right(5)
collect()
move_right(5)
```

---

### Level 4: Avoid Obstacles
**Learning Objective**: Hazard avoidance

- Spikes on ground
- Introduces obstacle concept
- Teaches jump timing

**Solution Pattern**:
```python
move_right(8)
jump()
wait(0.5)
move_right(8)
jump()
wait(0.5)
move_right(10)
```

---

### Level 5: Platform Hopping
**Learning Objective**: Multi-platform navigation

- Multiple platforms at different heights
- Introduces vertical navigation
- Teaches jump-and-wait pattern

**Solution Pattern**:
```python
move_right(8)
jump()
wait(0.3)
move_right(8)
jump()
wait(0.3)
move_right(8)
jump()
wait(0.3)
move_right(5)
```

---

### Level 6: Speed Challenge
**Learning Objective**: Code optimization

- Simple level with time focus
- Encourages efficient code
- Introduces optimization thinking

**Solution Pattern**:
```python
move_right(25)
```

---

### Level 7: Maze Runner
**Learning Objective**: Complex navigation

- Multiple platforms and collectibles
- Introduces planning skills
- Teaches pathfinding concepts

**Solution Pattern**:
```python
move_right(6)
jump()
wait(0.3)
move_right(8)
jump()
wait(0.3)
move_right(6)
jump()
wait(0.3)
move_right(5)
```

---

### Level 8: Multi-Bunny Challenge
**Learning Objective**: Combining all skills

- Platforms, collectibles, and obstacles
- Tests all learned skills
- Introduces problem decomposition

**Solution Pattern**:
```python
move_right(5)
collect()
move_right(5)
jump()
wait(0.3)
move_right(3)
collect()
jump()
wait(0.3)
move_right(8)
collect()
move_right(5)
```

---

### Level 9: High Jump
**Learning Objective**: Vertical navigation

- Multiple platforms going upward
- Introduces vertical thinking
- Teaches jump timing for height

**Solution Pattern**:
```python
move_right(5)
jump()
wait(0.8)
move_right(5)
jump()
wait(0.8)
move_right(5)
jump()
wait(0.8)
move_right(5)
jump()
wait(0.8)
move_right(3)
```

---

### Level 10: Carrot Collector
**Learning Objective**: Multiple collectibles

- 6 carrots scattered across platforms
- Introduces collection planning
- Teaches route optimization

**Solution Pattern**:
```python
# Visit each platform and collect
move_right(3)
collect()
move_right(5)
jump()
wait(0.5)
collect()
move_right(5)
jump()
wait(0.5)
collect()
move_right(5)
collect()
move_right(3)
collect()
move_right(3)
collect()
move_right(3)
```

---

### Level 11: Spike Field
**Learning Objective**: Precision timing

- Multiple spikes between platforms
- Introduces precision movement
- Teaches careful planning

**Solution Pattern**:
```python
move_right(5)
jump()
wait(0.6)
move_right(5)
jump()
wait(0.6)
move_right(5)
jump()
wait(0.6)
move_right(5)
jump()
wait(0.6)
move_right(3)
```

---

### Level 12: The Zigzag
**Learning Objective**: Pattern recognition

- Zigzag pattern of platforms
- Introduces pattern thinking
- Teaches left/right navigation

**Solution Pattern**:
```python
move_right(5)
jump()
wait(0.5)
move_right(5)
jump()
wait(0.5)
move_left(5)
jump()
wait(0.5)
move_right(5)
jump()
wait(0.5)
move_right(5)
jump()
wait(0.5)
move_right(3)
```

---

### Level 13: Master Challenge
**Learning Objective**: All skills combined

- Complex level with all elements
- Tests comprehensive understanding
- Introduces problem decomposition

**Solution Pattern**:
```python
move_right(4)
collect()
jump()
wait(0.5)
move_right(3)
collect()
jump()
wait(0.5)
move_right(3)
collect()
jump()
wait(0.5)
move_right(4)
collect()
move_right(3)
```

---

### Level 14: Bunny Parkour
**Learning Objective**: Precision movement

- Small platforms requiring precision
- Introduces fine control
- Teaches careful timing

**Solution Pattern**:
```python
move_right(3)
jump()
wait(0.5)
move_right(3)
jump()
wait(0.5)
move_right(3)
jump()
wait(0.5)
move_right(3)
jump()
wait(0.5)
move_right(3)
jump()
wait(0.5)
move_right(3)
```

---

### Level 15: Carrot Maze
**Learning Objective**: Exploration and planning

- Complex maze with multiple paths
- Introduces exploration thinking
- Teaches backtracking concepts

**Solution Pattern**:
```python
move_right(4)
collect()
jump()
wait(0.5)
collect()
move_right(4)
collect()
jump()
wait(0.5)
collect()
move_right(4)
collect()
move_left(15)
collect()
move_right(20)
```

## Design Principles

### 1. Progressive Difficulty
- Each level builds on previous concepts
- New mechanics introduced gradually
- Complexity increases smoothly

### 2. Clear Objectives
- Each level has a clear goal
- Instructions explain what to do
- Hints available for guidance

### 3. Multiple Solutions
- Levels can be solved in different ways
- Encourages creative thinking
- Rewards experimentation

### 4. Immediate Feedback
- Visual feedback for all actions
- Clear success/failure states
- Statistics track progress

### 5. Educational Value
- Teaches programming concepts
- Introduces problem-solving skills
- Encourages logical thinking

## Level Creation Guidelines

### When Creating a New Level:

1. **Define Learning Objective**
   - What concept does this teach?
   - What skills does it practice?

2. **Design Layout**
   - Start position
   - Goal position
   - Platforms and obstacles
   - Collectibles placement

3. **Test Difficulty**
   - Is it too easy?
   - Is it too hard?
   - Does it fit progression?

4. **Write Instructions**
   - Clear and concise
   - Explain the goal
   - List available tools

5. **Provide Hint**
   - Helpful but not giving away solution
   - Shows approach, not answer
   - Encourages learning

6. **Test Solution**
   - Verify level is solvable
   - Test multiple approaches
   - Ensure no bugs

---

*Last Updated*: 2025-01-30

