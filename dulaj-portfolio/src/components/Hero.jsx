import React, { useState, useEffect } from "react";
import heroImage from "../assets/hero.png";
import { motion } from "framer-motion";

const Hero = () => {
  const [sriLankaTime, setSriLankaTime] = useState("");
  const [worldTimes, setWorldTimes] = useState({});
  const [timeSpent, setTimeSpent] = useState(0); // seconds

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
        <h1>Hi, I'm Dulaj</h1>
        <p>Software Engineer | Full Stack Developer</p>

        <hr style={{ margin: "1rem 0", borderColor: "#555" }} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <h3>🕒 Current Time</h3>
          <p>
            <strong>Sri Lanka:</strong> {sriLankaTime}
          </p>
          {Object.entries(worldTimes).map(([location, time]) => (
            <p key={location}>
              <strong>{location}:</strong> {time}
            </p>
          ))}
        </motion.div>

        <hr style={{ margin: "1rem 0", borderColor: "#555" }} />

        <motion.p
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          ⏱️ You’ve been here for{" "}
          <strong>{formatTimeSpent(timeSpent)}</strong>
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Hero;
