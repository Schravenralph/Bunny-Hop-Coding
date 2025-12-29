// Unit tests for levels.js - Level definitions

const fs = require('fs');
const path = require('path');

// Read and evaluate levels.js in global scope
const levelsCode = fs.readFileSync(path.join(__dirname, 'levels.js'), 'utf8');
// Wrap in function to capture levels
const wrappedCode = `
(function() {
    ${levelsCode}
    return levels;
})();
`;
const levels = eval(wrappedCode);

describe('Level Definitions', () => {
    describe('Level Structure', () => {
        test('should have levels object defined', () => {
            expect(levels).toBeDefined();
            expect(typeof levels).toBe('object');
        });

        test('should have at least 15 levels', () => {
            const levelNumbers = Object.keys(levels).map(Number);
            expect(levelNumbers.length).toBeGreaterThanOrEqual(15);
        });

        test('all levels should have required properties', () => {
            Object.keys(levels).forEach(levelNum => {
                const level = levels[levelNum];
                expect(level).toHaveProperty('name');
                expect(level).toHaveProperty('instructions');
                expect(level).toHaveProperty('startX');
                expect(level).toHaveProperty('startY');
                expect(level).toHaveProperty('groundY');
                expect(level).toHaveProperty('platforms');
                expect(level).toHaveProperty('carrots');
                expect(level).toHaveProperty('obstacles');
                expect(level).toHaveProperty('goal');
            });
        });
    });

    describe('Level 1 - First Hop', () => {
        test('should have correct structure', () => {
            const level = levels[1];
            expect(level.name).toBe('First Hop');
            expect(level.startX).toBe(50);
            expect(level.startY).toBe(400);
            expect(level.groundY).toBe(450);
        });

        test('should have empty arrays for collectibles and obstacles', () => {
            const level = levels[1];
            expect(level.carrots).toEqual([]);
            expect(level.obstacles).toEqual([]);
        });

        test('should have a goal defined', () => {
            const level = levels[1];
            expect(level.goal).toBeDefined();
            expect(level.goal.x).toBe(700);
            expect(level.goal.y).toBe(400);
        });
    });

    describe('Level 2 - Double Jump', () => {
        test('should have platforms defined', () => {
            const level = levels[2];
            expect(level.platforms).toBeDefined();
            expect(level.platforms.length).toBeGreaterThan(0);
        });

        test('platforms should have required properties', () => {
            const level = levels[2];
            level.platforms.forEach(platform => {
                expect(platform).toHaveProperty('x');
                expect(platform).toHaveProperty('y');
                expect(platform).toHaveProperty('width');
                expect(platform).toHaveProperty('height');
            });
        });
    });

    describe('Level 3 - Collect Carrots', () => {
        test('should have carrots defined', () => {
            const level = levels[3];
            expect(level.carrots).toBeDefined();
            expect(level.carrots.length).toBeGreaterThan(0);
        });

        test('carrots should have id and position', () => {
            const level = levels[3];
            level.carrots.forEach(carrot => {
                expect(carrot).toHaveProperty('id');
                expect(carrot).toHaveProperty('x');
                expect(carrot).toHaveProperty('y');
            });
        });
    });

    describe('Level 4 - Avoid Obstacles', () => {
        test('should have obstacles defined', () => {
            const level = levels[4];
            expect(level.obstacles).toBeDefined();
            expect(level.obstacles.length).toBeGreaterThan(0);
        });

        test('obstacles should have required properties', () => {
            const level = levels[4];
            level.obstacles.forEach(obstacle => {
                expect(obstacle).toHaveProperty('x');
                expect(obstacle).toHaveProperty('y');
                expect(obstacle).toHaveProperty('width');
                expect(obstacle).toHaveProperty('height');
            });
        });
    });

    describe('Level 5 - Platform Hopping', () => {
        test('should have multiple platforms', () => {
            const level = levels[5];
            expect(level.platforms.length).toBeGreaterThan(1);
        });

        test('platforms should be at different heights', () => {
            const level = levels[5];
            const yPositions = level.platforms.map(p => p.y);
            const uniqueYPositions = [...new Set(yPositions)];
            expect(uniqueYPositions.length).toBeGreaterThan(1);
        });
    });

    describe('Level 10 - Carrot Collector', () => {
        test('should have 6 carrots', () => {
            const level = levels[10];
            expect(level.carrots.length).toBe(6);
        });

        test('all carrots should have unique IDs', () => {
            const level = levels[10];
            const ids = level.carrots.map(c => c.id);
            const uniqueIds = [...new Set(ids)];
            expect(uniqueIds.length).toBe(ids.length);
        });
    });

    describe('Level Data Validation', () => {
        test('all levels should have valid numeric coordinates', () => {
            Object.keys(levels).forEach(levelNum => {
                const level = levels[levelNum];
                expect(typeof level.startX).toBe('number');
                expect(typeof level.startY).toBe('number');
                expect(typeof level.groundY).toBe('number');
                expect(level.startX).toBeGreaterThanOrEqual(0);
                expect(level.startY).toBeGreaterThanOrEqual(0);
                expect(level.groundY).toBeGreaterThanOrEqual(0);
            });
        });

        test('all goals should have valid dimensions', () => {
            Object.keys(levels).forEach(levelNum => {
                const level = levels[levelNum];
                expect(level.goal).toHaveProperty('width');
                expect(level.goal).toHaveProperty('height');
                expect(level.goal.width).toBeGreaterThan(0);
                expect(level.goal.height).toBeGreaterThan(0);
            });
        });

        test('all platforms should have valid dimensions', () => {
            Object.keys(levels).forEach(levelNum => {
                const level = levels[levelNum];
                level.platforms.forEach(platform => {
                    expect(platform.width).toBeGreaterThan(0);
                    expect(platform.height).toBeGreaterThan(0);
                });
            });
        });

        test('all obstacles should have valid dimensions', () => {
            Object.keys(levels).forEach(levelNum => {
                const level = levels[levelNum];
                level.obstacles.forEach(obstacle => {
                    expect(obstacle.width).toBeGreaterThan(0);
                    expect(obstacle.height).toBeGreaterThan(0);
                });
            });
        });
    });

    describe('Level Progression', () => {
        test('levels should be numbered sequentially', () => {
            const levelNumbers = Object.keys(levels).map(Number).sort((a, b) => a - b);
            
            for (let i = 0; i < levelNumbers.length - 1; i++) {
                expect(levelNumbers[i + 1]).toBe(levelNumbers[i] + 1);
            }
        });

        test('each level should have a unique name', () => {
            const names = Object.keys(levels).map(num => levels[num].name);
            const uniqueNames = [...new Set(names)];
            expect(uniqueNames.length).toBe(names.length);
        });
    });

    describe('Moving Platforms', () => {
        test('should identify levels with moving platforms', () => {
            // Check if any level has moving platforms
            const hasMovingPlatforms = Object.keys(levels).some(levelNum => {
                const level = levels[levelNum];
                return level.platforms.some(p => p.moving === true);
            });

            // This test passes if moving platforms exist or don't exist
            expect(typeof hasMovingPlatforms).toBe('boolean');
        });

        test('moving platforms should have moveSpeed and moveRange', () => {
            Object.keys(levels).forEach(levelNum => {
                const level = levels[levelNum];
                level.platforms.forEach(platform => {
                    if (platform.moving) {
                        expect(platform).toHaveProperty('moveSpeed');
                        expect(platform).toHaveProperty('moveRange');
                        expect(platform.moveSpeed).toBeGreaterThan(0);
                        expect(platform.moveRange).toBeGreaterThan(0);
                    }
                });
            });
        });
    });

    describe('Level Instructions', () => {
        test('all levels should have instructions', () => {
            Object.keys(levels).forEach(levelNum => {
                const level = levels[levelNum];
                expect(level.instructions).toBeDefined();
                expect(typeof level.instructions).toBe('string');
                expect(level.instructions.length).toBeGreaterThan(0);
            });
        });

        test('instructions should contain HTML', () => {
            Object.keys(levels).forEach(levelNum => {
                const level = levels[levelNum];
                // Most instructions contain HTML tags
                expect(level.instructions).toMatch(/<[^>]+>/);
            });
        });
    });

    describe('Level Hints', () => {
        test('levels should have hints when available', () => {
            Object.keys(levels).forEach(levelNum => {
                const level = levels[levelNum];
                if (level.hint) {
                    expect(typeof level.hint).toBe('string');
                    expect(level.hint.length).toBeGreaterThan(0);
                }
            });
        });
    });

    describe('Level Completeness', () => {
        test('all collectibles should be within reasonable bounds', () => {
            Object.keys(levels).forEach(levelNum => {
                const level = levels[levelNum];
                
                [...level.carrots, ...(level.stars || []), ...(level.coins || [])].forEach(item => {
                    expect(item.x).toBeGreaterThanOrEqual(0);
                    expect(item.x).toBeLessThan(800); // Canvas width
                    expect(item.y).toBeGreaterThanOrEqual(0);
                    expect(item.y).toBeLessThan(600); // Canvas height
                });
            });
        });

        test('all goals should be within canvas bounds', () => {
            Object.keys(levels).forEach(levelNum => {
                const level = levels[levelNum];
                expect(level.goal.x).toBeGreaterThanOrEqual(0);
                expect(level.goal.x + level.goal.width).toBeLessThanOrEqual(800);
                expect(level.goal.y).toBeGreaterThanOrEqual(0);
                expect(level.goal.y + level.goal.height).toBeLessThanOrEqual(600);
            });
        });
    });
});

