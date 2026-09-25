export const starsVertex = /* glsl */ `
attribute vec4 aRandom;
uniform float uTime;
uniform float uScroll;
uniform float uPixelRatio;
varying float vAlpha;

void main(){
  vec3 p = position;
  float depth = clamp((-p.z - 6.0) / 30.0, 0.0, 1.0);
  p.y = mod(p.y + uScroll * mix(1.0, 0.25, depth) + 14.0, 28.0) - 14.0;
  p.x += sin(uTime * 0.05 + aRandom.x * 6.28) * 0.2;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (1.0 + aRandom.y * 2.2) * uPixelRatio * (20.0 / -mv.z);
  float tw = 0.55 + 0.45 * sin(uTime * (0.6 + aRandom.z * 1.8) + aRandom.w * 6.28);
  vAlpha = tw * (0.25 + aRandom.y * 0.6) * (1.0 - depth * 0.5);
}
`;

export const starsFragment = /* glsl */ `
varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vec3(0.93, 0.92, 0.9), a * vAlpha);
  #include <colorspace_fragment>
}
`;
