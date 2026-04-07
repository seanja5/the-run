uniform float uTime;

varying vec3 vWorldPos;
varying vec3 vNormal;
varying float vHeight;

void main() {
  vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  vNormal = normalize(normalMatrix * normal);
  vHeight = position.y;

  // Subtle shimmer on snow surface
  float shimmer = sin(position.x * 8.0 + uTime * 2.0) * 0.006
                + sin(position.z * 6.0 + uTime * 1.5) * 0.004;
  vec3 displaced = position + normal * shimmer * step(0.1, position.y);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
