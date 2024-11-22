const inDev = true

function getSecondsSince(pastTimestamp) {
    const currentTime = Date.now();
    const elapsedMilliseconds = currentTime - pastTimestamp;
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    return elapsedSeconds;
}

function getBackendURL() {
    if (inDev) {
        return "localhost:5001"
    }
}

export { getSecondsSince, getBackendURL }