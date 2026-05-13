/**
 * Represents the main playable character (Pepe), handling movement, physics, 
 * state-based animations, and camera tracking.
 * @extends MoveableObject
 */
class Character extends MoveableObject {
    /** @type {number} The horizontal spawn coordinate. */
    positionX = 100;
    /** @type {number} The vertical spawn coordinate. */
    positionY = 140;
    /** @type {number} The visual rendering height of the character. */
    height = 280;
    /** @type {number} The visual rendering width of the character. */
    width = 140;
    /** @type {boolean} Flag indicating if the character has triggered a game-over state. */
    isGameOver = false;
    /** @type {number} Tracks the current frame index during the jump animation sequence. */
    currentJumpImage = 0;
    /** @type {number} Frame counter used to control the speed of the jump animation. */
    jumpTick = 0;

    /**
     * Collision bounding box adjustments to fine-tune physical hit detection.
     * @type {{top: number, bottom: number, left: number, right: number}}
     */
    offset = {
        top: 100,
        bottom: 0,
        left: 40,   
        right: 40
    };

    /** @type {string[]} Image paths for the horizontal walking animation. */
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png', 'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png', 'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png', 'img/2_character_pepe/2_walk/W-26.png'
    ];

    /** @type {string[]} Image paths for the vertical jump sequence. */
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png', 'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png', 'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png', 'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png', 'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];
    
    /** @type {string[]} Image paths for the death animation. */
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png', 'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png', 'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png', 'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    /** @type {string[]} Image paths indicating damage/hurt states. */
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png', 'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    /** @type {string[]} Image paths for the standard standing idle loop. */
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png', 'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png', 'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png', 'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png', 'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png', 'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    /** @type {string[]} Image paths for the prolonged sleeping/idle loop. */
    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png', 'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png', 'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png', 'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png', 'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png', 'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    /** @type {number} Shared index tracker for standard animations. */
    currentImage = 0;
    
    /** @type {Object} Reference to the global game world context. */
    world;
   
    /**
     * Initializes the character, pre-loads graphic assets, defines speed, 
     * sets starting health, starts physics engines, and initiates interaction loops.
     */
    constructor() {
        super();
        this.loadImage("img/2_character_pepe/2_walk/W-21.png");
        this.speed = 3.2; 
        this.loadCharacterAnimations();
        this.energy = 100;
        this.lastAction = new Date().getTime();
        this.applyGravity();
        this.animate();
        this.move();
        this.checkGameOver();
    }

    /**
     * Pushes all character-related animation sprite arrays into the inherited image cache.
     * @returns {void}
     */
    loadCharacterAnimations() {
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
    }

    /**
     * Main visual loop evaluating the character's physical state (dead, hurt, jumping, grounded)
     * and routing to the appropriate animation rendering function at a 100ms interval.
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } else if (this.isHurt()) {
                this.handleHurtAnimation();
            } else if (this.isAboveGround()) {
                this.playJumpAnimation();  
            } else {
                this.handleGroundAnimation();
            }
        }, 100);
    }

    /**
     * Plays the hurt frame sequence and triggers the damage audio effect.
     * @returns {void}
     */
    handleHurtAnimation() {
        this.playAnimation(this.IMAGES_HURT);
        AudioManager.play(AudioManager.CHARACTER_DAMAGE, 0.02);
    }

    /**
     * Evaluates grounded keyboard inputs or idle times to execute walking, 
     * short idle, or sleeping/long idle animations.
     * @returns {void}
     */
    handleGroundAnimation() {
        this.currentJumpImage = 0;
        this.jumpTick = 0;
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.handleWalkingAnimation();
        } else if (this.isLongIdle()) {
            this.playAnimation(this.IMAGES_LONG_IDLE);
            AudioManager.play(AudioManager.CHARACTER_SNORING, 0.02);
        } else {
            this.playAnimation(this.IMAGES_IDLE);
            this.stopSnoring();
        }
    }

    /**
     * Triggers the walking animation sequence, resets the inactivity timer, 
     * and stops any lingering idle audio effects.
     * @returns {void}
     */
    handleWalkingAnimation() {
        this.playAnimation(this.IMAGES_WALKING);
        this.lastAction = new Date().getTime();
        this.stopSnoring();
    }

    /**
     * Pauses the character's snoring audio track if it is currently playing.
     * @returns {void}
     */
    stopSnoring() {
        if (AudioManager.CHARACTER_SNORING) {
            AudioManager.CHARACTER_SNORING.pause();
        }
    }

    /**
     * Steps through the jump sprite sequence manually based on a tick counter.
     * Freezes on the final jump frame to prevent mid-air animation resets.
     * @returns {void}
     */
    playJumpAnimation() {
        if (this.currentJumpImage >= this.IMAGES_JUMPING.length) {
            let lastPath = this.IMAGES_JUMPING[this.IMAGES_JUMPING.length - 1];
            this.img = this.imgCache[lastPath];
            return;
        }
        if (this.jumpTick % 2 === 0) {
            let path = this.IMAGES_JUMPING[this.currentJumpImage];
            this.img = this.imgCache[path];
            this.currentJumpImage++;
        }
        this.jumpTick++;
    }

    /**
     * Master movement physics loop running at ~60fps handling horizontal 
     * translation, jump inputs, camera tracking, and movement audio execution.
     * @returns {void}
     */
    move() {
        setInterval(() => {
            if (AudioManager.CHARACTER_WALKING) {
                AudioManager.CHARACTER_WALKING.pause(); 
            }
            this.handleHorizontalMovement();
            this.handleJumpInput();
            this.updateCamera();
        }, 1000 / 60);
    }

    /**
     * Reads directional keyboard inputs, validates boundaries, and executes 
     * movement adjustments while triggering walking sounds.
     * @returns {void}
     */
    handleHorizontalMovement() {
        if (this.world.keyboard.RIGHT && this.positionX < this.world.level.level_end_x) {
            this.moveRight(); 
            this.playWalkSound();
        }
        if (this.world.keyboard.LEFT && this.positionX > 0) {
            this.moveLeft();
            this.playWalkSound();
        } 
    }

    /**
     * Plays the running footstep audio cue strictly if the character is touching the ground.
     * @returns {void}
     */
    playWalkSound() {
        if (!this.isAboveGround()) {
            AudioManager.play(AudioManager.CHARACTER_WALKING, 0.02);
        }
    }

    /**
     * Evaluates jump input events and triggers vertical velocity logic if grounded.
     * @returns {void}
     */
    handleJumpInput() {
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            AudioManager.play(AudioManager.CHARACTER_JUMP, 0.02);
        }
    }

    /**
     * Dynamically shifts the global camera viewpoint based on the character's 
     * X coordinate, preventing the camera from panning left of the start line.
     * @returns {void}
     */
    updateCamera() {
        let cameraPosition = -this.positionX + 100;
        if (cameraPosition > 0) {
            cameraPosition = 0;
        }
        this.world.camera_x = cameraPosition; 
    }

    /**
     * Moves the character's position positively along the X-axis and sets orientation to face right.
     * @returns {void}
     */
    moveRight() {
        this.positionX += this.speed; 
        this.otherDirection = false;
    }

    /**
     * Moves the character's position negatively along the X-axis and mirrors the sprite to face left.
     * @returns {void}
     */
    moveLeft() {
        this.positionX -= this.speed; 
        this.otherDirection = true;  
    }

    /**
     * Initiates a jump by applying an upward burst of vertical velocity 
     * and resetting the jump animation tracking indexes.
     * @returns {void}
     */
    jump() {
        this.speedY = 15;
        this.currentJumpImage = 0;
        this.jumpTick = 0;
        let path = this.IMAGES_JUMPING[0];
        this.img = this.imgCache[path];
    }

    /**
     * Continuously monitors the character's vital state. Triggers the end-game sequence, 
     * audio, and logs the death once health depletes.
     * @returns {void}
     */
    checkGameOver() {
        setInterval(() => {
            if (this.isDead() && !this.isGameOver) {
                this.isGameOver = true;
                AudioManager.play(AudioManager.CHARACTER_DEAD, 0.05);
                console.log("Pepe is dead");
                showGameOverScreen();
            }
        }, 100);
    }
}