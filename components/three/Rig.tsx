"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { sceneStore } from "@/lib/scene-store";
import { SECTION_BG, damp } from "./layouts";

export function CameraRig() {
  useFrame((state, dt) => {
    const s = sceneStore.state;
    const cam = state.camera;
    const px = s.pointerActive ? s.pointer.x : 0;
    const py = s.pointerActive ? s.pointer.y : 0;
    cam.position.x = damp(cam.position.x, px * 0.35, 2, dt);
    cam.position.y = damp(cam.position.y, py * 0.2, 2, dt);
    cam.position.z = damp(cam.position.z, 8 + (s.section === "hero" ? s.heroExit * 1.4 : 0), 3, dt);
    cam.lookAt(0, 0, 0);
  });
  return null;
}

/** Eases the clear colour between per-section tints. */
export function BackgroundTint() {
  const target = useMemo(() => new THREE.Color(), []);
  useFrame((state, dt) => {
    const bg = state.scene.background;
    if (!(bg instanceof THREE.Color)) return;
    target.set(SECTION_BG[sceneStore.state.section]);
    bg.lerp(target, 1 - Math.exp(-dt * 1.6));
  });
  return null;
}
