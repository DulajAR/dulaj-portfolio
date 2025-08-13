import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import logo from "../assets/logo.png";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cvUrl, setCvUrl] = useState("");
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Fetch CV URL from Firestore
  useEffect(() => {
    const fetchCV = async () => {
      try {
        const cvsRef = collection(db, "cvs");
        const snapshot = await getDocs(cvsRef);
        if (!snapshot.empty) {
          const firstCV = snapshot.docs[0].data();
          setCvUrl(firstCV.cvUrl);
        } else {
          console.warn("No CV found in Firestore.");
        }
      } catch (err) {
        console.error("Error fetching CV:", err);
      }
    };
    fetchCV();
  }, []);

  // Nav links with Education added
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/education", label: "Education" }, // ✅ Added Education link
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
                >
                  {label}
                </Link>
              </li>
            ))}

            {cvUrl?.startsWith("https://") && (
              <li className="nav-item">
                <a
                  href={cvUrl}
                  download
                  className="cv-button"
                >
                  📄 Download CV
                </a>
              </li>
            )}
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

      {/* CSS Styles */}
      <style>{`
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
          color: #04090eff;
          user-select: none;
        }

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
          animation: slideIn 0.3s ease forwards;
        }

        @keyframes slideIn {
          from { width: 0; }
          to { width: 100%; }
        }

        .cv-button {
          background-color: #28a745;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: background-color 0.3s ease, transform 0.2s ease;
          font-weight: 500;
        }
        .cv-button:hover {
          background-color: #218838;
          transform: scale(1.05);
        }

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
        .hamburger.is-active .bar:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        .hamburger.is-active .bar:nth-child(2) {
          opacity: 0;
        }
        .hamburger.is-active .bar:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

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
          .nav-link,
          .cv-button {
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
