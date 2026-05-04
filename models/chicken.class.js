class Chicken extends MoveableObject {
    positionY = 370;
    height = 60;
    width = 60;
    isDead = false;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGE_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    speed = 0.5 + Math.random() * 0.5;

    constructor() {
        super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGE_DEAD);
        this.positionX = 1000 + Math.random() * 2500;
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!this.isDead) {
                this.positionX -= this.speed;
                if (this.positionX < -this.width) { 
                    this.positionX = 2500;
                }
            }
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead) {
                this.playAnimation(this.IMAGE_DEAD);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }
}