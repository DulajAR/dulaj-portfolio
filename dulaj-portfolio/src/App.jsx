// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// 🌐 Public Pages
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import ProjectsPage from "./pages/ProjectsPage";
import SkillsPage from "./pages/SkillsPage";
import ContactPage from "./pages/ContactPage";

// 🔐 Admin Pages
import AdminLoginPage from "./admin/pages/AdminLoginPage";
import AdminDashboardPage from "./admin/pages/AdminDashboardPage"; // ✅ fixed
import AdminAboutPage from "./admin/pages/AdminAboutPage";
import AdminSkillsPage from "./admin/pages/AdminSkillsPage";


const App = () => {
  return (
    <Routes>
      {/* 🌐 Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/skills" element={<SkillsPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* 🔐 Admin Pages */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/about" element={<AdminAboutPage />} />
      <Route path="/admin/skills" element={<AdminSkillsPage />} />
  
    </Routes>
  );
};

export default App;
