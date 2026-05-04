class ThrowableObject extends MoveableObject {
    
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
    constructor(x, y) {
        super();
        this.loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_BOTTLE_ROTATE);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
        this.positionX = x;
        this.positionY = y;
        this.height = 80;
        this.width = 70;
        this.throw();
        this.animate();
    }

    throw() {
        this.speedY = 15;
        this.applyGravity();
        let moveInterval = setInterval(() => {
            if (this.positionY > 360 && !this.afterBottleSplash) { 
                this.throwBottleAnimation();
            }

            if (!this.afterBottleSplash) {
                this.positionX += 10;
            } else {
                clearInterval(moveInterval);
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