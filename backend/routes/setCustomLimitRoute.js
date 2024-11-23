import express from "express";
import { getFirestore, collection, addDoc } from 'firebase/firestore';

export default function setCustomLimitRoute(firebaseApp) {
    const router = express.Router();
    const db = getFirestore(firebaseApp);

    router.post("/", async (req, res) => {
        try {
            await addDoc(collection(db, "limits"), {
                studentName: req.query.studentName,
                [req.query.field]: req.query.value,
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