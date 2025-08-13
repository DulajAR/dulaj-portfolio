// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import adminImage from "../../assets/admin.png";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [time, setTime] = useState("");

  // Added Education page here
  const navItems = [
    { label: "About", path: "/admin/about" },
    { label: "Projects", path: "/admin/projects" },
    { label: "Skills", path: "/admin/skills" },
    { label: "Certificates", path: "/admin/certificates" },
    { label: "Education", path: "/admin/education" }, // ✅ New Education page
    { label: "Contact", path: "/admin/contact" },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  // Listen to unread messages in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "messages"), (snapshot) => {
      let unreadMessages = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.isRead === false) {
          unreadMessages++;
        }
      });
      setUnreadCount(unreadMessages);
    });

    return () => unsubscribe();
  }, []);

  // Update digital clock every second
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds();
      const colon = seconds % 2 === 0 ? ":" : " ";
      setTime(`${hours}${colon}${minutes}`);
    };

    updateClock(); // initial call
    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dulaj Portfolio – Admin Panel</h1>

        {/* Digital clock */}
        <div className="digital-clock" aria-label="Current time" role="timer">
          {time}
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="nav-grid">
        {navItems.map((item) => (
          <div
            key={item.label}
            className="nav-card"
            onClick={() => navigate(item.path)}
            style={{ position: "relative" }}
          >
            <h3>{item.label}</h3>

            {/* Only Contact shows unread messages */}
            {item.label === "Contact" && unreadCount > 0 && (
              <span
                className="notification-badge"
                aria-label={`${unreadCount} unread messages`}
              >
                {/* Message Icon SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  width="16px"
                  height="16px"
                  style={{ marginRight: "6px", verticalAlign: "middle" }}
                  aria-hidden="true"
                >
                  <path d="M20 2H4a2 2 0 00-2 2v16l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" />
                </svg>
                {unreadCount}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="image-container">
        <img src={adminImage} alt="Admin" />
      </div>

      <style>{`
        .dashboard-container {
          padding: 2rem;
          min-height: 100vh;
          background: linear-gradient(to right, #eef2f3, #8e9eab);
          font-family: 'Segoe UI', sans-serif;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .dashboard-header h1 {
          margin: 0;
          color: #333;
          flex-grow: 1;
          min-width: 220px;
        }

        .digital-clock {
          font-family: 'Courier New', Courier, monospace;
          font-size: 1.5rem;
          font-weight: 700;
          color: #39ff14;
          background: #000;
          padding: 0.4rem 1rem;
          border-radius: 6px;
          box-shadow:
            0 0 5px #39ff14,
            0 0 10px #39ff14,
            0 0 20px #39ff14,
            0 0 40px #39ff14;
          user-select: none;
          min-width: 100px;
          text-align: center;
          letter-spacing: 0.15em;
        }

        .logout-button {
          background-color: #ef4444;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.95rem;
          transition: background-color 0.3s ease;
          min-width: 90px;
        }

        .logout-button:hover {
          background-color: #dc2626;
        }

        .nav-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1.5rem;
          padding: 0 1rem;
        }

        .nav-card {
          background: #fff;
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s, box-shadow 0.3s;
          position: relative;
        }

        .nav-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
        }

        .nav-card h3 {
          margin: 0;
          font-size: 1.2rem;
          color: #4f46e5;
        }

        .notification-badge {
          position: absolute;
          top: 12px;
          right: 16px;
          background-color: #ef4444;
          color: white;
          padding: 4px 10px;
          font-size: 0.85rem;
          font-weight: bold;
          border-radius: 16px;
          box-shadow: 0 0 6px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          user-select: none;
          white-space: nowrap;
          min-width: 30px;
          justify-content: center;
        }

        .image-container {
          margin-top: 3rem;
          text-align: center;
        }

        .image-container img {
          max-width: 400px;
          width: 100%;
          height: auto;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.2);
          cursor: pointer;
          animation: fadeInScale 1s ease forwards;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          opacity: 0;
          transform: scale(0.95);
          margin-left: auto;
          margin-right: auto;
          display: block;
        }

        .image-container img:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }

        @keyframes fadeInScale {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
