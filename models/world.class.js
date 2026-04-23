class World {
    character = new Character();

    enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
    ];

    clouds = [
        new Cloud(),
        new Cloud(),
    ];

    layers = [
        new BackgroundObjects("img/5_background/layers/air.png", 0),
        new BackgroundObjects("img/5_background/layers/3_third_layer/1.png", 0),
        new BackgroundObjects("img/5_background/layers/2_second_layer/1.png", 0),
        new BackgroundObjects("img/5_background/layers/1_first_layer/1.png", 0),
        new BackgroundObjects("img/5_background/layers/air.png", 719),
        new BackgroundObjects("img/5_background/layers/3_third_layer/2.png", 719),
        new BackgroundObjects("img/5_background/layers/2_second_layer/2.png", 719),
        new BackgroundObjects("img/5_background/layers/1_first_layer/2.png", 719),
        new BackgroundObjects("img/5_background/layers/air.png", 719 * 2),
        new BackgroundObjects("img/5_background/layers/3_third_layer/1.png", 719 * 2),
        new BackgroundObjects("img/5_background/layers/2_second_layer/1.png", 719 * 2),
        new BackgroundObjects("img/5_background/layers/1_first_layer/1.png", 719 * 2),
    ];

    canvas;
    ctx;
    keyboard;
    camera_x = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
    }

    setWorld() {
        this.character.world = this;
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.translate(Math.round(this.camera_x), 0);

        this.addObjectsToMap(this.layers);
        
        this.addToMap(this.character);
        this.addObjectsToMap(this.clouds);
        this.addObjectsToMap(this.enemies);

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

        if (moveableObject.otherDirection) {
            moveableObject.positionX = moveableObject.positionX * -1;
            this.ctx.restore();
        }
    }
}