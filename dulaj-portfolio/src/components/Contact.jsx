import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { SiX } from "react-icons/si";
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
import heroImg from "../assets/hero.png"; // ✅ Add this import

// Icon map
const iconMap = {
  email: <FaEnvelope style={{ color: "#007bff" }} />,
  phone: <FaPhone style={{ color: "#28a745" }} />,
  linkedin: <FaLinkedin style={{ color: "#0e76a8" }} />,
  github: <FaGithub style={{ color: "#333" }} />,
  website: <FaGlobe style={{ color: "#17a2b8" }} />,
  instagram: <FaInstagram style={{ color: "#e4405f" }} />,
  facebook: <FaFacebook style={{ color: "#3b5998" }} />,
  x: <SiX style={{ color: "#000000" }} />,
};

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [success, setSuccess] = useState("");

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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        timestamp: serverTimestamp(),
      });
      setSuccess("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error sending message:", err);
    }
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
          maxWidth: "1000px",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "16px",
          padding: "3rem 2rem",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
      >
        {/* Updated Heading with Profile Image ABOVE */}
<div style={{ marginBottom: "2rem" }}>
  <div style={{ marginBottom: "1rem" }}>
    <img
      src={heroImg}
      alt="Profile"
      style={{
        width: "90px",
        height: "90px",
        borderRadius: "50%",
        border: "3px solid #00ffff",
        boxShadow: "0 0 12px rgba(0, 255, 255, 0.5)",
      }}
    />
  </div>
  <h2
    className="fancy-heading"
    style={{
      backgroundColor: "#0f172a",
      padding: "0.6rem 1.2rem",
      borderRadius: "12px",
      display: "inline-block",
      color: "#00ffff",
      textShadow: "0 0 8px #00ffff",
    }}
  >
    📬 CONTACT ME
  </h2>
</div>


        <p style={{ color: "#333", marginBottom: "2rem" }}>
          Connect with me through any of the platforms below or send a message directly.
        </p>

        {/* Contact icons */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "1.2rem",
            marginBottom: "2.5rem",
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
                  transition: "transform 0.3s ease",
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

        {/* Message form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              padding: "0.8rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              padding: "0.8rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            style={{
              padding: "0.8rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              resize: "vertical",
            }}
          ></textarea>
          <button
            type="submit"
            style={{
              padding: "0.8rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#00bcd4",
              color: "#fff",
              fontSize: "1.1rem",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
          >
            Send Message
          </button>
          {success && (
            <p style={{ color: "green", marginTop: "0.5rem" }}>{success}</p>
          )}
        </form>
      </div>

      {/* Styles */}
      <style>{`
        .fancy-heading {
          font-size: 3rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          animation: textFadeSlideUp 0.6s ease forwards;
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
