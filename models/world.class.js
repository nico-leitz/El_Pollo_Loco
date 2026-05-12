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
        this.healthBar = new HealthBar();
        this.coinBar = new CoinBar();
        this.bottleBar = new BottleBar();
        this.endbossHealthBar = new EndbossHealthBar();
        this.draw();
        this.setWorld();
        this.checkCollisions();
        this.run();
    }

    setWorld() {
        this.character.world = this;
        this.endboss = this.level.enemies.find(endboss => endboss instanceof Endboss);
        
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

    checkThrowObjects() {
        if(this.keyboard.D) {
            let bottle = new ThrowableObject(this.character.positionX + 100, this.character.positionY + 100);
            this.throwableObjects.push(bottle);
        }
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {

            if (this.character.isColliding(enemy)) {
                
                if (this.character.speedY < 0 && this.character.isAboveGround()) {
                    if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
                        this.killEnemy(enemy);

                        this.character.speedY = 15;
                        this.resetCharacterJumpAnimation();
                    }
                } else {
                    if (!this.character.isHurt() && !enemy.isDead) {
                        this.character.hit(20);
                        this.healthBar.setPercentage(this.character.energy);
                    }
                }
            }
        });
    }

   checkCollisionsWithChicken() {
        this.level.enemies.forEach((enemy) => {
            if (!enemy.isDead && this.character.isColliding(enemy)) {
                let isFalling = this.character.speedY < 0;
                let isAboveEnemy = (this.character.positionY + this.character.height) < (enemy.positionY + enemy.height);

                if (isFalling && isAboveEnemy) { 
                    this.killEnemy(enemy);
                    
                    this.character.speedY = 15; 
                    this.resetCharacterJumpAnimation();
                } else {
                    if (!this.character.isHurt()) { 
                        this.character.hit(20);
                        this.healthBar.setPercentage(this.character.energy);
                    }
                }
            }
        });
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
                if (!this.character.isHurt()) { 
                    this.character.hit(20);
                    this.healthBar.setPercentage(this.character.energy);
                }
            }
        });
    }

    checkCollisionsWithBottles() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle) && this.bottleBar.amount < 100) {
                AudioManager.play(AudioManager.BOTTLE_COLLECT, 0.1)
                this.level.bottles.splice(index, 1);
                this.bottleBar.amount += 20;
                this.bottleBar.setPercentage(this.bottleBar.amount);
            }
        });
    };

    checkThrowObjects() {
        if (this.keyboard.D && this.bottleBar.amount > 0) {
            let bottle = new ThrowableObject(this.character.positionX + 100, this.character.positionY + 100, this.character.otherDirection);
            this.throwableObjects.push(bottle);
            this.bottleBar.amount -= 20;
            this.bottleBar.setPercentage(this.bottleBar.amount);
        }
    };

   checkCollisionsWithThrowableBottles() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (!bottle.afterBottleSplash && bottle.isColliding(enemy)) {
                    bottle.throwBottleAnimation();
                    this.handleEndbossHit(enemy);
                }
            });
        });
    }

    checkCollisionsWithCoins() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                AudioManager.play(AudioManager.COIN_COLLECT, 0.1);
                this.level.coins.splice(index, 1);
                this.coinBar.amount += 20;
                if (this.coinBar.amount > 100) {
                    this.coinBar.amount = 100;
                }
                this.coinBar.setPercentage(this.coinBar.amount);
            }
        });
    };

    killEnemy(enemy) {
        if (!enemy.isDead) {
            if (typeof enemy.die === 'function') {
                enemy.die();
            } else {
                enemy.isDead = true; 
            }
            
            setTimeout(() => {
                let index = this.level.enemies.indexOf(enemy);
                if (index > -1) {
                    this.level.enemies.splice(index, 1);
                }
            }, 1000);
        }
    }

    handleEnemyHit(enemy) {
        if (enemy instanceof Endboss) {
            enemy.hit(20); 
            this.endbossHealthBar.setPercentage(enemy.energy);
        } else {
            this.killEnemy(enemy);
        }
    }

    handleEndbossHit(enemy) {
        if (enemy instanceof Endboss) {
            enemy.hit(20);
            this.endbossHealthBar.setPercentage(enemy.energy);
            
            if (enemy.isDead()) {
                this.showWinScreen();
            }
        } else if (!enemy.isDead) {
            this.killEnemy(enemy);
        }
    }

    showWinScreen() {
        setTimeout(() => {
            if (typeof showWinScreen === 'function') {
                showWinScreen();
            } else {
                const winScreen = document.getElementById('win_screen');
                const winMenu = document.getElementById('win_menu');
                if (winScreen) winScreen.classList.remove('d_none');
                if (winMenu) winMenu.classList.remove('d_none');
            }
        }, 1000); 
    }

    checkBossHit() {
        this.throwableObjects.forEach((bottle) => {
            if (this.endboss.isColliding(bottle)) {
                this.endboss.hit(20);
                this.endbossHealthBar.setPercentage(this.endboss.energy);
                console.log('Boss health:', this.endboss.energy);
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(Math.round(this.camera_x), 0);
        this.addObjectsToMap(this.level.layers);

        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(Math.round(-this.camera_x), 0);
        this.addToMap(this.healthBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);

        this.drawEndbossHealthBar();
        
        this.ctx.translate(Math.round(this.camera_x), 0);

        this.addToMap(this.character);

        this.ctx.translate(-Math.round(this.camera_x), 0);
          
        let self = this;
        requestAnimationFrame(function() {
             self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object)
        });
    }

    addToMap(moveableObject) {
        if (moveableObject.otherDirection) {
            this.flipImage(moveableObject);
        }

        this.ctx.drawImage(
            moveableObject.img,
            moveableObject.positionX,
            moveableObject.positionY,
            moveableObject.width,
            moveableObject.height
        );

        if (moveableObject.otherDirection) {
            this.flipImageBack(moveableObject);
        }
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

    drawDebugFrames(moveableObject) {
        if (moveableObject instanceof Character || moveableObject instanceof Chicken || moveableObject instanceof Endboss) {
            this.ctx.beginPath();
            this.ctx.lineWidth = '5';
            this.ctx.strokeStyle = (moveableObject instanceof Endboss) ? 'green' : 'red';
            this.ctx.rect(
                moveableObject.positionX, 
                moveableObject.positionY, 
                moveableObject.width, 
                moveableObject.height
            );
            this.ctx.stroke();
        }
    }

    drawEndbossHealthBar() {
        let endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
        if (endboss) {
            let screenRightEdge = -this.camera_x + this.canvas.width;
            
            if (endboss.positionX < screenRightEdge && endboss.energy > 0) {
                if (this.endbossHealthBar) {
                    this.endbossHealthBar.setPercentage(endboss.energy);
                    this.addToMap(this.endbossHealthBar);
                }
            }
        }
    }
}