import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import { useNavigate } from "react-router-dom";

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [newCert, setNewCert] = useState({
    title: "",
    description: "",
    file: null
  });
  const [editingId, setEditingId] = useState(null);
  const [previewCert, setPreviewCert] = useState(null);

  const navigate = useNavigate();

  const fetchCertificates = async () => {
    const querySnapshot = await getDocs(collection(db, "certificates"));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setCertificates(data);
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleUpload = async () => {
    const { title, description, file } = newCert;
    if (!title || (!file && !editingId)) return alert("Title and file are required!");

    let fileUrl = newCert.fileUrl;
    let fileType = newCert.fileType;

    if (file) {
      fileType = file.type.includes("pdf") ? "pdf" : "image";
      const storageRef = ref(storage, `certificates/${file.name}`);
      await uploadBytes(storageRef, file);
      fileUrl = await getDownloadURL(storageRef);
    }

    if (editingId) {
      await updateDoc(doc(db, "certificates", editingId), {
        title,
        description,
        fileUrl,
        fileType
      });
      alert("Certificate updated!");
    } else {
      await addDoc(collection(db, "certificates"), {
        title,
        description,
        fileUrl,
        fileType
      });
      alert("Certificate uploaded!");
    }

    setNewCert({ title: "", description: "", file: null });
    setEditingId(null);
    fetchCertificates();
  };

  const handleEdit = (cert) => {
    setNewCert({
      title: cert.title,
      description: cert.description,
      file: null,
      fileUrl: cert.fileUrl,
      fileType: cert.fileType
    });
    setEditingId(cert.id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewCert({ title: "", description: "", file: null });
  };

  const handleDelete = async (cert) => {
    if (window.confirm("Are you sure you want to delete this certificate?")) {
      await deleteDoc(doc(db, "certificates", cert.id));
      const storageRef = ref(storage, `certificates/${cert.fileUrl.split("%2F")[1].split("?")[0]}`);
      await deleteObject(storageRef).catch(() => {});
      fetchCertificates();
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/admin/dashboard")} style={styles.backBtn}>
        ← Back to Dashboard
      </button>

      <h2 style={styles.title}>
        {editingId ? "Edit Certificate" : "Add New Certificate"}
      </h2>

      <div style={styles.form}>
        <input
          type="text"
          placeholder="Certificate Title"
          value={newCert.title}
          onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
          style={styles.input}
        />
        <textarea
          placeholder="Short Description"
          value={newCert.description}
          onChange={(e) => setNewCert({ ...newCert, description: e.target.value })}
          style={styles.textarea}
        />
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => setNewCert({ ...newCert, file: e.target.files[0] })}
          style={styles.input}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={handleUpload} style={styles.uploadButton}>
            {editingId ? "Update" : "Upload"} Certificate
          </button>
          {editingId && (
            <button onClick={handleCancelEdit} style={styles.cancelButton}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <h3 style={{ marginTop: "3rem", marginBottom: "1rem" }}>📜 Uploaded Certificates</h3>
      <div style={styles.grid}>
        {certificates.map(cert => (
          <div key={cert.id} style={styles.card} onClick={() => setPreviewCert(cert)}>
            <h3>{cert.title}</h3>
            <p>{cert.description}</p>
            {cert.fileType === "image" ? (
              <img src={cert.fileUrl} alt="certificate" style={styles.image} />
            ) : (
              <iframe
                src={cert.fileUrl}
                title="PDF Preview"
                style={styles.pdfPreview}
                frameBorder="0"
              />
            )}
            <div style={{ marginTop: "0.5rem", display: "flex", gap: "10px" }}>
              <button onClick={(e) => { e.stopPropagation(); handleEdit(cert); }} style={styles.editButton}>Edit</button>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(cert); }} style={styles.deleteButton}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔍 Preview Popup */}
      {previewCert && (
        <div style={styles.modalOverlay} onClick={() => setPreviewCert(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>{previewCert.title}</h2>
            <p>{previewCert.description}</p>
            {previewCert.fileType === "image" ? (
              <img src={previewCert.fileUrl} alt="Full Certificate" style={{ width: "100%", borderRadius: "10px" }} />
            ) : (
              <iframe
                src={previewCert.fileUrl}
                title="PDF Full View"
                style={{ width: "100%", height: "600px", borderRadius: "10px" }}
              />
            )}
            <button onClick={() => setPreviewCert(null)} style={styles.closeButton}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "2rem auto",
    padding: "1.5rem",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif"
  },
  backBtn: {
    backgroundColor: "#e2e8f0",
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    marginBottom: "1rem",
    cursor: "pointer",
    fontWeight: "bold"
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "1rem",
    color: "#333"
  },
  form: {
    marginBottom: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem"
  },
  textarea: {
    padding: "10px",
    height: "80px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem"
  },
  uploadButton: {
    padding: "10px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem"
  },
  cancelButton: {
    padding: "10px",
    backgroundColor: "#718096",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px"
  },
  card: {
    padding: "1rem",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    position: "relative",
    textAlign: "center",
    cursor: "pointer"
  },
  image: {
    width: "100%",
    marginTop: "0.5rem",
    borderRadius: "8px"
  },
  pdfPreview: {
    width: "100%",
    height: "300px",
    marginTop: "0.5rem",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },
  editButton: {
    backgroundColor: "#38a169",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  deleteButton: {
    backgroundColor: "#e53e3e",
    border: "none",
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  },
  modalContent: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    maxWidth: "90%",
    maxHeight: "90%",
    overflowY: "auto",
    textAlign: "center"
  },
  closeButton: {
    marginTop: "1rem",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer"
  }
};

export default AdminCertificates;
