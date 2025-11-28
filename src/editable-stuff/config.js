// Navigation Bar SECTION
const navBar = {
  show: true,
};

// Main Body SECTION
const mainBody = {
  gradientColors: "#000000",
  firstName: "Ang Yong Liang",
  middleName: "",
  lastName: "",
    message: "Software Engineer | Platform Engineer | Data Engineer",
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
  message: "I’m Yong Liang, a software engineer with experience in Java, JavaScript, Python, and C/C++. Currently working at JPMorgan Chase & Co., I’ve previously developed applications and enhanced security at PayPal, GovTech, and DSO National Laboratories. I hold a Bachelors in Computer Science from NUS.",
  resume: "https://docs.google.com/document/d/1IDXvwKZ68OKuh_XO9-e_DTV1Zv_ynELx/edit?usp=sharing",
};

// PROJECTS SECTION
const projects = {
  show: true,
  heading: "Projects",
  projects: [
    {
      name: "CandleSticks",
      description: "Desktop application for visualizing stock price data. It supports candlestick charting.",
      url: "https://github.com/yl-ang/CandleSticks",
      technologies: ["C++20", "SFML Graphics"],
    },
    {
      name: "unix-shell",
      description: "Command interpreter that provides a set of tools (applications): cd, pwd, ls, cat, echo, head, tail, grep, sed, find and wc. It also supports piping, semicolon operator, and IO redirection.",
      url: "https://github.com/yl-ang/unix-shell",
      technologies: ["Java 17", "Ubuntu 22.04", "JUnit", "Mockito", "GitHub Workflows"],
    },
    {
      name: "PeerPrep",
      description: "PeerPrep is a web application designed using microservices architecture for students to practice technical interviews with their peers.",
      url: "https://github.com/yl-ang/PeerPrep",
      technologies: ["React", "Node.js", "MongoDB", "AWS", "Material UI", "Docker", "Mocha", "Chai", "Jest", "Postman"],
    },
    {
      name: "static-program-analyzer",
      description: "An interactive tool that automatically answers queries about programs.",
      url: "https://github.com/yl-ang/static-program-analyzer",
      technologies: ["C++17", "CMake", "Catch2", "GitHub Workflows"],
    },
    {
      name: "PayItForward",
      description: "PayItForward is a mobile payment application that aims to encourage users to donate a small amount of money every time they make a payment.",
      url: "https://github.com/yl-ang/PayItForward",
      technologies: ["Javascript", "React Native", "UI Kitten", "Expo", "Figma"],
    },
    {
      name: "NsStayFit",
      description: "NsStayFit is an Android app developed using React-Native. The app aims to automate IPPT and NS Fit sessions, allowing NSmen to take their physical fitness tests anywhere and anytime.",
      url: "https://github.com/yl-ang/NsStayFit",
      technologies: ["Javascript", "React Native", "UI Kitten", "Tailwind CSS", "Expo", "Firebase", "Figma"],
    },
  ],
};

// Leadership SECTION
const leadership = {
  show: false
};

// SKILLS SECTION
const skills = {
  show: true,
  heading: "Technologies I used",
  categories: {
    Languages: ["Java", "JavaScript", "Python", "C/C++", "Golang", "C#"],
    Databases: ["Oracle Database", "MongoDB", "PostgreSQL", "Cassandra", "Firebase", "Elasticsearch"],
    Frameworks: ["React", "Spring Boot", "Django", "Envoy Proxy", "GraphQL", , "JUnit", "Mockito", "React Native", "Node.js", "Express.js"],
    Tools: ["AWS", "Terraform", "Google Cloud Platform", "Splunk", "Kubernetes", "Kafka", "Docker", "JProfiler", "Jenkins", "Linux"],
  },
};

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
      role: 'Software Engineer',
      company: "JPMorgan Chase & Co.",
      companylogo: require('../assets/img/jpmc.png'),
        division: 'Post Trade Engineering',
      date: 'Aug 2024 - Present',
      description: "Post Trade Engineering"
    },
    {
      role: 'Coding Mentor',
      company: "ComputhinkSG",
      companylogo: require('../assets/img/computhinksg.jpeg'),
      division: '-',
      date: 'Jan 2024 – June 2024',
      description: "Taught Scratch, Python, and algorithms to students"
    },
    {
      role: 'Teaching Assistant',
      company: "NUS Computing",
      companylogo: require('../assets/img/nus_computing.jpeg'),
      division: '-',
      date: 'Jan 2024 – June 2024',
      description: "CS4238 & CS2107"
    },
    {
      role: 'Software Engineer Intern',
      company: "PayPal",
      companylogo: require('../assets/img/paypal.png'),
      division: 'Global Compliance Engineering',
      date: 'Aug 2023 – Dec 2023',
      description: "Developed full-stack features for PayPal’s KYC Platform, meeting regulatory and business needs"
    },
    {
      role: 'Software Engineer Intern',
      company: "JPMorgan Chase & Co.",
      companylogo: require('../assets/img/jpmc.png'),
      division: 'Direct Custody & Clearing',
      date: 'May 2023 – Aug 2023',
      description: "Taiwan Sub-Custodian & Trade Settlement"
    },
    {
      role: 'Software Engineer Intern',
      company: "GovTech",
      companylogo: require('../assets/img/govtech.jpg'),
      division: 'Ministry of Manpower',
      date: 'Jan 2023 – Jan 2023',
      description: "Worked on the Tech iOSH Refresh Project, developing and standardizing UI components",
    },
    {
      role: 'Software Security Intern',
      company: 'DSO National Laboratories',
      companylogo: require('../assets/img/dso.png'),
      division: 'Cyber Security Laboratories',
      date: 'May 2022 – Jul 2022',
      description: "Windows Kernel Research (C++, Java)"
    },
    {
      role: 'Software Security Intern',
      company: 'DSO National Laboratories',
      companylogo: require('../assets/img/dso.png'),
      division: 'Cyber Security Laboratories',
      date: 'May 2021 – Jul 2021',
      description: "CVE Research (C#, Python)"
    },
    {
      role: 'Penetration Testing Intern',
      company: 'DSO National Laboratories',
      companylogo: require('../assets/img/dso.png'),
      division: 'Cyber Security Laboratories',
      date: 'Apr 2020 – Jul 2020',
      description: "Antivirus Malware Research (C++, C, Python)"
    },
  ]
}

// Blog SECTION
const blog = {
  show: true,
};

export { navBar, mainBody, about, projects, blog, skills, leadership, getInTouch, experiences };
