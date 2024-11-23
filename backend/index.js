import express from "express";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebaseConfig from "./firebase-config.js";
import registerPassRoute from "./routes/registerPassRoute.js"
import getPassRoute from "./routes/getPassRoute.js";
import filteredPassRoute from "./routes/filteredPassRoute.js";
import getPassByStudent from "./routes/getPassByStudent.js";
import registerConflictRoute from "./routes/registerConflictRoute.js";
import searchConflicts from "./routes/searchConflicts.js";
import setCustomLimitRoute from "./routes/setCustomLimitRoute.js";
import searchLimits from "./routes/getLimitsRoute.js";

const port = 5001;
const app = express();
const firebaseApp = initializeApp(firebaseConfig);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Hello world!" });
});

app.use("/api/registerPass", registerPassRoute(firebaseApp));
app.use("/api/getPasses", getPassRoute(firebaseApp));
app.use("/api/filterPasses", filteredPassRoute(firebaseApp));
app.use("/api/passes", getPassByStudent(firebaseApp));
app.use("/api/registerConflict", registerConflictRoute(firebaseApp));
app.use("/api/searchConflicts", searchConflicts(firebaseApp));
app.use("/api/setLimits", setCustomLimitRoute(firebaseApp));
app.use("/api/searchLimits", searchLimits(firebaseApp));


app.listen(port, () => console.log(`Server listening on port ${port}`));