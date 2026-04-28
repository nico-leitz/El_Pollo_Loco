class ThrowableObject extends MoveableObject {


    constructor(positionX, positionY) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.positionX = positionX;
        this.positionY = positionY;
        this.height = 60;
        this.width = 50;
        this.throw();
    }

    throw(){
        this.positionX = this.positionX;
        this.positionY = this.positionY;
        this.speedY = 10;
        this.applyGravity();
        setInterval(() => {
            this.positionX += 10;
        }, 25);
    }
}