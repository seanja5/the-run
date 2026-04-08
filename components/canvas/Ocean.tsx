'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneStore, TIME_PRESETS, WEATHER_PRESETS } from '@/store/useSceneStore'

const vertexShader = `
uniform float uTime;
uniform float uWaveScale;

varying vec3 vWorldPos;
varying vec3 vNormal;
varying float vWaveHeight;

#define PI 3.14159265358979323846
#define G 9.8

vec3 gerstnerWave(vec2 dir, float amplitude, float wavelength, float speed, vec2 xz, inout vec3 tangent, inout vec3 binormal) {
  float k = 2.0 * PI / wavelength;
  float w = sqrt(G * k) * speed;
  float Q = clamp(0.55 / (k * amplitude * 4.0), 0.0, 1.0);
  float phi = dot(normalize(dir), xz) * k + uTime * w;

  float sinPhi = sin(phi);
  float cosPhi = cos(phi);

  vec3 pos;
  pos.x = Q * amplitude * normalize(dir).x * cosPhi;
  pos.y = amplitude * sinPhi;
  pos.z = Q * amplitude * normalize(dir).y * cosPhi;

  tangent += vec3(
    -Q * amplitude * normalize(dir).x * normalize(dir).x * k * sinPhi,
    normalize(dir).x * amplitude * k * cosPhi,
    -Q * amplitude * normalize(dir).x * normalize(dir).y * k * sinPhi
  );

  binormal += vec3(
    -Q * amplitude * normalize(dir).x * normalize(dir).y * k * sinPhi,
    normalize(dir).y * amplitude * k * cosPhi,
    -Q * amplitude * normalize(dir).y * normalize(dir).y * k * sinPhi
  );

  return pos;
}

void main() {
  vec2 xz = position.xz;

  vec3 tangent = vec3(1.0, 0.0, 0.0);
  vec3 binormal = vec3(0.0, 0.0, 1.0);
  vec3 displacement = vec3(0.0);

  float s = uWaveScale;
  displacement += gerstnerWave(vec2(1.0, 0.0),   0.80 * s, 28.0,       1.0, xz, tangent, binormal);
  displacement += gerstnerWave(vec2(0.7, 0.3),   0.45 * s, 16.0,       1.3, xz, tangent, binormal);
  displacement += gerstnerWave(vec2(0.3, 0.8),   0.25 * s,  9.0,       1.6, xz, tangent, binormal);
  displacement += gerstnerWave(vec2(-0.2, 0.9),  0.14 * s,  4.0,       2.0, xz, tangent, binormal);

  vec3 worldPos = position + displacement;
  vWorldPos = worldPos;
  vWaveHeight = displacement.y;
  vNormal = normalize(cross(binormal, tangent));

  gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPos, 1.0);
}
`

const fragmentShader = `
uniform float uTime;
uniform vec3  uSunDir;
uniform vec3  uCameraPos;
uniform vec3  uDeepColor;
uniform vec3  uSkyColor;
uniform vec3  uFogColor;
uniform float uFogDensity;

varying vec3  vWorldPos;
varying vec3  vNormal;
varying float vWaveHeight;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
}

float fbm(vec2 p) {
  float v=0.0, a=0.5;
  for(int i=0;i<5;i++){v+=a*noise(p); a*=0.5; p*=2.1;}
  return v;
}

void main() {
  vec3 norm = normalize(vNormal);

  vec2 rippleUV = vWorldPos.xz * 0.15 + uTime * 0.03;
  float ripple = fbm(rippleUV) * 2.0 - 1.0;
  norm = normalize(norm + vec3(ripple * 0.08, 0.0, ripple * 0.08));

  vec3 viewDir = normalize(uCameraPos - vWorldPos);

  float fresnel = pow(1.0 - max(dot(viewDir, norm), 0.0), 3.0);

  float heightT = clamp((vWaveHeight + 0.8) / 1.6, 0.0, 1.0);
  vec3 shallowColor = mix(uDeepColor, uDeepColor * 1.8, 0.5);
  vec3 waterColor = mix(uDeepColor, shallowColor, heightT);

  float crestT = smoothstep(0.55, 1.0, heightT);
  waterColor = mix(waterColor, uSkyColor * 0.7, crestT * 0.35);

  vec3 finalColor = mix(waterColor, uSkyColor, fresnel * 0.6);

  vec3 sunDir = normalize(uSunDir);
  vec3 halfVec = normalize(sunDir + viewDir);
  float spec = pow(max(dot(norm, halfVec), 0.0), 200.0) * 2.5;
  finalColor += vec3(1.0, 0.97, 0.92) * spec * fresnel;

  float dist = length(vWorldPos - uCameraPos);
  float fog = 1.0 - exp(-dist * uFogDensity);
  finalColor = mix(finalColor, uFogColor, fog * 0.9);

  gl_FragColor = vec4(finalColor, 1.0);
}
`

export default function Ocean() {
  const meshRef = useRef<THREE.Mesh>(null)
  const timeOfDay = useSceneStore((s) => s.timeOfDay)
  const weather = useSceneStore((s) => s.weather)

  const uniforms = useMemo(() => ({
    uTime:       { value: 0 },
    uSunDir:     { value: new THREE.Vector3(0.3, 0.25, -1).normalize() },
    uCameraPos:  { value: new THREE.Vector3() },
    uDeepColor:  { value: new THREE.Vector3(0.043, 0.165, 0.259) },
    uSkyColor:   { value: new THREE.Vector3(0.53, 0.769, 0.863) },
    uFogColor:   { value: new THREE.Vector3(0.608, 0.722, 0.800) },
    uFogDensity: { value: 0.0008 },
    uWaveScale:  { value: 1.0 },
  }), [])

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(600, 600, 256, 256)
    geo.rotateX(-Math.PI / 2)
    return geo
  }, [])

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    side: THREE.FrontSide,
  }), [uniforms])

  const _tmpVec = useRef(new THREE.Vector3())

  useFrame(({ clock, camera }) => {
    uniforms.uTime.value = clock.getElapsedTime()
    uniforms.uCameraPos.value.copy(camera.position)

    const tp = TIME_PRESETS[timeOfDay]
    const wp = WEATHER_PRESETS[weather]
    const L = 0.02

    const [d0, d1, d2] = tp.oceanDeep
    const [s0, s1, s2] = tp.oceanSky
    const [f0, f1, f2] = tp.fogColor

    uniforms.uDeepColor.value.lerp(_tmpVec.current.set(d0, d1, d2), L)
    uniforms.uSkyColor.value.lerp(_tmpVec.current.set(s0, s1, s2), L)
    uniforms.uFogColor.value.lerp(_tmpVec.current.set(f0, f1, f2), L)
    uniforms.uFogDensity.value += (tp.fogDensity - uniforms.uFogDensity.value) * L

    const [p0, p1, p2] = tp.sunPosition
    uniforms.uSunDir.value.lerp(_tmpVec.current.set(p0, p1, p2).normalize(), L)

    uniforms.uWaveScale.value += (wp.waveScale - uniforms.uWaveScale.value) * 0.015
  })

  return <mesh ref={meshRef} geometry={geometry} material={material} frustumCulled={false} />
}
