import React from "react";
import Terminal from "./terminal/Terminal";
import MatrixBackdrop from "./MatrixBackdrop";
import { skills } from "../../editable-stuff/config";
import "./AboutMe.css";

// Short bullet lines beside the photo.
const HIGHLIGHTS = [
  "Software · Platform · Data Engineer",
  "JPMorgan · Post Trade Engineering",
  "NUS · Computer Science",
];

// Company names to emphasise inside the intro paragraph.
const INTRO = [
  "I am ",
  ["Yong Liang"],
  ", a software engineer who has contributed to engineering and security projects at ",
  ["JPMorgan"],
  ", ",
  ["PayPal"],
  ", ",
  ["GovTech"],
  " and ",
  ["DSO"],
  ". Poke around the terminal to get to know me.",
];

// `link` is the photo URL from config; without it a placeholder circle shows.
const AboutMe = ({ heading, link }) => {
  const languages = (skills.categories.Languages || []).filter(Boolean);
  const [photoOk, setPhotoOk] = React.useState(Boolean(link));

  return (
    <section id="aboutme" className="about" aria-labelledby="about-heading">
      <MatrixBackdrop />
      <div className="about__inner">
        <div className="about__text">
          <p className="about__label">// about.md</p>
          <h2 id="about-heading" className="about__heading">{heading}</h2>

          <div className="about__id">
            <div className="about__photo">
              {photoOk ? (
                <img src={link} alt="Portrait of Yong Liang" onError={() => setPhotoOk(false)} />
              ) : (
                <span className="about__photo-ph">swap in your photo (circle crop)</span>
              )}
            </div>
            <ul className="about__bullets">
              {HIGHLIGHTS.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>

          <p className="about__intro">
            {INTRO.map((part, i) =>
              Array.isArray(part) ? <strong key={i}>{part[0]}</strong> : part
            )}
          </p>

          <ul className="about__chips" aria-label="Languages">
            {languages.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>

        <div className="about__terminal">
          <Terminal />
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
