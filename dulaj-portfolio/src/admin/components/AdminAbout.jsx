import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";

const AdminAbout = () => {
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

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={styles.title}
        >
          Edit About Section
        </motion.h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          {Object.keys(aboutContent).map((key) => (
            <div key={key} style={styles.fieldGroup}>
              <label style={styles.label}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <div style={styles.fieldRow}>
                <textarea
                  name={key}
                  value={aboutContent[key]}
                  onChange={handleChange}
                  rows="4"
                  required
                  style={styles.textarea}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(key)}
                  title={`Delete ${key}`}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          <div style={styles.addRow}>
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
              style={styles.addBtn}
            >
              Add Category
            </button>
          </div>

          <button type="submit" style={styles.saveBtn}>
            Save All
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    padding: "2rem",
    minHeight: "100vh",
  },
  contentWrapper: {
    maxWidth: "800px",
    width: "100%",
    backgroundColor: "#fff",
    padding: "2.5rem",
    borderRadius: 16,
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  },
  loading: {
    textAlign: "center",
    padding: "4rem",
    color: "#6b7280",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#1e1b4b",
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  fieldGroup: {
    marginBottom: "1rem",
  },
  label: {
    fontWeight: 600,
    display: "block",
    color: "#374151",
    marginBottom: 6,
    fontSize: "0.9rem",
  },
  fieldRow: {
    display: "flex",
    gap: 8,
    alignItems: "flex-start",
  },
  textarea: {
    flex: 1,
    padding: "10px",
    fontSize: "1rem",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    resize: "vertical",
    fontFamily: "inherit",
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
    border: "none",
    borderRadius: 8,
    color: "white",
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 600,
    flexShrink: 0,
  },
  addRow: {
    marginTop: "1.5rem",
    display: "flex",
    gap: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "1rem",
    borderRadius: 8,
    border: "1px solid #d1d5db",
  },
  addBtn: {
    padding: "10px 20px",
    backgroundColor: "#10b981",
    color: "white",
    fontSize: "0.9rem",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },
  saveBtn: {
    marginTop: "1.5rem",
    padding: "12px",
    backgroundColor: "#6366f1",
    color: "#fff",
    fontSize: "1rem",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default AdminAbout;
