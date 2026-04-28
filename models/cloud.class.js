class Cloud extends MoveableObject {
     positionY = 20;
     height = 250;
     width = 500;

    constructor() {
        super().loadImage("img/5_background/layers/4_clouds/1.png");
        
        this.positionX = Math.random() * 3000;
        this.animate();
       
    }

    animate() {
        setInterval(() => {
             this.positionX -= 0.15;
        }, 1000 / 60)
       
    }
}