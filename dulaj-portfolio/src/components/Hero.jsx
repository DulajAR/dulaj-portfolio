import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import heroImage from "../assets/hero.png";

const roles = [
  "A Full Stack Developer",
  "A Software Engineering Undergraduate",
  "A Web Developer",
  "A Programmer",
  "A YouTube Content Creator",
];

const Hero = () => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [worldTimes, setWorldTimes] = useState({});
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    if (subIndex === roles[index].length + 1 && !deleting) {
      setTimeout(() => setDeleting(true), 1500);
      return;
    }
    if (subIndex === 0 && deleting) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % roles.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => (deleting ? prev - 1 : prev + 1));
      setText(roles[index].substring(0, subIndex));
    }, deleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [subIndex, index, deleting]);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const fmt = (tz) =>
        now.toLocaleTimeString("en-US", {
          timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
        });
      setWorldTimes({
        "Sri Lanka": fmt("Asia/Colombo"),
        "New York": fmt("America/New_York"),
        London: fmt("Europe/London"),
        Tokyo: fmt("Asia/Tokyo"),
      });
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const i = setInterval(() => setTimeSpent((p) => p + 1), 1000);
    return () => clearInterval(i);
  }, []);

  const formatTime = (s) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--color-surface-dark)] pt-24 pb-10">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-500/10 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-56 sm:w-80 h-56 sm:h-80 bg-cyan-400/10 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite_1s]" />
      </div>

      <div className="relative z-10 section-center">
        <div className="flex flex-col items-center gap-10 sm:gap-12 lg:gap-16">
          {/* Image */}
          <motion.div
            className="w-full flex justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative w-full max-w-[280px] sm:max-w-sm lg:max-w-md">
              <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-3xl blur-2xl sm:blur-3xl opacity-15 animate-[glow-pulse_4s_ease-in-out_infinite]" />
              <div className="absolute -inset-2 bg-gradient-to-br from-indigo-500/20 to-cyan-400/20 rounded-3xl blur-lg sm:blur-xl" />
              <img src={heroImage} alt="Dulaj Ranasinghe" className="relative w-full h-auto rounded-2xl sm:rounded-3xl border-2 border-white/10 shadow-2xl shadow-indigo-500/10 object-contain" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div className="w-full max-w-2xl mx-auto text-center" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <motion.p className="text-indigo-400 font-mono text-xs sm:text-sm mb-3 sm:mb-4 tracking-widest uppercase" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              Welcome to my portfolio
            </motion.p>

            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold mb-3 sm:mb-4 leading-tight">
              Hi, I'm <span className="gradient-text">Dulaj Ranasinghe</span>
            </h1>

            <div className="h-10 sm:h-12 mb-5 sm:mb-6 flex items-center justify-center">
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-300">
                <span className="text-cyan-400">{text}</span>
                <span className="inline-block w-[2px] h-5 sm:h-6 bg-cyan-400 ml-1 animate-[blink_1s_step-end_infinite] align-middle" />
              </p>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-6 sm:my-8" />

            {/* World Clock */}
            <div className="glass rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6" style={{ maxWidth: "22rem", margin: "0 auto" }}>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Live World Clocks</span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {Object.entries(worldTimes).map(([city, time]) => (
                  <div key={city} className="flex items-center justify-between bg-white/5 rounded-lg px-2.5 sm:px-3 py-2">
                    <span className="text-[10px] sm:text-xs text-slate-400">{city}</span>
                    <span className="text-xs sm:text-sm font-mono text-white">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 font-mono text-center">
              Time spent here: <span className="text-indigo-400">{formatTime(timeSpent)}</span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
