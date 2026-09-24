import { BrainCircuit, Code2, Layers, Network } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { currentlyLearning } from "@/data/site";
import type { LearningCard } from "@/lib/types";

const icons: Record<LearningCard["icon"], typeof Code2> = {
  code: Code2,
  network: Network,
  brain: BrainCircuit,
  layers: Layers,
};

export function CurrentlyLearning() {
  return (
    <section
      id="learning"
      aria-labelledby="learning-title"
      className="relative border-t border-line/60"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-8 md:py-32">
        <Reveal>
          <SectionHeading
            id="learning-title"
            eyebrow="CURRENTLY LEARNING"
            title="WHAT I’M WORKING ON NOW"
            description="Four focus areas I’m actively studying and practising right now."
          />
        </Reveal>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {currentlyLearning.map((card, index) => {
            const Icon = icons[card.icon];
            return (
              <li key={card.id} className="group h-full">
                <Reveal delay={index * 0.08} className="h-full">
                  <div className="glass flex h-full flex-col rounded-2xl p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-accent/40 group-hover:shadow-[0_24px_50px_-30px_rgba(56,189,248,0.45)]">
                    <span className="mb-4 grid size-10 place-items-center rounded-xl border border-accent/40 bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent/20">
                      <Icon size={18} aria-hidden />
                    </span>
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {card.description}
                    </p>
                    <span
                      aria-hidden
                      className="mt-auto pt-4 font-mono text-[0.6rem] tracking-[0.3em] text-dim uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    >
                      Active study
                    </span>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
