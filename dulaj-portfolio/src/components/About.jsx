import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // adjust if needed
import { doc, getDoc } from "firebase/firestore";

const About = () => {
  const [aboutContent, setAboutContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const docRef = doc(db, "about", "profile");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAboutContent(docSnap.data());
        } else {
          setAboutContent(null);
        }
      } catch (error) {
        console.error("Error fetching about content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading About content...</p>;
  }

  if (!aboutContent) {
    return <p style={{ textAlign: "center" }}>No About content available.</p>;
  }

  return (
    <section
      id="about"
      style={{
        padding: "3rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        maxWidth: "800px",
        margin: "2rem auto",
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
        color: "#333"
      }}
    >
      <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", fontWeight: "bold" }}>
        About Me
      </h2>

      {/* Compose natural paragraphs */}
      {aboutContent.intro && <p>{aboutContent.intro}</p>}

      {aboutContent.passion && <p>{aboutContent.passion}</p>}

      {aboutContent.education && <p>{aboutContent.education}</p>}

      {aboutContent.hobbies && <p>{aboutContent.hobbies}</p>}

      {/* Optionally add other dynamic fields as paragraphs */}
      {Object.entries(aboutContent).map(([key, value]) => {
        if (
          ["intro", "passion", "education", "hobbies"].includes(key) ||
          !value
        )
          return null;
        return <p key={key}>{value}</p>;
      })}
    </section>
  );
};

export default About;
