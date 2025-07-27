// src/components/AdminDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase"; // adjust if your path is different

const AdminDashboard = () => {
  const navigate = useNavigate();

  const navItems = [
    { label: "About", path: "/admin/about" },
    { label: "Projects", path: "/admin/projects" },
    { label: "Skills", path: "/admin/skills" },
    { label: "Contact", path: "/admin/contact" },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="nav-grid">
        {navItems.map((item) => (
          <div
            key={item.label}
            className="nav-card"
            onClick={() => navigate(item.path)}
          >
            <h3>{item.label}</h3>
          </div>
        ))}
      </div>

      <style>{`
        .dashboard-container {
          padding: 2rem;
          min-height: 100vh;
          background: linear-gradient(to right, #eef2f3, #8e9eab);
          font-family: 'Segoe UI', sans-serif;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          margin: 0;
          color: #333;
        }

        .logout-button {
          background-color: #ef4444;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.95rem;
          transition: background-color 0.3s ease;
        }

        .logout-button:hover {
          background-color: #dc2626;
        }

        .nav-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1.5rem;
          padding: 0 1rem;
        }

        .nav-card {
          background: #fff;
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .nav-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
        }

        .nav-card h3 {
          margin: 0;
          font-size: 1.2rem;
          color: #4f46e5;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
