import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const skillsCol = collection(db, "skills");
      const skillsSnapshot = await getDocs(skillsCol);
      const skillsList = skillsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSkills(skillsList);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading skills...</p>;

  if (skills.length === 0)
    return <p style={{ textAlign: "center" }}>No skills added yet.</p>;

  return (
    <section id="skills" className="skills-section">
      <h2 className="skills-heading">Skills</h2>

      <div className="skills-grid">
        {skills.map((skill) => (
          <div key={skill.id} className="skill-card">
            <img
              src={skill.imageUrl || ""}
              alt={skill.name}
              className="skill-logo"
              onError={(e) => {
                e.target.src = "/fallback-image.png";
              }}
            />
            <p className="skill-name">{skill.name}</p>
          </div>
        ))}
      </div>

      <style>{`
        .skills-section {
          padding: 2rem;
          text-align: center;
          background: linear-gradient(-45deg, #ff9a9e, #fad0c4, #fbc2eb, #a1c4fd);
          background-size: 400% 400%;
          animation: gradientBG 15s ease infinite;
          min-height: 100vh;
        }

        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .skills-heading {
          font-size: 2.5rem;
          margin-bottom: 2rem;
          color: #fff;
          text-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* increased min width */
          gap: 1.5rem;
          justify-items: center;
          align-items: center;
        }

        .skill-card {
          background: #ffffffcc;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          width: 150px;   /* increased size */
          height: 150px;  /* increased size */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .skill-card:hover {
          transform: scale(1.1) rotate(2deg);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .skill-logo {
          width: 70px;
          height: 70px;
          object-fit: contain;
          margin-bottom: 0.5rem;
          transition: transform 0.3s ease;
        }

        .skill-card:hover .skill-logo {
          transform: rotate(15deg) scale(1.2);
        }

        .skill-name {
          font-size: 0.95rem;
          color: #333;
          font-weight: 600;
          margin: 0;
        }
      `}</style>
    </section>
  );
};

export default Skills;
