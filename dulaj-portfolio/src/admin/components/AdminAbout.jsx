// src/admin/components/AdminAbout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AdminAbout = () => {
  const navigate = useNavigate();

  const [aboutContent, setAboutContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const docRef = doc(db, "about", "profile");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAboutContent(docSnap.data());
        } else {
          setAboutContent({
            intro: "",
            passion: "",
            education: "",
            hobbies: "",
          });
        }
      } catch (error) {
        console.error("Error fetching about content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  const handleChange = (e) => {
    setAboutContent({ ...aboutContent, [e.target.name]: e.target.value });
  };

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return alert("Category name cannot be empty");
    if (aboutContent.hasOwnProperty(trimmed)) {
      return alert("Category already exists");
    }
    setAboutContent({ ...aboutContent, [trimmed]: "" });
    setNewCategory("");
  };

  const handleRemoveCategory = (key) => {
    if (window.confirm(`Are you sure you want to delete category "${key}"?`)) {
      const updatedContent = { ...aboutContent };
      delete updatedContent[key];
      setAboutContent(updatedContent);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "about", "profile"), aboutContent);
      alert("About content successfully saved to Firestore!");
    } catch (error) {
      console.error("Error saving about content:", error);
      alert("Failed to save content. Please try again.");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <section
      style={{
        minHeight: "100vh",
        padding: "3rem 1rem",
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        justifyContent: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: "2.5rem",
          borderRadius: "14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        }}
      >
        {/* Dashboard Button */}
        <button
          onClick={() => navigate("/admin/dashboard")}
          style={{
            marginBottom: "1.5rem",
            padding: "10px 20px",
            backgroundColor: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            alignSelf: "flex-start",
          }}
        >
          Dashboard
        </button>

        <h2
          style={{
            fontSize: "1.8rem",
            marginBottom: "1.5rem",
            color: "#333",
            textAlign: "center",
          }}
        >
          Edit About Section
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          {/* Existing Categories */}
          {Object.keys(aboutContent).map((key) => (
            <div
              key={key}
              style={{ marginBottom: "1rem", position: "relative" }}
            >
              <label
                style={{
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                  display: "block",
                  color: "#444",
                }}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <textarea
                name={key}
                value={aboutContent[key]}
                onChange={handleChange}
                rows="4"
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "1rem",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  resize: "vertical",
                }}
              />
              <button
                type="button"
                onClick={() => handleRemoveCategory(key)}
                title={`Delete ${key}`}
                style={{
                  position: "absolute",
                  right: 0,
                  top: "30px",
                  backgroundColor: "#e53e3e",
                  border: "none",
                  borderRadius: "6px",
                  color: "white",
                  padding: "5px 10px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Delete
              </button>
            </div>
          ))}

          {/* Add New Category */}
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              style={{
                flex: 1,
                padding: "10px",
                fontSize: "1rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <button
              type="button"
              onClick={handleAddCategory}
              style={{
                padding: "10px 20px",
                backgroundColor: "#48bb78",
                color: "white",
                fontSize: "1rem",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Add Category
            </button>
          </div>

          <button
            type="submit"
            style={{
              marginTop: "1.5rem",
              padding: "12px",
              backgroundColor: "#4f46e5",
              color: "#fff",
              fontSize: "1rem",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Save All
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminAbout;
