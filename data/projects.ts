import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    id: "hisab",
    index: "01",
    title: "HISAB",
    category: "Software / Finance / Productivity",
    description:
      "A money-management application concept designed for shared living situations — tracking shared expenses, loans between people, personal spending, balances, savings and reminders in one place.",
    technologies: ["Python", "Data modelling", "APIs", "Automation"],
    problem:
      "Tracking small debts and shared expenses among roommates becomes difficult.",
    solution:
      "A simple application that records, organizes, and reminds users about money they owe or are owed.",
    status: "Concept",
    links: [{ label: "GitHub", href: null }],
    visual: "finance",
  },
  {
    id: "local-llm",
    index: "02",
    title: "AI / Local LLM Experimentation",
    category: "AI Engineering",
    description:
      "Experimenting with locally running AI models and integrating them into useful applications and workflows — exploring the path from user input to application logic, model inference and response.",
    technologies: ["Python", "Ollama", "Local LLMs", "AI interfaces", "Automation"],
    problem:
      "Cloud AI tools are useful, but understanding what happens between a user request and a model response requires hands-on local experimentation.",
    solution:
      "Build small interfaces around locally running models to study prompting, context handling and workflow automation — without claiming production-level systems.",
    status: "Learning lab",
    links: [{ label: "GitHub", href: null }],
    visual: "pipeline",
  },
  {
    id: "networking-labs",
    index: "03",
    title: "Networking Labs",
    category: "Networking / Infrastructure",
    description:
      "Hands-on Cisco Packet Tracer labs covering VLANs, STP, EtherChannel, routing, OSPF, EIGRP, static routes, subnetting and network topology design.",
    technologies: ["Cisco Packet Tracer", "CCNA concepts"],
    problem:
      "Networking theory only becomes practical when topologies are built, configured and debugged end to end.",
    solution:
      "Design simulated networks, configure devices, and trace packet paths to build real intuition for routing and switching.",
    status: "Learning lab",
    links: [],
    visual: "network",
  },
];
