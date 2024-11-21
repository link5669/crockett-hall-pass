import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import StudentView from './components/StudentView';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/lookup" element={<StudentView />} />
    </Routes>
  </BrowserRouter>
);
