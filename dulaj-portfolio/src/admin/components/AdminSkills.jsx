import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillImage, setNewSkillImage] = useState(null);

  const [updatingSkillId, setUpdatingSkillId] = useState(null);
  const [updatingSkillName, setUpdatingSkillName] = useState("");
  const [updatingSkillImage, setUpdatingSkillImage] = useState(null);

  // Fetch skills
  const fetchSkills = async () => {
    setLoading(true);
    try {
      const skillsCol = collection(db, "skills");
      const skillsSnapshot = await getDocs(skillsCol);
      const skillsList = skillsSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (a.order || 0) - (b.order || 0)); // sort by order
      setSkills(skillsList);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Upload image
  const uploadImage = async (file, skillId) => {
    const storageRef = ref(storage, `skills/${skillId}-${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { url, path: storageRef.fullPath };
  };

  // Add skill
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim() || !newSkillImage) return alert("Provide name & image");
    try {
      const docRef = await addDoc(collection(db, "skills"), {
        name: newSkillName.trim(),
        imageUrl: "",
        imagePath: "",
        order: skills.length,
      });

      const { url, path } = await uploadImage(newSkillImage, docRef.id);
      await updateDoc(doc(db, "skills", docRef.id), { imageUrl: url, imagePath: path });

      fetchSkills();
      setNewSkillName("");
      setNewSkillImage(null);
      document.getElementById("newSkillImageInput").value = "";
    } catch (err) {
      console.error(err);
      alert("Failed to add skill");
    }
  };

  // Delete skill
  const handleDeleteSkill = async (skill) => {
    if (!window.confirm(`Delete skill "${skill.name}"?`)) return;
    try {
      if (skill.imagePath) await deleteObject(ref(storage, skill.imagePath));
      await deleteDoc(doc(db, "skills", skill.id));
      fetchSkills();
    } catch (err) {
      console.error(err);
      alert("Failed to delete skill");
    }
  };

  // Start update
  const startUpdateSkill = (skill) => {
    setUpdatingSkillId(skill.id);
    setUpdatingSkillName(skill.name);
    setUpdatingSkillImage(null);
  };

  const cancelUpdate = () => {
    setUpdatingSkillId(null);
    setUpdatingSkillName("");
    setUpdatingSkillImage(null);
  };

  // Update skill
  const handleUpdateSkill = async (e) => {
    e.preventDefault();
    if (!updatingSkillName.trim()) return alert("Name cannot be empty");
    try {
      const skillDocRef = doc(db, "skills", updatingSkillId);
      let updateData = { name: updatingSkillName.trim() };

      if (updatingSkillImage) {
        const oldSkill = skills.find((s) => s.id === updatingSkillId);
        if (oldSkill.imagePath) await deleteObject(ref(storage, oldSkill.imagePath));
        const { url, path } = await uploadImage(updatingSkillImage, updatingSkillId);
        updateData.imageUrl = url;
        updateData.imagePath = path;
      }

      await updateDoc(skillDocRef, updateData);
      fetchSkills();
      cancelUpdate();
    } catch (err) {
      console.error(err);
      alert("Failed to update skill");
    }
  };

  // Drag & Drop
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const reordered = Array.from(skills);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setSkills(reordered);

    // Update Firestore order
    try {
      await Promise.all(
        reordered.map((skill, index) =>
          updateDoc(doc(db, "skills", skill.id), { order: index })
        )
      );
    } catch (err) {
      console.error("Failed to save new order:", err);
    }
  };

  if (loading) return <p style={{ textAlign: "center", color: "#fff" }}>Loading skills...</p>;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <h2 style={styles.title}>Manage Skills</h2>

        {/* Add new skill */}
        <form onSubmit={handleAddSkill} style={styles.form}>
          <input
            type="text"
            placeholder="Skill Name"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            style={styles.input}
            required
          />
          <input
            id="newSkillImageInput"
            type="file"
            accept="image/*"
            onChange={(e) => setNewSkillImage(e.target.files[0])}
            style={{ marginTop: 10 }}
            required
          />
          <button type="submit" style={styles.addButton}>Add Skill</button>
        </form>

        <hr style={{ margin: "2rem 0", borderColor: "rgba(0,0,0,0.1)" }} />

        {/* Skills list with drag & drop */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="skills">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {skills.map((skill, index) => (
                  <Draggable key={skill.id} draggableId={skill.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{ ...styles.skillCard, ...provided.draggableProps.style }}
                      >
                        {updatingSkillId === skill.id ? (
                          <form onSubmit={handleUpdateSkill} style={styles.updateForm}>
                            <input
                              type="text"
                              value={updatingSkillName}
                              onChange={(e) => setUpdatingSkillName(e.target.value)}
                              style={styles.input}
                              required
                            />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setUpdatingSkillImage(e.target.files[0])}
                              style={{ marginTop: 5 }}
                            />
                            <div style={{ marginTop: 10 }}>
                              <button type="submit" style={styles.saveButton}>Save</button>
                              <button type="button" onClick={cancelUpdate} style={styles.cancelButton}>Cancel</button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <img src={skill.imageUrl} alt={skill.name} style={styles.skillImage} />
                            <p style={{ margin: "0.5rem 0", fontWeight: "bold", color: "#333" }}>{skill.name}</p>
                            <button onClick={() => startUpdateSkill(skill)} style={styles.editButton}>Edit</button>
                            <button onClick={() => handleDeleteSkill(skill)} style={styles.deleteButton}>Delete</button>
                          </>
                        )}
                      </div>
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
    padding: "2rem 1rem",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    maxWidth: 900,
    width: "100%",
    padding: "2rem",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  },
  title: { fontSize: 24, marginBottom: 20, color: "#2d2d2d", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", maxWidth: 400, margin: "0 auto" },
  input: { padding: 10, fontSize: 16, marginBottom: 10, borderRadius: 8, border: "1px solid #ccc" },
  addButton: { padding: 12, fontSize: 16, borderRadius: 8, backgroundColor: "#667eea", color: "#fff", border: "none", cursor: "pointer", transition: "background-color 0.3s" },
  skillCard: { border: "1px solid #ddd", borderRadius: 12, padding: 16, marginBottom: 20, textAlign: "center", position: "relative", backgroundColor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
  skillImage: { width: 80, height: 80, objectFit: "contain", marginBottom: 8 },
  editButton: { marginRight: 8, padding: "6px 12px", borderRadius: 6, border: "none", backgroundColor: "#4c51bf", color: "white", cursor: "pointer", transition: "background-color 0.3s" },
  deleteButton: { padding: "6px 12px", borderRadius: 6, border: "none", backgroundColor: "#e53e3e", color: "white", cursor: "pointer", transition: "background-color 0.3s" },
  updateForm: { display: "flex", flexDirection: "column", alignItems: "center" },
  saveButton: { padding: "8px 20px", backgroundColor: "#5a67d8", color: "white", border: "none", borderRadius: 8, cursor: "pointer", marginRight: 10 },
  cancelButton: { padding: "8px 20px", backgroundColor: "#a0aec0", color: "white", border: "none", borderRadius: 8, cursor: "pointer" },
};

export default AdminSkills;
