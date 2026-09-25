"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { gsap } from "@/lib/gsap";
import { sceneStore } from "@/lib/scene-store";
import { particlesFragment, particlesVertex } from "@/shaders/particles";
import { clearTextShapes, getShape, type ShapeKey } from "./shapes";
import { HERO_SEQUENCE, SWIRL, coreFrame, damp, layoutFor, resolveShape } from "./layouts";

const HERO_INTERVAL = 4;

export function Particles({ count, mobile }: { count: number; mobile: boolean }) {
  const group = useRef<THREE.Group>(null);
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);

  const data = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const start = getShape("chaos", count);
    const posA = new THREE.BufferAttribute(new Float32Array(start), 3);
    const posB = new THREE.BufferAttribute(new Float32Array(start), 3);
    posA.setUsage(THREE.DynamicDrawUsage);
    posB.setUsage(THREE.DynamicDrawUsage);
    const rand = new Float32Array(count * 4);
    for (let i = 0; i < rand.length; i++) rand[i] = Math.random();
    geometry.setAttribute("position", posA);
    geometry.setAttribute("aPosB", posB);
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(rand, 4));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 60);

    const material = new THREE.ShaderMaterial({
      vertexShader: particlesVertex,
      fragmentShader: particlesFragment,
      uniforms: {
        uTime: { value: 0 },
        uMix: { value: 1 },
        uScatter: { value: 0 },
        uSwirl: { value: 0 },
        uMouse: { value: new THREE.Vector3(99, 99, 0) },
        uMouseStrength: { value: 0 },
        uMouseRadius: { value: 1.2 },
        uSize: { value: mobile ? 34 : 26 },
        uPixelRatio: { value: 1 },
        uIntensity: { value: 0 },
        uColorA: { value: new THREE.Color("#7cf5c8") },
        uColorB: { value: new THREE.Color("#a89bff") },
        uColorC: { value: new THREE.Color("#ffb38a") },
      },
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      // Kept in the opaque list so the glass core's transmission pass can refract the particles.
      transparent: false,
    });
    return { geometry, material, posA, posB, rand };
  }, [count, mobile]);

  useEffect(
    () => () => {
      data.geometry.dispose();
      data.material.dispose();
    },
    [data],
  );

  const ctl = useRef({
    target: "chaos" as ShapeKey,
    tween: null as gsap.core.Tween | null,
    heroIndex: 0,
    heroTime: 0,
    swirlSpeed: 0,
    burstSeen: sceneStore.state.burst,
    scatter: 0,
    mouse: 0,
  });
  const burst = useRef({ v: 0 });
  const tmp = useMemo(
    () => ({
      ray: new THREE.Raycaster(),
      plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
      hit: new THREE.Vector3(),
      ndc: new THREE.Vector2(),
    }),
    [],
  );

  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => {
      if (!alive) return;
      clearTextShapes();
      // Re-sample the current text shape with the real display font once it is available.
      const key = ctl.current.target;
      if (key === "code" || key === "logo") {
        data.posB.set(getShape(key, count));
        data.posB.needsUpdate = true;
      }
    });
    return () => {
      alive = false;
    };
  }, [data, count]);

  const morphTo = (key: ShapeKey) => {
    const c = ctl.current;
    const u = data.material.uniforms;
    const A = data.posA.array as Float32Array;
    const B = data.posB.array as Float32Array;
    const R = data.rand;
    const mix = u.uMix.value as number;
    const phase = u.uSwirl.value as number;

    // Bake what is on screen right now into A so an interrupted morph continues seamlessly.
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const d = R[i * 4] * 0.45;
      let m = (mix - d) / 0.55;
      m = m < 0 ? 0 : m > 1 ? 1 : m;
      m = m * m * (3 - 2 * m);
      let x = A[i3] + (B[i3] - A[i3]) * m;
      let y = A[i3 + 1] + (B[i3 + 1] - A[i3 + 1]) * m;
      const z = A[i3 + 2] + (B[i3 + 2] - A[i3 + 2]) * m;
      if (phase !== 0) {
        const a = phase / (0.35 + Math.hypot(x, y) * 0.35);
        const cs = Math.cos(a);
        const sn = Math.sin(a);
        const nx = x * cs - y * sn;
        y = x * sn + y * cs;
        x = nx;
      }
      A[i3] = x;
      A[i3 + 1] = y;
      A[i3 + 2] = z;
    }
    B.set(getShape(key, count));
    data.posA.needsUpdate = true;
    data.posB.needsUpdate = true;
    u.uMix.value = 0;
    u.uSwirl.value = 0;
    c.swirlSpeed = SWIRL[key] ?? 0;
    c.tween?.kill();
    c.tween = gsap.to(u.uMix, {
      value: 1,
      duration: key === "logo" ? 1.1 : key === "check" ? 1.5 : 2.1,
      ease: "power2.inOut",
    });
    c.target = key;
  };

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const s = sceneStore.state;
    const c = ctl.current;
    const u = data.material.uniforms;
    const t = state.clock.elapsedTime;
    dt = Math.min(dt, 0.05);

    if (s.section === "hero" && s.revealed) {
      c.heroTime += dt;
      if (c.heroTime > HERO_INTERVAL) {
        c.heroTime = 0;
        c.heroIndex = (c.heroIndex + 1) % HERO_SEQUENCE.length;
      }
    }

    const key = resolveShape(s, c.heroIndex);
    if (key !== c.target) morphTo(key);

    if (s.burst !== c.burstSeen) {
      c.burstSeen = s.burst;
      gsap
        .timeline()
        .to(burst.current, { v: 0.9, duration: 0.45, ease: "power3.out" })
        .to(burst.current, { v: 0, duration: 1.6, ease: "power2.inOut" });
    }

    const L = layoutFor(s, mobile);
    let [tx, ty] = L.pos;
    const tz = L.pos[2];
    let ts = L.scale;
    let follow = 2.2;
    const el = L.anchor ? document.getElementById(L.anchor) : null;
    if (el && L.anchorSize) {
      const r = el.getBoundingClientRect();
      const { width: vw, height: vh } = state.size;
      const cam = camera as THREE.PerspectiveCamera;
      const visH = 2 * Math.tan((cam.fov * Math.PI) / 360) * (cam.position.z - tz);
      tx = ((r.left + r.width / 2) / vw - 0.5) * visH * (vw / vh);
      ty = -((r.top + r.height / 2) / vh - 0.5) * visH;
      ts = ((r.height / vh) * visH) / L.anchorSize;
      follow = 7;
    }
    g.position.x = damp(g.position.x, tx, follow, dt);
    g.position.y = damp(g.position.y, ty, follow, dt);
    g.position.z = damp(g.position.z, tz, 2.2, dt);
    g.scale.setScalar(damp(g.scale.x, ts, 2.2, dt));
    coreFrame.x = g.position.x;
    coreFrame.y = g.position.y;
    coreFrame.z = g.position.z;
    coreFrame.scale = g.scale.x;
    const px = s.pointerActive ? s.pointer.x : 0;
    const py = s.pointerActive ? s.pointer.y : 0;
    g.rotation.x = damp(g.rotation.x, L.rot[0] - py * 0.12, 2, dt);
    g.rotation.y = damp(g.rotation.y, L.rot[1] + Math.sin(t * 0.22) * 0.22 + px * 0.28, 2, dt);
    g.rotation.z = damp(g.rotation.z, L.rot[2], 2, dt);

    u.uTime.value = t;
    u.uPixelRatio.value = gl.getPixelRatio();
    u.uIntensity.value = damp(u.uIntensity.value, L.intensity, 2.5, dt);
    c.scatter = damp(c.scatter, s.section === "hero" && s.revealed ? s.heroExit * 1.1 : 0, 5, dt);
    u.uScatter.value = c.scatter + burst.current.v;
    u.uSwirl.value += dt * c.swirlSpeed;

    tmp.ndc.set(s.pointer.x, s.pointer.y);
    tmp.ray.setFromCamera(tmp.ndc, camera);
    tmp.plane.constant = -g.position.z;
    if (tmp.ray.ray.intersectPlane(tmp.plane, tmp.hit)) {
      g.worldToLocal(tmp.hit);
      (u.uMouse.value as THREE.Vector3).lerp(tmp.hit, 1 - Math.exp(-dt * 8));
    }
    c.mouse = damp(c.mouse, s.pointerActive && !mobile ? 1 : 0, 3, dt);
    u.uMouseStrength.value = c.mouse;
    u.uMouseRadius.value = 1.25 / Math.max(g.scale.x, 0.1);
  });

  return (
    <group ref={group}>
      <points geometry={data.geometry} material={data.material} frustumCulled={false} />
    </group>
  );
}
