import express from "express";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export default function getRequestsRoute(firebaseApp) {
  const router = express.Router();
  const db = getFirestore(firebaseApp);
  router.get("/", async (req, res) => {
    try {
      const q = query(
        collection(db, "requests"),
        where("staffEmail", "==", req.query.email),
      );
      const querySnapshot = await getDocs(q);
      let responses = [];
      querySnapshot.forEach((doc) => {
        responses.push({ id: doc.id, ...doc.data() });
      });
      res.status(200).json({ id: querySnapshot.id, responses: responses });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
