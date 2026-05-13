/**
 * Represents a standard enemy chicken character within the game.
 * Inherits base physics, movement, and collision logic from MoveableObject.
 * @extends MoveableObject
 */
class Chicken extends MoveableObject {
    /** @type {number} Fixed vertical placement aligning the enemy with the ground. */
    positionY = 370;

    /** @type {number} The visual rendering height of the chicken asset. */
    height = 60;

    /** @type {number} The visual rendering width of the chicken asset. */
    width = 60;

    /** @type {boolean} Flag indicating whether the enemy has been eliminated. */
    isDead = false;
    
    /** @type {HTMLAudioElement} Reference to the audio asset played upon elimination. */
    deathSound = AudioManager.CHICKEN_DEAD;

    /**
     * Physical collision boundary reductions to establish a more accurate, 
     * tighter hit-box inside the transparent image canvas.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    };

    /** @type {string[]} Array of image paths creating the horizontal walking animation loop. */
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    /** @type {string[]} Single-item array path containing the defeated state sprite. */
    IMAGE_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    /** @type {number} Randomly generated horizontal movement speed (between 0.5 and 1.0 pixels per frame). */
    speed = 0.5 + Math.random() * 0.5;

    /**
     * Initializes a chicken instance, loads necessary visual assets, calculates a randomized 
     * starting position within the level boundaries, and triggers the animation/movement loops.
     */
    constructor() {
        super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGE_DEAD);
        this.positionX = 1000 + Math.random() * 2500;
        this.animate();
    }

    /**
     * Executes the enemy elimination sequence. Secures the state to prevent duplicate 
     * triggers and plays the assigned destruction audio.
     * @returns {void}
     */
    die() {
        if (!this.isDead) {
            this.isDead = true;
            AudioManager.play(this.deathSound, 0.2);
        }
    }

    /**
     * Sets up two concurrent intervals. The first handles continuous lateral movement 
     * to the left (resetting position if out of bounds). The second cycles the 
     * relevant sprite graphics based on the living/dead state.
     * @returns {void}
     */
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