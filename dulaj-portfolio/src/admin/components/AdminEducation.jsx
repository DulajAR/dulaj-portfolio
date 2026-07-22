import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const AdminEducation = () => {
  const [educations, setEducations] = useState([]);
  const [newEdu, setNewEdu] = useState({ university: "", field: "", status: "", logoUrl: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchEducations = async () => {
    const q = query(collection(db, "education"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEducations(data);
  };

  useEffect(() => { fetchEducations(); }, []);

  const handleSave = async () => {
    const { university, field, status, logoUrl } = newEdu;
    if (!university || !field || !status) return alert("All fields are required!");
    const eduData = { university, field, status, logoUrl: logoUrl || "" };
    if (editingId) {
      await updateDoc(doc(db, "education", editingId), eduData);
      alert("Education updated!");
    } else {
      const maxOrder = educations.length > 0 ? Math.max(...educations.map(e => e.order || 0)) : 0;
      await addDoc(collection(db, "education"), { ...eduData, order: maxOrder + 1 });
      alert("Education added!");
    }
    setNewEdu({ university: "", field: "", status: "", logoUrl: "" });
    setEditingId(null);
    fetchEducations();
  };

  const handleEdit = (edu) => {
    setNewEdu({ university: edu.university, field: edu.field, status: edu.status, logoUrl: edu.logoUrl || "" });
    setEditingId(edu.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null); setNewEdu({ university: "", field: "", status: "", logoUrl: "" });
  };

  const handleDelete = async (edu) => {
    if (window.confirm("Are you sure you want to delete this education entry?")) {
      await deleteDoc(doc(db, "education", edu.id));
      fetchEducations();
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(educations);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    for (let i = 0; i < items.length; i++) {
      await updateDoc(doc(db, "education", items[i].id), { order: i + 1 });
    }
    setEducations(items);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        <motion.h2 style={styles.title}
          initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120 }}>
          {editingId ? "Edit Education" : "Add New Education"}
        </motion.h2>

        <motion.div style={styles.form}>
          <input type="text" placeholder="University Name" value={newEdu.university}
            onChange={(e) => setNewEdu({ ...newEdu, university: e.target.value })} style={styles.input} />
          <input type="text" placeholder="Field of Study" value={newEdu.field}
            onChange={(e) => setNewEdu({ ...newEdu, field: e.target.value })} style={styles.input} />
          <select value={newEdu.status} onChange={(e) => setNewEdu({ ...newEdu, status: e.target.value })} style={styles.input}>
            <option value="">Select Status</option>
            <option value="Completed">Completed</option>
            <option value="Following">Following</option>
            <option value="Dropped">Dropped</option>
          </select>
          <input type="text" placeholder="University Logo URL (optional)" value={newEdu.logoUrl}
            onChange={(e) => setNewEdu({ ...newEdu, logoUrl: e.target.value })} style={styles.input} />
          <div style={{ display: "flex", gap: "10px" }}>
            <motion.button onClick={handleSave} style={styles.uploadButton} whileHover={{ scale: 1.03 }}>
              {editingId ? "Update" : "Add"} Education
            </motion.button>
            {editingId && (
              <motion.button onClick={handleCancelEdit} style={styles.cancelButton} whileHover={{ scale: 1.03 }}>Cancel</motion.button>
            )}
          </div>
        </motion.div>

        <h3 style={{ marginTop: "2rem", marginBottom: "1rem", textAlign: "center", color: "#1e1b4b", fontWeight: 700 }}>
          Education History
        </h3>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="educations">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} style={styles.grid}>
                {educations.map((edu, index) => (
                  <Draggable key={edu.id} draggableId={edu.id} index={index}>
                    {(provided) => (
                      <motion.div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                        style={{ ...styles.card, ...provided.draggableProps.style }}
                        whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 12 }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#6366f1" }}>{edu.university}</h3>
                        <p><strong>Field:</strong> {edu.field}</p>
                        <p><strong>Status:</strong> {edu.status}</p>
                        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "0.5rem" }}>
                          <motion.button onClick={() => handleEdit(edu)} style={styles.editButton}
                            whileHover={{ scale: 1.05 }}>Edit</motion.button>
                          <motion.button onClick={() => handleDelete(edu)} style={styles.deleteButton}
                            whileHover={{ scale: 1.05 }}>Delete</motion.button>
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
  pageContainer: { padding: "2rem", minHeight: "100vh" },
  contentWrapper: {
    maxWidth: "900px", width: "100%", backgroundColor: "#fff",
    borderRadius: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", padding: "2rem",
  },
  title: {
    fontSize: "1.5rem", fontWeight: 700, textAlign: "center",
    marginBottom: "1.5rem", color: "#1e1b4b",
  },
  form: { marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: "1rem" },
  uploadButton: {
    padding: "10px", backgroundColor: "#6366f1", color: "white",
    border: "none", borderRadius: 8, cursor: "pointer", fontSize: "1rem", fontWeight: 600,
  },
  cancelButton: {
    padding: "10px", backgroundColor: "#9ca3af", color: "white",
    border: "none", borderRadius: 8, cursor: "pointer", fontSize: "1rem",
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" },
  card: {
    padding: "1rem", backgroundColor: "#f9fafb", borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)", textAlign: "center", cursor: "grab",
  },
  editButton: {
    backgroundColor: "#10b981", color: "white", border: "none",
    padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 600,
  },
  deleteButton: {
    backgroundColor: "#ef4444", border: "none", color: "white",
    padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 600,
  },
};

export default AdminEducation;
