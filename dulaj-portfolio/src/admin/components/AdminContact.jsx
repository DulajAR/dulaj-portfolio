import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc,
} from "firebase/firestore";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { uploadToCloudinary } from "../../utils/cloudinary";

const AdminContact = () => {
  const [contacts, setContacts] = useState([]);
  const [newType, setNewType] = useState("");
  const [newLink, setNewLink] = useState("");
  const [editingContactId, setEditingContactId] = useState(null);
  const [cvs, setCVs] = useState([]);
  const [newCV, setNewCV] = useState(null);
  const [editingCVId, setEditingCVId] = useState(null);

  const contactsRef = collection(db, "contacts");
  const cvsRef = collection(db, "cvs");

  const fetchContacts = async () => {
    const snapshot = await getDocs(contactsRef);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    setContacts(data);
  };

  const fetchCVs = async () => {
    const snapshot = await getDocs(cvsRef);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCVs(data);
  };

  useEffect(() => { fetchContacts(); fetchCVs(); }, []);

  const handleAddOrUpdateContact = async () => {
    if (!newType || !newLink) return;
    if (editingContactId) {
      await updateDoc(doc(db, "contacts", editingContactId), { type: newType, link: newLink });
      alert("Contact updated successfully!");
    } else {
      await addDoc(contactsRef, { type: newType, link: newLink, order: contacts.length });
      alert("Contact added successfully!");
    }
    setNewType(""); setNewLink(""); setEditingContactId(null); fetchContacts();
  };

  const handleEditContact = (contact) => {
    setEditingContactId(contact.id); setNewType(contact.type); setNewLink(contact.link);
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    await deleteDoc(doc(db, "contacts", id)); fetchContacts(); alert("Contact deleted!");
  };

  const uploadCVFile = async (file) => {
    return uploadToCloudinary(file, { folder: "portfolio_upload/cvs", resourceType: "image" });
  };

  const getCVViewUrl = (cv) => {
    if (!cv?.cvUrl) return "#";
    if (cv.cvResourceType === "raw") {
      return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(cv.cvUrl)}`;
    }
    return cv.cvUrl;
  };

  const handleAddCV = async () => {
    if (!newCV) return alert("Please select a CV file.");
    if (cvs.length > 0) return alert("Only one CV is allowed. Please delete or edit the existing one.");
    const uploadedCV = await uploadCVFile(newCV);
    await addDoc(cvsRef, { cvUrl: uploadedCV.url, cvPublicId: uploadedCV.publicId, cvResourceType: uploadedCV.resourceType });
    setNewCV(null); fetchCVs(); alert("CV uploaded successfully!");
  };

  const handleUpdateCV = async (id) => {
    if (!newCV) return alert("Please select a new file to update.");
    const uploadedCV = await uploadCVFile(newCV);
    await updateDoc(doc(db, "cvs", id), { cvUrl: uploadedCV.url, cvPublicId: uploadedCV.publicId, cvResourceType: uploadedCV.resourceType });
    setEditingCVId(null); setNewCV(null); fetchCVs(); alert("CV updated successfully!");
  };

  const handleDeleteCV = async (id) => {
    if (!window.confirm("Are you sure you want to delete the CV?")) return;
    await deleteDoc(doc(db, "cvs", id)); fetchCVs(); alert("CV deleted successfully!");
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const reordered = Array.from(contacts);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setContacts(reordered);
    try {
      await Promise.all(reordered.map((c, index) => updateDoc(doc(db, "contacts", c.id), { order: index })));
    } catch (err) { console.error("Failed to save new order:", err); }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        <h2 style={styles.title}>Manage Contact Links</h2>

        <div style={styles.addRow}>
          <input type="text" placeholder="Type (e.g., LinkedIn, GitHub)" value={newType}
            onChange={(e) => setNewType(e.target.value)} style={{ ...styles.input, flex: "1 1 200px" }} />
          <input type="text" placeholder="Link" value={newLink}
            onChange={(e) => setNewLink(e.target.value)} style={{ ...styles.input, flex: "2 1 300px" }} />
          <button onClick={handleAddOrUpdateContact}
            style={{ ...styles.actionBtn, backgroundColor: editingContactId ? "#f59e0b" : "#10b981" }}>
            {editingContactId ? "Update" : "Add"} Contact
          </button>
          {editingContactId && (
            <button onClick={() => { setEditingContactId(null); setNewType(""); setNewLink(""); }}
              style={styles.cancelBtn}>Cancel</button>
          )}
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="contacts">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef} style={{ listStyle: "none", padding: 0 }}>
                {contacts.map((contact, index) => (
                  <Draggable key={contact.id} draggableId={contact.id} index={index}>
                    {(provided, snapshot) => (
                      <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                        style={{
                          ...styles.contactItem,
                          backgroundColor: snapshot.isDragging ? "#eef2ff" : "#f9fafb",
                          ...provided.draggableProps.style,
                        }}>
                        <div>
                          <strong>{contact.type}:</strong>{" "}
                          <a href={contact.link} target="_blank" rel="noreferrer" style={{ color: "#6366f1" }}>
                            {contact.link}
                          </a>
                        </div>
                        <div style={{ marginTop: "0.5rem", display: "flex", gap: 6 }}>
                          <button onClick={() => handleEditContact(contact)} style={styles.editBtn}>Edit</button>
                          <button onClick={() => handleDeleteContact(contact.id)} style={styles.deleteBtn}>Delete</button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>

        <hr style={{ margin: "2rem 0", borderColor: "#e5e7eb" }} />

        <h2 style={styles.title}>Manage CV Upload</h2>

        <div style={styles.addRow}>
          <input type="file" accept=".pdf" onChange={(e) => setNewCV(e.target.files[0])}
            style={{ flex: "1 1 300px" }} />
          {editingCVId ? (
            <>
              <button onClick={() => handleUpdateCV(editingCVId)} style={{ ...styles.actionBtn, backgroundColor: "#f59e0b" }}>Update CV</button>
              <button onClick={() => { setEditingCVId(null); setNewCV(null); }} style={styles.cancelBtn}>Cancel</button>
            </>
          ) : (
            <button onClick={handleAddCV} style={{ ...styles.actionBtn, backgroundColor: "#6366f1" }}>Upload CV</button>
          )}
        </div>

        <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
          {cvs.map((cv) => (
            <li key={cv.id} style={styles.contactItem}>
              <a href={getCVViewUrl(cv)} target="_blank" rel="noreferrer" style={{ color: "#10b981" }}>
                View CV
              </a>
              <div style={{ marginTop: "0.5rem", display: "flex", gap: 6 }}>
                <button onClick={() => { setEditingCVId(cv.id); setNewCV(null); }} style={styles.editBtn}>Edit</button>
                <button onClick={() => handleDeleteCV(cv.id)} style={styles.deleteBtn}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: { padding: "2rem", minHeight: "100vh" },
  contentWrapper: {
    maxWidth: "800px", width: "100%", backgroundColor: "#fff",
    padding: "2rem", borderRadius: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: "1.5rem", textAlign: "center", marginBottom: "1.5rem",
    fontWeight: 700, color: "#1e1b4b",
  },
  addRow: { display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" },
  input: { padding: "8px 10px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: "0.9rem" },
  actionBtn: {
    color: "white", border: "none", padding: "8px 16px",
    borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: "0.9rem",
  },
  cancelBtn: {
    backgroundColor: "#9ca3af", color: "white", border: "none",
    padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 600,
  },
  contactItem: {
    padding: "1rem", border: "1px solid #e5e7eb", borderRadius: 12,
    marginBottom: "0.75rem", display: "flex", justifyContent: "space-between",
    alignItems: "center", flexWrap: "wrap",
  },
  editBtn: {
    backgroundColor: "#6366f1", color: "white", border: "none",
    padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 600,
  },
  deleteBtn: {
    backgroundColor: "#ef4444", color: "white", border: "none",
    padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 600,
  },
};

export default AdminContact;
