'use client'

import { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { generateHeightmap, TERRAIN_SIZE, HMAP_SIZE } from '@/lib/terrain'
import { useSceneStore, TIME_CONFIGS, resolveTime } from '@/store/useSceneStore'

// ---------- Inline shaders (no external files, no import issues) ----------

const VERT = /* glsl */ `
uniform float uTime;
varying vec3  vWorldPos;
varying vec3  vNormal;
varying float vHeight;
varying float vSlope;

void main() {
  vWorldPos = position; // terrain at world origin — object == world space
  vNormal   = normalize(normalMatrix * normal);
  vHeight   = position.y;
  vSlope    = 1.0 - abs(dot(vNormal, vec3(0.0, 1.0, 0.0)));

  // Subtle shimmer on snow peaks
  float shimmer = sin(position.x * 8.0 + uTime * 1.8) * 0.004
                + sin(position.z * 6.0 + uTime * 1.3) * 0.003;
  vec3 displaced = position + normal * shimmer * step(3.0, position.y);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`

const FRAG = /* glsl */ `
uniform float uTime;
uniform vec3  uSunDir;
uniform vec3  uSunColor;
uniform float uSunIntensity;
uniform vec3  uSkyColor;
uniform float uSkyIntensity;

varying vec3  vWorldPos;
varying vec3  vNormal;
varying float vHeight;
varying float vSlope;

// ---- Noise library ----
float hash(vec2 p) {
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p.yx + 19.19);
  return fract(p.x * p.y);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.52;
  mat2 rot = mat2(cos(0.6), sin(0.6), -sin(0.6), cos(0.6));
  for (int i = 0; i < 5; i++) {
    v += a * vnoise(p);
    p  = rot * p * 2.1 + vec2(13.7, 8.3);
    a *= 0.48;
  }
  return v;
}
// ---- End noise ----

void main() {
  // ---- Multi-scale noise for texture detail ----
  float nC = fbm(vWorldPos.xz * 0.04);   // coarse rock shapes
  float nM = fbm(vWorldPos.xz * 0.18);   // medium rock cracks
  float nF = fbm(vWorldPos.xz * 0.75);   // fine surface grit

  // ---- Rock material ----
  vec3 darkRock  = vec3(0.13, 0.10, 0.09);
  vec3 midRock   = vec3(0.34, 0.28, 0.23);
  vec3 lightRock = vec3(0.48, 0.40, 0.33);
  vec3 rockCol   = mix(darkRock, midRock, nC * 0.55 + nM * 0.30 + nF * 0.15);
  rockCol        = mix(rockCol, lightRock, nM * 0.25);

  // Scree/debris at mid-slopes
  vec3 screeCol = vec3(0.30, 0.25, 0.20);
  float screeAmt = smoothstep(0.22, 0.50, vSlope) * smoothstep(5.0, 1.0, vHeight);
  rockCol = mix(rockCol, screeCol, screeAmt * 0.55);

  // ---- Snow material ----
  // Threshold varies with noise to break up the boundary
  float snowH = smoothstep(0.4 + nC * 1.8, 5.5 + nC * 2.5, vHeight);
  float snowS = 1.0 - smoothstep(0.0, 0.50 + nM * 0.25, vSlope);
  float snowAmt = snowH * snowS;

  // Snow color: faint blue in shadows, cream in highlights
  float snowDetail = fbm(vWorldPos.xz * 0.45);
  vec3 snowBase = vec3(0.88 + snowDetail * 0.06, 0.91 + snowDetail * 0.04, 0.97);

  // Wind-blown surface streaks
  float streak = smoothstep(0.45, 0.55, fbm(vWorldPos.xz * vec2(0.07, 0.28)));
  snowBase *= 1.0 - streak * 0.07;

  // SSS hint: snow scatters light giving a cooler blue in concave areas
  snowBase += vec3(-0.01, 0.02, 0.06) * (1.0 - nC) * snowAmt;

  // ---- Blend ----
  vec3 baseCol = mix(rockCol, snowBase, snowAmt);

  // Valley darkening (self-shadow approximation)
  float valleyDark = smoothstep(5.0, 0.0, vHeight) * 0.40;
  baseCol *= (1.0 - valleyDark);

  // ---- Lighting ----
  float ndotl = max(0.0, dot(vNormal, uSunDir));

  // Soft wrap-around light (avoids fully black back-faces)
  float diffuse = ndotl * 0.85 + 0.15;

  // Rim/sky fill light
  float skyFill = max(0.0, dot(vNormal, vec3(0.0, 1.0, 0.0))) * uSkyIntensity;

  // Simple Blinn-Phong specular on snow
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  vec3 halfDir = normalize(uSunDir + viewDir);
  float spec = pow(max(0.0, dot(vNormal, halfDir)), 80.0)
               * 0.45 * snowAmt * (1.0 - vSlope) * ndotl;

  vec3 litCol = baseCol * (diffuse * uSunColor * uSunIntensity + uSkyColor * skyFill)
              + spec * uSunColor;

  // ---- Snow sparkle ----
  float sparkSeed = hash(floor(vWorldPos.xz * 65.0));
  float sparkAnim = sin(uTime * 4.2 + sparkSeed * 6.283) * 0.5 + 0.5;
  float sparkle   = step(0.992, sparkSeed) * sparkAnim * snowAmt * (1.0 - vSlope);
  litCol += sparkle * 0.75 * snowBase;

  gl_FragColor = vec4(litCol, 1.0);
}
`

// -------------------------------------------------------------------------

export default function Terrain() {
  const timeOfDay = useSceneStore((s) => s.timeOfDay)
  const cfg = TIME_CONFIGS[resolveTime(timeOfDay)]

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(
      TERRAIN_SIZE, TERRAIN_SIZE,
      TERRAIN_SIZE, TERRAIN_SIZE
    )
    geo.rotateX(-Math.PI / 2)

    const hmap = generateHeightmap(1)
    const pos  = geo.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < HMAP_SIZE * HMAP_SIZE; i++) {
      pos.setY(i, hmap[i])
    }
    pos.needsUpdate = true
    geo.computeVertexNormals()
    return geo
  }, [])

  const sunDir = useMemo(() => {
    return new THREE.Vector3(...cfg.sunPosition).normalize()
  }, [cfg])

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uTime:         { value: 0 },
      uSunDir:       { value: new THREE.Vector3(0.6, 0.8, -0.4) },
      uSunColor:     { value: new THREE.Color('#FFF5E0') },
      uSunIntensity: { value: 2.0 },
      uSkyColor:     { value: new THREE.Color('#4A90D9') },
      uSkyIntensity: { value: 0.5 },
    },
  }), [])

  // Sync uniforms with time-of-day
  useEffect(() => {
    material.uniforms.uSunDir.value.set(...cfg.sunPosition).normalize()
    material.uniforms.uSunColor.value.set(cfg.sunColor)
    material.uniforms.uSunIntensity.value = cfg.sunIntensity * 0.65
    material.uniforms.uSkyColor.value.set(cfg.hemiTop)
    material.uniforms.uSkyIntensity.value = cfg.hemiIntensity
  }, [cfg, material])

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime
  })

  return <mesh geometry={geometry} material={material} />
}
