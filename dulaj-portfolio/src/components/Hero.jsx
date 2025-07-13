import React from "react";
import heroImage from "../assets/hero.png";

const Hero = () => {
  const heroSectionStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "400px",
    padding: "2rem",
    gap: "2rem",
  };

  const imageStyle = {
    width: "500px", // ⬅️ Adjust size
    height: "auto",
    objectFit: "contain",
    borderRadius: "10px",
  };

  const textStyle = {
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: "1.5rem",
    borderRadius: "12px",
    maxWidth: "500px",
  };

  return (
    <div style={heroSectionStyle}>
      <img src={heroImage} alt="Hero" style={imageStyle} />
      <div style={textStyle}>
        <h1>Hi, I'm Dulaj</h1>
        <p>Software Engineer | Full Stack Developer</p>
      </div>
    </div>
  );
};

export default Hero;
