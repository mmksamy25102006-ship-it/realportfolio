import { useState } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { messagesAPI } from "../services/api";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: null, text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, text: "" });

    try {
      await messagesAPI.send(formData);
      setStatus({ type: "success", text: "✅ Message sent successfully! I'll get back to you soon." });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong. Please try again.";
      setStatus({ type: "error", text: `❌ ${msg}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contactmain-div">
        <div className="contact-left">
          <h1>
            Contact <span>Info</span>
          </h1>

          <div className="info-card">
            <FaEnvelope className="icon" />
            <div>
              <h4>Email</h4>
              <p>kumar@gmail.com</p>
            </div>
          </div>

          <div className="info-card">
            <FaPhone className="icon" />
            <div>
              <h4>Phone</h4>
              <p>+91 9876543210</p>
            </div>
          </div>

          <div className="info-card">
            <FaMapMarkerAlt className="icon" />
            <div>
              <h4>Location</h4>
              <p>Tamil Nadu, India</p>
            </div>
          </div>

          <div className="social-links">
            <a href="https://github.com/mmksamy25102006-ship-it" target="_blank" rel="noreferrer">
              <FaGithub />
            </a>
            <a
              href="https://www.linkedin.com/in/muthukumara-samy-6b3b24384/"
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedin />
            </a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>

        <div className="contact-form">
          <h2>
            Let's work <span>together.</span>
          </h2>

          {status.text && (
            <div
              style={{
                padding: "14px 18px",
                borderRadius: "10px",
                marginBottom: "18px",
                fontSize: "0.95rem",
                background:
                  status.type === "success"
                    ? "rgba(0,200,100,0.1)"
                    : "rgba(255,45,45,0.1)",
                border:
                  status.type === "success"
                    ? "1px solid rgba(0,200,100,0.4)"
                    : "1px solid rgba(255,45,45,0.4)",
                color: status.type === "success" ? "#4dff91" : "#ff6666",
              }}
            >
              {status.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              autoComplete="off"
              required
            />
            <textarea
              rows="4"
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              autoComplete="off"
              required
            />

            <button className="send-btn" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
