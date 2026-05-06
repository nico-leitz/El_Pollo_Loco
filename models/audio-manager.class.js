class AudioManager {
    static CHARACTER_DAMAGE = new Audio('sounds/character/characterDamage.mp3');
    static CHARACTER_DEAD = new Audio('sounds/character/characterDead.wav');
    static CHARACTER_JUMP = new Audio('sounds/character/characterJump.wav');
    static CHARACTER_WALKING = new Audio('sounds/character/characterRun.mp3');
    static CHARACTER_SNORING = new Audio('sounds/character/characterSnoring.mp3');

    static CHICKEN_DEAD = new Audio('sounds/chicken/chickenDead.mp3');
    static CHICKEN_DEAD_2 = new Audio('sounds/chicken/chickenDead2.mp3');

    static BOTTLE_COLLECT = new Audio('sounds/collectibles/bottleCollectSound.wav');
    static COIN_COLLECT = new Audio('sounds/collectibles/collectSound.wav');

    static ENDBOSS_APPROACH = new Audio('sounds/endboss/endbossApproach.wav');

    static GAME_START = new Audio('sounds/game/gameStart.mp3');

    static BOTTLE_BREAK = new Audio('sounds/throwable/bottleBreak.mp3');

   static allSounds = [
        AudioManager.CHARACTER_DAMAGE, AudioManager.CHARACTER_DEAD, 
        AudioManager.CHARACTER_JUMP, AudioManager.CHARACTER_WALKING, 
        AudioManager.CHARACTER_SNORING, AudioManager.CHICKEN_DEAD, 
        AudioManager.CHICKEN_DEAD_2, AudioManager.BOTTLE_COLLECT, 
        AudioManager.COIN_COLLECT, AudioManager.ENDBOSS_APPROACH, 
        AudioManager.GAME_START, AudioManager.BOTTLE_BREAK
    ];

    static isMuted = false;

    static play(audio, volume) {
        if (AudioManager.isMuted || !audio) return; 
        audio.volume = volume;
        audio.play();
    }

    static toggleMute() {
        AudioManager.isMuted = !AudioManager.isMuted;
        if (AudioManager.isMuted) {
            AudioManager.allSounds.forEach(sound => sound.pause());
        }
    }

}