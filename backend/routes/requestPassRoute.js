import express from "express";
import { getFirestore, collection, query, where, addDoc, getDocs, orderBy } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { IN_DEV, closestStartingBellTime } from "../utilities.js";
const PASS_PER_PERIOD = 1
const PASS_PER_DAY = 2

export default function requestPassRoute(firebaseApp) {
    const router = express.Router();
    const db = getFirestore(firebaseApp);

    router.post("/", async (req, res) => {
        console.log("akjsd")
        if (!IN_DEV)
            if (await checkConflicts(db, req, res) == false || await checkPeriodLimit(db, req, res) == false || await checkDailyLimit(db, req, res) == false) return

        try {
            const docRef = await addDoc(collection(db, "requests"), {
                studentName: req.query.studentName,
                email: req.query.studentEmail,
                destination: req.query.destination,
                timeOut: Timestamp.now(),
                staffEmail: req.query.staffEmail
            });
            res.status(200).json({
                message: "Request processed"
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}


async function checkDailyLimit(db, req, res) {
    let ret = true
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eightAM = Timestamp.fromDate(today);

    const q = query(
        collection(db, "passes"),
        where("studentEmail", "==", req.query.studentEmail),
        where("timeOut", ">", eightAM)
    );

    const querySnapshot = await getDocs(q);
    const count = querySnapshot.size;

    let q1 = query(
        collection(db, "limits"),
        where("studentEmail", "==", req.query.studentEmail),
    );

    let limitsSnapshot = await getDocs(q1);
    let dayLimit = PASS_PER_DAY

    limitsSnapshot.forEach((doc) => {
        dayLimit = doc.data().day
    })

    if (count >= dayLimit) {
        res.status(200).json({ message: "You've requested too many passes today" })
        ret = false
    }
    return ret
}

async function checkPeriodLimit(db, req, res) {
    let ret = true

    let closestBellTime = closestStartingBellTime(Timestamp.now())

    const q = query(
        collection(db, "passes"),
        where("email", "==", req.query.studentEmail),
        where("timeOut", ">", closestBellTime),
        orderBy("timeOut", "desc")
    )
    console.log("bell:", closestBellTime)
    const querySnapshot = await getDocs(q);

    let passesThisPd = querySnapshot.size

    let q1 = query(
        collection(db, "limits"),
        where("studentEmail", "==", req.query.studentEmail),
    );

    let limitsSnapshot = await getDocs(q1);
    let pdLimit = PASS_PER_PERIOD

    limitsSnapshot.forEach((doc) => {
        pdLimit = doc.data().pd
    })

    console.log("limit:", pdLimit, "count:", passesThisPd)

    if (passesThisPd >= pdLimit) {
        res.status(200).json({ message: "You've requested too many passes this period" })
        ret = false
    }

    return ret
}

async function checkConflicts(db, req, res) {
    let q1 = query(
        collection(db, "conflicts"),
        where("studentA", "==", req.query.studentEmail),
    );
    let querySnapshot = await getDocs(q1);
    let responses = []
    querySnapshot.forEach((doc) => {
        responses.push(doc.data().studentB)
    });
    q1 = query(
        collection(db, "conflicts"),
        where("studentB", "==", req.query.studentEmail),
    );
    querySnapshot = await getDocs(q1);
    querySnapshot.forEach((doc) => {
        responses.push(doc.data().studentA)
    });
    if (responses.length == 0) {
        return true
    }
    let currDate = new Date()
    currDate.setMinutes(currDate.getMinutes() - 7)
    const sevenMinutesAgo = Timestamp.fromDate(currDate)
    let q = query(
        collection(db, "passes"),
        where("timeOut", ">", sevenMinutesAgo),
        where("email", "in", responses)
    )
    //"in" has a limit of 10!!
    querySnapshot = await getDocs(q);
    if (querySnapshot.size > 0) {
        res.status(200).json({ message: "Please wait ten minutes and try again" })
        return false
    }

    return true
}