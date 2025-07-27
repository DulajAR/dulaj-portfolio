// src/App.jsx
import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// 🌐 Public Pages
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import ProjectsPage from "./pages/ProjectsPage";
import SkillsPage from "./pages/SkillsPage";
import ContactPage from "./pages/ContactPage";

// 🔐 Admin Pages
import AdminLoginPage from "./admin/pages/AdminLoginPage";
import AdminDashboardPage from "./admin/pages/AdminDashboardPage";
import AdminAboutPage from "./admin/pages/AdminAboutPage";
import AdminSkillsPage from "./admin/pages/AdminSkillsPage";
import AdminContactPage from "./admin/pages/AdminContactPage"; // ✅ imported

const PrivateRoute = ({ isAuthenticated, children }) => {
  const location = useLocation();
  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/admin/login" state={{ from: location }} replace />
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Routes>
      {/* 🌐 Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/skills" element={<SkillsPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* 🔐 Admin Pages */}
      <Route
        path="/admin/login"
        element={<AdminLoginPage onLogin={() => setIsAuthenticated(true)} />}
      />
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <AdminDashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/about"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <AdminAboutPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/skills"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <AdminSkillsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/contact" // ✅ newly added route
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <AdminContactPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App;
