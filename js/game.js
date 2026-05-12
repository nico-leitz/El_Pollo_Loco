let canvas;
let ctx;
let world;
let keyboard = new Keyboard();

function init() {
    initLevel();
    bindTouchEvents();
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    world.character.checkGameOver();
};


window.addEventListener('keydown', (event) => {
    if(event.keyCode == 37)
    keyboard.LEFT = true;

    if(event.keyCode == 38)
    keyboard.UP = true;

    if(event.keyCode == 39)
    keyboard.RIGHT = true;

    if(event.keyCode == 40)
    keyboard.DOWN = true;

    if(event.keyCode == 32)
    keyboard.SPACE = true;

    if(event.keyCode == 68)
    keyboard.D = true;
});

window.addEventListener('keyup', (event) => {
    if(event.keyCode == 37)
    keyboard.LEFT = false;

    if(event.keyCode == 38)
    keyboard.UP = false;

    if(event.keyCode == 39)
    keyboard.RIGHT = false;

    if(event.keyCode == 40)
    keyboard.DOWN = false;

    if(event.keyCode == 32)
    keyboard.SPACE = false;

    if(event.keyCode == 68)
    keyboard.D = false;
});

if (typeof AudioManager !== 'undefined') {
    AudioManager.init();
    if (typeof updateMuteButtonIcon === 'function') {
        updateMuteButtonIcon();
    }
}

if (window.matchMedia("(hover: none)").matches) {
    const mobileImprint = document.getElementById('mobile_imprint_link');
    if (mobileImprint) mobileImprint.style.display = 'block';
}