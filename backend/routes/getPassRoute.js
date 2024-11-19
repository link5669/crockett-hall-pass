// routes/registerPassRoute.js
import express from "express";
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

export default function getPassRoute(firebaseApp) {
    const router = express.Router();
    const db = getFirestore(firebaseApp);

    router.get("/", async (req, res) => {
        try {
            const currentTime = Number(Date.now());
            const twoMinutesFromNow = Number(Date.now() + (2 * 60 * 1000));
            console.log("Current time:", currentTime);
            console.log("Two minutes from now:", twoMinutesFromNow);

            const q = query(
                collection(db, "passes"), 
                // where("timeOut", "<", currentTime),
              );
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