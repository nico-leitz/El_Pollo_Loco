/** @type {HTMLCanvasElement | null} Reference to the main game canvas element. */
const canvasRef = document.getElementById('canvas');

/** @type {HTMLElement | null} Reference to the container used for fullscreen mode. */
const fullscreenRef = document.getElementById("canvas_container");

/** @type {HTMLElement | null} Reference to the start screen overlay. */
const startScreenRef = document.getElementById('start_screen');

/** @type {HTMLElement | null} Reference to the game over screen overlay. */
const gameOverScreenRef = document.getElementById('game_over_screen');

/** @type {HTMLElement | null} Reference to the win screen overlay. */
const winScreenRef = document.getElementById('win_screen');

/** @type {HTMLButtonElement | null} Button to start the game. */
const startBtnRef = document.getElementById('start_game_btn');

/** @type {HTMLButtonElement | null} Button to toggle fullscreen mode. */
const fullscreenBtnRef = document.getElementById('fullscreen_btn');

/** @type {HTMLButtonElement | null} Button to toggle global audio mute. */
const muteBtnRef = document.getElementById('mute_btn');

/** @type {HTMLElement | null} Wrapper for the in-game control UI. */
const gameControlsRef = document.getElementById('game_controls');

/** @type {HTMLButtonElement | null} Button to open the control/keybinding panel. */
const controllBtnRef = document.getElementById('controll_btn');

/** @type {HTMLElement | null} The control/keybinding information panel. */
const controllPanelRef = document.getElementById('controll_panel');

/** @type {HTMLButtonElement | null} Button to close the control panel. */
const closeControllBtnRef = document.getElementById('close_controll_btn');

/** @type {HTMLElement | null} Container for mobile touch control buttons. */
const mobileControlsRef = document.getElementById('mobile_controls');

/** @type {HTMLElement | null} Menu wrapper shown on game over. */
const gameOverMenuRef = document.getElementById('game_over_menu');

/** @type {HTMLButtonElement | null} Button to restart the game after losing. */
const gameOverRestartBtn = document.getElementById('game_over_restart_btn');

/** @type {HTMLButtonElement | null} Button to return to the home screen after losing. */
const gameOverHomeBtn = document.getElementById('game_over_home_btn');

/** @type {HTMLElement | null} Menu wrapper shown on winning the game. */
const winMenuRef = document.getElementById('win_menu');

/** @type {HTMLButtonElement | null} Button to restart the game after winning. */
const winRestartBtn = document.getElementById('win_restart_btn');

/** @type {HTMLButtonElement | null} Button to return to the home screen after winning. */
const winHomeBtn = document.getElementById('win_home_btn');

/** @type {boolean} Internal flag to prevent menu music from triggering after game starts. */
let isGameplayRunning = false;

// Initialize listeners
initEventListeners();
initMenuMusic();

/**
 * Initializes all event listeners for the game interface.
 */
function initEventListeners() {
    setupStartButton();
    setupGameOverButtons();
    setupWinButtons();
    setupControlPanelButtons();
    setupFullscreenButton();
}

/**
 * Starts the MENU_THEME loop when the user first clicks anywhere on the page.
 * This is required to bypass browser autoplay restrictions.
 */
function initMenuMusic() {
    const startMusicOnFirstClick = () => {
        if (!isGameplayRunning) {
            AudioManager.play(AudioManager.MENU_THEME, 0.005, true);
        }
        window.removeEventListener('click', startMusicOnFirstClick);
    };
    window.addEventListener('click', startMusicOnFirstClick);
}

/**
 * Handles the transition from menu to game.
 * Stops the menu version of the music.
 * Plays the GAME_START jingle once.
 * Restarts MENU_THEME loop for gameplay at ultra-low volume.
 */
function setupStartButton() {
    if (!startBtnRef) return;

    startBtnRef.addEventListener('click', (event) => {
        event.stopPropagation();
        isGameplayRunning = true;

        AudioManager.stop(AudioManager.MENU_THEME);
        AudioManager.play(AudioManager.GAME_START, 0.05, false);
    
        AudioManager.play(AudioManager.MENU_THEME, 0.005, true); 

        hideStartScreens();
        handleMobileStart();
        hideImprintElements();
        
        if (typeof init === 'function') init(); 
    });
}

/**
 * Hides imprint elements with high priority.
 */
function hideImprintElements() {
    const footer = document.getElementById('imprint_btn');
    const mobileLinks = document.querySelectorAll('.mobile-imprint');

    if (footer) footer.style.setProperty('display', 'none', 'important');
    mobileLinks.forEach(link => {
        link.style.setProperty('display', 'none', 'important');
    });
}

/**
 * Hides initial screens.
 */
function hideStartScreens() {
    if (startScreenRef) startScreenRef.classList.add('d_none');
    if (gameControlsRef) gameControlsRef.classList.add('d_none'); 
    if (controllPanelRef) controllPanelRef.classList.add('d_none'); 
    if (gameOverScreenRef) gameOverScreenRef.classList.add('d_none');
    if (gameOverMenuRef) gameOverMenuRef.classList.add('d_none');
}

/**
 * Handles mobile controls.
 */
