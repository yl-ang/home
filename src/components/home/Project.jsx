import React from "react";
import Container from "react-bootstrap/Container";
import { Jumbotron } from "./migration";
import Row from "react-bootstrap/Row";
import ProjectCard from "./ProjectCard";

const Project = ({ heading, projects }) => {
  return (
    <Jumbotron fluid id="projects" className="bg-light m-0">
      <Container>
        <h2 className="display-4 pb-5 text-center">{heading}</h2>
        <Row>
          {projects?.length > 0 ? (
            projects.map((project, index) => (
              <ProjectCard
                key={`project-card-${index}`}
                value={project}
              />
            ))
          ) : (
            <p className="text-center">No projects available.</p>
          )}
        </Row>
      </Container>
    </Jumbotron>
  );
};

export default Project;