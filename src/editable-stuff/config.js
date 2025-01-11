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
    "My name is Ang Yong Liang. I graduated from National University of Singapore with a Bachelor of Computing in Computer Science.",
  resume: "https://docs.google.com/document/d/1IDXvwKZ68OKuh_XO9-e_DTV1Zv_ynELx/edit?usp=sharing",
};

// PROJECTS SECTION
const repos = {
  show: true,
  heading: "Recent Projects",
  gitHubUsername: "yl-ang",
  reposLength: 4,
  specificRepos: ["CandleSticks", "static-program-analyzer", "unix-shell", "PeerPrep", "PayItForward", "BuddySplit"],
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
      role: 'Software Engineer I',
      companylogo: require('../assets/img/jpmc.png'),
      division: 'Post Trade Technology',
      date: 'Aug 2024 - Present',
      description: "Part of Platform Engineering Team, enhancing resilience, scalability, and performance of distributed services supporting 2,500+ users",
      bulletPoints: [
        "Implemented resiliency improvements with Spring Boot, including Retry templates and Aspects, increasing Elasticsearch operation reliability by 90% in handling network errors",
        "Configured API Gateway with Envoy proxy and Apollo GraphQL Server, preventing approximately invalid OAuth requests from reaching back-end services",
        "Diagnosed and resolved service failures and live issues, using tools like Kubernetes, Splunk, Postman, and Linux to pinpoint root causes and propose solutions"
      ]
    },
    {
      role: 'Software Engineer Intern',
      companylogo: require('../assets/img/paypal.png'),
      division: 'Global Compliance (Engineering)',
      date: 'Aug 2023 – Dec 2023',
      description: "Worked with Global Compliance team to deliver reconciliation features for internal teams and users",
      bulletPoints: [
        "Built frontend (ReactJs, TypeScript) and backend (Spring Boot, Java, Python, Oracle DB) capabilities, including search, inactive account deactivation, and automated email notifications",
        "Collaborated with API team, leveraging OpenAPI, to update and refine platform’s existing API specification",
        "Developed and tested SQL scripts for applying, verifying, and rolling back oracle database changes",
        "Identified and resolved legacy codebase issues, reducing technical debt from 30% to 6%, as measured by SonarQube"
      ]
    },
    {
      role: 'Summer Analyst (Software Engineer)',
      companylogo: require('../assets/img/jpmc.png'),
      division: 'Direct Custody & Clearing',
      date: 'May 2023 – Aug 2023',
      description: "Collaborated with Securities Services team to deliver custody and depositary services for business clients",
      bulletPoints: [
        "Improved customer relationship management tool with new Elasticsearch functionality (ReactJs, TypeScript), reducing search time by 80%",
        "Created SpringBoot microservices to map SWIFT messages, processing up to 30,000 messages monthly",
        "Developed Mockito and JUnit tests, increasing code coverage by 79%"
      ]
    },
    {
      role: 'Software Engineer Intern',
      companylogo: require('../assets/img/govtech.jpg'),
      division: 'Ministry of Manpower',
      date: 'Jan 2023 – Jan 2023',
      description: "Worked on the Tech iOSH Refresh Project, developing and standardizing UI components.",
    },
    {
      role: 'Software Security Intern',
      companylogo: require('../assets/img/dso.png'),
      division: 'Cyber Security Laboratories',
      date: 'May 2022 – Jul 2022',
      description: "Researched into Microsoft Kernel Driver CVEs, performed root cause analysis on systems",
      bulletPoints: [
        "Implemented n-day exploitation techniques, including buffer overflows and heap spraying, to exploit Microsoft kernel driver vulnerabilities",
        "Reviewed Windows driver code and API endpoints using Ghidra, IdaPro, and WinDbg",
        "Built C++ proof-of-concept scripts with Win32 APIs, tested in sandboxed VMs to ensure security and stability",
        "Created Java program for taint analysis, identifying common program vulnerabilities"
      ]
    },
    {
      role: 'Software Security Intern',
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

export { navBar, mainBody, about, repos, blog, skills, leadership, getInTouch, experiences };
