"use client";

import { useMemo } from "react";
import { Vector2 } from "three";
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";

export function Effects() {
  const offset = useMemo(() => new Vector2(0.0009, 0.0009), []);
  return (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur intensity={0.65} luminanceThreshold={0.25} luminanceSmoothing={0.3} radius={0.7} />
      <ChromaticAberration offset={offset} radialModulation modulationOffset={0.45} />
      <Vignette darkness={0.55} offset={0.3} />
    </EffectComposer>
  );
}
