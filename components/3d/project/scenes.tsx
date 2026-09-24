"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { palette } from "@/components/3d/theme";

export function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.5} color="#94a3b8" />
      <directionalLight position={[3, 5, 4]} intensity={1.25} color="#e2e8f0" />
      <directionalLight position={[-4, -2, -3]} intensity={0.45} color="#3b82f6" />
      <pointLight position={[0, 1.5, 2.5]} intensity={3} color={palette.accent} distance={9} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* HISAB — financial dashboard + transaction network                   */
/* ------------------------------------------------------------------ */

const BAR_HEIGHTS = [0.55, 0.95, 0.7, 1.3, 0.85, 1.5, 1.1];

function ringPoint(index: number, count: number): [number, number, number] {
  const angle = (index / count) * Math.PI * 2;
  return [Math.cos(angle) * 1.7, 1.45 + Math.sin(angle) * 0.55, -0.7];
}

export function FinanceScene({ reduced }: { reduced: boolean }) {
  const packetRefs = useRef<Array<THREE.Mesh | null>>([]);
  const ringCount = 6;

  const ringPoints = useMemo(
    () => Array.from({ length: ringCount }, (_, i) => ringPoint(i, ringCount)),
    [],
  );

  const linkGeometry = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < ringCount; i++) {
      const next = (i + 1) % ringCount;
      positions.push(...ringPoints[i], ...ringPoints[next]);
      if (i % 2 === 0) positions.push(...ringPoints[i], 0, 0.1, 0);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [ringPoints]);

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < 4; i++) {
      const mesh = packetRefs.current[i];
      if (!mesh) continue;
      const from = ringPoints[i % ringCount];
      const to = ringPoints[(i + 1) % ringCount];
      const phase = (t * (0.25 + i * 0.05) + i * 0.25) % 1;
      mesh.position.set(
        THREE.MathUtils.lerp(from[0], to[0], phase),
        THREE.MathUtils.lerp(from[1], to[1], phase),
        THREE.MathUtils.lerp(from[2], to[2], phase),
      );
    }
  });

  return (
    <>
      {/* Dashboard bars */}
      <group position={[0, -0.85, 0.4]}>
        {BAR_HEIGHTS.map((height, index) => (
          <mesh
            key={index}
            position={[(index - (BAR_HEIGHTS.length - 1) / 2) * 0.42, height / 2, 0]}
          >
            <boxGeometry args={[0.26, height, 0.26]} />
            <meshStandardMaterial
              color={index % 3 === 0 ? palette.accent : "#1e293b"}
              emissive={index % 3 === 0 ? palette.accent : "#0f172a"}
              emissiveIntensity={index % 3 === 0 ? 0.45 : 0.15}
              metalness={0.55}
              roughness={0.38}
            />
          </mesh>
        ))}
        <mesh position={[0, -0.03, 0]}>
          <boxGeometry args={[3.3, 0.04, 0.7]} />
          <meshStandardMaterial color="#0f172a" metalness={0.4} roughness={0.6} />
        </mesh>
      </group>

      {/* Transaction network */}
      <group>
        <lineSegments geometry={linkGeometry}>
          <lineBasicMaterial color={palette.cyan} transparent opacity={0.3} depthWrite={false} />
        </lineSegments>
        {ringPoints.map((point, index) => (
          <mesh key={index} position={point}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial
              color={palette.node}
              emissive={palette.cyan}
              emissiveIntensity={0.7}
              roughness={0.3}
              metalness={0.4}
            />
          </mesh>
        ))}
        {[0, 1, 2, 3].map((index) => (
          <mesh
            key={index}
            ref={(el) => {
              packetRefs.current[index] = el;
            }}
          >
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshBasicMaterial color={palette.packet} />
          </mesh>
        ))}
      </group>

      {/* Balance ring */}
      <mesh position={[1.35, 0.75, 0.6]} rotation={[Math.PI / 2.6, 0.4, 0]}>
        <torusGeometry args={[0.42, 0.03, 10, 48]} />
        <meshStandardMaterial
          color={palette.green}
          emissive={palette.green}
          emissiveIntensity={0.5}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      <SceneLights />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* AI — USER → APPLICATION → MODEL → RESPONSE pipeline                 */
/* ------------------------------------------------------------------ */

const STAGE_X = [-1.9, -0.65, 0.65, 1.9];

export function PipelineScene({ reduced }: { reduced: boolean }) {
  const matRefs = useRef<Array<THREE.MeshStandardMaterial | null>>([]);
  const packetRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!reduced && packetRef.current) {
      const travel = (t * 0.28) % 1;
      const scaled = travel * (STAGE_X.length - 1);
      const segment = Math.min(Math.floor(scaled), STAGE_X.length - 2);
      const local = scaled - segment;
      const x = THREE.MathUtils.lerp(STAGE_X[segment], STAGE_X[segment + 1], local);
      packetRef.current.position.set(x, 0.55 + Math.sin(travel * Math.PI) * 0.18, 0);
    }

    const packetX = packetRef.current?.position.x ?? 0;
    STAGE_X.forEach((x, index) => {
      const material = matRefs.current[index];
      if (!material) return;
      const packetNear = 1 - Math.min(Math.abs(packetX - x) / 1.4, 1);
      material.emissiveIntensity = 0.25 + packetNear * 1.1;
    });
  });

  return (
    <>
      {STAGE_X.map((x, index) => (
        <group key={index} position={[x, -0.35, 0]}>
          <RoundedBox args={[0.72, 0.7, 0.5]} radius={0.06} smoothness={3}>
            <meshStandardMaterial
              ref={(material: THREE.MeshStandardMaterial | null) => {
                matRefs.current[index] = material;
              }}
              color={palette.panel}
              metalness={0.55}
              roughness={0.4}
              emissive={palette.accent}
              emissiveIntensity={0.25}
            />
          </RoundedBox>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
            <meshBasicMaterial color={palette.accent} transparent opacity={0.5} />
          </mesh>
          <mesh position={[0, -0.36, 0.26]}>
            <boxGeometry args={[0.5, 0.04, 0.02]} />
            <meshBasicMaterial color={index % 2 === 0 ? palette.accent : palette.cyan} />
          </mesh>
        </group>
      ))}

      {/* Flow rail */}
      <mesh position={[0, -0.7, 0]}>
        <boxGeometry args={[4.6, 0.03, 0.08]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.35} />
      </mesh>

      {/* Traveling request/response packet */}
      <mesh ref={packetRef} position={[-1.9, 0.55, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial
          color={palette.packet}
          emissive={palette.cyan}
          emissiveIntensity={1.4}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>

      {/* Loop-back arc: response returns to user */}
      <mesh position={[0, 1.35, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.1, 0.012, 8, 64, Math.PI]} />
        <meshBasicMaterial color={palette.cyan} transparent opacity={0.3} />
      </mesh>

      <SceneLights />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Networking — routers, switches, links, animated packets             */
/* ------------------------------------------------------------------ */

interface Link {
  from: [number, number, number];
  to: [number, number, number];
}

const DEVICES = {
  router: [0, 0.12, 0] as [number, number, number],
  switchA: [-1.35, 0.08, 0.35] as [number, number, number],
  switchB: [1.35, 0.08, 0.35] as [number, number, number],
  server: [0, 0.2, -1.5] as [number, number, number],
  pc1: [-2.2, 0.16, 1.2] as [number, number, number],
  pc2: [-1.3, 0.16, 1.55] as [number, number, number],
  pc3: [2.2, 0.16, 1.2] as [number, number, number],
  pc4: [1.3, 0.16, 1.55] as [number, number, number],
};

const LINKS: Link[] = [
  { from: DEVICES.router, to: DEVICES.switchA },
  { from: DEVICES.router, to: DEVICES.switchB },
  { from: DEVICES.router, to: DEVICES.server },
  { from: DEVICES.switchA, to: DEVICES.pc1 },
  { from: DEVICES.switchA, to: DEVICES.pc2 },
  { from: DEVICES.switchB, to: DEVICES.pc3 },
  { from: DEVICES.switchB, to: DEVICES.pc4 },
];

function RouterDevice() {
  return (
    <group position={DEVICES.router}>
      <mesh>
        <cylinderGeometry args={[0.3, 0.32, 0.14, 24]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.22, 8]} />
        <meshStandardMaterial
          color={palette.accent}
          emissive={palette.accent}
          emissiveIntensity={0.9}
        />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <torusGeometry args={[0.2, 0.015, 8, 32]} />
        <meshBasicMaterial color={palette.cyan} />
      </mesh>
    </group>
  );
}

function SwitchDevice({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.75, 0.14, 0.34]} />
        <meshStandardMaterial color="#172033" metalness={0.65} roughness={0.35} />
      </mesh>
      {[-0.24, -0.08, 0.08, 0.24].map((x) => (
        <mesh key={x} position={[x, 0.075, 0.12]}>
          <boxGeometry args={[0.08, 0.02, 0.02]} />
          <meshBasicMaterial color={palette.green} />
        </mesh>
      ))}
    </group>
  );
}

