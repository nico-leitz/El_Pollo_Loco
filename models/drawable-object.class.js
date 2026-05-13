/**
 * Base class for all visual entities rendered on the game canvas.
 * Manages spatial coordinates, dimensions, and standard image asset loading/caching.
 */
class DrawableObject {
    /** @type {number} The horizontal rendering coordinate on the canvas. */
    positionX = 520;
    
    /** @type {number} The vertical rendering coordinate on the canvas. */
    positionY = 250;
    
    /** @type {number} The visual rendering height of the object. */
    height = 150;
    
    /** @type {number} The visual rendering width of the object. */
    width = 100;
    
    /** @type {HTMLImageElement} The current active image object ready to be drawn. */
    img;
    
    /** * Dictionary storing pre-loaded HTMLImageElement objects mapped by their file paths.
     * @type {Object<string, HTMLImageElement>} 
     */
    imgCache = {};
    
    /** @type {number} The global tracker for the current frame index during animations. */
    currentImage = 0;

    /**
     * Initializes a single native Image object and assigns it to the primary `img` property.
     * @param {string} path - The relative file path pointing to the image asset.
     * @returns {void}
     */
    loadImage(path) {
        this.img = new Image(); 
        this.img.src = path;
    }

    /**
     * Iterates through an array of image paths, pre-loads them as native Image objects, 
     * and stores them in the internal cache dictionary to prevent rendering latency.
     * @param {string[]} arr - An array of relative file paths for the required image assets.
     * @returns {void}
     */
    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imgCache[path] = img;
        });
    }
}