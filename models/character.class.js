class Character extends MoveableObject {
    positionX = 100;
    positionY = 140;
    height = 280;
    width = 140;
    isGameOver = false;

    offset = {
        top: 120,
        bottom: 30,
        left: 40,
        right: 40
    };

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];
    
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png',

    ];

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    currentImage = 0;
    world;
   
    constructor() {
        super();
        this.loadImage("img/2_character_pepe/2_walk/W-21.png");
        this.speed = 2.45;
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.walkAudio = new Audio('sounds/character/characterRun.mp3'); 
        this.damageAudio = new Audio('sounds/character/characterDamage.mp3');
        this.jumpAudio = new Audio('sounds/character/characterJump.wav');
        this.snoringAudio = new Audio('sounds/character/characterSnoring.mp3');
        this.deadAudio = new Audio('sounds/character/characterDead.wav');
        
        this.energy = 100;
        this.lastAction = new Date().getTime();
        this.applyGravity();
        this.animate();
        this.move();
        this.checkGameOver();
    }

  animate() {
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGES_DEAD);
            } 
            else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
                this.damageAudio.volume = 0.02;
                this.damageAudio.play();     
            } 
            else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);  
            } 
            else if (this.world.keyboard.D) {
                this.lastAction = new Date().getTime();
                this.loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
            }
            else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_WALKING);
                this.lastAction = new Date().getTime();
            } 
            else if (this.isLongIdle()) {
                this.playAnimation(this.IMAGES_LONG_IDLE);
                this.snoringAudio.volume = 0.02;
                this.snoringAudio.play();   
            } 
            else {
                this.playAnimation(this.IMAGES_IDLE);
            }
        }, 100);
    };

    move() {
    setInterval(() => {
        this.walkAudio.pause(); 

        if (this.world.keyboard.RIGHT && this.positionX < this.world.level.level_end_x) {
            this.moveRight(); 
            if (!this.isAboveGround()) {
                this.walkAudio.volume = 0.02;
                this.walkAudio.play();
            }
        }

        if (this.world.keyboard.LEFT && this.positionX > 0) {
            this.moveLeft();
            if (!this.isAboveGround()) {
                this.walkAudio.volume = 0.02;
                this.walkAudio.play();
            }
        } 

        if(this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            this.jumpAudio.volume = 0.02;
            this.jumpAudio.play();
        }
        
        let cameraPosition = -this.positionX + 100;
        if (cameraPosition > 0) {
            cameraPosition = 0;
        }
        
        this.world.camera_x = cameraPosition; 
        
        }, 1000 / 60);
    }

    moveRight() {
        this.positionX += 2.45;
        this.otherDirection = false;
    }

    moveLeft() {
        this.positionX -= 2.45;
        this.otherDirection = true;  
    }

    jump() {
        this.speedY = 15;
    }

    checkGameOver() {
        setInterval(() => {
            if (this.isDead() && !this.isGameOver) {
                this.isGameOver = true;
                this.deadAudio.volume = 0.05;
                this.deadAudio.play();
                console.log("Pepe is dead");
                showGameOverScreen();
            }
        }, 100);
    }
}