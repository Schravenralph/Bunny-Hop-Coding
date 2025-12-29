// Level Definitions for Bunny Hop Coding Adventure

const levels = {
    1: {
        name: "First Hop",
        instructions: `
            <p>Welcome to your first coding adventure! 🐰</p>
            <p><strong>Goal:</strong> Make the bunny reach the flag at the end!</p>
            <ul>
                <li>Use <code>move_right(steps)</code> to move the bunny forward</li>
                <li>Try it and see what happens!</li>
            </ul>
        `,
        startX: 50,
        startY: 400,
        groundY: 450,
        platforms: [],
        carrots: [],
        obstacles: [],
        goal: { x: 700, y: 400, width: 50, height: 50 },
        hint: "Try: move_right(20)"
    },
    
    2: {
        name: "Double Jump",
        instructions: `
            <p>Now let's learn to jump! 🦘</p>
            <p><strong>Goal:</strong> Jump over the gap to reach the flag!</p>
            <ul>
                <li>Use <code>move_right(steps)</code> to move forward</li>
                <li>Use <code>jump()</code> to make the bunny jump</li>
                <li>You can combine moves: <code>move_right(3)</code> then <code>jump()</code></li>
            </ul>
        `,
        startX: 50,
        startY: 400,
        groundY: 450,
        platforms: [
            { x: 0, y: 450, width: 300, height: 50 },
            { x: 500, y: 450, width: 300, height: 50 }
        ],
        carrots: [],
        obstacles: [],
        goal: { x: 700, y: 400, width: 50, height: 50 },
        hint: "Try: move_right(10)\njump()\nmove_right(10)"
    },
    
    3: {
        name: "Collect Carrots",
        instructions: `
            <p>Time to collect some carrots! 🥕</p>
            <p><strong>Goal:</strong> Collect all carrots and reach the flag!</p>
            <ul>
                <li>Move to a carrot and use <code>collect()</code> to pick it up</li>
                <li>You need to be close to the carrot to collect it</li>
                <li>Watch the carrot counter at the top!</li>
            </ul>
        `,
        startX: 50,
        startY: 400,
        groundY: 450,
        platforms: [],
        carrots: [
            { id: 1, x: 200, y: 380 },
            { id: 2, x: 400, y: 380 },
            { id: 3, x: 600, y: 380 }
        ],
        obstacles: [],
        goal: { x: 700, y: 400, width: 50, height: 50 },
        hint: "Try: move_right(5)\ncollect()\nmove_right(5)\ncollect()\nmove_right(5)\ncollect()\nmove_right(5)"
    },
    
    4: {
        name: "Avoid Obstacles",
        instructions: `
            <p>Watch out for the spikes! ⚠️</p>
            <p><strong>Goal:</strong> Reach the flag without touching the red spikes!</p>
            <ul>
                <li>Use <code>jump()</code> to jump over obstacles</li>
                <li>You can use <code>wait(seconds)</code> to pause between actions</li>
                <li>If you hit a spike, you'll reset to the start</li>
            </ul>
        `,
        startX: 50,
        startY: 400,
        groundY: 450,
        platforms: [],
        carrots: [],
        obstacles: [
            { x: 250, y: 440, width: 100, height: 10 },
            { x: 450, y: 440, width: 100, height: 10 }
        ],
        goal: { x: 700, y: 400, width: 50, height: 50 },
        hint: "Try: move_right(8)\njump()\nwait(0.5)\nmove_right(8)\njump()\nwait(0.5)\nmove_right(10)"
    },
    
    5: {
        name: "Platform Hopping",
        instructions: `
            <p>Jump from platform to platform! 🏗️</p>
            <p><strong>Goal:</strong> Navigate the platforms to reach the flag!</p>
            <ul>
                <li>Plan your jumps carefully</li>
                <li>You can move left with <code>move_left(steps)</code></li>
                <li>Combine movement and jumping to reach higher platforms</li>
            </ul>
        `,
        startX: 50,
        startY: 400,
        groundY: 450,
        platforms: [
            { x: 0, y: 450, width: 200, height: 50 },
            { x: 300, y: 350, width: 200, height: 50 },
            { x: 600, y: 250, width: 200, height: 50 }
        ],
        carrots: [],
        obstacles: [],
        goal: { x: 700, y: 200, width: 50, height: 50 },
        hint: "Try: move_right(8)\njump()\nwait(0.3)\nmove_right(8)\njump()\nwait(0.3)\nmove_right(8)\njump()\nwait(0.3)\nmove_right(5)"
    },
    
    6: {
        name: "Speed Challenge",
        instructions: `
            <p>Race against time! ⏱️</p>
            <p><strong>Goal:</strong> Reach the flag as fast as possible!</p>
            <ul>
                <li>Try to complete this level in under 5 seconds</li>
                <li>Use multiple moves in sequence</li>
                <li>Optimize your code for speed!</li>
            </ul>
        `,
        startX: 50,
        startY: 400,
        groundY: 450,
        platforms: [],
        carrots: [],
        obstacles: [],
        goal: { x: 700, y: 400, width: 50, height: 50 },
        hint: "Try: move_right(25)"
    },
    
    7: {
        name: "Maze Runner",
        instructions: `
            <p>Navigate through the maze! 🌀</p>
            <p><strong>Goal:</strong> Find your way through the platforms to the flag!</p>
            <ul>
                <li>You'll need to move left and right</li>
                <li>Use jumps to reach different levels</li>
                <li>Think about the path you need to take</li>
            </ul>
        `,
        startX: 50,
        startY: 400,
        groundY: 450,
        platforms: [
            { x: 0, y: 450, width: 150, height: 50 },
            { x: 200, y: 350, width: 150, height: 50 },
            { x: 400, y: 450, width: 150, height: 50 },
            { x: 600, y: 300, width: 150, height: 50 }
        ],
        carrots: [
            { id: 1, x: 275, y: 330 },
            { id: 2, x: 675, y: 280 }
        ],
        obstacles: [],
        goal: { x: 700, y: 250, width: 50, height: 50 },
        hint: "Try: move_right(6)\njump()\nwait(0.3)\nmove_right(8)\njump()\nwait(0.3)\nmove_right(6)\njump()\nwait(0.3)\nmove_right(5)"
    },
    
    8: {
        name: "Multi-Bunny Challenge",
        instructions: `
            <p>The ultimate challenge! 🏆</p>
            <p><strong>Goal:</strong> Collect all carrots, avoid obstacles, and reach the flag!</p>
            <ul>
                <li>This level combines everything you've learned</li>
                <li>Plan your moves carefully</li>
                <li>You can do it! 🐰</li>
            </ul>
        `,
        startX: 50,
        startY: 400,
        groundY: 450,
        platforms: [
            { x: 0, y: 450, width: 200, height: 50 },
            { x: 300, y: 350, width: 150, height: 50 },
            { x: 550, y: 450, width: 250, height: 50 }
        ],
        carrots: [
            { id: 1, x: 150, y: 380 },
            { id: 2, x: 375, y: 330 },
            { id: 3, x: 650, y: 380 }
        ],
        obstacles: [
            { x: 250, y: 440, width: 50, height: 10 }
        ],
        goal: { x: 700, y: 400, width: 50, height: 50 },
        hint: "Try: move_right(5)\ncollect()\nmove_right(5)\njump()\nwait(0.3)\nmove_right(3)\ncollect()\njump()\nwait(0.3)\nmove_right(8)\ncollect()\nmove_right(5)"
    },
    
    // NEW LEVELS
    9: {
        name: "High Jump",
        instructions: `
            <p>Jump to great heights! ⬆️</p>
            <p><strong>Goal:</strong> Reach the highest platform to get to the goal!</p>
            <ul>
                <li>You'll need multiple jumps to reach the top</li>
                <li>Use <code>wait(seconds)</code> between jumps to land properly</li>
                <li>Each platform is higher than the last</li>
            </ul>
        `,
        startX: 50,
        startY: 400,
        groundY: 450,
        platforms: [
            { x: 0, y: 450, width: 150, height: 50 },
            { x: 200, y: 380, width: 150, height: 50 },
            { x: 400, y: 310, width: 150, height: 50 },
            { x: 600, y: 240, width: 150, height: 50 }
        ],
        carrots: [],
        obstacles: [],
        goal: { x: 700, y: 190, width: 50, height: 50 },
        hint: "Try: move_right(5)\njump()\nwait(0.8)\nmove_right(5)\njump()\nwait(0.8)\nmove_right(5)\njump()\nwait(0.8)\nmove_right(5)\njump()\nwait(0.8)\nmove_right(3)"
    },
    
    10: {
        name: "Carrot Collector",
        instructions: `
            <p>Collect all 6 carrots! 🥕🥕🥕</p>
            <p><strong>Goal:</strong> Collect all carrots scattered around the level!</p>
            <ul>
                <li>Some carrots are on platforms</li>
                <li>Plan your route to collect them all efficiently</li>
                <li>Don't forget any carrots!</li>
            </ul>
        `,
        startX: 50,
        startY: 400,
        groundY: 450,
        platforms: [
            { x: 0, y: 450, width: 150, height: 50 },
            { x: 200, y: 400, width: 150, height: 50 },
            { x: 400, y: 350, width: 150, height: 50 },
            { x: 600, y: 400, width: 150, height: 50 }
        ],
        carrots: [
            { id: 1, x: 100, y: 380 },
            { id: 2, x: 275, y: 350 },
            { id: 3, x: 475, y: 300 },
            { id: 4, x: 675, y: 350 },
            { id: 5, x: 50, y: 380 },
            { id: 6, x: 700, y: 350 }
        ],
        obstacles: [],
        goal: { x: 700, y: 350, width: 50, height: 50 },
        hint: "Visit each platform, collect carrots, then move to the next"
    },
    
    11: {
        name: "Spike Field",
        instructions: `
            <p>Navigate through dangerous spikes! ⚡</p>
            <p><strong>Goal:</strong> Carefully jump over all the spikes!</p>
            <ul>
                <li>There are many spikes - be very careful!</li>
                <li>Use platforms to avoid spikes</li>
                <li>Time your jumps perfectly</li>
            </ul>
        `,
        startX: 50,
        startY: 400,
        groundY: 450,
        platforms: [
            { x: 0, y: 400, width: 100, height: 50 },
            { x: 200, y: 400, width: 100, height: 50 },
            { x: 400, y: 400, width: 100, height: 50 },
            { x: 600, y: 400, width: 100, height: 50 }
        ],
        carrots: [],
        obstacles: [
            { x: 120, y: 440, width: 50, height: 10 },
            { x: 320, y: 440, width: 50, height: 10 },
            { x: 520, y: 440, width: 50, height: 10 }
        ],
        goal: { x: 700, y: 350, width: 50, height: 50 },
        hint: "Jump onto each platform, wait to land, then jump to the next"
    },
    
    12: {
        name: "The Zigzag",
        instructions: `
            <p>Follow the zigzag pattern! ↕️</p>
            <p><strong>Goal:</strong> Navigate a zigzag path of platforms!</p>
            <ul>
                <li>Move left and right as you go up</li>
                <li>Collect the carrot on the way</li>
                <li>Think about the pattern: right, left, right, left...</li>
            </ul>
        `,
        startX: 50,
        startY: 400,
        groundY: 450,
        platforms: [
            { x: 0, y: 450, width: 150, height: 50 },
            { x: 200, y: 380, width: 150, height: 50 },
            { x: 0, y: 310, width: 150, height: 50 },
            { x: 200, y: 240, width: 150, height: 50 },
            { x: 400, y: 170, width: 150, height: 50 }
        ],
        carrots: [
            { id: 1, x: 275, y: 330 }
        ],
        obstacles: [],
        goal: { x: 500, y: 120, width: 50, height: 50 },
        hint: "Move right, jump, wait, move right, jump, wait, move left (or jump left platform), jump..."
    },
    
    13: {
        name: "Master Challenge",
        instructions: `
            <p>The ultimate test! 🏆</p>
            <p><strong>Goal:</strong> Collect all carrots, avoid all obstacles, and reach the goal!</p>
            <ul>
                <li>This is the hardest level combining everything</li>
                <li>Plan your entire route before coding</li>
                <li>Use all the skills you've learned</li>
                <li>Take your time and think it through!</li>
            </ul>
        `,
        startX: 50,
        startY: 400,
        groundY: 450,
        platforms: [
            { x: 0, y: 450, width: 150, height: 50 },
            { x: 250, y: 400, width: 100, height: 50 },
            { x: 450, y: 350, width: 100, height: 50 },
            { x: 600, y: 400, width: 150, height: 50 }
        ],
        carrots: [
            { id: 1, x: 125, y: 380 },
            { id: 2, x: 300, y: 350 },
            { id: 3, x: 500, y: 300 },
            { id: 4, x: 675, y: 350 }
        ],
        obstacles: [
            { x: 180, y: 440, width: 50, height: 10 },
            { x: 550, y: 440, width: 50, height: 10 }
        ],
        goal: { x: 700, y: 350, width: 50, height: 50 },
        hint: "Break it down: collect carrot 1, jump to platform 2, collect carrot 2, jump over spike, collect carrot 3, jump to platform 4, collect carrot 4, reach goal"
    },
    
    14: {
        name: "Bunny Parkour",
        instructions: `
            <p>Test your parkour skills! 🏃</p>
            <p><strong>Goal:</strong> Jump across multiple small platforms!</p>
            <ul>
                <li>Small platforms require precise timing</li>
                <li>Use small step values for better control</li>
                <li>Practice makes perfect!</li>
            </ul>
        `,
        startX: 50,
        startY: 400,
        groundY: 450,
        platforms: [
            { x: 0, y: 450, width: 80, height: 50 },
            { x: 150, y: 420, width: 80, height: 50 },
            { x: 300, y: 390, width: 80, height: 50 },
            { x: 450, y: 360, width: 80, height: 50 },
            { x: 600, y: 330, width: 80, height: 50 }
        ],
        carrots: [],
        obstacles: [],
        goal: { x: 700, y: 280, width: 50, height: 50 },
        hint: "Small moves: move_right(3)\njump()\nwait(0.5)\nmove_right(3)\njump()\nwait(0.5)..."
    },
    
    15: {
        name: "Carrot Maze",
        instructions: `
            <p>Find all the carrots in the maze! 🔍</p>
            <p><strong>Goal:</strong> Collect all 5 carrots hidden in the maze!</p>
            <ul>
                <li>Some carrots are hard to reach</li>
                <li>You'll need to explore different paths</li>
                <li>Don't give up!</li>
            </ul>
        `,
        startX: 50,
        startY: 400,
        groundY: 450,
        platforms: [
            { x: 0, y: 450, width: 120, height: 50 },
            { x: 150, y: 400, width: 120, height: 50 },
            { x: 300, y: 450, width: 120, height: 50 },
            { x: 450, y: 380, width: 120, height: 50 },
            { x: 600, y: 450, width: 120, height: 50 }
        ],
        carrots: [
            { id: 1, x: 210, y: 350 },
            { id: 2, x: 360, y: 400 },
            { id: 3, x: 510, y: 330 },
            { id: 4, x: 660, y: 400 },
            { id: 5, x: 50, y: 400 }
        ],
        obstacles: [
            { x: 280, y: 440, width: 30, height: 10 }
        ],
        goal: { x: 700, y: 400, width: 50, height: 50 },
        hint: "Plan your route to visit all platforms and collect carrots"
    }
};