function handleMobileStart() {
    if (window.matchMedia("(hover: none)").matches) {
        if (mobileControlsRef) {
            mobileControlsRef.classList.remove('d_none');
            mobileControlsRef.style.display = 'flex';
        }
        enterFullscreen(fullscreenRef);
    }
}

/**
 * Setup Game Over buttons and restarts music loop at ultra-low volume.
 */
function setupGameOverButtons() {
    if (gameOverRestartBtn) {
        gameOverRestartBtn.addEventListener('click', () => {
            hideGameOverUI();
            resetAllIntervals();
            AudioManager.play(AudioManager.MENU_THEME, 0.005, true);
            if (typeof init === 'function') init(); 
        });
    }
    if (gameOverHomeBtn) {
        gameOverHomeBtn.addEventListener('click', () => location.reload());
    }
}

/**
 * Hides Game Over UI.
 */
function hideGameOverUI() {
    if (gameOverScreenRef) gameOverScreenRef.classList.add('d_none');
    if (gameOverMenuRef) gameOverMenuRef.classList.add('d_none');
    if (startScreenRef) startScreenRef.classList.add('d_none');
    if (canvasRef) canvasRef.classList.remove('d_none');
    showMobileControlsIfMobile();
}

/**
 * Shows mobile controls.
 */
function showMobileControlsIfMobile() {
    if (window.matchMedia("(hover: none)").matches && mobileControlsRef) {
        mobileControlsRef.classList.remove('d_none');
        mobileControlsRef.style.display = 'flex';
    }
}

/**
 * Setup Win buttons and restarts music loop at ultra-low volume.
 */
function setupWinButtons() {
    if (winRestartBtn) {
        winRestartBtn.addEventListener('click', () => {
            if (winScreenRef) winScreenRef.classList.add('d_none');
            if (winMenuRef) winMenuRef.classList.add('d_none');
            if (canvasRef) canvasRef.classList.remove('d_none');
            showMobileControlsIfMobile();
            resetAllIntervals();
            AudioManager.play(AudioManager.MENU_THEME, 0.005, true);
            if (typeof init === 'function') init(); 
        });
    }
    if (winHomeBtn) {
        winHomeBtn.addEventListener('click', () => location.reload());
    }
}

/**
 * Handles control panel visibility.
 */
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

/**
 * Fullscreen button listener.
 */
function setupFullscreenButton() {
    if (fullscreenBtnRef) {
        fullscreenBtnRef.addEventListener('click', () => {
            toggleFullscreen(fullscreenRef);
            fullscreenBtnRef.blur();
        });
    }
}

/**
 * Hides active game UI.
 */
function hideActiveGameUI() {
    if (canvasRef) canvasRef.classList.add('d_none');
    if (mobileControlsRef) {
        mobileControlsRef.classList.add('d_none');
        mobileControlsRef.style.display = 'none';
    }
}

/**
 * Stops music and shows game over screen.
 */
function showGameOverScreen() {
    hideActiveGameUI();
    if (gameOverScreenRef) gameOverScreenRef.classList.remove('d_none');
    if (gameOverMenuRef) gameOverMenuRef.classList.remove('d_none');
    
    AudioManager.stop(AudioManager.MENU_THEME);
    
    resetAllIntervals();
    pauseCharacterSounds();
}

/**
 * Stops music and shows win screen.
 */
function showWinScreen() {
    hideActiveGameUI();
    if (winScreenRef) winScreenRef.classList.remove('d_none');
    if (winMenuRef) winMenuRef.classList.remove('d_none');
    
    AudioManager.stop(AudioManager.MENU_THEME);
    
    resetAllIntervals();
    pauseCharacterSounds();
}

/**
 * Clears all intervals.
 */
function resetAllIntervals() {
    let goThroughAllIntervalIDs = setInterval(() => {}, 1000);
    for (let i = 0; i <= goThroughAllIntervalIDs; i++) {
        window.clearInterval(i);
    }
}

/**
 * Pauses specific character sounds.
 */
function pauseCharacterSounds() {
    if (typeof AudioManager === 'undefined') return;
    if (AudioManager.CHARACTER_WALKING) AudioManager.CHARACTER_WALKING.pause();
    if (AudioManager.CHARACTER_DAMAGE) AudioManager.CHARACTER_DAMAGE.pause();
    if (AudioManager.CHARACTER_SNORING) AudioManager.CHARACTER_SNORING.pause();
}

/**
 * Fullscreen toggle helper.
 */
function toggleFullscreen(element) {
    if (!element) return;
    if (!document.fullscreenElement) {
        enterFullscreen(element);
    } else {
        exitFullscreen();
    }
}

/**
 * Enter Fullscreen.
 */
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

/**
 * Exit Fullscreen.
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

/**
 * Update Mute Icon.
 */
function updateMuteButtonIcon() {
    let icon = document.getElementById('mute_icon');
    if (!icon || typeof AudioManager === 'undefined') return;
    icon.src = AudioManager.isMuted ? 'img/sound-off.png' : 'img/volume-up.png';
}

/**
 * Toggle Mute state.
 */
function toggleMuteBtn() {
    if (typeof AudioManager !== 'undefined') {
        AudioManager.toggleMute();
        updateMuteButtonIcon(); 
    }
    if (muteBtnRef) muteBtnRef.blur(); 
}

/**
 * Binds mobile touch controls.
 */
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

/**
 * Touch listeners helper.
 */
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