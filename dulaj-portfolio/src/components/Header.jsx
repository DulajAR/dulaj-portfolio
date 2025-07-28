import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png"; // Adjust this path if needed

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/projects", label: "Projects" },
    { path: "/skills", label: "Skills" },
    { path: "/certificates", label: "Certificates" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="Dulaj Portfolio Logo" className="logo" />
          <span className="portfolio-name">DULAJ RANASINGHE</span>
        </div>

        <nav className={`nav ${isMobileMenuOpen ? "nav-open" : ""}`}>
          <ul className="nav-list">
            {navLinks.map(({ path, label }) => (
              <li key={path} className="nav-item">
                <Link
                  to={path}
                  className={`nav-link ${
                    location.pathname === path ? "active" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className={`hamburger ${isMobileMenuOpen ? "is-active" : ""}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </header>

      <style>{`
        /* Reset & base */
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, sans-serif;
          background-color: #f9f9f9;
        }
        a {
          text-decoration: none;
          color: inherit;
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background-color: #ffffff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        /* Logo */
        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo {
          height: 40px;
          width: auto;
        }
        .portfolio-name {
          font-weight: 700;
          font-size: 1.25rem;
          color: #007bff;
          user-select: none;
        }

        /* Navigation */
        .nav {
          display: flex;
          align-items: center;
        }
        .nav-list {
          display: flex;
          list-style: none;
          gap: 2rem;
          margin: 0;
          padding: 0;
        }
        .nav-item {}

        .nav-link {
          font-weight: 500;
          color: #333;
          position: relative;
          transition: color 0.3s ease;
        }
        .nav-link:hover,
        .nav-link.active {
          color: #007bff;
        }
        .nav-link.active::after {
          content: "";
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: #007bff;
          border-radius: 2px;
        }

        /* Hamburger */
        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 26px;
          height: 20px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 1100;
        }
        .hamburger:focus {
          outline: 2px solid #007bff;
          outline-offset: 2px;
        }
        .bar {
          height: 3px;
          width: 100%;
          background-color: #333;
          border-radius: 3px;
          transition: all 0.3s ease;
          transform-origin: 4px 0px;
        }
        /* Hamburger animation when active */
        .hamburger.is-active .bar:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        .hamburger.is-active .bar:nth-child(2) {
          opacity: 0;
        }
        .hamburger.is-active .bar:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        /* Responsive Mobile Menu */
        @media (max-width: 768px) {
          .nav {
            position: fixed;
            top: 0;
            right: 0;
            height: 100vh;
            width: 250px;
            background-color: #fff;
            flex-direction: column;
            padding-top: 5rem;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: -2px 0 8px rgba(0,0,0,0.1);
          }
          .nav.nav-open {
            transform: translateX(0);
          }
          .nav-list {
            flex-direction: column;
            gap: 1.5rem;
            padding-left: 2rem;
          }
          .nav-link {
            font-size: 1.2rem;
          }
          .hamburger {
            display: flex;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
