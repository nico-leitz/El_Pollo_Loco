class ThrowableObject extends MoveableObject {
    otherDirection;
    
    offset = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    };

    
    IMAGES_BOTTLE_ROTATE = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_BOTTLE_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    afterBottleSplash = false;

    constructor(x, y, direction) {
        super();
        this.loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_BOTTLE_ROTATE);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
        this.positionX = x;
        this.positionY = y;
        this.height = 80;
        this.width = 70;
        this.otherDirection = direction;
        this.throw();
        this.animate();
    }

    throw() {
        this.speedY = 15;
        this.applyGravity();
        let throwInterval = setInterval(() => {
            if (!this.afterBottleSplash) {
                this.positionX += this.otherDirection ? -10 : 10;
                if (this.positionY > 350) this.throwBottleAnimation();
            } else {
                clearInterval(throwInterval);
            }
        }, 25);
    }

    animate() {
        setInterval(() => {
            if (!this.afterBottleSplash) {
                this.playAnimation(this.IMAGES_BOTTLE_ROTATE);
            }
        }, 50);
    }

    throwBottleAnimation() {
        if (this.afterBottleSplash) return;
        this.afterBottleSplash = true;
        this.speedY = 0;
        this.acceleration = 0;
        this.playSplash();
    }

    playSplash() {
        let i = 0;
        let splashInterval = setInterval(() => {
            if (i < this.IMAGES_BOTTLE_SPLASH.length) {
                this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
                i++;
            } else {
                clearInterval(splashInterval);
                this.positionY = -1000;
            }
        }, 50);
    }
}