// Game Engine for Bunny Hop Coding Adventure

class BunnyHopGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        this.bunny = {
            x: 50,
            y: 400,
            width: 40,
            height: 50,
            vx: 0,
            vy: 0,
            onGround: false,
            jumping: false,
            color: '#FF69B4'
        };
        
        this.platforms = [];
        this.movingPlatforms = [];
        this.carrots = [];
        this.obstacles = [];
        this.goal = null;
        this.gravity = 0.8;
        this.groundY = 500;
        this.carrotCount = 0;
        this.moveCount = 0;
        this.startTime = null;
        this.currentTime = 0;
        this.animationId = null;
        this.isRunning = false;
        this.levelComplete = false;
        this.stars = [];
        this.coins = [];
        
        // Game state
        this.gameState = {
            bunnyX: 50,
            bunnyY: 400,
            collectedCarrots: [],
            moveHistory: []
        };
    }
    
    loadLevel(levelData) {
        // Separate static and moving platforms
        this.platforms = [];
        this.movingPlatforms = [];
        
        (levelData.platforms || []).forEach(platform => {
            if (platform.moving) {
                this.movingPlatforms.push({
                    ...platform,
                    originalX: platform.x,
                    originalY: platform.y,
                    directionX: 1,
                    directionY: 1,
                    moveSpeed: platform.moveSpeed || 1.5,
                    moveRange: platform.moveRange || 100,
                    startX: platform.x
                });
            } else {
                this.platforms.push(platform);
            }
        });
        
        this.carrots = (levelData.carrots || []).map((c, i) => ({ ...c, id: c.id || `carrot_${i}` }));
        this.stars = (levelData.stars || []).map((s, i) => ({ ...s, id: s.id || `star_${i}` }));
        this.coins = (levelData.coins || []).map((c, i) => ({ ...c, id: c.id || `coin_${i}` }));
        this.obstacles = levelData.obstacles || [];
        this.goal = levelData.goal || { x: 750, y: 400, width: 50, height: 50 };
        this.bunny.x = levelData.startX || 50;
        this.bunny.y = levelData.startY || 400;
        this.bunny.vx = 0;
        this.bunny.vy = 0;
        this.groundY = levelData.groundY || 500;
        // Initialize onGround state based on position
        this.bunny.onGround = (this.bunny.y + this.bunny.height >= this.groundY);
        this.bunny.jumping = false;
        this.carrotCount = 0;
        this.moveCount = 0;
        this.startTime = null; // Don't start timer until code runs
        this.levelComplete = false;
        this.requiredCarrots = levelData.requiredCarrots || 0;
        this.gameState.bunnyX = levelData.startX || 50;
        this.gameState.bunnyY = levelData.startY || 400;
        this.gameState.collectedCarrots = [];
        this.gameState.moveHistory = [];
        
        // Initialize moving platforms
        this.movingPlatforms.forEach(platform => {
            platform.x = platform.originalX || platform.startX || platform.x;
            platform.y = platform.originalY || platform.y;
            platform.directionX = 1;
            platform.directionY = 1;
        });
    }
    
    drawBunny() {
        const ctx = this.ctx;
        const b = this.bunny;
        
        // Save context for rotation if needed
        ctx.save();
        
        // Bunny body (fluffy white/light gray oval)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(b.x + b.width/2, b.y + b.height/2, b.width/2, b.height/2, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add some fluff texture
        ctx.fillStyle = '#F0F0F0';
        ctx.beginPath();
        ctx.arc(b.x + b.width/2 - 5, b.y + b.height/2 - 5, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(b.x + b.width/2 + 5, b.y + b.height/2 - 5, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // Bunny ears (long and floppy)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(b.x + b.width/2 - 10, b.y - 5, 7, 20, -0.4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(b.x + b.width/2 + 10, b.y - 5, 7, 20, 0.4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Inner ear (pink)
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.ellipse(b.x + b.width/2 - 10, b.y + 2, 4, 12, -0.4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(b.x + b.width/2 + 10, b.y + 2, 4, 12, 0.4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Eyes (big and cute)
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(b.x + b.width/2 - 10, b.y + b.height/2 - 8, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(b.x + b.width/2 + 10, b.y + b.height/2 - 8, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Eye shine
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(b.x + b.width/2 - 9, b.y + b.height/2 - 9, 1.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(b.x + b.width/2 + 9, b.y + b.height/2 - 9, 1.5, 0, 2 * Math.PI);
        ctx.fill();
        
        // Nose (small pink triangle)
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.moveTo(b.x + b.width/2, b.y + b.height/2 + 3);
        ctx.lineTo(b.x + b.width/2 - 3, b.y + b.height/2 + 8);
        ctx.lineTo(b.x + b.width/2 + 3, b.y + b.height/2 + 8);
        ctx.closePath();
        ctx.fill();
        
        // Mouth (small smile)
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(b.x + b.width/2, b.y + b.height/2 + 10, 5, 0, Math.PI);
        ctx.stroke();
        
        // Whiskers
        ctx.strokeStyle = '#888888';
        ctx.lineWidth = 1;
        // Left whiskers
        ctx.beginPath();
        ctx.moveTo(b.x + 5, b.y + b.height/2 + 5);
        ctx.lineTo(b.x - 5, b.y + b.height/2 + 3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(b.x + 5, b.y + b.height/2 + 8);
        ctx.lineTo(b.x - 5, b.y + b.height/2 + 8);
        ctx.stroke();
        // Right whiskers
        ctx.beginPath();
        ctx.moveTo(b.x + b.width - 5, b.y + b.height/2 + 5);
        ctx.lineTo(b.x + b.width + 5, b.y + b.height/2 + 3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(b.x + b.width - 5, b.y + b.height/2 + 8);
        ctx.lineTo(b.x + b.width + 5, b.y + b.height/2 + 8);
        ctx.stroke();
        
        // Feet (when on ground)
        if (b.onGround) {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.ellipse(b.x + b.width/2 - 8, b.y + b.height - 3, 6, 4, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(b.x + b.width/2 + 8, b.y + b.height - 3, 6, 4, 0, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    drawPlatforms() {
        // Draw static platforms
        this.ctx.fillStyle = '#8B4513';
        this.platforms.forEach(platform => {
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            // Add grass on top
            this.ctx.fillStyle = '#228B22';
            this.ctx.fillRect(platform.x, platform.y, platform.width, 5);
            this.ctx.fillStyle = '#8B4513';
        });
        
        // Draw moving platforms (darker brown to distinguish)
        this.movingPlatforms.forEach(platform => {
            this.ctx.fillStyle = '#654321';
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            // Add grass on top
            this.ctx.fillStyle = '#228B22';
            this.ctx.fillRect(platform.x, platform.y, platform.width, 5);
            // Add arrow indicator to show it's moving
            this.ctx.fillStyle = '#FFD700';
            this.ctx.beginPath();
            this.ctx.moveTo(platform.x + platform.width/2, platform.y - 12);
            this.ctx.lineTo(platform.x + platform.width/2 - 5, platform.y - 5);
            this.ctx.lineTo(platform.x + platform.width/2 + 5, platform.y - 5);
            this.ctx.closePath();
            this.ctx.fill();
        });
    }
    
    drawCarrots() {
        this.carrots.forEach(carrot => {
            if (!this.gameState.collectedCarrots.includes(carrot.id)) {
                // Carrot body
                this.ctx.fillStyle = '#FF8C00';
                this.ctx.beginPath();
                this.ctx.moveTo(carrot.x, carrot.y);
                this.ctx.lineTo(carrot.x + 15, carrot.y + 20);
                this.ctx.lineTo(carrot.x - 15, carrot.y + 20);
                this.ctx.closePath();
                this.ctx.fill();
                
                // Carrot top (green leaves)
                this.ctx.fillStyle = '#228B22';
                this.ctx.beginPath();
                this.ctx.moveTo(carrot.x, carrot.y);
                this.ctx.lineTo(carrot.x - 5, carrot.y - 10);
                this.ctx.lineTo(carrot.x + 5, carrot.y - 10);
                this.ctx.closePath();
                this.ctx.fill();
            }
        });
    }
    
    drawObstacles() {
        this.ctx.fillStyle = '#8B0000';
        this.obstacles.forEach(obstacle => {
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            // Add spikes
            this.ctx.fillStyle = '#FF0000';
            for (let i = 0; i < obstacle.width; i += 10) {
                this.ctx.beginPath();
                this.ctx.moveTo(obstacle.x + i, obstacle.y);
                this.ctx.lineTo(obstacle.x + i + 5, obstacle.y - 10);
                this.ctx.lineTo(obstacle.x + i + 10, obstacle.y);
                this.ctx.closePath();
                this.ctx.fill();
            }
            this.ctx.fillStyle = '#8B0000';
        });
    }
    
    drawGoal() {
        if (this.goal) {
            // Goal flag
            this.ctx.fillStyle = '#FFD700';
            this.ctx.fillRect(this.goal.x, this.goal.y, 10, this.goal.height);
            
            // Flag
            this.ctx.fillStyle = '#00FF00';
            this.ctx.beginPath();
            this.ctx.moveTo(this.goal.x + 10, this.goal.y);
            this.ctx.lineTo(this.goal.x + 10, this.goal.y + 20);
            this.ctx.lineTo(this.goal.x + 30, this.goal.y + 10);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }
    
    checkCollisions() {
        // Ground collision
        // Only apply ground collision if bunny is falling (vy >= 0) or not jumping
        // This allows the bunny to jump up from the ground without being immediately reset
        if (this.bunny.y + this.bunny.height >= this.groundY) {
            // If bunny is moving up (vy < 0) and actively jumping, don't apply ground collision yet
            // This allows the jump to initiate properly
            if (this.bunny.vy >= 0 || !this.bunny.jumping) {
                this.bunny.y = this.groundY - this.bunny.height;
                this.bunny.vy = 0;
                this.bunny.onGround = true;
                this.bunny.jumping = false;
            } else {
                // Bunny is jumping up but still at ground level - allow it to continue upward
                // Don't reset position or velocity, just mark as not on ground
                this.bunny.onGround = false;
            }
        } else {
            this.bunny.onGround = false;
        }
        
        // Platform collisions (static)
        let onPlatform = false;
        this.platforms.forEach(platform => {
            if (this.bunny.x + this.bunny.width > platform.x &&
                this.bunny.x < platform.x + platform.width &&
                this.bunny.y + this.bunny.height > platform.y &&
                this.bunny.y + this.bunny.height < platform.y + 20 &&
                this.bunny.vy >= 0) {
                this.bunny.y = platform.y - this.bunny.height;
                this.bunny.vy = 0;
                onPlatform = true;
                this.bunny.jumping = false;
            }
        });
        
        // Moving platform collisions
        this.movingPlatforms.forEach(platform => {
            if (this.bunny.x + this.bunny.width > platform.x &&
                this.bunny.x < platform.x + platform.width &&
                this.bunny.y + this.bunny.height > platform.y &&
                this.bunny.y + this.bunny.height < platform.y + 20 &&
                this.bunny.vy >= 0) {
                this.bunny.y = platform.y - this.bunny.height;
                this.bunny.vy = 0;
                onPlatform = true;
                this.bunny.jumping = false;
                // Move bunny with platform (X direction only, Y follows platform position automatically)
                if (platform.moveX !== false) {
                    this.bunny.x += platform.moveSpeed * platform.directionX;
                }
            }
        });
        
        if (onPlatform) {
            this.bunny.onGround = true;
        }
        
        // Carrot collection
        this.carrots.forEach((carrot, index) => {
            if (!this.gameState.collectedCarrots.includes(carrot.id)) {
                const dist = Math.sqrt(
                    Math.pow(this.bunny.x + this.bunny.width/2 - carrot.x, 2) +
                    Math.pow(this.bunny.y + this.bunny.height/2 - carrot.y, 2)
                );
                if (dist < 25) {
                    this.gameState.collectedCarrots.push(carrot.id);
                    this.carrotCount++;
                }
            }
        });
        
        // Star collection
        this.stars.forEach(star => {
            if (!this.gameState.collectedCarrots.includes(star.id)) {
                const dist = Math.sqrt(
                    Math.pow(this.bunny.x + this.bunny.width/2 - star.x, 2) +
                    Math.pow(this.bunny.y + this.bunny.height/2 - star.y, 2)
                );
                if (dist < 20) {
                    this.gameState.collectedCarrots.push(star.id);
                    this.carrotCount++;
                }
            }
        });
        
        // Coin collection
        this.coins.forEach(coin => {
            if (!this.gameState.collectedCarrots.includes(coin.id)) {
                const dist = Math.sqrt(
                    Math.pow(this.bunny.x + this.bunny.width/2 - coin.x, 2) +
                    Math.pow(this.bunny.y + this.bunny.height/2 - coin.y, 2)
                );
                if (dist < 20) {
                    this.gameState.collectedCarrots.push(coin.id);
                    this.carrotCount++;
                }
            }
        });
        
        // Obstacle collision
        this.obstacles.forEach(obstacle => {
            if (this.bunny.x + this.bunny.width > obstacle.x &&
                this.bunny.x < obstacle.x + obstacle.width &&
                this.bunny.y + this.bunny.height > obstacle.y &&
                this.bunny.y < obstacle.y + obstacle.height) {
                // Reset position on obstacle hit
                this.bunny.x = this.gameState.bunnyX;
                this.bunny.y = this.gameState.bunnyY;
                this.bunny.vx = 0;
                this.bunny.vy = 0;
            }
        });
        
        // Goal check
        if (this.goal && 
            this.bunny.x + this.bunny.width > this.goal.x &&
            this.bunny.x < this.goal.x + this.goal.width &&
            this.bunny.y + this.bunny.height > this.goal.y &&
            this.bunny.y < this.goal.y + this.goal.height) {
            // Check if all collectibles are collected (carrots, stars, coins)
            const allCarrotsCollected = this.carrots.length === 0 || 
                                       this.carrots.every(c => this.gameState.collectedCarrots.includes(c.id));
            const allStarsCollected = this.stars.length === 0 || 
                                     this.stars.every(s => this.gameState.collectedCarrots.includes(s.id));
            const allCoinsCollected = this.coins.length === 0 || 
                                     this.coins.every(c => this.gameState.collectedCarrots.includes(c.id));
            const requiredCarrotsMet = this.requiredCarrots === 0 || this.carrotCount >= this.requiredCarrots;
            if (allCarrotsCollected && allStarsCollected && allCoinsCollected && requiredCarrotsMet) {
                this.levelComplete = true;
            }
        }
        
        // Boundary checks
        if (this.bunny.x < 0) this.bunny.x = 0;
        if (this.bunny.x + this.bunny.width > this.width) this.bunny.x = this.width - this.bunny.width;
        if (this.bunny.y < 0) this.bunny.y = 0;
    }
    
    update() {
        if (!this.isRunning) return;
        
        // Update moving platforms
        this.movingPlatforms.forEach(platform => {
            // Default to moving in X direction if moveX is not explicitly set to false
            if (platform.moveX !== false) {
                platform.x += platform.moveSpeed * platform.directionX;
                const startX = platform.originalX || platform.startX || platform.x;
                // Reverse direction if out of range and clamp position
                if (platform.x > startX + platform.moveRange) {
                    platform.directionX = -1;
                    platform.x = startX + platform.moveRange; // Clamp to boundary
                } else if (platform.x < startX) {
                    platform.directionX = 1;
                    platform.x = startX; // Clamp to boundary
                }
            }
            // Default to not moving in Y direction unless moveY is explicitly set to true
            if (platform.moveY === true) {
                platform.y += platform.moveSpeed * platform.directionY;
                const startY = platform.originalY || platform.y;
                // Reverse direction if out of range and clamp position
                if (platform.y > startY + platform.moveRange) {
                    platform.directionY = -1;
                    platform.y = startY + platform.moveRange; // Clamp to boundary
                } else if (platform.y < startY) {
                    platform.directionY = 1;
                    platform.y = startY; // Clamp to boundary
                }
            }
        });
        
        // Apply gravity
        if (!this.bunny.onGround) {
            this.bunny.vy += this.gravity;
        }
        
        // Update position
        this.bunny.x += this.bunny.vx;
        this.bunny.y += this.bunny.vy;
        
        // Friction
        this.bunny.vx *= 0.9;
        
        this.checkCollisions();
        
        // Update time
        if (this.startTime) {
            this.currentTime = Math.floor((Date.now() - this.startTime) / 1000);
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw ground
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, this.groundY, this.width, this.height - this.groundY);
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(0, this.groundY, this.width, 10);
        
        // Draw game elements
        this.drawPlatforms();
        this.drawObstacles();
        this.drawCarrots();
        this.drawStars();
        this.drawCoins();
        this.drawGoal();
        this.drawBunny();
    }
    
    drawStars() {
        this.stars.forEach(star => {
            if (!this.gameState.collectedCarrots.includes(star.id)) {
                this.ctx.fillStyle = '#FFD700';
                this.ctx.beginPath();
                // Draw a star shape
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 4 * Math.PI / 5) - Math.PI / 2;
                    const x = star.x + 10 * Math.cos(angle);
                    const y = star.y + 10 * Math.sin(angle);
                    if (i === 0) this.ctx.moveTo(x, y);
                    else this.ctx.lineTo(x, y);
                }
                this.ctx.closePath();
                this.ctx.fill();
            }
        });
    }
    
    drawCoins() {
        this.coins.forEach(coin => {
            if (!this.gameState.collectedCarrots.includes(coin.id)) {
                this.ctx.fillStyle = '#FFD700';
                this.ctx.beginPath();
                this.ctx.arc(coin.x, coin.y, 8, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.strokeStyle = '#FFA500';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        });
    }
    
    animate() {
        this.update();
        this.draw();
        
        if (this.isRunning && !this.levelComplete) {
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startTime = Date.now();
            this.animate();
        }
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    reset() {
        this.stop();
        this.bunny.x = this.gameState.bunnyX;
        this.bunny.y = this.gameState.bunnyY;
        this.bunny.vx = 0;
        this.bunny.vy = 0;
        // Initialize onGround state based on position
        this.bunny.onGround = (this.bunny.y + this.bunny.height >= this.groundY);
        this.bunny.jumping = false;
        this.carrotCount = 0;
        this.moveCount = 0;
        this.gameState.collectedCarrots = [];
        this.gameState.moveHistory = [];
        this.levelComplete = false;
        this.startTime = null;
        this.currentTime = 0;
        this.draw();
    }
    
    // Movement functions exposed to Python
    moveRight(steps = 1) {
        if (!this.isRunning) return;
        this.moveCount++;
        // Accumulate velocity instead of overwriting to handle multiple sequential calls
        this.bunny.vx += 3 * steps;
        this.gameState.moveHistory.push({ action: 'moveRight', steps });
    }
    
    moveLeft(steps = 1) {
        if (!this.isRunning) return;
        this.moveCount++;
        // Accumulate velocity instead of overwriting to handle multiple sequential calls
        this.bunny.vx -= 3 * steps;
        this.gameState.moveHistory.push({ action: 'moveLeft', steps });
    }
    
    jump() {
        if (!this.isRunning) return;
        if (this.bunny.onGround && !this.bunny.jumping) {
            this.moveCount++;
            this.bunny.vy = -15;
            this.bunny.jumping = true;
            this.bunny.onGround = false;
            this.gameState.moveHistory.push({ action: 'jump' });
        }
    }
    
    wait(seconds) {
        // This will be handled by the Python execution system
        this.gameState.moveHistory.push({ action: 'wait', seconds });
    }
    
    collect() {
        if (!this.isRunning) return;
        // Check for nearby carrots
        this.carrots.forEach(carrot => {
            if (!this.gameState.collectedCarrots.includes(carrot.id)) {
                const dist = Math.sqrt(
                    Math.pow(this.bunny.x + this.bunny.width/2 - carrot.x, 2) +
                    Math.pow(this.bunny.y + this.bunny.height/2 - carrot.y, 2)
                );
                if (dist < 30) {
                    this.gameState.collectedCarrots.push(carrot.id);
                    this.carrotCount++;
                }
            }
        });
        
        // Check for nearby stars
        this.stars.forEach(star => {
            if (!this.gameState.collectedCarrots.includes(star.id)) {
                const dist = Math.sqrt(
                    Math.pow(this.bunny.x + this.bunny.width/2 - star.x, 2) +
                    Math.pow(this.bunny.y + this.bunny.height/2 - star.y, 2)
                );
                if (dist < 30) {
                    this.gameState.collectedCarrots.push(star.id);
                    this.carrotCount++;
                }
            }
        });
        
        // Check for nearby coins
        this.coins.forEach(coin => {
            if (!this.gameState.collectedCarrots.includes(coin.id)) {
                const dist = Math.sqrt(
                    Math.pow(this.bunny.x + this.bunny.width/2 - coin.x, 2) +
                    Math.pow(this.bunny.y + this.bunny.height/2 - coin.y, 2)
                );
                if (dist < 30) {
                    this.gameState.collectedCarrots.push(coin.id);
                    this.carrotCount++;
                }
            }
        });
    }
}

