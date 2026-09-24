export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  skills: Skill[];
}

export type ProjectVisualVariant = "finance" | "pipeline" | "network";

export type ProjectStatus = "Concept" | "In progress" | "Learning lab";

export interface ProjectLink {
  label: string;
  /** null = not published yet; rendered as a disabled placeholder */
  href: string | null;
}

export interface Project {
  id: string;
  index: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  problem: string;
  solution: string;
  status: ProjectStatus;
  links: ProjectLink[];
  visual: ProjectVisualVariant;
}

export interface JourneyStage {
  id: string;
  title: string;
  description: string;
}

export interface LearningCard {
  id: string;
  title: string;
  description: string;
  icon: "code" | "network" | "brain" | "layers";
}

export interface MindsetModule {
  id: string;
  title: string;
  description: string;
}

export interface SocialLink {
  label: string;
  /** null = placeholder until a real profile URL is provided */
  href: string | null;
}

export type DeviceTier = "high" | "medium" | "low";
