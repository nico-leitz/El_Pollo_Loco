class Character extends MoveableObject {
    positionX = 0;
    positionY = 40;
    height = 280;
    width = 140;
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];
    currentImage = 0;
    world;
   
    constructor() {
        super();
        this.loadImage("img/2_character_pepe/2_walk/W-21.png");
        this.loadImages(this.IMAGES_WALKING);

        this.animate();
        this.applyGravity();
        this.moveRight();
        this.moveLeft();
    }

    animate() {
        setInterval(() => {
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
            };   
            
        }, 100);
    };

    moveRight() {
        setInterval(() => {
            if(this.world.keyboard.RIGHT && this.positionX < this.world.level.level_end_x) {
                 this.positionX += 2.45;
                 this.otherDirection = false;
        }    
                this.world.camera_x = -this.positionX;
        }, 1000 / 60);
    }

    moveLeft() {
        setInterval(() => {
            if(this.world.keyboard.LEFT && this.positionX > 0) {
                this.positionX -= 2.45;
                this.otherDirection = true;
        }    
             this.world.camera_x = -this.positionX;
        }, 1000 / 60);
    }

    jump() {
        
    }
}