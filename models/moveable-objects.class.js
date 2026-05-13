/**
 * Base class for all entities in the game that require physical movement, gravity, 
 * collision detection, and health management (e.g., Character, Enemies, Throwable objects).
 * @extends DrawableObject
 */
class MoveableObject extends DrawableObject {
    /** @type {boolean} Flag indicating if the object is facing the opposite/left direction. */
    otherDirection;
    
    /** @type {number} Current vertical speed/velocity. */
    speedY = 0;
    
    /** @type {number} The rate at which the object falls back to the ground. */
    acceleration = 1;
    
    /** @type {number} Health pool of the object. */
    energy = 100;
    
    /** @type {number} The amount of health deducted from another object upon collision. */
    damage = 20;
    
    /** @type {number} Timestamp (in milliseconds) of when the object last received damage. */
    lastHit = 0;
    
    /** @type {HTMLAudioElement} Audio track for walking. */
    walkAudio;
    /** @type {HTMLAudioElement} Audio track for taking damage. */
    damageAudio;
    /** @type {HTMLAudioElement} Audio track for jumping. */
    jumpAudio;
    /** @type {HTMLAudioElement} Audio track for the idle snoring state. */
    snoringAudio;
    /** @type {HTMLAudioElement} Audio track for the death state. */
    deadAudio;
    
    /** @type {number} Standard horizontal movement speed. */
    speed = 0.15;

    /**
     * Collision bounding box adjustments to fine-tune physical hit detection.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    /** @type {number} Real X coordinate for collision detection. */
    rX;
    /** @type {number} Real Y coordinate for collision detection. */
    rY;
    /** @type {number} Real width for collision detection. */
    rW;
    /** @type {number} Real height for collision detection. */
    rH;

    /**
     * Cycles through an array of image paths to create a frame-by-frame animation.
     * @param {string[]} images - Array of relative image paths.
     * @returns {void}
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imgCache[path];
        this.currentImage++;
    }

    /**
     * Moves the object positively along the X-axis by its set speed.
     * @returns {void}
     */
    moveRight() {
        this.positionX += this.speed;
    }

    /**
     * Moves the object negatively along the X-axis by its set speed.
     * @returns {void}
     */
    moveLeft() {
        this.positionX -= this.speed;
    }

    /**
     * Starts an interval loop applying vertical acceleration (gravity) to the object 
     * whenever it is above the ground or moving upwards.
     * @returns {void}
     */
    applyGravity() {
        setInterval(() => {
        if(this.isAboveGround() || this.speedY > 0) {
         this.positionY -= this.speedY;
         this.speedY -= this.acceleration;
         } 
        }, 1000 / 25)
    }

    /**
     * Determines if the object is currently airborne. 
     * Throwable objects are considered perpetually airborne for gravity calculations.
     * @returns {boolean} True if the object is in the air, false if grounded.
     */
    isAboveGround() {
        if(this instanceof ThrowableObject) {
            return true;
        } 
        else {
            return this.positionY < 150
        }    
    }

    /**
     * Evaluates whether this object's adjusted collision bounding box intersects 
     * with another object's bounding box (AABB collision).
     * @param {MoveableObject} moveableObject - The target object to check for collision.
     * @returns {boolean} True if the collision boxes overlap, otherwise false.
     */
    isColliding(moveableObject) {
       this.getRealFrame();
       moveableObject.getRealFrame();

       return this.rX + this.rW > moveableObject.rX &&
              this.rY + this.rH > moveableObject.rY &&
              this.rX < moveableObject.rX + moveableObject.rW &&
              this.rY < moveableObject.rY + moveableObject.rH;
   }

   /**
    * Calculates the absolute coordinates and dimensions of the object's physical 
    * hit-box by applying the defined visual offset values.
    * @returns {void}
    */
    getRealFrame() {
        this.rX = this.positionX + this.offset.left;
        this.rY = this.positionY + this.offset.top;
        this.rW = this.width - this.offset.left - this.offset.right;
        this.rH = this.height - this.offset.top - this.offset.bottom;
    }

    /**
     * Subtracts the specified damage amount from the object's energy pool and 
     * records the timestamp of the impact for immunity calculations.
     * @param {number} [damage=0] - The numerical damage value to apply.
     * @returns {void}
     */
   hit(damage) {
    let damageValue = damage || 0; 
    
    this.energy -= damageValue;

    if(this.energy <= 0) {
        this.energy = 0;
    }
    this.lastHit = new Date().getTime();
    }

    /**
     * Checks if the object is currently in a state of invulnerability or damage recovery,
     * defined as having taken damage within the last 500 milliseconds.
     * @returns {boolean} True if the object was recently hurt, otherwise false.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 100;
        return timepassed < 5;
    }

    /**
     * Checks if the object's energy has been completely depleted.
     * @returns {boolean} True if energy is 0, otherwise false.
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Evaluates if the object has been completely inactive for an extended period 
     * (greater than 10 seconds).
     * @returns {boolean} True if idle for more than 10s, otherwise false.
     */
    isLongIdle() {
        let timePassed = new Date().getTime() - this.lastAction;
        return timePassed > 10000; 
    }
}