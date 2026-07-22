import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { uploadToCloudinary } from "../../utils/cloudinary";

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [newCert, setNewCert] = useState({ title: "", description: "", file: null });
  const [editingId, setEditingId] = useState(null);
  const [previewCert, setPreviewCert] = useState(null);

  const fetchCertificates = async () => {
    const q = query(collection(db, "certificates"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCertificates(data);
  };

  useEffect(() => { fetchCertificates(); }, []);

  const handleUpload = async () => {
    const { title, description, file } = newCert;
    if (!title || (!file && !editingId)) return alert("Title and file are required!");
    let fileUrl = newCert.fileUrl;
    let fileType = newCert.fileType;
    let uploadedFile = null;
    try {
      if (file) {
        const isPdf = file.type.includes("pdf") || file.name.toLowerCase().endsWith(".pdf");
        fileType = isPdf ? "pdf" : "image";
        uploadedFile = await uploadToCloudinary(file, {
          folder: "portfolio_upload/certificates", resourceType: isPdf ? "raw" : "image",
        });
        fileUrl = uploadedFile.url;
      }
      if (editingId) {
        await updateDoc(doc(db, "certificates", editingId), {
          title, description, fileUrl, fileType,
          filePublicId: uploadedFile?.publicId || newCert.filePublicId || "",
          fileResourceType: uploadedFile?.resourceType || newCert.fileResourceType || "",
        });
        alert("Certificate updated!");
      } else {
        await addDoc(collection(db, "certificates"), {
          title, description, fileUrl, fileType,
          filePublicId: uploadedFile?.publicId || "",
          fileResourceType: uploadedFile?.resourceType || "",
          order: certificates.length,
        });
        alert("Certificate uploaded!");
      }
    } catch (err) {
      console.error("Certificate upload/update failed:", err);
      alert("Upload failed: " + (err.message || err));
      return;
    }
    setNewCert({ title: "", description: "", file: null });
    setEditingId(null);
    fetchCertificates();
  };

  const handleEdit = (cert) => {
    setNewCert({ title: cert.title, description: cert.description, file: null,
      fileUrl: cert.fileUrl, fileType: cert.fileType, filePublicId: cert.filePublicId || "", fileResourceType: cert.fileResourceType || "" });
    setEditingId(cert.id);
  };

  const handleCancelEdit = () => { setEditingId(null); setNewCert({ title: "", description: "", file: null }); };

  const handleDelete = async (cert) => {
    if (window.confirm("Are you sure you want to delete this certificate?")) {
      await deleteDoc(doc(db, "certificates", cert.id));
      fetchCertificates();
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(certificates);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCertificates(items);
    const updates = items.map((item, index) => updateDoc(doc(db, "certificates", item.id), { order: index }));
    await Promise.all(updates);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        <motion.h2 style={styles.title}
          initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {editingId ? "Edit Certificate" : "Add New Certificate"}
        </motion.h2>

        <motion.div style={styles.form} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <input type="text" placeholder="Certificate Title" value={newCert.title}
            onChange={(e) => setNewCert({ ...newCert, title: e.target.value })} style={styles.input} />
          <textarea placeholder="Short Description" value={newCert.description}
            onChange={(e) => setNewCert({ ...newCert, description: e.target.value })} style={styles.textarea} />
          <input type="file" accept="image/*,.pdf"
            onChange={(e) => setNewCert({ ...newCert, file: e.target.files[0] })} style={styles.input} />
          <div style={{ display: "flex", gap: "10px" }}>
            <motion.button onClick={handleUpload} style={styles.uploadButton} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              {editingId ? "Update" : "Upload"} Certificate
            </motion.button>
            {editingId && (
              <motion.button onClick={handleCancelEdit} style={styles.cancelButton} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                Cancel
              </motion.button>
            )}
          </div>
        </motion.div>

        <h3 style={styles.uploadedHeading}>Uploaded Certificates</h3>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="certificates" direction="horizontal">
            {(provided) => (
              <div style={styles.grid} {...provided.droppableProps} ref={provided.innerRef}>
                {certificates.map((cert, index) => (
                  <Draggable key={cert.id} draggableId={cert.id} index={index}>
                    {(providedDrag) => (
                      <div style={styles.card} ref={providedDrag.innerRef}
                        {...providedDrag.draggableProps} {...providedDrag.dragHandleProps}
                        onClick={() => setPreviewCert(cert)}>
                        <h3 style={{ color: "#6366f1", fontWeight: 700 }}>{cert.title}</h3>
                        <p>{cert.description}</p>
                        {cert.fileType === "image" ? (
                          <img src={cert.fileUrl} alt="certificate" style={styles.image} />
                        ) : (
                          <iframe src={cert.fileUrl || "#"} title="PDF Preview" style={styles.pdfPreview} frameBorder="0" />
                        )}
                        <div style={{ marginTop: "0.5rem", display: "flex", gap: "10px", justifyContent: "center" }}>
                          <motion.button onClick={(e) => { e.stopPropagation(); handleEdit(cert); }}
                            style={styles.editButton} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Edit</motion.button>
                          <motion.button onClick={(e) => { e.stopPropagation(); handleDelete(cert); }}
                            style={styles.deleteButton} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Delete</motion.button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <AnimatePresence>
          {previewCert && (
            <motion.div style={styles.modalOverlay} onClick={() => setPreviewCert(null)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div style={styles.modalContent} onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.3 }}>
                <h2>{previewCert.title}</h2>
                <p>{previewCert.description}</p>
                {previewCert.fileType === "image" ? (
                  <img src={previewCert.fileUrl} alt="Full Certificate" style={{ width: "100%", borderRadius: 10 }} />
                ) : (
                  <iframe src={previewCert.fileUrl} title="PDF Full View"
                    style={{ width: "100%", height: "600px", borderRadius: 10 }} />
                )}
                <motion.button onClick={() => setPreviewCert(null)} style={styles.closeButton}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Close</motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
    fontSize: "1.5rem", textAlign: "center", marginBottom: "1.5rem",
    fontWeight: 700, color: "#1e1b4b",
  },
  form: { marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: "1rem" },
  textarea: { padding: "10px", height: "80px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: "1rem" },
  uploadButton: {
    padding: "10px", backgroundColor: "#6366f1", color: "white",
    border: "none", borderRadius: 8, cursor: "pointer", fontSize: "1rem", fontWeight: 600,
  },
  cancelButton: {
    padding: "10px", backgroundColor: "#9ca3af", color: "white",
    border: "none", borderRadius: 8, cursor: "pointer", fontSize: "1rem",
  },
  uploadedHeading: {
    marginTop: "2rem", marginBottom: "1rem", textAlign: "center",
    fontSize: "1.2rem", fontWeight: 700, color: "#1e1b4b",
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" },
  card: {
    padding: "1rem", backgroundColor: "#f9fafb", borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)", textAlign: "center", cursor: "pointer", color: "#1e1b4b",
  },
  image: { width: "100%", marginTop: "0.5rem", borderRadius: 8 },
  pdfPreview: { width: "100%", height: "300px", marginTop: "0.5rem", borderRadius: 8, border: "1px solid #d1d5db" },
  editButton: {
    backgroundColor: "#10b981", color: "white", border: "none",
    padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 600,
  },
  deleteButton: {
    backgroundColor: "#ef4444", border: "none", color: "white",
    padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 600,
  },
  modalOverlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)", display: "flex",
    alignItems: "center", justifyContent: "center", zIndex: 1000,
  },
  modalContent: {
    background: "white", padding: "20px", borderRadius: 16,
    maxWidth: "90%", maxHeight: "90%", overflowY: "auto", textAlign: "center",
  },
  closeButton: {
    marginTop: "1rem", backgroundColor: "#6366f1", color: "white",
    border: "none", padding: "10px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 600,
  },
};

export default AdminCertificates;
