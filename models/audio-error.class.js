/**
 * Helper class handling robust audio playback configurations, 
 * designed to safely execute media streams under changing browser conditions.
 */
class AudioError {

    /**
     * Periodically monitors the native loading status of an HTMLAudioElement 
     * and triggers playback at the designated volume level as soon as the media asset 
     * becomes fully available and global audio settings permit.
     * @param {HTMLAudioElement} sound - The native browser audio element instance targeted for playback.
     * @param {number} [volume=0.05] - The target playback volume level, scaled between 0.0 (silent) and 1.0 (maximum).
     * @returns {void}
     */
    static playSafe(sound, volume = 0.05) {
        let checkReady = setInterval(() => {
            if (sound.readyState == 4 && !AudioManager.isMuted) {
                sound.volume = volume;
                sound.play();
                clearInterval(checkReady);
            }
        }, 200);
    }
}