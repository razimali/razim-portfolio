"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { journeyStages } from "@/data/journey";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/utilities";

export function JourneySection() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !rootRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".journey-spine-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: ".journey-list",
            start: "top 75%",
            end: "bottom 70%",
            scrub: 0.5,
          },
        },
      );

      gsap.utils.toArray<HTMLElement>(".journey-item").forEach((item) => {
        const fromLeft = item.dataset.side === "left";
        gsap.fromTo(
          item,
          { opacity: 0.25, x: fromLeft ? -28 : 28 },
          {
            opacity: 1,
            x: 0,
            duration: 0.65,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="journey"
      ref={rootRef}
      aria-labelledby="journey-title"
      className="relative border-t border-line/60 bg-surface/40"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-8 md:py-32">
        <Reveal>
          <SectionHeading
            id="journey-title"
            eyebrow="JOURNEY"
            title="LEARNING JOURNEY"
            description="A clear path from programming foundations toward software and AI engineering — built step by step through study, labs and projects."
          />
        </Reveal>

        <ol className="journey-list relative">
          <div
            aria-hidden
            className="absolute top-0 bottom-0 left-[15px] w-px bg-line md:left-1/2"
          >
            <div className="journey-spine-fill absolute inset-0 origin-top bg-gradient-to-b from-accent via-accent-2 to-accent/30" />
          </div>

          {journeyStages.map((stage, index) => {
            const onLeft = index % 2 === 0;
            return (
              <li
                key={stage.id}
                className="journey-item relative mb-10 grid last:mb-0 md:grid-cols-2 md:gap-0"
                data-side={onLeft ? "left" : "right"}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-6 left-[15px] z-10 grid size-3 -translate-x-1/2 place-items-center rounded-full",
                    "bg-void ring-2 ring-accent md:left-1/2",
                    reduced && "ring-accent-2",
                  )}
                >
                  <span className="size-1.5 rounded-full bg-accent" />
                </span>

                <div
                  className={cn(
                    "pl-10 md:pl-0",
                    onLeft
                      ? "md:pr-14 md:text-right"
                      : "md:col-start-2 md:pl-14",
                  )}
                >
                  <div className="glass rounded-2xl p-5 transition-colors duration-300 hover:border-accent/40">
                    <div
                      className={cn(
                        "flex items-center gap-3",
                        onLeft && "md:flex-row-reverse",
                      )}
                    >
                      <span className="font-mono text-[0.65rem] tracking-[0.3em] text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="h-px flex-1 bg-line md:max-w-16" aria-hidden />
                    </div>
                    <h3 className="mt-3 font-display text-lg font-semibold tracking-wide text-ink">
                      {stage.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {stage.description}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
