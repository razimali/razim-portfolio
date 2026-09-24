"use client";

import { skillCategories } from "@/data/skills";
import { cn } from "@/lib/cn";

interface SkillLegendProps {
  activeId: string | null;
  onHover: (id: string | null) => void;
}

export function SkillLegend({ activeId, onHover }: SkillLegendProps) {
  return (
    <div className="space-y-5">
      {skillCategories.map((category) => (
        <div key={category.id}>
          <h3 className="mb-2.5 flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.3em] text-dim uppercase">
            <span className="h-px w-4 bg-accent/60" aria-hidden />
            {category.label}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {category.skills.map((skill) => {
              const active = activeId === skill.id;
              return (
                <li key={skill.id}>
                  <button
                    type="button"
                    className={cn(
                      "rounded-full border px-3 py-1.5 font-mono text-[0.68rem] tracking-wide transition-all duration-200",
                      active
                        ? "border-accent bg-accent/15 text-ink shadow-[0_0_20px_-6px_rgba(56,189,248,0.6)]"
                        : "border-line bg-white/[0.03] text-muted hover:border-slate-400/40 hover:text-ink",
                    )}
                    onMouseEnter={() => onHover(skill.id)}
                    onMouseLeave={() => onHover(null)}
                    onFocus={() => onHover(skill.id)}
                    onBlur={() => onHover(null)}
                    aria-pressed={active}
                  >
                    {skill.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
