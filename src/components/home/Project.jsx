import React, { useMemo, useState } from "react";
import ProjectCard from "./ProjectCard";
import "./Project.css";

const Project = ({ heading, message, projects = [] }) => {
  const [active, setActive] = useState("all");

  // Filter list is built from the `languages` field of the project data.
  const filters = useMemo(
    () => [...new Set(projects.flatMap((p) => p.languages || []))],
    [projects]
  );
  const visible =
    active === "all"
      ? projects
      : projects.filter((p) => (p.languages || []).includes(active));

  return (
    <section id="projects" className="projects" aria-labelledby="projects-heading">
      <div className="projects__inner">
        <p className="projects__label">{"// projects/"}</p>
        <h2 id="projects-heading" className="projects__heading">{heading}</h2>
        {message && <p className="projects__sub">{message}</p>}

        {projects.length > 0 ? (
          <>
            <div className="projects__bar">
              <div className="projects__filters" role="group" aria-label="Filter projects by language">
                {["all", ...filters].map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={`projects__pill${active === f ? " is-active" : ""}`}
                    aria-pressed={active === f}
                    onClick={() => setActive(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <p className="projects__count" aria-live="polite">
                {visible.length} {visible.length === 1 ? "project" : "projects"}
              </p>
            </div>

            <ul className="projects__grid">
              {visible.map((project) => (
                <li key={project.name}>
                  <ProjectCard value={project} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="projects__empty">No projects available.</p>
        )}
      </div>
    </section>
  );
};

export default Project;
