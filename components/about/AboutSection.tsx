"use client";

import dynamic from "next/dynamic";
import { GraduationCap, MapPin, Target } from "lucide-react";

import { CanvasGate } from "@/components/3d/CanvasGate";
import { SceneFallback } from "@/components/3d/SceneFallback";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { aboutParagraphs, site } from "@/data/site";

const WorkspaceScene = dynamic(
  () => import("@/components/3d/about/WorkspaceScene"),
  { ssr: false, loading: () => null },
);

const facts = [
  {
    icon: GraduationCap,
    label: "Education",
    value: `${site.education.degree} — ${site.education.school}`,
  },
  { icon: MapPin, label: "Based in", value: site.location },
  { icon: Target, label: "Building toward", value: "Software / AI Engineering" },
];

export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative mx-auto w-full max-w-6xl px-6 py-24 sm:px-8 md:py-32"
    >
      <Reveal>
        <SectionHeading id="about-title" eyebrow="ABOUT ME" title="ABOUT ME" />
      </Reveal>

      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-5">
          {aboutParagraphs.map((paragraph, index) => (
            <Reveal key={index} delay={index * 0.07}>
              <p className="text-base leading-relaxed text-muted sm:text-lg">
                {paragraph}
              </p>
            </Reveal>
          ))}

          <Reveal delay={0.2}>
            <dl className="mt-8 space-y-3 border-t border-line pt-6">
              {facts.map((fact) => (
                <div key={fact.label} className="flex items-start gap-3">
                  <fact.icon
                    size={16}
                    aria-hidden
                    className="mt-1 shrink-0 text-accent"
                  />
                  <div>
                    <dt className="font-mono text-[0.65rem] tracking-[0.25em] text-dim uppercase">
                      {fact.label}
                    </dt>
                    <dd className="text-sm text-ink">{fact.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.25}>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Focus areas">
              {site.focusAreas.map((area) => (
                <li
                  key={area}
                  className="rounded-full border border-line bg-white/[0.03] px-3 py-1.5 font-mono text-[0.65rem] tracking-wider text-muted"
                >
                  {area}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <div className="relative">
            <div className="glass relative h-[320px] overflow-hidden rounded-3xl sm:h-[380px] lg:h-[440px]">
              <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,rgba(56,189,248,0.08),transparent_70%)]" />
              <CanvasGate
                label="3D developer workspace visualization"
                className="absolute inset-0"
                fallback={<SceneFallback variant="about" />}
              >
                <WorkspaceScene />
              </CanvasGate>
              <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[0.6rem] tracking-[0.3em] text-dim uppercase">
                workspace.env — editor · terminal · api
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
