export const palette = {
  bg: "#050507",
  core: "#0e1622",
  accent: "#38bdf8",
  accentSoft: "#7dd3fc",
  cyan: "#22d3ee",
  node: "#bae6fd",
  line: "#38bdf8",
  panel: "#12151d",
  packet: "#e0f2fe",
  warm: "#fbbf24",
  green: "#34d399",
} as const;

export function particleCount(tier: "high" | "medium" | "low"): number {
  if (tier === "low") return 150;
  if (tier === "medium") return 350;
  return 600;
}

export function nodeCount(tier: "high" | "medium" | "low"): number {
  if (tier === "low") return 14;
  if (tier === "medium") return 20;
  return 26;
}

/** Fibonacci sphere points — deterministic layout for the node graph. */
export function fibSphere(
  count: number,
  radius: number,
): Array<[number, number, number]> {
  const points: Array<[number, number, number]> = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2;
    const r = Math.sqrt(Math.max(1 - y * y, 0));
    const theta = golden * i;
    points.push([
      Math.cos(theta) * r * radius,
      y * radius,
      Math.sin(theta) * r * radius,
    ]);
  }
  return points;
}

/** Line segments connecting each point to its k nearest neighbours (+ some spokes). */
export function buildConnections(
  points: Array<[number, number, number]>,
  k = 2,
): Float32Array {
  const positions: number[] = [];
  const dist2 = (
    a: [number, number, number],
    b: [number, number, number],
  ): number => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;

  for (let i = 0; i < points.length; i++) {
    const neighbours = points
      .map((p, j) => ({ j, d: j === i ? Infinity : dist2(points[i], p) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, k);

    for (const { j } of neighbours) {
      if (j > i) {
        positions.push(...points[i], ...points[j]);
      }
    }
    if (i % 3 === 0) {
      positions.push(...points[i], 0, 0, 0);
    }
  }
  return new Float32Array(positions);
}
