import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [mediaIndices, setMediaIndices] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects from Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, "projects"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
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

  // Slideshow: Change image every 5s
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
    return <section id="projects" style={{ textAlign: "center", padding: "2rem" }}><h2>Projects</h2><p>Loading...</p></section>;
  }

  if (error) {
    return <section id="projects" style={{ textAlign: "center", padding: "2rem" }}><h2>Projects</h2><p style={{ color: "red" }}>{error}</p></section>;
  }

  return (
    <section id="projects" style={{ padding: "2rem", maxWidth: "1200px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Projects</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {projects.map((project) => {
          const currentIndex = mediaIndices[project.id] || 0;
          const media = project.media?.[currentIndex];

          return (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "16px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{project.title}</h3>

              {media ? (
                media.type.startsWith("video") ? (
                  <video
                    src={media.url}
                    controls
                    style={{ width: "100%", borderRadius: 8, maxHeight: 180 }}
                  />
                ) : (
                  <img
                    src={media.url}
                    alt={`${project.title} preview`}
                    style={{ width: "100%", borderRadius: 8, objectFit: "cover", maxHeight: 180 }}
                  />
                )
              ) : (
                <p>No media available</p>
              )}

              <p
                style={{ marginTop: 10, fontSize: "0.9rem" }}
                dangerouslySetInnerHTML={{
                  __html: formatDescription(project.description?.slice(0, 150) + "..."),
                }}
              />
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
                      style={{ maxWidth: "48%", maxHeight: 200, borderRadius: 8 }}
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

            <button
              onClick={() => setSelectedProject(null)}
              style={{
                marginTop: 20,
                padding: "0.6rem 1.2rem",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                backgroundColor: "#dc3545",
                color: "#fff",
                display: "block",
                marginLeft: "auto",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
