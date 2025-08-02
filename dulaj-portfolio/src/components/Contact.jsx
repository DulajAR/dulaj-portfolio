// src/components/Contact.jsx
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

const iconMap = {
  email: <FaEnvelope style={{ marginRight: "10px", color: "#007bff" }} />,
  phone: <FaPhone style={{ marginRight: "10px", color: "#28a745" }} />,
  linkedin: <FaLinkedin style={{ marginRight: "10px", color: "#0e76a8" }} />,
  github: <FaGithub style={{ marginRight: "10px", color: "#333" }} />,
  website: <FaGlobe style={{ marginRight: "10px", color: "#17a2b8" }} />,
};

const Contact = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const snapshot = await getDocs(collection(db, "contacts"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContacts(data);
    };

    fetchContacts();
  }, []);

  const getIcon = (type) => {
    const key = type.toLowerCase();
    return iconMap[key] || <FaGlobe style={{ marginRight: "10px" }} />;
  };

  return (
    <section
      id="contact"
      style={{
        padding: "4rem 2rem",
        maxWidth: "800px",
        margin: "auto",
        background:
          "linear-gradient(to right, #e0f7fa, #f1f8e9)",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <h2
        style={{
          fontSize: "2.5rem",
          marginBottom: "1rem",
          textAlign: "center",
          color: "#333",
        }}
      >
        📬 Contact Me
      </h2>
      <p style={{ textAlign: "center", color: "#555", marginBottom: "2rem" }}>
        Feel free to reach out through any of the platforms below.
      </p>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {contacts.map((contact) => (
          <li
            key={contact.id}
            style={{
              padding: "1rem 1.2rem",
              backgroundColor: "#fff",
              borderRadius: "12px",
              marginBottom: "1rem",
              boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              transition: "transform 0.2s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-4px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            {getIcon(contact.type)}
            <strong style={{ marginRight: "10px", minWidth: "100px" }}>
              {contact.type}
            </strong>
            <a
              href={
                contact.type.toLowerCase() === "email"
                  ? `mailto:${contact.link}`
                  : contact.link
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
    </section>
  );
};

export default Contact;
