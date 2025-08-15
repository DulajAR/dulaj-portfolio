import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        // Fetch certificates sorted by "order" field
        const q = query(collection(db, "certificates"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCertificates(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching certificates:", error);
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  return (
    <section style={styles.section}>
      <h2 className="cert-heading">My Certificates</h2>

      {loading ? (
        <div style={styles.loaderContainer}>
          <img
            src="https://i.gifer.com/ZKZg.gif"
            alt="Loading..."
            style={styles.loaderImage}
          />
          <p style={{ color: "#fff", marginTop: "1rem", fontSize: "1.2rem" }}>
            Loading certificates...
          </p>
        </div>
      ) : (
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
      )}

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
                style={{
                  width: "100%",
                  maxHeight: "80vh",
                  borderRadius: "10px",
                }}
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

      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          background-color: #0f172a !important;
          height: 100%;
          width: 100%;
        }

        #root {
          min-height: 100vh;
          background-color: #0f172a;
        }

        .cert-heading {
          font-size: 3rem;
          font-weight: 900;
          text-align: center;
          color: #ffffff;
          margin-bottom: 2rem;
          background-color: #1f1f1f;
          padding: 0.6rem 1rem;
          border-radius: 10px;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
          text-shadow:
            2px 2px 5px rgba(0, 0, 0, 0.8),
            0 0 10px rgba(255, 255, 255, 0.9);
        }

        @media (max-width: 768px) {
          .cert-heading {
            font-size: 2.2rem;
          }
        }
      `}</style>
    </section>
  );
};

const styles = {
  section: {
    padding: "3rem 1rem",
    maxWidth: "1100px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#0f172a",
    minHeight: "100vh",
  },
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "2rem",
  },
  loaderImage: {
    width: "120px",
    height: "120px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "1.5rem",
  },
  card: {
    padding: "1rem",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "transform 0.2s",
    textAlign: "center",
  },
  cardTitle: {
    fontSize: "1.2rem",
    marginBottom: "0.5rem",
    color: "#1f2937",
  },
  cardDesc: {
    fontSize: "0.95rem",
    color: "#555",
    marginBottom: "0.5rem",
  },
  thumbnail: {
    width: "100%",
    borderRadius: "8px",
    objectFit: "cover",
    height: "180px",
  },
  pdfPreview: {
    width: "100%",
    height: "180px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
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
    position: "relative",
  },
  modalTitle: {
    marginBottom: "1rem",
    color: "#1f2937",
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
    cursor: "pointer",
  },
};

export default Certificates;
