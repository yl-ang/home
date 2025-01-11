import React, { useState } from 'react';
import { Col } from "react-bootstrap";

const ExperienceCard = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleLeave = () => {
    setIsHovered(false);
  };

  const cardStyle = {
    boxShadow: isHovered ? '0 0 15px rgba(0, 0, 0, 0.2)' : '0 0 0 rgba(0, 0, 0, 0)',
    transition: 'box-shadow 0.3s ease-in-out',
    cursor: 'pointer',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: isHovered ? '#f9f9f9' : '#ffffff',
  };

  return (
    <Col lg="6" className="mb-4">
      <div
        className="experience-card text-center"
        style={cardStyle}
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
      >
        <img
          className="bg-white mb-3"
          src={data.companylogo}
          alt={`${data.role} at ${data.division}`}
          // style={{ width: '80px', height: '80px', objectFit: 'contain' }}
        />
        <h5>{data.role}, {data.division}</h5>
        <p>{data.date}</p>
        {isHovered && (
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
        )}
      </div>
    </Col>
  );
};

export default ExperienceCard;