import {
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaBootstrap,
  FaGithub,
  FaJs,
  
} from "react-icons/fa";
import { VscVscode } from "react-icons/vsc";

export default function Skills() {
  const skills = [
    { name: "React", value: 90, icon: <FaReact /> },
    { name: "JavaScript", value: 85, icon: <FaJs /> },
    { name: "CSS", value: 88, icon: <FaCss3Alt /> },
    { name: "HTML", value: 95, icon: <FaHtml5 /> },
    { name: "Bootstrap", value: 80, icon: <FaBootstrap /> },
    { name: "Git & GitHub", value: 75, icon: <FaGithub /> },
    { name: "Vscode", value: 75, icon: <VscVscode />}

  ];

  return (
    <section id="skills" className="skills-section">
        <div className="skill-maindiv">
      <h2>
        My <span>Skills</span>
      </h2>

      <p className="skills-text">
        Technologies and tools I use to build modern web applications.
      </p>

    
      <div className="skills-grid">
  {skills.map((skill) => (
    <div className="glass-card" key={skill.name}>
      <div className="glass-icon">{skill.icon}</div>
      <h3>{skill.name}</h3>
      {/* <p>{skill.value}%</p> */}
    </div>
  ))}
</div>
      </div>
    </section>
  );
}