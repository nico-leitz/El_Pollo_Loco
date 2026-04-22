class MoveableObject {
    positionX = 520;
    positionY = 250;
    height = 150;
    width = 100;
    img;

    loadImage(path) {
        this.img = new Image(); 
        this.img.src = path;
    }

    moveLeft() {

    }

    moveRight() {
        console.log("Moving right")
    }

    
}