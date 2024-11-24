import express from "express";
import { getFirestore, collection, getDocs, query, where, or } from 'firebase/firestore';

export default function searchConflicts(firebaseApp) {
    const router = express.Router();
    const db = getFirestore(firebaseApp);
    router.get("/", async (req, res) => {
        try {
            let q1 = query(
                collection(db, "conflicts"),
                where("studentA", "==", req.query.studentEmail),
            );
            let querySnapshot = await getDocs(q1);
            let responses = []
            querySnapshot.forEach((doc) => {
                responses.push(doc.data())
            });
            q1 = query(
                collection(db, "conflictsOh "),
                where("studentB", "==", req.query.studentEmail),
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