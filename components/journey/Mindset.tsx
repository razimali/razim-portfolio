"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { mindset } from "@/data/site";
import { usePrefersReducedMotion } from "@/lib/utilities";

export function Mindset() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !rootRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        gsap.fromTo(
          ".mindset-line-h",
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: ".mindset-grid",
              start: "top 75%",
              end: "bottom 70%",
              scrub: 0.6,
            },
          },
        );
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.fromTo(
          ".mindset-line-v",
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: ".mindset-grid",
              start: "top 80%",
              end: "bottom 75%",
              scrub: 0.6,
            },
          },
        );
      });

      gsap.fromTo(
        ".mindset-card",
        { opacity: 0.3, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".mindset-grid",
            start: "top 75%",
          },
        },
      );
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="mindset"
      ref={rootRef}
      aria-labelledby="mindset-title"
      className="relative border-t border-line/60 bg-surface/40"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-8 md:py-32">
        <Reveal>
          <SectionHeading
            id="mindset-title"
            eyebrow="ENGINEERING MINDSET"
            title="HOW I APPROACH LEARNING"
            description="A simple loop I try to follow: build, understand, experiment, improve."
          />
        </Reveal>

        <div className="mindset-grid relative grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* Horizontal connector (desktop) */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              className="mindset-line-h"
              d="M 12.5 50 L 87.5 50"
              fill="none"
              stroke="rgba(56,189,248,0.55)"
              strokeWidth="0.4"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={reduced ? 0 : 1}
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Vertical connector (mobile / tablet) */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full lg:hidden"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              className="mindset-line-v"
              d="M 50 12.5 L 50 87.5"
              fill="none"
              stroke="rgba(56,189,248,0.55)"
              strokeWidth="0.4"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={reduced ? 0 : 1}
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {mindset.map((module, index) => (
            <div key={module.id} className="mindset-card relative">
              <div className="glass relative z-10 flex h-full flex-col rounded-2xl bg-surface/80 p-6">
                <span className="font-mono text-[0.65rem] tracking-[0.3em] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold tracking-[0.12em] text-ink">
                  {module.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {module.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
