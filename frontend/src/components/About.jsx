export default function About() {
  return (
    <section id="about" className="about">
<div className="aboutmain">

      <div className="about-image">
        <img
          src="myimg2.png"
          alt=""
        />
      </div>

      <div className="about-content">

        <h3 className="about-subtitle">
          About <span>Me</span>
        </h3>

        <h2>
          React Developer &
          <span> Frontend Enthusiast</span>
        </h2>

        <p className="about-p">
          Hello! I'm Kumar, a passionate React Developer who
          loves creating modern, responsive and user-friendly
          web applications. I focus on clean UI design,
          performance optimization and providing the best
          user experience. I continuously improve my skills by building
          real-world projects and exploring new technologies.
        </p>

        <p className="about-p">
        
        </p>

        <div className="about-info">

          <div className="info-box">
            <h3>Fresher</h3>
            <p>Frontend Developer</p>
          </div>

          <div className="info-box">
            <h3>5+</h3>
            <p>Projects Completed</p>
          </div>

          <div className="info-box">
            <h3>100%</h3>
            <p>Dedication</p>
          </div>

        </div>

        <div className="about-buttons">
          <a href="#contact" className="btn">
            Contact Me
          </a>

          <a href="/m.muthukumarasamy Resume.pdf" download className="btn">
            Download CV
          </a>
        </div>

      </div>
</div>
    </section>
  );
}