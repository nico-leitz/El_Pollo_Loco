class Level {
    enemies;
    clouds;
    layers;
    level_end_x = 1400;

    constructor(enemies, clouds, layers) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.layers = layers;
    }
}