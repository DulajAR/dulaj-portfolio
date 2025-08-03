import React, { useState, useEffect } from "react";
import heroImage from "../assets/hero.png";
import { motion } from "framer-motion";

const Hero = () => {
  const [sriLankaTime, setSriLankaTime] = useState("");
  const [worldTimes, setWorldTimes] = useState({});
  const [timeSpent, setTimeSpent] = useState(0);

  const sentences = [
    "A Full Stack Developer",
    "A Software Engineering Undergraduate",
    "A Web Developer",
    "A Programmer",
    "A YouTube Content Creator",
  ];

  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (index >= sentences.length) setIndex(0);

    if (subIndex === sentences[index].length + 1 && !deleting) {
      setTimeout(() => setDeleting(true), 1000);
      return;
    }

    if (subIndex === 0 && deleting) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % sentences.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => (deleting ? prev - 1 : prev + 1));
      setText(sentences[index].substring(0, subIndex));
    }, deleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [subIndex, index, deleting]);

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      const formatTime = (date, locale, options) =>
        date.toLocaleTimeString(locale, options);

      setSriLankaTime(
        formatTime(now, "en-LK", { timeZone: "Asia/Colombo", hour12: true })
      );

      setWorldTimes({
        "New York": formatTime(now, "en-US", {
          timeZone: "America/New_York",
          hour12: true,
        }),
        London: formatTime(now, "en-GB", {
          timeZone: "Europe/London",
          hour12: true,
        }),
        Tokyo: formatTime(now, "ja-JP", {
          timeZone: "Asia/Tokyo",
          hour12: true,
        }),
      });
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeSpent = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const heroSectionStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    height: "auto",
    padding: "2rem",
    gap: "2rem",
    backgroundColor: "#1e1e2f",
    color: "#fff",
    minHeight: "100vh",
  };

  const imageStyle = {
    width: "400px",
    height: "auto",
    objectFit: "contain",
    borderRadius: "10px",
  };

  const textStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: "1.5rem",
    borderRadius: "12px",
    maxWidth: "500px",
    fontSize: "1rem",
    flex: 1,
  };

  return (
    <motion.div
      style={heroSectionStyle}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.img
        src={heroImage}
        alt="Hero"
        style={imageStyle}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        whileHover={{ scale: 1.05 }}
      />

      <motion.div
        style={textStyle}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <h1>Hi, I'm Dulaj Ranasinghe</h1>
        <p style={{ minHeight: "2rem", fontSize: "1.5rem", fontWeight: "bold" }}>
          <span style={{ color: "#00d4ff" }}>{text}</span>
          <span className="cursor">|</span>
        </p>

        <hr style={{ margin: "1rem 0", borderColor: "#555" }} />

        {/* DIGITAL CLOCK */}
        <div className="digital-clock-box">
          <h3 className="digital-heading">🕒 Real-Time Clock</h3>
          <div className="clock-line">
            <span>Sri Lanka</span>
            <span>{sriLankaTime}</span>
          </div>
          {Object.entries(worldTimes).map(([location, time]) => (
            <div className="clock-line" key={location}>
              <span>{location}</span>
              <span>{time}</span>
            </div>
          ))}
        </div>

        <hr style={{ margin: "1rem 0", borderColor: "#555" }} />

        <motion.p
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          ⏱️ You’ve been here for <strong>{formatTimeSpent(timeSpent)}</strong>
        </motion.p>
      </motion.div>

      <style>{`
        .cursor {
          display: inline-block;
          width: 1px;
          background-color: #00d4ff;
          margin-left: 4px;
          animation: blink 1s step-start infinite;
        }

        @keyframes blink {
          50% {
            opacity: 0;
          }
        }

        .digital-clock-box {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid #00d4ff;
          border-radius: 12px;
          padding: 1rem;
          font-family: "Courier New", monospace;
          color: #00d4ff;
          box-shadow: 0 0 12px #00d4ff55;
          margin-bottom: 1rem;
        }

        .digital-heading {
          text-align: center;
          font-size: 1.2rem;
          margin-bottom: 1rem;
          text-shadow: 0 0 6px #00d4ff;
        }

        .clock-line {
          display: flex;
          justify-content: space-between;
          margin: 0.3rem 0;
          font-size: 1.1rem;
          letter-spacing: 1px;
        }
      `}</style>
    </motion.div>
  );
};

export default Hero;
