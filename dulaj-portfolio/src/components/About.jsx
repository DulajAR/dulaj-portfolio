import React, { useEffect, useState } from "react";
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

  // 👨‍💻 Loading spinner UI
  if (loading) {
    return (
      <section
        style={{
          backgroundColor: "#0f172a",
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
          style={{ width: "120px", height: "120px" }}
        />
        <p style={{ color: "#fff", marginTop: "1rem", fontSize: "1.2rem" }}>
          Loading About Content...
        </p>
      </section>
    );
  }

  if (!aboutContent) {
    return (
      <section
        style={{
          backgroundColor: "#0f172a",
          minHeight: "100vh",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>No About content available.</p>
      </section>
    );
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
            <h2 className="fancy-heading">ABOUT ME</h2>

            {aboutContent.intro && <p>{aboutContent.intro}</p>}
            {aboutContent.passion && <p>{aboutContent.passion}</p>}
            {aboutContent.education && <p>{aboutContent.education}</p>}
            {aboutContent.hobbies && <p>{aboutContent.hobbies}</p>}

            {Object.entries(aboutContent).map(([key, value]) => {
              if (
                ["intro", "passion", "education", "hobbies"].includes(key) ||
                !value
              )
                return null;
              return <p key={key}>{value}</p>;
            })}
          </div>
        </div>
      )}

      <style>{`
        .about-overlay {
          background-color: rgba(48, 43, 43, 0.6);
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

        .fancy-heading {
          font-size: 3rem;
          text-transform: uppercase;
          color: #00ffff;
          letter-spacing: 2px;
          margin-bottom: 2rem;
          position: relative;
          animation: textFadeSlideUp 0.6s ease forwards;
          text-shadow: 0 0 8px #00ffff, 0 0 16px #00ffff;
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

        @keyframes underlineGrow {
          from { width: 0; }
          to { width: 60px; }
        }

        @keyframes popupFadeIn {
          0% { opacity: 0; transform: scale(0.8) translateY(50px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .animate-popup {
          animation: popupFadeIn 0.6s ease forwards;
        }

        @keyframes textFadeSlideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-text h2 {
          animation-delay: 0.3s;
          opacity: 0;
        }

        .animate-text p {
          opacity: 0;
          animation: textFadeSlideUp 0.6s ease forwards;
        }

        .animate-text p:nth-child(2) { animation-delay: 0.5s; }
        .animate-text p:nth-child(3) { animation-delay: 0.7s; }
        .animate-text p:nth-child(4) { animation-delay: 0.9s; }
        .animate-text p:nth-child(5) { animation-delay: 1.1s; }
        .animate-text p:nth-child(n+6) { animation-delay: 1.3s; }

        @media (max-width: 768px) {
          .about-popup {
            padding: 2rem 1.5rem;
          }

          .fancy-heading {
            font-size: 2.2rem;
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
