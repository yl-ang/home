import React from "react";
import { Jumbotron } from "./migration";
import { Container, Row, Col } from "react-bootstrap";

const Skills = React.forwardRef(({ heading, categories }, ref) => {
  return (
    <Jumbotron fluid className="bg-white m-0" id="skills">
      <Container className="p-5">
        <h2 ref={ref} className="display-4 pb-5 text-center">
          {heading}
        </h2>
        <Row className="justify-content-center">
          {Object.entries(categories).map(([category, items]) => (
            <Col key={category} md={3} className="pb-4">
              <h3 className="font-weight-bold text-start">{category}</h3>
              <ul className="text-start">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Col>
          ))}
        </Row>
      </Container>
    </Jumbotron>
  );
});

export default Skills;