class BottleObjects extends CollectableObjects {

    width = 150;
    height = 150;

    IMAGES = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor() {
        super();
        this.loadImage(this.IMAGES[0]); 
        this.loadImages(this.IMAGES); 
        this.positionX = 500 + Math.random() * 2000;
        this.positionY = 150;
    }
}