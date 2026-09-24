"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, type RootState } from "@react-three/fiber";
import * as THREE from "three";

import {
  createCurvedPortraitGeometry,
  createGlowTexture,
  createPortraitFrameGeometry,
  createSoftMaskTexture,
  usePortraitTexture,
} from "@/components/3d/portrait";
import { palette } from "@/components/3d/theme";
import { site } from "@/data/site";
import { scrollStore } from "@/lib/utilities";

const PORTRAIT_W = 2.15;
const PORTRAIT_H = 2.15;

const OPACITY = {
  photo: 0.96,
  ghost: 0.22,
  glow: 0.55,
  frame: 0.55,
  ring: 0.32,
  ring2: 0.2,
  scan: 0.6,
  sparkles: 0.7,
  node: 0.85,
} as const;

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

interface Layout {
  x: number;
  y: number;
  z: number;
  scale: number;
  narrow: boolean;
}

function portraitLayout(
  width: number,
  height: number,
  tier: "high" | "medium" | "low",
): Layout {
  const aspect = width / Math.max(height, 1);
  const narrow = aspect < 1.15;

  if (narrow) {
    return {
      x: 0.55,
      y: 1.22,
      z: 0.9,
      scale: tier === "low" ? 0.32 : 0.36,
      narrow: true,
    };
  }

  const x = Math.min(2.35, 1.45 + (aspect - 1.15) * 1.55);
  const scale =
    (tier === "high" ? 1 : tier === "medium" ? 0.88 : 0.76) *
    Math.min(1, 0.82 + (aspect - 1.15) * 0.4);
  return { x, y: -0.04, z: 1.05, scale, narrow: false };
}

interface PersonalPortraitProps {
  tier: "high" | "medium" | "low";
  reduced: boolean;
}

/**
 * Layered 2.5D holographic portrait — photo plate, depth ghost, glow,
 * technical frame, scanline, rings, and sparkles. Driven by the existing
 * `scrollStore` + pointer parallax patterns (no separate scroll system).
 */
