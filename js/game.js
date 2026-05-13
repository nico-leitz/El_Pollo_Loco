/** @type {HTMLCanvasElement} Reference to the main HTML canvas element used for rendering the game. */
let canvas;

/** @type {CanvasRenderingContext2D} The 2D rendering context tied to the game canvas. */
let ctx;

/** @type {World} The main game world instance managing all game objects, logic, and rendering. */
let world;

/** @type {Keyboard} The global keyboard instance tracking user input states (keys currently pressed). */
let keyboard = new Keyboard();

setupGameEnvironment();

/**
 * Main orchestrator to set up the global game infrastructure on initial script load.
 * Initializes input handlers, audio configurations, and mobile-specific UI adjustments.
 * @returns {void}
 */
function setupGameEnvironment() {
    initKeyboardListeners();
    initAudioSystem();
    checkMobileImprint();
}

/**
 * Initializes the active game session. Re-spawns the level data, binds touch controls,
 * references the drawing canvas, creates the game world instance, and starts checking for game-over triggers.
 * @returns {void}
 */
function init() {
    initLevel();
    bindTouchEvents();
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    world.character.checkGameOver();
}

/**
 * Registers global event listeners on the window object to capture hardware 
 * keyboard state modifications (`keydown` and `keyup`).
 * @returns {void}
 */
function initKeyboardListeners() {
    window.addEventListener('keydown', (event) => handleKeyEvent(event.keyCode, true));
    window.addEventListener('keyup', (event) => handleKeyEvent(event.keyCode, false));
}

/**
 * Maps standard browser keyboard event keycodes to the internal properties of 
 * the simulated boolean keyboard object tracking active button presses.
 * @param {number} keyCode - The native numeric browser keycode representing the interacted key.
 * @param {boolean} isPressed - The flag indicating whether the state is keydown (true) or keyup (false).
 * @returns {void}
 */
function handleKeyEvent(keyCode, isPressed) {
    if (keyCode == 37) keyboard.LEFT = isPressed;
    if (keyCode == 38) keyboard.UP = isPressed;
    if (keyCode == 39) keyboard.RIGHT = isPressed;
    if (keyCode == 40) keyboard.DOWN = isPressed;
    if (keyCode == 32) keyboard.SPACE = isPressed;
    if (keyCode == 68) keyboard.D = isPressed;
}

/**
 * Bootstraps the sound architecture if the global AudioManager module is loaded,
 * and ensures the correct icon matching the mute status is displayed.
 * @returns {void}
 */
function initAudioSystem() {
    if (typeof AudioManager !== 'undefined') {
        AudioManager.init();
        executeMuteButtonUpdate();
    }
}

/**
 * Triggers a visual synchronisation step for the UI audio control indicator 
 * by checking and calling the corresponding setup function.
 * @returns {void}
 */
function executeMuteButtonUpdate() {
    if (typeof updateMuteButtonIcon === 'function') {
        updateMuteButtonIcon();
    }
}

/**
 * Checks via media query whether the interface is rendered on a touch-driven device 
 * without true mouse hover mechanics, making the mobile legal/imprint notice visible if true.
 * @returns {void}
 */
function checkMobileImprint() {
    if (window.matchMedia("(hover: none)").matches) {
        const mobileImprint = document.getElementById('mobile_imprint_link');
        if (mobileImprint) mobileImprint.style.display = 'block';
    }
}
