import { Timestamp } from "firebase/firestore";

//IN UTC
const BELL_SCHEDULE = [
    [new Timestamp(48300,0 ), new Timestamp(51300,0)],   // 8:25-9:15
    [new Timestamp(51480,0),new Timestamp(53880,0)],   // 9:18-9:58
    [new Timestamp(54060,0), new Timestamp(56460,0)],  // 10:01-10:41
    [new Timestamp(56580,0), new Timestamp(59040,0)], // 10:43-11:24
    [new Timestamp(59220,0), new Timestamp(61620,0)],  // 11:27-12:07
    [new Timestamp(61800,0), new Timestamp(64200,0)], // 12:10-12:50
    [new Timestamp(64380,0), new Timestamp(66780,0)], // 12:53-1:33
    [new Timestamp(66960,0), new Timestamp(69360,0)], // 1:36-2:16
    [new Timestamp(69540,0), new Timestamp(72000,0)]   // 2:19-3:00
];

function getBackendURL() {
    if (process.env.REACT_APP_PRODUCTION == 'false') {
        return "http://localhost:5001"
    } else {
        return "https://crockett-hall-pass.vercel.app"
    }
}

function closestStartingBell(currentTime) {
    const timestamp = currentTime.toDate();

    const compareTime = new Date(0, 0, 0, timestamp.getHours(), timestamp.getMinutes());

    let lastStartedPeriod = 0;
    for (let i = 0; i < BELL_SCHEDULE.length; i++) {
        const compareDate = new Date(
            0, 0, 0,
            BELL_SCHEDULE[i][0].toDate().getHours(),
            BELL_SCHEDULE[i][0].toDate().getMinutes()
        );
        console.log(compareDate, compareTime)
        if (compareTime <= compareDate) {
            lastStartedPeriod = i;
            break;
        }
    }
    return lastStartedPeriod;
}

export { getBackendURL, closestStartingBell }