export function PersonalPortrait({ tier, reduced }: PersonalPortraitProps) {
  const groupRef = useRef<THREE.Group>(null);
  const depthRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const scanRef = useRef<THREE.Mesh>(null);
  const sparklesRef = useRef<THREE.Points>(null);

  const photoMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const ghostMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const glowMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const frameMatRef = useRef<THREE.LineBasicMaterial>(null);
  const ringMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const ring2MatRef = useRef<THREE.MeshBasicMaterial>(null);
  const scanMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const sparklesMatRef = useRef<THREE.PointsMaterial>(null);

  const { texture } = usePortraitTexture(site.portrait.src);

  const maskTexture = useMemo(() => createSoftMaskTexture(), []);
  const glowTexture = useMemo(() => createGlowTexture(), []);
  const frameGeometry = useMemo(
    () => createPortraitFrameGeometry(PORTRAIT_W * 1.06, PORTRAIT_H * 1.06),
    [],
  );
  const photoGeometry = useMemo(
    () => createCurvedPortraitGeometry(PORTRAIT_W, PORTRAIT_H),
    [],
  );
  const ghostGeometry = useMemo(
    () => createCurvedPortraitGeometry(PORTRAIT_W * 1.04, PORTRAIT_H * 1.04, 18),
    [],
  );

  const sparklePositions = useMemo(() => {
    const count = tier === "high" ? 48 : tier === "medium" ? 28 : 0;
    const array = new Float32Array(count * 3);
    let a = tier === "high" ? 41 : 17;
    const rand = (): number => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = 0; i < count; i++) {
      const angle = rand() * Math.PI * 2;
      const radius = 1.15 + rand() * 0.55;
      array[i * 3] = Math.cos(angle) * radius;
      array[i * 3 + 1] = Math.sin(angle) * radius * 0.95;
      array[i * 3 + 2] = -0.15 + rand() * 0.35;
    }
    return array;
  }, [tier]);

  const sparkleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    if (sparklePositions.length > 0) {
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(sparklePositions, 3),
      );
    }
    return geometry;
  }, [sparklePositions]);

  const nodePositions = useMemo<[number, number, number][]>(
    () => [
      [PORTRAIT_W * 0.56, PORTRAIT_H * 0.35, 0.02],
      [PORTRAIT_W * 0.56, -PORTRAIT_H * 0.2, 0.02],
      [-PORTRAIT_W * 0.56, PORTRAIT_H * 0.55, 0.02],
      [0, -PORTRAIT_H * 0.58, 0.02],
    ],
    [],
  );

  useEffect(() => {
    return () => {
      maskTexture.dispose();
      glowTexture.dispose();
      frameGeometry.dispose();
      photoGeometry.dispose();
      ghostGeometry.dispose();
      sparkleGeometry.dispose();
    };
  }, [
    maskTexture,
    glowTexture,
    frameGeometry,
    photoGeometry,
    ghostGeometry,
    sparkleGeometry,
  ]);

  useFrame((state: RootState) => {
    const group = groupRef.current;
    if (!group) return;

    const t = state.clock.elapsedTime;
    const progress = scrollStore.progress;
    const layout = portraitLayout(state.size.width, state.size.height, tier);

    const photoFade = 1 - smoothstep(0.1, 0.68, progress);
    const techBoost = smoothstep(0, 0.45, progress);
    const techFade = 1 - smoothstep(0.72, 1, progress);
    const scale = layout.scale * (1 - progress * 0.3);

    group.position.x = THREE.MathUtils.lerp(
      group.position.x,
      layout.x,
      0.07,
    );
    group.position.y = THREE.MathUtils.lerp(
      group.position.y,
      layout.y - progress * 0.4,
      0.07,
    );
    group.position.z = THREE.MathUtils.lerp(
      group.position.z,
      layout.z - progress * 2.3,
      0.07,
    );
    const nextScale = THREE.MathUtils.lerp(group.scale.x, scale, 0.07);
    group.scale.setScalar(nextScale);

    if (!reduced) {
      group.rotation.y = THREE.MathUtils.lerp(
        group.rotation.y,
        state.pointer.x * 0.13,
        0.05,
      );
      group.rotation.x = THREE.MathUtils.lerp(
        group.rotation.x,
        -state.pointer.y * 0.06,
        0.05,
      );

      if (depthRef.current) {
        depthRef.current.position.x = THREE.MathUtils.lerp(
          depthRef.current.position.x,
          state.pointer.x * 0.14,
          0.06,
        );
        depthRef.current.position.y = THREE.MathUtils.lerp(
          depthRef.current.position.y,
          state.pointer.y * 0.1,
          0.06,
        );
      }
      if (glowRef.current) {
        glowRef.current.position.x = THREE.MathUtils.lerp(
          glowRef.current.position.x,
          state.pointer.x * -0.12,
          0.05,
        );
        glowRef.current.position.y = THREE.MathUtils.lerp(
          glowRef.current.position.y,
          state.pointer.y * -0.08,
          0.05,
        );
      }
      if (scanRef.current) {
        scanRef.current.position.y = Math.sin(t * 0.55) * 0.9;
      }
      if (sparklesRef.current) {
        sparklesRef.current.rotation.z = t * 0.04;
      }
    } else {
      group.rotation.y = 0;
      group.rotation.x = 0;
      if (scanRef.current) {
        scanRef.current.position.y = 0;
      }
    }

    if (photoMatRef.current) {
      photoMatRef.current.opacity = OPACITY.photo * photoFade;
    }
    if (ghostMatRef.current) {
      ghostMatRef.current.opacity = OPACITY.ghost * photoFade;
    }
    if (glowMatRef.current) {
      glowMatRef.current.opacity =
        OPACITY.glow * photoFade * (reduced ? 1 : 0.9 + Math.sin(t * 1.4) * 0.1);
    }
    if (frameMatRef.current) {
      frameMatRef.current.opacity =
        OPACITY.frame * (0.65 + techBoost * 0.35) * techFade;
    }
    if (ringMatRef.current) {
      ringMatRef.current.opacity =
        OPACITY.ring * (0.7 + techBoost * 0.45) * techFade;
    }
    if (ring2MatRef.current) {
      ring2MatRef.current.opacity =
        OPACITY.ring2 * (0.7 + techBoost * 0.5) * techFade;
    }
    if (scanMatRef.current) {
      scanMatRef.current.opacity = OPACITY.scan * photoFade * (reduced ? 0.45 : 1);
    }
    if (sparklesMatRef.current) {
      sparklesMatRef.current.opacity =
        OPACITY.sparkles * photoFade * techFade;
    }
  });

  return (
    <group ref={groupRef} position={[2.2, -0.04, 1.05]} scale={1}>
      {/* Back glow */}
      <mesh ref={glowRef} position={[0, 0, -0.38]} renderOrder={-3}>
        <planeGeometry args={[3.6, 3.6]} />
        <meshBasicMaterial
          ref={glowMatRef}
          map={glowTexture}
          transparent
          opacity={OPACITY.glow}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Depth ghost (parallax plate) */}
      <group ref={depthRef} position={[0, 0, -0.16]}>
        <mesh geometry={ghostGeometry} renderOrder={-2}>
          <meshBasicMaterial
            ref={ghostMatRef}
            map={texture ?? undefined}
            alphaMap={maskTexture}
            color={palette.accentSoft}
            transparent
            opacity={texture ? OPACITY.ghost : 0}
            depthWrite={false}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Main photo plate — identity-preserving, unlit basic material */}
      {texture ? (
        <mesh geometry={photoGeometry} renderOrder={-1}>
          <meshBasicMaterial
            ref={photoMatRef}
            map={texture}
            alphaMap={maskTexture}
            transparent
            opacity={OPACITY.photo}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ) : null}

      {/* Scanline */}
      <mesh ref={scanRef} position={[0, 0, 0.06]} renderOrder={1}>
        <planeGeometry args={[PORTRAIT_W * 0.92, 0.018]} />
        <meshBasicMaterial
          ref={scanMatRef}
          color={palette.accent}
          transparent
          opacity={OPACITY.scan}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Technical wireframe frame */}
      <lineSegments geometry={frameGeometry} position={[0, 0, 0.08]} renderOrder={2}>
        <lineBasicMaterial
          ref={frameMatRef}
          color={palette.accent}
          transparent
          opacity={OPACITY.frame}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>

      {/* Orbit rings */}
      <mesh position={[0, 0, -0.05]} renderOrder={0}>
        <torusGeometry args={[1.38, 0.0065, 6, 96]} />
        <meshBasicMaterial
          ref={ringMatRef}
          color={palette.accent}
          transparent
          opacity={OPACITY.ring}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0, -0.12]} rotation={[0.45, 0.35, 0.15]} renderOrder={0}>
        <torusGeometry args={[1.58, 0.005, 6, 96]} />
        <meshBasicMaterial
          ref={ring2MatRef}
          color={palette.cyan}
          transparent
          opacity={OPACITY.ring2}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Anchor nodes on the frame */}
      {nodePositions.map(([x, y, z], index) => (
        <mesh key={index} position={[x, y, z]} renderOrder={2}>
          <sphereGeometry args={[0.028, 10, 10]} />
          <meshBasicMaterial
            color={palette.node}
            transparent
            opacity={OPACITY.node}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Local sparkles (tier-gated) */}
      {sparklePositions.length > 0 ? (
        <points
          ref={sparklesRef}
          geometry={sparkleGeometry}
          position={[0, 0, 0.12]}
          renderOrder={3}
        >
          <pointsMaterial
            ref={sparklesMatRef}
            color={palette.accentSoft}
            size={0.028}
            transparent
            opacity={OPACITY.sparkles}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
            toneMapped={false}
          />
        </points>
      ) : null}
    </group>
  );
}
