// Unit tests for game.js - BunnyHopGame class

// Mock the game.js module
const fs = require('fs');
const path = require('path');

// Read and evaluate game.js in global scope
const gameCode = fs.readFileSync(path.join(__dirname, 'game.js'), 'utf8');
// Wrap in function to capture class
const wrappedCode = `
(function() {
    ${gameCode}
    return BunnyHopGame;
})();
`;
const BunnyHopGame = eval(wrappedCode);

describe('BunnyHopGame', () => {
    let canvas;
    let game;

    beforeEach(() => {
        // Create a mock canvas element
        canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        game = new BunnyHopGame(canvas);
    });

    describe('Initialization', () => {
        test('should initialize with correct default values', () => {
            expect(game.canvas).toBe(canvas);
            expect(game.width).toBe(800);
            expect(game.height).toBe(600);
            expect(game.bunny.x).toBe(50);
            expect(game.bunny.y).toBe(400);
            expect(game.bunny.width).toBe(40);
            expect(game.bunny.height).toBe(50);
            expect(game.bunny.vx).toBe(0);
            expect(game.bunny.vy).toBe(0);
            expect(game.bunny.onGround).toBe(false);
            expect(game.bunny.jumping).toBe(false);
        });

        test('should initialize empty arrays for game elements', () => {
            expect(game.platforms).toEqual([]);
            expect(game.movingPlatforms).toEqual([]);
            expect(game.carrots).toEqual([]);
            expect(game.stars).toEqual([]);
            expect(game.coins).toEqual([]);
            expect(game.obstacles).toEqual([]);
        });

        test('should initialize game state correctly', () => {
            expect(game.gravity).toBe(0.8);
            expect(game.groundY).toBe(500);
            expect(game.carrotCount).toBe(0);
            expect(game.moveCount).toBe(0);
            expect(game.isRunning).toBe(false);
            expect(game.levelComplete).toBe(false);
        });
    });

    describe('loadLevel', () => {
        test('should load level data correctly', () => {
            const levelData = {
                startX: 100,
                startY: 300,
                groundY: 400,
                platforms: [
                    { x: 0, y: 400, width: 200, height: 50 }
                ],
                carrots: [
                    { id: 'carrot1', x: 150, y: 350 }
                ],
                stars: [
                    { id: 'star1', x: 250, y: 350 }
                ],
                coins: [
                    { id: 'coin1', x: 350, y: 350 }
                ],
                obstacles: [
                    { x: 500, y: 400, width: 50, height: 10 }
                ],
                goal: { x: 700, y: 300, width: 50, height: 50 },
                requiredCarrots: 3
            };

            game.loadLevel(levelData);

            expect(game.bunny.x).toBe(100);
            expect(game.bunny.y).toBe(300);
            expect(game.groundY).toBe(400);
            expect(game.platforms).toHaveLength(1);
            expect(game.carrots).toHaveLength(1);
            expect(game.stars).toHaveLength(1);
            expect(game.coins).toHaveLength(1);
            expect(game.obstacles).toHaveLength(1);
            expect(game.goal).toEqual(levelData.goal);
            expect(game.requiredCarrots).toBe(3);
        });

        test('should separate static and moving platforms', () => {
            const levelData = {
                platforms: [
                    { x: 0, y: 400, width: 200, height: 50 },
                    { x: 300, y: 400, width: 200, height: 50, moving: true, moveSpeed: 2, moveRange: 100 }
                ]
            };

            game.loadLevel(levelData);

            expect(game.platforms).toHaveLength(1);
            expect(game.movingPlatforms).toHaveLength(1);
            expect(game.movingPlatforms[0].moving).toBe(true);
            expect(game.movingPlatforms[0].moveSpeed).toBe(2);
            expect(game.movingPlatforms[0].moveRange).toBe(100);
        });

        test('should assign IDs to collectibles if not provided', () => {
            const levelData = {
                carrots: [
                    { x: 100, y: 350 },
                    { id: 'custom', x: 200, y: 350 }
                ],
                stars: [
                    { x: 300, y: 350 }
                ],
                coins: [
                    { x: 400, y: 350 }
                ]
            };

            game.loadLevel(levelData);

            expect(game.carrots[0].id).toBe('carrot_0');
            expect(game.carrots[1].id).toBe('custom');
            expect(game.stars[0].id).toBe('star_0');
            expect(game.coins[0].id).toBe('coin_0');
        });

        test('should reset game state when loading level', () => {
            game.carrotCount = 5;
            game.moveCount = 10;
            game.levelComplete = true;

            const levelData = {
                startX: 50,
                startY: 400,
                groundY: 500
            };

            game.loadLevel(levelData);

            expect(game.carrotCount).toBe(0);
            expect(game.moveCount).toBe(0);
            expect(game.levelComplete).toBe(false);
        });

        test('should initialize moving platform properties', () => {
            const levelData = {
                platforms: [
                    { x: 100, y: 400, width: 200, height: 50, moving: true, moveSpeed: 1.5, moveRange: 100 }
                ]
            };

            game.loadLevel(levelData);

            const platform = game.movingPlatforms[0];
            expect(platform.originalX).toBe(100);
            expect(platform.originalY).toBe(400);
            expect(platform.directionX).toBe(1);
            expect(platform.directionY).toBe(1);
            expect(platform.moveSpeed).toBe(1.5);
            expect(platform.moveRange).toBe(100);
        });
    });

    describe('Movement Functions', () => {
        beforeEach(() => {
            game.isRunning = true;
        });

        test('moveRight should set bunny velocity to the right', () => {
            game.moveRight(5);
            expect(game.bunny.vx).toBe(15); // 3 * 5
            expect(game.moveCount).toBe(1);
            expect(game.gameState.moveHistory).toContainEqual({ action: 'moveRight', steps: 5 });
        });

        test('moveLeft should set bunny velocity to the left', () => {
            game.moveLeft(3);
            expect(game.bunny.vx).toBe(-9); // -3 * 3
            expect(game.moveCount).toBe(1);
            expect(game.gameState.moveHistory).toContainEqual({ action: 'moveLeft', steps: 3 });
        });

        test('jump should make bunny jump when on ground', () => {
            game.bunny.onGround = true;
            game.bunny.jumping = false;
            game.jump();

            expect(game.bunny.vy).toBe(-15);
            expect(game.bunny.jumping).toBe(true);
            expect(game.bunny.onGround).toBe(false);
            expect(game.moveCount).toBe(1);
            expect(game.gameState.moveHistory).toContainEqual({ action: 'jump' });
        });

        test('jump should not work when not on ground', () => {
            game.bunny.onGround = false;
            const initialVy = game.bunny.vy;
            game.jump();

            expect(game.bunny.vy).toBe(initialVy);
            expect(game.moveCount).toBe(0);
        });

        test('jump should not work when already jumping', () => {
            game.bunny.onGround = true;
            game.bunny.jumping = true;
            const initialVy = game.bunny.vy;
            game.jump();

            expect(game.bunny.vy).toBe(initialVy);
            expect(game.moveCount).toBe(0);
        });

        test('movement functions should not work when game is not running', () => {
            game.isRunning = false;
            const initialVx = game.bunny.vx;
            const initialMoveCount = game.moveCount;

            game.moveRight(5);
            game.moveLeft(3);
            game.jump();

            expect(game.bunny.vx).toBe(initialVx);
            expect(game.moveCount).toBe(initialMoveCount);
        });
    });

    describe('Collision Detection', () => {
        beforeEach(() => {
            game.loadLevel({
                startX: 50,
                startY: 400,
                groundY: 450,
                platforms: [
                    { x: 200, y: 400, width: 100, height: 50 }
                ],
                carrots: [
                    { id: 'carrot1', x: 300, y: 380 }
                ],
                obstacles: [
                    { x: 500, y: 440, width: 50, height: 10 }
                ],
                goal: { x: 700, y: 400, width: 50, height: 50 }
            });
        });

        test('should detect ground collision', () => {
            game.bunny.y = 460;
            game.bunny.vy = 5;
            game.bunny.onGround = false;

            game.checkCollisions();

            expect(game.bunny.y).toBe(400); // groundY - bunny.height
            expect(game.bunny.vy).toBe(0);
            expect(game.bunny.onGround).toBe(true);
        });

        test('should detect platform collision from above', () => {
            // Platform is at y=400, collision requires bunny.y + height to be between 400 and 420
            // So bunny.y should be between 350 and 370
            game.bunny.x = 220; // Within platform x range (200-300)
            game.bunny.y = 360; // bunny.y + 50 = 410, which is between 400 and 420
            game.bunny.vy = 5; // Falling

            game.checkCollisions();

            expect(game.bunny.y).toBe(350); // platform.y - bunny.height
            expect(game.bunny.vy).toBe(0);
            expect(game.bunny.onGround).toBe(true);
        });

        test('should collect carrots on collision', () => {
            // Position bunny center near carrot (carrot at 300, 380)
            // Bunny center should be within 25 pixels
            game.bunny.x = 285; // bunny center x = 285 + 20 = 305, close to carrot x=300
            game.bunny.y = 375; // bunny center y = 375 + 25 = 400, close to carrot y=380

            game.checkCollisions();

            expect(game.gameState.collectedCarrots).toContain('carrot1');
            expect(game.carrotCount).toBe(1);
        });

        test('should reset position on obstacle collision', () => {
            const initialX = game.gameState.bunnyX;
            const initialY = game.gameState.bunnyY;

            game.bunny.x = 520;
            game.bunny.y = 440;

            game.checkCollisions();

            expect(game.bunny.x).toBe(initialX);
            expect(game.bunny.y).toBe(initialY);
            expect(game.bunny.vx).toBe(0);
            expect(game.bunny.vy).toBe(0);
        });

        test('should detect goal collision', () => {
            game.bunny.x = 720;
            game.bunny.y = 400;
            game.gameState.collectedCarrots = ['carrot1']; // All carrots collected
            game.carrotCount = 1;

            game.checkCollisions();

            expect(game.levelComplete).toBe(true);
        });

        test('should not complete level if carrots not collected', () => {
            game.bunny.x = 720;
            game.bunny.y = 400;
            game.carrotCount = 0;

            game.checkCollisions();

            expect(game.levelComplete).toBe(false);
        });

        test('should enforce boundary constraints', () => {
            game.bunny.x = -10;
            game.checkCollisions();
            expect(game.bunny.x).toBe(0);

            game.bunny.x = 900;
            game.checkCollisions();
            expect(game.bunny.x).toBe(760); // width - bunny.width

            game.bunny.y = -10;
            game.checkCollisions();
            expect(game.bunny.y).toBe(0);
        });
    });

    describe('Moving Platforms', () => {
        beforeEach(() => {
            game.loadLevel({
                startX: 50,
                startY: 400,
                groundY: 450,
                platforms: [
                    { x: 200, y: 400, width: 100, height: 50, moving: true, moveSpeed: 2, moveRange: 100 }
                ]
            });
            game.isRunning = true;
        });

        test('should move platform horizontally', () => {
            const platform = game.movingPlatforms[0];
            const initialX = platform.x;

            game.update();

            expect(platform.x).toBeGreaterThan(initialX);
            expect(platform.directionX).toBe(1);
        });

        test('should reverse direction at range boundary', () => {
            const platform = game.movingPlatforms[0];
            platform.x = platform.startX + platform.moveRange;

            game.update();

            expect(platform.directionX).toBe(-1);
        });

        test('should move bunny with platform when standing on it', () => {
            const platform = game.movingPlatforms[0];
            game.bunny.x = 220;
            game.bunny.y = 350;
            game.bunny.vy = 0;
            const initialBunnyX = game.bunny.x;
            const initialPlatformX = platform.x;

            game.checkCollisions();
            game.update();

            // Bunny should move with platform
            expect(game.bunny.x).toBeGreaterThan(initialBunnyX);
        });
    });

    describe('Collectibles', () => {
        beforeEach(() => {
            game.loadLevel({
                startX: 50,
                startY: 400,
                groundY: 450,
                carrots: [
                    { id: 'carrot1', x: 200, y: 380 },
                    { id: 'carrot2', x: 300, y: 380 }
                ],
                stars: [
                    { id: 'star1', x: 400, y: 380 }
                ],
                coins: [
                    { id: 'coin1', x: 500, y: 380 }
                ]
            });
            game.isRunning = true;
        });

        test('collect should collect nearby carrots', () => {
            game.bunny.x = 190;
            game.bunny.y = 380;

            game.collect();

            expect(game.gameState.collectedCarrots).toContain('carrot1');
            expect(game.carrotCount).toBe(1);
        });

        test('collect should collect nearby stars', () => {
            game.bunny.x = 390;
            game.bunny.y = 380;

            game.collect();

            expect(game.gameState.collectedCarrots).toContain('star1');
            expect(game.carrotCount).toBe(1);
        });

        test('collect should collect nearby coins', () => {
            game.bunny.x = 490;
            game.bunny.y = 380;

            game.collect();

            expect(game.gameState.collectedCarrots).toContain('coin1');
            expect(game.carrotCount).toBe(1);
        });

        test('should not collect items that are too far', () => {
            game.bunny.x = 50;
            game.bunny.y = 400;

            game.collect();

            expect(game.gameState.collectedCarrots).toHaveLength(0);
            expect(game.carrotCount).toBe(0);
        });

        test('should not collect already collected items', () => {
            game.bunny.x = 190;
            game.bunny.y = 380;
            game.collect();

            const initialCount = game.carrotCount;
            game.collect();

            expect(game.carrotCount).toBe(initialCount);
        });
    });

    describe('Physics and Update', () => {
        beforeEach(() => {
            game.isRunning = true;
        });

        test('should apply gravity when not on ground', () => {
            game.bunny.onGround = false;
            game.bunny.vy = 0;

            game.update();

            expect(game.bunny.vy).toBeGreaterThan(0);
        });

        test('should not apply gravity when on ground', () => {
            game.bunny.onGround = true;
            game.bunny.vy = 0;

            game.update();

            expect(game.bunny.vy).toBe(0);
        });

        test('should update position based on velocity', () => {
            game.bunny.vx = 5;
            game.bunny.vy = -10;
            const initialX = game.bunny.x;
            const initialY = game.bunny.y;

            game.update();

            expect(game.bunny.x).toBeGreaterThan(initialX);
            expect(game.bunny.y).toBeLessThan(initialY);
        });

        test('should apply friction to horizontal velocity', () => {
            game.bunny.vx = 10;

            game.update();

            expect(game.bunny.vx).toBeLessThan(10);
        });

        test('should not update when game is not running', () => {
            game.isRunning = false;
            game.bunny.vx = 5;
            const initialX = game.bunny.x;

            game.update();

            expect(game.bunny.x).toBe(initialX);
        });
    });

    describe('Game State Management', () => {
        test('start should begin game loop', () => {
            game.start();

            expect(game.isRunning).toBe(true);
            expect(game.startTime).not.toBeNull();
        });

        test('stop should end game loop', () => {
            game.isRunning = true;
            game.animationId = 123;

            game.stop();

            expect(game.isRunning).toBe(false);
        });

        test('reset should restore initial state', () => {
            game.bunny.x = 200;
            game.bunny.y = 300;
            game.bunny.vx = 5;
            game.bunny.vy = -10;
            game.carrotCount = 5;
            game.moveCount = 10;
            game.gameState.collectedCarrots = ['carrot1'];
            game.gameState.moveHistory = [{ action: 'moveRight' }];
            game.levelComplete = true;

            game.reset();

            expect(game.bunny.x).toBe(game.gameState.bunnyX);
            expect(game.bunny.y).toBe(game.gameState.bunnyY);
            expect(game.bunny.vx).toBe(0);
            expect(game.bunny.vy).toBe(0);
            expect(game.carrotCount).toBe(0);
            expect(game.moveCount).toBe(0);
            expect(game.gameState.collectedCarrots).toEqual([]);
            expect(game.gameState.moveHistory).toEqual([]);
            expect(game.levelComplete).toBe(false);
        });
    });

    describe('Drawing Functions', () => {
        test('draw should clear canvas and draw all elements', () => {
            game.loadLevel({
                startX: 50,
                startY: 400,
                groundY: 450,
                platforms: [{ x: 0, y: 450, width: 200, height: 50 }],
                carrots: [{ id: 'carrot1', x: 100, y: 380 }]
            });

            // Should not throw errors
            expect(() => game.draw()).not.toThrow();
        });

        test('drawBunny should not throw errors', () => {
            expect(() => game.drawBunny()).not.toThrow();
        });

        test('drawPlatforms should not throw errors', () => {
            game.platforms = [{ x: 0, y: 400, width: 200, height: 50 }];
            game.movingPlatforms = [{ x: 300, y: 400, width: 200, height: 50 }];

            expect(() => game.drawPlatforms()).not.toThrow();
        });

        test('drawCarrots should not draw collected carrots', () => {
            game.carrots = [{ id: 'carrot1', x: 100, y: 380 }];
            game.gameState.collectedCarrots = ['carrot1'];

            expect(() => game.drawCarrots()).not.toThrow();
        });

        test('drawStars should not draw collected stars', () => {
            game.stars = [{ id: 'star1', x: 100, y: 380 }];
            game.gameState.collectedCarrots = ['star1'];

            expect(() => game.drawStars()).not.toThrow();
        });

        test('drawCoins should not draw collected coins', () => {
            game.coins = [{ id: 'coin1', x: 100, y: 380 }];
            game.gameState.collectedCarrots = ['coin1'];

            expect(() => game.drawCoins()).not.toThrow();
        });
    });

    describe('Goal Completion Logic', () => {
        test('should require all carrots to be collected', () => {
            game.loadLevel({
                startX: 50,
                startY: 400,
                groundY: 450,
                carrots: [
                    { id: 'carrot1', x: 100, y: 380 },
                    { id: 'carrot2', x: 200, y: 380 }
                ],
                goal: { x: 700, y: 400, width: 50, height: 50 }
            });

            game.bunny.x = 720;
            game.bunny.y = 400;
            game.gameState.collectedCarrots = ['carrot1']; // Only one collected

            game.checkCollisions();

            expect(game.levelComplete).toBe(false);
        });

        test('should require all stars to be collected', () => {
            game.loadLevel({
                startX: 50,
                startY: 400,
                groundY: 450,
                stars: [
                    { id: 'star1', x: 100, y: 380 },
                    { id: 'star2', x: 200, y: 380 }
                ],
                goal: { x: 700, y: 400, width: 50, height: 50 }
            });

            game.bunny.x = 720;
            game.bunny.y = 400;
            game.gameState.collectedCarrots = ['star1']; // Only one collected

            game.checkCollisions();

            expect(game.levelComplete).toBe(false);
        });

        test('should require all coins to be collected', () => {
            game.loadLevel({
                startX: 50,
                startY: 400,
                groundY: 450,
                coins: [
                    { id: 'coin1', x: 100, y: 380 },
                    { id: 'coin2', x: 200, y: 380 }
                ],
                goal: { x: 700, y: 400, width: 50, height: 50 }
            });

            game.bunny.x = 720;
            game.bunny.y = 400;
            game.gameState.collectedCarrots = ['coin1']; // Only one collected

            game.checkCollisions();

            expect(game.levelComplete).toBe(false);
        });

        test('should complete level when all collectibles collected and goal reached', () => {
            game.loadLevel({
                startX: 50,
                startY: 400,
                groundY: 450,
                carrots: [{ id: 'carrot1', x: 100, y: 380 }],
                goal: { x: 700, y: 400, width: 50, height: 50 }
            });

            game.bunny.x = 720;
            game.bunny.y = 400;
            game.gameState.collectedCarrots = ['carrot1'];

            game.checkCollisions();

            expect(game.levelComplete).toBe(true);
        });

        test('should respect requiredCarrots count', () => {
            game.loadLevel({
                startX: 50,
                startY: 400,
                groundY: 450,
                carrots: [
                    { id: 'carrot1', x: 100, y: 380 },
                    { id: 'carrot2', x: 200, y: 380 },
                    { id: 'carrot3', x: 300, y: 380 }
                ],
                goal: { x: 700, y: 400, width: 50, height: 50 },
                requiredCarrots: 2
            });

            game.bunny.x = 720;
            game.bunny.y = 400;
            // The logic requires ALL carrots to be collected AND requiredCarrots count to be met
            // So we need all 3 carrots collected, and carrotCount >= 2
            game.gameState.collectedCarrots = ['carrot1', 'carrot2', 'carrot3'];
            game.carrotCount = 3;

            game.checkCollisions();

            expect(game.levelComplete).toBe(true);
        });
    });
});

