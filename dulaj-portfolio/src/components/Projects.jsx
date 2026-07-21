import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import DOMPurify from "dompurify";
import { FaCode, FaExternalLinkAlt } from "react-icons/fa";

const techIcons = {
  React: "\u269B\uFE0F",
  "React + Vite": "\u269B\uFE0F\u2728",
  Firebase: "\uD83D\uDD25",
  Cloudinary: "\u2601\uFE0F",
  JavaScript: "\uD83D\uDFE8",
};

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

const RenderDescription = ({ text }) => {
  if (!text) return null;
  let clean = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br", "ul", "ol", "li", "a", "span", "div"],
    ALLOWED_ATTR: ["href", "target", "rel", "style"],
  });
  const urlRegex = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/gi;
  clean = clean.replace(urlRegex, (url) => {
    const href = ensureHttp(url);
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 underline">${displayUrl(href)}</a>`;
  });
  return <span dangerouslySetInnerHTML={{ __html: clean }} />;
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [mediaIndices, setMediaIndices] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snapshot = await getDocs(collection(db, "projects"));
        setProjects(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMediaIndices((prev) => {
        const next = { ...prev };
        projects.forEach((p) => {
          const len = p.media?.length || 0;
          if (len > 1) next[p.id] = ((next[p.id] || 0) + 1) % len;
        });
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [projects]);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[var(--color-surface-dark)]">
        <div className="loading-spinner"><p className="text-slate-400 mt-4">Loading Projects...</p></div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[var(--color-surface-dark)] py-20 sm:py-24 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl" />

      <div className="section-center relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/25"
          >
            <FaCode className="text-white text-2xl" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
            <span className="gradient-text">Projects</span>
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem", maxWidth: "28rem", margin: "0 auto", textAlign: "center" }}>
            A showcase of my recent work and creative experiments
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full mx-auto mt-6" />
        </motion.div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6" style={{ maxWidth: "72rem", margin: "0 auto" }}>
          {projects.map((project, idx) => {
            const currentIndex = mediaIndices[project.id] || 0;
            const media = project.media?.[currentIndex];
            const techArray = Array.isArray(project.technologies)
              ? project.technologies
              : typeof project.technologies === "string"
              ? project.technologies.split(",").map((t) => t.trim()).filter(Boolean)
              : [];

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => setSelectedProject(project)}
                className="group relative cursor-pointer"
              >
                {/* Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-cyan-400/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />

                <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl overflow-hidden hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10">
                  {/* Media */}
                  <div className="relative h-48 sm:h-52 overflow-hidden">
                    {media ? (
                      media.type?.startsWith?.("video") ? (
                        <video src={media.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <img src={media.url} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      )
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-cyan-400/20 flex items-center justify-center">
                        <FaCode className="text-4xl text-indigo-400/40" />
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-dark)] via-transparent to-transparent opacity-70" />

                    {/* View button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold flex items-center gap-2">
                        <FaExternalLinkAlt className="text-[10px]" />
                        View Details
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mb-4 line-clamp-2">
                      <RenderDescription text={project.summary || project.description || ""} />
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {techArray.slice(0, 4).map((tech, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-indigo-500/10 to-cyan-400/10 text-[10px] sm:text-xs font-medium text-slate-300 border border-white/5">
                          {techIcons[tech] || "\uD83D\uDD27"} {tech}
                        </span>
                      ))}
                      {techArray.length > 4 && (
                        <span className="px-2.5 py-1 rounded-lg bg-white/5 text-[10px] sm:text-xs text-slate-500">+{techArray.length - 4}</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="bg-[var(--color-surface)] border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-[var(--color-surface)]/90 backdrop-blur-sm border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-lg sm:text-xl font-bold text-white">{selectedProject.title}</h2>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/20 transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 sm:p-8">
                {/* Media Gallery */}
                {selectedProject.media?.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-6">
                    {selectedProject.media.map((item, i) =>
                      item.type?.startsWith?.("video") ? (
                        <video key={item.url || i} src={item.url} controls className="w-full sm:w-[48%] rounded-xl max-h-60 object-contain bg-black/20" />
                      ) : (
                        <img key={item.url || i} src={item.url} alt={`${selectedProject.title} ${i + 1}`} className="w-full sm:w-[48%] rounded-xl max-h-60 object-contain" />
                      )
                    )}
                  </div>
                )}

                {/* Description */}
                <div className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                  <RenderDescription text={selectedProject.description || ""} />
                </div>

                {/* Tech Stack */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(selectedProject.technologies) ? selectedProject.technologies : (selectedProject.technologies || "").split(",").map((t) => t.trim()).filter(Boolean)).map((tech, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500/15 to-cyan-400/15 text-xs sm:text-sm font-medium text-white border border-white/10">
                        {techIcons[tech] || "\uD83D\uDD27"} {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
