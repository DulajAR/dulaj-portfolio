import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const navItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "About",
    path: "/admin/about",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="5" />
        <path d="M20 21a8 8 0 0 0-16 0" />
      </svg>
    ),
  },
  {
    label: "Projects",
    path: "/admin/projects",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    label: "Skills",
    path: "/admin/skills",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    label: "Certificates",
    path: "/admin/certificates",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
  },
  {
    label: "Education",
    path: "/admin/education",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 6 3 12 0v-5" />
      </svg>
    ),
  },
  {
    label: "Contact",
    path: "/admin/contact",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "Messages",
    path: "/admin/messages",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

const AdminSidebar = ({ mobileOpen, onMobileClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [time, setTime] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "messages"), (snapshot) => {
      let unread = 0;
      snapshot.forEach((doc) => {
        if (doc.data().isRead === false) unread++;
      });
      setUnreadCount(unread);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      const s = now.getSeconds();
      const colon = s % 2 === 0 ? ":" : " ";
      setTime(`${h}${colon}${m}`);
    };
    updateClock();
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (isMobile && onMobileClose) onMobileClose();
  };

  const isActive = (path) => location.pathname === path;
  const showCollapsed = !isMobile && collapsed;

  const sidebarWidth = isMobile ? 260 : collapsed ? 72 : 260;

  return (
    <>
      {isMobile && mobileOpen && (
        <div className="admin-sidebar-backdrop" onClick={onMobileClose} />
      )}

      <aside
        className="admin-sidebar"
        style={{
          width: sidebarWidth,
          transform: isMobile ? (mobileOpen ? "translateX(0)" : "translateX(-100%)") : "translateX(0)",
        }}
      >
        <div style={sidebarStyles.top}>
          <div style={{ ...sidebarStyles.logo, justifyContent: showCollapsed ? "center" : "flex-start" }}>
            {!showCollapsed && <span style={sidebarStyles.logoText}>Admin Panel</span>}
            {!isMobile && (
              <button
                onClick={() => setCollapsed(!collapsed)}
                style={sidebarStyles.collapseBtn}
                title={collapsed ? "Expand" : "Collapse"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {collapsed ? <path d="M9 18l6-6-6-6" /> : <path d="M15 18l-6-6 6-6" />}
                </svg>
              </button>
            )}
            {isMobile && (
              <button onClick={onMobileClose} style={sidebarStyles.collapseBtn} title="Close menu">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          <nav style={sidebarStyles.nav}>
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  style={{
                    ...sidebarStyles.navItem,
                    ...(active ? sidebarStyles.navItemActive : {}),
                    justifyContent: showCollapsed ? "center" : "flex-start",
                    padding: showCollapsed ? "10px 0" : "10px 14px",
                  }}
                  title={showCollapsed ? item.label : undefined}
                >
                  <span style={{ ...sidebarStyles.navIcon, color: active ? "#fff" : "#a5b4fc" }}>
                    {item.icon}
                  </span>
                  {!showCollapsed && (
                    <>
                      <span style={{ ...sidebarStyles.navLabel, color: active ? "#fff" : "#c7d2fe" }}>
                        {item.label}
                      </span>
                      {item.label === "Contact" && unreadCount > 0 && (
                        <span style={sidebarStyles.badge}>{unreadCount}</span>
                      )}
                    </>
                  )}
                  {showCollapsed && item.label === "Contact" && unreadCount > 0 && (
                    <span style={sidebarStyles.badgeDot} />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div style={sidebarStyles.bottom}>
          <div style={{ ...sidebarStyles.clockWrap, justifyContent: showCollapsed ? "center" : "flex-start" }}>
            <div style={sidebarStyles.clock}>{time}</div>
            {!showCollapsed && <span style={sidebarStyles.clockLabel}>Local Time</span>}
          </div>
          <button
            onClick={handleLogout}
            style={{
              ...sidebarStyles.logoutBtn,
              justifyContent: showCollapsed ? "center" : "flex-start",
              padding: showCollapsed ? "10px 0" : "10px 14px",
            }}
            title="Logout"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#fca5a5", flexShrink: 0 }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {!showCollapsed && <span style={{ color: "#fca5a5" }}>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

const sidebarStyles = {
  top: {
    display: "flex",
    flexDirection: "column",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    padding: "20px 14px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    gap: 10,
  },
  logoText: {
    fontSize: "1.1rem",
    fontWeight: 800,
    background: "linear-gradient(135deg, #818cf8, #c084fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "0.03em",
    whiteSpace: "nowrap",
  },
  collapseBtn: {
    background: "rgba(255,255,255,0.08)",
    border: "none",
    color: "#a5b4fc",
    cursor: "pointer",
    borderRadius: 8,
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    flexShrink: 0,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    padding: "12px 8px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    border: "none",
    background: "transparent",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 500,
    transition: "all 0.2s ease",
    position: "relative",
    minHeight: 42,
    whiteSpace: "nowrap",
  },
  navItemActive: {
    background: "rgba(99, 102, 241, 0.35)",
    boxShadow: "0 0 16px rgba(99, 102, 241, 0.2)",
  },
  navIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: 20,
    height: 20,
  },
  navLabel: {
    letterSpacing: "0.02em",
  },
  badge: {
    marginLeft: "auto",
    backgroundColor: "#ef4444",
    color: "#fff",
    fontSize: "0.7rem",
    fontWeight: 700,
    padding: "2px 7px",
    borderRadius: 10,
    minWidth: 20,
    textAlign: "center",
  },
  badgeDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    backgroundColor: "#ef4444",
    borderRadius: "50%",
  },
  bottom: {
    display: "flex",
    flexDirection: "column",
    padding: "12px 8px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },
  clockWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 14px",
    marginBottom: 8,
  },
  clock: {
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "1rem",
    fontWeight: 700,
    color: "#39ff14",
    background: "#000",
    padding: "3px 10px",
    borderRadius: 6,
    boxShadow: "0 0 6px #39ff14, 0 0 12px rgba(57,255,20,0.3)",
    letterSpacing: "0.15em",
    textAlign: "center",
    whiteSpace: "nowrap",
  },
  clockLabel: {
    color: "#6366f1",
    fontSize: "0.7rem",
    fontWeight: 500,
    letterSpacing: "0.05em",
    whiteSpace: "nowrap",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    border: "none",
    background: "rgba(239, 68, 68, 0.12)",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 500,
    transition: "all 0.2s",
    minHeight: 42,
    width: "100%",
    whiteSpace: "nowrap",
  },
};

export default AdminSidebar;
