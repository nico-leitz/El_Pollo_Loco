/**
 * Represents a variant variant of the chicken enemy (SmallChicken) with smaller dimensions, 
 * a unique death sound, altered hit-box offsets, and higher randomized movement speeds.
 * Inherits its movement logic and states from the base Chicken class.
 * @extends Chicken
 */
class SmallChicken extends Chicken {
    /** @type {number} Fixed vertical placement aligning the smaller enemy properly with the ground line. */
    positionY = 380; 

    /** @type {number} The visual rendering height of the small chicken asset. */
    height = 40;
    
    /** @type {number} The visual rendering width of the small chicken asset. */
    width = 40;

    /** @type {string[]} Array of image paths creating the small chicken's horizontal walking animation loop. */
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    /** @type {string[]} Single-item array path containing the small defeated state sprite. */
    IMAGE_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    /**
     * Highly precise collision boundary reductions tailored to the smaller dimensions 
     * of this enemy variant inside the transparent graphic canvas.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 0,
        bottom: 0,
        right: 5,
        left: 5
    }

    /**
     * Initializes the small chicken instance, pre-loads all relevant visual frames, 
     * applies an elevated randomized speed value, and overwrites the default defeat audio effect.
     */
    constructor() {
        super(); 
        this.loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGE_DEAD);
        this.speed = 0.7 + Math.random() * 1.5;
        this.deathSound = AudioManager.CHICKEN_DEAD_2;
    }
}