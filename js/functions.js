const canvasRef = document.getElementById('canvas');
const fullscreenRef = document.getElementById("canvas_container");

const startScreenRef = document.getElementById('start_screen');
const gameOverScreenRef = document.getElementById('game_over_screen');
const winScreenRef = document.getElementById('win_screen');

const startBtnRef = document.getElementById('start_game_btn');
const fullscreenBtnRef = document.getElementById('fullscreen_btn');
const muteBtnRef = document.getElementById('mute_btn');

const gameControlsRef = document.getElementById('game_controls');
const controllBtnRef = document.getElementById('controll_btn');
const controllPanelRef = document.getElementById('controll_panel');
const closeControllBtnRef = document.getElementById('close_controll_btn');
const mobileControlsRef = document.getElementById('mobile_controls');

const gameOverMenuRef = document.getElementById('game_over_menu');
const gameOverRestartBtn = document.getElementById('game_over_restart_btn');
const gameOverHomeBtn = document.getElementById('game_over_home_btn');

const winMenuRef = document.getElementById('win_menu');
const winRestartBtn = document.getElementById('win_restart_btn');
const winHomeBtn = document.getElementById('win_home_btn');

initEventListeners();

function initEventListeners() {
    setupStartButton();
    setupGameOverButtons();
    setupWinButtons();
    setupControlPanelButtons();
    setupFullscreenButton();
}

function setupStartButton() {
    if (!startBtnRef) return;
    startBtnRef.addEventListener('click', () => {
        hideStartScreens();
        handleMobileStart();
        if (typeof init === 'function') init(); 
    });
}

function hideStartScreens() {
    if (startScreenRef) startScreenRef.classList.add('d_none');
    if (gameControlsRef) gameControlsRef.classList.add('d_none'); 
    if (controllPanelRef) controllPanelRef.classList.add('d_none'); 
    if (gameOverScreenRef) gameOverScreenRef.classList.add('d_none');
    if (gameOverMenuRef) gameOverMenuRef.classList.add('d_none');
    const mobileImprint = document.getElementById('mobile_imprint_link');
    if (mobileImprint) mobileImprint.style.display = 'none';
}

function handleMobileStart() {
    if (window.matchMedia("(hover: none)").matches) {
        if (mobileControlsRef) {
            mobileControlsRef.classList.remove('d_none');
            mobileControlsRef.style.display = 'flex';
        }
        enterFullscreen(fullscreenRef);
    }
}

function setupGameOverButtons() {
    if (gameOverRestartBtn) {
        gameOverRestartBtn.addEventListener('click', () => {
            hideGameOverUI();
            resetAllIntervals();
            if (typeof init === 'function') init(); 
        });
    }
    if (gameOverHomeBtn) {
        gameOverHomeBtn.addEventListener('click', () => location.reload());
    }
}

function hideGameOverUI() {
    if (gameOverScreenRef) gameOverScreenRef.classList.add('d_none');
    if (gameOverMenuRef) gameOverMenuRef.classList.add('d_none');
    if (startScreenRef) startScreenRef.classList.add('d_none');
    if (canvasRef) canvasRef.classList.remove('d_none');
    showMobileControlsIfMobile();
}

function showMobileControlsIfMobile() {
    if (window.matchMedia("(hover: none)").matches && mobileControlsRef) {
        mobileControlsRef.classList.remove('d_none');
        mobileControlsRef.style.display = 'flex';
    }
}

function setupWinButtons() {
    if (winRestartBtn) {
        winRestartBtn.addEventListener('click', () => {
            if (winScreenRef) winScreenRef.classList.add('d_none');
            if (winMenuRef) winMenuRef.classList.add('d_none');
            if (canvasRef) canvasRef.classList.remove('d_none');
            showMobileControlsIfMobile();
            resetAllIntervals();
            if (typeof init === 'function') init(); 
        });
    }
    if (winHomeBtn) {
        winHomeBtn.addEventListener('click', () => location.reload());
    }
}

function setupControlPanelButtons() {
    if (controllBtnRef) {
        controllBtnRef.addEventListener('click', () => {
            if (controllPanelRef) controllPanelRef.classList.remove('d_none');
        });
    }
    if (closeControllBtnRef) {
        closeControllBtnRef.addEventListener('click', () => {
            if (controllPanelRef) controllPanelRef.classList.add('d_none');
        });
    }
}

function setupFullscreenButton() {
    if (fullscreenBtnRef) {
        fullscreenBtnRef.addEventListener('click', () => {
            toggleFullscreen(fullscreenRef);
            fullscreenBtnRef.blur();
        });
    }
}

function hideActiveGameUI() {
    if (canvasRef) canvasRef.classList.add('d_none');
    if (mobileControlsRef) {
        mobileControlsRef.classList.add('d_none');
        mobileControlsRef.style.display = 'none';
    }
}

function showGameOverScreen() {
    hideActiveGameUI();
    if (gameOverScreenRef) gameOverScreenRef.classList.remove('d_none');
    if (gameOverMenuRef) gameOverMenuRef.classList.remove('d_none');
    resetAllIntervals();
    pauseCharacterSounds();
}

function showWinScreen() {
    hideActiveGameUI();
    if (winScreenRef) winScreenRef.classList.remove('d_none');
    if (winMenuRef) winMenuRef.classList.remove('d_none');
    resetAllIntervals();
    pauseCharacterSounds();
}

function resetAllIntervals() {
    let goThroughAllIntervalIDs = setInterval(() => {}, 1000);
    for (let i = 0; i <= goThroughAllIntervalIDs; i++) {
        window.clearInterval(i);
    }
}

function pauseCharacterSounds() {
    if (typeof AudioManager === 'undefined') return;
    if (AudioManager.CHARACTER_WALKING) AudioManager.CHARACTER_WALKING.pause();
    if (AudioManager.CHARACTER_DAMAGE) AudioManager.CHARACTER_DAMAGE.pause();
    if (AudioManager.CHARACTER_SNORING) AudioManager.CHARACTER_SNORING.pause();
}

function toggleFullscreen(element) {
    if (!element) return;
    if (!document.fullscreenElement) {
        enterFullscreen(element);
    } else {
        exitFullscreen();
    }
}

function enterFullscreen(element) {
    if (!element) return;
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

function updateMuteButtonIcon() {
    let icon = document.getElementById('mute_icon');
    if (!icon || typeof AudioManager === 'undefined') return;
    if (AudioManager.isMuted) {
        icon.src = 'img/sound-off.png'; 
    } else {
        icon.src = 'img/volume-up.png';
    }
}

function toggleMuteBtn() {
    if (typeof AudioManager !== 'undefined') {
        AudioManager.toggleMute();
        updateMuteButtonIcon(); 
    }
    if (muteBtnRef) {
        muteBtnRef.blur(); 
    }
}

function bindTouchEvents() {
    setTimeout(() => {
        if (typeof keyboard === 'undefined') return;
        const btnMap = [
            { id: 'btn_left', key: 'LEFT' }, { id: 'btn_right', key: 'RIGHT' },
            { id: 'btn_jump', key: 'SPACE' }, { id: 'btn_throw', key: 'D' }
        ];
        btnMap.forEach(btn => attachTouchListeners(btn));
    }, 500);
}

function attachTouchListeners(btn) {
    const element = document.getElementById(btn.id);
    if (!element) return;
    element.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard[btn.key] = true;
    });
    element.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard[btn.key] = false;
    });
}