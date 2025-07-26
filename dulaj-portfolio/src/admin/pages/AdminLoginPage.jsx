import React from "react";
import { useNavigate } from "react-router-dom";
import AdminLogin from "../components/AdminLogin";

const AdminLoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/admin/dashboard"); // after login, go to Add Project page
  };

  return <AdminLogin onLogin={handleLogin} />;
};

export default AdminLoginPage;
