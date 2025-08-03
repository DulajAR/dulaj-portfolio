import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import backgroundImage from "../assets/about.png";

const About = () => {
  const [aboutContent, setAboutContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

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
        setTimeout(() => setShowPopup(true), 300); // popup after 300ms
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
      className="about-full-background"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="about-overlay" />

      {showPopup && (
        <div className="about-popup animate-popup">
          <div className="about-content animate-text">
            <h2>About Me</h2>

            {aboutContent.intro && <p>{aboutContent.intro}</p>}
            {aboutContent.passion && <p>{aboutContent.passion}</p>}
            {aboutContent.education && <p>{aboutContent.education}</p>}
            {aboutContent.hobbies && <p>{aboutContent.hobbies}</p>}

            {Object.entries(aboutContent).map(([key, value]) => {
              if (["intro", "passion", "education", "hobbies"].includes(key) || !value)
                return null;
              return <p key={key}>{value}</p>;
            })}
          </div>
        </div>
      )}

      <style>{`
        .about-overlay {
          background-color: rgba(48, 43, 43, 0.6); /* dark transparent layer */
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
        }

        .about-popup {
          position: relative;
          z-index: 2;
          max-width: 850px;
          width: 90%;
          margin: auto;
          border-radius: 20px;
          padding: 3rem;
          background-color: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(6px);
          color: white;
          text-align: center;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }

        /* Popup entrance animation */
        @keyframes popupFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(50px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-popup {
          animation: popupFadeIn 0.6s ease forwards;
        }

        /* Text fade & slide up animation, staggered with delay */
        @keyframes textFadeSlideUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-text h2 {
          animation: textFadeSlideUp 0.6s ease forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }

        .animate-text p {
          opacity: 0;
          animation: textFadeSlideUp 0.6s ease forwards;
        }

        /* Stagger paragraphs */
        .animate-text p:nth-child(2) { animation-delay: 0.5s; }
        .animate-text p:nth-child(3) { animation-delay: 0.7s; }
        .animate-text p:nth-child(4) { animation-delay: 0.9s; }
        .animate-text p:nth-child(5) { animation-delay: 1.1s; }
        .animate-text p:nth-child(n+6) { animation-delay: 1.3s; }

        @media (max-width: 768px) {
          .about-popup {
            padding: 2rem 1.5rem;
          }

          .animate-text h2 {
            font-size: 2rem;
          }

          .animate-text p {
            font-size: 1rem;
          }
        }
      `}</style>
    </section>
  );
};

export default About;
