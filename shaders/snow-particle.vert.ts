const snowParticleVert = /* glsl */ `
uniform float uTime;
uniform float uWindX;
uniform float uSpeed;

attribute float aSize;
attribute float aSpeed;
attribute float aPhase;

void main() {
  vec3 pos = position;

  float t = uTime * aSpeed * uSpeed + aPhase;

  pos.x += sin(t * 0.7 + pos.z * 0.08) * 0.5 + uWindX;
  pos.z += cos(t * 0.5 + pos.x * 0.06) * 0.3;

  float fallRange = 80.0;
  pos.y -= mod(t * 1.3, fallRange);

  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = aSize * (250.0 / -mvPos.z);
  gl_Position = projectionMatrix * mvPos;
}
`
export default snowParticleVert
