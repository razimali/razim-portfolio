import { cn } from "@/lib/cn";

interface SceneFallbackProps {
  variant: "hero" | "about" | "skills" | "project";
  className?: string;
}

const nodeDots = [
  { cx: 50, cy: 22 },
  { cx: 74, cy: 36 },
  { cx: 70, cy: 66 },
  { cx: 50, cy: 78 },
  { cx: 28, cy: 64 },
  { cx: 26, cy: 34 },
];

/**
 * Static, elegant stand-in shown when WebGL is unavailable or a scene errors.
 * Keeps the visual identity without breaking the page.
 */
export function SceneFallback({ variant, className }: SceneFallbackProps) {
  const accent =
    variant === "project"
      ? "#34d399"
      : variant === "skills"
        ? "#22d3ee"
        : "#38bdf8";

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden",
        "bg-[radial-gradient(60%_50%_at_50%_45%,rgba(56,189,248,0.10),transparent_70%)]",
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_120%,rgba(34,211,238,0.06),transparent_60%)]" />
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full opacity-80"
      >
        <defs>
          <radialGradient id={`core-${variant}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.05" />
          </radialGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="18"
          fill={`url(#core-${variant})`}
          stroke={accent}
          strokeOpacity="0.35"
          strokeWidth="0.4"
        />
        <circle
          cx="50"
          cy="50"
          r="28"
          fill="none"
          stroke={accent}
          strokeOpacity="0.16"
          strokeWidth="0.35"
          strokeDasharray="1.5 2.5"
        />
        <circle
          cx="50"
          cy="50"
          r="36"
          fill="none"
          stroke={accent}
          strokeOpacity="0.1"
          strokeWidth="0.3"
        />
        {nodeDots.map((dot, index) => (
          <g key={index}>
            <line
              x1="50"
              y1="50"
              x2={dot.cx}
              y2={dot.cy}
              stroke={accent}
              strokeOpacity="0.22"
              strokeWidth="0.3"
            />
            <circle cx={dot.cx} cy={dot.cy} r="1.6" fill={accent} fillOpacity="0.75" />
          </g>
        ))}
        <circle cx="50" cy="50" r="3" fill={accent} fillOpacity="0.9" />
      </svg>
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[0.6rem] tracking-[0.3em] text-dim uppercase">
        Static view — 3D unavailable
      </p>
    </div>
  );
}
