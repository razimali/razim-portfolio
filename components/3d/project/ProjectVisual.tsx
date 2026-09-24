"use client";

import { Canvas } from "@react-three/fiber";

import {
  FinanceScene,
  NetworkScene,
  PipelineScene,
} from "@/components/3d/project/scenes";
import type { ProjectVisualVariant } from "@/lib/types";
import { useDeviceTier, usePrefersReducedMotion } from "@/lib/utilities";

const CAMERAS: Record<
  ProjectVisualVariant,
  { position: [number, number, number]; fov: number }
> = {
  finance: { position: [0, 1.0, 4.9], fov: 42 },
  pipeline: { position: [0, 0.9, 5.2], fov: 40 },
  network: { position: [0, 2.6, 4.8], fov: 42 },
};

export default function ProjectVisual({
  variant,
}: {
  variant: ProjectVisualVariant;
}) {
  const tier = useDeviceTier();
  const reduced = usePrefersReducedMotion();
  const camera = CAMERAS[variant];

  return (
    <Canvas
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0 }}
      dpr={tier === "low" ? [1, 1.5] : [1, 1.7]}
      camera={{ position: camera.position, fov: camera.fov }}
      gl={{ antialias: tier !== "low", alpha: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
    >
      {variant === "finance" ? <FinanceScene reduced={reduced} /> : null}
      {variant === "pipeline" ? <PipelineScene reduced={reduced} /> : null}
      {variant === "network" ? <NetworkScene reduced={reduced} /> : null}
    </Canvas>
  );
}
