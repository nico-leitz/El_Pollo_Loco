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
                this.bottleBarhBar.setPercentage(this.bottleBar.amount);
                
            }
        });
    };


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.translate(Math.round(this.camera_x), 0);
        this.addObjectsToMap(this.level.layers);

        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
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