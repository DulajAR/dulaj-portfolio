import React from "react";

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: "#222",
      color: "#fff",
      textAlign: "center",
      padding: "1rem",
      marginTop: "2rem"
    }}>
      <p>© {new Date().getFullYear()} Dulaj Ranasinghe. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
