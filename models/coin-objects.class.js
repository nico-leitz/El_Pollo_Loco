/**
 * Represents a collectable coin item floating within the game world.
 * Inherits core collectible mechanics and rendering properties.
 * @extends CollectableObjects
 */
class CoinObjects extends CollectableObjects {
    /** @type {number} The visual rendering width of the coin asset. */
    width = 100;
    
    /** @type {number} The visual rendering height of the coin asset. */
    height = 100;

    /**
     * Array of image paths used for the coin's idle spinning animation loop.
     * @type {string[]}
     */
    IMAGES = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];

    /**
     * Collision bounding box adjustments to fine-tune physical hit detection 
     * by cropping out empty transparent pixel space from the base image.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 35,
        bottom: 35,
        left: 35,  
        right: 35 
    };

    /**
     * Initializes the coin, pre-loads its visual textures, and calculates a 
     * randomized spawn placement for both horizontal (X) and vertical (Y) axes.
     */
    constructor() {
        super();
        this.loadImage(this.IMAGES[0]); 
        this.loadImages(this.IMAGES); 
        this.positionX = 200 + Math.random() * 2500;
        this.positionY = 150 + Math.random() * 150;
    }

    /**
     * Starts the continuous background animation loop, sequentially cycling through 
     * the defined image array at a fixed interval to provide visual feedback.
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES); 
        }, 500);
    }
}