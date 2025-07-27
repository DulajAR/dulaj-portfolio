// src/admin/pages/AdminSkillsPage.jsx
import React from "react";
import AdminSkills from "../components/AdminSkills";
import { useNavigate } from "react-router-dom";

const AdminSkillsPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem" }}>
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/dashboard")}
        style={{
          marginBottom: "1.5rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#6c757d",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        ⬅ Back to Dashboard
      </button>

      <AdminSkills />
    </div>
  );
};

export default AdminSkillsPage;
