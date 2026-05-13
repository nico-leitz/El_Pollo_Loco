/**
 * Represents the final boss enemy character (Endboss), managing complex behaviors 
 * including patrol states, target tracking, combat, and death sequences.
 * @extends MoveableObject
 */
class Endboss extends MoveableObject {
    /** @type {number} The vertical rendering coordinate, anchoring the boss to the ground. */
    positionY = 165;

    /** @type {number} The visual rendering height of the boss asset. */
    height = 280;

    /** @type {number} The visual rendering width of the boss asset. */
    width = 280;

    /** @type {number} The current index tracking the active animation frame. */
    currentImage = 0;

    /** @type {number} The current health status of the boss (maximum 100). */
    energy = 100;

    /** @type {number} The standard horizontal movement speed during the patrol phase. */
    speed = 1.0;

    /** @type {number} The accelerated horizontal movement speed when actively tracking the player. */
    attackSpeed = 5.0;

    /** @type {number} The initial spawn coordinate, serving as the center of the patrol zone. */
    startX = 3500;

    /** @type {boolean} Flag indicating whether the boss has initiated its death sequence. */
    isInDeadAnimation = false;

    /** @type {number} The amount of health deducted from the player upon collision. */
    damage = 20;

    /** @type {boolean} Flag triggered once the player enters the boss's immediate aggro range. */
    hadFirstContact = false;
    
    /** @type {boolean} Flag forcing the boss to chase the player immediately after taking damage. */
    counterAttackActive = false;

    /**
     * Collision bounding box adjustments to fine-tune physical hit detection.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 60,
        bottom: 20,
        left: 40,
        right: 40
    };

    /** @type {string[]} Array of image paths for the standard walking/patrol animation. */
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png', 'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png', 'img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    /** @type {string[]} Array of image paths representing the damage feedback animation. */
    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G22.png', 'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    /** @type {string[]} Array of image paths executing the defeat/death sequence. */
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png', 'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /**
     * Initializes the Endboss, pre-loads all animation arrays, defines the starting position, 
     * applies physics, and starts the core behavioral interval loops.
     */
    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.positionX = 3500; 
        this.applyGravity();
        this.animate();
    }

    /**
     * Starts two concurrent loops: one managing positional updates based on logic (~60fps), 
     * and one cycling through appropriate graphic sprites based on current state (dead, hurt, walking).
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            if (this.energy > 0) this.moveEndboss();
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.handleDeath();
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    /**
     * Determines whether the boss should track and attack the player, or fall back 
     * into a neutral patrol pattern based on distance and combat flags.
     * @returns {void}
     */
    moveEndboss() {
        if (this.world && this.world.character) {
            let characterX = this.world.character.positionX;
            let hasTarget = this.checkTargetTracking(characterX);
            if (hasTarget) {
                this.attackCharacter(characterX);
                return;
            }
        }
        this.executePatrol();
    }

    /**
     * Evaluates spatial distances to trigger or drop the boss's targeting logic.
     * Factors in initial contact distance, area bounds, and counter-attack priority.
     * @param {number} characterX - The current horizontal coordinate of the player character.
     * @returns {boolean} True if the boss should execute an attack move; false otherwise.
     */
    checkTargetTracking(characterX) {
        let distance = Math.abs(this.positionX - characterX);
        let maxLeftRange = this.startX - 700;
        if (this.counterAttackActive) {
            if (distance < 80) this.counterAttackActive = false;
            else return true;
        }
        if (distance < 800 && characterX >= maxLeftRange) {
            this.hadFirstContact = true;
        }
        if (this.hadFirstContact) {
            if (characterX < maxLeftRange) this.hadFirstContact = false;
            else return true;
        }
        return false;
    }

    /**
     * Executes standard back-and-forth pacing behavior relative to the boss's initial spawn point.
     * @returns {void}
     */
    executePatrol() {
        if (this.otherDirection) {
            this.positionX += this.speed;
        } else {
            this.positionX -= this.speed;
        }
        if (this.positionX > this.startX + 300) {
            this.otherDirection = false;
        } else if (this.positionX < this.startX - 300) {
            this.otherDirection = true;
        }
    }

    /**
     * Overrides patrol movement to aggressively shift the boss's X position towards the player.
     * @param {number} characterX - The current horizontal coordinate of the player character.
     * @returns {void}
     */
    attackCharacter(characterX) {
        if (this.positionX > characterX) {
            this.positionX -= this.attackSpeed;
            this.otherDirection = false;
        } else if (this.positionX < characterX) {
            this.positionX += this.attackSpeed;
            this.otherDirection = true;
        }
    }

    /**
     * Triggers the physics trajectory (jump and fall) representing the boss's defeat, 
     * locking the animation into the death sequence.
     * @returns {void}
     */
    handleDeath() {
        if (!this.isInDeadAnimation) {
            this.currentImage = 0;
            this.isInDeadAnimation = true;
            this.speedY = 12;
        }
        this.playDeathFrame();
        this.positionY -= this.speedY; 
        this.speedY -= 5; 
    }

    /**
     * Steps through the death image sequence and permanently halts on the final frame.
     * @returns {void}
     */
    playDeathFrame() {
        if (this.currentImage < this.IMAGES_DEAD.length) {
            this.playAnimation(this.IMAGES_DEAD);
        } else {
            let lastImagePath = this.getLastImage(this.IMAGES_DEAD);
            this.img = this.imgCache[lastImagePath];
        }
    }

    /**
     * Subtracts health, registers the hit timestamp for immunity frames, and 
     * forces the boss into an aggressive counter-attack phase.
     * @param {number} damage - The numerical value to subtract from the boss's energy pool.
     * @returns {void}
     */
    hit(damage) {
        this.energy -= damage;
        this.counterAttackActive = true;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Helper method to extract the terminal string path from a given animation array.
     * @param {string[]} imagesArray - Target array of image paths.
     * @returns {string} The final string entry in the array.
     */
    getLastImage(imagesArray) {
        return imagesArray[imagesArray.length - 1];
    }
}