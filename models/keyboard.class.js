/**
 * Object tracking the current boolean state of specific keyboard inputs.
 * Used globally to manage player movement, jumps, and combat actions.
 */
class Keyboard {
    /** @type {boolean} Flag indicating if the left arrow key is currently pressed. */
    LEFT = false;
    
    /** @type {boolean} Flag indicating if the right arrow key is currently pressed. */
    RIGHT = false;
    
    /** @type {boolean} Flag indicating if the up arrow key is currently pressed. */
    UP = false;
    
    /** @type {boolean} Flag indicating if the down arrow key is currently pressed. */
    DOWN = false;
    
    /** @type {boolean} Flag indicating if the spacebar is currently pressed (typically used for jumping). */
    SPACE = false;
    
    /** @type {boolean} Flag indicating if the 'D' key is currently pressed (typically used for throwing objects). */
    D = false;

    /**
     * Initializes the keyboard tracking object with all key states defaulted to false.
     */
    constructor() {
        
    }
}