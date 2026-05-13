/**
 * Represents the visual status bar interface tracking the player's collected salsa bottles.
 * Inherits core rendering and percentage logic from the base StatusBar class.
 * @extends StatusBar
 */
class BottleBar extends StatusBar {
    /** @type {number} The current collection progress value, ranging from 0 to 100. */
    amount = 0;
    
    /**
     * Sequential array of image paths representing fill levels (0%, 20%, 40%, 60%, 80%, 100%).
     * @type {string[]}
     */
    IMAGES = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png'
    ];

    /**
     * Initializes the bottle status bar, pre-loads visual assets, sets its fixed 
     * canvas coordinates, and defines the starting fill percentage at 0.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.positionX = 20;
        this.positionY = 90;
        this.setPercentage(0);
    }
}