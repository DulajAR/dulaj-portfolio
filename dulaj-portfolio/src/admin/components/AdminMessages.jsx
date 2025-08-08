import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    date: "", // date in yyyy-mm-dd format
  });
  const navigate = useNavigate();

  const fetchMessages = async () => {
    const querySnapshot = await getDocs(collection(db, "messages"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const updatedData = await Promise.all(
      data.map(async (msg) => {
        if (msg.isRead === undefined) {
          const msgRef = doc(db, "messages", msg.id);
          await updateDoc(msgRef, { isRead: false });
          return { ...msg, isRead: false };
        }
        return msg;
      })
    );

    updatedData.sort((a, b) => {
      if (a.isRead === b.isRead) {
        return b.timestamp?.seconds - a.timestamp?.seconds;
      }
      return a.isRead ? 1 : -1;
    });

    setMessages(updatedData);
    setFilteredMessages(updatedData);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    let filtered = messages;

    if (filters.name.trim() !== "") {
      filtered = filtered.filter((msg) =>
        msg.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.email.trim() !== "") {
      filtered = filtered.filter((msg) =>
        msg.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }

    if (filters.date !== "") {
      filtered = filtered.filter((msg) => {
        if (!msg.timestamp) return false;
        const msgDate = new Date(msg.timestamp.seconds * 1000);
        const filterDate = new Date(filters.date);
        return (
          msgDate.getFullYear() === filterDate.getFullYear() &&
          msgDate.getMonth() === filterDate.getMonth() &&
          msgDate.getDate() === filterDate.getDate()
        );
      });
    }

    setFilteredMessages(filtered);
  }, [filters, messages]);

  const handleMarkAsRead = async (id) => {
    const msgRef = doc(db, "messages", id);
    await updateDoc(msgRef, { isRead: true });
    fetchMessages();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      const msgRef = doc(db, "messages", id);
      await deleteDoc(msgRef);
      fetchMessages();
    }
  };

  const cardStyle = {
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    backgroundColor: "#fefefe",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease",
    animation: "fadeIn 0.4s ease",
  };

  const renderMessageCard = (msg, isNew) => (
    <div
      key={msg.id}
      style={{
        ...cardStyle,
        borderLeft: `6px solid ${isNew ? "#5cb85c" : "#999"}`,
        backgroundColor: isNew ? "#eafaf1" : "#f9f9f9",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
    >
      <p>
        <strong>Name:</strong> {msg.name}
      </p>
      <p>
        <strong>Email:</strong> {msg.email}
      </p>
      <p>
        <strong>Message:</strong> {msg.message}
      </p>
      <p style={{ fontSize: "12px", color: "#777", marginTop: "8px" }}>
        {msg.timestamp
          ? new Date(msg.timestamp.seconds * 1000).toLocaleString()
          : "No timestamp"}
      </p>

      <div style={{ marginTop: "12px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {isNew ? (
          <button
            onClick={() => handleMarkAsRead(msg.id)}
            style={{
              backgroundColor: "#5bc0de",
              color: "#fff",
              padding: "6px 14px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Mark as Read
          </button>
        ) : (
          <>
            <span
              style={{
                backgroundColor: "#999",
                color: "#fff",
                padding: "6px 14px",
                borderRadius: "6px",
                cursor: "default",
                display: "inline-block",
              }}
            >
              Read
            </span>
            <button
              onClick={() => window.open(`mailto:${msg.email}?subject=Re:%20Your%20Message`, "_blank")}
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "6px 14px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Reply
            </button>
          </>
        )}
        <button
          onClick={() => handleDelete(msg.id)}
          style={{
            backgroundColor: "#d9534f",
            color: "#fff",
            padding: "6px 14px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "30px 20px", backgroundColor: "#f4f7f9", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "30px",
          position: "relative",
          animation: "fadeIn 0.6s ease",
        }}
      >
        <h1 style={{ fontSize: "26px", fontWeight: "bold", color: "#333", textAlign: "center" }}>
          Contact Me - Admin Messages
        </h1>
        <button
          onClick={() => navigate("/admin/dashboard")}
          style={{
            position: "absolute",
            right: 0,
            backgroundColor: "#333",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            cursor: "pointer",
          }}
        >
          ⬅ Back to Dashboard
        </button>
      </div>

      {/* Filters */}
      <div
        style={{
          marginBottom: "30px",
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search by Name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            width: "180px",
            fontSize: "14px",
          }}
        />
        <input
          type="text"
          placeholder="Search by Email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            width: "180px",
            fontSize: "14px",
          }}
        />
        <input
          type="date"
          placeholder="Select Date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            width: "180px",
            fontSize: "14px",
          }}
        />
        <button
          onClick={() => setFilters({ name: "", email: "", date: "" })}
          style={{
            backgroundColor: "#d9534f",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "10px 18px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          title="Clear Filters"
        >
          Clear
        </button>
      </div>

      {/* New Messages */}
      <div style={{ marginBottom: "40px" }}>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "600",
            color: "#5cb85c",
            marginBottom: "10px",
          }}
        >
          🆕 New Messages
        </h2>
        {filteredMessages.filter((msg) => !msg.isRead).length === 0 ? (
          <p style={{ color: "#888" }}>No new messages</p>
        ) : (
          filteredMessages
            .filter((msg) => !msg.isRead)
            .map((msg) => renderMessageCard(msg, true))
        )}
      </div>

      {/* Read Messages */}
      <div>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "600",
            color: "#555",
            marginBottom: "10px",
          }}
        >
          📖 Read Messages
        </h2>
        {filteredMessages.filter((msg) => msg.isRead).length === 0 ? (
          <p style={{ color: "#aaa" }}>No read messages</p>
        ) : (
          filteredMessages
            .filter((msg) => msg.isRead)
            .map((msg) => renderMessageCard(msg, false))
        )}
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminMessages;
