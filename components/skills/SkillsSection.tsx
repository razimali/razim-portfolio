"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { CanvasGate } from "@/components/3d/CanvasGate";
import { SceneFallback } from "@/components/3d/SceneFallback";
import { SkillLegend } from "@/components/skills/SkillLegend";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { allSkills, skillCenter } from "@/data/skills";

const SkillsScene = dynamic(() => import("@/components/3d/skills/SkillsScene"), {
  ssr: false,
  loading: () => null,
});

export function SkillsSection() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = allSkills.find((skill) => skill.id === activeId) ?? null;

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative border-t border-line/60 bg-surface/40"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-8 md:py-32">
        <Reveal>
          <SectionHeading
            id="skills-heading"
            eyebrow="SKILLS"
            title="A GROWING TECH STACK"
            description="Explore the tools and concepts I’m actively learning — organised around one core, without artificial percentages."
          />
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          <Reveal className="order-2 lg:order-1">
            <div className="glass relative h-[300px] overflow-hidden rounded-3xl sm:h-[360px] lg:h-[460px]">
              <div className="absolute inset-0 bg-[radial-gradient(65%_60%_at_50%_50%,rgba(34,211,238,0.07),transparent_70%)]" />
              <CanvasGate
                label="Interactive 3D skill ecosystem"
                className="absolute inset-0"
                fallback={<SceneFallback variant="skills" />}
              >
                <SkillsScene activeId={activeId} onHover={setActiveId} />
              </CanvasGate>
              {/* Centre-node label (DOM overlay — crisp text, no 3D font fetch) */}
              <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center select-none">
                <div className="font-display text-sm font-bold tracking-[0.3em] text-ink">
                  {skillCenter.title}
                </div>
                <div className="font-mono text-[0.55rem] tracking-[0.3em] text-accent uppercase">
                  {skillCenter.subtitle}
                </div>
              </div>
            </div>

            <div
              className="glass mt-4 rounded-2xl p-5"
              aria-live="polite"
            >
              {active ? (
                <>
                  <p className="font-mono text-[0.65rem] tracking-[0.3em] text-accent uppercase">
                    Active node
                  </p>
                  <p className="mt-1.5 font-display text-lg font-semibold text-ink">
                    {active.name}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {active.description}
                  </p>
                </>
              ) : (
                <p className="text-sm leading-relaxed text-muted">
                  Hover or focus a skill to highlight its node and connection to the
                  core.
                </p>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="order-1 lg:order-2">
            <SkillLegend activeId={activeId} onHover={setActiveId} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
