export default function playSoundNotification() {
    const snd = new Audio('/app/dist/assets/notify_sound.mp3');
    snd.oncanplaythrough = () => {
        const playedPromise = snd.play();
        if (playedPromise) {
            playedPromise.catch((e) => {
                console.log(e);
                if (e.name === 'NotAllowedError' || e.name === 'NotSupportedError') {
                    console.log(e.name);
                }
            });
        }
    };
}
