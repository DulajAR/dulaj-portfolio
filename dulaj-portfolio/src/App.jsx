import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import ProjectsPage from "./pages/ProjectsPage";
import SkillsPage from "./pages/SkillsPage";
import ContactPage from "./pages/ContactPage";
import CertificatesPage from "./pages/CertificatesPage";
import EducationPage from "./pages/EducationPage";

import AdminLoginPage from "./admin/pages/AdminLoginPage";
import AdminDashboardPage from "./admin/pages/AdminDashboardPage";
import AdminAboutPage from "./admin/pages/AdminAboutPage";
import AdminSkillsPage from "./admin/pages/AdminSkillsPage";
import AdminContactPage from "./admin/pages/AdminContactPage";
import AdminProjectsPage from "./admin/pages/AdminProjectsPage";
import AdminCertificatesPage from "./admin/pages/AdminCertificatesPage";
import AdminEducationPage from "./admin/pages/AdminEducationPage";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

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
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/education" element={<EducationPage />} />

        {/* Admin Pages */}
        <Route
          path="/admin/login"
          element={<div className="admin-theme"><AdminLoginPage onLogin={() => setIsAuthenticated(true)} /></div>}
        />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <div className="admin-theme"><AdminDashboardPage /></div>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/about"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <div className="admin-theme"><AdminAboutPage /></div>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <div className="admin-theme"><AdminProjectsPage /></div>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/skills"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <div className="admin-theme"><AdminSkillsPage /></div>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/contact"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <div className="admin-theme"><AdminContactPage /></div>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/certificates"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <div className="admin-theme"><AdminCertificatesPage /></div>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/education"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <div className="admin-theme"><AdminEducationPage /></div>
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
