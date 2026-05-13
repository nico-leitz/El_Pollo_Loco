/**
 * Represents the visual status bar tracking the main character's current health.
 * Inherits core rendering and percentage calculation logic from the base StatusBar class.
 * @extends StatusBar
 */
class HealthBar extends StatusBar {
    /**
     * Sequential array of image paths representing health levels (0%, 20%, 40%, 60%, 80%, 100%).
     * @type {string[]}
     */
    IMAGES = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png'
    ];

    /**
     * Initializes the health status bar, pre-loads visual assets, sets its fixed 
     * canvas coordinates at the top left, and defines the starting health percentage at 100.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.positionX = 20;
        this.positionY = 0;
        this.setPercentage(100);
    }
}