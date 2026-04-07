'use client'

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

export default function PostFX() {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.65}
        luminanceSmoothing={0.9}
        intensity={0.7}
        blendFunction={BlendFunction.ADD}
      />
      <Vignette
        offset={0.35}
        darkness={0.65}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  )
}
