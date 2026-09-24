"use client";

import { Instance, Instances } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import {
  buildConnections,
  fibSphere,
  nodeCount,
  palette,
  particleCount,
} from "@/components/3d/theme";
import { PersonalPortrait } from "@/components/3d/PersonalPortrait";
import {
  scrollStore,
  useDeviceTier,
  usePrefersReducedMotion,
} from "@/lib/utilities";

/** Tiny seeded PRNG (mulberry32) — pure, stable across re-renders. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function CoreContents({
  tier,
  reduced,
}: {
  tier: "high" | "medium" | "low";
  reduced: boolean;
}) {
  const rootRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const coreMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const packetsRef = useRef<Array<THREE.Mesh | null>>([]);

  const count = nodeCount(tier);
  const points = useMemo(() => fibSphere(count, 2.15), [count]);
  const connections = useMemo(() => buildConnections(points, 2), [points]);
  const particlePositions = useMemo(() => {
    const n = particleCount(tier);
    const array = new Float32Array(n * 3);
    // Deterministic PRNG keeps render pure while still looking organic.
    const random = mulberry32(tier === "low" ? 7 : tier === "medium" ? 13 : 29);
    for (let i = 0; i < n; i++) {
      const radius = 2.6 + random() * 2.6;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      array[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      array[i * 3 + 1] = radius * Math.cos(phi) * 0.75;
      array[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    return array;
  }, [tier]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(connections, 3));
    return geometry;
  }, [connections]);

  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3),
    );
    return geometry;
  }, [particlePositions]);

  // Cleanup GPU resources if the gate unmounts the scene.
  useEffect(() => {
    return () => {
      lineGeometry.dispose();
      particleGeometry.dispose();
    };
  }, [lineGeometry, particleGeometry]);

  const packets = useMemo(
    () =>
      [0, 1, 2, 3].map((index) => ({
        radius: 2.15 + (index % 2) * 0.55,
        speed: 0.22 + index * 0.07,
        phase: (index / 4) * Math.PI * 2,
        tilt: (index % 2 === 0 ? 1 : -1) * (0.35 + index * 0.08),
      })),
    [],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const root = rootRef.current;
    const spin = spinRef.current;
    if (!root || !spin) return;

    if (!reduced) {
      spin.rotation.y += delta * 0.11;
      spin.rotation.x = Math.sin(t * 0.18) * 0.08;
    }

    // Subtle pointer parallax (desktop); skipped for reduced motion.
    if (!reduced) {
      const targetY = state.pointer.x * 0.35;
      const targetX = -state.pointer.y * 0.2;
      root.rotation.y = THREE.MathUtils.lerp(root.rotation.y, targetY, 0.045);
      root.rotation.x = THREE.MathUtils.lerp(root.rotation.x, targetX, 0.045);
    }

    // Scroll-driven camera dolly — read imperatively, no React state.
    const progress = scrollStore.progress;
    const camera = state.camera;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 6.2 + progress * 3.2, 0.07);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, progress * -0.9, 0.07);
    camera.lookAt(0, progress * -0.3, 0);

    // Proximity glow: pointer near screen centre brightens the core.
    const proximity = Math.max(
      0,
      1 - Math.hypot(state.pointer.x, state.pointer.y) * 1.15,
    );
    const targetEmissive = reduced
      ? 0.45
      : 0.4 + proximity * 0.55 + Math.sin(t * 1.6) * 0.06;
    if (coreMatRef.current) {
      coreMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        coreMatRef.current.emissiveIntensity,
        targetEmissive,
        0.08,
      );
    }
    if (glowRef.current) {
      glowRef.current.intensity = THREE.MathUtils.lerp(
        glowRef.current.intensity,
        4 + proximity * 7,
        0.08,
      );
    }

    // Data packets orbiting the core.
    if (!reduced) {
      packets.forEach((packet, index) => {
        const mesh = packetsRef.current[index];
        if (!mesh) return;
        const angle = t * packet.speed + packet.phase;
        const x = Math.cos(angle) * packet.radius;
        const z = Math.sin(angle) * packet.radius;
        mesh.position.set(x, Math.sin(angle) * packet.tilt, z);
      });
    }
  });

  return (
    <>
      <group ref={rootRef}>
        <group ref={spinRef}>
          {/* Computational core */}
          <mesh>
            <icosahedronGeometry args={[1.05, 1]} />
            <meshStandardMaterial
              ref={coreMatRef}
              color={palette.core}
              emissive={palette.accent}
              emissiveIntensity={0.45}
              metalness={0.75}
              roughness={0.28}
              flatShading
            />
          </mesh>
          <mesh scale={1.04}>
            <icosahedronGeometry args={[1.05, 1]} />
            <meshBasicMaterial
              color={palette.accentSoft}
              wireframe
              transparent
              opacity={0.22}
            />
          </mesh>

          {/* Orbit rings */}
          <mesh rotation={[Math.PI / 2.4, 0.3, 0]}>
            <torusGeometry args={[2.15, 0.008, 8, 96]} />
            <meshBasicMaterial color={palette.accent} transparent opacity={0.35} />
          </mesh>
          <mesh rotation={[Math.PI / 1.7, -0.5, 0.4]}>
            <torusGeometry args={[2.7, 0.006, 8, 96]} />
            <meshBasicMaterial color={palette.cyan} transparent opacity={0.22} />
          </mesh>

          {/* Interconnected skill nodes */}
          <Instances range={count} limit={64}>
            <sphereGeometry args={[0.058, 12, 12]} />
            <meshStandardMaterial
              color={palette.node}
              emissive={palette.accent}
              emissiveIntensity={0.55}
              roughness={0.35}
              metalness={0.4}
            />
            {points.map((point, index) => (
              <Instance
                key={index}
                position={point}
                scale={index % 4 === 0 ? 1.45 : 1}
              />
            ))}
          </Instances>

          {/* Connection graph */}
          <lineSegments geometry={lineGeometry}>
            <lineBasicMaterial
              color={palette.line}
              transparent
              opacity={0.17}
              depthWrite={false}
            />
          </lineSegments>

          {/* Orbiting data packets */}
          {[0, 1, 2, 3].map((index) => (
            <mesh
              key={index}
              ref={(el) => {
                packetsRef.current[index] = el;
              }}
            >
              <sphereGeometry args={[0.045, 10, 10]} />
              <meshBasicMaterial color={palette.packet} />
            </mesh>
          ))}
        </group>

        {/* Ambient particle field */}
        <points geometry={particleGeometry}>
          <pointsMaterial
            color={palette.accentSoft}
            size={0.022}
            transparent
            opacity={0.65}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
          />
        </points>

        {/* Cinematic lighting */}
        <ambientLight intensity={0.35} color="#94a3b8" />
        <directionalLight position={[4, 6, 5]} intensity={1.35} color="#e2e8f0" />
        <directionalLight position={[-6, -2, -4]} intensity={0.55} color="#3b82f6" />
        <pointLight ref={glowRef} position={[0, 0, 0]} intensity={5} color={palette.accent} distance={9} decay={2} />
        <pointLight position={[0, 3.5, -3]} intensity={1.4} color={palette.cyan} distance={12} />
      </group>

      {/* Personal holographic portrait — sibling of the core so its
          parallax stays independent of the core's spin group. */}
      <PersonalPortrait tier={tier} reduced={reduced} />
    </>
  );
}

export default function ComputationalCore() {
  const tier = useDeviceTier();
  const reduced = usePrefersReducedMotion();

  return (
    <Canvas
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0 }}
      dpr={tier === "low" ? [1, 1.5] : [1, 1.75]}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      gl={{
        antialias: tier !== "low",
        alpha: true,
        powerPreference: "high-performance",
      }}
      frameloop={reduced ? "demand" : "always"}
    >
      <CoreContents tier={tier} reduced={reduced} />
    </Canvas>
  );
}
