const IN_DEV = false

const BELL_SCHEDULE = [
    [new Date(0, 0, 0, 8, 25), new Date(0, 0, 0, 9, 15)],   // 8:25-9:15
    [new Date(0, 0, 0, 9, 18), new Date(0, 0, 0, 9, 58)],   // 9:18-9:58
    [new Date(0, 0, 0, 10, 1), new Date(0, 0, 0, 10, 41)],  // 10:01-10:41
    [new Date(0, 0, 0, 10, 43), new Date(0, 0, 0, 11, 24)], // 10:43-11:24
    [new Date(0, 0, 0, 11, 27), new Date(0, 0, 0, 12, 7)],  // 11:27-12:07
    [new Date(0, 0, 0, 12, 10), new Date(0, 0, 0, 12, 50)], // 12:10-12:50
    [new Date(0, 0, 0, 12, 53), new Date(0, 0, 0, 13, 33)], // 12:53-1:33
    [new Date(0, 0, 0, 13, 36), new Date(0, 0, 0, 14, 16)], // 1:36-2:16
    [new Date(0, 0, 0, 14, 19), new Date(0, 0, 0, 15, 0)]   // 2:19-3:00
];

function closestStartingBellTime(currentTime) {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const today = new Date();  // Get today's date

    const compareTime = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        hours,
        minutes
    );

    let lastStartedPeriod = -1;

    for (let i = 0; i < BELL_SCHEDULE.length; i++) {
        const bellTime = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            BELL_SCHEDULE[i][0].getHours(),
            BELL_SCHEDULE[i][0].getMinutes()
        );

        if (compareTime >= bellTime) {
            lastStartedPeriod = i;
        } else {
            break;
        }
    }

    if (lastStartedPeriod === -1) {
        return null;
    }

    return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        BELL_SCHEDULE[lastStartedPeriod][0].getHours(),
        BELL_SCHEDULE[lastStartedPeriod][0].getMinutes()
    );
}

function closestStartingBell(currentTime) {
    const compareTime = new Date(0, 0, 0, currentTime.getHours(), currentTime.getMinutes());

    let lastStartedPeriod = 0;

    for (let i = 0; i < BELL_SCHEDULE.length; i++) {
        if (compareTime <= BELL_SCHEDULE[i][0]) {
            lastStartedPeriod = i;
            break
        }
    }

    return lastStartedPeriod - 1;
}

export { BELL_SCHEDULE, closestStartingBell, IN_DEV, closestStartingBellTime }