import express from "express";
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { Timestamp } from "firebase/firestore";
export default function getPassByStudent(firebaseApp) {
    const router = express.Router();
    const db = getFirestore(firebaseApp);
    router.get("/student/:name", async (req, res) => {
        try {
            const q = query(
                collection(db, "passes"),
                where("email", "==", req.params.name)
            );
            const querySnapshot = await getDocs(q);
            let responses = []
            querySnapshot.forEach((doc) => {
                responses.push(doc.data())
            });
            res.status(200).json({ responses });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.get("/student-request/:name", async (req, res) => {
        try {
            const fiveMinutesAgo = Timestamp.now().toMillis() - (5 * 60 * 1000);

            const q = query(
                collection(db, "passes"),
                where("email", "==", req.params.name),
                where("timeOut", ">=", Timestamp.fromMillis(fiveMinutesAgo))
            );

            const querySnapshot = await getDocs(q);
            let responses = []
            querySnapshot.forEach((doc) => {
                console.log(doc.id)
                responses.push(doc.data())
            });
            res.status(200).json({ responses });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}