// src/components/Projects.jsx
import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import DOMPurify from "dompurify";
import backgroundImage from "../assets/project.png";

// Tech icons
const techIcons = {
  React: "⚛️",
  "React + Vite": "⚛️✨",
  Firebase: "🔥",
  Cloudinary: "☁️",
  JavaScript: "🟨",
};

// ---------- Helpers ----------
const ensureHttp = (url) => /^https?:\/\//i.test(url) ? url : `http://${url}`;
const displayUrl = (href) => {
  try {
    const u = new URL(href);
    const path = u.pathname === "/" ? "" : u.pathname;
    const short = `${u.hostname}${path}`.replace(/\/$/, "");
    return short.length > 60 ? short.slice(0, 57) + "..." : short;
  } catch {
    return href.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
};

// ---------- Render sanitized and clickable HTML ----------
const RenderDescription = ({ text }) => {
  if (!text) return null;

  // Sanitize raw HTML from Firebase
  let clean = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: ["b","i","em","strong","p","br","ul","ol","li","a","span","div"],
    ALLOWED_ATTR: ["href", "target", "rel", "style"]
  });

  // Regex to replace plain URLs with clickable links
  const urlRegex = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/gi;
  clean = clean.replace(urlRegex, (url) => {
    const href = ensureHttp(url);
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${displayUrl(href)}</a>`;
  });

  return <span dangerouslySetInnerHTML={{ __html: clean }} />;
};

// ---------- Projects Component ----------
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [mediaIndices, setMediaIndices] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects from Firebase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, "projects"));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

  // Auto-rotate media
  useEffect(() => {
    const interval = setInterval(() => {
      setMediaIndices(prev => {
        const newIndices = { ...prev };
        projects.forEach(p => {
          const mediaLength = p.media?.length || 0;
          if (mediaLength > 1) {
            newIndices[p.id] = (newIndices[p.id] || 0) + 1;
            if (newIndices[p.id] >= mediaLength) newIndices[p.id] = 0;
          }
        });
        return newIndices;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [projects]);

  if (loading) return (
    <section className="projects-section" style={{ backgroundColor: "#0f172a", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <img src="https://i.gifer.com/ZKZg.gif" alt="Loading..." style={{ width: "120px", height: "120px" }} />
      <p style={{ color: "#fff", marginTop: "1rem", fontSize: "1.2rem" }}>Loading Projects...</p>
    </section>
  );

  if (error) return (
    <section className="projects-section">
      <h2 className="fancy-heading">PROJECTS</h2>
      <p style={{ color: "red" }}>{error}</p>
    </section>
  );

  return (
    <section
      className="projects-section"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "3rem 1rem",
        minHeight: "100vh",
      }}
    >
      <h2 className="fancy-heading">PROJECTS</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        {projects.map(project => {
          const currentIndex = mediaIndices[project.id] || 0;
          const media = project.media?.[currentIndex];
          const techArray = Array.isArray(project.technologies)
            ? project.technologies
            : typeof project.technologies === "string"
            ? project.technologies.split(",").map(t => t.trim()).filter(Boolean)
            : [];

          return (
            <div key={project.id} className="project-card" onClick={() => setSelectedProject(project)}>
              <h3>{project.title}</h3>
              {media ? (media.type?.startsWith?.("video") ? <video src={media.url} controls className="media" /> : <img src={media.url} alt={`${project.title} preview`} className="media" />) : <p>No media available</p>}
              <div className="summary" onClick={e => e.stopPropagation()}>
                <RenderDescription text={project.summary || project.description || ""} />
              </div>
              <div className="tech-container">
                {techArray.map((tech, idx) => <span key={idx} className="tech-tag">{techIcons[tech] || "🔧"} {tech}</span>)}
              </div>
            </div>
          );
        })}
      </div>

      {selectedProject && (
        <div onClick={() => setSelectedProject(null)} style={{ position: "fixed", top:0,left:0,width:"100vw",height:"100vh",backgroundColor:"rgba(0,0,0,0.7)",display:"flex",justifyContent:"center",alignItems:"center",padding:20,zIndex:9999 }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor:"white",padding:20,borderRadius:10,maxWidth:800,maxHeight:"90vh",overflowY:"auto" }}>
            <h2>{selectedProject.title}</h2>
            <div style={{ display:"flex",flexWrap:"wrap",gap:10,marginBottom:20,justifyContent:"center" }}>
              {selectedProject.media?.map((item,i) => item.type?.startsWith?.("video") ? <video key={item.url||i} src={item.url} controls style={{ maxWidth:"48%", maxHeight:200, borderRadius:8 }} /> : <img key={item.url||i} src={item.url} alt={`${selectedProject.title} media ${i+1}`} style={{ maxWidth:"48%", maxHeight:200, borderRadius:8, objectFit:"contain" }} />)}
            </div>
            <div className="modal-description">
              <RenderDescription text={selectedProject.description || ""} />
            </div>
            <div style={{ marginTop:15, display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
              {(Array.isArray(selectedProject.technologies) ? selectedProject.technologies : (selectedProject.technologies||"").split(",").map(t=>t.trim()).filter(Boolean)).map((tech,idx) => <span key={idx} style={{ display:"flex", alignItems:"center", backgroundColor:"#007bff", borderRadius:12, padding:"6px 12px", fontSize:"0.85rem", fontWeight:"600", color:"#fff", userSelect:"none" }}>{techIcons[tech] || "🔧"} {tech}</span>)}
            </div>
            <button onClick={() => setSelectedProject(null)}>Close</button>
          </div>
        </div>
      )}

      <style>{`
        .fancy-heading { font-size:3rem; text-align:center; text-transform:uppercase; color:#00ffff; letter-spacing:2px; margin-bottom:2rem; position:relative; animation:textFadeSlideUp 0.6s ease forwards; text-shadow:0 0 8px #00ffff, 0 0 16px #00ffff; }
        .fancy-heading::after { content:""; display:block; width:60px; height:3px; margin:10px auto 0; background-color:#00ffff; border-radius:2px; animation:underlineGrow 0.6s ease forwards; }
        @keyframes textFadeSlideUp { 0%{opacity:0;transform:translateY(20px);}100%{opacity:1;transform:translateY(0);} }
        @keyframes underlineGrow { from{width:0;} to{width:60px;} }
        .project-card { border:1px solid #ddd; border-radius:10px; padding:16px; background-color:#ffffffcc; box-shadow:0 2px 8px rgba(0,0,0,0.1); cursor:pointer; transition: transform 0.3s ease, box-shadow 0.3s ease; color:#000; }
        .project-card:hover { transform:scale(1.05); box-shadow:0 8px 20px rgba(0,123,255,0.3); }
        .media { width:100%; border-radius:8px; max-height:180px; object-fit:cover; margin-bottom:8px; }
        .tech-tag { background-color:#007bff; color:#fff; border-radius:12px; padding:4px 10px; font-size:0.75rem; font-weight:600; margin-right:6px; }
        .summary a, .modal-description a { color:#007bff; text-decoration:underline; }
        button { margin-top:20px; padding:0.6rem 1.2rem; border-radius:6px; border:none; cursor:pointer; background-color:#dc3545; color:#fff; }
        button:hover { background-color:#a71d2a; transform:scale(1.05); }
      `}</style>
    </section>
  );
};

export default Projects;
