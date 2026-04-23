class Character extends MoveableObject {
    positionX = 100;
    positionY = 140;
    height = 300;
    width = 150;
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
        this.moveRight();
        this.moveLeft();
    }

    animate() {
        setInterval(() => {
            if (this.world.keyboard.RIGHT) {
                let i = this.currentImage % this.IMAGES_WALKING.length;
                let path = this.IMAGES_WALKING[i];
                this.img = this.imgCache[path];
                this.currentImage++;
            }   
        }, 100);
    }

    moveRight() {
        setInterval(() => {
            if(this.world.keyboard.RIGHT) {
                 this.positionX += 2.45;
            if (this.positionX > 720) { 
                this.positionX = 0;
            }
        }    
        }, 1000 / 60);
    }

    moveLeft() {
        setInterval(() => {
            if(this.world.keyboard.LEFT) {
                 this.positionX -= 2.45;
            if (this.positionX < -200) { 
                this.positionX = 720;
            }
        }    
        }, 1000 / 60);
    }

    jump() {
        
    }
}