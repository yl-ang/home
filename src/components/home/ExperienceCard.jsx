import React from 'react';
import { Row, Col } from "react-bootstrap";

const ExperienceCard = ({ data }) => {
  const cardStyle = {
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    transition: 'box-shadow 0.3s ease-in-out',
    cursor: 'default',
    border: '1px solid rgba(0, 0, 0, 0.5)', 
  };

  return (
    <Col lg="12" className="mb-4">
      <div className="experience-card" style={cardStyle}>
        <Row className="align-items-center">
          {/* Logo Column */}
          <Col lg="4" md="5" className="text-center">
            <img
              className="bg-white"
              src={data.companylogo}
              alt={`${data.role} at ${data.division}`}
              style={{ width: '100%', maxWidth: '120px', objectFit: 'contain' }}
            />
          </Col>

          {/* Details Column */}
          <Col lg="8" md="7">
            <h5>{data.role}, {data.company}</h5>
            <p>{data.date}</p>
            <div className="description">
              <p>{data.description}</p>
              {data.bulletPoints && data.bulletPoints.length > 0 && (
                <ul style={{ textAlign: 'left', marginTop: '15px' }}>
                  {data.bulletPoints.map((point, index) => (
                    <li key={index} style={{ marginBottom: '10px' }}>
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </Col>
  );
};

export default ExperienceCard;