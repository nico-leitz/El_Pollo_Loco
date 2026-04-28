class MoveableObject extends DrawableObject {
    otherDirection;
    speedY = 0;
    acceleration = 1 ;
    energy = 100;
    lastHit = 0;

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imgCache[path];
        this.currentImage++;
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

    hit() {
        this.energy -= 20;
        if(this.energy < 0) {
            this.energy = 0;
        }
        else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 5;
    }

    isDead() {
        return this.energy == 0;
    }
}