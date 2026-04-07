uniform float uTime;
uniform vec3  uSnowColor;   // #EEF2FF
uniform vec3  uRockColor;   // #2A1F3D
uniform vec3  uDuskTint;    // #FF6B35

varying vec3  vWorldPos;
varying vec3  vNormal;
varying float vHeight;

// Simple hash for sparkle
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  // Height-based snow/rock blend
  float snowBlend = smoothstep(0.2, 3.0, vHeight);
  vec3 baseColor = mix(uRockColor, uSnowColor, snowBlend);

  // Steep faces show rock
  float steepness = 1.0 - abs(dot(vNormal, vec3(0.0, 1.0, 0.0)));
  baseColor = mix(baseColor, uRockColor, steepness * 0.55);

  // Dusk violet tint in valleys (low areas)
  float valleyFactor = smoothstep(4.0, 0.5, vHeight);
  baseColor = mix(baseColor, vec3(0.15, 0.08, 0.2), valleyFactor * 0.25);

  // Horizon warm glow on lower world positions
  float horizonFactor = smoothstep(80.0, 10.0, vWorldPos.y + 30.0);
  baseColor = mix(baseColor, uDuskTint, horizonFactor * 0.08);

  // Animated sparkle — rare bright dots on snow surface
  vec2 sparkUV = floor(vWorldPos.xz * 128.0);
  float sparkNoise = hash(sparkUV);
  float sparkAnim = sin(uTime * 4.0 + sparkNoise * 6.28318) * 0.5 + 0.5;
  float sparkle = step(0.997, sparkNoise) * sparkAnim;
  baseColor += sparkle * snowBlend * (1.0 - steepness) * uSnowColor * 0.6;

  // Subtle blue-shadow in groomed corridor
  float corrFactor = smoothstep(0.15, 0.05, abs(vWorldPos.x / 128.0));
  baseColor = mix(baseColor, baseColor * vec3(0.85, 0.9, 1.0), corrFactor * 0.15);

  gl_FragColor = vec4(baseColor, 1.0);
}
