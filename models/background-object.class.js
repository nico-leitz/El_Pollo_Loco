class BackgroundObjects extends MoveableObject {
    width = 720;
    height = 400;

    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.positionX = x;
        this.positionY = 480 - this.height; 
    }
}