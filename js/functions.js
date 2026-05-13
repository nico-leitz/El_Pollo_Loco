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

initEventListeners();

/**
 * Initializes all event listeners for the game interface, including buttons for 
 * starting the game, game over states, win states, control panels, and fullscreen mode.
 * @returns {void}
 */
function initEventListeners() {
    setupStartButton();
    setupGameOverButtons();
    setupWinButtons();
    setupControlPanelButtons();
    setupFullscreenButton();
}

/**
 * Sets up the click event listener for the start game button to trigger visibility changes,
 * mobile controls handling, and game initialization.
 * @returns {void}
 */
function setupStartButton() {
    if (!startBtnRef) return;
    startBtnRef.addEventListener('click', () => {
        hideStartScreens();
        handleMobileStart();
        if (typeof init === 'function') init(); 
    });
}

/**
 * Hides all initial screens, control menus, game over overlays, and general 
 * menu elements to prepare the UI for active gameplay.
 * @returns {void}
 */
function hideStartScreens() {
    if (startScreenRef) startScreenRef.classList.add('d_none');
    if (gameControlsRef) gameControlsRef.classList.add('d_none'); 
    if (controllPanelRef) controllPanelRef.classList.add('d_none'); 
    if (gameOverScreenRef) gameOverScreenRef.classList.add('d_none');
    if (gameOverMenuRef) gameOverMenuRef.classList.add('d_none');
    const mobileImprint = document.getElementById('mobile_imprint_link');
    if (mobileImprint) mobileImprint.style.display = 'none';
}

/**
 * Detects if the user is on a touch device without standard hover capabilities, 
 * then displays mobile touch controls and forces fullscreen mode.
 * @returns {void}
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
 * Sets up the click event listeners for the game over overlay buttons 
 * (restarting the game or navigating back to the home state).
 * @returns {void}
 */
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

/**
 * Hides the game over screens, ensures the canvas is visible, and conditionally 
 * recovers mobile touch controls if running on a mobile device.
 * @returns {void}
 */
function hideGameOverUI() {
    if (gameOverScreenRef) gameOverScreenRef.classList.add('d_none');
    if (gameOverMenuRef) gameOverMenuRef.classList.add('d_none');
    if (startScreenRef) startScreenRef.classList.add('d_none');
    if (canvasRef) canvasRef.classList.remove('d_none');
    showMobileControlsIfMobile();
}

/**
 * Validates device capabilities and displays the mobile controls overlay 
 * if a touch device is detected.
 * @returns {void}
 */
function showMobileControlsIfMobile() {
    if (window.matchMedia("(hover: none)").matches && mobileControlsRef) {
        mobileControlsRef.classList.remove('d_none');
        mobileControlsRef.style.display = 'flex';
    }
}

/**
 * Sets up event listeners for the win screen UI, allowing players to either 
 * restart the game session or reload to the home menu.
 * @returns {void}
 */
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

/**
 * Configures listeners to handle opening and closing actions for the 
 * key bindings/controls information panel.
 * @returns {void}
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
 * Assigns a click listener to the fullscreen button to toggle view modes 
 * and automatically removes focus from the element to prevent keyboard event issues.
 * @returns {void}
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
 * Hides the main active game elements, specifically targeting the drawing canvas 
 * and the on-screen mobile control pad.
 * @returns {void}
 */
function hideActiveGameUI() {
    if (canvasRef) canvasRef.classList.add('d_none');
    if (mobileControlsRef) {
        mobileControlsRef.classList.add('d_none');
        mobileControlsRef.style.display = 'none';
    }
}

/**
 * Triggers the visual Game Over UI sequence, shuts down active rendering loops, 
 * and mutes continuous character-related audio effects.
 * @returns {void}
 */
function showGameOverScreen() {
    hideActiveGameUI();
    if (gameOverScreenRef) gameOverScreenRef.classList.remove('d_none');
    if (gameOverMenuRef) gameOverMenuRef.classList.remove('d_none');
    resetAllIntervals();
    pauseCharacterSounds();
}

/**
 * Triggers the visual Victory/Win UI sequence, stops all background operational loops, 
 * and ceases repetitive character audio patterns.
 * @returns {void}
 */
function showWinScreen() {
    hideActiveGameUI();
    if (winScreenRef) winScreenRef.classList.remove('d_none');
    if (winMenuRef) winMenuRef.classList.remove('d_none');
    resetAllIntervals();
    pauseCharacterSounds();
}

/**
 * Spawns a dummy interval to capture the maximum active browser loop identifier, 
 * then forcefully clears every active window interval registered up to that point.
 * @returns {void}
 */
function resetAllIntervals() {
    let goThroughAllIntervalIDs = setInterval(() => {}, 1000);
    for (let i = 0; i <= goThroughAllIntervalIDs; i++) {
        window.clearInterval(i);
    }
}

/**
 * Pauses all ongoing, loopable character audio playback variables 
 * handled by the global AudioManager instance.
 * @returns {void}
 */
function pauseCharacterSounds() {
    if (typeof AudioManager === 'undefined') return;
    if (AudioManager.CHARACTER_WALKING) AudioManager.CHARACTER_WALKING.pause();
    if (AudioManager.CHARACTER_DAMAGE) AudioManager.CHARACTER_DAMAGE.pause();
    if (AudioManager.CHARACTER_SNORING) AudioManager.CHARACTER_SNORING.pause();
}

/**
 * Toggles the fullscreen status of a specified HTML target element based on 
 * whether a fullscreen element currently exists within the document space.
 * @param {HTMLElement|null} element - The target HTML element wrapper to toggle.
 * @returns {void}
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
 * Requests the browser to transition a specific HTML element into native fullscreen view, 
 * evaluating cross-browser vendors (WebKit, MS) fallback functions.
 * @param {HTMLElement|null} element - The HTML container requesting full layout focus.
 * @returns {void}
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
 * Command the active document to exit its fullscreen display state, utilizing standard 
 * and vendor-prefixed webkit alternatives.
 * @returns {void}
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

/**
 * Evaluates the current state of the global global AudioManager asset system and updates 
 * the DOM source image path reflecting either muted or active audio states.
 * @returns {void}
 */
function updateMuteButtonIcon() {
    let icon = document.getElementById('mute_icon');
    if (!icon || typeof AudioManager === 'undefined') return;
    if (AudioManager.isMuted) {
        icon.src = 'img/sound-off.png'; 
    } else {
        icon.src = 'img/volume-up.png';
    }
}

/**
 * Invokes the audio mute toggling procedure inside the AudioManager instance, triggers 
 * interface visual element updates, and un-focuses the target button.
 * @returns {void}
 */
function toggleMuteBtn() {
    if (typeof AudioManager !== 'undefined') {
        AudioManager.toggleMute();
        updateMuteButtonIcon(); 
    }
    if (muteBtnRef) {
        muteBtnRef.blur(); 
    }
}

/**
 * Sets a brief timeout delay to allow the application context to generate, 
 * map virtual keyboard property actions, and hook onto mobile application buttons.
 * @returns {void}
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
 * Binds specific `touchstart` and `touchend` event handlers to a DOM element, 
 * translating touch input parameters into updates for the simulated game keyboard state.
 * @param {Object} btn - Mapping details structure container.
 * @param {string} btn.id - The unique HTML string ID parameter identifier of the target button element.
 * @param {string} btn.key - The mapped internal state key string representation inside the keyboard system object.
 * @returns {void}
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