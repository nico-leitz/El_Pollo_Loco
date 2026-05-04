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
    throwableObjects = [];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.healthBar = new HealthBar();
        this.coinBar = new CoinBar();
        this.bottleBar = new BottleBar();
        this.draw();
        this.setWorld();
        this.checkCollisions();
        this.run();
    }

    setWorld() {
        this.character.world = this;
    }

   run() {
        setInterval(() => {
            this.checkCollisionsWithChicken();
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
                this.character.hit();
                this.healthBar.setPercentage(this.character.energy);
                this.coinBar.setPercentage(this.coinBar.amount);
                this.bottleBar.setPercentage(this.bottleBar.amount);
                bottle.throwBottleAnimation();
                this.endbossStatusBar.setPercentage(this.endboss.energy);
                
            }
        });
    };

   checkCollisionsWithChicken() {
        this.level.enemies.forEach((enemy) => {
            if (!enemy.isDead && this.character.isColliding(enemy)) {
                let isFalling = this.character.speedY < 0;
                let isAboveEnemy = (this.character.positionY + this.character.height) < (enemy.positionY + enemy.height);

                if (isFalling && isAboveEnemy) { 
                    this.killEnemy(enemy);
                    this.character.speedY = 15; 
                } else {
                    if (!this.character.isHurt()) { 
                        this.character.hit(20);
                        this.healthBar.setPercentage(this.character.energy);
                    }
                }
            }
        });
    }

    checkCollisionsWithBottles() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle) && this.bottleBar.amount < 100) {
                this.level.bottles.splice(index, 1);
                this.bottleBar.amount += 20;
                this.bottleBar.setPercentage(this.bottleBar.amount);
            }
        });
    };

    checkCollisionsWithThrowableBottles() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (!bottle.afterBottleSplash && !enemy.isDead && bottle.isColliding(enemy)) {
                    bottle.throwBottleAnimation();
                    this.killEnemy(enemy);
                }
            });
        });
    }

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
                    console.log("Kollision erkannt mit:", enemy.constructor.name); 
                    bottle.throwBottleAnimation();
                    this.handleEndbossHit(enemy);
                }
            });
        });
    }

    checkCollisionsWithCoins() {
        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
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
            enemy.isDead = true;
            
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
            console.log('Boss Energie:', enemy.energy);
        } else if (!enemy.isDead) {
            this.killEnemy(enemy);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

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
            this.ctx.save();
            this.ctx.translate(moveableObject.width, 0);
            this.ctx.scale(-1, 1);
            moveableObject.positionX = moveableObject.positionX * -1; 
        }

        this.ctx.drawImage(
            moveableObject.img,
            moveableObject.positionX,
            moveableObject.positionY,
            moveableObject.width,
            moveableObject.height
        );

        if (moveableObject instanceof Character || moveableObject instanceof Chicken) {
            this.ctx.beginPath();
            this.ctx.lineWidth = '5';
            this.ctx.strokeStyle = 'red';
            this.ctx.rect(
                moveableObject.positionX, 
                moveableObject.positionY, 
                moveableObject.width, 
                moveableObject.height
            );
            this.ctx.stroke();
        }
        
        if (moveableObject.otherDirection) {
            moveableObject.positionX = moveableObject.positionX * -1;
            this.ctx.restore();
        }

        if (moveableObject instanceof Endboss) {
            this.ctx.beginPath();
            this.ctx.rect(moveableObject.positionX, moveableObject.positionY, moveableObject.width, moveableObject.height);
            this.ctx.strokeStyle = 'blue';
            this.ctx.stroke();
    }
    }
}