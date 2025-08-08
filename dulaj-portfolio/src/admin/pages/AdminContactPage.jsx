// src/pages/AdminContactPage.jsx
import React from "react";
import AdminContact from "../components/AdminContact";
import AdminMessage from "../components/AdminMessages"; // ✅ Import AdminMessage

const AdminContactPage = () => {
  return (
    <div>
      <AdminContact />
      <AdminMessage /> {/* ✅ Render the AdminMessage component */}
    </div>
  );
};

export default AdminContactPage;
