/**
 * Represents a distinct game level, acting as a structural container for all 
 * environmental elements, enemies, and collectable items within a specific stage.
 */
class Level {
    /** @type {MoveableObject[]} Array containing all active enemy entities (e.g., chickens, boss). */
    enemies;
    
    /** @type {MoveableObject[]} Array of cloud objects utilized for atmospheric background movement. */
    clouds;
    
    /** @type {DrawableObject[]} Array of background layer objects structured for parallax scrolling. */
    layers;
    
    /** @type {CollectableObjects[]} Array of gatherable coin items placed within the level. */
    coins;
    
    /** @type {CollectableObjects[]} Array of collectable salsa bottle items placed on the ground. */
    bottles;
    
    /** @type {number} The absolute horizontal pixel coordinate marking the physical end boundary of the stage. */
    level_end_x = 4200 - 720;

    /**
     * Initializes a new level configuration by mapping the provided object arrays 
     * to the level's internal properties.
     * @param {MoveableObject[]} enemies - The collection of hostile entities.
     * @param {MoveableObject[]} clouds - The collection of background clouds.
     * @param {DrawableObject[]} layers - The collection of static or parallax background planes.
     * @param {CollectableObjects[]} coins - The collection of floating coin items.
     * @param {CollectableObjects[]} bottles - The collection of salsa bottles on the ground.
     */
    constructor(enemies, clouds, layers, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.layers = layers;
        this.coins = coins;
        this.bottles = bottles;
    }
}