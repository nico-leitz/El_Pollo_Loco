class Character extends MoveableObject {
    positionX = 0;
    positionY = -60;
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

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png',
    ];

    currentImage = 0;
    world;
   
    constructor() {
        super();
        this.loadImage("img/2_character_pepe/2_walk/W-21.png");
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);

        
        this.applyGravity();
        this.animate();
        this.move();
    }

animate() {
    setInterval(() => {
        if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_JUMPING);
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.playAnimation(this.IMAGES_WALKING);
        } else {
            this.loadImage('img/2_character_pepe/2_walk/W-21.png');
        }

    }, 100);
}

move() {
    setInterval(() => {
        if (this.world.keyboard.RIGHT && this.positionX < this.world.level.level_end_x) {
           this.moveRight();
        }

        if (this.world.keyboard.LEFT && this.positionX > 0) {
            this.moveLeft();
        }

        if(this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
        }

        this.world.camera_x = -this.positionX;
    }, 1000 / 60);
}

    moveRight() {
        this.positionX += 2.45;
        this.otherDirection = false;
    }

    moveLeft() {
        this.positionX -= 2.45;
        this.otherDirection = true;
    }

    jump() {
        this.speedY = 15;
    }
}