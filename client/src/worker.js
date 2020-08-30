


export default function checkProgress() {
    var count = 0;
    var progress = {};

    const addProgress = () => {
        count = count + 10; 
        if (count === 100) {
            clearInterval(progress); 
            postMessage(count);
            count = 0;
        }
        else
            postMessage(count);
    }

    self.addEventListener("message", event => { /* eslint-disable-line no-restricted-globals */
        progress = setInterval(addProgress, 5000); 
    });
}