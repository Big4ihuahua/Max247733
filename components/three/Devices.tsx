"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { sceneStore } from "@/lib/scene-store";
import { roundedPlane, roundedSlab } from "./deviceGeometry";
import { createKeyboardTexture, createPhoneScreen, createSiteScreen } from "./deviceTextures";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

type Anchor = { x: number; y: number; w: number; h: number; p: number };

/** Projects a DOM placeholder onto the z = 0 plane so a 3D model can sit exactly where the layout reserves space. */
function anchor(el: HTMLElement | null, cam: THREE.PerspectiveCamera, vw: number, vh: number): Anchor | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width === 0 || r.bottom < -80 || r.top > vh + 80) return null;
  const visH = 2 * Math.tan((cam.fov * Math.PI) / 360) * cam.position.z;
  const visW = visH * (vw / vh);
  return {
    x: ((r.left + r.width / 2) / vw - 0.5) * visW + cam.position.x,
    y: -((r.top + r.height / 2) / vh - 0.5) * visH + cam.position.y,
    w: (r.width / vw) * visW,
    h: (r.height / vh) * visH,
    p: clamp01(1 - (r.top + r.height) / (vh + r.height)),
  };
}

const SITE_WINDOW = (4.3 / 2.72) * (2600 / 1024);

export function Devices() {
  const phone = useRef<THREE.Group>(null);
  const laptop = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const els = useRef<{ phone: HTMLElement | null; laptop: HTMLElement | null }>({ phone: null, laptop: null });
  const redraw = useRef(0);

  const a = useMemo(() => {
    const phoneScreen = createPhoneScreen();
    const site = createSiteScreen();
    site.texture.repeat.set(1, 1 / SITE_WINDOW);
    site.texture.offset.set(0, 1 - 1 / SITE_WINDOW);
    const base = roundedSlab(4.6, 3.1, 0.18, 0.1, 0.03);
    base.rotateX(-Math.PI / 2);
    const keyboard = roundedPlane(4.0, 1.56, 0.05);
    keyboard.rotateX(-Math.PI / 2);
    const trackpad = roundedPlane(1.5, 0.9, 0.07);
    trackpad.rotateX(-Math.PI / 2);
    return {
      phoneScreen,
      site,
      keyboardTex: createKeyboardTexture(),
      phoneBody: roundedSlab(1.62, 3.3, 0.27, 0.12, 0.035),
      phoneGlass: roundedPlane(1.5, 3.18, 0.21),
      island: roundedPlane(0.42, 0.12, 0.06),
      bump: roundedSlab(0.7, 0.7, 0.18, 0.04, 0.015),
      base,
      lidBody: roundedSlab(4.6, 3.0, 0.16, 0.05, 0.02),
      lidScreen: roundedPlane(4.3, 2.72, 0.06),
      keyboard,
      trackpad,
      metal: new THREE.MeshPhysicalMaterial({ color: "#1a1c22", metalness: 0.75, roughness: 0.28, clearcoat: 0.8, clearcoatRoughness: 0.2 }),
      alu: new THREE.MeshPhysicalMaterial({ color: "#6a6e78", metalness: 0.65, roughness: 0.32, clearcoat: 0.4, envMapIntensity: 1.6 }),
      black: new THREE.MeshBasicMaterial({ color: "#050506" }),
    };
  }, []);

  useEffect(() => {
    document.fonts?.ready.then(() => a.site.draw());
    return () => {
      Object.values(a).forEach((v) => {
        if (v && typeof v === "object" && "dispose" in v && typeof v.dispose === "function") v.dispose();
      });
      a.phoneScreen.texture.dispose();
      a.site.texture.dispose();
    };
  }, [a]);

  useFrame((state, dt) => {
    const cam = state.camera as THREE.PerspectiveCamera;
    const { width: vw, height: vh } = state.size;
    const t = state.clock.elapsedTime;
    const s = sceneStore.state;
    const px = s.pointerActive ? s.pointer.x : 0;
    const py = s.pointerActive ? s.pointer.y : 0;

    els.current.phone ??= document.getElementById("device-phone");
    els.current.laptop ??= document.getElementById("device-laptop");

    const ph = phone.current;
    if (ph) {
      const an = anchor(els.current.phone, cam, vw, vh);
      ph.visible = !!an;
      if (an) {
        ph.position.set(an.x, an.y + Math.sin(t * 0.8) * 0.04 * an.h, 0);
        ph.scale.setScalar(Math.min(an.h / 3.7, an.w / 2.2));
        ph.rotation.set(0.18 - an.p * 0.3 - py * 0.1, -0.9 + an.p * 1.8 + px * 0.2, -0.06 + an.p * 0.12);
        redraw.current += dt;
        if (redraw.current > 1 / 24) {
          redraw.current = 0;
          a.phoneScreen.draw(t);
        }
      }
    }

    const lp = laptop.current;
    if (lp && lid.current) {
      const an = anchor(els.current.laptop, cam, vw, vh);
      lp.visible = !!an;
      if (an) {
        lp.position.set(an.x, an.y - an.h * 0.12, 0);
        lp.scale.setScalar(Math.min(an.w / 5.2, an.h / 3.9));
        lp.rotation.set(0.32 - py * 0.08, 0.5 - an.p * 1.0 + px * 0.15, 0);
        const open = easeOut(clamp01((an.p - 0.08) * 2.6));
        lid.current.rotation.x = THREE.MathUtils.lerp(Math.PI / 2 - 0.03, -0.24, open);
        const scroll = clamp01((an.p - 0.38) / 0.42);
        a.site.texture.offset.y = (1 - 1 / SITE_WINDOW) * (1 - scroll);
      }
    }
  });

  return (
    <>
      <group ref={phone} visible={false}>
        <mesh geometry={a.phoneBody} material={a.metal} />
        <mesh geometry={a.phoneGlass} position={[0, 0, 0.096]}>
          <meshBasicMaterial map={a.phoneScreen.texture} toneMapped={false} />
        </mesh>
        <mesh geometry={a.island} position={[0, 1.44, 0.098]} material={a.black} />
        <mesh geometry={a.bump} position={[-0.38, 1.12, -0.11]} material={a.metal} />
        {[
          [-0.52, 1.28],
          [-0.24, 1.28],
          [-0.38, 0.98],
        ].map(([x, y], i) => (
          <mesh key={i} position={[x, y, -0.14]} rotation={[Math.PI / 2, 0, 0]} material={a.black}>
            <cylinderGeometry args={[0.1, 0.1, 0.04, 24]} />
          </mesh>
        ))}
      </group>

      <group ref={laptop} visible={false}>
        <mesh geometry={a.base} material={a.alu} />
        <mesh geometry={a.keyboard} position={[0, 0.081, -0.4]}>
          <meshStandardMaterial map={a.keyboardTex} roughness={0.8} />
        </mesh>
        <mesh geometry={a.trackpad} position={[0, 0.081, 0.95]}>
          <meshPhysicalMaterial color="#2c2f36" metalness={0.6} roughness={0.25} />
        </mesh>
        <group ref={lid} position={[0, 0.08, -1.52]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh geometry={a.lidBody} position={[0, 1.5, 0]} material={a.alu} />
          <mesh geometry={a.lidScreen} position={[0, 1.5, 0.046]} material={a.black} scale={[1.035, 1.04, 1]} />
          <mesh geometry={a.lidScreen} position={[0, 1.52, 0.048]}>
            <meshBasicMaterial map={a.site.texture} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </>
  );
}
