"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";

/** Soft rounded-rect grayscale mask (green channel → alphaMap) with edge falloff. */
export function createSoftMaskTexture(size = 512): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, size, size);

  const margin = size * 0.045;
  const radius = size * 0.08;
  ctx.save();
  ctx.filter = `blur(${Math.round(size * 0.04)}px)`;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(margin, margin, size - margin * 2, size - margin * 2, radius);
  } else {
    ctx.rect(margin, margin, size - margin * 2, size - margin * 2);
  }
  ctx.fill();
  ctx.restore();

  // Radial multiply — extra falloff so the photo dissolves into the dark stage.
  ctx.globalCompositeOperation = "multiply";
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.2,
    size / 2,
    size / 2,
    size * 0.52,
  );
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(0.55, "#e8e8e8");
  grad.addColorStop(0.78, "#8a8a8a");
  grad.addColorStop(1, "#2a2a2a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  ctx.globalCompositeOperation = "source-over";

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Draws the portrait into a square canvas and darkens only the outer field
 * toward the page void colour — keeps the face untouched, blends the light
 * corridor background into the dark stage.
 */
function vignettePortrait(img: HTMLImageElement): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const cover = Math.max(size / iw, size / ih);
    const w = iw * cover;
    const h = ih * cover;
    ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);

    const g = ctx.createRadialGradient(
      size / 2,
      size * 0.46,
      size * 0.18,
      size / 2,
      size / 2,
      size * 0.54,
    );
    g.addColorStop(0, "rgba(5,5,7,0)");
    g.addColorStop(0.55, "rgba(5,5,7,0)");
    g.addColorStop(0.78, "rgba(5,5,7,0.42)");
    g.addColorStop(1, "rgba(5,5,7,0.94)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    // Soft bottom sink so the torso dissolves into the hero floor gradient.
    const bottom = ctx.createLinearGradient(0, size * 0.72, 0, size);
    bottom.addColorStop(0, "rgba(5,5,7,0)");
    bottom.addColorStop(1, "rgba(5,5,7,0.78)");
    ctx.fillStyle = bottom;
    ctx.fillRect(0, size * 0.72, size, size * 0.28);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Soft cyan radial glow used behind the portrait. */
export function createGlowTexture(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  g.addColorStop(0, "rgba(56,189,248,0.5)");
  g.addColorStop(0.35, "rgba(34,211,238,0.16)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Technical wireframe: corner brackets + centre ticks as line segments. */
export function createPortraitFrameGeometry(
  width: number,
  height: number,
): THREE.BufferGeometry {
  const hw = width / 2;
  const hh = height / 2;
  const bracket = Math.min(width, height) * 0.14;
  const tick = Math.min(width, height) * 0.08;
  const positions: number[] = [];

  const push = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    z = 0,
  ): void => {
    positions.push(x1, y1, z, x2, y2, z);
  };

  // Corner brackets
  push(-hw, hh, -hw + bracket, hh);
  push(-hw, hh, -hw, hh - bracket);
  push(hw, hh, hw - bracket, hh);
  push(hw, hh, hw, hh - bracket);
  push(-hw, -hh, -hw + bracket, -hh);
  push(-hw, -hh, -hw, -hh + bracket);
  push(hw, -hh, hw - bracket, -hh);
  push(hw, -hh, hw, -hh + bracket);

  // Mid-edge ticks
  push(-tick, hh, tick, hh);
  push(-tick, -hh, tick, -hh);
  push(-hw, -tick, -hw, tick);
  push(hw, -tick, hw, tick);

  // Short leader stubs (label anchors)
  push(hw, hh * 0.35, hw + 0.18, hh * 0.35, 0);
  push(hw, -hh * 0.2, hw + 0.14, -hh * 0.2, 0);
  push(-hw, hh * 0.55, -hw - 0.14, hh * 0.55, 0);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  return geometry;
}

/** Gently curved photo plane (subtle CRT-like bow) — pure geometry, no shader. */
export function createCurvedPortraitGeometry(
  width: number,
  height: number,
  segments = 36,
): THREE.PlaneGeometry {
  const geometry = new THREE.PlaneGeometry(width, height, segments, segments);
  const position = geometry.attributes.position;
  const hw = width / 2;
  const hh = height / 2;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const nx = x / hw;
    const ny = y / hh;
    const curve = (nx * nx * 0.55 + ny * ny * 0.45) * -0.09;
    position.setZ(i, curve);
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

/** Non-suspense portrait texture loader — missing file degrades gracefully. */
export function usePortraitTexture(src: string): {
  texture: THREE.Texture | null;
  failed: boolean;
} {
  const [state, setState] = useState<{
    texture: THREE.Texture | null;
    failed: boolean;
  }>({ texture: null, failed: false });

  useEffect(() => {
    let cancelled = false;
    let loaded: THREE.Texture | null = null;
    const loader = new THREE.TextureLoader();

    loader.load(
      src,
      (raw) => {
        if (cancelled) {
          raw.dispose();
          return;
        }
        let tex: THREE.Texture;
        try {
          tex = vignettePortrait(raw.image as HTMLImageElement);
          raw.dispose();
        } catch {
          tex = raw;
          tex.colorSpace = THREE.SRGBColorSpace;
        }
        tex.anisotropy = 4;
        loaded = tex;
        setState({ texture: tex, failed: false });
      },
      undefined,
      () => {
        if (!cancelled) {
          setState({ texture: null, failed: true });
        }
      },
    );

    return () => {
      cancelled = true;
      if (loaded) {
        loaded.dispose();
      }
    };
  }, [src]);

  return state;
}
