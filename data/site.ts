import type {
  LearningCard,
  MindsetModule,
  NavItem,
  SocialLink,
} from "@/lib/types";

export const site = {
  name: "Razim Khokhar",
  initials: "RK",
  role: "Computer Science Student",
  identity:
    "Computer Science Student | Python Developer | AI & Automation Enthusiast | Networking",
  location: "Pakistan",
  education: {
    degree: "BS Computer Science",
    school: "Government College University Hyderabad",
  },
  email: "razimalikhohkhar@gmail.com",
  headline: "Computer Science Student Building Intelligent Software.",
  tagline: "Python • AI Engineering • Automation • Networking",
  description:
    "I’m a computer science student focused on building practical software, intelligent AI-powered systems, and automation tools while continuously strengthening my foundations in computer science and engineering.",
  seo: {
    title: "Razim Khokhar | Computer Science Student & AI Engineering Enthusiast",
    description:
      "Portfolio of Razim Khokhar, a Computer Science student focused on Python, AI engineering, automation, software development and networking.",
  },
  portrait: {
    src: "/images/razim-khokhar.jpg",
    alt: "Razim Khokhar — portrait",
    labels: ["AI ENGINEERING", "PYTHON", "AUTOMATION", "NETWORKING"],
  },
  focusAreas: [
    "Python",
    "AI Engineering",
    "Automation",
    "Networking",
    "Full-Stack Web",
    "Backend & APIs",
    "Linux",
    "SQL & Data",
  ],
} as const;

export const navItems: NavItem[] = [
  { id: "home", label: "HOME", href: "#home" },
  { id: "about", label: "ABOUT", href: "#about" },
  { id: "skills", label: "SKILLS", href: "#skills" },
  { id: "projects", label: "PROJECTS", href: "#projects" },
  { id: "journey", label: "JOURNEY", href: "#journey" },
  { id: "contact", label: "CONTACT", href: "#contact" },
];

export const aboutParagraphs: string[] = [
  "I’m a Computer Science student passionate about understanding how software systems work and turning ideas into practical applications.",
  "My current learning path combines Python development, AI engineering, automation, networking, software engineering, and core computer science concepts.",
  "I enjoy learning by building—experimenting with APIs, AI models, automation workflows, networking labs, and software projects.",
  "My long-term goal is to develop strong engineering fundamentals while working on intelligent systems that solve real-world problems.",
];

export const currentlyLearning: LearningCard[] = [
  {
    id: "python",
    title: "Python",
    description:
      "Deepening programming, scripting and automation skills.",
    icon: "code",
  },
  {
    id: "ccna",
    title: "CCNA",
    description:
      "Building practical networking knowledge through Cisco labs.",
    icon: "network",
  },
  {
    id: "ai-engineering",
    title: "AI Engineering",
    description:
      "Learning AI model integration, APIs, LLM applications and intelligent automation.",
    icon: "brain",
  },
  {
    id: "software-engineering",
    title: "Software Engineering",
    description:
      "Strengthening DSA, OOP, Git, Linux, SQL, APIs and backend fundamentals.",
    icon: "layers",
  },
];

export const mindset: MindsetModule[] = [
  {
    id: "build",
    title: "BUILD",
    description: "Turn concepts into working projects.",
  },
  {
    id: "understand",
    title: "UNDERSTAND",
    description: "Focus on fundamentals rather than blindly using tools.",
  },
  {
    id: "experiment",
    title: "EXPERIMENT",
    description: "Test technologies through practical experimentation.",
  },
  {
    id: "improve",
    title: "IMPROVE",
    description: "Continuously refine knowledge, projects and engineering practices.",
  },
];

export const socialLinks: SocialLink[] = [
  { label: "LinkedIn", href: null },
  { label: "GitHub", href: null },
];
