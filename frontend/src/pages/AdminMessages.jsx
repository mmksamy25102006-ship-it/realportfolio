import { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import { messagesAPI } from "../services/api";
import "./Admin.css";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [alert, setAlert] = useState({ type: "", text: "" });

  const fetchMessages = async () => {
    try {
      const res = await messagesAPI.getAll();
      setMessages(res.data);
    } catch {
      showAlert("error", "Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert({ type: "", text: "" }), 4000);
  };

  const handleView = async (msg) => {
    setSelected(msg);
    if (msg.status === "unread") {
      try {
        await messagesAPI.markRead(msg._id);
        fetchMessages();
      } catch {
        // non-critical
      }
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete message from "${name}"?`)) return;
    try {
      await messagesAPI.delete(id);
      showAlert("success", "Message deleted.");
      if (selected?._id === id) setSelected(null);
      fetchMessages();
    } catch {
      showAlert("error", "Delete failed.");
    }
  };

  const handleMarkRead = async (msg) => {
    try {
      await messagesAPI.markRead(msg._id);
      showAlert("success", "Marked as read.");
      fetchMessages();
    } catch {
      showAlert("error", "Update failed.");
    }
  };

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <div className="admin-page">
      <AdminNav />
      <div className="admin-content">
        <h1 className="admin-page-title">
          Contact <span>Messages</span>
        </h1>

        {alert.text && (
          <div className={`admin-alert admin-alert-${alert.type}`}>{alert.text}</div>
        )}

        <div className="admin-section-header">
          <h2>
            {messages.length} message{messages.length !== 1 ? "s" : ""}
            {unreadCount > 0 && (
              <span
                style={{
                  marginLeft: 10,
                  background: "rgba(255,45,45,0.2)",
                  border: "1px solid rgba(255,45,45,0.5)",
                  color: "#ff6666",
                  padding: "2px 10px",
                  borderRadius: 20,
                  fontSize: "0.8rem",
                }}
              >
                {unreadCount} unread
              </span>
            )}
          </h2>
        </div>

        {loading ? (
          <p style={{ color: "#888" }}>Loading messages...</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", color: "#555", padding: "40px" }}>
                      No messages yet.
                    </td>
                  </tr>
                ) : (
                  messages.map((msg) => (
                    <tr
                      key={msg._id}
                      style={{
                        fontWeight: msg.status === "unread" ? 700 : 400,
                      }}
                    >
                      <td>
                        <span className={`badge badge-${msg.status}`}>{msg.status}</span>
                      </td>
                      <td style={{ color: "#fff" }}>{msg.name}</td>
                      <td style={{ fontSize: "0.9rem" }}>{msg.email}</td>
                      <td>{msg.subject}</td>
                      <td style={{ fontSize: "0.85rem", color: "#666" }}>
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: "5px 12px", fontSize: "0.82rem" }}
                            onClick={() => handleView(msg)}
                          >
                            View
                          </button>
                          {msg.status === "unread" && (
                            <button
                              className="admin-btn"
                              style={{
                                padding: "5px 12px",
                                fontSize: "0.82rem",
                                background: "transparent",
                                border: "1px solid rgba(77,255,145,0.4)",
                                color: "#4dff91",
                              }}
                              onClick={() => handleMarkRead(msg)}
                            >
                              ✓ Read
                            </button>
                          )}
                          <button
                            className="admin-btn admin-btn-danger"
                            style={{ padding: "5px 12px", fontSize: "0.82rem" }}
                            onClick={() => handleDelete(msg._id, msg.name)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MESSAGE DETAIL MODAL */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 20,
              }}
            >
              <h2 style={{ margin: 0 }}>
                Message from <span>{selected.name}</span>
              </h2>
              <span className={`badge badge-${selected.status}`}>{selected.status}</span>
            </div>

            <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ color: "#888", fontSize: "0.8rem" }}>FROM</label>
                <p style={{ color: "#fff", marginTop: 4 }}>
                  {selected.name} &lt;{selected.email}&gt;
                </p>
              </div>
              <div>
                <label style={{ color: "#888", fontSize: "0.8rem" }}>SUBJECT</label>
                <p style={{ color: "#fff", marginTop: 4 }}>{selected.subject}</p>
              </div>
              <div>
                <label style={{ color: "#888", fontSize: "0.8rem" }}>DATE</label>
                <p style={{ color: "#aaa", marginTop: 4 }}>
                  {new Date(selected.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <label style={{ color: "#888", fontSize: "0.8rem" }}>MESSAGE</label>
                <div className="message-detail-body">{selected.message}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                className="admin-btn admin-btn-danger"
                onClick={() => {
                  handleDelete(selected._id, selected.name);
                  setSelected(null);
                }}
              >
                Delete
              </button>
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
