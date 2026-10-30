import React from "react";

const ProjectCard = ({ value }) => {
  const { name, description, url, technologies = [] } = value;
  const slug = name.toLowerCase();
  return (
    <article className="projects__card">
      <p className="projects__path">
        <span className="projects__dot" aria-hidden="true" />
        ~/projects/{slug}
      </p>
      <h3 className="projects__title">{name}</h3>
      <p className="projects__desc">{description}</p>
      <ul className="projects__tags" aria-label={`${name} tech stack`}>
        {technologies.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
      <hr className="projects__rule" />
      <a
        className="projects__btn"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View ${name} project (opens in a new tab)`}
      >
        View Project <span aria-hidden="true">→</span>
      </a>
    </article>
  );
};

export default ProjectCard;
