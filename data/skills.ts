import type { SkillCategory } from "@/lib/types";

export const skillCategories: SkillCategory[] = [
  {
    id: "programming",
    label: "Programming",
    skills: [
      {
        id: "python",
        name: "Python",
        description: "Primary language for scripting, automation and AI experiments.",
      },
      {
        id: "cpp",
        name: "C++",
        description: "Used for core programming and data structures practice.",
      },
      {
        id: "java",
        name: "Java",
        description: "Object-oriented programming and coursework foundations.",
      },
      {
        id: "sql",
        name: "SQL",
        description: "Querying and modelling data in relational databases.",
      },
    ],
  },
  {
    id: "development",
    label: "Development",
    skills: [
      {
        id: "fullstack",
        name: "Full-Stack Web",
        description: "Building complete web applications end to end.",
      },
      {
        id: "backend",
        name: "Backend Development",
        description: "Server-side logic, structure and data flow.",
      },
      {
        id: "apis",
        name: "APIs",
        description: "Designing and consuming HTTP APIs between services.",
      },
      {
        id: "git",
        name: "Git",
        description: "Version control and collaborative workflows.",
      },
      {
        id: "linux",
        name: "Linux",
        description: "Command-line development and system fundamentals.",
      },
      {
        id: "databases",
        name: "Database Fundamentals",
        description: "Schema design, relationships and basic optimisation.",
      },
    ],
  },
  {
    id: "ai",
    label: "AI / Intelligence",
    skills: [
      {
        id: "ai-integration",
        name: "AI Model Integration",
        description: "Connecting applications to AI models and services.",
      },
      {
        id: "genai",
        name: "Generative AI",
        description: "Working with generative models in practical contexts.",
      },
      {
        id: "ai-apis",
        name: "AI APIs",
        description: "Calling hosted AI APIs from applications and scripts.",
      },
      {
        id: "automation",
        name: "Automation",
        description: "Scripting repeatable workflows to remove manual effort.",
      },
      {
        id: "local-ai",
        name: "Local AI Experiments",
        description: "Running and testing models on local machines.",
      },
      {
        id: "ollama",
        name: "Ollama",
        description: "Serving and experimenting with local LLMs.",
      },
      {
        id: "llm-apps",
        name: "LLM Applications",
        description: "Building interfaces around language model outputs.",
      },
    ],
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    skills: [
      {
        id: "networking",
        name: "Computer Networking",
        description: "Routing, switching and network design concepts.",
      },
      {
        id: "ccna",
        name: "CCNA",
        description: "Studying Cisco networking fundamentals and exam topics.",
      },
      {
        id: "packet-tracer",
        name: "Cisco Packet Tracer",
        description: "Building and testing simulated network topologies.",
      },
      {
        id: "windows",
        name: "Windows",
        description: "Daily development and tooling environment.",
      },
    ],
  },
  {
    id: "other",
    label: "Other",
    skills: [
      {
        id: "data-analysis",
        name: "Data Analysis",
        description: "Exploring and summarising datasets with Python.",
      },
      {
        id: "web-scraping",
        name: "Web Scraping",
        description: "Extracting structured data from the web.",
      },
      {
        id: "python-scripting",
        name: "Python Scripting",
        description: "Small tools that automate repetitive tasks.",
      },
      {
        id: "office",
        name: "Microsoft Office",
        description: "Documentation, spreadsheets and presentations.",
      },
    ],
  },
];

/** Flat list used to place nodes in the 3D skill ecosystem. */
export const allSkills = skillCategories.flatMap((category) =>
  category.skills.map((skill) => ({ ...skill, categoryId: category.id })),
);

export const skillCenter = {
  title: "RAZIM",
  subtitle: "TECH STACK",
};
