/**
 * Represents a decorative background cloud that slowly drifts across the sky.
 * Inherits basic movement capabilities and rendering properties from MoveableObject.
 * @extends MoveableObject
 */
class Cloud extends MoveableObject {
    /** @type {number} Fixed vertical placement of the cloud in the sky layer. */
    positionY = 20;
    /** @type {number} The visual rendering height of the cloud image. */
    height = 250;
    /** @type {number} The visual rendering width of the cloud image. */
    width = 500;

    /**
     * Initializes the cloud instance, loads its graphic asset, assigns a randomized 
     * horizontal starting position within the level bounds, and starts the drift animation.
     */
    constructor() {
        super().loadImage("img/5_background/layers/4_clouds/1.png");
        this.positionX = Math.random() * 3000;
        this.animate();
    }

    /**
     * Starts a continuous frame loop that slowly moves the cloud along the X-axis 
     * to the left, creating a subtle parallax drifting effect at ~60fps.
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.positionX -= 0.15;
        }, 1000 / 60);
    }
}