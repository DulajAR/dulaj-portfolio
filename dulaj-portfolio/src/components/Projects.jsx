import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import backgroundImage from "../assets/project.png";

// Example tech icons - customize or add more here
const techIcons = {
  React: "⚛️",
  "React + Vite": "⚛️✨",
  Firebase: "🔥",
  Cloudinary: "☁️",
  JavaScript: "🟨",
  // add your own...
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [mediaIndices, setMediaIndices] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, "projects"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched projects:", data);
        setProjects(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects.");
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMediaIndices((prevIndices) => {
        const newIndices = { ...prevIndices };
        projects.forEach((project) => {
          const mediaLength = project.media?.length || 0;
          if (mediaLength > 1) {
            newIndices[project.id] = (newIndices[project.id] || 0) + 1;
            if (newIndices[project.id] >= mediaLength) {
              newIndices[project.id] = 0;
            }
          }
        });
        return newIndices;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [projects]);

  const cleanHTML = (html) => {
    if (!html) return "";
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const elements = doc.querySelectorAll("[style], [class]");
    elements.forEach((el) => {
      el.removeAttribute("style");
      el.removeAttribute("class");
    });
    return doc.body.innerHTML;
  };

  const formatDescription = (htmlText) => {
    if (!htmlText) return "";
    const urlRegex = /(\b(https?:\/\/|www\.)\S+\b)/gi;
    let clean = cleanHTML(htmlText);
    clean = clean.replace(urlRegex, (url) => {
      let href = url;
      if (!href.startsWith("http")) href = "http://" + href;
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color:#007bff; text-decoration:underline;">${url}</a>`;
    });
    return clean.replace(/\n/g, "<br>");
  };

  if (loading) {
    return (
      <section
        className="projects-section"
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
          Loading Projects...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="projects-section">
        <h2 className="fancy-heading">PROJECTS</h2>
        <p style={{ color: "red" }}>{error}</p>
      </section>
    );
  }

  return (
    <section className="projects-section">
      <h2 className="fancy-heading">PROJECTS</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {projects.map((project) => {
          const currentIndex = mediaIndices[project.id] || 0;
          const media = project.media?.[currentIndex];

          const techArray = Array.isArray(project.technologies)
            ? project.technologies
            : typeof project.technologies === "string"
            ? project.technologies
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [];

          return (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="project-card"
            >
              <h3>{project.title}</h3>

              {media ? (
                media.type.startsWith("video") ? (
                  <video src={media.url} controls className="media" />
                ) : (
                  <img
                    src={media.url}
                    alt={`${project.title} preview`}
                    className="media"
                  />
                )
              ) : (
                <p>No media available</p>
              )}

              {/* Summary - full & center aligned */}
              <p
                className="summary"
                dangerouslySetInnerHTML={{
                  __html: formatDescription(
                    project.summary || project.description || ""
                  ),
                }}
              />

              {/* Technologies buttons */}
              <div className="tech-container">
                {techArray.length > 0 ? (
                  techArray.map((tech, idx) => (
                    <span key={idx} className="tech-tag">
                      {techIcons[tech] || "🔧"} {tech}
                    </span>
                  ))
                ) : (
                  <div className="no-tech">No technologies listed.</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedProject && (
        <div
          onClick={() => setSelectedProject(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              maxWidth: 800,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h2>{selectedProject.title}</h2>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginBottom: 20,
                justifyContent: "center",
              }}
            >
              {selectedProject.media?.length > 0 ? (
                selectedProject.media.map((item, i) =>
                  item.type.startsWith("video") ? (
                    <video
                      key={item.url}
                      controls
                      style={{
                        maxWidth: "48%",
                        maxHeight: 200,
                        borderRadius: 8,
                      }}
                      src={item.url}
                    />
                  ) : (
                    <img
                      key={item.url}
                      src={item.url}
                      alt={`${selectedProject.title} media ${i + 1}`}
                      style={{
                        maxWidth: "48%",
                        maxHeight: 200,
                        borderRadius: 8,
                        objectFit: "contain",
                      }}
                    />
                  )
                )
              ) : (
                <p>No media available</p>
              )}
            </div>

            <p
              style={{ whiteSpace: "pre-wrap" }}
              dangerouslySetInnerHTML={{
                __html: formatDescription(selectedProject.description),
              }}
            />

            {(Array.isArray(selectedProject.technologies) ||
              typeof selectedProject.technologies === "string") && (
              <div
                style={{
                  marginTop: 15,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  justifyContent: "center",
                }}
              >
                {(Array.isArray(selectedProject.technologies)
                  ? selectedProject.technologies
                  : selectedProject.technologies
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                ).map((tech, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#007bff",
                      borderRadius: 12,
                      padding: "6px 12px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      color: "#fff",
                      userSelect: "none",
                    }}
                  >
                    {techIcons[tech] || "🔧"} {tech}
                  </span>
                ))}
              </div>
            )}

            <button onClick={() => setSelectedProject(null)}>Close</button>
          </div>
        </div>
      )}

      <style>{`
        .projects-section {
          background-image: url(${backgroundImage});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          padding: 3rem 1rem;
          min-height: 100vh;
          width: 100%;
        }

        .fancy-heading {
          font-size: 3rem;
          text-align: center;
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

        /* Project Card styles */
        .project-card {
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 16px;
          background-color: #ffffffcc;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          cursor: pointer;
          transition:
            transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            color 0.4s ease,
            box-shadow 0.3s ease;
          color: #000; /* default text color */
          will-change: transform, color, box-shadow;
        }

        .project-card:hover {
          transform: scale(1.05);
          color: #007bff; /* highlight color */
          box-shadow: 0 8px 20px rgba(0, 123, 255, 0.3);
          animation: fadeInScale 0.3s ease forwards;
        }

        .project-card:hover .tech-tag {
          background-color: #0056b3; /* darker blue on hover */
          color: #fff;
          animation: fadeInBg 0.4s ease forwards;
        }

        .project-card:hover .summary {
          color: #007bff;
          transition: color 0.4s ease;
        }

        .project-card:hover h3 {
          color: #007bff;
          transition: color 0.4s ease;
        }

        /* Media styling */
        .media {
          width: 100%;
          border-radius: 8px;
          max-height: 180px;
          object-fit: cover;
          margin-bottom: 8px;
          transition: transform 0.3s ease;
        }

        /* Tech tags */
        .tech-tag {
          background-color: #007bff;
          color: #fff;
          border-radius: 12px;
          padding: 4px 10px;
          font-size: 0.75rem;
          font-weight: 600;
          user-select: none;
          margin-right: 6px;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .no-tech {
          margin-top: 10px;
          font-style: italic;
          color: #666;
        }

        /* Close button hover */
        button {
          margin-top: 20px;
          padding: 0.6rem 1.2rem;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          background-color: #dc3545;
          color: #fff;
          display: block;
          margin-left: auto;
          transition: background-color 0.4s ease, transform 0.3s ease;
          will-change: background-color, transform;
        }

        button:hover {
          background-color: #a71d2a; /* darker red */
          transform: scale(1.05);
          animation: buttonPulse 0.5s ease infinite alternate;
        }

        /* Animations */
        @keyframes fadeInScale {
          0% {
            opacity: 0.6;
            transform: scale(1);
          }
          100% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        @keyframes fadeInBg {
          0% {
            background-color: #007bff;
          }
          100% {
            background-color: #0056b3;
          }
        }

        @keyframes buttonPulse {
          0% {
            box-shadow: 0 0 8px #a71d2a;
          }
          100% {
            box-shadow: 0 0 20px #dc3545;
          }
        }
      `}</style>
    </section>
  );
};

export default Projects;
