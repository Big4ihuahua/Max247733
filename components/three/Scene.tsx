"use client";

import { Component, useEffect, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSceneMode } from "@/hooks/useSceneMode";
import { sceneMode } from "@/lib/scene-mode";
import { Particles } from "./Particles";
import { Stars } from "./Stars";
import { GlassCore } from "./GlassCore";
import { Devices } from "./Devices";
import { BackgroundTint, CameraRig } from "./Rig";
import { Effects } from "./Effects";

class WebGLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    sceneMode.forceStatic("no-webgl");
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

type Tier = 0 | 1 | 2;

/** Per-tier limits, from the full desktop scene down to what a budget phone can hold at a steady frame rate. */
const BUDGET = [
  { particles: 72000, stars: 2400, dpr: 2, effects: true, env: 256 },
  { particles: 24000, stars: 1200, dpr: 1.5, effects: false, env: 128 },
  { particles: 8000, stars: 400, dpr: 1, effects: false, env: 64 },
] as const;
const MOBILE_CAP = { particles: 16000, stars: 900, dpr: 1.5 };

/** Coarse first guess from the hardware; PerformanceMonitor refines it at runtime. */
function detectTier(): Tier {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory ?? 8;
  if (cores <= 2 || memory <= 2) return 2;
  if (cores <= 4 || memory <= 4) return 1;
  return 0;
}

export default function Scene() {
  const mobile = useMediaQuery("(max-width: 767px), (pointer: coarse)");
  const { isStatic } = useSceneMode();
  const [supported] = useState(hasWebGL);
  const [tier, setTier] = useState<Tier>(detectTier);
  const [boost, setBoost] = useState(false);

  useEffect(() => {
    if (!supported) sceneMode.forceStatic("no-webgl");
  }, [supported]);

  if (!supported || isStatic) return null;

  const b = BUDGET[tier];
  const particles = mobile ? Math.min(b.particles, MOBILE_CAP.particles) : b.particles;
  const stars = mobile ? Math.min(b.stars, MOBILE_CAP.stars) : b.stars;
  const maxDpr = mobile ? Math.min(b.dpr, MOBILE_CAP.dpr) : boost ? b.dpr : Math.min(b.dpr, 1.5);

  return (
    <div className="webgl" aria-hidden="true">
      <WebGLBoundary>
        <Canvas
          key={mobile ? "m" : "d"}
          dpr={[1, maxDpr]}
          camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 120 }}
          gl={{ antialias: false, alpha: false, stencil: false, powerPreference: tier === 2 ? "low-power" : "high-performance" }}
        >
          <color attach="background" args={["#07080b"]} />
          <PerformanceMonitor
            flipflops={3}
            onIncline={() => setBoost(true)}
            onDecline={() => {
              setBoost(false);
              setTier((t) => (t < 2 ? ((t + 1) as Tier) : t));
            }}
            // Still dropping frames after stepping down: the static backdrop is the lighter option.
            onFallback={() => sceneMode.forceStatic("performance")}
          />
          <BackgroundTint />
          <CameraRig />
          <Stars count={stars} />
          <Particles count={particles} mobile={mobile} />
          <GlassCore />
          <Devices />
          <Environment resolution={b.env} frames={1}>
            <Lightformer form="rect" intensity={2.2} color="#7cf5c8" position={[-5, 2, 3]} scale={[4, 8, 1]} />
            <Lightformer form="rect" intensity={2.2} color="#a89bff" position={[5, -1, 2]} scale={[4, 8, 1]} />
            <Lightformer form="ring" intensity={1.6} color="#ffb38a" position={[0, 5, -3]} scale={3} />
            <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[0, 0, 8]} scale={[10, 2, 1]} />
          </Environment>
          {b.effects && !mobile && <Effects />}
        </Canvas>
      </WebGLBoundary>
    </div>
  );
}
