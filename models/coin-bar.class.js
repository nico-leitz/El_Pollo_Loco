class CoinBar extends StatusBar {
    amount= 0;

    IMAGES = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
    ];

    offset = {
        top: 15,
        bottom: 10,
        left: 30,
        right: 30
    };

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.positionX = 20;
        this.positionY = 45; 
        this.setPercentage(0);
    }
}