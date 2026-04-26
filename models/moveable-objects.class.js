class MoveableObject {
    positionX = 520;
    positionY = 250;
    height = 150;
    width = 100;
    img;
    imgCache = {};
    otherDirection;
    speedY = 0;
    acceleration = 1 ;
    energy = 100;
    lastHit = 0;

    loadImage(path) {
        this.img = new Image(); 
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imgCache[path] = img;
        });
    }

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
        return this.positionY < 150
    }

   isColliding(moveableObject) {
    return this.positionX + this.width > moveableObject.positionX &&
           this.positionY + this.height > moveableObject.positionY &&
           this.positionX < moveableObject.positionX + moveableObject.width &&
           this.positionY < moveableObject.positionY + moveableObject.height;
    }

    hit() {
        this.energy -= 5;
        if(this.energy < 0) {
            this.energy = 0;
        }
        else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 250;
        return timepassed < 5;
    }

    isDead() {
        return this.energy == 0;
    }
}