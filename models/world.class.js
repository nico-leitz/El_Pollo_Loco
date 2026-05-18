/**
 * Represents the main game world engine.
 * Responsible for rendering the scene, managing the game loop, handling collisions, 
 * and synchronizing game states between the character, level, and UI.
 */
class World {
    /** @type {Character} The main playable character instance. */
    character = new Character();
    /** @type {Level} The current level container holding all enemies and objects. */
    level = level1;
    /** @type {HTMLCanvasElement} The HTML canvas element used for rendering. */
    canvas;
    /** @type {CanvasRenderingContext2D} The 2D rendering context of the canvas. */
    ctx;
    /** @type {Keyboard} The input listener tracking active key states. */
    keyboard;
    /** @type {number} The horizontal camera offset used for scrolling. */
    camera_x = 0;
    /** @type {HealthBar} Visual UI bar representing character health. */
    healthBar;
    /** @type {CoinBar} Visual UI bar representing collected coins. */
    coinBar;
    /** @type {BottleBar} Visual UI bar representing available salsa bottles. */
    bottleBar;
    /** @type {EndbossHealthBar} Visual UI bar representing the boss's health. */
    endbossHealthBar;
    /** @type {ThrowableObject[]} List of active flying projectile objects. */
    throwableObjects = [];
    /** @type {boolean} Flag to ensure the hint is only triggered once. */
    hintShown = false;
    /** @type {boolean} Controls the visibility of the speech bubble. */
    showHint = false;
    /** @type {boolean} State variable to ensure the boss approach audio is only triggered once. */
    bossBarVisible = false;

    /**
     * Initializes the game world, sets up the drawing context, UI bars, 
     * and starts the main game and rendering loops.
     * @param {HTMLCanvasElement} canvas - The canvas element to draw on.
     * @param {Keyboard} keyboard - The keyboard input instance.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.initBars();
        this.draw();
        this.setWorld();
        this.run();
    }

    /**
     * Pre-instantiates all status bars for the game interface.
     * @returns {void}
     */
    initBars() {
        this.healthBar = new HealthBar();
        this.coinBar = new CoinBar();
        this.bottleBar = new BottleBar();
        this.endbossHealthBar = new EndbossHealthBar();
    }

    /**
     * Establishes a bidirectional link between the world and its main entities.
     * @returns {void}
     */
    setWorld() {
        this.character.world = this;
        this.endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        if (this.endboss) {
            this.endboss.world = this;
        }
    }

    /**
     * Starts the master logic interval at 100ms, triggering collision checks.
     * @returns {void}
     */
    run() {
        setInterval(() => {
            this.checkCollisionsWithChicken();
            this.checkCollisionWithEndboss();
            this.checkCollisionsWithBottles();
            this.checkCollisionsWithCoins();
            this.checkCollisionsWithThrowableBottles();
            this.checkThrowObjects();
            this.checkBossHintTrigger();
        }, 100);
    }

    /**
     * Checks if the character reached the bottle supply area to display a tactical hint.
     */
    checkBossHintTrigger() {
        if (!this.hintShown && this.character.positionX > 2700) {
            this.hintShown = true;
            this.showHint = true;
            setTimeout(() => {
                this.showHint = false;
            }, 5000);
        }
    }

    /**
     * Iterates through enemies to evaluate and resolve chicken collisions.
     * @returns {void}
     */
    checkCollisionsWithChicken() {
        let collisionData = { enemiesToKill: [], takesDamage: false };
        this.level.enemies.forEach((enemy) => {
            if (!enemy.isDead && this.character.isColliding(enemy)) {
                this.evaluateSingleCollision(enemy, collisionData);
            }
        });
        this.resolveChickenCollisions(collisionData);
    }

    /**
     * Evaluates a single enemy collision to determine if it's a kill or damage.
     * @param {MoveableObject} enemy 
     * @param {Object} data 
     */
    evaluateSingleCollision(enemy, data) {
        let isFalling = this.character.speedY < 0;
        let isAbove = (this.character.positionY + this.character.height) < (enemy.positionY + enemy.height);
        if (isFalling && isAbove) {
            data.enemiesToKill.push(enemy);
        } else {
            data.takesDamage = true;
        }
    }

    /**
     * Executes the resulting actions of all chicken collisions in the current frame.
     * @param {Object} data 
     */
    resolveChickenCollisions(data) {
        if (data.enemiesToKill.length > 0) {
            data.enemiesToKill.forEach(enemy => this.killEnemy(enemy));
            this.character.speedY = 15; 
        } else if (data.takesDamage) {
            this.damageCharacter(20);
        }
    }

    /**
     * Deducts health from the character, updates the UI bar, and respects immunity frames.
     * @param {number} amount - Health points to deduct.
     * @returns {void}
     */
    damageCharacter(amount) {
        if (!this.character.isHurt()) { 
            this.character.hit(amount);
            this.healthBar.setPercentage(this.character.energy);
        }
    }

