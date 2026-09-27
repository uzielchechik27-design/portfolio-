export type NavItem = {
  href: string;
  label: string;
};

export type JourneyEntry = {
  id: string;
  period: string;
  organization: string;
  role: string;
  category: string;
  summary: string;
};

export type Project = {
  slug: string;
  index: string;
  title: string;
  subtitle: string;
  stack: string[];
  summary: string;
  notes: string[];
};

export type SkillGroup = {
  title: string;
  items: string[];
};

export const site = {
  name: "Uziel Chechik",
  shortName: "UC",
  role: "Junior Software Engineer",
  location: "Israel",
  availability: "Open to full-time roles",
  headline: "Reliable systems. AI-native workflows. No quiet failures.",
  summary:
    "Junior Software Engineer with practical experience building full-stack applications, backend systems, and AI-driven automation tools using Java, Python (FastAPI), React, and GenAI. Focused on system reliability, clean OOP design, and integrating Large Language Models to solve complex workflows.",
  email: "Uzielchechik27@gmail.com",
  seeking: "Seeking a full-time Junior Software Engineer position.",
  languages: [
    { name: "Hebrew", level: "Native" },
    { name: "English", level: "Fluent" },
  ],
} as const;

export const navItems: NavItem[] = [
  { href: "/#about", label: "About" },
  { href: "/#journey", label: "Journey" },
  { href: "/work", label: "Work" },
  { href: "/#contact", label: "Contact" },
];

export const capabilities = [
  "Java",
  "Python",
  "FastAPI",
  "React",
  "JavaScript",
  "SQL",
  "C++",
  "GenAI",
  "REST APIs",
  "System Design",
  "OOP",
  "Linux",
];

export const stats = [
  { value: "2017–22", label: "Maglan team lead" },
  { value: "2022–Now", label: "Chevron offshore security" },
  { value: "03", label: "Selected projects" },
  { value: "2027", label: "B.Sc. Computer Science" },
];

export const about = {
  kicker: "Profile",
  title: "About me",
  lead: "Precision under pressure, translated into software.",
  body: [
    "I build full-stack architectures and AI automation with the same operating standard I learned in high-stakes environments: clear ownership, rigorous checks, and systems that hold when it matters.",
    "From 2017 to 2022 I led tactical teams in the IDF Maglan Unit. Since 2022 I have operated in a safety-critical setting at Chevron Israel on an offshore platform — compliance, risk assessment, and intense teamwork as daily practice.",
    "In parallel I am completing a B.Sc. in Computer Science at the Open University of Israel (2022–2027), and building projects across vision pipelines, agentic workflows, and backends.",
  ],
};

export const journey: JourneyEntry[] = [
  {
    id: "maglan",
    period: "2017 — 2022",
    organization: "IDF · Maglan Unit",
    role: "Team Leader",
    category: "Command",
    summary:
      "Led tactical teams in high-stakes operational missions. Leadership, rapid decision-making, and complete ownership under pressure.",
  },
  {
    id: "chevron",
    period: "2022 — Present",
    organization: "Chevron Israel",
    role: "Offshore Platform Security",
    category: "Operations",
    summary:
      "Operating in a safety-critical environment that demands high precision, rigorous compliance, risk assessment, and intense teamwork.",
  },
  {
    id: "openu",
    period: "2022 — 2027",
    organization: "Open University of Israel",
    role: "B.Sc. Computer Science",
    category: "Education",
    summary:
      "Formal CS foundation alongside project work in Java, Python, React, and LLM-backed systems. Degree in progress.",
  },
];

export const projects: Project[] = [
  {
    slug: "calorie-ai",
    index: "01",
    title: "CalorieAI",
    subtitle: "AI-native nutrition platform",
    stack: ["React", "Python", "FastAPI", "Google Gemini"],
    summary:
      "A FastAPI and React project that turns food photos into structured nutritional data through a vision pipeline.",
    notes: [
      "Built a Python (FastAPI) and React application, using agentic workflows across the development lifecycle.",
      "Engineered a vision pipeline using the Google Gemini API to convert raw user photos into structured nutritional datasets.",
    ],
  },
  {
    slug: "exam-solver",
    index: "02",
    title: "Automatic Exam Solver",
    subtitle: "Hierarchical LLM document engine",
    stack: ["Python", "Google GenAI", "Pandas", "Scikit-learn"],
    summary:
      "An AI tool that turns a single test prompt into a formatted, step-by-step Microsoft Word solution.",
    notes: [
      "Engineered an AI tool that transforms a single test prompt into a fully formatted, step-by-step solution document in Microsoft Word.",
      "Designed a hierarchical LLM pipeline where a Master Agent delegates tasks to specialized, topic-specific agents to compile comprehensive exam solutions.",
      "Integrated Google GenAI with a custom document builder (python-docx) to automatically generate bilingual reports, complete with native LaTeX-to-Word equations and DataFrame tables.",
      "Backed the AI agents with a Python calculation engine (pandas, scikit-learn, networkx) so data-mining calculations run in code alongside the written solution.",
    ],
  },
  {
    slug: "clinic-os",
    index: "03",
    title: "Cosmetics Clinic OS",
    subtitle: "Clinic operations backend",
    stack: ["Java", "Python", "REST APIs", "SQL"],
    summary:
      "A backend for appointment scheduling, treatment tracking, and customer records for an aesthetic clinic.",
    notes: [
      "Built a backend for appointment scheduling, treatment tracking, and customer records management for an aesthetic clinic.",
      "Leveraged modern AI-driven tools (Cursor, GitHub Copilot, ChatGPT) to accelerate architecture design, code refactoring, and test-driven development.",
      "Implemented RESTful endpoints, database schemas, and data validation for scheduling, treatment tracking, and customer records.",
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages & Frameworks",
    items: ["Java", "Python (FastAPI)", "React", "JavaScript", "SQL", "C++"],
  },
  {
    title: "Core & Systems",
    items: [
      "AI Integration",
      "Prompt Engineering",
      "REST APIs",
      "Data Structures",
      "OOP",
      "System Design",
      "Git",
      "Linux",
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export const githubUrl = "https://github.com/uzielchechik27-design";

/** TODO: Fill in the public LinkedIn profile URL. */
export const linkedInUrl: string = "";

export function emailHref(): string {
  return `mailto:${site.email}`;
}

export function profileLinks(): Array<{ href: string; label: string }> {
  const links = [{ href: githubUrl, label: "GitHub" }];
  if (linkedInUrl.startsWith("https://")) {
    links.push({ href: linkedInUrl, label: "LinkedIn" });
  }
  return links;
}
