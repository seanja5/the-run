import * as THREE from 'three'

export interface NodeContent {
  description: string
  tech: string[]
  link?: string
  linkLabel?: string
  isContact?: boolean
}

export interface NodeData {
  id: string
  type: 'gate' | 'lodge'
  label: string
  sublabel: string
  worldPos: THREE.Vector3
  color: string
  content: NodeContent
}
