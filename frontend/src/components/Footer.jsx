import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaTwitter,
  FaArrowUp,
  FaDownload,
} from "react-icons/fa";

const Footer = () => {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">

      {/* Background effects */}
      <div className="footer-particles"></div>
      <div className="footer-glow"></div>

      <div className="footer-container">

        {/* ================= LOGO ================= */}
        <div className="footer-logo">
          KUMAR<span>.</span>
        </div>

        {/* ================= DESCRIPTION ================= */}
        <p className="footer-desc">
          Building modern, interactive and futuristic web experiences
          with creativity, technology and clean code.
        </p>

        {/* ================= STATUS ================= */}
        <div className="footer-status">
          SYSTEM ONLINE
        </div>

        {/* ================= SOCIALS ================= */}
        <div className="socials">

          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>

          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>

          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>

          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <FaTwitter />
          </a>

        </div>


        {/* ================= TECHNOLOGIES ================= */}
        <div className="tech-marquee">

          <div className="tech-track">

            <span>React</span>
            &nbsp; • &nbsp;

            JavaScript
            &nbsp; • &nbsp;

            Node.js
            &nbsp; • &nbsp;

            Express.js
            &nbsp; • &nbsp;

            MongoDB
            &nbsp; • &nbsp;

            HTML
            &nbsp; • &nbsp;

            CSS
            &nbsp; • &nbsp;

            GitHub
            &nbsp; • &nbsp;

            Vite
            &nbsp; • &nbsp;

            React
            &nbsp; • &nbsp;

            JavaScript
            &nbsp; • &nbsp;

            Node.js
            &nbsp; • &nbsp;

            MongoDB

          </div>

        </div>


        {/* ================= ACTIONS ================= */}
        <div className="footer-flex">

          <a
            href="/resume.pdf"
            className="resume-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaDownload />
            <span>Download Resume</span>
          </a>

          <button
            className="top-btn"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <FaArrowUp />
          </button>

        </div>


        {/* ================= COPYRIGHT ================= */}
        <div className="footer-bottom">

          <p>
            © {new Date().getFullYear()} Kumar.
            <span> All Rights Reserved.</span>
          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;