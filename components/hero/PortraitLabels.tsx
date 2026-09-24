"use client";

import { useEffect, useRef } from "react";

import { site } from "@/data/site";
import { cn } from "@/lib/cn";
import { scrollStore } from "@/lib/utilities";

interface PortraitLabelsProps {
  className?: string;
}

const positions = [
  "top-[16%] right-[5%]",
  "top-[46%] right-[3%]",
  "bottom-[22%] right-[7%]",
  "top-[30%] right-[28%]",
] as const;

/**
 * Technical labels framing the in-canvas portrait (desktop only).
 * Opacity is driven imperatively from `scrollStore` — no React re-renders.
 */
export function PortraitLabels({ className }: PortraitLabelsProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = (): void => {
      const el = rootRef.current;
      if (!el) return;
      const p = scrollStore.progress;
      el.style.opacity = String(Math.max(0, 1 - p * 1.5));
      el.style.transform = `translateY(${p * -24}px)`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-[2] hidden lg:block",
        className,
      )}
    >
      {site.portrait.labels.map((label, index) => (
        <span
          key={label}
          className={cn(
            "absolute flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.38em] whitespace-nowrap text-accent/85 uppercase",
            positions[index],
          )}
        >
          <span className="inline-block h-px w-6 bg-gradient-to-r from-transparent to-accent/70" />
          {label}
          <span className="inline-block size-1 rounded-full bg-accent/80" />
        </span>
      ))}
      <span className="absolute top-[13%] right-[5%] font-mono text-[0.55rem] tracking-[0.3em] text-dim uppercase">
        {"// portrait.holo"}
      </span>
    </div>
  );
}
