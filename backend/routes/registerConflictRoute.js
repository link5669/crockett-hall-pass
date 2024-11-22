import express from "express";
import { getFirestore, collection, query, where, addDoc, getDocs, orderBy, limit } from 'firebase/firestore';

export default function registerConflictRoute(firebaseApp) {
    const router = express.Router();
    const db = getFirestore(firebaseApp);

    router.post("/", async (req, res) => {
        try {
            const docRef = await addDoc(collection(db, "conflicts"), {
                studentA: req.query.studentA,
                studentB: req.query.studentB,
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