class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    healthBar;
    coinBar;
    bottleBar;
    endbossHealthBar;
    throwableObjects = [];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.initBars();
        this.draw();
        this.setWorld();
        this.run();
    }

    initBars() {
        this.healthBar = new HealthBar();
        this.coinBar = new CoinBar();
        this.bottleBar = new BottleBar();
        this.endbossHealthBar = new EndbossHealthBar();
    }

    setWorld() {
        this.character.world = this;
        this.endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        if (this.endboss) {
            this.endboss.world = this;
        }
    }

    run() {
        setInterval(() => {
            this.checkCollisionsWithChicken();
            this.checkCollisionWithEndboss();
            this.checkCollisionsWithBottles();
            this.checkCollisionsWithCoins();
            this.checkCollisionsWithThrowableBottles();
            this.checkThrowObjects();
        }, 100);
    }

    checkCollisionsWithChicken() {
        this.level.enemies.forEach((enemy) => {
            if (!enemy.isDead && this.character.isColliding(enemy)) {
                this.handleChickenCollisionScenario(enemy);
            }
        });
    }

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

    damageCharacter(amount) {
        if (!this.character.isHurt()) { 
            this.character.hit(amount);
            this.healthBar.setPercentage(this.character.energy);
        }
    }

    resetCharacterJumpAnimation() {
        this.character.currentJumpImage = 0;
        this.character.jumpTick = 0;
        if (this.character.IMAGES_JUMPING && this.character.IMAGES_JUMPING.length > 0) {
            let path = this.character.IMAGES_JUMPING[0];
            this.character.img = this.character.imgCache[path];
        }
    }

    checkCollisionWithEndboss() {
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Endboss && this.character.isColliding(enemy)) {
                this.damageCharacter(20);
            }
        });
    }

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

    handleEnemyHit(enemy) {
        if (enemy instanceof Endboss) {
            enemy.hit(20); 
            this.endbossHealthBar.setPercentage(enemy.energy);
            if (enemy.isDead()) this.showWinScreen();
        } else {
            this.killEnemy(enemy);
        }
    }

    showWinScreen() {
        setTimeout(() => {
            if (typeof showWinScreen === 'function') {
                showWinScreen();
            } else {
                this.fallbackWinScreenDisplay();
            }
        }, 1000); 
    }

    fallbackWinScreenDisplay() {
        const winScreen = document.getElementById('win_screen');
        const winMenu = document.getElementById('win_menu');
        if (winScreen) winScreen.classList.remove('d_none');
        if (winMenu) winMenu.classList.remove('d_none');
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(Math.round(this.camera_x), 0);
        this.drawWorldGameObjects();
        this.ctx.translate(Math.round(-this.camera_x), 0);
        this.drawInterfaceBars();
        this.ctx.translate(Math.round(this.camera_x), 0);
        this.addToMap(this.character);
        this.ctx.translate(-Math.round(this.camera_x), 0);
        requestAnimationFrame(() => this.draw());
    }

    drawWorldGameObjects() {
        this.addObjectsToMap(this.level.layers);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);
    }

    drawInterfaceBars() {
        this.addToMap(this.healthBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
        this.drawEndbossHealthBar();
    }

    addObjectsToMap(objects) {
        objects.forEach(object => this.addToMap(object));
    }

    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);
        this.ctx.drawImage(mo.img, mo.positionX, mo.positionY, mo.width, mo.height);
        if (mo.otherDirection) this.flipImageBack(mo);
    }

    flipImage(moveableObject) {
        this.ctx.save();
        this.ctx.translate(moveableObject.width, 0);
        this.ctx.scale(-1, 1);
        moveableObject.positionX = moveableObject.positionX * -1;
    }

    flipImageBack(moveableObject) {
        moveableObject.positionX = moveableObject.positionX * -1;
        this.ctx.restore();
    }

    drawEndbossHealthBar() {
        let boss = this.level.enemies.find(e => e instanceof Endboss);
        if (!boss) return;
        let edge = -this.camera_x + this.canvas.width;
        if (boss.positionX < edge && boss.energy > 0 && this.endbossHealthBar) {
            this.endbossHealthBar.setPercentage(boss.energy);
            this.addToMap(this.endbossHealthBar);
        }
    }
}