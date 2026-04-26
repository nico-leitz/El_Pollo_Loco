class StatusBar extends DrawableObject {
    percentage = 100;

    IMAGES_HEALTH = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/orange/100.png'
    ];

    constructor() {
        this.loadImages(this.IMAGES_HEALTH);
        let imagePath = this.IMAGES_HEALTH[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    setHealth(percentage) {
        this.percentage = percentage;
    }
        
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } 
            
        else if (this.percentage > 80) {
            return 4;
        }

        else if (this.percentage > 60) {
            return 3;
        }

        else if (this.percentage > 40) {
            return 2;
        }

        else if (this.percentage > 20) {
            return 1;
        }

        else {
            return 0;
        }
      }
    };

