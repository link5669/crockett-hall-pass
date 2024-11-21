const BELL_SCHEDULE = [
    [new Date(0, 0, 0, 8, 25), new Date(0, 0, 0, 9, 15)],
    [new Date(0, 0, 0, 9, 18), new Date(0, 0, 0, 9, 58)],
    [new Date(0, 0, 0, 10, 1), new Date(0, 0, 0, 10, 41)],
    [new Date(0, 0, 0, 10, 43), new Date(0, 0, 0, 11, 24)],
    [new Date(0, 0, 0, 11, 27), new Date(0, 0, 0, 12, 7)],
    [new Date(0, 0, 0, 12, 10), new Date(0, 0, 0, 12, 50)],
    [new Date(0, 0, 0, 12, 53), new Date(0, 0, 0, 1, 33)],
    [new Date(0, 0, 0, 1, 36), new Date(0, 0, 0, 2, 16)],
    [new Date(0, 0, 0, 2, 19), new Date(0, 0, 0, 3, 0)]
]

function closestStartingBell(currentTime) {
    const compareTime = new Date(0, 0, 0, currentTime.getHours(), currentTime.getMinutes());

    let lastStartedPeriod = 0;

    for (let i = 0; i < BELL_SCHEDULE.length; i++) {
        console.log(compareTime, BELL_SCHEDULE[i][0])
        if (compareTime <= BELL_SCHEDULE[i][0]) {
            lastStartedPeriod = i;
            break
        }
    }

    return lastStartedPeriod - 1; 
}

export { BELL_SCHEDULE, closestStartingBell }