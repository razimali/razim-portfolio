"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { palette } from "@/components/3d/theme";
import { usePrefersReducedMotion } from "@/lib/utilities";

const CODE_LINE_COLORS = [palette.accent, palette.cyan, "#94a3b8", palette.accentSoft];

function CodePanel() {
  const lines = useMemo(
    () =>
      [0.72, 0.5, 0.62, 0.38, 0.55, 0.44].map((width, index) => ({
        width,
        offset: index,
        color: CODE_LINE_COLORS[index % CODE_LINE_COLORS.length],
      })),
    [],
  );

  return (
    <group>
      <RoundedBox args={[2.35, 1.5, 0.07]} radius={0.05} smoothness={4}>
        <meshStandardMaterial
          color={palette.panel}
          metalness={0.55}
          roughness={0.42}
        />
      </RoundedBox>
      <mesh position={[-1.0, 0.6, 0.045]}>
        <planeGeometry args={[2.1, 0.16]} />
        <meshBasicMaterial color="#0a0e16" />
      </mesh>
      {lines.map((line) => (
        <mesh
          key={line.offset}
          position={[-0.95 + line.width * 0.5, 0.38 - line.offset * 0.17, 0.041]}
        >
          <planeGeometry args={[line.width * 1.9, 0.05]} />
          <meshBasicMaterial color={line.color} transparent opacity={0.65} />
        </mesh>
      ))}
    </group>
  );
}

function TerminalPanel() {
  return (
    <group>
      <RoundedBox args={[1.7, 1.0, 0.06]} radius={0.04} smoothness={4}>
        <meshStandardMaterial
          color="#0d1117"
          metalness={0.4}
          roughness={0.5}
        />
      </RoundedBox>
      {[0, 1, 2, 3].map((row) => (
        <mesh key={row} position={[-0.6 + (row % 2) * 0.1, 0.28 - row * 0.18, 0.036]}>
          <planeGeometry args={[row === 3 ? 0.35 : 1.1 - row * 0.15, 0.045]} />
          <meshBasicMaterial
            color={row === 3 ? palette.green : "#64748b"}
            transparent
            opacity={row === 3 ? 0.95 : 0.55}
          />
        </mesh>
      ))}
    </group>
  );
}

function ApiPanel() {
  return (
    <group>
      <RoundedBox args={[1.5, 0.85, 0.06]} radius={0.04} smoothness={4}>
        <meshStandardMaterial
          color={palette.panel}
          metalness={0.6}
          roughness={0.38}
        />
      </RoundedBox>
      {[-0.45, 0, 0.45].map((x) => (
        <mesh key={x} position={[x, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.05, 16]} />
          <meshStandardMaterial
            color={palette.accent}
            emissive={palette.accent}
            emissiveIntensity={0.7}
            metalness={0.3}
            roughness={0.3}
          />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[1.1, 0.02]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function WorkspaceContents({ reduced }: { reduced: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const codeRef = useRef<THREE.Group>(null);
  const termRef = useRef<THREE.Group>(null);
  const apiRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        0.35 + state.pointer.x * 0.16,
        0.04,
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -0.08 - state.pointer.y * 0.08,
        0.04,
      );
    }
    if (codeRef.current) {
      codeRef.current.position.y = 0.55 + Math.sin(t * 0.7) * 0.07;
    }
    if (termRef.current) {
      termRef.current.position.y = -0.65 + Math.sin(t * 0.7 + 1.6) * 0.06;
      termRef.current.position.x = -0.7 + Math.sin(t * 0.4) * 0.03;
    }
    if (apiRef.current) {
      apiRef.current.position.y = -0.15 + Math.sin(t * 0.7 + 3.1) * 0.06;
      apiRef.current.position.x = 1.15 + Math.cos(t * 0.5) * 0.03;
    }
    void delta;
  });

  return (
    <>
      <group ref={groupRef}>
        <group ref={codeRef} position={[0, 0.55, 0]} rotation={[0, -0.12, 0]}>
          <CodePanel />
        </group>
        <group ref={termRef} position={[-0.7, -0.65, 0.6]} rotation={[0, 0.18, 0]}>
          <TerminalPanel />
        </group>
        <group ref={apiRef} position={[1.15, -0.15, 0.4]} rotation={[0, -0.2, 0]}>
          <ApiPanel />
        </group>
      </group>

      <gridHelper
        args={[14, 14, "#1e293b", "#111827"]}
        position={[0, -1.6, -1]}
      />

      <ambientLight intensity={0.5} color="#94a3b8" />
      <directionalLight position={[3, 5, 4]} intensity={1.3} color="#e2e8f0" />
      <pointLight position={[-3, 1, 2]} intensity={2.2} color={palette.accent} distance={10} />
      <pointLight position={[2, -2, 3]} intensity={1.2} color={palette.cyan} distance={9} />
    </>
  );
}

export default function WorkspaceScene() {
  const reduced = usePrefersReducedMotion();

  return (
    <Canvas
      className="absolute inset-0"
      style={{ position: "absolute", inset: 0 }}
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.15, 4.6], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
    >
      <WorkspaceContents reduced={reduced} />
    </Canvas>
  );
}
