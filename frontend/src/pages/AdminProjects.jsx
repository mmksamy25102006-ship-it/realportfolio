import { useEffect, useState } from "react";
import AdminNav from "../components/AdminNav";
import { projectsAPI } from "../services/api";
import "./Admin.css";

const emptyForm = {
  title: "",
  description: "",
  technologies: "",
  image: "",
  githubUrl: "",
  liveUrl: "",
  category: "Web",
  featured: false,
};

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ type: "", text: "" });

  const fetchProjects = async () => {
    try {
      const res = await projectsAPI.getAll();
      setProjects(res.data);
    } catch {
      showAlert("error", "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert({ type: "", text: "" }), 4000);
  };

  const openAddModal = () => {
    setForm(emptyForm);
    setEditId(null);
    setModal(true);
  };

  const openEditModal = (project) => {
    setForm({
      title: project.title,
      description: project.description,
      technologies: project.technologies?.join(", ") || "",
      image: project.image || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      category: project.category || "Web",
      featured: project.featured || false,
    });
    setEditId(project._id);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setEditId(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      technologies: form.technologies
        ? form.technologies.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    };

    try {
      if (editId) {
        await projectsAPI.update(editId, payload);
        showAlert("success", "Project updated successfully!");
      } else {
        await projectsAPI.create(payload);
        showAlert("success", "Project added successfully!");
      }
      closeModal();
      fetchProjects();
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await projectsAPI.delete(id);
      showAlert("success", "Project deleted.");
      fetchProjects();
    } catch {
      showAlert("error", "Delete failed.");
    }
  };

  const toggleFeatured = async (project) => {
    try {
      await projectsAPI.update(project._id, { featured: !project.featured });
      fetchProjects();
    } catch {
      showAlert("error", "Update failed.");
    }
  };

  return (
    <div className="admin-page">
      <AdminNav />
      <div className="admin-content">
        <h1 className="admin-page-title">
          Manage <span>Projects</span>
        </h1>

        {alert.text && (
          <div className={`admin-alert admin-alert-${alert.type}`}>{alert.text}</div>
        )}

        <div className="admin-section-header">
          <h2>{projects.length} project{projects.length !== 1 ? "s" : ""}</h2>
          <button className="admin-btn admin-btn-primary" onClick={openAddModal}>
            + Add Project
          </button>
        </div>

        {loading ? (
          <p style={{ color: "#888" }}>Loading projects...</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Technologies</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", color: "#555", padding: "40px" }}>
                      No projects yet. Click "+ Add Project" to get started.
                    </td>
                  </tr>
                ) : (
                  projects.map((p) => (
                    <tr key={p._id}>
                      <td>
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.title}
                            style={{ width: 60, height: 44, objectFit: "cover", borderRadius: 6 }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 60,
                              height: 44,
                              background: "#222",
                              borderRadius: 6,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#555",
                              fontSize: "0.7rem",
                            }}
                          >
                            No img
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 600, color: "#fff" }}>{p.title}</td>
                      <td>{p.category}</td>
                      <td style={{ maxWidth: 180 }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {(p.technologies || []).slice(0, 3).map((t) => (
                            <span
                              key={t}
                              style={{
                                background: "rgba(255,45,45,0.12)",
                                border: "1px solid rgba(255,45,45,0.3)",
                                color: "#ff6666",
                                padding: "2px 8px",
                                borderRadius: 12,
                                fontSize: "0.75rem",
                              }}
                            >
                              {t}
                            </span>
                          ))}
                          {(p.technologies || []).length > 3 && (
                            <span style={{ color: "#666", fontSize: "0.75rem" }}>
                              +{p.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => toggleFeatured(p)}
                          className="admin-btn"
                          style={{
                            padding: "5px 12px",
                            fontSize: "0.8rem",
                            background: p.featured ? "rgba(255,200,0,0.15)" : "transparent",
                            border: p.featured
                              ? "1px solid rgba(255,200,0,0.5)"
                              : "1px solid #333",
                            color: p.featured ? "#ffd700" : "#666",
                          }}
                        >
                          {p.featured ? "★ Featured" : "☆ Mark"}
                        </button>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            className="admin-btn admin-btn-secondary"
                            style={{ padding: "6px 14px", fontSize: "0.85rem" }}
                            onClick={() => openEditModal(p)}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-btn admin-btn-danger"
                            style={{ padding: "6px 14px", fontSize: "0.85rem" }}
                            onClick={() => handleDelete(p._id, p.title)}
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

      {/* ADD / EDIT MODAL */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editId ? "Edit" : "Add"} <span>Project</span></h2>

            <form className="admin-form" onSubmit={handleSubmit}>
              <div>
                <label>Title *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Project title"
                  required
                />
              </div>

              <div>
                <label>Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Project description"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label>Technologies (comma-separated)</label>
                <input
                  name="technologies"
                  value={form.technologies}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div>
                <label>Image URL</label>
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-row">
                <div>
                  <label>GitHub URL</label>
                  <input
                    name="githubUrl"
                    value={form.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label>Live URL</label>
                  <input
                    name="liveUrl"
                    value={form.liveUrl}
                    onChange={handleChange}
                    placeholder="https://yourproject.vercel.app"
                  />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label>Category</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    <option>Web</option>
                    <option>Mobile</option>
                    <option>Backend</option>
                    <option>Full Stack</option>
                    <option>Other</option>
                  </select>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 22 }}>
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    style={{ width: "auto", accentColor: "#ff2d2d" }}
                  />
                  <label htmlFor="featured" style={{ margin: 0, cursor: "pointer" }}>
                    Featured
                  </label>
                </div>
              </div>

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : editId ? "Update" : "Add Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
