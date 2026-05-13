/**
 * Represents a projectile object (e.g., a salsa bottle) thrown by the player.
 * Handles specialized physics trajectory, rotation animations, and collision-triggered splash effects.
 * @extends MoveableObject
 */
class ThrowableObject extends MoveableObject {
    /** @type {boolean} Determines the horizontal direction of the throw (true for left, false for right). */
    otherDirection;
    
    /**
     * Collision bounding box adjustments to fine-tune physical hit detection during flight.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20
    };

    /** @type {string[]} Array of image paths for the bottle's mid-air rotation animation. */
    IMAGES_BOTTLE_ROTATE = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    /** @type {string[]} Array of image paths for the impact/splash animation sequence. */
    IMAGES_BOTTLE_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    /** @type {boolean} Flag indicating if the bottle has impacted and is currently playing the splash animation. */
    afterBottleSplash = false;

    /**
     * Initializes the throwable object, sets starting coordinates, pre-loads animations, 
     * and immediately triggers the throw physics.
     * @param {number} x - The starting horizontal coordinate.
     * @param {number} y - The starting vertical coordinate.
     * @param {boolean} direction - The throw direction (mirrored or standard).
     */
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

    /**
     * Initiates the vertical and horizontal physics. Applies gravity and uses 
     * a 25ms interval to handle lateral velocity until impact occurs.
     * @returns {void}
     */
    throw() {
        this.speedY = 7;
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

    /**
     * Starts the continuous rotation animation loop used while the object is in flight.
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            if (!this.afterBottleSplash) {
                this.playAnimation(this.IMAGES_BOTTLE_ROTATE);
            }
        }, 50);
    }

    /**
     * Transitions the object state from "flying" to "splash". 
     * Disables gravity and lateral movement to play the impact sequence.
     * @returns {void}
     */
    throwBottleAnimation() {
        if (this.afterBottleSplash) return;
        this.afterBottleSplash = true;
        this.speedY = 0;
        this.acceleration = 0;
        this.playSplash();
    }

    /**
     * Executes the splash animation frame sequence. Once finished, 
     * moves the object far outside the visible canvas area for effective removal.
     * @returns {void}
     */
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