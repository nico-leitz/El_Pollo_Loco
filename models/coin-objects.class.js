class CoinObjects extends CollectableObjects {
    width = 100;
    height = 100;

    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    constructor() {
        super();
        this.loadImage(this.IMAGES[0]); 
        this.loadImages(this.IMAGES); 
        this.positionX = 200 + Math.random() * 1000;
        this.positionY = 150 + Math.random() * 150;
    }
}