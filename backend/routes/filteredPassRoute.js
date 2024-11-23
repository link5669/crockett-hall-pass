import express from "express";
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

export default function filteredPassRoute(firebaseApp) {
    const router = express.Router();
    const db = getFirestore(firebaseApp);
    const SECONDS_IN_FIVE_MINUTES = 300
    const SECONDS_IN_TWO_MINUTES = 120
    router.get("/", async (req, res) => {
        try {
            const currentTime = Timestamp.fromMillis(Date.now() - SECONDS_IN_FIVE_MINUTES - SECONDS_IN_TWO_MINUTES);
            const q = query(
                collection(db, "passes"),
                where("timeOut", ">", currentTime),
                where("destination", "==", req.query.destination)
            );
            const querySnapshot = await getDocs(q);
            let responses = []
            querySnapshot.forEach((doc) => {
                console.log(doc.data().timeOut, currentTime)
                responses.push(doc.data())
            });

            q = query(
                collection(db, "passes"),
                where("studentName", "==", req.params.studentName)
            );
            querySnapshot = await getDocs(q);
            activePassResponses = []
            querySnapshot.forEach((doc) => {
                activePassResponses.push(doc.data())
            });
            res.status(200).json({ id: querySnapshot.id, responses: responses });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}