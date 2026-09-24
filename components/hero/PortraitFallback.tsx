"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { site } from "@/data/site";
import { cn } from "@/lib/cn";
import { scrollStore } from "@/lib/utilities";

interface PortraitFallbackProps {
  className?: string;
}

/**
 * Polished DOM portrait shown when WebGL is unavailable (or the scene errors).
 * Mirrors the in-canvas presentation: soft edge dissolve, glass frame, brackets.
 */
export function PortraitFallback({ className }: PortraitFallbackProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = (): void => {
      const el = rootRef.current;
      if (!el) return;
      const p = scrollStore.progress;
      el.style.opacity = String(Math.max(0, 1 - p * 1.4));
      el.style.transform = `translateY(${p * -36}px) scale(${1 - p * 0.18})`;
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
        "pointer-events-none absolute inset-0 z-[1] overflow-hidden",
        className,
      )}
    >
      <div className="absolute top-[12%] right-[6%] hidden aspect-square w-[min(34vw,420px)] lg:block">
        <div className="glass absolute inset-0 overflow-hidden rounded-[1.25rem]">
          <Image
            src={site.portrait.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 34vw, 70vw"
            className="object-cover opacity-90 [mask-image:radial-gradient(72%_72%_at_50%_45%,black_42%,transparent_78%)]"
            priority
          />
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_40%,transparent_35%,rgba(5,5,7,0.55)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,5,7,0.72),transparent_38%)]" />
        </div>
        <div className="absolute -inset-3 border border-accent/25 [clip-path:polygon(0_0,18%_0,0_18%,0_0,100%_0,100%_18%,82%_0,100%_100%,82%_100%,100%_82%,100%_100%,0_100%,0_82%,18%_100%,0_100%)] opacity-70" />
        <span className="absolute -top-6 left-0 font-mono text-[0.58rem] tracking-[0.35em] text-accent/80 uppercase">
          {site.portrait.labels[0]}
        </span>
        <span className="absolute -right-2 top-1/2 rotate-90 font-mono text-[0.58rem] tracking-[0.35em] text-accent-2/70 uppercase">
          {site.portrait.labels[1]}
        </span>
        <span className="absolute -bottom-6 right-0 font-mono text-[0.58rem] tracking-[0.35em] text-accent/70 uppercase">
          {site.portrait.labels[2]}
        </span>
      </div>

      {/* Compact presentation on small screens (top-right accent) */}
      <div className="absolute top-14 right-3 aspect-square w-[30vw] max-w-[130px] lg:hidden">
        <div className="glass absolute inset-0 overflow-hidden rounded-xl">
          <Image
            src={site.portrait.src}
            alt=""
            fill
            sizes="130px"
            className="object-cover opacity-90 [mask-image:radial-gradient(72%_72%_at_50%_45%,black_42%,transparent_78%)]"
          />
        </div>
      </div>
    </div>
  );
}
