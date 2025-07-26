// src/admin/components/AdminAbout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AdminAbout = () => {
  const navigate = useNavigate(); // Initialize navigate

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
          // Set default categories if no data found
          setAboutContent({
            intro: "",
            passion: "",
            education: "",
            hobbies: ""
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

  // Handle change for existing categories
  const handleChange = (e) => {
    setAboutContent({ ...aboutContent, [e.target.name]: e.target.value });
  };

  // Add new category (field)
  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return alert("Category name cannot be empty");
    if (aboutContent.hasOwnProperty(trimmed)) {
      return alert("Category already exists");
    }
    setAboutContent({ ...aboutContent, [trimmed]: "" });
    setNewCategory("");
  };

  // Remove a category
  const handleRemoveCategory = (key) => {
    if (window.confirm(`Are you sure you want to delete category "${key}"?`)) {
      const updatedContent = { ...aboutContent };
      delete updatedContent[key];
      setAboutContent(updatedContent);
    }
  };

  // Save to Firestore
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
    <div style={styles.container}>
      {/* Dashboard Button */}
      <button
        onClick={() => navigate("/admin/dashboard")}
        style={styles.dashboardButton}
      >
        Dashboard
      </button>

      <h2 style={styles.title}>Edit About Section</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Existing Categories */}
        {Object.keys(aboutContent).map((key) => (
          <div key={key} style={styles.group}>
            <label style={styles.label}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <textarea
              name={key}
              value={aboutContent[key]}
              onChange={handleChange}
              rows="4"
              style={styles.textarea}
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveCategory(key)}
              style={styles.deleteButton}
              title={`Delete ${key}`}
            >
              Delete
            </button>
          </div>
        ))}

        {/* Add New Category */}
        <div style={{ ...styles.group, marginTop: "2rem" }}>
          <input
            type="text"
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            style={styles.input}
          />
          <button
            type="button"
            onClick={handleAddCategory}
            style={styles.addButton}
          >
            Add Category
          </button>
        </div>

        <button type="submit" style={styles.button}>
          Save All
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "2rem auto",
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif"
  },
  dashboardButton: {
    marginBottom: "1.5rem",
    padding: "10px 20px",
    backgroundColor: "#2563eb", // Blue color
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    alignSelf: "flex-start"
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "1.5rem",
    color: "#333"
  },
  form: {
    display: "flex",
    flexDirection: "column"
  },
  group: {
    marginBottom: "1rem",
    position: "relative"
  },
  label: {
    fontWeight: "bold",
    marginBottom: "0.5rem",
    display: "block"
  },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    resize: "vertical"
  },
  button: {
    marginTop: "1rem",
    padding: "10px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    fontSize: "1rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  deleteButton: {
    position: "absolute",
    right: 0,
    top: "30px",
    backgroundColor: "#e53e3e",
    border: "none",
    borderRadius: "6px",
    color: "white",
    padding: "5px 10px",
    cursor: "pointer",
    fontSize: "0.9rem"
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginRight: "10px"
  },
  addButton: {
    padding: "10px 20px",
    backgroundColor: "#48bb78",
    color: "white",
    fontSize: "1rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  }
};

export default AdminAbout;
