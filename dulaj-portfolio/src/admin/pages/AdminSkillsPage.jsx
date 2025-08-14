// src/admin/pages/AdminSkillsPage.jsx
import React from "react";
import AdminSkills from "../components/AdminSkills";
import { useNavigate } from "react-router-dom";

const AdminSkillsPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem" }}>
      {/* Back Button with Gradient and Hover Effect */}
      <button
        onClick={() => navigate("/admin/dashboard")}
        style={{
          marginBottom: "1.5rem",
          padding: "0.6rem 1.2rem",
          background: "linear-gradient(45deg, #ff6a00, #ee0979, #00f260, #0575e6)",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "16px",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.2)")}
        onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
      >
        ⬅ Back to Dashboard
      </button>

      <AdminSkills />
    </div>
  );
};

export default AdminSkillsPage;
