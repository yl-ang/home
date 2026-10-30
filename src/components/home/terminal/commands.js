// Terminal command registry. Output is an array of lines; a line is
// { text, kind?, href? } and is always rendered as plain text by React.
import {
  mainBody,
  about,
  projects,
  skills,
  experiences,
  getInTouch,
} from "../../../editable-stuff/config";

const line = (text, kind, href) => ({ text, kind, href });
const lines = (arr) => arr.map((t) => (typeof t === "string" ? line(t) : t));
const pad = (s, n) => s + " ".repeat(Math.max(1, n - s.length));

export const FILES = ["about.md", "projects/", "experience/", "skills.txt", "resume.pdf"];

const projectList = () => projects.projects || [];
const experienceList = () => experiences.data || [];
const skillCategories = () =>
  Object.entries(skills.categories || {}).map(([name, items]) => [
    name,
    (items || []).filter(Boolean),
  ]);

const fullName = () =>
  [mainBody.firstName, mainBody.middleName, mainBody.lastName]
    .filter(Boolean)
    .join(" ");

const projectsOut = () =>
  projectList().flatMap((p) => [
    line(`▸ ${p.name}`, "accent"),
    line(`  ${p.description}`),
    line(`  stack: ${(p.technologies || []).join(", ")}`, "muted"),
    line(`  ${p.url}`, "link", p.url),
    line(""),
  ]);

const experienceOut = () =>
  experienceList().flatMap((e) => {
    const where = e.division && e.division !== "-" ? ` (${e.division})` : "";
    return [
      line(`▸ ${e.role} @ ${e.company}${where}`, "accent"),
      line(`  ${e.date}`, "muted"),
      line(`  ${e.description}`),
      line(""),
    ];
  });

const skillsOut = () =>
  skillCategories().map(([name, items]) =>
    line(`${pad(name + ":", 12)}${items.join(", ")}`)
  );

const aboutOut = () => [
  line(`# ${about.heading}`, "accent"),
  line(""),
  line(about.message),
];

const helpOut = () => [
  line("Available commands:", "accent"),
  ...lines([
    "  help          show this message",
    "  ls [dir]      list files (try: ls projects)",
    "  cat <file>    print a file (try: cat about.md)",
    "  whoami        a short introduction",
    "  projects      things I have built",
    "  experience    where I have worked",
    "  skills        languages, tools and frameworks",
    "  date, pwd, echo <text>",
    "  clear         clear the screen (or Ctrl+L)",
  ]),
];

const lsDir = (dir, names) => [line(names.join("  "))].concat(
  names.length ? [] : [line(`ls: ${dir}: empty`, "error")]
);

const commands = {
  help: () => helpOut(),
  whoami: () => {
    const email = getInTouch && getInTouch.email;
    return [
      line(fullName(), "accent"),
      line(mainBody.message),
      line(""),
      ...(mainBody.icons || []).map((i) =>
        line(`${pad(i.image.replace("fa-", "") + ":", 10)}${i.url}`, "link", i.url)
      ),
      ...(email ? [line(`${pad("email:", 10)}${email}`)] : []),
    ];
  },
  ls: (args) => {
    const target = (args[0] || "").replace(/\/$/, "");
    if (!target) return [line(FILES.join("  "))];
    if (target === "projects") return lsDir("projects", projectList().map((p) => p.name));
    if (target === "experience")
      return lsDir("experience", [...new Set(experienceList().map((e) => e.company))]);
    if (FILES.includes(target)) return [line(target)];
    return [line(`ls: ${args[0]}: No such file or directory`, "error")];
  },
  cat: (args) => {
    if (!args.length) return [line("cat: missing file operand", "error")];
    const name = args[0];
    switch (name.replace(/\/$/, "")) {
      case "about.md":
        return aboutOut();
      case "skills.txt":
        return skillsOut();
      case "resume.pdf":
        return about.resume
          ? [line("resume.pdf ->"), line(about.resume, "link", about.resume)]
          : [line("cat: resume.pdf: unavailable", "error")];
      case "projects":
      case "experience":
        return [line(`cat: ${name}: Is a directory (try: ${name.replace(/\/$/, "")})`, "error")];
      default:
        return [line(`cat: ${name}: No such file or directory`, "error")];
    }
  },
  projects: () => projectsOut(),
  experience: () => experienceOut(),
  skills: () => skillsOut(),
  date: () => [line(new Date().toString())],
  pwd: () => [line("/home/guest")],
  echo: (args) => [line(args.join(" "))],
};

export const COMMAND_NAMES = [...Object.keys(commands), "clear"];

// Returns { clear: true } or { lines } for a raw input string.
export function runCommand(raw) {
  const [name, ...args] = raw.trim().split(/\s+/);
  if (!name) return { lines: [] };
  if (name === "clear") return { clear: true };
  const fn = Object.prototype.hasOwnProperty.call(commands, name) ? commands[name] : null;
  if (!fn) return { lines: [line(`command not found: ${name}, try help`, "error")] };
  return { lines: fn(args) };
}

// Tab completion: returns { value, options } where options lists ambiguous matches.
export function complete(input) {
  const parts = input.split(/\s+/);
  const last = parts[parts.length - 1];
  const pool =
    parts.length === 1
      ? COMMAND_NAMES
      : ["cat", "ls"].includes(parts[0])
      ? FILES
      : [];
  const matches = pool.filter((c) => c.startsWith(last));
  if (!matches.length) return { value: input, options: [] };
  let prefix = matches[0];
  matches.forEach((m) => {
    while (!m.startsWith(prefix)) prefix = prefix.slice(0, -1);
  });
  const head = parts.slice(0, -1).concat(matches.length === 1 && !prefix.endsWith("/") ? prefix + " " : prefix);
  return { value: head.join(" "), options: matches.length > 1 ? matches : [] };
}
