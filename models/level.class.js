class Level {
    enemies;
    clouds;
    layers;
    coins;
    bottles;
    level_end_x = 4200 - 720;

    constructor(enemies, clouds, layers, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.layers = layers;
        this.coins = coins;
        this.bottles = bottles;
    }
}