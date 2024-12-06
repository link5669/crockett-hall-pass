import express from "express";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  getDocs,
} from "firebase/firestore";

export default function addStaffRoute(firebaseApp) {
  const router = express.Router();
  const db = getFirestore(firebaseApp);

  router.post("/", async (req, res) => {
    try {
      let q1 = query(collection(db, "staff"));
      let querySnapshot = await getDocs(q1);
      let found = false;
      for (let i = 0; i < querySnapshot.size; i++) {
        if (querySnapshot.docs[i].data().email == req.query.staffEmail) {
          found = true;
          break;
        }
      }
      if (!found)
        await addDoc(collection(db, "staff"), {
          email: req.query.staffEmail,
        });
      res.status(200).json({
        message: "Request processed",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  return router;
}
