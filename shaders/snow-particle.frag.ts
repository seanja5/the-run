const snowParticleFrag = /* glsl */ `
void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float r = length(uv);
  float alpha = 1.0 - smoothstep(0.3, 0.5, r);
  gl_FragColor = vec4(0.92, 0.95, 1.0, alpha * 0.8);
}
`
export default snowParticleFrag
