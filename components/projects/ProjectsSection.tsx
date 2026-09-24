"use client";

import { ProjectCard } from "@/components/projects/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/data/projects";

export function ProjectsSection() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative border-t border-line/60"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-8 md:py-32">
        <Reveal>
          <SectionHeading
            id="projects-heading"
            eyebrow="PROJECTS"
            title="PROJECTS IN PROGRESS"
            description="Honest, student-level work — concepts, learning labs and practical experiments rather than finished commercial products."
          />
        </Reveal>

        <div className="space-y-8 md:space-y-10">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              reverse={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
