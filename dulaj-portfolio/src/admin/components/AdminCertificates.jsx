import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase";
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
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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
    const q = query(collection(db, "certificates"), orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
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
        fileType,
        order: certificates.length // new order field
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
      try {
        const fileName = cert.fileUrl.split("%2F")[1].split("?")[0];
        const storageRef = ref(storage, `certificates/${fileName}`);
        await deleteObject(storageRef);
      } catch {}
      fetchCertificates();
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(certificates);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update local state
    setCertificates(items);

    // Update Firestore order
    const updates = items.map((item, index) => {
      const docRef = doc(db, "certificates", item.id);
      return updateDoc(docRef, { order: index });
    });

    await Promise.all(updates);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    hover: { scale: 1.03, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" },
    tap: { scale: 0.97 }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        <motion.button
          onClick={() => navigate("/admin/dashboard")}
          style={styles.backBtn}
          whileHover={{ scale: 1.1, rotate: 5, backgroundColor: "#ff6b6b", color: "#fff" }}
          whileTap={{ scale: 0.95, rotate: -5 }}
        >
          ← Back to Dashboard
        </motion.button>

        <motion.h2
          style={styles.title}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {editingId ? "Edit Certificate" : "Add New Certificate"}
        </motion.h2>

        <motion.div
          style={styles.form}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
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
            <motion.button
              onClick={handleUpload}
              style={styles.uploadButton}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {editingId ? "Update" : "Upload"} Certificate
            </motion.button>
            {editingId && (
              <motion.button
                onClick={handleCancelEdit}
                style={styles.cancelButton}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Cancel
              </motion.button>
            )}
          </div>
        </motion.div>

        <motion.h3
          style={styles.uploadedHeading}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          📜 Uploaded Certificates
        </motion.h3>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="certificates" direction="horizontal">
            {(provided) => (
              <motion.div
                style={styles.grid}
                {...provided.droppableProps}
                ref={provided.innerRef}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {certificates.map((cert, index) => (
                  <Draggable key={cert.id} draggableId={cert.id} index={index}>
                    {(providedDrag) => (
                      <motion.div
                        key={cert.id}
                        style={styles.card}
                        variants={cardVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setPreviewCert(cert)}
                        ref={providedDrag.innerRef}
                        {...providedDrag.draggableProps}
                        {...providedDrag.dragHandleProps}
                      >
                        <h3 style={{ color: "#4f46e5", textShadow: "0 0 6px #a5b4fc" }}>{cert.title}</h3>
                        <p>{cert.description}</p>
                        {cert.fileType === "image" ? (
                          <img src={cert.fileUrl} alt="certificate" style={styles.image} />
                        ) : (
                          <iframe src={cert.fileUrl} title="PDF Preview" style={styles.pdfPreview} frameBorder="0" />
                        )}
                        <div style={{ marginTop: "0.5rem", display: "flex", gap: "10px", justifyContent: "center" }}>
                          <motion.button
                            onClick={(e) => { e.stopPropagation(); handleEdit(cert); }}
                            style={styles.editButton}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            onClick={(e) => { e.stopPropagation(); handleDelete(cert); }}
                            style={styles.deleteButton}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            Delete
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </motion.div>
            )}
          </Droppable>
        </DragDropContext>

        <AnimatePresence>
          {previewCert && (
            <motion.div
              style={styles.modalOverlay}
              onClick={() => setPreviewCert(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                style={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
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
                <motion.button
                  onClick={() => setPreviewCert(null)}
                  style={styles.closeButton}
                  whileHover={{ scale: 1.05, backgroundColor: "#4338e5" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
    padding: "2rem 1rem",
    fontFamily: "Arial, sans-serif"
  },
  contentWrapper: {
    maxWidth: "900px",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "12px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
    padding: "2rem",
    marginBottom: "2rem",
    color: "#1a202c"
  },
  backBtn: {
    display: "block",
    margin: "0 auto 1rem",
    padding: "10px 20px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1.1rem",
    backgroundColor: "#ffcc00",
    color: "#1a202c",
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)"
  },
  title: {
    fontSize: "2rem",
    textAlign: "center",
    marginBottom: "2rem",
    background: "linear-gradient(90deg, #ff6b6b, #fcb045, #6a11cb, #2575fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "bold"
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
  uploadedHeading: {
    marginTop: "3rem",
    marginBottom: "1rem",
    textAlign: "center",
    fontSize: "1.8rem",
    fontWeight: "bold",
    background: "linear-gradient(90deg, #ff6b6b, #fcb045, #6a11cb, #2575fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px"
  },
  card: {
    padding: "1rem",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    position: "relative",
    textAlign: "center",
    cursor: "pointer",
    color: "#1a202c"
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
