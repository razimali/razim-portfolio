"use client";

import dynamic from "next/dynamic";

import { CanvasGate } from "@/components/3d/CanvasGate";
import { SceneFallback } from "@/components/3d/SceneFallback";
import { HeroContent } from "@/components/hero/HeroContent";
import { PortraitFallback } from "@/components/hero/PortraitFallback";
import { PortraitLabels } from "@/components/hero/PortraitLabels";

const ComputationalCore = dynamic(
  () => import("@/components/3d/hero/ComputationalCore"),
  {
    ssr: false,
    loading: () => null,
  },
);

export function Hero() {
  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-void">
        <div className="absolute inset-0 bg-vignette" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,5,7,0.2),rgba(5,5,7,0.55)_75%,rgba(5,5,7,0.95))]" />
      </div>

      <CanvasGate
        label="Interactive computational core visualization"
        className="absolute inset-0"
        fallback={
          <div className="absolute inset-0">
            <SceneFallback variant="hero" />
            <PortraitFallback />
          </div>
        }
      >
        <ComputationalCore />
      </CanvasGate>

      <PortraitLabels />

      <div className="relative z-10 flex flex-1 items-end pb-4 lg:items-center lg:pb-0">
        <HeroContent />
      </div>
    </section>
  );
}
