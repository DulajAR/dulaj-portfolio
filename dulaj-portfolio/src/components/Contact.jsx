// src/components/Contact.jsx
import React from "react";

const Contact = () => {
  return (
    <section id="contact" style={{ padding: "2rem" }}>
      <h2>Contact Me</h2>
      <p>
        Email:{" "}
        <a href="mailto:dulajayeshmantha91@gmail.com">
          dulajayeshmantha91@gmail.com
        </a>
      </p>
      <p>
        LinkedIn:{" "}
        <a
          href="https://www.linkedin.com/in/dulaj-ranasinghe-2275a82b2/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.linkedin.com/in/dulaj-ranasinghe-2275a82b2/
        </a>
      </p>
    </section>
  );
};

export default Contact;
