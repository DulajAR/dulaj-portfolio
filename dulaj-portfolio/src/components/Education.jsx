import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { FaGraduationCap, FaCalendarAlt } from "react-icons/fa";

const statusConfig = {
  Completed: { bg: "from-emerald-500/20 to-emerald-500/5", text: "text-emerald-400", dot: "bg-emerald-400", label: "Completed" },
  Following: { bg: "from-blue-500/20 to-blue-500/5", text: "text-blue-400", dot: "bg-blue-400", label: "Following" },
  Dropped: { bg: "from-red-500/20 to-red-500/5", text: "text-red-400", dot: "bg-red-400", label: "Dropped" },
};

const getInitials = (name) => {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase();
};

const Education = () => {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => {
    const fetchEducations = async () => {
      try {
        const q = query(collection(db, "education"), orderBy("order", "asc"));
        const snapshot = await getDocs(q);
        setEducations(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching education:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEducations();
  }, []);

  const handleImgError = (id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[var(--color-surface-dark)]">
        <div className="loading-spinner"><p className="text-slate-400 mt-4">Loading Education...</p></div>
      </section>
    );
  }

  return (
    <section
      className="min-h-screen bg-[var(--color-surface-dark)] py-20 sm:py-24 relative overflow-hidden"
      style={{ textAlign: "center" }}
    >
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl" />

      <div className="relative z-10" style={{ width: "100%", maxWidth: "48rem", marginLeft: "auto", marginRight: "auto", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
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
            <FaGraduationCap className="text-white text-2xl" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
            <span className="gradient-text">My Education</span>
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem", maxWidth: "28rem", margin: "0 auto", textAlign: "center" }}>
            Academic journey and qualifications that shaped my career
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full mx-auto mt-6" />
        </motion.div>

        {/* Timeline */}
        <div style={{ position: "relative", textAlign: "left" }}>
          {/* Vertical line */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "23px", width: "1px", background: "linear-gradient(to bottom, rgba(99,102,241,0.6), rgba(34,211,238,0.4), transparent)" }} />

          {/* Pulsing glow */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "23px", width: "1px", overflow: "hidden" }}>
            <motion.div
              style={{ width: "100%", height: "96px", background: "linear-gradient(to bottom, transparent, rgba(129,140,248,0.3), transparent)" }}
              animate={{ y: ["-100%", "800%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="space-y-5 sm:space-y-7">
            {educations.map((edu, index) => {
              const sc = statusConfig[edu.status] || statusConfig.Following;
              const hasLogo = edu.logoUrl && !imgErrors[edu.id];

              return (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  style={{ position: "relative", paddingLeft: "60px" }}
                >
                  {/* Timeline dot */}
                  <div style={{ position: "absolute", top: "28px", left: "19px", zIndex: 10 }}>
                    <div className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ${sc.dot}`} style={{ boxShadow: "0 0 0 4px var(--color-surface-dark), 0 0 12px rgba(99,102,241,0.3)" }} />
                    <div className={`absolute inset-0 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ${sc.dot} animate-ping opacity-25`} />
                  </div>

                  {/* Card */}
                  <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5 sm:p-6 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-500 group-hover:shadow-xl group-hover:shadow-indigo-500/5">
                    <div className="flex items-start gap-4 sm:gap-5">
                      {/* University Logo */}
                      <div className="flex-shrink-0">
                        {hasLogo ? (
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-500">
                            <img
                              src={edu.logoUrl}
                              alt={edu.university}
                              className="w-full h-full object-cover"
                              onError={() => handleImgError(edu.id)}
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-400/20 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                            <span className="text-lg sm:text-xl font-bold text-indigo-400">
                              {getInitials(edu.university)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors duration-300 leading-tight mb-1">
                          {edu.university}
                        </h3>
                        {edu.field && (
                          <p className="text-slate-400 text-xs sm:text-sm mb-3 group-hover:text-slate-300 transition-colors">
                            {edu.field}
                          </p>
                        )}

                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gradient-to-r ${sc.bg} ${sc.text} border border-white/5`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                            {sc.label}
                          </span>

                          {(edu.startYear || edu.endYear) && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                              <FaCalendarAlt className="text-[9px] text-slate-600" />
                              {edu.startYear || "—"}
                              {edu.startYear && edu.endYear && " — "}
                              {edu.endYear || "Present"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* End dot */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ position: "absolute", bottom: "-12px", left: "20px", zIndex: 10 }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-slate-600" style={{ boxShadow: "0 0 0 3px var(--color-surface-dark)" }} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Education;
