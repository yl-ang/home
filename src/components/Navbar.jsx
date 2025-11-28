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

  useScrollPosition(
      ({ currPos }) => {
        if (!navbarDimensions) return;

        const isNavbarAtTop = currPos.y >= -5;
        setIsTop(isNavbarAtTop);
      },
      [navbarDimensions]
  );

  useEffect(() => {
    if (!navbarDimensions) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const isNavbarAtTop = scrollTop <= 5;
      setIsTop(isNavbarAtTop);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navbarDimensions]);

  const navbarCss = `
    /* Default fallbacks */
    .navbar .navbar-brand,
    .navbar .nav-link,
    .navbar .navbar-nav .nav-link,
    .navbar .nav-item,
    .navbar a {
      color: #222 !important;
    }

    /* Transparent / dark background: white text and inverted toggler */
    .navbar.navbar-transparent .navbar-brand,
    .navbar.navbar-transparent .nav-link,
    .navbar.navbar-transparent .nav-item,
    .navbar.navbar-transparent a {
      color: #ffffff !important;
    }
    .navbar.navbar-transparent .navbar-toggler {
      border-color: rgba(255,255,255,0.2);
    }
    .navbar.navbar-transparent .navbar-toggler-icon {
      filter: invert(1) brightness(2);
    }

    /* White / light background: dark text and default toggler */
    .navbar.navbar-white .navbar-brand,
    .navbar.navbar-white .nav-link,
    .navbar.navbar-white .nav-item,
    .navbar.navbar-white a {
      color: #222222 !important;
    }
    .navbar.navbar-white .navbar-toggler {
      border-color: rgba(0,0,0,0.1);
    }
    .navbar.navbar-white .navbar-toggler-icon {
      filter: none;
    }

    /* Keep hover/focus readable in both states */
    .navbar.navbar-transparent .nav-link:hover,
    .navbar.navbar-transparent .nav-link:focus {
      color: rgba(255,255,255,0.9) !important;
    }
    .navbar.navbar-white .nav-link:hover,
    .navbar.navbar-white .nav-link:focus {
      color: rgba(0,0,0,0.8) !important;
    }
  `;

  return (
      <Navbar
          ref={navbarMenuRef}
          className={`px-3 fixed-top ${isTop ? "navbar-transparent" : "navbar-white"}`}
          expand="lg"
      >
        <style>{navbarCss}</style>
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