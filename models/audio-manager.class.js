class AudioManager {
    static WALKING = new Audio('sounds/character/characterRun.mp3');
    static JUMPING = new Audio('sounds/character/characterJump.wav');
    static DAMAGE = new Audio('sounds/character/characterDamage.mp3');
    static SNORING = new Audio('sounds/character/characterSnoring.mp3');
    static DEAD = new Audio('sounds/character/characterDead.wav');
    static CHICKEN_DEAD = new Audio('./assets/sounds/chicken_dead.mp3');

    static allSounds = [
        AudioManager.WALKING, AudioManager.JUMPING, AudioManager.DAMAGE, 
        AudioManager.SNORING, AudioManager.DEAD, AudioManager.CHICKEN_DEAD
    ];

    static isMuted = false;

    static play(sound, volume = 0.02) {
        if (!AudioManager.isMuted) {
            sound.volume = volume;
            sound.play();
        }
    }

    static toggleMute() {
        AudioManager.isMuted = !AudioManager.isMuted;
        if (AudioManager.isMuted) {
            AudioManager.allSounds.forEach(s => s.pause());
        }
    }

}