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
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkCollisionsWithChicken();
            this.checkCollisionsWithBottles();
        }, 200);
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
                
            }
        });
    };

    checkCollisionsWithChicken() {
    this.level.enemies.forEach((enemy, index) => {
        if (this.character.isColliding(enemy)) {
            if (this.character.isAboveGround() && this.character.speedY <= 0) {
                this.level.enemies.splice(index, 1);
                this.character.speedY = 15;
                this.character.lastHit = 0;
            } else {
                this.character.hit(20);
            }
        }
      });
    };

    checkCollisionsWithBottles() {
        this.level.bottles.forEach((bottle, index) => {
            if (this.character.isColliding(bottle) && this.bottleBar.amount < 100) {
                this.level.bottles.splice(index, 1);
                this.bottleBar.amount += 20;
                this.bottleBar.setPercentage(this.bottleBar.amount);
            }
        });
    };


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
    }
}