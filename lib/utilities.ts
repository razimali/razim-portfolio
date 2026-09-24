"use client";

import { useSyncExternalStore } from "react";

import type { DeviceTier } from "@/lib/types";

export { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ */
/* WebGL support — cached module value read via useSyncExternalStore   */
/* ------------------------------------------------------------------ */

let cachedWebGL: boolean | null = null;

function readWebGLSupport(): boolean {
  if (cachedWebGL === null) {
    try {
      const canvas = document.createElement("canvas");
      cachedWebGL = Boolean(
        window.WebGLRenderingContext &&
          (canvas.getContext("webgl2") ?? canvas.getContext("webgl")),
      );
    } catch {
      cachedWebGL = false;
    }
  }
  return cachedWebGL;
}

const noopSubscribe = () => () => {};

export function useWebGLSupport(): boolean {
  return useSyncExternalStore(noopSubscribe, readWebGLSupport, () => false);
}

export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  return readWebGLSupport();
}

/* ------------------------------------------------------------------ */
/* prefers-reduced-motion                                              */
/* ------------------------------------------------------------------ */

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onStoreChange: () => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
}

function readReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    readReducedMotion,
    () => false,
  );
}

/* ------------------------------------------------------------------ */
/* Device tier (responsive 3D quality)                                 */
/* ------------------------------------------------------------------ */

function computeDeviceTier(): DeviceTier {
  const width = window.innerWidth;
  const cores = navigator.hardwareConcurrency ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  if (width < 768 || (coarse && cores <= 6)) return "low";
  if (width < 1280 || cores <= 4) return "medium";
  return "high";
}

function subscribeDeviceTier(onStoreChange: () => void): () => void {
  window.addEventListener("resize", onStoreChange);
  return () => window.removeEventListener("resize", onStoreChange);
}

export function useDeviceTier(): DeviceTier {
  return useSyncExternalStore(subscribeDeviceTier, computeDeviceTier, () => "high");
}

/* ------------------------------------------------------------------ */
/* Navigation helpers                                                  */
/* ------------------------------------------------------------------ */

export function scrollToSection(id: string): void {
  const target = document.getElementById(id);
  if (!target) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  if (target.tabIndex === -1) {
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }
}

/**
 * Module-level hero scroll progress (0 → 1 across the first viewport).
 * Read imperatively inside useFrame so scrolling never re-renders React.
 */
export const scrollStore = {
  progress: 0,
};

if (typeof window !== "undefined") {
  let ticking = false;
  const update = () => {
    scrollStore.progress = Math.min(
      Math.max(window.scrollY / Math.max(window.innerHeight, 1), 0),
      1,
    );
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}
