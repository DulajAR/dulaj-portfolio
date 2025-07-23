// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Skills from "./pages/Skills";
import Contact from "./pages/Contact";

// 🔐 Admin Pages
import AdminLoginPage from "./admin/pages/AdminLoginPage";


const App = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/skills" element={<Skills />} />
      <Route path="/contact" element={<Contact />} />

      {/* Admin Pages */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
    
    </Routes>
  );
};

export default App;
