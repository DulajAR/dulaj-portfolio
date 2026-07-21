import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import backgroundImage from "../assets/about.png";
import { FaUser } from "react-icons/fa";

const sectionLabels = {
  intro: "Introduction",
  passion: "Passion",
  education: "Education",
  hobbies: "Hobbies",
};

const About = () => {
  const [aboutContent, setAboutContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const docRef = doc(db, "about", "profile");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setAboutContent(docSnap.data());
      } catch (error) {
        console.error("Error fetching about content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[var(--color-surface-dark)]">
        <div className="loading-spinner"><p className="text-slate-400 mt-4">Loading About...</p></div>
      </section>
    );
  }

  if (!aboutContent) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[var(--color-surface-dark)]">
        <p className="text-slate-400">No About content available.</p>
      </section>
    );
  }

  const entries = Object.entries(aboutContent);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 sm:py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }} />
      <div className="absolute inset-0 bg-[rgba(19,17,29,0.8)] backdrop-blur-sm" />

      {/* Decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl" />

      <div className="relative z-10" style={{ width: "100%", maxWidth: "56rem", marginLeft: "auto", marginRight: "auto", paddingLeft: "1.5rem", paddingRight: "1.5rem", textAlign: "center" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: "4rem" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/25"
          >
            <FaUser className="text-white text-2xl" />
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
            <span className="gradient-text">About Me</span>
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem", maxWidth: "28rem", margin: "0 auto", textAlign: "center" }}>
            Who I am and what drives me forward
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full mx-auto mt-6" />
        </motion.div>

        {/* Content cards */}
        <div className="grid gap-4 sm:gap-5 text-left">
          {entries.map(([key, value], i) => {
            if (!value) return null;
            const label = sectionLabels[key] || key.replace(/_/g, " ");

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative"
              >
                {/* Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-cyan-400/10 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500" />

                <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5 sm:p-6 lg:p-8 hover:bg-white/[0.07] hover:border-white/[0.12] transition-all duration-500">
                  <div className="flex items-start gap-4">
                    {/* Accent bar */}
                    <div className="w-1 self-stretch bg-gradient-to-b from-indigo-500 to-cyan-400 rounded-full flex-shrink-0 group-hover:shadow-lg group-hover:shadow-indigo-500/20 transition-shadow duration-500" />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-cyan-400/20 border border-white/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-indigo-400 font-bold">{i + 1}</span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-indigo-400 uppercase tracking-wider group-hover:text-indigo-300 transition-colors duration-300">
                          {label}
                        </h3>
                      </div>
                      <p className="text-sm sm:text-base text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                        {value}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;
