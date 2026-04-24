class MoveableObject {
    positionX = 520;
    positionY = 250;
    height = 150;
    width = 100;
    img;
    imgCache = {};
    otherDirection;
    speedY = 0;
    acceleration = 2.5;

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
        let i = this.currentImage % this.IMAGES_WALKING.length;
        let path = images[i];
        this.img = this.imgCache[path];
        this.currentImage++;
    }

    applyGravity() {
        setInterval(() => {
        if(this.isAboveGround())
         this.positionY += this.speedY;
         this.speedY += this.acceleration;
         
        }, 1000 / 25)
    }

    isAboveGround() {
        return this.positionY <= 150
    }
}