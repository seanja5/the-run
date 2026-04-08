'use client'

import Ocean from './Ocean'
import OceanSky from './OceanSky'
import OceanLighting from './OceanLighting'
import OceanCameraRig from './OceanCameraRig'
import Moon from './Moon'
import Birds from './Birds'
import Rain from './Rain'

export default function OceanScene() {
  return (
    <>
      <OceanSky />
      <OceanLighting />
      <Moon />
      <Ocean />
      <Birds />
      <Rain />
      <OceanCameraRig />
    </>
  )
}
