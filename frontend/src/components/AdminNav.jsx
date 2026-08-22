import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AdminNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const isActive = (path) => (pathname === path ? "active" : "");

  return (
    <nav className="admin-nav">
      <Link to="/admin/dashboard" className="admin-nav-logo">
        Kumar<span>.</span> Admin
      </Link>

      <ul className="admin-nav-links">
        <li>
          <Link to="/admin/dashboard" className={isActive("/admin/dashboard")}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/projects" className={isActive("/admin/projects")}>
            Projects
          </Link>
        </li>
        <li>
          <Link to="/admin/messages" className={isActive("/admin/messages")}>
            Messages
          </Link>
        </li>
        <li>
          <Link to="/" style={{ color: "#888", textDecoration: "none", padding: "8px 16px" }}>
            View Site
          </Link>
        </li>
      </ul>

      <button className="admin-logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}
