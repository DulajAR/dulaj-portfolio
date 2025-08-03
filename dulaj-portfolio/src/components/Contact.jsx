import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaGithub,
  FaGlobe,
} from "react-icons/fa";
import contactBg from "../assets/contact.png"; // ✅ import image

const iconMap = {
  email: <FaEnvelope style={{ marginRight: "10px", color: "#007bff" }} />,
  phone: <FaPhone style={{ marginRight: "10px", color: "#28a745" }} />,
  linkedin: <FaLinkedin style={{ marginRight: "10px", color: "#0e76a8" }} />,
  github: <FaGithub style={{ marginRight: "10px", color: "#333" }} />,
  website: <FaGlobe style={{ marginRight: "10px", color: "#17a2b8" }} />,
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

  const getIcon = (type) => {
    const key = type.toLowerCase();
    return iconMap[key] || <FaGlobe style={{ marginRight: "10px" }} />;
  };

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
        }}
      >
        <h2 className="fancy-heading" style={{ marginBottom: "1rem", textAlign: "center" }}>
          📬 CONTACT ME
        </h2>
        <p style={{ textAlign: "center", color: "#333", marginBottom: "2rem" }}>
          Feel free to reach out through any of the platforms below.
        </p>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {contacts.map((contact) => (
            <li
              key={contact.id}
              style={{
                padding: "1rem 1.2rem",
                backgroundColor: "#ffffffcc",
                borderRadius: "12px",
                marginBottom: "1rem",
                boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                display: "flex",
                alignItems: "center",
                transition: "transform 0.2s ease, box-shadow 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {getIcon(contact.type)}
              <strong style={{ marginRight: "10px", minWidth: "100px", textTransform: "capitalize" }}>
                {contact.type}
              </strong>
              <a
                href={
                  contact.type.toLowerCase() === "email"
                    ? `mailto:${contact.link}`
                    : contact.link.startsWith("http")
                    ? contact.link
                    : `https://${contact.link}`
                }
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#007bff",
                  textDecoration: "none",
                  fontWeight: 500,
                  wordBreak: "break-word",
                }}
              >
                {contact.link}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .fancy-heading {
          font-size: 3rem;
          text-align: center;
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
