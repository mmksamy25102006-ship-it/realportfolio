import { useEffect, useState } from "react";



export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
     const [nearFooter, setNearFooter] = useState(false);


   


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    


      const footer = document.querySelector("footer");

      if (footer) {
        const footerTop =
          footer.getBoundingClientRect().top;

        setNearFooter(
          footerTop < window.innerHeight
        );
      }

    };



    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  
  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""} ${nearFooter ? "hide-border" : ""}`}>
      <div className="logo">
        <div>
        <img src={`${import.meta.env.BASE_URL}navimg-logo.png`} alt="" width="128" height="128" />
        </div>
       <h2> Kumar<span>.</span></h2>
      </div>

      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

    
    </nav>
  );
}