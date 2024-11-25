import "dotenv/config.js";

function getSecondsSince(pastTimestamp) {
    const currentTime = Date.now();
    const elapsedMilliseconds = currentTime - pastTimestamp;
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    return elapsedSeconds;
}

function getBackendURL() {
    if (process.env.PRODUCTION == 'false') {
        return "http://localhost:5001"
    } else {
        return "https://crockett-hall-pass.vercel.app"
    }
}

export { getSecondsSince, getBackendURL }