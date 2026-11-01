import React, { useState, useRef, useEffect } from "react";
import { useScrollPosition } from "../hooks/useScrollPosition";
import useResizeObserver from "../hooks/useResizeObserver";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { mainBody, projects, about } from "../editable-stuff/config.js";
import { NavLink } from "./home/migration";
import { Link, useLocation } from "react-router-dom";

const Navigation = React.forwardRef((props, ref) => {
  const [isTop, setIsTop] = useState(true);
  // Only the landing page has a dark hero; other routes are light from the start.
  const { pathname } = useLocation();
  const isHome = pathname === "/";
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

    /* Patterns link: "new" badge and active underline */
    .navbar .nav-link-patterns { display: inline-flex; align-items: center; gap: .4rem; }
    .navbar .nav-link-patterns.is-active .nav-item { border-bottom: 2px solid currentColor; }
    .navbar .nav-new-badge {
      font-size: .65rem; font-weight: 600; line-height: 1; padding: .2rem .4rem; border-radius: 999px;
      background: #3b82f6; color: #fff !important; text-transform: lowercase;
    }
  `;

  return (
      <Navbar
          ref={navbarMenuRef}
          className={`px-3 fixed-top ${isTop && isHome ? "navbar-transparent" : "navbar-white"}`}
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
            {about.show && (
                <NavLink className="nav-item lead" href={process.env.PUBLIC_URL + "/#aboutme"}>About</NavLink>
            )}
            <Nav.Link
              as={Link}
              to="/patterns"
              className={`nav-link-patterns${pathname === "/patterns" ? " is-active" : ""}`}
              aria-current={pathname === "/patterns" ? "page" : undefined}
            >
              <span className="nav-item lead">Patterns</span>
              <span className="nav-new-badge">new</span>
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/whiteboard"
              className={`nav-link-patterns${pathname === "/whiteboard" ? " is-active" : ""}`}
              aria-current={pathname === "/whiteboard" ? "page" : undefined}
            >
              <span className="nav-item lead">Whiteboard</span>
              <span className="nav-new-badge">new</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
  );
});

export default Navigation;