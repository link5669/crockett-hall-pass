import express from "express";
import { getFirestore, collection, getDocs, query, where, or } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

export default function searchConflicts(firebaseApp) {
    const router = express.Router();
    const db = getFirestore(firebaseApp);
    const SECONDS_IN_FIVE_MINUTES = 300
    const SECONDS_IN_TWO_MINUTES = 120
    router.get("/", async (req, res) => {
        try {
            let q1 = query(
                collection(db, "conflicts"),
                where("studentA", "==", req.query.studentName),
            );
            let querySnapshot = await getDocs(q1);
            let responses = []
            querySnapshot.forEach((doc) => {
                responses.push(doc.data())
            });
            q1 = query(
                collection(db, "conflictsOh "),
                where("studentB", "==", req.query.studentName),
            );
            querySnapshot = await getDocs(q1);
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