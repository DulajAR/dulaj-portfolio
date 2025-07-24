import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header id="header">
      <div className="header-left">
        <img src={logo} className="logo" alt="Dulaj Portfolio Logo" />
        <span className="portfolio-name">DULAJ RANASINGHE</span>
      </div>

      <nav>
        <ul id="navbar" className={isMobileMenuOpen ? "active" : ""}>
          <li>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={location.pathname === "/about" ? "active" : ""}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/projects"
              className={location.pathname === "/projects" ? "active" : ""}
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              to="/skills"
              className={location.pathname === "/skills" ? "active" : ""}
            >
              Skills
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={location.pathname === "/contact" ? "active" : ""}
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>

      <div id="mobile">
        <i id="bar" className="fas fa-bars" onClick={toggleMobileMenu}></i>
      </div>
    </header>
  );
};

export default Header;
