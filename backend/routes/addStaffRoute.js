import express from "express";
import { getFirestore, collection, addDoc } from 'firebase/firestore';

export default function addStaffRoute(firebaseApp) {
  const router = express.Router();
  const db = getFirestore(firebaseApp);

  router.post("/", async (req, res) => {
    try {
      await addDoc(collection(db, "staff"), {
        email: req.query.staffEmail
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