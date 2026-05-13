/**
 * Represents the dedicated visual health bar interface for the final Endboss enemy.
 * Inherits rendering properties directly from DrawableObject.
 * @extends DrawableObject
 */
class EndbossHealthBar extends DrawableObject {
    /**
     * Sequential array of image paths representing the boss's health levels (0% to 100%).
     * @type {string[]}
     */
    IMAGES = [
        'img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
        'img/7_statusbars/2_statusbar_endboss/orange/orange100.png'
    ];

    /** @type {number} The current health percentage of the boss. */
    percentage = 100;

    /**
     * Initializes the health bar, pre-loads the image sequence, sets the 
     * specific on-screen coordinates/dimensions, and defaults to full health.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.positionX = 500;
        this.positionY = 30;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Updates the internal percentage value and dynamically swaps the active image 
     * to reflect the new health state by fetching it from the cache or loading it.
     * @param {number} percentage - The updated health value (0 to 100).
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];

        if (this.imageCache && this.imageCache[path]) {
            this.img = this.imageCache[path];
        } else {
            this.loadImage(path);
        }
    }

    /**
     * Maps the current numeric percentage value to the corresponding array index 
     * of the loaded image sequence.
     * @returns {number} The index (0 to 5) representing the correct visual state.
     */
    resolveImageIndex() {
        if (this.percentage == 100) return 5;
        else if (this.percentage >= 80) return 4;
        else if (this.percentage >= 60) return 3;
        else if (this.percentage >= 40) return 2;
        else if (this.percentage >= 20) return 1;
        else return 0;
    }
}