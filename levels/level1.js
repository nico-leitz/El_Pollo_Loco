let level1;

function initLevel() {
    level1 = new Level(
        createLevelEnemies(),
        createLevelClouds(),
        createLevelBackgrounds(),
        createLevelCoins(),
        createLevelBottles()
    );
}

function createLevelEnemies() {
    return [
        new Chicken(), new Chicken(), new Chicken(), new Chicken(), new Chicken(),
        new SmallChicken(), new SmallChicken(), new SmallChicken(), 
        new SmallChicken(), new SmallChicken(), new Endboss()
    ];
}

function createLevelClouds() {
    return [new Cloud(), new Cloud(), new Cloud(), new Cloud(), new Cloud()];
}

function createLevelCoins() {
    return [new CoinObjects(), new CoinObjects(), new CoinObjects(), new CoinObjects(), new CoinObjects()];
}

function createLevelBottles() {
    return [
        new BottleObjects(), new BottleObjects(), new BottleObjects(), 
        new BottleObjects(), new BottleObjects(), new BottleObjects(), 
        new BottleObjects()
    ];
}

function createLevelBackgrounds() {
    return [...getBackgroundFirstHalf(), ...getBackgroundSecondHalf()];
}

function getBackgroundFirstHalf() {
    return [
        new BackgroundObjects("img/5_background/layers/air.png", 0),
        new BackgroundObjects("img/5_background/layers/3_third_layer/1.png", 0),
        new BackgroundObjects("img/5_background/layers/2_second_layer/1.png", 0),
        new BackgroundObjects("img/5_background/layers/1_first_layer/1.png", 0),
        new BackgroundObjects("img/5_background/layers/air.png", 719),
        new BackgroundObjects("img/5_background/layers/3_third_layer/2.png", 719),
        new BackgroundObjects("img/5_background/layers/2_second_layer/2.png", 719),
        new BackgroundObjects("img/5_background/layers/1_first_layer/2.png", 719),
        new BackgroundObjects("img/5_background/layers/air.png", 719 * 2),
        new BackgroundObjects("img/5_background/layers/3_third_layer/1.png", 719 * 2),
        new BackgroundObjects("img/5_background/layers/2_second_layer/1.png", 719 * 2),
        new BackgroundObjects("img/5_background/layers/1_first_layer/1.png", 719 * 2)
    ];
}

function getBackgroundSecondHalf() {
    return [
        new BackgroundObjects("img/5_background/layers/air.png", 719 * 3),
        new BackgroundObjects("img/5_background/layers/3_third_layer/2.png", 719 * 3),
        new BackgroundObjects("img/5_background/layers/2_second_layer/2.png", 719 * 3),
        new BackgroundObjects("img/5_background/layers/1_first_layer/2.png", 719 * 3),
        new BackgroundObjects("img/5_background/layers/air.png", 719 * 4),
        new BackgroundObjects("img/5_background/layers/3_third_layer/1.png", 719 * 4),
        new BackgroundObjects("img/5_background/layers/2_second_layer/1.png", 719 * 4),
        new BackgroundObjects("img/5_background/layers/1_first_layer/1.png", 719 * 4),
        new BackgroundObjects("img/5_background/layers/air.png", 719 * 5),
        new BackgroundObjects("img/5_background/layers/3_third_layer/2.png", 719 * 5),
        new BackgroundObjects("img/5_background/layers/2_second_layer/2.png", 719 * 5),
        new BackgroundObjects("img/5_background/layers/1_first_layer/2.png", 719 * 5)
    ];
}