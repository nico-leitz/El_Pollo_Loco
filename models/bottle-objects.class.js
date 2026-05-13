/**
 * Represents a collectable salsa bottle item placed on the ground within the game world.
 * Inherits core collectible mechanics and rendering properties.
 * @extends CollectableObjects
 */
class BottleObjects extends CollectableObjects {
    
    /** @type {number} The visual rendering width of the bottle asset. */
    width = 100;
    
    /** @type {number} The visual rendering height of the bottle asset. */
    height = 100;

    /**
     * Array of image paths used for the bottle's idle ground animation loop.
     * @type {string[]}
     */
    IMAGES = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    /**
     * Collision bounding box adjustments to fine-tune physical hit detection 
     * by cropping out empty transparent pixel space from the base image.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 15,
        bottom: 10,
        left: 30,
        right: 30
    };

    /**
     * Initializes the bottle and pre-loads its textures.
     * Sets the position based on the provided parameter or a random value.
     * @param {number} [x] - The optional fixed horizontal spawn coordinate. 
     * If not provided, a random position between 500 and 2500 is generated.
     */
    constructor(x) {
        super();
        this.loadImage(this.IMAGES[0]); 
        this.loadImages(this.IMAGES); 
        
        if (x !== undefined) {
            this.positionX = x;
        } else {
            this.positionX = 500 + Math.random() * 2000;
        }

        this.positionY = 340;
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