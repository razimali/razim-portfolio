"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { palette } from "@/components/3d/theme";
import { skillCategories } from "@/data/skills";
import { useDeviceTier, usePrefersReducedMotion } from "@/lib/utilities";

type Vec3 = [number, number, number];

function computeNodePositions(tier: "high" | "medium" | "low"): Record<string, Vec3> {
  const map: Record<string, Vec3> = {};
  const radius = tier === "low" ? 2.5 : 2.85;
  const yScale = 0.62;
  const categories = skillCategories;

  categories.forEach((category, categoryIndex) => {
    const baseAngle =
      (categoryIndex / categories.length) * Math.PI * 2 - Math.PI / 2;
    const skills = category.skills;
    const spread = 0.72;
    skills.forEach((skill, skillIndex) => {
      const t = skills.length === 1 ? 0.5 : skillIndex / (skills.length - 1);
      const angle = baseAngle + (t - 0.5) * spread;
      const r = radius + (skillIndex % 2 === 0 ? 0 : 0.3);
      map[skill.id] = [
        Math.cos(angle) * r,
        Math.sin(angle) * r * yScale,
        Math.sin(angle * 2) * 0.2,
      ];
    });
  });

  return map;
}

function SkillNode({
  id,
  position,
  active,
  dimmed,
  onHover,
  reduced,
}: {
  id: string;
  position: Vec3;
  active: boolean;
  dimmed: boolean;
  onHover: (id: string | null) => void;
  reduced: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const target = active ? 1.65 : dimmed ? 0.75 : 1;
    const next = THREE.MathUtils.lerp(mesh.scale.x, target, 0.14);
    mesh.scale.setScalar(next);
    if (!reduced) {
      mesh.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.9 + position[0] * 2) * 0.045;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHover(id);
      }}
      onPointerOut={() => onHover(null)}
    >
      <sphereGeometry args={[0.1, 14, 14]} />
      <meshStandardMaterial
        color={active ? "#e0f2fe" : palette.node}
        emissive={palette.accent}
        emissiveIntensity={active ? 1.4 : dimmed ? 0.15 : 0.45}
        metalness={0.45}
        roughness={0.32}
        transparent
        opacity={dimmed && !active ? 0.55 : 1}
      />
    </mesh>
  );
}

function SkillsContents({
  activeId,
  onHover,
  tier,
  reduced,
}: {
  activeId: string | null;
  onHover: (id: string | null) => void;
  tier: "high" | "medium" | "low";
  reduced: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const positions = useMemo(() => computeNodePositions(tier), [tier]);
  const allSkills = useMemo(
    () => skillCategories.flatMap((category) => category.skills),
    [],
  );

  const spokes = useMemo(() => {
    const array: number[] = [];
    for (const skill of allSkills) {
      const point = positions[skill.id];
      if (point) array.push(0, 0, 0, ...point);
    }
    return new Float32Array(array);
  }, [allSkills, positions]);

  const activeSpoke = useMemo(() => {
    if (!activeId) return null;
    const point = positions[activeId];
    if (!point) return null;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([0, 0, 0, ...point]), 3),
    );
    return geometry;
  }, [activeId, positions]);

  const spokeGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(spokes, 3));
    return geometry;
  }, [spokes]);

  useEffect(() => {
    return () => {
      spokeGeometry.dispose();
      activeSpoke?.dispose();
    };
  }, [spokeGeometry, activeSpoke]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    if (!reduced) {
      group.rotation.y += delta * 0.045;
    }
    const targetX = reduced ? -0.06 : -0.06 - state.pointer.y * 0.08;
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetX, 0.05);
  });

  return (
    <>
      <group ref={groupRef}>
        {/* Connection graph to centre */}
        <lineSegments geometry={spokeGeometry}>
          <lineBasicMaterial
            color={palette.line}
            transparent
            opacity={0.12}
            depthWrite={false}
          />
        </lineSegments>

        {activeSpoke ? (
          <lineSegments geometry={activeSpoke}>
            <lineBasicMaterial
              color={palette.cyan}
              transparent
              opacity={0.9}
              depthWrite={false}
            />
          </lineSegments>
        ) : null}

        {/* Central node */}
        <mesh>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial
            color={palette.core}
            emissive={palette.accent}
            emissiveIntensity={activeId ? 1.1 : 0.55}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        <mesh scale={1.18}>
          <sphereGeometry args={[0.42, 24, 24]} />
          <meshBasicMaterial
            color={palette.accentSoft}
            wireframe
            transparent
            opacity={0.14}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2.2, 0.2, 0]}>
          <torusGeometry args={[1.1, 0.006, 8, 80]} />
          <meshBasicMaterial color={palette.accent} transparent opacity={0.3} />
        </mesh>

        {/* Skill nodes */}
        {allSkills.map((skill) => (
          <SkillNode
            key={skill.id}
            id={skill.id}
            position={positions[skill.id]}
            active={activeId === skill.id}
            dimmed={activeId !== null && activeId !== skill.id}
            onHover={onHover}
            reduced={reduced}
          />
        ))}
      </group>

      <ambientLight intensity={0.5} color="#94a3b8" />
      <directionalLight position={[4, 5, 6]} intensity={1.25} color="#e2e8f0" />
      <directionalLight position={[-5, -3, -4]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[0, 0, 1.5]} intensity={4} color={palette.accent} distance={8} />
    </>
  );
}

export default function SkillsScene({
  activeId,
  onHover,
}: {
  activeId: string | null;
  onHover: (id: string | null) => void;
}) {
  const tier = useDeviceTier();
  const reduced = usePrefersReducedMotion();

  return (
    <Canvas
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0 }}
      dpr={tier === "low" ? [1, 1.5] : [1, 1.75]}
      camera={{ position: [0, 0, 6.4], fov: 42 }}
      gl={{ antialias: tier !== "low", alpha: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
    >
      <SkillsContents
        activeId={activeId}
        onHover={onHover}
        tier={tier}
        reduced={reduced}
      />
    </Canvas>
  );
}
