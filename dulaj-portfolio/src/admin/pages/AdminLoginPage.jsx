import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminLogin from "../components/AdminLogin";

const AdminLoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Where to redirect after login (default: /admin/dashboard)
  const from = location.state?.from?.pathname || "/admin/dashboard";

  const handleLogin = () => {
    onLogin();        // ✅ Set isAuthenticated in App.jsx
    navigate(from);   // ✅ Redirect to the page user attempted to access
  };

  return <AdminLogin onLogin={handleLogin} />;
};

export default AdminLoginPage;
