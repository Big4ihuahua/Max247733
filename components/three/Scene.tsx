"use client";

import { Component, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { useMediaQuery } from "@/hooks/useMediaQuery";
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

export default function Scene() {
  const mobile = useMediaQuery("(max-width: 767px), (pointer: coarse)");
  const [supported] = useState(hasWebGL);
  const [dpr, setDpr] = useState(1.5);
  const [effects, setEffects] = useState(true);

  if (!supported) return null;

  return (
    <div className="webgl" aria-hidden="true">
      <WebGLBoundary>
        <Canvas
          key={mobile ? "m" : "d"}
          dpr={mobile ? [1, 1.5] : [1, dpr]}
          camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 120 }}
          gl={{ antialias: false, alpha: false, stencil: false, powerPreference: "high-performance" }}
        >
          <color attach="background" args={["#07080b"]} />
          <PerformanceMonitor
            flipflops={3}
            onIncline={() => setDpr(2)}
            onDecline={() => {
              setDpr(1);
              setEffects(false);
            }}
            onFallback={() => {
              setDpr(1);
              setEffects(false);
            }}
          />
          <BackgroundTint />
          <CameraRig />
          <Stars count={mobile ? 900 : 2400} />
          <Particles count={mobile ? 16000 : 72000} mobile={mobile} />
          <GlassCore />
          <Devices />
          <Environment resolution={256} frames={1}>
            <Lightformer form="rect" intensity={2.2} color="#7cf5c8" position={[-5, 2, 3]} scale={[4, 8, 1]} />
            <Lightformer form="rect" intensity={2.2} color="#a89bff" position={[5, -1, 2]} scale={[4, 8, 1]} />
            <Lightformer form="ring" intensity={1.6} color="#ffb38a" position={[0, 5, -3]} scale={3} />
            <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[0, 0, 8]} scale={[10, 2, 1]} />
          </Environment>
          {effects && !mobile && <Effects />}
        </Canvas>
      </WebGLBoundary>
    </div>
  );
}
