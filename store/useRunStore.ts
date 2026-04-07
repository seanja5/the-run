import { create } from 'zustand'
import type { CameraMode } from '@/types'

interface RunStore {
  // Camera
  cameraMode: CameraMode
  progress: number        // 0→1 along the slope
  lateralVelocity: number // for carve SFX and particle react
  // Nodes
  activeNode: string | null
  panelOpen: boolean
  triggeredNodes: Set<string>
  // UI
  muted: boolean
  started: boolean
  ended: boolean
  // Actions
  setMode: (mode: CameraMode) => void
  setProgress: (p: number) => void
  setLateralVelocity: (v: number) => void
  setActiveNode: (id: string | null) => void
  setPanelOpen: (open: boolean) => void
  addTriggeredNode: (id: string) => void
  toggleMute: () => void
  setEnded: (v: boolean) => void
}

export const useRunStore = create<RunStore>((set) => ({
  cameraMode: 'autopilot',
  progress: 0,
  lateralVelocity: 0,
  activeNode: null,
  panelOpen: false,
  triggeredNodes: new Set(),
  muted: false,
  started: false,
  ended: false,

  setMode: (mode) => set({ cameraMode: mode }),
  setProgress: (p) => set({ progress: p }),
  setLateralVelocity: (v) => set({ lateralVelocity: v }),
  setActiveNode: (id) => set({ activeNode: id }),
  setPanelOpen: (open) => set({ panelOpen: open }),
  addTriggeredNode: (id) =>
    set((s) => ({ triggeredNodes: new Set([...s.triggeredNodes, id]) })),
  toggleMute: () => set((s) => ({ muted: !s.muted })),
  setEnded: (v) => set({ ended: v }),
}))
