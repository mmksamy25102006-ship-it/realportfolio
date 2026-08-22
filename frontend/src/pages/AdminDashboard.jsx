import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminNav from "../components/AdminNav";
import { projectsAPI, messagesAPI } from "../services/api";
import "./Admin.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    featuredProjects: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projRes, msgRes] = await Promise.all([
          projectsAPI.getAll(),
          messagesAPI.getAll(),
        ]);

        const projects = projRes.data;
        const messages = msgRes.data;

        setStats({
          totalProjects: projects.length,
          featuredProjects: projects.filter((p) => p.featured).length,
          totalMessages: messages.length,
          unreadMessages: messages.filter((m) => m.status === "unread").length,
        });

        setRecentMessages(messages.slice(0, 5));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-page">
      <AdminNav />
      <div className="admin-content">
        <h1 className="admin-page-title">
          Admin <span>Dashboard</span>
        </h1>

        {loading ? (
          <p style={{ color: "#888" }}>Loading stats...</p>
        ) : (
          <>
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-number">{stats.totalProjects}</div>
                <div className="admin-stat-label">Total Projects</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-number">{stats.featuredProjects}</div>
                <div className="admin-stat-label">Featured Projects</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-number">{stats.totalMessages}</div>
                <div className="admin-stat-label">Total Messages</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-number">{stats.unreadMessages}</div>
                <div className="admin-stat-label">Unread Messages</div>
              </div>
            </div>

            <div className="admin-section-header">
              <h2>Recent Messages</h2>
              <Link to="/admin/messages">
                <button className="admin-btn admin-btn-secondary">View All</button>
              </Link>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMessages.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", color: "#555", padding: "30px" }}>
                        No messages yet.
                      </td>
                    </tr>
                  ) : (
                    recentMessages.map((msg) => (
                      <tr key={msg._id}>
                        <td>{msg.name}</td>
                        <td>{msg.email}</td>
                        <td>{msg.subject}</td>
                        <td>
                          <span className={`badge badge-${msg.status}`}>{msg.status}</span>
                        </td>
                        <td>{new Date(msg.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: "30px" }}>
              <Link to="/admin/projects">
                <button className="admin-btn admin-btn-primary" style={{ marginRight: "12px" }}>
                  Manage Projects
                </button>
              </Link>
              <Link to="/admin/messages">
                <button className="admin-btn admin-btn-secondary">Manage Messages</button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
