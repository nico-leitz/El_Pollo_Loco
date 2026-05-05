class NonMovableObject extends MoveableObject {
    currentImage = 0;

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        
        
        if (this.imgCache && this.imgCache[path]) {
            this.img = this.imgCache[path];
            this.currentImage++;
        } else {
            console.warn('Couldnt find image:', path);
        }
    }
}
