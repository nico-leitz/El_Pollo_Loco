/**
 * Central state and control manager handles the global audio ecosystem.
 * Pre-instantiates game sounds and handles storage-based mute states.
 */
class AudioManager {
    /** @type {HTMLAudioElement} Triggered when the main character receives a strike. */
    static CHARACTER_DAMAGE = new Audio('sounds/character/characterDamage.mp3');

    /** @type {HTMLAudioElement} Plays when the character's health completely depletes. */
    static CHARACTER_DEAD = new Audio('sounds/character/characterDead.wav');

    /** @type {HTMLAudioElement} Executed on vertical character leaps. */
    static CHARACTER_JUMP = new Audio('sounds/character/characterJump.wav');

    /** @type {HTMLAudioElement} Continuous horizontal movement loop track. */
    static CHARACTER_WALKING = new Audio('sounds/character/characterRun.mp3');

    /** @type {HTMLAudioElement} Executed during the character's long idle sequence. */
    static CHARACTER_SNORING = new Audio('sounds/character/characterSnoring.mp3');

    /** @type {HTMLAudioElement} Elimination chime for standard small enemies. */
    static CHICKEN_DEAD = new Audio('sounds/chicken/chickenDead.mp3');

    /** @type {HTMLAudioElement} Alternate elimination sound for standard small enemies. */
    static CHICKEN_DEAD_2 = new Audio('sounds/chicken/chickenDead2.mp3');

    /** @type {HTMLAudioElement} Feedback track when gathering actionable salsa items. */
    static BOTTLE_COLLECT = new Audio('sounds/collectibles/bottleCollectSound.wav');
    
    /** @type {HTMLAudioElement} Feedback track when harvesting gold entities. */
    static COIN_COLLECT = new Audio('sounds/collectibles/collectSound.wav');

    /** @type {HTMLAudioElement} Dramatic sound cue triggered upon boss contact parameters. */
    static ENDBOSS_APPROACH = new Audio('sounds/endboss/endbossApproach.wav');

    /** @type {HTMLAudioElement} Menu introduction background melody asset. */
    static GAME_START = new Audio('sounds/game/gameStart.mp3');

    /** @type {HTMLAudioElement} Impact feedback sound for throwable ground objects. */
    static BOTTLE_BREAK = new Audio('sounds/throwable/bottleBreak.mp3');

    /**
     * Complete index list containing all configured audio asset pointers for global iteration.
     * @type {HTMLAudioElement[]} 
     */
    static allSounds = [
        AudioManager.CHARACTER_DAMAGE, AudioManager.CHARACTER_DEAD, 
        AudioManager.CHARACTER_JUMP, AudioManager.CHARACTER_WALKING, 
        AudioManager.CHARACTER_SNORING, AudioManager.CHICKEN_DEAD, 
        AudioManager.CHICKEN_DEAD_2, AudioManager.BOTTLE_COLLECT, 
        AudioManager.COIN_COLLECT, AudioManager.ENDBOSS_APPROACH, 
        AudioManager.GAME_START, AudioManager.BOTTLE_BREAK
    ];

    /**
     * Tracking flag indicating whether global output is currently suppressed.
     * @type {boolean} 
     */
    static isMuted = false;

    /**
     * Reads persistent user settings from the browser's LocalStorage structure,
     * configures initial state tracking, and pauses running sounds if muted.
     * @returns {void}
     */
    static init() {
        let savedMuteState = localStorage.getItem('gameMuted');
        if (savedMuteState !== null) {
            AudioManager.isMuted = (savedMuteState === 'true');

            if (AudioManager.isMuted) {
                AudioManager.allSounds.forEach(sound => sound.pause());
            }
        }
    }

    /**
     * Executes play demands for a specific audio element at an isolated volume tier,
     * provided the application instance is not globally muted.
     * @param {HTMLAudioElement|null} audio - The target HTML audio node intended for playing.
     * @param {number} volume - Normalized scaling value spanning from 0.0 to 1.0.
     * @returns {void}
     */
    static play(audio, volume) {
        if (AudioManager.isMuted || !audio) return; 
        audio.volume = volume;
        audio.play();
    }

    /**
     * Flips the current boolean audio restriction flag, pushes the state into 
     * local memory, and halts active sounds upon suppression activation.
     * @returns {boolean} The updated global boolean suppression state.
     */
    static toggleMute() {
        AudioManager.isMuted = !AudioManager.isMuted;
        
        localStorage.setItem('gameMuted', AudioManager.isMuted);

        if (AudioManager.isMuted) {
            AudioManager.allSounds.forEach(sound => sound.pause());
        }
        
        return AudioManager.isMuted; 
    }
}