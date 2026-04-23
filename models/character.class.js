class Character extends MoveableObject {
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
   
    constructor() {
        super();
        this.loadImage("img/2_character_pepe/2_walk/W-21.png");
        this.loadImages(this.IMAGES_WALKING)
        this.positionX = 100;

        this.animate();
    }

    animate() {
        setInterval(() => {
        let path = this.IMAGES_WALKING[this.currentImage]
        this.img = this.imgCache[path];
        this.currentImage++;
        }, 1000) 
    }

    jump() {
        
    }
}