import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";

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
        {/* Colorful Dashboard Button with hover effect */}
        <motion.button
          onClick={() => navigate("/admin/dashboard")}
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95, rotate: -2 }}
          style={{
            marginBottom: "1.5rem",
            padding: "12px 25px",
            background: "linear-gradient(90deg, #ff6b6b, #fcb045, #48bb78, #4f46e5)",
            backgroundSize: "400% 400%",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "1.1rem",
            fontWeight: "bold",
            textShadow: "1px 1px 4px rgba(0,0,0,0.3)",
            animation: "gradientBG 8s ease infinite",
          }}
        >
          Back to Dashboard
        </motion.button>

        {/* Colorful Edit About Section title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            fontSize: "2rem",
            marginBottom: "2rem",
            textAlign: "center",
            fontWeight: "bold",
            background: "linear-gradient(90deg, #ff6b6b, #fcb045, #48bb78, #4f46e5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          Edit About Section
        </motion.h2>

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

      {/* Gradient animation */}
      <style>{`
        @keyframes gradientBG {
          0% {background-position:0% 50%}
          50% {background-position:100% 50%}
          100% {background-position:0% 50%}
        }
      `}</style>
    </section>
  );
};

export default AdminAbout;
