class Sky extends MoveableObject {

    positionX = 0; 
    positionY = 0;
    width = 720;
    height = 480;

    constructor(imagePath) {
        super().loadImage(imagePath);

        this.positionX = 0;
        this.positionY = 0;
    }
}