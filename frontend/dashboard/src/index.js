import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentView from './components/StudentView';
import Settings from './components/Settings';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="244652833936-hlf35oe5qdkqfsgkc7frlcrtbisl5cg9.apps.googleusercontent.com">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/lookup" element={<StudentView />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  </GoogleOAuthProvider>
);
