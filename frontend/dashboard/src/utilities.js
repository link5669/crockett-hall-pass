function getSecondsSince(pastTimestamp) {
    const currentTime = Date.now();
    const elapsedMilliseconds = currentTime - pastTimestamp;
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    return elapsedSeconds;
}

export { getSecondsSince }