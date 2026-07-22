import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import adminImage from "../../assets/admin.png";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    certificates: 0,
    education: 0,
    contacts: 0,
    messages: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [projects, skills, certificates, education, contacts, messages] =
          await Promise.all([
            getDocs(collection(db, "projects")),
            getDocs(collection(db, "skills")),
            getDocs(collection(db, "certificates")),
            getDocs(collection(db, "education")),
            getDocs(collection(db, "contacts")),
            getDocs(collection(db, "messages")),
          ]);

        let unread = 0;
        messages.forEach((doc) => {
          if (doc.data().isRead === false) unread++;
        });

        setStats({
          projects: projects.size,
          skills: skills.size,
          certificates: certificates.size,
          education: education.size,
          contacts: contacts.size,
          messages: messages.size,
          unreadMessages: unread,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "messages"), (snapshot) => {
      let unread = 0;
      snapshot.forEach((doc) => {
        if (doc.data().isRead === false) unread++;
      });
      setStats((prev) => ({ ...prev, unreadMessages: unread }));
    });
    return () => unsubscribe();
  }, []);

  const statCards = [
    {
      label: "Projects",
      count: stats.projects,
      path: "/admin/projects",
      color: "#6366f1",
      bg: "linear-gradient(135deg, #6366f1, #818cf8)",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
    },
    {
      label: "Skills",
      count: stats.skills,
      path: "/admin/skills",
      color: "#f59e0b",
      bg: "linear-gradient(135deg, #f59e0b, #fbbf24)",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      label: "Certificates",
      count: stats.certificates,
      path: "/admin/certificates",
      color: "#10b981",
      bg: "linear-gradient(135deg, #10b981, #34d399)",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      ),
    },
    {
      label: "Education",
      count: stats.education,
      path: "/admin/education",
      color: "#8b5cf6",
      bg: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 6 3 12 0v-5" />
        </svg>
      ),
    },
    {
      label: "Contact Links",
      count: stats.contacts,
      path: "/admin/contact",
      color: "#06b6d4",
      bg: "linear-gradient(135deg, #06b6d4, #22d3ee)",
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
    },
    {
      label: "Messages",
      count: stats.messages,
      path: "/admin/messages",
      color: "#ef4444",
      bg: "linear-gradient(135deg, #ef4444, #f87171)",
      badge: stats.unreadMessages > 0 ? stats.unreadMessages : null,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.avatarWrap}>
            <img src={adminImage} alt="Admin" style={styles.avatar} />
          </div>
          <div>
            <h1 style={styles.title}>Welcome back, Dulaj</h1>
            <p style={styles.subtitle}>Here's an overview of your portfolio</p>
          </div>
        </div>
      </div>

      <div className="admin-stats-grid">
        {statCards.map((card) => (
          <div
            key={card.label}
            onClick={() => navigate(card.path)}
            style={styles.statCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
            }}
          >
            <div style={{ ...styles.statIcon, background: card.bg }}>
              {card.icon}
              {card.badge && <span style={styles.statBadge}>{card.badge}</span>}
            </div>
            <div style={styles.statInfo}>
              <span style={styles.statCount}>{loading ? "..." : card.count}</span>
              <span style={styles.statLabel}>{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.quickActions}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionsGrid}>
          <button onClick={() => navigate("/admin/projects")} style={styles.actionBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Project
          </button>
          <button onClick={() => navigate("/admin/skills")} style={styles.actionBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Skill
          </button>
          <button onClick={() => navigate("/admin/certificates")} style={styles.actionBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Certificate
          </button>
          <button onClick={() => navigate("/admin/messages")} style={{ ...styles.actionBtn, ...(stats.unreadMessages > 0 ? styles.actionBtnAlert : {}) }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            View Messages
            {stats.unreadMessages > 0 && (
              <span style={styles.actionBadge}>{stats.unreadMessages} new</span>
            )}
          </button>
        </div>
      </div>


    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    minHeight: "100vh",
  },
  header: {
    marginBottom: "2rem",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "1.25rem",
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
    flexShrink: 0,
  },
  avatar: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: 800,
    color: "#1e1b4b",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "#6b7280",
    margin: "4px 0 0",
  },
  statCard: {
    background: "#fff",
    borderRadius: 16,
    padding: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
  },
  statIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    flexShrink: 0,
    position: "relative",
  },
  statBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#ef4444",
    color: "#fff",
    fontSize: "0.65rem",
    fontWeight: 700,
    width: 20,
    height: 20,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statInfo: {
    display: "flex",
    flexDirection: "column",
  },
  statCount: {
    fontSize: "1.75rem",
    fontWeight: 800,
    color: "#1e1b4b",
    lineHeight: 1,
  },
  statLabel: {
    fontSize: "0.85rem",
    color: "#6b7280",
    marginTop: 4,
  },
  quickActions: {
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#1e1b4b",
    marginBottom: "1rem",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "0.75rem",
  },
  actionBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 16px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#374151",
    transition: "all 0.2s",
  },
  actionBtnAlert: {
    borderColor: "#fca5a5",
    background: "#fef2f2",
    color: "#dc2626",
  },
  actionBadge: {
    marginLeft: "auto",
    backgroundColor: "#ef4444",
    color: "#fff",
    fontSize: "0.7rem",
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: 8,
  },
};

export default AdminDashboard;
