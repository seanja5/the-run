import { create } from 'zustand'

export type TimeOfDay = 'auto' | 'day' | 'dusk' | 'night' | 'dawn'

export interface TimeConfig {
  bgColor: string
  fogColor: string
  fogDensity: number
  sunColor: string
  sunIntensity: number
  sunPosition: [number, number, number]
  ambientColor: string
  ambientIntensity: number
  hemiTop: string
  hemiGround: string
  hemiIntensity: number
}

export const TIME_CONFIGS: Record<Exclude<TimeOfDay, 'auto'>, TimeConfig> = {
  day: {
    bgColor: '#5B99D4',
    fogColor: '#A0C8E8',
    fogDensity: 0.003,
    sunColor: '#FFF5E0',
    sunIntensity: 2.5,
    sunPosition: [80, 90, -60],
    ambientColor: '#6090B0',
    ambientIntensity: 0.7,
    hemiTop: '#4A90D9',
    hemiGround: '#8B7355',
    hemiIntensity: 0.6,
  },
  dusk: {
    bgColor: '#1A0A20',
    fogColor: '#2D1025',
    fogDensity: 0.005,
    sunColor: '#FF6B35',
    sunIntensity: 1.8,
    sunPosition: [130, 18, -40],
    ambientColor: '#3D1C58',
    ambientIntensity: 0.35,
    hemiTop: '#4A2060',
    hemiGround: '#1A0A20',
    hemiIntensity: 0.5,
  },
  night: {
    bgColor: '#010306',
    fogColor: '#030610',
    fogDensity: 0.007,
    sunColor: '#7A9ABB',
    sunIntensity: 0.5,
    sunPosition: [-60, 45, 80],
    ambientColor: '#0D0A1E',
    ambientIntensity: 0.25,
    hemiTop: '#181630',
    hemiGround: '#04030C',
    hemiIntensity: 0.3,
  },
  dawn: {
    bgColor: '#1A2045',
    fogColor: '#2A1820',
    fogDensity: 0.004,
    sunColor: '#FFCD6B',
    sunIntensity: 1.3,
    sunPosition: [-90, 25, -70],
    ambientColor: '#1A2A5E',
    ambientIntensity: 0.45,
    hemiTop: '#3A4080',
    hemiGround: '#201810',
    hemiIntensity: 0.5,
  },
}

function getAutoTime(): Exclude<TimeOfDay, 'auto'> {
  const h = new Date().getHours()
  if (h >= 5 && h < 9) return 'dawn'
  if (h >= 9 && h < 17) return 'day'
  if (h >= 17 && h < 21) return 'dusk'
  return 'night'
}

export function resolveTime(t: TimeOfDay): Exclude<TimeOfDay, 'auto'> {
  return t === 'auto' ? getAutoTime() : t
}

interface SceneState {
  activeProjectId: string | null
  timeOfDay: TimeOfDay
  setActiveProject: (id: string | null) => void
  setTimeOfDay: (t: TimeOfDay) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  activeProjectId: null,
  timeOfDay: 'auto',
  setActiveProject: (id) => set({ activeProjectId: id }),
  setTimeOfDay: (t) => set({ timeOfDay: t }),
}))
