import express from "express";
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

export default function getPassRoute(firebaseApp) {
    const router = express.Router();
    const db = getFirestore(firebaseApp);
    const SECONDS_IN_FIVE_MINUTES = 300
    const SECONDS_IN_TWO_MINUTES = 120
    router.get("/", async (req, res) => {
        try {
            const sevenMinutesAgo = Timestamp.fromMillis(parseInt(req.query.now) - (SECONDS_IN_FIVE_MINUTES * 1000) - (SECONDS_IN_TWO_MINUTES * 1000));
            const q = query(
                collection(db, "passes"),
                where("timeOut", ">", sevenMinutesAgo),
            )
            const querySnapshot = await getDocs(q);
            let responses = []
            querySnapshot.forEach((doc) => {
                responses.push(doc.data())
            });
            res.status(200).json({ id: querySnapshot.id, responses: responses });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}