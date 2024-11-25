import { Timestamp } from "firebase/firestore";

const IN_DEV = false

//IN UTC
const BELL_SCHEDULE = [
    [Timestamp.fromDate(new Date(0, 0, 0, 13, 25)), Timestamp.fromDate(new Date(0, 0, 0, 14, 15))],   // 8:25-9:15
    [Timestamp.fromDate(new Date(0, 0, 0, 14, 18)), Timestamp.fromDate(new Date(0, 0, 0, 14, 58))],   // 9:18-9:58
    [Timestamp.fromDate(new Date(0, 0, 0, 15, 1)), Timestamp.fromDate(new Date(0, 0, 0, 15, 41))],  // 10:01-10:41
    [Timestamp.fromDate(new Date(0, 0, 0, 15, 43)), Timestamp.fromDate(new Date(0, 0, 0, 16, 24))], // 10:43-11:24
    [Timestamp.fromDate(new Date(0, 0, 0, 16, 27)), Timestamp.fromDate(new Date(0, 0, 0, 17, 7))],  // 11:27-12:07
    [Timestamp.fromDate(new Date(0, 0, 0, 17, 10)), Timestamp.fromDate(new Date(0, 0, 0, 17, 50))], // 12:10-12:50
    [Timestamp.fromDate(new Date(0, 0, 0, 17, 53)), Timestamp.fromDate(new Date(0, 0, 0, 18, 33))], // 12:53-1:33
    [Timestamp.fromDate(new Date(0, 0, 0, 18, 36)), Timestamp.fromDate(new Date(0, 0, 0, 19, 16))], // 1:36-2:16
    [Timestamp.fromDate(new Date(0, 0, 0, 19, 19)), Timestamp.fromDate(new Date(0, 0, 0, 20, 0))]   // 2:19-3:00
];

function closestStartingBellTime(currentTime) {
    const currentTimeDate = currentTime.toDate()
    const today = Timestamp.now().toDate();

    let lastStartedPeriod = -1;
    const compareTimeDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        currentTimeDate.getHours(),
        currentTimeDate.getMinutes()
    );

    for (let i = 0; i < BELL_SCHEDULE.length; i++) {
        const compareDate = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            BELL_SCHEDULE[i][0].toDate().getHours(),
            BELL_SCHEDULE[i][0].toDate().getMinutes()
        );

        if (compareTimeDate.getTime() >= compareDate.getTime()) {
            lastStartedPeriod = i;
        } else {
            break;
        }
    }

    if (lastStartedPeriod === -1) return null;

    const resultDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        BELL_SCHEDULE[lastStartedPeriod][0].toDate().getHours(),
        BELL_SCHEDULE[lastStartedPeriod][0].toDate().getMinutes()
    );

    return Timestamp.fromDate(resultDate);
}

function closestStartingBell(currentTime) {
    const timestamp = currentTime.toDate();
    const compareTime = Timestamp.fromDate(new Date(0, 0, 0, timestamp.getHours(), timestamp.getMinutes()));

    let lastStartedPeriod = 0;
    for (let i = 0; i < BELL_SCHEDULE.length; i++) {
        if (compareTime.toMillis() <= BELL_SCHEDULE[i][0].toMillis()) {
            lastStartedPeriod = i;
            break;
        }
    }
    return lastStartedPeriod - 1;
}

export { BELL_SCHEDULE, closestStartingBell, IN_DEV, closestStartingBellTime }