class Endboss extends MoveableObject {
    positionY = 165;
    height = 280;
    width = 280;
    currentImage = 0;
    energy = 100;
    speed = 1.5;
    startX = 3000;
    isInDeadAnimation = false;
    damage = 20;

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.positionX = 3000; 
        this.applyGravity();
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.energy > 0) {
                this.moveEndboss();
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.handleDeath();
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    moveEndboss() {
        if (this.otherDirection) {
            this.positionX += this.speed;
        } else {
            this.positionX -= this.speed;
        }

        if (this.positionX > this.startX + 300) {
            this.otherDirection = false;
        } else if (this.positionX < this.startX - 300) {
            this.otherDirection = true;
        }
    }

    handleDeath() {
        if (!this.isInDeadAnimation) {
            this.currentImage = 0;
            this.isInDeadAnimation = true;
            this.speedY = 12;
        }

        if (this.currentImage < this.IMAGES_DEAD.length) {
            this.playAnimation(this.IMAGES_DEAD);
        } else {
            let lastImagePath = this.getLastImage(this.IMAGES_DEAD);
            this.img = this.imgCache[lastImagePath];
        }

        this.positionY -= this.speedY; 
        this.speedY -= 5; 
    }

    hit(damage) {
        this.energy -= damage;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    getLastImage(imagesArray) {
        return imagesArray[imagesArray.length - 1];
    }
}