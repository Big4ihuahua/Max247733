"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

export function SceneLoader() {
  return (
    <>
      {/* Shown by CSS instead of the canvas in the static scene mode. */}
      <div className="scene-backdrop" aria-hidden="true" />
      <Scene />
    </>
  );
}
