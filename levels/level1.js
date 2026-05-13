let level1;

/**
 * Initializes the global level object by calling factory functions 
 * for enemies, clouds, backgrounds, coins, and bottles.
 * @returns {void}
 */
function initLevel() {
    level1 = new Level(
        createLevelEnemies(),
        createLevelClouds(),
        createLevelBackgrounds(),
        createLevelCoins(),
        createLevelBottles()
    );
}

/**
 * Spawns the standard array of game enemies for the level, 
 * including standard chickens, small chickens, and the final end boss.
 * @returns {MoveableObject[]} An array containing the instantiated level enemies.
 */
function createLevelEnemies() {
    return [
        new Chicken(), new Chicken(), new Chicken(), new Chicken(), new Chicken(),
        new SmallChicken(), new SmallChicken(), new SmallChicken(), 
        new SmallChicken(), new SmallChicken(), new Endboss()
    ];
}

/**
 * Creates the array of decorative cloud objects that drift through the sky layer.
 * @returns {Cloud[]} An array of instantiated cloud objects.
 */
function createLevelClouds() {
    return [new Cloud(), new Cloud(), new Cloud(), new Cloud(), new Cloud()];
}

/**
 * Generates the collectible coin assets distributed across the level landscape.
 * @returns {CoinObjects[]} An array of instantiated coin items.
 */
function createLevelCoins() {
    return [new CoinObjects(), new CoinObjects(), new CoinObjects(), new CoinObjects(), new CoinObjects()];
}

/**
 * Populates the level with a predefined set of collectible salsa bottle entities.
 * Includes random spawns for the early game and fixed positions for a boss-area supply.
 * @returns {BottleObjects[]} An array of instantiated bottle items.
 */
function createLevelBottles() {
    return [

        new BottleObjects(), new BottleObjects(), new BottleObjects(), 
        new BottleObjects(), new BottleObjects(), new BottleObjects(), 
        new BottleObjects(), new BottleObjects(), new BottleObjects(),
        new BottleObjects(),

        new BottleObjects(2800),
        new BottleObjects(2800),
        new BottleObjects(2800),
        new BottleObjects(2800),
        new BottleObjects(2800),
        new BottleObjects(2800),
        new BottleObjects(2800),
        new BottleObjects(2800),
        new BottleObjects(2800),
        new BottleObjects(2800),
        new BottleObjects(2800)
    ];
}

/**
 * Merges the background elements from both structural halves into a single, cohesive timeline array.
 * @returns {BackgroundObjects[]} A combined array containing all parallax background layer assets.
 */
function createLevelBackgrounds() {
    return [...getBackgroundFirstHalf(), ...getBackgroundSecondHalf()];
}

/**
 * Provides the first set of layered parallax background components spanning from X coordinate 0 up to coordinate 1438.
 * @returns {BackgroundObjects[]} An array of layered background structures for the first half of the level.
 */
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

/**
 * Provides the second set of layered parallax background components spanning from X coordinate 2157 up to the level end.
 * @returns {BackgroundObjects[]} An array of layered background structures for the second half of the level.
 */
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