    /**
     * Specifically handles collision logic between the character and the final boss.
     * @returns {void}
     */
    checkCollisionWithEndboss() {
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Endboss && this.character.isColliding(enemy)) {
                this.damageCharacter(20);
            }
        });
    }

    /**
     * Detects if the character collects a salsa bottle, updates the inventory bar.
     * @returns {void}
     */
    checkCollisionsWithBottles() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle) && this.bottleBar.amount < 100) {
                AudioManager.play(AudioManager.BOTTLE_COLLECT, 0.1);
                this.level.bottles.splice(index, 1);
                this.bottleBar.amount += 20;
                this.bottleBar.setPercentage(this.bottleBar.amount);
            }
        });
    }

    /**
     * Monitors keyboard input for the 'D' key to instantiate and throw a salsa bottle.
     * @returns {void}
     */
    checkThrowObjects() {
        if (this.keyboard.D && this.bottleBar.amount > 0) {
            let bottle = new ThrowableObject(
                this.character.positionX + 100, 
                this.character.positionY + 100, 
                this.character.otherDirection
            );
            this.throwableObjects.push(bottle);
            this.bottleBar.amount -= 20;
            this.bottleBar.setPercentage(this.bottleBar.amount);
        }
    }

    /**
     * Checks if flying projectiles collide with any active enemies.
     * @returns {void}
     */
    checkCollisionsWithThrowableBottles() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (!bottle.afterBottleSplash && bottle.isColliding(enemy)) {
                    bottle.throwBottleAnimation();
                    this.handleEnemyHit(enemy); 
                }
            });
        });
    }

    /**
     * Detects if the character collects a coin and updates the UI bar.
     * @returns {void}
     */
    checkCollisionsWithCoins() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                AudioManager.play(AudioManager.COIN_COLLECT, 0.1);
                this.level.coins.splice(index, 1);
                this.coinBar.amount = Math.min(100, this.coinBar.amount + 20);
                this.coinBar.setPercentage(this.coinBar.amount);
            }
        });
    }

    /**
     * Triggers the death sequence for a minion enemy and removes it from the map.
     * @param {MoveableObject} enemy - The target enemy.
     * @returns {void}
     */
    killEnemy(enemy) {
        if (enemy.isDead) return;
        if (typeof enemy.die === 'function') {
            enemy.die();
        } else {
            enemy.isDead = true; 
        }
        setTimeout(() => {
            let index = this.level.enemies.indexOf(enemy);
            if (index > -1) this.level.enemies.splice(index, 1);
        }, 1000);
    }

    /**
     * Determines whether an enemy hit results in boss damage or a standard kill.
     * @param {MoveableObject} enemy - The enemy that was hit.
     * @returns {void}
     */
    handleEnemyHit(enemy) {
        if (enemy instanceof Endboss) {
            enemy.hit(20); 
            this.endbossHealthBar.setPercentage(enemy.energy);
            if (enemy.isDead()) this.showWinScreen();
        } else {
            this.killEnemy(enemy);
        }
    }

    /**
     * Triggers the victory UI sequence after a brief thematic delay.
     * @returns {void}
     */
    showWinScreen() {
        setTimeout(() => {
            if (typeof showWinScreen === 'function') {
                showWinScreen();
            } else {
                this.fallbackWinScreenDisplay();
            }
        }, 1000); 
    }

    /**
     * Directly manipulates the DOM to display victory elements as a fallback.
     * @returns {void}
     */
    fallbackWinScreenDisplay() {
        const winScreen = document.getElementById('win_screen');
        const winMenu = document.getElementById('win_menu');
        if (winScreen) winScreen.classList.remove('d_none');
        if (winMenu) winMenu.classList.remove('d_none');
    }

    /**
     * Main rendering loop using requestAnimationFrame. 
     * @returns {void}
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(Math.round(this.camera_x), 0);
        this.drawWorldGameObjects();
        this.ctx.translate(Math.round(-this.camera_x), 0);
        this.drawInterfaceBars();
        if (this.showHint) this.drawSpeechBubble();
        this.ctx.translate(Math.round(this.camera_x), 0);
        this.addToMap(this.character);
        this.ctx.translate(-Math.round(this.camera_x), 0);
        this.drawEndbossHealthBar(); 
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Entry point to render the tactical hint speech bubble.
     */
    drawSpeechBubble() {
        const text = "I should use these salsa bottles to defeat the divine chicken!";
        this.ctx.save();
        
        this.setupBubbleFont();                            
        let dimensions = this.calculateBubbleDimensions(text); 
        this.setupBubbleShadow();                         
        this.buildBubblePath(dimensions);                  
        this.renderBubbleShape();                          
        this.renderBubbleText(text, dimensions);           
        
        this.ctx.restore();
    }

    /**
     * 1. Smaller Font setup.
     */
    setupBubbleFont() {
        this.ctx.font = 'bold 16px "Comic Sans MS", "Marker Felt", sans-serif';
    }

    /**
     * 2. Compact Dynamic Dimensions calculation.
     */
    calculateBubbleDimensions(text) {
        const textWidth = this.ctx.measureText(text).width;
        const width = textWidth + 20;
        return {
            x: (this.canvas.width / 2) - (width / 2),
            y: 80,
            width: width,
            height: 40,
            radius: 12
        };
    }

    /**
     * 3. Subtle Shadow setup.
     */
    setupBubbleShadow() {
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        this.ctx.shadowBlur = 6;
        this.ctx.shadowOffsetX = 3;
        this.ctx.shadowOffsetY = 3;
    }

    /**
     * 4. Semi-Transparent Path construction.
     */
    buildBubblePath(dim) {
        this.ctx.beginPath();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.lineWidth = 3;

        this.ctx.moveTo(dim.x + dim.radius, dim.y);
        this.ctx.lineTo(dim.x + dim.width - dim.radius, dim.y);
        this.ctx.quadraticCurveTo(dim.x + dim.width, dim.y, dim.x + dim.width, dim.y + dim.radius);
        this.ctx.lineTo(dim.x + dim.width, dim.y + dim.height - dim.radius);
        this.ctx.quadraticCurveTo(dim.x + dim.width, dim.y + dim.height, dim.x + dim.width - dim.radius, dim.y + dim.height);
        
        this.ctx.lineTo(dim.x + (dim.width / 2) + 10, dim.y + dim.height);
        this.ctx.lineTo(dim.x + (dim.width / 2), dim.y + dim.height + 12);
        this.ctx.lineTo(dim.x + (dim.width / 2) - 10, dim.y + dim.height);

        this.ctx.quadraticCurveTo(dim.x, dim.y + dim.height, dim.x, dim.y + dim.height - dim.radius);
        this.ctx.lineTo(dim.x, dim.y + dim.radius);
        this.ctx.quadraticCurveTo(dim.x, dim.y, dim.x + dim.radius, dim.y);
        this.ctx.closePath();
    }

    /**
     * 5. Render Bubble shape (fill and stroke).
     */
    renderBubbleShape() {
        this.ctx.fill();
        this.ctx.shadowColor = 'transparent';
        this.ctx.stroke();
    }

    /**
     * 6. Render Text aligned within the bubble.
     */
    renderBubbleText(text, dim) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, dim.x + dim.width / 2, dim.y + dim.height / 2);
    }

    /**
     * Renders all non-UI game objects into the world map.
     * @returns {void}
     */
    drawWorldGameObjects() {
        this.addObjectsToMap(this.level.layers);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);
    }

    /**
     * Renders all standard interface bars in a fixed screen position.
     * @returns {void}
     */
    drawInterfaceBars() {
        this.addToMap(this.healthBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
    }

    /**
     * Helper to batch-process a list of drawable objects for mapping.
     * @param {DrawableObject[]} objects - Array of entities to draw.
     * @returns {void}
     */
    addObjectsToMap(objects) {
        objects.forEach(object => this.addToMap(object));
    }

    /**
     * Handles the specific drawing logic for a single entity, including sprite flipping.
     * @param {DrawableObject|MoveableObject} mo - The object to render.
     * @returns {void}
     */
    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);
        this.ctx.drawImage(mo.img, mo.positionX, mo.positionY, mo.width, mo.height);
        if (mo.otherDirection) this.flipImageBack(mo);
    }

    /**
     * Modifies the canvas context to mirror images horizontally for movement.
     * @param {MoveableObject} moveableObject - The object to flip.
     * @returns {void}
     */
    flipImage(moveableObject) {
        this.ctx.save();
        this.ctx.translate(moveableObject.width, 0);
        this.ctx.scale(-1, 1);
        moveableObject.positionX = moveableObject.positionX * -1;
    }

    /**
     * Restores the canvas context state after flipping an image.
     * @param {MoveableObject} moveableObject - The object to restore.
     * @returns {void}
     */
    flipImageBack(moveableObject) {
        moveableObject.positionX = moveableObject.positionX * -1;
        this.ctx.restore();
    }

    /**
     * Manages the visibility of the boss health bar and triggers the approach audio.
     * @returns {void}
     */
    drawEndbossHealthBar() {
        let boss = this.level.enemies.find(e => e instanceof Endboss);
        if (!boss) return;
        let edge = -this.camera_x + this.canvas.width;
        let isBossVisible = boss.positionX < edge && boss.energy > 0;
        if (isBossVisible && this.endbossHealthBar) {
            this.handleBossEntranceSound();
            this.endbossHealthBar.setPercentage(boss.energy);
            this.addToMap(this.endbossHealthBar);
        } else {
            this.bossBarVisible = false;
        }
    }

    /**
     * Checks if the boss just entered the screen and plays the approach sound if so.
     * @private
     */
    handleBossEntranceSound() {
        if (!this.bossBarVisible) {
            this.bossBarVisible = true;
            AudioManager.play(AudioManager.ENDBOSS_APPROACH, 0.5);
        }
    }
}