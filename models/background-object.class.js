/**
 * Represents static or parallax background layers within the game scenery.
 * Inherits basic positioning properties from MoveableObject.
 * @extends MoveableObject
 */
class BackgroundObjects extends MoveableObject {
    /** @type {number} The fixed visual rendering width of the background layer. */
    width = 720;
    /** @type {number} The fixed visual rendering height of the background layer. */
    height = 480;

    /**
     * Creates an instance of a background component, loads its visual texture asset,
     * and auto-calculates its vertical alignment to lock tightly to the bottom frame.
     * @param {string} imagePath - The relative file path to the background graphic asset.
     * @param {number} x - The specific horizontal placement coordinate on the map timeline.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.positionX = x;
        this.positionY = 480 - this.height; 
    }
}