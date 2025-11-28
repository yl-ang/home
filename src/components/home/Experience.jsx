import React, { useState } from 'react';
import ExperienceCard from "./ExperienceCard";
import { Jumbotron } from './migration';
import {
  Container,
  Row,
} from "react-bootstrap";

const SHOW_LIMIT = 4;

const Experience = ({ experiences = { heading: '', data: [] } }) => {
  const [expanded, setExpanded] = useState(false);

  const items = experiences.data || [];
  const visibleItems = expanded ? items : items.slice(0, SHOW_LIMIT);
  const remainingCount = Math.max(0, items.length - SHOW_LIMIT);

  return (
      <section fluid id="experiences" className="section">
        <Container>
          <Jumbotron className="bg-white">
            <h2 className="display-4 mb-5 text-center">
              {experiences.heading}
            </h2>
            <Row>
              {
                visibleItems.map((data, index) => {
                  return <ExperienceCard key={index} data={data} />
                })
              }
            </Row>

            {items.length > SHOW_LIMIT && (
                <div className="text-center mt-3">
                  {!expanded ? (
                      <button
                          type="button"
                          className="btn btn-link"
                          onClick={() => setExpanded(true)}
                          aria-expanded="false"
                      >
                        … Show more ({remainingCount})
                      </button>
                  ) : (
                      <button
                          type="button"
                          className="btn btn-link"
                          onClick={() => setExpanded(false)}
                          aria-expanded="true"
                      >
                        Show less
                      </button>
                  )}
                </div>
            )}
          </Jumbotron>
        </Container>
      </section>
  );
}

export default Experience;