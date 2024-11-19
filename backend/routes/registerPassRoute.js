// routes/registerPassRoute.js
import express from "express";
import { getFirestore, collection, addDoc } from 'firebase/firestore';

export default function registerPassRoute(firebaseApp) {
  const router = express.Router();
  const db = getFirestore(firebaseApp);

  router.post("/", async (req, res) => {
    console.log("alsjdk")
    try {
      const docRef = await addDoc(collection(db, "passes"), {
        studentName: req.query.studentName,
        destination: req.query.destination,
        timeOut: req.query.timeOut,
        timeIn: req.query.timeIn
      });
      res.status(200).json({ id: docRef.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}