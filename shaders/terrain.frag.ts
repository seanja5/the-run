const terrainFrag = /* glsl */ `
uniform float uTime;
uniform vec3  uSnowColor;
uniform vec3  uRockColor;
uniform vec3  uDuskTint;

varying vec3  vWorldPos;
varying vec3  vNormal;
varying float vHeight;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  float snowBlend = smoothstep(0.2, 3.0, vHeight);
  vec3 baseColor = mix(uRockColor, uSnowColor, snowBlend);

  float steepness = 1.0 - abs(dot(vNormal, vec3(0.0, 1.0, 0.0)));
  baseColor = mix(baseColor, uRockColor, steepness * 0.55);

  float valleyFactor = smoothstep(4.0, 0.5, vHeight);
  baseColor = mix(baseColor, vec3(0.15, 0.08, 0.2), valleyFactor * 0.25);

  float horizonFactor = smoothstep(80.0, 10.0, vWorldPos.y + 30.0);
  baseColor = mix(baseColor, uDuskTint, horizonFactor * 0.08);

  vec2 sparkUV = floor(vWorldPos.xz * 128.0);
  float sparkNoise = hash(sparkUV);
  float sparkAnim = sin(uTime * 4.0 + sparkNoise * 6.28318) * 0.5 + 0.5;
  float sparkle = step(0.997, sparkNoise) * sparkAnim;
  baseColor += sparkle * snowBlend * (1.0 - steepness) * uSnowColor * 0.6;

  float corrFactor = smoothstep(0.15, 0.05, abs(vWorldPos.x / 128.0));
  baseColor = mix(baseColor, baseColor * vec3(0.85, 0.9, 1.0), corrFactor * 0.15);

  gl_FragColor = vec4(baseColor, 1.0);
}
`
export default terrainFrag
