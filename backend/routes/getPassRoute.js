import express from "express";
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

export default function getPassRoute(firebaseApp) {
    const router = express.Router();
    const db = getFirestore(firebaseApp);
    const SECONDS_IN_FIVE_MINUTES = 300
    router.get("/", async (req, res) => {
        try {
            const currentTime = Timestamp.fromMillis(Date.now() + SECONDS_IN_FIVE_MINUTES);
            const q = query(
                collection(db, "passes"),
                where("timeIn", ">", currentTime),
            );
            const querySnapshot = await getDocs(q);
            let responses = []
            querySnapshot.forEach((doc) => {
                console.log(doc.data().timeOut, currentTime)
                responses.push(doc.data())
            });
            res.status(200).json({ id: querySnapshot.id, responses: responses });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}