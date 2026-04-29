class CollectableObjects extends NonMovableObject {
    
    constructor() {
       super();
       this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 100);
    };
}