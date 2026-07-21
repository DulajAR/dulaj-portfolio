import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { FaBolt } from "react-icons/fa";

const getInitials = (name) => {
  if (!name) return "?";
  return name.substring(0, 2).toUpperCase();
};

const gradients = [
  "from-indigo-500 to-cyan-400",
  "from-purple-500 to-pink-400",
  "from-emerald-500 to-teal-400",
  "from-orange-500 to-amber-400",
  "from-rose-500 to-red-400",
  "from-sky-500 to-blue-400",
  "from-fuchsia-500 to-purple-400",
  "from-lime-500 to-green-400",
];

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const snapshot = await getDocs(collection(db, "skills"));
        setSkills(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const handleImgError = (id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[var(--color-surface-dark)]">
        <div className="loading-spinner"><p className="text-slate-400 mt-4">Loading Skills...</p></div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[var(--color-surface-dark)] py-20 sm:py-24 relative overflow-hidden">
      <div className="absolute top-40 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-0 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl" />

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
            <FaBolt className="text-white text-2xl" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
            <span className="gradient-text">Skills</span>
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem", maxWidth: "28rem", margin: "0 auto", textAlign: "center" }}>
            Technologies and tools I work with
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full mx-auto mt-6" />
        </motion.div>

        {skills.length === 0 ? (
          <p className="text-slate-400 text-center">No skills added yet.</p>
        ) : (
          <div style={{ maxWidth: "56rem", margin: "0 auto", textAlign: "center" }}>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
              {skills.map((skill, idx) => {
                const gradient = gradients[idx % gradients.length];
                const hasImage = skill.imageUrl && !imgErrors[skill.id];

                return (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    whileHover={{ y: -8, scale: 1.05 }}
                    className="group relative"
                  >
                    {/* Glow on hover */}
                    <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-2xl opacity-0 group-hover:opacity-10 blur-lg transition-opacity duration-500`} />

                    <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center gap-3 hover:bg-white/[0.07] hover:border-white/[0.12] transition-all duration-500 cursor-default">
                      {/* Icon */}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
                        {hasImage ? (
                          <img
                            src={skill.imageUrl}
                            alt={skill.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                            onError={() => handleImgError(skill.id)}
                          />
                        ) : (
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                            <span className="text-sm sm:text-base font-bold text-white">
                              {getInitials(skill.name)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Name */}
                      <p className="text-[10px] sm:text-xs font-semibold text-slate-400 text-center group-hover:text-white transition-colors duration-300 leading-tight">
                        {skill.name}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
