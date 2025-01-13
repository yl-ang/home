import React, { useState, useRef, useEffect } from "react";
import { useScrollPosition } from "../hooks/useScrollPosition";
import useResizeObserver from "../hooks/useResizeObserver";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { mainBody, projects, about, skills } from "../editable-stuff/config.js";
import { NavLink } from "./home/migration";

const Navigation = React.forwardRef((props, ref) => {
  const [isTop, setIsTop] = useState(true);
  const navbarMenuRef = useRef(null);
  const navbarDimensions = useResizeObserver(navbarMenuRef);

  // Hook to monitor scroll position
  useScrollPosition(
    ({ currPos }) => {
      if (!navbarDimensions) return;

      const isNavbarAtTop = currPos.y >= -5; // Adjust this threshold as needed
      setIsTop(isNavbarAtTop);
    },
    [navbarDimensions]
  );

  // Initial effect to ensure correct navbar state on load
  useEffect(() => {
    if (!navbarDimensions) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const isNavbarAtTop = scrollTop <= 5; // Adjust threshold to fit your design
      setIsTop(isNavbarAtTop);
    };

    // Set the initial navbar state on load
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navbarDimensions]);

  return (
    <Navbar
      ref={navbarMenuRef}
      className={`px-3 fixed-top ${isTop ? "navbar-transparent" : "navbar-white"}`}
      expand="lg"
    >
      <Navbar.Brand className="navbar-brand" href={process.env.PUBLIC_URL + "/#home"}>
        {`<${mainBody.firstName} />`}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" className="toggler" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="navbar-nav mr-auto">
          {projects.show && (
            <NavLink href={process.env.PUBLIC_URL + "/#projects"}>Projects</NavLink>
          )}
          <NavLink className="nav-item lead" href={process.env.PUBLIC_URL + "/#experiences"}>Experience</NavLink>
          {about.show && (
            <NavLink className="nav-item lead" href={process.env.PUBLIC_URL + "/#aboutme"}>About</NavLink>
          )}
          {skills.show && (
            <NavLink className="nav-item lead" href={process.env.PUBLIC_URL + "/#skills"}>Skills</NavLink>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
});

export default Navigation;