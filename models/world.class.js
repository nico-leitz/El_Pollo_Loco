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

    /** * @type {boolean} 
     * State variable to ensure the boss approach audio is only triggered once 
     * when the health bar first appears.
     */
    bossSoundPlayed = false;


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
     * Establishes a bidirectional link between the world and its main entities 
     * (Character and Endboss) to allow them to access world-level properties.
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
     * Starts the master logic interval at 100ms, triggering collision checks 
     * and input-based object spawning.
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
            this.checkBossHintTrigger(); // New logic integrated here
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
     * Checks for intersections between the character and standard enemies.
     * @returns {void}
     */
    checkCollisionsWithChicken() {
        this.level.enemies.forEach((enemy) => {
            if (!enemy.isDead && this.character.isColliding(enemy)) {
                this.handleChickenCollisionScenario(enemy);
            }
        });
    }

    /**
     * Evaluates if a collision with an enemy results in a kill (jumped on) 
     * or character damage.
     * @param {MoveableObject} enemy - The enemy involved in the collision.
     * @returns {void}
     */
    handleChickenCollisionScenario(enemy) {
        let isFalling = this.character.speedY < 0;
        let isAbove = (this.character.positionY + this.character.height) < (enemy.positionY + enemy.height);
        if (isFalling && isAbove) { 
            this.killEnemy(enemy);
            this.character.speedY = 15; 
            this.resetCharacterJumpAnimation();
        } else {
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
     * Forcefully resets the character's jump animation state, typically after 
     * successfully jumping on an enemy's head.
     * @returns {void}
     */
    resetCharacterJumpAnimation() {
        this.character.currentJumpImage = 0;
        this.character.jumpTick = 0;
        if (this.character.IMAGES_JUMPING && this.character.IMAGES_JUMPING.length > 0) {
            let path = this.character.IMAGES_JUMPING[0];
            this.character.img = this.character.imgCache[path];
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
     * Detects if the character collects a salsa bottle, updates the inventory bar,
     * and removes the item from the map.
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
     * Monitors keyboard input for the 'D' key to instantiate and throw a 
     * salsa bottle projectile if inventory allows.
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
     * Triggers the death sequence for a minion enemy and removes it from 
     * the level after a brief delay.
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
     * Directly manipulates the DOM to display victory elements if the 
     * global utility function is unavailable.
     * @returns {void}
     */
    fallbackWinScreenDisplay() {
        const winScreen = document.getElementById('win_screen');
        const winMenu = document.getElementById('win_menu');
        if (winScreen) winScreen.classList.remove('d_none');
        if (winMenu) winMenu.classList.remove('d_none');
    }

    /**
     * Main rendering loop using requestAnimationFrame. Clears the canvas and 
     * redraws all layers, entities, and UI elements.
     * @returns {void}
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(Math.round(this.camera_x), 0);
        this.drawWorldGameObjects();
        this.ctx.translate(Math.round(-this.camera_x), 0);
        this.drawInterfaceBars();

        if (this.showHint) {
            this.drawSpeechBubble();
        }

        this.ctx.translate(Math.round(this.camera_x), 0);
        this.addToMap(this.character);
        this.ctx.translate(-Math.round(this.camera_x), 0);
        this.drawEndbossHealthBar(); 
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Renders a dynamic, stylized speech bubble that automatically adjusts its 
     * width based on the text length.
     */
    /**
     * Renders a compact, semi-transparent speech bubble with a smaller font
     * and the updated "infinite amount" tactical hint.
     */
    drawSpeechBubble() {
        const text = "I should use these salsa bottles to defeat the divine chicken!";
        
        this.ctx.save();
        
        // --- 1. Smaller Font (16px) ---
        this.ctx.font = 'bold 16px "Comic Sans MS", "Marker Felt", sans-serif';
        
        // --- 2. Compact Dynamic Dimensions ---
        const textMetrics = this.ctx.measureText(text);
        const textWidth = textMetrics.width;
        
        const padding = 20; 
        const width = textWidth + padding;
        const height = 40;  
        
        const x = (this.canvas.width / 2) - (width / 2);
        const y = 80;       
        const radius = 12;  

        // --- 3. Subtle Shadow ---
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        this.ctx.shadowBlur = 6;
        this.ctx.shadowOffsetX = 3;
        this.ctx.shadowOffsetY = 3;

        // --- 4. Semi-Transparent Path (80% Opacity) ---
        this.ctx.beginPath();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; 
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)'; 
        this.ctx.lineWidth = 3; 

        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        
        // Compact Tail
        this.ctx.lineTo(x + (width / 2) + 10, y + height);
        this.ctx.lineTo(x + (width / 2), y + height + 12);
        this.ctx.lineTo(x + (width / 2) - 10, y + height);

        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();

        // --- 5. Render Bubble ---
        this.ctx.fill();
        this.ctx.shadowColor = 'transparent'; 
        this.ctx.stroke();

        // --- 6. Render Text ---
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)'; 
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x + width / 2, y + height / 2);

        this.ctx.restore();
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
     * The sound re-triggers every time the boss re-enters the player's field of view.
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