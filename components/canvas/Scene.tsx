'use client'

import Terrain from './Terrain'
import Trees from './Trees'
import Lighting from './Lighting'
import ProjectMarkers from './ProjectMarkers'
import CameraController from './CameraController'

export default function Scene() {
  return (
    <>
      <Lighting />
      <Terrain />
      <Trees />
      <ProjectMarkers />
      <CameraController />
    </>
  )
}
