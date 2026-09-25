"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { sceneStore } from "@/lib/scene-store";
import { coreFrame, damp } from "./layouts";

/** Glass icosahedron that wraps the particle core in the manifesto section. */
export function GlassCore() {
  const mesh = useRef<THREE.Mesh>(null);
  const shown = useRef(0);

  useFrame((_, dt) => {
    const m = mesh.current;
    if (!m) return;
    const s = sceneStore.state;
    shown.current = damp(shown.current, s.revealed && s.section === "manifesto" ? 1 : 0, 2.6, dt);
    m.visible = shown.current > 0.01;
    if (!m.visible) return;
    const e = 1 - Math.pow(1 - shown.current, 3);
    m.position.set(coreFrame.x, coreFrame.y, coreFrame.z);
    m.scale.setScalar(e * 1.75 * coreFrame.scale);
    m.rotation.x += dt * 0.12;
    m.rotation.y += dt * 0.19;
  });

  return (
    <mesh ref={mesh} visible={false}>
      <icosahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial
        color="#ffffff"
        transmission={1}
        thickness={1.2}
        roughness={0.06}
        ior={1.5}
        iridescence={1}
        iridescenceIOR={1.4}
        iridescenceThicknessRange={[120, 620]}
        clearcoat={1}
        clearcoatRoughness={0.04}
        attenuationColor="#d9d2ff"
        attenuationDistance={3}
        envMapIntensity={1.4}
        flatShading
        depthWrite={false}
      />
    </mesh>
  );
}
