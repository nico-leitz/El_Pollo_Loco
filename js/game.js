let canvas;
let ctx;
let world;
let keyboard = new Keyboard();

setupGameEnvironment();

function setupGameEnvironment() {
    initKeyboardListeners();
    initAudioSystem();
    checkMobileImprint();
}

function init() {
    initLevel();
    bindTouchEvents();
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    world.character.checkGameOver();
}

function initKeyboardListeners() {
    window.addEventListener('keydown', (event) => handleKeyEvent(event.keyCode, true));
    window.addEventListener('keyup', (event) => handleKeyEvent(event.keyCode, false));
}

function handleKeyEvent(keyCode, isPressed) {
    if (keyCode == 37) keyboard.LEFT = isPressed;
    if (keyCode == 38) keyboard.UP = isPressed;
    if (keyCode == 39) keyboard.RIGHT = isPressed;
    if (keyCode == 40) keyboard.DOWN = isPressed;
    if (keyCode == 32) keyboard.SPACE = isPressed;
    if (keyCode == 68) keyboard.D = isPressed;
}

function initAudioSystem() {
    if (typeof AudioManager !== 'undefined') {
        AudioManager.init();
        executeMuteButtonUpdate();
    }
}

function executeMuteButtonUpdate() {
    if (typeof updateMuteButtonIcon === 'function') {
        updateMuteButtonIcon();
    }
}

function checkMobileImprint() {
    if (window.matchMedia("(hover: none)").matches) {
        const mobileImprint = document.getElementById('mobile_imprint_link');
        if (mobileImprint) mobileImprint.style.display = 'block';
    }
}