import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { motion } from "framer-motion";
import { FaUniversity } from "react-icons/fa";

const Education = () => {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducations = async () => {
      try {
        const q = query(collection(db, "education"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEducations(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching education:", error);
        setLoading(false);
      }
    };
    fetchEducations();
  }, []);

  return (
    <section style={styles.section}>
      <h2 className="edu-heading">🎓 My Education</h2>

      {loading ? (
        <div style={styles.loaderContainer}>
          <img
            src="https://i.gifer.com/ZKZg.gif"
            alt="Loading..."
            style={styles.loaderImage}
          />
          <p style={{ color: "#fff", marginTop: "1rem", fontSize: "1.2rem" }}>
            Loading education details...
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {educations.map((edu, index) => (
            <motion.div
              key={edu.id}
              className="edu-card"
              style={styles.card}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{
                scale: 1.03,
              }}
            >
              {/* Top Black Strip with University */}
              <div style={styles.uniBar}>
                <FaUniversity style={styles.uniIcon} />
                <span style={styles.uniText}>{edu.university}</span>
              </div>

              {/* Field */}
              {edu.field && <p style={styles.field}>{edu.field}</p>}

              {/* Colorful Animated Divider */}
              <div className="color-bar"></div>

              {/* Status */}
              {edu.status && (
                <p
                  style={{
                    ...styles.status,
                    color:
                      edu.status === "Completed"
                        ? "#38a169"
                        : edu.status === "Following"
                        ? "#3182ce"
                        : "#e53e3e",
                    fontWeight: "bold",
                  }}
                >
                  {edu.status}
                </p>
              )}

              {/* Years */}
              <div style={styles.dateContainer}>
                {edu.startYear && <span>{edu.startYear}</span>}
                {edu.endYear && <span>{edu.endYear}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Extra CSS */}
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

        .edu-heading {
          font-size: 3rem;
          font-weight: 900;
          text-align: center;
          color: #ffffff;
          margin-bottom: 2rem;
          background: linear-gradient(90deg, #667eea, #764ba2);
          padding: 0.6rem 1rem;
          border-radius: 12px;
          box-shadow: 0 0 12px rgba(255,255,255,0.5);
          text-shadow: 2px 2px 5px rgba(0,0,0,0.7);
        }

        @media (max-width: 768px) {
          .edu-heading {
            font-size: 2.2rem;
          }
        }

        /* Animated colorful wave bar */
        .color-bar {
          height: 4px;
          background: linear-gradient(
            270deg,
            #ff0080,
            #ff8c00,
            #40e0d0,
            #ff0080
          );
          background-size: 600% 600%;
          border-radius: 5px;
          margin: 0.8rem 0 1rem;
          animation: waveMove 4s ease infinite;
        }

        /* Glowing border effect on hover */
        .edu-card {
          transition: box-shadow 0.3s ease, border 0.3s ease;
          border: 2px solid transparent;
        }
        .edu-card:hover {
          border: 2px solid #fbbf24;
          box-shadow: 0 0 15px #fbbf24;
        }

        @keyframes waveMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
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
    padding: "1.5rem",
    background: "linear-gradient(135deg, #1f2937, #374151)",
    borderRadius: "12px",
    color: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textAlign: "center",
    overflow: "hidden",
  },
  uniBar: {
    backgroundColor: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.4rem",
    padding: "0.6rem",
    borderRadius: "8px 8px 0 0",
    margin: "-1.5rem -1.5rem 1rem -1.5rem",
  },
  uniIcon: {
    color: "#fbbf24",
    fontSize: "1.5rem",
  },
  uniText: {
    fontSize: "1.4rem", // larger text for university
    fontWeight: "bold",
    color: "#fff",
  },
  field: { fontSize: "1rem", marginBottom: "0.5rem", color: "#e2e8f0" },
  status: { fontSize: "1rem", marginBottom: "0.5rem" },
  dateContainer: {
    display: "flex",
    justifyContent: "space-around",
    fontSize: "0.9rem",
    color: "#cbd5e1",
    marginTop: "0.5rem",
  },
};







export default Education;
