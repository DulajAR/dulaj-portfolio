import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", date: "" });

  const fetchMessages = async () => {
    const querySnapshot = await getDocs(collection(db, "messages"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const updatedData = await Promise.all(
      data.map(async (msg) => {
        if (msg.isRead === undefined) {
          await updateDoc(doc(db, "messages", msg.id), { isRead: false });
          return { ...msg, isRead: false };
        }
        return msg;
      })
    );

    updatedData.sort((a, b) => {
      if (a.isRead === b.isRead) return b.timestamp?.seconds - a.timestamp?.seconds;
      return a.isRead ? 1 : -1;
    });

    setMessages(updatedData);
    setFilteredMessages(updatedData);
  };

  useEffect(() => { fetchMessages(); }, []);

  useEffect(() => {
    let filtered = messages;
    if (filters.name.trim() !== "") {
      filtered = filtered.filter((msg) => msg.name.toLowerCase().includes(filters.name.toLowerCase()));
    }
    if (filters.email.trim() !== "") {
      filtered = filtered.filter((msg) => msg.email.toLowerCase().includes(filters.email.toLowerCase()));
    }
    if (filters.date !== "") {
      filtered = filtered.filter((msg) => {
        if (!msg.timestamp) return false;
        const msgDate = new Date(msg.timestamp.seconds * 1000);
        const filterDate = new Date(filters.date);
        return msgDate.getFullYear() === filterDate.getFullYear() &&
          msgDate.getMonth() === filterDate.getMonth() &&
          msgDate.getDate() === filterDate.getDate();
      });
    }
    setFilteredMessages(filtered);
  }, [filters, messages]);

  const handleMarkAsRead = async (id) => {
    await updateDoc(doc(db, "messages", id), { isRead: true });
    fetchMessages();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      await deleteDoc(doc(db, "messages", id));
      fetchMessages();
    }
  };

  const renderMessageCard = (msg, isNew) => (
    <div key={msg.id} style={{
      ...styles.card,
      borderLeft: `6px solid ${isNew ? "#10b981" : "#9ca3af"}`,
      backgroundColor: isNew ? "#f0fdf4" : "#f9fafb",
    }}>
      <p><strong>Name:</strong> {msg.name}</p>
      <p><strong>Email:</strong> {msg.email}</p>
      <p><strong>Message:</strong> {msg.message}</p>
      <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "8px" }}>
        {msg.timestamp ? new Date(msg.timestamp.seconds * 1000).toLocaleString() : "No timestamp"}
      </p>
      <div style={{ marginTop: "12px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {isNew ? (
          <button onClick={() => handleMarkAsRead(msg.id)} style={styles.markReadBtn}>Mark as Read</button>
        ) : (
          <>
            <span style={styles.readBadge}>Read</span>
            <button onClick={() => window.open(`mailto:${msg.email}?subject=Re:%20Your%20Message`, "_blank")}
              style={styles.replyBtn}>Reply</button>
          </>
        )}
        <button onClick={() => handleDelete(msg.id)} style={styles.deleteBtn}>Delete</button>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Messages</h1>

      <div style={styles.filters}>
        <input type="text" placeholder="Search by Name" value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })} style={styles.filterInput} />
        <input type="text" placeholder="Search by Email" value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })} style={styles.filterInput} />
        <input type="date" placeholder="Select Date" value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })} style={styles.filterInput} />
        <button onClick={() => setFilters({ name: "", email: "", date: "" })}
          style={styles.clearBtn}>Clear</button>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2 style={styles.sectionTitle}>New Messages</h2>
        {filteredMessages.filter((msg) => !msg.isRead).length === 0 ? (
          <p style={{ color: "#9ca3af" }}>No new messages</p>
        ) : (
          filteredMessages.filter((msg) => !msg.isRead).map((msg) => renderMessageCard(msg, true))
        )}
      </div>

      <div>
        <h2 style={styles.sectionTitle}>Read Messages</h2>
        {filteredMessages.filter((msg) => msg.isRead).length === 0 ? (
          <p style={{ color: "#9ca3af" }}>No read messages</p>
        ) : (
          filteredMessages.filter((msg) => msg.isRead).map((msg) => renderMessageCard(msg, false))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "2rem", minHeight: "100vh" },
  heading: {
    fontSize: "1.5rem", fontWeight: 700, color: "#1e1b4b",
    textAlign: "center", marginBottom: "1.5rem",
  },
  filters: {
    marginBottom: "2rem", display: "flex", gap: "12px",
    flexWrap: "wrap", justifyContent: "center", alignItems: "center",
  },
  filterInput: {
    padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db",
    width: "180px", fontSize: "0.9rem",
  },
  clearBtn: {
    backgroundColor: "#ef4444", color: "#fff", border: "none",
    borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 600,
  },
  sectionTitle: {
    fontSize: "1.1rem", fontWeight: 700, color: "#374151", marginBottom: "1rem",
  },
  card: {
    borderRadius: 12, padding: "16px", marginBottom: "12px",
    backgroundColor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    transition: "transform 0.3s ease",
  },
  markReadBtn: {
    backgroundColor: "#06b6d4", color: "#fff", padding: "6px 14px",
    borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600,
  },
  readBadge: {
    backgroundColor: "#9ca3af", color: "#fff", padding: "6px 14px",
    borderRadius: 8, display: "inline-block",
  },
  replyBtn: {
    backgroundColor: "#6366f1", color: "#fff", padding: "6px 14px",
    borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600,
  },
  deleteBtn: {
    backgroundColor: "#ef4444", color: "#fff", padding: "6px 14px",
    borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600,
  },
};

export default AdminMessages;
