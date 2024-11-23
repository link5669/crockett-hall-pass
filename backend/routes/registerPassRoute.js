import express from "express";
import { getFirestore, collection, query, where, addDoc, getDocs, orderBy, limit } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { closestStartingBell, IN_DEV } from "../utilities.js";
const SECONDS_IN_FIVE_MINUTES = 300
const SECONDS_IN_TWO_MINUTES = 120
const PASS_PER_PERIOD = 1
const PASS_PER_DAY = 2
// const PASS_PER_WEEK = 10

export default function registerPassRoute(firebaseApp) {
  const router = express.Router();
  const db = getFirestore(firebaseApp);

  router.post("/", async (req, res) => {

    if (!IN_DEV) {
      if ((await checkConflicts(db, req, res) == false || await checkPeriodLimit(db, req, res) == false || await checkDailyLimit(db, req, res) == false)) {
        return
      }
    }

    try {
      await addDoc(collection(db, "passes"), {
        studentName: req.query.studentName,
        destination: req.query.destination,
        timeOut: Timestamp.now(),
        timeIn: new Timestamp(Timestamp.now().seconds + SECONDS_IN_FIVE_MINUTES)
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
  today.setHours(8, 0, 0, 0);
  const eightAM = Timestamp.fromDate(today);

  const q = query(
    collection(db, "passes"),
    where("studentName", "==", req.query.studentName),
    where("timeIn", ">", eightAM)
  );

  const querySnapshot = await getDocs(q);
  const count = querySnapshot.size;
  if (count >= PASS_PER_DAY) {
    res.status(200).json({ message: "You've requested too many passes today" })
    ret = false
  }
  return ret
}

async function checkPeriodLimit(db, req, res) {
  let ret = true
  const today = new Date();
  today.setHours(8, 0, 0, 0);
  const eightAM = Timestamp.fromDate(today);

  const q = query(
    collection(db, "passes"),
    where("studentName", "==", req.query.studentName),
    where("timeIn", ">", eightAM),
    orderBy("timeOut", "desc"),
    limit(1)
  )

  const querySnapshot = await getDocs(q);
  let passDate = ""
  querySnapshot.forEach(doc => {
    passDate = doc.data().timeIn.toDate()
  });

  if (passDate == "") {
    return true
  }

  if (closestStartingBell(passDate) == closestStartingBell(new Date(Date.now()))) {
    res.status(200).json({ message: "You've requested too many passes this period" })
    ret = false
  }

  return ret
}

async function checkConflicts(db, req, res) {
  let q1 = query(
    collection(db, "conflicts"),
    where("studentA", "==", req.query.studentName),
  );
  let querySnapshot = await getDocs(q1);
  let responses = []
  querySnapshot.forEach((doc) => {
    responses.push(doc.data().studentB)
  });
  q1 = query(
    collection(db, "conflicts"),
    where("studentB", "==", req.query.studentName),
  );
  querySnapshot = await getDocs(q1);
  querySnapshot.forEach((doc) => {
    responses.push(doc.data().studentA)
  });
  const sevenMinutesAgo = Timestamp.fromMillis(Date.now() - (SECONDS_IN_FIVE_MINUTES * 1000) - (SECONDS_IN_TWO_MINUTES * 1000));
  let q = query(
    collection(db, "passes"),
    where("timeOut", ">", sevenMinutesAgo),
  )
  querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    responses.forEach(response => {
      if (response == doc.data().studentName || response == doc.data().studentName) {
        res.status(200).json({ message: "Please wait ten minutes and try again" })
        return false
      }
    })
  });

  return true
}



// CHECK PASSES PER WEEK?
//   const docRef = await addDoc(collection(db, "passes"), {
//     studentName: req.query.studentName,
//     destination: req.query.destination,
//     timeOut: Timestamp.now(),
//     timeIn: new Timestamp(Timestamp.now().seconds + SECONDS_IN_FIVE_MINUTES)
//   });
//   res.status(200).json({ id: docRef.id });
// } catch (error) {
//   res.status(500).json({ error: error.message });
// }
// const monday = new Date();
// monday.setDate(monday.getDate() - monday.getDay() + 1);
// monday.setHours(8, 0, 0, 0);
// const mondayEightAM = Timestamp.fromDate(monday);

// q = query(
//   collection(db, "passes"),
//   where("studentName", "==", req.params.name),
//   where("timeIn", ">", mondayEightAM)
// );

// querySnapshot = await getDocs(q);
// count = querySnapshot.size;
// if (count >= PASS_PER_WEEK) {
//   res.status(200).json({ message: "You've requested too many passes this week" })
// }