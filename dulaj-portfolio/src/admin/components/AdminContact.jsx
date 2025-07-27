// src/admin/components/AdminContact.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const AdminContact = () => {
  const [contacts, setContacts] = useState([]);
  const [newType, setNewType] = useState("");
  const [newLink, setNewLink] = useState("");
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const contactsRef = collection(db, "contacts");

  // Fetch contacts from Firestore
  const fetchContacts = async () => {
    const snapshot = await getDocs(contactsRef);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setContacts(data);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Add new contact
  const handleAdd = async () => {
    if (!newType || !newLink) return;
    await addDoc(contactsRef, { type: newType, link: newLink });
    setNewType("");
    setNewLink("");
    fetchContacts();
  };

  // Update existing contact
  const handleUpdate = async (id) => {
    const docRef = doc(db, "contacts", id);
    await updateDoc(docRef, { type: newType, link: newLink });
    setEditingId(null);
    setNewType("");
    setNewLink("");
    fetchContacts();
  };

  // Delete a contact
  const handleDelete = async (id) => {
    const docRef = doc(db, "contacts", id);
    await deleteDoc(docRef);
    fetchContacts();
  };

  return (
    <section style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>📇 Manage Contact Links</h2>

      {/* Back to Dashboard */}
      <button
        onClick={() => navigate("/admin/dashboard")}
        style={{
          marginBottom: "1.5rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#6c757d",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        ⬅ Back to Dashboard
      </button>

      {/* Input Fields */}
      <div style={{
        display: "flex",
        gap: "1rem",
        marginBottom: "1.5rem",
        flexWrap: "wrap"
      }}>
        <input
          type="text"
          placeholder="Type (e.g., Email, LinkedIn)"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            flex: "1 1 200px"
          }}
        />
        <input
          type="text"
          placeholder="Link"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            flex: "2 1 300px"
          }}
        />
        {editingId ? (
          <button
            onClick={() => handleUpdate(editingId)}
            style={{
              backgroundColor: "#f0ad4e",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
            }}
          >
            Update
          </button>
        ) : (
          <button
            onClick={handleAdd}
            style={{
              backgroundColor: "#5cb85c",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
            }}
          >
            Add
          </button>
        )}
      </div>

      {/* Contact List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {contacts.map((contact) => (
          <li
            key={contact.id}
            style={{
              padding: "1rem",
              border: "1px solid #eee",
              borderRadius: "10px",
              marginBottom: "1rem",
              backgroundColor: "#fafafa",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap"
            }}
          >
            <div>
              <strong>{contact.type}:</strong>{" "}
              <a href={contact.link} target="_blank" rel="noreferrer" style={{ color: "#007BFF" }}>
                {contact.link}
              </a>
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <button
                onClick={() => {
                  setEditingId(contact.id);
                  setNewType(contact.type);
                  setNewLink(contact.link);
                }}
                style={{
                  marginRight: "0.5rem",
                  backgroundColor: "#0275d8",
                  color: "white",
                  border: "none",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(contact.id)}
                style={{
                  backgroundColor: "#d9534f",
                  color: "white",
                  border: "none",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AdminContact;
