# 🐰 Bunny Hop Coding Adventure 🐰

A fun, educational coding game for kids where they learn Python by programming a bunny to hop through levels!

## Features

- **15 Progressive Levels** - From simple movement to complex challenges
- **Python Coding** - Kids write real Python code to control the bunny
- **Bunny Characters** - Cute bunny sprites replace traditional players
- **Replay Functionality** - Replay any level anytime
- **Multiple Features**:
  - Movement (left/right)
  - Jumping
  - Collecting carrots, stars, and coins
  - Avoiding obstacles
  - Platform navigation (static and moving)
  - Speed challenges
  - Maze navigation

## How to Play

1. Open `index.html` in a modern web browser
2. Wait for Python to load (you'll see "Python is ready! 🐍")
3. Select a level from the dropdown
4. Write Python code using the available functions:
   - `move_right(steps)` - Move bunny right
   - `move_left(steps)` - Move bunny left
   - `jump()` - Make bunny jump
   - `wait(seconds)` - Wait before next action
   - `collect()` - Collect item at current position
   - `get_position()` - Get bunny's position
   - `get_carrot_count()` - Get collected items count
   - `is_on_ground()` - Check if bunny is on ground
   - `can_jump()` - Check if bunny can jump
5. Click "Run Code" to execute your program
6. Try to reach the flag at the end of each level!

## Levels

### Beginner (1-5)
1. **First Hop** - Learn basic movement
2. **Double Jump** - Learn to jump over gaps
3. **Collect Carrots** - Learn to collect items
4. **Avoid Obstacles** - Learn to avoid spikes
5. **Platform Hopping** - Navigate multiple platforms

### Intermediate (6-10)
6. **Speed Challenge** - Race against time
7. **Maze Runner** - Navigate through a maze
8. **Multi-Bunny Challenge** - Ultimate challenge combining all skills
9. **High Jump** - Jump to great heights
10. **Carrot Collector** - Collect all 6 carrots

### Advanced (11-15)
11. **Spike Field** - Navigate through dangerous spikes
12. **The Zigzag** - Follow the zigzag pattern
13. **Master Challenge** - The ultimate test
14. **Bunny Parkour** - Test your parkour skills
15. **Carrot Maze** - Find all carrots in the maze

## Technical Details

- Uses **Pyodide** to run Python in the browser
- Canvas-based game engine
- No server required - runs entirely in the browser
- Modern, kid-friendly UI with colorful design
- Zero dependencies (except Pyodide CDN)

## Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for loading Pyodide)

## Files

- `index.html` - Main HTML structure
- `style.css` - Styling and UI design
- `game.js` - Game engine and bunny rendering
- `levels.js` - Level definitions
- `main.js` - Python execution and game controller

## Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

- **[Architecture Documentation](./docs/01-architecture/architecture.md)** - System architecture and design
- **[Component Documentation](./docs/01-architecture/components.md)** - Detailed component breakdown
- **[Development Guide](./docs/02-development/README.md)** - Setup and development instructions
- **[Level Design](./docs/03-game-design/levels.md)** - Level structure and progression
- **[Game Mechanics](./docs/03-game-design/mechanics.md)** - Physics and game rules
- **[Python API Reference](./docs/04-api/python-api.md)** - Complete API documentation

## Quick Start

1. Clone or download this repository
2. Open `index.html` in your browser
3. Start coding!

Enjoy coding! 🎉

