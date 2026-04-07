const gateGlowFrag = /* glsl */ `
uniform float uTime;
uniform vec3  uColor;

void main() {
  float pulse = 0.55 + 0.45 * sin(uTime * 3.0);
  gl_FragColor = vec4(uColor * pulse, 0.75 * pulse);
}
`
export default gateGlowFrag
