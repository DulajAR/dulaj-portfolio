import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const AdminContact = () => {
  const [contacts, setContacts] = useState([]);
  const [newType, setNewType] = useState("");
  const [newLink, setNewLink] = useState("");
  const [editingContactId, setEditingContactId] = useState(null);

  const [cvs, setCVs] = useState([]);
  const [newCV, setNewCV] = useState(null);
  const [editingCVId, setEditingCVId] = useState(null);

  const navigate = useNavigate();

  const contactsRef = collection(db, "contacts");
  const cvsRef = collection(db, "cvs");

  const fetchContacts = async () => {
    const snapshot = await getDocs(contactsRef);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setContacts(data);
  };

  const fetchCVs = async () => {
    const snapshot = await getDocs(cvsRef);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCVs(data);
  };

  useEffect(() => {
    fetchContacts();
    fetchCVs();
  }, []);

  const handleAddOrUpdateContact = async () => {
    if (!newType || !newLink) return;

    if (editingContactId) {
      const contactRef = doc(db, "contacts", editingContactId);
      await updateDoc(contactRef, { type: newType, link: newLink });
      alert("Contact updated successfully!");
    } else {
      await addDoc(contactsRef, { type: newType, link: newLink });
      alert("Contact added successfully!");
    }

    setNewType("");
    setNewLink("");
    setEditingContactId(null);
    fetchContacts();
  };

  const handleEditContact = (contact) => {
    setEditingContactId(contact.id);
    setNewType(contact.type);
    setNewLink(contact.link);
  };

  const handleDeleteContact = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this contact?");
    if (!confirm) return;

    await deleteDoc(doc(db, "contacts", id));
    fetchContacts();
    alert("Contact deleted!");
  };

  const uploadCVFile = async (file) => {
    const storageRef = ref(storage, `cvs/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleAddCV = async () => {
    if (!newCV) {
      alert("Please select a CV file.");
      return;
    }

    if (cvs.length > 0) {
      alert("Only one CV is allowed. Please delete or edit the existing one.");
      return;
    }

    const url = await uploadCVFile(newCV);
    await addDoc(cvsRef, { cvUrl: url });
    setNewCV(null);
    fetchCVs();
    alert("CV uploaded successfully!");
  };

  const handleUpdateCV = async (id) => {
    if (!newCV) {
      alert("Please select a new file to update.");
      return;
    }

    const docRef = doc(db, "cvs", id);
    const oldCV = cvs.find((c) => c.id === id);

    if (oldCV?.cvUrl) {
      try {
        const oldRef = ref(storage, oldCV.cvUrl);
        await deleteObject(oldRef);
      } catch (error) {
        console.warn("Old file deletion failed (may not exist).");
      }
    }

    const newUrl = await uploadCVFile(newCV);
    await updateDoc(docRef, { cvUrl: newUrl });
    setEditingCVId(null);
    setNewCV(null);
    fetchCVs();
    alert("CV updated successfully!");
  };

  const handleDeleteCV = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete the CV?");
    if (!confirm) return;

    const cv = cvs.find((c) => c.id === id);
    if (cv?.cvUrl) {
      try {
        const refToDelete = ref(storage, cv.cvUrl);
        await deleteObject(refToDelete);
      } catch (error) {
        console.warn("CV file already missing in storage.");
      }
    }

    await deleteDoc(doc(db, "cvs", id));
    fetchCVs();
    alert("CV deleted successfully!");
  };

  return (
    <section style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>📇 Manage Contact Links</h2>

      <button
        onClick={() => navigate("/admin/dashboard")}
        style={{
          marginBottom: "2rem",
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

      {/* Contact Links Form */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Type (e.g., LinkedIn, GitHub)"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            flex: "1 1 200px",
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
            flex: "2 1 300px",
          }}
        />
        <button
          onClick={handleAddOrUpdateContact}
          style={{
            backgroundColor: editingContactId ? "#f0ad4e" : "#5cb85c",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
          }}
        >
          {editingContactId ? "Update" : "Add"} Contact
        </button>
        {editingContactId && (
          <button
            onClick={() => {
              setEditingContactId(null);
              setNewType("");
              setNewLink("");
            }}
            style={{
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
            }}
          >
            Cancel
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
              flexWrap: "wrap",
            }}
          >
            <div>
              <strong>{contact.type}:</strong>{" "}
              <a
                href={contact.link}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#007BFF" }}
              >
                {contact.link}
              </a>
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <button
                onClick={() => handleEditContact(contact)}
                style={{
                  backgroundColor: "#5bc0de",
                  color: "white",
                  border: "none",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "6px",
                  marginRight: "0.5rem",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteContact(contact.id)}
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

      <hr style={{ margin: "3rem 0" }} />

      {/* CV Section */}
      <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>📄 Manage CV Upload</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setNewCV(e.target.files[0])}
          style={{ flex: "1 1 300px" }}
        />

        {editingCVId ? (
          <>
            <button
              onClick={() => handleUpdateCV(editingCVId)}
              style={{
                backgroundColor: "#f0ad4e",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
              }}
            >
              Update CV
            </button>
            <button
              onClick={() => {
                setEditingCVId(null);
                setNewCV(null);
              }}
              style={{
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={handleAddCV}
            style={{
              backgroundColor: "#0275d8",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
            }}
          >
            Upload CV
          </button>
        )}
      </div>

      {/* CV List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {cvs.map((cv) => (
          <li
            key={cv.id}
            style={{
              padding: "1rem",
              border: "1px solid #eee",
              borderRadius: "10px",
              marginBottom: "1rem",
              backgroundColor: "#fefefe",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href={cv.cvUrl}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#28a745" }}
            >
              📄 View CV
            </a>
            <div style={{ marginTop: "0.5rem" }}>
              <button
                onClick={() => {
                  setEditingCVId(cv.id);
                  setNewCV(null);
                }}
                style={{
                  marginRight: "0.5rem",
                  backgroundColor: "#5bc0de",
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
                onClick={() => handleDeleteCV(cv.id)}
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
