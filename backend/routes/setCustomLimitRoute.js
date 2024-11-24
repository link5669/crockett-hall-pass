import express from "express";
import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';

export default function setCustomLimitRoute(firebaseApp) {
    const router = express.Router();
    const db = getFirestore(firebaseApp);

    router.post("/", async (req, res) => {
        try {
            const limitsRef = collection(db, "limits");
            const q = query(
                limitsRef,
                where('studentEmail', '==', req.query.studentEmail)
            );

            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];

                await updateDoc(userDoc.ref, {
                    studentEmail: req.query.studentEmail,
                    pd: req.query.pd,
                    day: req.query.day
                });
                res.status(200).json({
                    message: "Request processed"
                });
                return true;
            } else {
                await addDoc(collection(db, "limits"), {
                    studentEmail: req.query.studentEmail,
                    pd: req.query.pd,
                    day: req.query.day
                });
                res.status(200).json({
                    message: "Request processed"
                });
                return false;
            }
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    });
    return router;
}