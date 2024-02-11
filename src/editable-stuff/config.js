// Navigation Bar SECTION
const navBar = {
  show: true,
};

// Main Body SECTION
const mainBody = {
  gradientColors: "#4484ce, #1ad7c0, #ff9b11, #9b59b6, #c39797, #ecf0f1",
  firstName: "Ang Yong Liang",
  middleName: "",
  lastName: "",
  message: "Passionate about building enterprise softwares",
  icons: [
    {
      image: "fa-github",
      url: "https://github.com/yl-ang",
    },
    {
      image: "fa-linkedin",
      url: "https://www.linkedin.com/in/yongliangang/",
    },
  ],
};

const about = {
  show: true,
  heading: "About Me",
  imageLink: require("../editable-stuff/yl-ang.jpg"),
  imageSize: 375,
  message:
    "My name is Ang Yong Liang. I’m an undergraduate from National University of Singapore majoring in Computer Science. My hobbies include playing pool, hiking, and CTFs.",
  resume: "https://docs.google.com/document/d/1IDXvwKZ68OKuh_XO9-e_DTV1Zv_ynELx/edit?usp=sharing",
};

// PROJECTS SECTION
const repos = {
  show: false,
  heading: "Recent Projects",
  gitHubUsername: "yl-ang",
  reposLength: 4,
  specificRepos: ["PeerPrep", "PayItForward", "BuddySplit", "SocialTraveller"],
};

// Leadership SECTION
const leadership = {
  show: false
};

// SKILLS SECTION
const skills = {
  show: true,
  heading: "Skills",
  hardSkills: [
    { name: "Java", value: 90 },
    { name: "JavaScript", value: 90 },
    { name: "Python", value: 90 },
    { name: "React", value: 90 },
    { name: "C/C++", value: 80 },
    { name: "SQL", value: 70 },
    { name: "Golang", value: 60 },
    { name: "C#", value: 60 },
  ],
  otherSkills: [
    { name: "Spring Boot", value: 90 },
    { name: "Oracle Database", value: 90 },
    { name: "AWS", value: 80 },
    { name: "Django", value: 80 },
    { name: "MongoDB", value: 70 },
    { name: "PostgreSQL", value: 60 },
    { name: "Docker", value: 60 },
    { name: "Hadoop", value: 60 },
  ],
};

// GET IN TOUCH SECTION
const getInTouch = {
  show: false,
  heading: "Get In Touch",
  message:
    "",
  email: "yongliangang@gmail.com",
};

const experiences = {
  show: true,
  heading: "Experiences",
  data: [
    {
      role: 'Software Engineer Intern',
      companylogo: require('../assets/img/paypal.png'),
      division: 'Global Compliance (Engineering)',
      date: 'Aug 2023 – Dec 2023',
    },
    {
      role: 'Summer Analyst (Software Engineer)',
      companylogo: require('../assets/img/jpmc.png'),
      division: 'Direct Custody & Clearing',
      date: 'May 2023 – Aug 2023',
    },
    {
      role: 'Software Engineer Intern',
      companylogo: require('../assets/img/govtech.jpg'),
      division: 'Ministry of Manpower',
      date: 'Jan 2023 – Jan 2023',
    },
    {
      role: 'Software Security Intern',
      companylogo: require('../assets/img/dso.png'),
      division: 'Cyber Security Laboratories',
      date: 'May 2022 – Jul 2022',
    },
    {
      role: 'Software Security Intern',
      companylogo: require('../assets/img/dso.png'),
      division: 'Cyber Security Laboratories',
      date: 'May 2021 – Jul 2021',
    },
    {
      role: 'Penetration Testing Intern',
      companylogo: require('../assets/img/dso.png'),
      division: 'Cyber Security Laboratories',
      date: 'Apr 2020 – Jul 2020',
    },
  ]
}

// Blog SECTION
const blog = {
  show: true,
};

export { navBar, mainBody, about, repos, blog, skills, leadership, getInTouch, experiences };
