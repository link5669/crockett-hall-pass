import express from "express";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

export default function registerPassRoute(firebaseApp) {
  const router = express.Router();
  const db = getFirestore(firebaseApp);

  router.post("/", async (req, res) => {

    try {
      await addDoc(collection(db, "passes"), {
        studentName: req.query.studentName,
        email: req.query.studentEmail,
        destination: req.query.destination,
        timeOut: Timestamp.now(),
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