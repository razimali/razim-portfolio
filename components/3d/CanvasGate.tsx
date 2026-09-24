"use client";

import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";

import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useWebGLSupport } from "@/lib/utilities";

interface CanvasGateProps {
  children: ReactNode;
  fallback: ReactNode;
  className?: string;
  label: string;
  /** Viewport margin around the section that keeps the scene mounted. */
  rootMargin?: string;
}

/**
 * Mounts a WebGL scene only when:
 * 1) WebGL is available, and
 * 2) the host section is near the viewport (IntersectionObserver).
 * Falls back to a static visual on error or missing WebGL.
 */
export function CanvasGate({
  children,
  fallback,
  className,
  label,
  rootMargin = "125% 0px",
}: CanvasGateProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const webgl = useWebGLSupport();
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  const showFallback = webgl === false;
  const showScene = webgl === true && near;
  return (
    <div
      ref={hostRef}
      className={className}
      role="region"
      aria-label={label}
      data-webgl={showScene ? "on" : "off"}
    >
      {showFallback ? (
        fallback
      ) : showScene ? (
        <ErrorBoundary fallback={fallback}>
          <Suspense fallback={null}>{children}</Suspense>
        </ErrorBoundary>
      ) : (
        fallback
      )}
    </div>
  );
}
