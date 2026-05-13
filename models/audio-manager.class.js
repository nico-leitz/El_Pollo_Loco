/**
 * Central state and control manager for the global audio ecosystem.
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

    /** @type {HTMLAudioElement} Music for the start menu. */
    static MENU_THEME = new Audio('sounds/start_menu/start_menu_theme.mp3');

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
        AudioManager.GAME_START, AudioManager.BOTTLE_BREAK, 
        AudioManager.MENU_THEME
    ];

    /** @type {boolean} Tracking flag indicating whether global output is suppressed. */
    static isMuted = false;

    /**
     * Configures initial state and handles storage-based mute settings.
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
     * Plays a specific audio element.
     * @param {HTMLAudioElement|null} audio - The target audio node.
     * @param {number} volume - Volume level (0.0 to 1.0).
     * @param {boolean} [loop=false] - Whether the sound should loop.
     */
    static play(audio, volume, loop = false) {
        if (AudioManager.isMuted || !audio) return; 
        audio.volume = volume;
        audio.loop = loop;
        audio.play().catch(error => console.warn("Playback prevented:", error));
    }

    /**
     * Stops a specific audio element and resets its position.
     * @param {HTMLAudioElement|null} audio - The target audio node.
     */
    static stop(audio) {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }

    /**
     * Toggles mute state and resumes looping music if unmuted.
     */
    static toggleMute() {
        AudioManager.isMuted = !AudioManager.isMuted;
        localStorage.setItem('gameMuted', AudioManager.isMuted);

        if (AudioManager.isMuted) {
            AudioManager.allSounds.forEach(sound => sound.pause());
        } else {

            AudioManager.allSounds.forEach(sound => {
                if (sound.loop) {
                    sound.play().catch(e => console.warn("Resume blocked:", e));
                }
            });
        }
        return AudioManager.isMuted; 
    }
}