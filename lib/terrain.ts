import { createNoise2D } from 'simplex-noise'

export const TERRAIN_SIZE = 256
export const HMAP_SIZE = TERRAIN_SIZE + 1 // 257 × 257 vertices

let cachedHeightmap: Float32Array | null = null
let cachedSeed = -1

export function generateHeightmap(seed = 1): Float32Array {
  if (cachedHeightmap && cachedSeed === seed) return cachedHeightmap

  const noise2D = createNoise2D(() => seed / 1000)
  const size = HMAP_SIZE
  const hmap = new Float32Array(size * size)

  for (let iz = 0; iz < size; iz++) {
    for (let ix = 0; ix < size; ix++) {
      const u = ix / (size - 1) // 0→1 left→right (X)
      const v = iz / (size - 1) // 0→1 top→bottom (Z, peak→valley)

      // Primary slope — 18 unit vertical drop
      const baseSlope = v * 18.0

      // Octave 1: large terrain features
      const h1 = noise2D(u * 2 + seed * 0.01, v * 2) * 4.0
      // Octave 2: ridges and gullies
      const h2 = noise2D(u * 5 + seed * 0.01, v * 5) * 1.5
      // Octave 3: mogul-scale texture
      const h3 = noise2D(u * 12, v * 12) * 0.4

      // Suppress noise in groomed corridor (|u - 0.5| < 0.18 → smooth run)
      const distFromCenter = Math.abs(u - 0.5)
      const corridorBlend = smoothstep(0.18, 0.32, distFromCenter)

      hmap[iz * size + ix] = baseSlope + (h1 + h2 + h3) * corridorBlend
    }
  }

  cachedHeightmap = hmap
  cachedSeed = seed
  return hmap
}

/** Bilinear interpolation to get Y at any world (x, z) coordinate */
export function getHeightAt(
  worldX: number,
  worldZ: number,
  hmap: Float32Array
): number {
  const size = HMAP_SIZE
  // World space: -128→+128 in X, -128→+128 in Z (terrain is 256×256 centered at origin)
  const u = (worldX + TERRAIN_SIZE / 2) / TERRAIN_SIZE // 0→1
  const v = (worldZ + TERRAIN_SIZE / 2) / TERRAIN_SIZE // 0→1

  const clampedU = Math.max(0, Math.min(1 - 1e-6, u))
  const clampedV = Math.max(0, Math.min(1 - 1e-6, v))

  const fx = clampedU * (size - 1)
  const fz = clampedV * (size - 1)
  const ix = Math.floor(fx)
  const iz = Math.floor(fz)
  const tx = fx - ix
  const tz = fz - iz

  const h00 = hmap[iz * size + ix]
  const h10 = hmap[iz * size + (ix + 1)]
  const h01 = hmap[(iz + 1) * size + ix]
  const h11 = hmap[(iz + 1) * size + (ix + 1)]

  return (
    h00 * (1 - tx) * (1 - tz) +
    h10 * tx * (1 - tz) +
    h01 * (1 - tx) * tz +
    h11 * tx * tz
  )
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}
