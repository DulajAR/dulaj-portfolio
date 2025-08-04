import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { SiX } from "react-icons/si"; // Twitter (X) icon

import {
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";
import contactBg from "../assets/contact.png";

// ✅ Replace Twitter icon with new X logo
const XLogo = (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/9/95/X_logo_2023.svg"
    alt="X"
    style={{ width: "24px", height: "24px", objectFit: "contain" }}
  />
);

// ✅ Icon map
const iconMap = {
  email: <FaEnvelope style={{ color: "#007bff" }} />,
  phone: <FaPhone style={{ color: "#28a745" }} />,
  linkedin: <FaLinkedin style={{ color: "#0e76a8" }} />,
  github: <FaGithub style={{ color: "#333" }} />,
  website: <FaGlobe style={{ color: "#17a2b8" }} />,
  instagram: <FaInstagram style={{ color: "#e4405f" }} />,
  facebook: <FaFacebook style={{ color: "#3b5998" }} />,
  x: <SiX style={{ color: "#000000" }} />, // 👈 Consistent style
};


const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "contacts"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setContacts(data);
      } catch (err) {
        console.error("Failed to fetch contacts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading)
    return (
      <section
        style={{
          background: "#0f172a",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <img
          src="https://i.gifer.com/ZKZg.gif"
          alt="Loading..."
          style={{ width: "100px", height: "100px" }}
        />
        <p style={{ color: "#fff", marginTop: "1rem", fontSize: "1.2rem" }}>
          Loading contact info...
        </p>
      </section>
    );

  return (
    <section
      id="contact"
      style={{
        backgroundImage: `url(${contactBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "16px",
          padding: "3rem 2rem",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
      >
        <h2 className="fancy-heading">📬 CONTACT ME</h2>
        <p style={{ color: "#333", marginBottom: "2rem" }}>
          Connect with me through any of the platforms below.
        </p>

        {/* ICONS GRID */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "1.2rem",
            marginTop: "2rem",
          }}
        >
          {contacts.map((contact) => {
            const key = contact.type.trim().toLowerCase();
            const icon = iconMap[key] || <FaGlobe />;
            const link =
              key === "email"
                ? `mailto:${contact.link}`
                : contact.link.startsWith("http")
                ? contact.link
                : `https://${contact.link}`;

            return (
              <a
                key={contact.id}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                title={contact.type}
                style={{
                  fontSize: "2rem",
                  padding: "0.8rem",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "60px",
                  height: "60px",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.15)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {icon}
              </a>
            );
          })}
        </div>
      </div>

      {/* HEADINGS & ANIMATION STYLES */}
      <style>{`
        .fancy-heading {
          font-size: 3rem;
          text-transform: uppercase;
          color: #00ffff;
          letter-spacing: 2px;
          position: relative;
          animation: textFadeSlideUp 0.6s ease forwards;
          text-shadow: 0 0 8px #00ffff, 0 0 16px #00ffff;
          user-select: none;
        }

        .fancy-heading::after {
          content: "";
          display: block;
          width: 60px;
          height: 3px;
          margin: 10px auto 0;
          background-color: #00ffff;
          border-radius: 2px;
          animation: underlineGrow 0.6s ease forwards;
        }

        @keyframes textFadeSlideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes underlineGrow {
          from { width: 0; }
          to { width: 60px; }
        }

        @media (max-width: 768px) {
          .fancy-heading {
            font-size: 2.2rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Contact;
