class Chicken extends MoveableObject {
   positionY = 370;
   height = 60;
   width = 60;

    constructor() {
        super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
        this.positionX = 200 + Math.random() * 500;
    }
}