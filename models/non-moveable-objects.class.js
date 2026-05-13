/**
 * Base class for static objects that do not move but still require animation 
 * capabilities (e.g., background elements, collectables).
 * Inherits from MoveableObject to utilize shared rendering logic while remaining stationary.
 * @extends MoveableObject
 */
class NonMovableObject extends MoveableObject {
    /** @type {number} The current index tracking the active animation frame. */
    currentImage = 0;

    /**
     * Safely cycles through an array of image paths to create a frame-by-frame animation.
     * Validates the existence of the image in the internal cache before updating the render target,
     * logging a warning if the asset is missing.
     * @param {string[]} images - Array of relative image paths representing the animation sequence.
     * @returns {void}
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        
        
        if (this.imgCache && this.imgCache[path]) {
            this.img = this.imgCache[path];
            this.currentImage++;
        } else {
            console.warn('Couldnt find image:', path);
        }
    }
}