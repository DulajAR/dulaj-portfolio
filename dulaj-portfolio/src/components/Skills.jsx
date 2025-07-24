import React from "react";

// Import logos from src/assets
import reactLogo from "../assets/react.png";
import viteLogo from "../assets/vite.png";
import firebaseLogo from "../assets/firebase.png";
import nodeLogo from "../assets/node.png";
import expressLogo from "../assets/express.png";
import javaLogo from "../assets/java.png";
import springLogo from "../assets/spring.png";
import mysqlLogo from "../assets/mysql.png";
import mongoLogo from "../assets/mongodb.png";
import htmlLogo from "../assets/html.png";
import cssLogo from "../assets/css.png";
import jsLogo from "../assets/js.png";

const skills = [
  { name: "React.js", logo: reactLogo },
  { name: "Vite", logo: viteLogo },
  { name: "Firebase", logo: firebaseLogo },
  { name: "Node.js", logo: nodeLogo },
  { name: "Express", logo: expressLogo },
  { name: "Java", logo: javaLogo },
  { name: "Spring Boot", logo: springLogo },
  { name: "MySQL", logo: mysqlLogo },
  { name: "MongoDB", logo: mongoLogo },
  { name: "HTML", logo: htmlLogo },
  { name: "CSS", logo: cssLogo },
  { name: "JavaScript", logo: jsLogo },
];

const Skills = () => {
  return (
    <section id="skills" style={{ padding: "2rem", textAlign: "center", background: "#f9f9f9" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "#333" }}>Skills</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: "1.5rem",
        justifyItems: "center",
        alignItems: "center"
      }}>
        {skills.map((skill, index) => (
          <div key={index} className="skill-card">
            <img src={skill.logo} alt={skill.name} className="skill-logo" />
            <p style={{ fontSize: "0.9rem", color: "#444", fontWeight: "500", margin: "0" }}>{skill.name}</p>
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
