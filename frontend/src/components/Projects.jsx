import { useEffect, useState } from "react";
import { projectsAPI } from "../services/api";

// Fallback projects shown if API fails or returns empty
const FALLBACK_PROJECTS = [
  {
    _id: "1",
    title: "QuickBasket E-Commerce",
    description: "Online shopping website built using React.",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800",
    technologies: ["React", "CSS"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    _id: "2",
    title: "Food Ordering App",
    description: "Responsive food ordering UI with cart feature.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    technologies: ["React", "JavaScript"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    _id: "3",
    title: "Weather App",
    description: "Weather forecast app using API integration.",
    image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800",
    technologies: ["React", "API"],
    githubUrl: "#",
    liveUrl: "#",
  },
];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectsAPI.getAll();
        const data = res.data;
        // If DB is empty use fallback so portfolio always looks good
        setProjects(data.length > 0 ? data : FALLBACK_PROJECTS);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Could not load projects from server. Showing sample projects.");
        setProjects(FALLBACK_PROJECTS);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="projects-section">
      <div className="projectmain-div">
        <h2>
          My <span>Projects</span>
        </h2>

        <p className="project-subtitle">
          Some projects I've built using React and JavaScript.
        </p>

        {loading && (
          <div style={{ textAlign: "center", color: "#b0b0b0", padding: "60px 0", fontSize: "1.2rem" }}>
            Loading projects...
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center", color: "#ff6666", marginBottom: "20px", fontSize: "1rem" }}>
            {error}
          </div>
        )}

        {!loading && (
          <div className="projects-grid">
            {projects.map((project) => (
              <div className="project-card" key={project._id || project.title}>
                <img src={project.image || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800"} alt={project.title} />

                <div className="project-content">
                  <h3>{project.title}</h3>

                  <p>{project.description}</p>

                  {project.technologies && project.technologies.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          style={{
                            background: "rgba(255,45,45,0.15)",
                            border: "1px solid rgba(255,45,45,0.4)",
                            color: "#ff6666",
                            padding: "3px 10px",
                            borderRadius: "20px",
                            fontSize: "0.8rem",
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="project-buttons">
                    <a
                      href={project.liveUrl || "#"}
                      className="live-btn"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Live Demo
                    </a>

                    <a
                      href={project.githubUrl || "#"}
                      className="code-btn"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Source Code
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
