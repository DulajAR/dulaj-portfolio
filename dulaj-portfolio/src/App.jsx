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
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboardPage from "./admin/pages/AdminDashboardPage";
import AdminAboutPage from "./admin/pages/AdminAboutPage";
import AdminSkillsPage from "./admin/pages/AdminSkillsPage";
import AdminContactPage from "./admin/pages/AdminContactPage";
import AdminProjectsPage from "./admin/pages/AdminProjectsPage";
import AdminCertificatesPage from "./admin/pages/AdminCertificatesPage";
import AdminEducationPage from "./admin/pages/AdminEducationPage";
import AdminMessagesPage from "./admin/pages/AdminMessagesPage";

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

        {/* Admin Login */}
        <Route
          path="/admin/login"
          element={<div className="admin-theme"><AdminLoginPage onLogin={() => setIsAuthenticated(true)} /></div>}
        />

        {/* Admin Routes with Sidebar Layout */}
        <Route
          path="/admin"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <div className="admin-theme"><AdminLayout /></div>
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="about" element={<AdminAboutPage />} />
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="skills" element={<AdminSkillsPage />} />
          <Route path="contact" element={<AdminContactPage />} />
          <Route path="certificates" element={<AdminCertificatesPage />} />
          <Route path="education" element={<AdminEducationPage />} />
          <Route path="messages" element={<AdminMessagesPage />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
