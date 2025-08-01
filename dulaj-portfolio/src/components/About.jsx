import React, { useState, useEffect } from "react";
import { db } from "../firebase";
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
        borderRadius: "20px",
        maxWidth: "900px",
        margin: "2rem auto",
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
        color: "#fff",
        background: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
        backgroundSize: "400% 400%",
        animation: "gradientBG 15s ease infinite",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)"
      }}
    >
      <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", fontWeight: "bold", textAlign: "center" }}>
        About Me
      </h2>

      {aboutContent.intro && <p>{aboutContent.intro}</p>}
      {aboutContent.passion && <p>{aboutContent.passion}</p>}
      {aboutContent.education && <p>{aboutContent.education}</p>}
      {aboutContent.hobbies && <p>{aboutContent.hobbies}</p>}

      {Object.entries(aboutContent).map(([key, value]) => {
        if (["intro", "passion", "education", "hobbies"].includes(key) || !value) return null;
        return <p key={key}>{value}</p>;
      })}

      {/* Keyframe animation for gradient */}
      <style>
        {`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </section>
  );
};

export default About;
