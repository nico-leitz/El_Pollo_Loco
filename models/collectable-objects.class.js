/**
 * Base class for all static, collectable items within the game (e.g., coins, salsa bottles).
 * Provides standard initialization and a shared continuous animation loop.
 * @extends NonMovableObject
 */
class CollectableObjects extends NonMovableObject {
    
    /**
     * Initializes the base collectable object and automatically triggers 
     * its visual animation cycle upon creation.
     */
    constructor() {
       super();
       this.animate();
    }

    /**
     * Initiates a continuous interval loop that cycles through the object's image array 
     * at a rapid 100ms rate. Note: Subclasses must define a `this.IMAGES` array 
     * for this method to function correctly.
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 100);
    };
}