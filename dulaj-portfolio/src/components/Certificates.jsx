import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "certificates"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCertificates(data);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      }
    };

    fetchCertificates();
  }, []);

  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>📜 My Certificates</h2>

      <div style={styles.grid}>
        {certificates.map((cert) => (
          <div
            key={cert.id}
            style={styles.card}
            onClick={() => setSelectedCert(cert)}
          >
            <h3 style={styles.cardTitle}>{cert.title}</h3>
            <p style={styles.cardDesc}>{cert.description}</p>
            {cert.fileType === "image" ? (
              <img
                src={cert.fileUrl}
                alt={cert.title}
                style={styles.thumbnail}
              />
            ) : (
              <iframe
                src={cert.fileUrl}
                title={cert.title}
                style={styles.pdfPreview}
              />
            )}
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {selectedCert && (
        <div style={styles.modalOverlay} onClick={() => setSelectedCert(null)}>
          <div
            style={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={styles.modalTitle}>{selectedCert.title}</h3>
            <p>{selectedCert.description}</p>
            {selectedCert.fileType === "image" ? (
              <img
                src={selectedCert.fileUrl}
                alt={selectedCert.title}
                style={{ width: "100%", maxHeight: "80vh", borderRadius: "10px" }}
              />
            ) : (
              <iframe
                src={selectedCert.fileUrl}
                title={selectedCert.title}
                width="100%"
                height="500px"
                style={{ border: "none", borderRadius: "10px" }}
              />
            )}
            <button
              style={styles.closeButton}
              onClick={() => setSelectedCert(null)}
            >
              ✖ Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

const styles = {
  section: {
    padding: "3rem 1rem",
    maxWidth: "1100px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif"
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "2rem",
    textAlign: "center",
    color: "#333"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "1.5rem"
  },
  card: {
    padding: "1rem",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.2s",
    textAlign: "center"
  },
  cardTitle: {
    fontSize: "1.2rem",
    marginBottom: "0.5rem",
    color: "#1f2937"
  },
  cardDesc: {
    fontSize: "0.95rem",
    color: "#555",
    marginBottom: "0.5rem"
  },
  thumbnail: {
    width: "100%",
    borderRadius: "8px",
    objectFit: "cover",
    height: "180px"
  },
  pdfPreview: {
    width: "100%",
    height: "180px",
    border: "1px solid #ccc",
    borderRadius: "8px"
  },
  modalOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    maxWidth: "800px",
    width: "90%",
    maxHeight: "90vh",
    overflowY: "auto",
    textAlign: "center",
    position: "relative"
  },
  modalTitle: {
    marginBottom: "1rem",
    color: "#1f2937"
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default Certificates;
