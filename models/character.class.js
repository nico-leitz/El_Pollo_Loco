class Character extends MoveableObject {
    positionY = 130;
    height = 300;
    width = 150;
   
    constructor() {
        super().loadImage("img/2_character_pepe/2_walk/W-21.png");
        this.positionX = 100;
    }

    jump() {
        
    }
}