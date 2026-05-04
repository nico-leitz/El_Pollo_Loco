const canvasRef = document.getElementById('canvas');
const startScreenRef = document.getElementById('start_screen');
const gameOverScreenRef = document.getElementById('game_over_screen');
const startBtnRef = document.getElementById('start_game_btn');
const gameOverBtnRef = document.getElementById('game_over_btn');
const fullscreenRef =  document.getElementById("canvas_container");
const fullscreenBtnRef = document.getElementById('fullscreen_btn');

const gameControlsRef = document.getElementById('game_controls');
const controllBtnRef = document.getElementById('controll_btn');
const controllPanelRef = document.getElementById('controll_panel');
const closeControllBtnRef = document.getElementById('close_controll_btn');


startBtnRef.addEventListener('click', () => {
    startScreenRef.classList.add('d_none');
    gameControlsRef.classList.add('d_none'); 
    controllPanelRef.classList.add('d_none'); 
    
    gameOverScreenRef.classList.add('d_none');
    gameOverBtnRef.classList.add('d_none');
    
    init(); 
});


gameOverBtnRef.addEventListener('click', () => {
    gameOverScreenRef.classList.add('d_none');
    gameOverBtnRef.classList.add('d_none');
    
    startScreenRef.classList.remove('d_none');
    gameControlsRef.classList.remove('d_none'); 

    canvasRef.classList.remove('d_none');
});


controllBtnRef.addEventListener('click', () => {
    controllPanelRef.classList.remove('d_none');
});


closeControllBtnRef.addEventListener('click', () => {
    controllPanelRef.classList.add('d_none');
});

function showGameOverScreen() {
    canvasRef.classList.add('d_none');
    
    gameOverScreenRef.classList.remove('d_none');
    gameOverBtnRef.classList.remove('d_none');

    resetAllIntervals();
    
    world.character.walkAudio.pause();
    world.character.damageAudio.pause();
};

function resetAllIntervals() {
    let goThroughAllIntervalIDs = setInterval(() => {}, 1000);
    
    for (let i = 0; i <= goThroughAllIntervalIDs; i++) {
        window.clearInterval(i);
    }
}

fullscreenBtnRef.addEventListener('click', () => {
    toggleFullscreen(fullscreenRef);
});

function toggleFullscreen(element) {
    if (!document.fullscreenElement) {
        enterFullscreen(element);
    } else {
        exitFullscreen();
    }
}

function enterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) { 
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}