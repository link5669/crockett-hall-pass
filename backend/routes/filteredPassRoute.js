import express from "express";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

export default function filteredPassRoute(firebaseApp) {
  const router = express.Router();
  const db = getFirestore(firebaseApp);
  router.get("/", async (req, res) => {
    try {
      let currDate = new Date();
      currDate.setMinutes(currDate.getMinutes() - 7);
      const sevenMinutesAgo = Timestamp.fromDate(currDate);
      const q = query(
        collection(db, "passes"),
        where("timeOut", ">", sevenMinutesAgo),
        where("destination", "==", req.query.destination),
      );
      const querySnapshot = await getDocs(q);
      let responses = [];
      querySnapshot.forEach((doc) => {
        responses.push(doc.data());
      });
      res.status(200).json({ id: querySnapshot.id, responses: responses });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
