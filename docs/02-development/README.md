# Development Guide

## Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor or IDE
- No build tools or dependencies required

### Getting Started

1. Clone or download the project
2. Open `index.html` in a web browser
3. Wait for Pyodide to load (~5-10 seconds on first load)
4. Start coding!

### File Structure
```
Bunny Hop Coding/
├── index.html          # Main HTML structure
├── style.css           # Styling
├── game.js             # Game engine
├── levels.js           # Level definitions
├── main.js             # Application logic
├── README.md           # Project overview
└── docs/               # Documentation
    ├── README.md
    └── 01-architecture/
```

## Development Workflow

### Adding a New Level

1. Open `levels.js`
2. Add a new level object with the next number:
```javascript
16: {
    name: "Level Name",
    instructions: `<p>Instructions here</p>`,
    startX: 50,
    startY: 400,
    groundY: 450,
    platforms: [...],
    carrots: [...],
    obstacles: [...],
    goal: { x: 700, y: 400, width: 50, height: 50 },
    hint: "Try: move_right(10)"
}
```

3. The level will automatically appear in the dropdown

### Adding a New Python Function

1. Add method to `BunnyHopGame` class in `game.js`:
```javascript
newFunction(param) {
    // Implementation
    this.gameState.moveHistory.push({ action: 'newFunction', param });
}
```

2. Expose in `setupPythonEnvironment()` in `main.js`:
```python
def new_function(param):
    """Description"""
    game.newFunction(param)
```

3. Add to help section in `index.html`:
```html
<li><code>new_function(param)</code> - Description</li>
```

### Modifying Game Physics

Edit constants in `BunnyHopGame` constructor:
- `gravity`: Gravity strength (default: 0.8)
- Movement speed: In `moveRight()`/`moveLeft()` (default: 3)
- Jump strength: In `jump()` (default: -15)
- Friction: In `update()` (default: 0.9)

### Adding New Game Elements

1. Add to level data structure in `levels.js`
2. Add rendering method in `game.js`:
```javascript
drawNewElement() {
    this.newElements.forEach(element => {
        // Render logic
    });
}
```

3. Add to `draw()` method
4. Add collision detection in `checkCollisions()`

## Code Style

### JavaScript
- Use ES6+ features
- CamelCase for variables and functions
- PascalCase for classes
- Descriptive variable names
- Comments for complex logic

### Python API
- snake_case for function names
- Clear docstrings
- Type hints in comments

### HTML/CSS
- Semantic HTML
- BEM-like naming for complex components
- Responsive design first

## Testing

### Manual Testing Checklist
- [ ] All levels load correctly
- [ ] Code execution works
- [ ] Collision detection accurate
- [ ] Moving platforms work
- [ ] Collectibles work
- [ ] Level completion triggers
- [ ] Reset functionality works
- [ ] Hints load correctly
- [ ] Stats update correctly
- [ ] Responsive on mobile

### Browser Testing
Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Debugging

### Common Issues

**Pyodide not loading**
- Check internet connection
- Check browser console for errors
- Verify CDN URL is correct

**Code not executing**
- Check browser console for Python errors
- Verify code syntax
- Check for infinite loops

**Game not rendering**
- Check canvas element exists
- Verify game.draw() is called
- Check for JavaScript errors

**Collision detection issues**
- Verify coordinates are correct
- Check collision logic in checkCollisions()
- Use console.log to debug positions

### Debug Tools
- Browser DevTools Console
- Canvas inspector
- Breakpoints in code
- console.log() for state inspection

## Performance Optimization

### Rendering
- Only redraw when necessary
- Use requestAnimationFrame
- Optimize collision detection

### Code Execution
- Chunk large code blocks
- Handle wait/sleep efficiently
- Timeout protection

### Memory
- Clean up on level reset
- Avoid memory leaks
- Proper event listener cleanup

## Deployment

### Simple Deployment
1. Upload all files to web server
2. Ensure `index.html` is accessible
3. No build step required

### CDN Deployment
- Can be hosted on GitHub Pages
- Can be hosted on any static hosting
- No server-side code needed

## Version Control

### Git Workflow
- Feature branches for new levels
- Main branch for stable releases
- Tag releases with version numbers

### Commit Messages
- Clear, descriptive messages
- Reference issue numbers if applicable
- Follow conventional commits format

---

*Last Updated*: 2025-01-30

