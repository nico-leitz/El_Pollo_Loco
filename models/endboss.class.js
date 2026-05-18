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
    /** @type {boolean} Flag triggered once the player enters the boss's immediate aggro range. */
    hadFirstContact = false;
    /** @type {boolean} Flag forcing the boss to chase indefinitely until it damages the player. */
    isEnraged = false;

    /**
     * Collision bounding box adjustments to fine-tune physical hit detection.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 60, bottom: 20, left: 40, right: 40
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
     * Initializes the Endboss, pre-loads all animation arrays, defines the starting position.
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
     * Starts logic and animation loops.
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            if (this.energy > 0) this.moveEndboss();
        }, 1000 / 60);

        setInterval(() => {
            this.evaluateAnimationState();
        }, 200);
    }

    /**
     * Evaluates the current state to play the correct animation frame sequence.
     * @returns {void}
     */
    evaluateAnimationState() {
        if (this.isDead()) {
            this.handleDeath();
        } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * Determines whether the boss should track the player or fall back into patrol.
     * @returns {void}
     */
    moveEndboss() {
        if (!this.world || !this.world.character) return;
        
        let charX = this.world.character.positionX;
        if (this.checkTargetTracking(charX)) {
            this.attackCharacter(charX);
        } else {
            this.executePatrol();
        }
    }

    /**
     * Checks if the boss is enraged or if the player is within aggro bounds.
     * @param {number} charX - The character's X coordinate.
     * @returns {boolean} True if tracking should occur.
     */
    checkTargetTracking(charX) {
        if (this.isEnraged) return true;
        
        if (Math.abs(this.positionX - charX) < 600) {
            this.hadFirstContact = true;
        }
        return this.evaluateArenaBounds(charX);
    }

    /**
     * Checks if the player has fled the boss arena area.
     * @param {number} charX - The character's X coordinate.
     * @returns {boolean} True if the player is still inside the arena.
     */
    evaluateArenaBounds(charX) {
        if (!this.hadFirstContact) return false;
        
        if (charX < this.startX - 700) {
            this.hadFirstContact = false;
            return false;
        }
        return true;
    }

    /**
     * Executes standard back-and-forth pacing behavior.
     * @returns {void}
     */
    executePatrol() {
        this.positionX += this.otherDirection ? this.speed : -this.speed;
        
        if (this.positionX > this.startX + 300) {
            this.otherDirection = false;
        } else if (this.positionX < this.startX - 300) {
            this.otherDirection = true;
        }
    }

    /**
     * Overrides patrol movement to aggressively shift towards the player.
     * @param {number} charX - The character's X coordinate.
     * @returns {void}
     */
    attackCharacter(charX) {
        if (this.positionX > charX) {
            this.positionX -= this.attackSpeed;
            this.otherDirection = false;
        } else if (this.positionX < charX) {
            this.positionX += this.attackSpeed;
            this.otherDirection = true;
        }
    }

    /**
     * Triggers the physics trajectory representing the boss's defeat.
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
            let lastPath = this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1];
            this.img = this.imgCache[lastPath];
        }
    }

    /**
     * Subtracts health and forces the boss into an enraged attack phase.
     * @param {number} damage - Value to subtract.
     * @returns {void}
     */
    hit(damage) {
        this.energy -= damage;
        this.isEnraged = true;
        
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }
}