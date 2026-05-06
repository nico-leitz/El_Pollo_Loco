class AudioError {
    


    static playSafe(sound, volume = 0.05) {
        let checkReady = setInterval(() => {
            if (sound.readyState == 4 && !AudioManager.isMuted) {[cite, 5]
                sound.volume = volume;
                sound.play();
                clearInterval(checkReady);
            }
        }, 200);
}
}