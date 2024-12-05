import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentView from "./components/StudentView";
import Settings from "./components/Settings";
import { GoogleOAuthProvider } from "@react-oauth/google";
import CurrentPasses from "./components/CurrentPasses";
import Footer from "./components/Footer";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider
    className="app"
    clientId="244652833936-hlf35oe5qdkqfsgkc7frlcrtbisl5cg9.apps.googleusercontent.com"
  >
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/passes" element={<CurrentPasses />} />
        <Route path="/lookup" element={<StudentView />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
    {/* <Footer /> */}
  </GoogleOAuthProvider>,
);
