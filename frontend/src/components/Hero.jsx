// import "./Hero.css";
import ParticleGlobe from "./ParticleGlobe";

export default function Hero() {
  return (
    <section className="hero" id="home">


 


      {/* Background Glow */}
      <div className="red-glow"></div>

      {/* Stars */}
      <div className="stars">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Cyber Grid */}
      <div className="cyber-grids"></div>

<div className="hologram-scanner">
  <ParticleGlobe />
</div>
{/* <div className="hologram-scanner"> */}

      {/* Content */}
      <div className="hero-content">

        <h3>Hi I'm</h3>

        <h1>KUMAR</h1>

        <h2>Frontend React Developer</h2>

        <p>
          Passionate developer building modern,
          responsive and interactive web applications
          using React, JavaScript and CSS.
        </p>

        <div className="hero-buttons">
        <a href="#projects"><button>View Projects</button></a>
         <a href="#skills"><button>My Skills</button></a>
        </div>

      </div>
      {/* </div> */}

    <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

           {/* Falling stars layer */}
      <div className="falling-stars">
        {[...Array(25)].map((_, i) => (
          <span key={i} className="star"></span>
        ))}
      </div>
        {/* Comets */}
      <div className="comets">
        {[...Array(8)].map((_, i) => (
          <span key={i} className="comet"></span>
        ))}
      </div>
        <div className="layer layer-back"></div>
      <div className="layer layer-mid"></div>
      <div className="layer layer-front"></div>

      {/* Comets */}
      <div className="comets">
        {[...Array(10)].map((_, i) => (
          <span key={i} className="comet"></span>
        ))}
      </div>
      <div className="dust"></div>


      {/* Stars layers */}
      <div className="stars"></div>
      <div className="stars2"></div>

      {/* Shooting stars */}
      <div className="shooting-stars">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="shoot"></span>
        ))}
      </div>
    </section>
  );
}