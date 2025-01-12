import React, { useState, useEffect, useCallback } from "react";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Skeleton from "react-loading-skeleton";
import axios from "axios";

const ProjectCard = ({ value }) => {
  const { name, description, url, technologies } = value;
  return (
    <Col md={6}>
      <Card className="card shadow-lg p-3 mb-5 bg-white rounded">
        <Card.Body>
          <Card.Title as="h5">{name}</Card.Title>
          <Card.Text>{description}</Card.Text>
          <div>
            {technologies.map((tech, i) => (
              <span key={i} className="badge bg-secondary me-1">
                {tech}
              </span>
            ))}
          </div>
          <hr />
          <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            View Project
          </a>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProjectCard;
