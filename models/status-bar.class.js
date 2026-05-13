/**
 * Base class for all overlay status bars (Health, Coins, Bottles).
 * Handles the logic for mapping a numeric percentage to a specific state-based image.
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
    /** @type {number} The current fill level or progress value, ranging from 0 to 100. */
    percentage = 100;
    
    /** @type {number} A generic counter for collected units (defaults to 1). */
    amount = 1;

    /** * Array of image paths representing different fill states. 
     * Note: This property is intended to be defined in specific subclasses.
     * @type {string[] | undefined} 
     */
    IMAGES;

    /**
     * Initializes the status bar with standard dimensions and default screen positioning.
     */
    constructor() {
        super();
        this.positionX = 20;
        this.positionY = 0;
        this.width = 200;
        this.height = 60;
    }

    /**
     * Updates the internal percentage and dynamically swaps the displayed image 
     * based on the calculated index from the image cache.
     * @param {number} percentage - The new percentage value (0 to 100).
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imgCache[path];
    };
        
    /**
     * Maps the current numeric percentage value to an integer index (0 to 5).
     * Used to select the appropriate graphic from the IMAGES array.
     * @returns {number} The index representing the fill state (0 = empty, 5 = full).
     */
    resolveImageIndex() {
        if (this.percentage == 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}