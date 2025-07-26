// src/admin/components/AdminSkills.jsx
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
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillImage, setNewSkillImage] = useState(null);

  const [updatingSkillId, setUpdatingSkillId] = useState(null);
  const [updatingSkillName, setUpdatingSkillName] = useState("");
  const [updatingSkillImage, setUpdatingSkillImage] = useState(null);

  // Fetch skills from Firestore
  const fetchSkills = async () => {
    setLoading(true);
    try {
      const skillsCol = collection(db, "skills");
      const skillsSnapshot = await getDocs(skillsCol);
      const skillsList = skillsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSkills(skillsList);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Upload image to Firebase Storage and get URL
  const uploadImage = async (file, skillId) => {
    const storageRef = ref(storage, `skills/${skillId}-${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { url, path: storageRef.fullPath };
  };

  // Add new skill
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim() || !newSkillImage) {
      alert("Please provide both skill name and image");
      return;
    }
    try {
      // Add skill doc without image first to get ID
      const docRef = await addDoc(collection(db, "skills"), {
        name: newSkillName.trim(),
        imageUrl: "",
        imagePath: "",
      });

      // Upload image and get URL
      const { url, path } = await uploadImage(newSkillImage, docRef.id);

      // Update skill with image URL and path
      await updateDoc(doc(db, "skills", docRef.id), {
        imageUrl: url,
        imagePath: path,
      });

      // Refresh list
      fetchSkills();

      // Clear form
      setNewSkillName("");
      setNewSkillImage(null);
      document.getElementById("newSkillImageInput").value = "";
    } catch (error) {
      console.error("Error adding skill:", error);
      alert("Failed to add skill.");
    }
  };

  // Delete skill (doc + image)
  const handleDeleteSkill = async (skill) => {
    if (!window.confirm(`Delete skill "${skill.name}"?`)) return;
    try {
      // Delete image from storage
      if (skill.imagePath) {
        const imageRef = ref(storage, skill.imagePath);
        await deleteObject(imageRef);
      }

      // Delete firestore doc
      await deleteDoc(doc(db, "skills", skill.id));

      fetchSkills();
    } catch (error) {
      console.error("Error deleting skill:", error);
      alert("Failed to delete skill.");
    }
  };

  // Start updating skill (load current data)
  const startUpdateSkill = (skill) => {
    setUpdatingSkillId(skill.id);
    setUpdatingSkillName(skill.name);
    setUpdatingSkillImage(null);
  };

  // Cancel update
  const cancelUpdate = () => {
    setUpdatingSkillId(null);
    setUpdatingSkillName("");
    setUpdatingSkillImage(null);
  };

  // Submit update
  const handleUpdateSkill = async (e) => {
    e.preventDefault();
    if (!updatingSkillName.trim()) {
      alert("Skill name cannot be empty");
      return;
    }
    try {
      const skillDocRef = doc(db, "skills", updatingSkillId);
      let updateData = { name: updatingSkillName.trim() };

      if (updatingSkillImage) {
        // Delete old image first
        const oldSkill = skills.find((s) => s.id === updatingSkillId);
        if (oldSkill.imagePath) {
          const oldImageRef = ref(storage, oldSkill.imagePath);
          await deleteObject(oldImageRef);
        }

        // Upload new image
        const { url, path } = await uploadImage(updatingSkillImage, updatingSkillId);
        updateData.imageUrl = url;
        updateData.imagePath = path;
      }

      // Update Firestore doc
      await updateDoc(skillDocRef, updateData);

      fetchSkills();
      cancelUpdate();
    } catch (error) {
      console.error("Error updating skill:", error);
      alert("Failed to update skill.");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading skills...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Manage Skills</h2>

      {/* Add New Skill */}
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
        <button type="submit" style={styles.addButton}>
          Add Skill
        </button>
      </form>

      <hr style={{ margin: "2rem 0" }} />

      {/* Skills List */}
      <div>
        {skills.length === 0 && <p>No skills added yet.</p>}

        {skills.map((skill) => (
          <div key={skill.id} style={styles.skillCard}>
            {updatingSkillId === skill.id ? (
              // Edit form for this skill
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
                  <button type="submit" style={styles.saveButton}>
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelUpdate}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              // Display skill info
              <>
                <img
                  src={skill.imageUrl}
                  alt={skill.name}
                  style={styles.skillImage}
                />
                <p style={{ margin: "0.5rem 0", fontWeight: "bold" }}>
                  {skill.name}
                </p>
                <button
                  onClick={() => startUpdateSkill(skill)}
                  style={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSkill(skill)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 900,
    margin: "2rem auto",
    padding: "2rem",
    backgroundColor: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    maxWidth: 400,
    margin: "0 auto",
  },
  input: {
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  addButton: {
    padding: 12,
    fontSize: 16,
    borderRadius: 8,
    backgroundColor: "#48bb78",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  skillCard: {
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    textAlign: "center",
    position: "relative",
  },
  skillImage: {
    width: 80,
    height: 80,
    objectFit: "contain",
    marginBottom: 8,
  },
  editButton: {
    marginRight: 8,
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#e53e3e",
    color: "white",
    cursor: "pointer",
  },
  updateForm: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  saveButton: {
    padding: "8px 20px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    marginRight: 10,
  },
  cancelButton: {
    padding: "8px 20px",
    backgroundColor: "#a0aec0",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};

export default AdminSkills;
