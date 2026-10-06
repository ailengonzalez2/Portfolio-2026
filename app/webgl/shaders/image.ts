import { gradientAt } from '../math'

const vec3 = (c: [number, number, number]) => `vec3(${c.map(v => v.toFixed(4)).join(', ')})`

// Image helpers for particle layers. Colors are raw sRGB: every material here
// writes gl_FragColor directly, without three's color management.
export const imageChunk = /* glsl */`
// object-fit: cover for a texture of size image drawn in a box
vec2 coverUv(vec2 uv, vec2 box, vec2 image) {
  float boxRatio = box.x / box.y;
  float imageRatio = image.x / image.y;
  vec2 s = boxRatio > imageRatio ? vec2(1.0, imageRatio / boxRatio) : vec2(boxRatio / imageRatio, 1.0);
  return (uv - 0.5) * s + 0.5;
}
float luma(vec3 c) {
  return dot(c, vec3(0.299, 0.587, 0.114));
}
float sobel(sampler2D tex, vec2 uv, vec2 texel) {
  float tl = luma(texture2D(tex, uv + texel * vec2(-1.0, 1.0)).rgb);
  float tc = luma(texture2D(tex, uv + texel * vec2(0.0, 1.0)).rgb);
  float tr = luma(texture2D(tex, uv + texel * vec2(1.0, 1.0)).rgb);
  float ml = luma(texture2D(tex, uv + texel * vec2(-1.0, 0.0)).rgb);
  float mr = luma(texture2D(tex, uv + texel * vec2(1.0, 0.0)).rgb);
  float bl = luma(texture2D(tex, uv + texel * vec2(-1.0, -1.0)).rgb);
  float bc = luma(texture2D(tex, uv + texel * vec2(0.0, -1.0)).rgb);
  float br = luma(texture2D(tex, uv + texel * vec2(1.0, -1.0)).rgb);
  float gx = -tl - 2.0 * ml - bl + tr + 2.0 * mr + br;
  float gy = -bl - 2.0 * bc - br + tl + 2.0 * tc + tr;
  return length(vec2(gx, gy));
}
// Brand gradient: violet (0) -> coral (0.5) -> orange (1)
vec3 brandGradient(float t) {
  t = clamp(t, 0.0, 1.0);
  return t < 0.5
    ? mix(${vec3(gradientAt(0))}, ${vec3(gradientAt(0.5))}, t * 2.0)
    : mix(${vec3(gradientAt(0.5))}, ${vec3(gradientAt(1))}, (t - 0.5) * 2.0);
}
`

// Soft round point; shared by every particle layer.
export const pointFragment = /* glsl */`
uniform float uOpacity;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(vColor, smoothstep(0.5, 0.15, d) * vAlpha * uOpacity);
}
`
