class MoveableObject {
    positionX = 520;
    positionY = 250;
    height = 150;
    width = 100;
    img;
    imgCache = {};
    otherDirection;

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

    moveLeft() {

    }

    moveRight() {
        console.log("Moving right")
    }

    
}