function PcDevice({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.22, 0.34, 0.22]} />
        <meshStandardMaterial color="#111827" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.06, 0.115]}>
        <boxGeometry args={[0.14, 0.1, 0.01]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

function ServerDevice() {
  return (
    <group position={DEVICES.server}>
      <mesh>
        <boxGeometry args={[0.5, 0.7, 0.36]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.32} />
      </mesh>
      {[0.2, 0.05, -0.1, -0.25].map((y) => (
        <mesh key={y} position={[0, y, 0.19]}>
          <boxGeometry args={[0.36, 0.05, 0.01]} />
          <meshBasicMaterial color={y === 0.05 ? palette.green : "#334155"} />
        </mesh>
      ))}
    </group>
  );
}

export function NetworkScene({ reduced }: { reduced: boolean }) {
  const packetRefs = useRef<Array<THREE.Mesh | null>>([]);

  const linkGeometry = useMemo(() => {
    const positions: number[] = [];
    for (const link of LINKS) {
      positions.push(...link.from, ...link.to);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    const packetCount = packetRefs.current.length;
    for (let i = 0; i < packetCount; i++) {
      const mesh = packetRefs.current[i];
      if (!mesh) continue;
      const link = LINKS[i % LINKS.length];
      const phase = (t * (0.3 + (i % 3) * 0.08) + i * 0.3) % 1;
      mesh.position.set(
        THREE.MathUtils.lerp(link.from[0], link.to[0], phase),
        THREE.MathUtils.lerp(link.from[1], link.to[1], phase) + 0.12,
        THREE.MathUtils.lerp(link.from[2], link.to[2], phase),
      );
    }
  });

  return (
    <>
      <lineSegments geometry={linkGeometry}>
        <lineBasicMaterial color={palette.accent} transparent opacity={0.4} depthWrite={false} />
      </lineSegments>

      <RouterDevice />
      <SwitchDevice position={DEVICES.switchA} />
      <SwitchDevice position={DEVICES.switchB} />
      <ServerDevice />
      <PcDevice position={DEVICES.pc1} />
      <PcDevice position={DEVICES.pc2} />
      <PcDevice position={DEVICES.pc3} />
      <PcDevice position={DEVICES.pc4} />

      {LINKS.slice(0, 5).map((_, index) => (
        <mesh
          key={index}
          ref={(el) => {
            packetRefs.current[index] = el;
          }}
        >
          <sphereGeometry args={[0.055, 10, 10]} />
          <meshBasicMaterial color={palette.packet} />
        </mesh>
      ))}

      <gridHelper args={[10, 20, "#1e293b", "#0f172a"]} position={[0, -0.01, 0]} />

      <SceneLights />
      <pointLight position={[0, 2, 2]} intensity={2.5} color={palette.cyan} distance={8} />
    </>
  );
}
