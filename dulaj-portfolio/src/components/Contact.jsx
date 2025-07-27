// src/components/Contact.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

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

  return (
    <section
      id="contact"
      style={{
        padding: "4rem 2rem",
        maxWidth: "800px",
        margin: "auto",
        backgroundColor: "#f9f9f9",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ fontSize: "2.2rem", marginBottom: "1rem", textAlign: "center" }}>
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
              padding: "1rem",
              backgroundColor: "#fff",
              borderRadius: "10px",
              marginBottom: "1rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <strong style={{ fontSize: "1.1rem" }}>{contact.type}</strong>
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
