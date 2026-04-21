class BackgroundObjects extends MoveableObject {
    positionY = 0;
    positionX = 0;
    width = 720;
    height = 480;

    constructor(imagePath) {
         super().loadImage(imagePath);
         
    }

    addToMap(background) {

    }
}