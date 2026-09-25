import { simplexNoise } from "./noise";

export const particlesVertex = /* glsl */ `
attribute vec3 aPosB;
attribute vec4 aRandom;

uniform float uTime;
uniform float uMix;
uniform float uScatter;
uniform float uSwirl;
uniform vec3 uMouse;
uniform float uMouseStrength;
uniform float uMouseRadius;
uniform float uSize;
uniform float uPixelRatio;
uniform float uIntensity;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;

varying vec3 vColor;
varying float vAlpha;

${simplexNoise}

void main(){
  // Per-particle stagger; must stay in sync with the CPU bake in Particles.tsx.
  float delay = aRandom.x * 0.45;
  float m = smoothstep(delay, delay + 0.55, uMix);
  vec3 pos = mix(position, aPosB, m);

  if (uSwirl != 0.0) {
    float r = length(pos.xy);
    float a = uSwirl / (0.35 + r * 0.35);
    float cs = cos(a), sn = sin(a);
    pos.xy = vec2(pos.x * cs - pos.y * sn, pos.x * sn + pos.y * cs);
  }

  float mid = sin(m * 3.14159265);
  vec3 flow = flowNoise(pos * 0.35 + vec3(0.0, 0.0, uTime * 0.08));
  pos += flow * (0.045 + mid * (0.35 + aRandom.y * 0.9));
  pos *= 1.0 + sin(uTime * 0.9 + aRandom.z * 6.2831) * 0.012;

  vec3 dir = normalize(pos + (aRandom.yzw - 0.5) * 1.5 + 0.0001);
  pos += dir * uScatter * (1.5 + aRandom.y * 7.0);

  vec2 dm = pos.xy - uMouse.xy;
  float dl = length(dm);
  float f = (1.0 - smoothstep(0.0, uMouseRadius, dl)) * uMouseStrength;
  pos.xy += (dm / max(dl, 0.001)) * f * 0.55;
  pos.z += f * (aRandom.w - 0.35) * 1.2;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  float sizeRand = 0.35 + aRandom.w * aRandom.w * 1.3;
  gl_PointSize = uSize * sizeRand * uPixelRatio / max(-mv.z, 0.5);

  // Iridescent tint: hue drifts with position and view angle, peach is a rare highlight.
  vec3 viewN = normalize((modelViewMatrix * vec4(normalize(pos + 0.0001), 0.0)).xyz);
  float fres = pow(1.0 - abs(viewN.z), 2.0);
  float h = fract(aRandom.z * 0.3 + pos.x * 0.07 + pos.y * 0.05 + uTime * 0.025 + fres * 0.35);
  float tri = abs(h * 2.0 - 1.0);
  vec3 col = mix(uColorB, uColorA, tri);
  col = mix(col, uColorC, step(0.955, aRandom.w) * 0.85);
  col += f * 0.35;
  vColor = col;

  float depthFade = smoothstep(-40.0, -3.0, mv.z);
  vAlpha = uIntensity * (0.35 + 0.65 * aRandom.y) * depthFade * (1.0 - uScatter * 0.25);
}
`;

export const particlesFragment = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;

void main(){
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.0, d);
  a *= a;
  gl_FragColor = vec4(vColor, a * vAlpha);
  #include <colorspace_fragment>
}
`;
