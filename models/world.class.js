class World {
    character = new Character();
    enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
    ];
    clouds = [
        new Cloud(),
        new Cloud(),
    ]
    layer1 = [
        new BackgroundObjects("img/5_background/layers/1_first_layer/1.png"),
        new BackgroundObjects("img/5_background/layers/1_first_layer/2.png"),
        new BackgroundObjects("img/5_background/layers/1_first_layer/full.png")
    ]
    layer2 = [
        new BackgroundObjects("img/5_background/layers/2_second_layer/1.png"),
        new BackgroundObjects("img/5_background/layers/2_second_layer/2.png"),
        new BackgroundObjects("img/5_background/layers/2_second_layer/full.png"),
    ] 
    layer3 = [
        new BackgroundObjects("img/5_background/layers/3_third_layer/1.png"),
        new BackgroundObjects("img/5_background/layers/3_third_layer/2.png"),
        new BackgroundObjects("img/5_background/layers/3_third_layer/full.png"),
    ] 
    canvas;
    ctx;
    
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.draw();
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

         this.layer3.forEach(background => {
            this.ctx.drawImage(
                background.img,
                background.positionX,
                background.positionY,
                background.width,
                background.height
            )}   
        ); 

         this.layer2.forEach(background => {
            this.ctx.drawImage(
                background.img,
                background.positionX,
                background.positionY,
                background.width,
                background.height
            )}   
        ); 

        this.layer1.forEach(background => {
            this.ctx.drawImage(
                background.img,
                background.positionX,
                background.positionY,
                background.width,
                background.height
            )}   
        );        

        this.ctx.drawImage(
            this.character.img, 
            this.character.positionX, 
            this.character.positionY,
            this.character.width,
            this.character.height
        );

        this.enemies.forEach(enemy => {
            this.ctx.drawImage(
                enemy.img, 
                enemy.positionX, 
                enemy.positionY,
                enemy.width,
                enemy.height
            )
        });

        this.clouds.forEach(cloud => {
            this.ctx.drawImage(
                cloud.img,
                cloud.positionX,
                cloud.positionY,
                cloud.width,
                cloud.height
            )
        });

          

        // Wir müssen hier "self" verwenden weil "this" in "requestAnimationFrame"
        // nicht funktioniert
        let self = this;
        requestAnimationFrame(function() {
             self.draw(); // Draw wird immer wieder aufgerufen
        })
    }
}