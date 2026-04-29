class BottleObjects extends CollectableObjects {

    width = 100;
    height = 100;

    IMAGES = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor() {
        super();
        this.loadImage(this.IMAGES[0]); 
        this.loadImages(this.IMAGES); 
        this.positionX = 500 + Math.random() * 2000;
        this.positionY = 340;
    }
}