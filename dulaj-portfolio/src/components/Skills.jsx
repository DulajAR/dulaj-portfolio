import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // adjust path if needed
import { collection, getDocs } from "firebase/firestore";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch skills from Firestore
  const fetchSkills = async () => {
    setLoading(true);
    try {
      const skillsCol = collection(db, "skills");
      const skillsSnapshot = await getDocs(skillsCol);
      const skillsList = skillsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
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

  if (loading) return <p style={{ textAlign: "center" }}>Loading skills...</p>;

  if (skills.length === 0) return <p style={{ textAlign: "center" }}>No skills added yet.</p>;

  return (
    <section
      id="skills"
      style={{ padding: "2rem", textAlign: "center", background: "#f9f9f9" }}
    >
      <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "#333" }}>
        Skills
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "1.5rem",
          justifyItems: "center",
          alignItems: "center",
        }}
      >
        {skills.map((skill) => (
          <div key={skill.id} className="skill-card">
            <img
              src={skill.imageUrl || ""}
              alt={skill.name}
              className="skill-logo"
              onError={(e) => { e.target.src = "/fallback-image.png"; }} // optional fallback
            />
            <p
              style={{
                fontSize: "0.9rem",
                color: "#444",
                fontWeight: "500",
                margin: "0",
              }}
            >
              {skill.name}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        .skill-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          width: 120px;
          height: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .skill-card:hover {
          transform: scale(1.1) rotate(2deg);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .skill-logo {
          width: 50px;
          height: 50px;
          object-fit: contain;
          margin-bottom: 0.5rem;
          transition: transform 0.3s ease;
        }

        .skill-card:hover .skill-logo {
          transform: rotate(15deg) scale(1.2);
        }
      `}</style>
    </section>
  );
};

export default Skills;
