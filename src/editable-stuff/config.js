// Navigation Bar SECTION
const navBar = {
  show: true,
};

// Main Body SECTION
const mainBody = {
  gradientColors: "#4484ce, #1ad7c0, #ff9b11, #9b59b6,rgb(215, 108, 108),rgb(231, 0, 146)",
  firstName: "Ang Yong Liang",
  middleName: "",
  lastName: "",
  message: "Software Engineer | Full Stack Developer | Cyber Security Enthusiast",
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
      url: "https://github.com/yl-ang/PayItForward",
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
      role: 'Software Engineer I',
      company: "JPMorgan Chase & Co.",
      companylogo: require('../assets/img/jpmc.png'),
      division: 'Post Trade Technology',
      date: 'Aug 2024 - Present',
      description: "Part of Platform Engineering Team within Post Trade Technology, enhancing resilience, scalability, and performance of distributed services supporting business clients",
      bulletPoints: [
        "Implemented resiliency, and performance improvement features with Spring Boot, and React microservices",
        "Diagnosed and resolved service failures and live issues, using tools like Kubernetes, Splunk, Postman, and Linux to pinpoint root causes and propose solutions"
      ]
    },
    {
      role: 'Software Engineer Intern',
      company: "PayPal",
      companylogo: require('../assets/img/paypal.png'),
      division: 'Global Compliance (Engineering)',
      date: 'Aug 2023 – Dec 2023',
      description: "Worked with Global Compliance team to deliver reconciliation features for internal teams and users",
      bulletPoints: [
        "Built frontend (ReactJs, TypeScript) and backend (Spring Boot, Java, Python, Oracle DB) capabilities, including search, inactive account deactivation, and automated email notifications",
        "Collaborated with API team, leveraging OpenAPI, to update and refine platform’s existing API specification",
        "Developed and tested SQL scripts for applying, verifying, and rolling back oracle database changes",
      ]
    },
    {
      role: 'Software Engineer Intern',
      company: "JPMorgan Chase & Co.",
      companylogo: require('../assets/img/jpmc.png'),
      division: 'Direct Custody & Clearing',
      date: 'May 2023 – Aug 2023',
      description: "Collaborated with Securities Services team to deliver custody and depositary services for business clients",
      bulletPoints: [
        "Improved customer relationship management tool with new Elasticsearch functionality (ReactJs, TypeScript), reducing search time by 80%",
        "Created SpringBoot microservices to map SWIFT messages, processing up to 30,000 messages monthly"
      ]
    },
    {
      role: 'Software Engineer Intern',
      company: "GovTech",
      companylogo: require('../assets/img/govtech.jpg'),
      division: 'Ministry of Manpower',
      date: 'Jan 2023 – Jan 2023',
      description: "Worked on the Tech iOSH Refresh Project, developing and standardizing UI components.",
    },
    {
      role: 'Software Security Intern',
      company: 'DSO National Laboratories',
      companylogo: require('../assets/img/dso.png'),
      division: 'Cyber Security Laboratories',
      date: 'May 2022 – Jul 2022',
      description: "Researched into Microsoft Kernel Driver CVEs, performed root cause analysis on systems",
      bulletPoints: [
        "Reviewed Windows driver code and API endpoints using Ghidra, IdaPro, and WinDbg",
        "Built C++ proof-of-concept scripts with Win32 APIs, tested in sandboxed VMs to ensure security and stability",
        "Created Java program for taint analysis, identifying common program vulnerabilities"
      ]
    },
    {
      role: 'Software Security Intern',
      company: 'DSO National Laboratories',
      companylogo: require('../assets/img/dso.png'),
      division: 'Cyber Security Laboratories',
      date: 'May 2021 – Jul 2021',
      description: "Researched into Microsoft Outlook CVEs, performed root cause analysis on systems",
      bulletPoints: [
        "Developed Python plugins for tools like Metasploit and Core Impact, enhance enterprise penetration testing capabilities",
        "Reversed engineered C# applications using DnSpy, identifying and patching vulnerabilities",
        "Analyzed post-exploitation techniques employed by adversaries such as ransomware and crypto mining, gaining insights into emerging threats and vulnerabilities"
      ]
    },
    {
      role: 'Penetration Testing Intern',
      company: 'DSO National Laboratories',
      companylogo: require('../assets/img/dso.png'),
      division: 'Cyber Security Laboratories',
      date: 'Apr 2020 – Jul 2020',
      description: "Researched into antivirus software, penetration testing, and malware analysis",
      bulletPoints: [
        "Utilized metasploit to create custom payloads and exploits, testing against antivirus software",
        "Developed Kernel drivers in C/C++ to assess antivirus software detection capabilities",
        "Created custom python scripts to automate penetration testing tasks"
      ]
    },
  ]
}

// Blog SECTION
const blog = {
  show: true,
};

export { navBar, mainBody, about, projects, blog, skills, leadership, getInTouch, experiences };
