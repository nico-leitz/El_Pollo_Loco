class MoveableObject extends DrawableObject {
    otherDirection;
    speedY = 0;
    acceleration = 1 ;
    energy = 100;
    damage = 20;
    lastHit = 0;
    walkAudio;
    damageAudio;
    jumpAudio;
    snoringAudio;
    deadAudio;
    speed = 0.15;

    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };

    rX;
    rY;
    rW;
    rH;

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imgCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.positionX += this.speed;
    }

    moveLeft() {
        this.positionX -= this.speed;
    }

    applyGravity() {
        setInterval(() => {
        if(this.isAboveGround() || this.speedY > 0) {
         this.positionY -= this.speedY;
         this.speedY -= this.acceleration;
         } 
        }, 1000 / 25)
    }

    isAboveGround() {
        if(this instanceof ThrowableObject) {
            return true;
        } 
        else {
            return this.positionY < 150
        }     
    }

    isColliding(moveableObject) {
       this.getRealFrame();
       moveableObject.getRealFrame();

       return this.rX + this.rW > moveableObject.rX &&
              this.rY + this.rH > moveableObject.rY &&
              this.rX < moveableObject.rX + moveableObject.rW &&
              this.rY < moveableObject.rY + moveableObject.rH;
   }

    getRealFrame() {
        this.rX = this.positionX + this.offset.left;
        this.rY = this.positionY + this.offset.top;
        this.rW = this.width - this.offset.left - this.offset.right;
        this.rH = this.height - this.offset.top - this.offset.bottom;
    }

   hit(damage) {
    let damageValue = damage || 0; 
    
    this.energy -= damageValue;

    if(this.energy <= 0) {
        this.energy = 0;
    }
    this.lastHit = new Date().getTime();
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 100;
        return timepassed < 5;
    }

    isDead() {
        return this.energy == 0;
    }

    isLongIdle() {
        let timePassed = new Date().getTime() - this.lastAction;
        return timePassed > 10000; 
    }
}