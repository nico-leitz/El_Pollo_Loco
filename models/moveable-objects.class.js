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
    return this.positionX + this.width > moveableObject.positionX &&
           this.positionY + this.height > moveableObject.positionY &&
           this.positionX < moveableObject.positionX + moveableObject.width &&
           this.positionY < moveableObject.positionY + moveableObject.height;
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
        return timePassed > 15000; 
    }
}