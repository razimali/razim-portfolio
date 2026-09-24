"use client";

import dynamic from "next/dynamic";
import { ExternalLink } from "lucide-react";

import { CanvasGate } from "@/components/3d/CanvasGate";
import { SceneFallback } from "@/components/3d/SceneFallback";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import type { Project } from "@/lib/types";

const ProjectVisual = dynamic(
  () => import("@/components/3d/project/ProjectVisual"),
  { ssr: false, loading: () => null },
);

const statusStyles: Record<Project["status"], string> = {
  Concept: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  "In progress": "border-accent/50 bg-accent/10 text-accent",
  "Learning lab": "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
};

interface ProjectCardProps {
  project: Project;
  reverse?: boolean;
}

export function ProjectCard({ project, reverse = false }: ProjectCardProps) {
  return (
    <Reveal>
      <article
        aria-labelledby={`project-${project.id}-title`}
        className="glass grid items-center gap-6 overflow-hidden rounded-3xl p-4 sm:gap-8 sm:p-6 lg:grid-cols-2 lg:gap-10"
      >
        <div
          className={cn(
            "relative h-[240px] overflow-hidden rounded-2xl border border-line bg-void sm:h-[300px] lg:h-[340px]",
            reverse && "lg:order-2",
          )}
        >
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_50%,rgba(56,189,248,0.06),transparent_70%)]" />
          <CanvasGate
            label={`${project.title} interactive visualization`}
            className="absolute inset-0"
            rootMargin="70% 0px"
            fallback={<SceneFallback variant="project" />}
          >
            <ProjectVisual variant={project.visual} />
          </CanvasGate>
          <span className="absolute top-3 left-3 font-mono text-[0.65rem] tracking-[0.3em] text-dim">
            PROJECT {project.index}
          </span>
        </div>

        <div className={cn("px-1 py-2 sm:px-2", reverse && "lg:order-1")}>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-[0.6rem] tracking-[0.2em] uppercase",
                statusStyles[project.status],
              )}
            >
              {project.status}
            </span>
            <span className="font-mono text-[0.65rem] tracking-[0.2em] text-dim uppercase">
              {project.category}
            </span>
          </div>

          <h3
            id={`project-${project.id}-title`}
            className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            {project.title}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
            {project.description}
          </p>

          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
            {project.technologies.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-line bg-white/[0.03] px-2.5 py-1 font-mono text-[0.62rem] tracking-wide text-muted"
              >
                {tech}
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-4 border-t border-line pt-5">
            <div>
              <dt className="font-mono text-[0.62rem] tracking-[0.3em] text-accent uppercase">
                Problem
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted">
                {project.problem}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[0.62rem] tracking-[0.3em] text-accent-2 uppercase">
                Solution
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted">
                {project.solution}
              </dd>
            </div>
          </dl>

          {project.links.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {project.links.map((link) => {
                const Icon = link.label === "GitHub" ? GithubIcon : ExternalLink;

                if (!link.href) {
                  return (
                    <span
                      key={link.label}
                      aria-disabled="true"
                      className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-line bg-white/[0.02] px-4 py-2 font-mono text-[0.65rem] tracking-[0.2em] text-dim uppercase"
                      title="Repository link coming soon"
                    >
                      <Icon size={13} aria-hidden />
                      {link.label} — coming soon
                    </span>
                  );
                }

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-4 py-2 font-mono text-[0.65rem] tracking-[0.2em] text-ink uppercase transition hover:border-accent hover:bg-accent/20"
                  >
                    <Icon size={13} aria-hidden />
                    {link.label}
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>
      </article>
    </Reveal>
  );
}
