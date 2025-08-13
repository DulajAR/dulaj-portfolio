import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const AdminEducation = () => {
  const [educations, setEducations] = useState([]);
  const [newEdu, setNewEdu] = useState({ university: "", field: "", status: "" });
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();

  // Fetch all education entries
  const fetchEducations = async () => {
    const q = query(collection(db, "education"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setEducations(data);
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  // Add or update entry
  const handleSave = async () => {
    const { university, field, status } = newEdu;
    if (!university || !field || !status) return alert("All fields are required!");

    if (editingId) {
      await updateDoc(doc(db, "education", editingId), { university, field, status });
      alert("Education updated!");
    } else {
      const maxOrder = educations.length > 0 ? Math.max(...educations.map(e => e.order || 0)) : 0;
      await addDoc(collection(db, "education"), { university, field, status, order: maxOrder + 1 });
      alert("Education added!");
    }

    setNewEdu({ university: "", field: "", status: "" });
    setEditingId(null);
    fetchEducations();
  };

  const handleEdit = (edu) => {
    setNewEdu({ university: edu.university, field: edu.field, status: edu.status });
    setEditingId(edu.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewEdu({ university: "", field: "", status: "" });
  };

  const handleDelete = async (edu) => {
    if (window.confirm("Are you sure you want to delete this education entry?")) {
      await deleteDoc(doc(db, "education", edu.id));
      fetchEducations();
    }
  };

  // Handle drag end
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(educations);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order in Firestore
    for (let i = 0; i < items.length; i++) {
      await updateDoc(doc(db, "education", items[i].id), { order: i + 1 });
    }

    setEducations(items);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        {/* Back Button */}
        <motion.button
          onClick={() => navigate("/admin/dashboard")}
          style={styles.backBtn}
          whileHover={{ scale: 1.1, rotate: 3, boxShadow: "0 12px 25px rgba(0,0,0,0.3)" }}
          whileTap={{ scale: 0.95, rotate: -3 }}
        >
          ← Back to Dashboard
        </motion.button>

        {/* Page Title */}
        <motion.h2
          style={styles.title}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          {editingId ? "Edit Education" : "Add New Education"}
        </motion.h2>

        {/* Form */}
        <motion.div style={styles.form}>
          <input
            type="text"
            placeholder="University Name"
            value={newEdu.university}
            onChange={(e) => setNewEdu({ ...newEdu, university: e.target.value })}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Field of Study"
            value={newEdu.field}
            onChange={(e) => setNewEdu({ ...newEdu, field: e.target.value })}
            style={styles.input}
          />
          <select
            value={newEdu.status}
            onChange={(e) => setNewEdu({ ...newEdu, status: e.target.value })}
            style={styles.input}
          >
            <option value="">Select Status</option>
            <option value="Completed">Completed</option>
            <option value="Following">Following</option>
            <option value="Dropped">Dropped</option>
          </select>

          <div style={{ display: "flex", gap: "10px" }}>
            <motion.button onClick={handleSave} style={styles.uploadButton} whileHover={{ scale: 1.05 }}>
              {editingId ? "Update" : "Add"} Education
            </motion.button>
            {editingId && (
              <motion.button onClick={handleCancelEdit} style={styles.cancelButton} whileHover={{ scale: 1.05 }}>
                Cancel
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Education History */}
        <h3 style={{ marginTop: "3rem", marginBottom: "1rem", textAlign: "center" }}>🎓 Education History</h3>

        {/* Drag & Drop */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="educations">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} style={styles.grid}>
                {educations.map((edu, index) => (
                  <Draggable key={edu.id} draggableId={edu.id} index={index}>
                    {(provided) => (
                      <motion.div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{ ...styles.card, ...provided.draggableProps.style }}
                        whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                        whileTap={{ scale: 0.98, rotate: -1 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 12 }}
                      >
                        <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#4f46e5" }}>{edu.university}</h3>
                        <p><strong>Field:</strong> {edu.field}</p>
                        <p><strong>Status:</strong> {edu.status}</p>
                        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "0.5rem" }}>
                          <motion.button
                            onClick={() => handleEdit(edu)}
                            style={styles.editButton}
                            whileHover={{ scale: 1.1, backgroundColor: "#2f855a" }}
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(edu)}
                            style={styles.deleteButton}
                            whileHover={{ scale: 1.1, backgroundColor: "#c53030" }}
                          >
                            Delete
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "3rem 1rem",
    fontFamily: "Arial, sans-serif",
  },
  contentWrapper: {
    maxWidth: "900px",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "16px",
    boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
    padding: "3rem 2rem",
    marginBottom: "3rem",
    backdropFilter: "blur(10px)",
  },
  backBtn: {
    background: "linear-gradient(90deg, #f6d365, #fda085)",
    padding: "10px 20px",
    borderRadius: "12px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "2rem",
    color: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "2rem",
    color: "#333",
    textShadow: "2px 2px 8px rgba(0,0,0,0.2)",
  },
  form: { marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "1rem" },
  uploadButton: { padding: "10px", backgroundColor: "#4f46e5", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1rem" },
  cancelButton: { padding: "10px", backgroundColor: "#718096", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" },
  card: { padding: "1rem", backgroundColor: "white", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", textAlign: "center", cursor: "grab" },
  editButton: { backgroundColor: "#38a169", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" },
  deleteButton: { backgroundColor: "#e53e3e", border: "none", color: "white", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }
};

export default AdminEducation;
