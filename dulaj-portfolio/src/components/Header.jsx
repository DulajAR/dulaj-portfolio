import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const navLinks = [
  { path: "/", label: "Home", icon: "🏠" },
  { path: "/about", label: "About", icon: "👤" },
  { path: "/education", label: "Education", icon: "🎓" },
  { path: "/projects", label: "Projects", icon: "💻" },
  { path: "/skills", label: "Skills", icon: "⚡" },
  { path: "/certificates", label: "Certificates", icon: "🏆" },
  { path: "/contact", label: "Contact", icon: "✉️" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cvUrl, setCvUrl] = useState("");
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const cvsRef = collection(db, "cvs");
        const snapshot = await getDocs(cvsRef);
        if (!snapshot.empty) {
          setCvUrl(snapshot.docs[0].data().cvUrl);
        }
      } catch (err) {
        console.error("Error fetching CV:", err);
      }
    };
    fetchCV();
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0d0b1a]/95 shadow-[0_4px_30px_rgba(0,0,0,0.4)] border-b border-indigo-500/20"
          : "bg-[#0d0b1a]/70 border-b border-white/5"
      }`}
      style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-500/30">
            D
          </div>
          <span className="font-bold text-lg text-white tracking-tight hidden sm:block">
            Dulaj<span className="text-indigo-400">.</span>
          </span>
        </Link>

        {/* Desktop Nav - Each link as separate pill */}
        <nav className="hidden xl:flex items-center gap-2">
          {navLinks.map(({ path, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`
                  relative px-4 py-2 text-[13px] font-bold uppercase tracking-wider rounded-full
                  border transition-all duration-300
                  ${
                    isActive
                      ? "text-white bg-gradient-to-r from-indigo-600 to-cyan-500 border-transparent shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                      : "text-slate-300 bg-white/5 border-white/10 hover:text-white hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                  }
                `}
              >
                {label}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="w-px h-6 bg-white/10 mx-1" />

          {cvUrl?.startsWith("https://") && (
            <a
              href={cvUrl}
              download
              className="px-5 py-2 text-[13px] font-bold uppercase tracking-wider rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] transition-all duration-300 hover:scale-105 border border-transparent"
            >
              Download CV
            </a>
          )}
        </nav>

        {/* Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="xl:hidden relative w-11 h-11 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-1.5 w-5">
            <span
              className={`block h-[2px] bg-white rounded-full transition-all duration-300 origin-center ${
                isOpen ? "rotate-45 translate-y-[5px]" : ""
              }`}
            />
            <span
              className={`block h-[2px] bg-white rounded-full transition-all duration-300 ${
                isOpen ? "opacity-0 scale-0" : ""
              }`}
            />
            <span
              className={`block h-[2px] bg-white rounded-full transition-all duration-300 origin-center ${
                isOpen ? "-rotate-45 -translate-y-[5px]" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu - Each link as separate card */}
      <div
        className={`xl:hidden transition-all duration-500 overflow-hidden ${
          isOpen ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 pt-2 border-t border-white/5">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {navLinks.map(({ path, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold tracking-wide
                    border transition-all duration-200
                    ${
                      isActive
                        ? "text-white bg-gradient-to-r from-indigo-600 to-cyan-500 border-transparent shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                        : "text-slate-300 bg-white/5 border-white/10 hover:text-white hover:bg-white/10"
                    }
                  `}
                >
                  {label}
                </Link>
              );
            })}
          </div>
          {cvUrl?.startsWith("https://") && (
            <a
              href={cvUrl}
              download
              className="block text-center py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 text-white font-bold text-sm tracking-wide border border-transparent"
            >
              Download CV
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
