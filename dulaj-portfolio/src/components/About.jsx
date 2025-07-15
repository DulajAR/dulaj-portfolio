// src/components/About.jsx
import React from "react";

const About = () => {
  return (
    <section
      id="about"
      style={{
        padding: "3rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        maxWidth: "800px",
        margin: "2rem auto",
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6"
      }}
    >
      <h2 style={{ fontSize: "2rem", color: "#333", marginBottom: "1rem" }}>
        About Me
      </h2>
      <p style={{ color: "#555", marginBottom: "1rem" }}>
        Hi, I'm <strong>Dulaj Ranasinghe</strong>, a passionate and driven software engineer based in Sri Lanka. I specialize in building modern, responsive web applications using technologies like <strong>React, Node.js, Spring Boot, and MySQL</strong>.
      </p>
      <p style={{ color: "#555", marginBottom: "1rem" }}>
        I enjoy crafting clean and user-friendly interfaces, solving challenging problems, and constantly learning new tools and frameworks. Whether it's front-end development, back-end APIs, or full-stack applications — I’m always excited to bring ideas to life through code.
      </p>
      <p style={{ color: "#555", marginBottom: "1rem" }}>
        I hold a Diploma in Software Engineering from <strong>NIBM</strong>, and I’ve worked on several academic and personal projects involving web technologies, REST APIs, and database management systems.
      </p>
      <p style={{ color: "#555" }}>
        Outside of coding, I love <strong>traveling</strong>, listening to <strong>music</strong>, <strong>watching films</strong>, creating <strong>YouTube content</strong>, and exploring the world of <strong>ethical hacking</strong> and <strong>cybersecurity</strong>.
      </p>
    </section>
  );
};

export default About;
