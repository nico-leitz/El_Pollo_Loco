const canvasRef = document.getElementById('canvas');
const startScreenRef = document.getElementById('start_screen');
const gameOverScreenRef = document.getElementById('game_over_screen');
const startBtnRef = document.getElementById('start_game_btn');
const gameOverBtnRef = document.getElementById('game_over_btn');
const fullscreenRef =  document.getElementById("canvas_container");
const fullscreenBtnRef = document.getElementById('fullscreen_btn');

startBtnRef.addEventListener('click', () => {
    startScreenRef.classList.add('d_none');
    startBtnRef.classList.add('d_none');
    
    gameOverScreenRef.classList.add('d_none');
    gameOverBtnRef.classList.add('d_none');
    
    init(); 
});

gameOverBtnRef.addEventListener('click', () => {
    gameOverScreenRef.classList.add('d_none');
    gameOverBtnRef.classList.add('d_none');
    
    startScreenRef.classList.remove('d_none');
    startBtnRef.classList.remove('d_none');

    canvasRef.classList.remove('d_none');
});

function showGameOverScreen() {
    canvasRef.classList.add('d_none');
    
    gameOverScreenRef.classList.remove('d_none');
    gameOverBtnRef.classList.remove('d_none');
};

function resetAllIntervals() {
    window.clearInterval();
};