import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection, getDocs, addDoc, deleteDoc, doc, updateDoc,
} from "firebase/firestore";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { uploadToCloudinary } from "../../utils/cloudinary";

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillImage, setNewSkillImage] = useState(null);
  const [updatingSkillId, setUpdatingSkillId] = useState(null);
  const [updatingSkillName, setUpdatingSkillName] = useState("");
  const [updatingSkillImage, setUpdatingSkillImage] = useState(null);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const skillsSnapshot = await getDocs(collection(db, "skills"));
      const skillsList = skillsSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      setSkills(skillsList);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
    setLoading(false);
  };

  useEffect(() => { fetchSkills(); }, []);

  const uploadImage = async (file) => {
    const uploadedFile = await uploadToCloudinary(file, { folder: "portfolio_upload/skills" });
    return { url: uploadedFile.url, publicId: uploadedFile.publicId, resourceType: uploadedFile.resourceType };
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim() || !newSkillImage) return alert("Provide name & image");
    try {
      const docRef = await addDoc(collection(db, "skills"), {
        name: newSkillName.trim(), imageUrl: "", imagePublicId: "", imageResourceType: "", order: skills.length,
      });
      const uploadedImage = await uploadImage(newSkillImage);
      await updateDoc(doc(db, "skills", docRef.id), {
        imageUrl: uploadedImage.url, imagePublicId: uploadedImage.publicId, imageResourceType: uploadedImage.resourceType,
      });
      fetchSkills(); setNewSkillName(""); setNewSkillImage(null);
      document.getElementById("newSkillImageInput").value = "";
    } catch (err) {
      console.error(err); alert("Failed to add skill");
    }
  };

  const handleDeleteSkill = async (skill) => {
    if (!window.confirm(`Delete skill "${skill.name}"?`)) return;
    try { await deleteDoc(doc(db, "skills", skill.id)); fetchSkills(); }
    catch (err) { console.error(err); alert("Failed to delete skill"); }
  };

  const startUpdateSkill = (skill) => {
    setUpdatingSkillId(skill.id); setUpdatingSkillName(skill.name); setUpdatingSkillImage(null);
  };
  const cancelUpdate = () => { setUpdatingSkillId(null); setUpdatingSkillName(""); setUpdatingSkillImage(null); };

  const handleUpdateSkill = async (e) => {
    e.preventDefault();
    if (!updatingSkillName.trim()) return alert("Name cannot be empty");
    try {
      let updateData = { name: updatingSkillName.trim() };
      if (updatingSkillImage) {
        const uploadedImage = await uploadImage(updatingSkillImage);
        updateData = { ...updateData, imageUrl: uploadedImage.url, imagePublicId: uploadedImage.publicId, imageResourceType: uploadedImage.resourceType };
      }
      await updateDoc(doc(db, "skills", updatingSkillId), updateData);
      fetchSkills(); cancelUpdate();
    } catch (err) { console.error(err); alert("Failed to update skill"); }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const reordered = Array.from(skills);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setSkills(reordered);
    try {
      await Promise.all(reordered.map((skill, index) => updateDoc(doc(db, "skills", skill.id), { order: index })));
    } catch (err) { console.error("Failed to save new order:", err); }
  };

  if (loading) return <div style={styles.loading}>Loading skills...</div>;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        <h2 style={styles.title}>Manage Skills</h2>

        <form onSubmit={handleAddSkill} style={styles.form}>
          <input type="text" placeholder="Skill Name" value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)} style={styles.input} required />
          <input id="newSkillImageInput" type="file" accept="image/*"
            onChange={(e) => setNewSkillImage(e.target.files[0])} style={{ marginTop: 10 }} required />
          <button type="submit" style={styles.addButton}>Add Skill</button>
        </form>

        <hr style={{ margin: "2rem 0", borderColor: "#e5e7eb" }} />

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="skills">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {skills.map((skill, index) => (
                  <Draggable key={skill.id} draggableId={skill.id} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                        style={{ ...styles.skillCard, ...provided.draggableProps.style }}>
                        {updatingSkillId === skill.id ? (
                          <form onSubmit={handleUpdateSkill} style={styles.updateForm}>
                            <input type="text" value={updatingSkillName}
                              onChange={(e) => setUpdatingSkillName(e.target.value)} style={styles.input} required />
                            <input type="file" accept="image/*"
                              onChange={(e) => setUpdatingSkillImage(e.target.files[0])} style={{ marginTop: 5 }} />
                            <div style={{ marginTop: 10 }}>
                              <button type="submit" style={styles.saveButton}>Save</button>
                              <button type="button" onClick={cancelUpdate} style={styles.cancelButton}>Cancel</button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <img src={skill.imageUrl} alt={skill.name} style={styles.skillImage} />
                            <p style={{ margin: "0.5rem 0", fontWeight: "bold", color: "#1e1b4b" }}>{skill.name}</p>
                            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                              <button onClick={() => startUpdateSkill(skill)} style={styles.editButton}>Edit</button>
                              <button onClick={() => handleDeleteSkill(skill)} style={styles.deleteButton}>Delete</button>
                            </div>
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
  pageContainer: { padding: "2rem", minHeight: "100vh" },
  contentWrapper: {
    maxWidth: 900, width: "100%", padding: "2rem", backgroundColor: "#fff",
    borderRadius: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  },
  loading: { textAlign: "center", padding: "4rem", color: "#6b7280" },
  title: { fontSize: "1.5rem", marginBottom: 20, color: "#1e1b4b", textAlign: "center", fontWeight: 700 },
  form: { display: "flex", flexDirection: "column", maxWidth: 400, margin: "0 auto" },
  input: { padding: 10, fontSize: 16, marginBottom: 10, borderRadius: 8, border: "1px solid #d1d5db" },
  addButton: {
    padding: 12, fontSize: 16, borderRadius: 8, backgroundColor: "#6366f1", color: "#fff",
    border: "none", cursor: "pointer", fontWeight: 600,
  },
  skillCard: {
    border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 20,
    textAlign: "center", position: "relative", backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  skillImage: { width: 80, height: 80, objectFit: "contain", marginBottom: 8 },
  editButton: {
    marginRight: 8, padding: "6px 14px", borderRadius: 8, border: "none",
    backgroundColor: "#6366f1", color: "white", cursor: "pointer", fontWeight: 600,
  },
  deleteButton: {
    padding: "6px 14px", borderRadius: 8, border: "none",
    backgroundColor: "#ef4444", color: "white", cursor: "pointer", fontWeight: 600,
  },
  updateForm: { display: "flex", flexDirection: "column", alignItems: "center" },
  saveButton: {
    padding: "8px 20px", backgroundColor: "#6366f1", color: "white",
    border: "none", borderRadius: 8, cursor: "pointer", marginRight: 10, fontWeight: 600,
  },
  cancelButton: {
    padding: "8px 20px", backgroundColor: "#9ca3af", color: "white",
    border: "none", borderRadius: 8, cursor: "pointer",
  },
};

export default AdminSkills;
