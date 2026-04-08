import { create } from 'zustand'

export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night'
export type Weather = 'clear' | 'calm' | 'windy' | 'rain' | 'thunder'

export const TIME_PRESETS = {
  dawn: {
    label: 'Dawn',
    skyTurbidity: 8,
    skyRayleigh: 2.0,
    sunPosition: [-0.5, 0.07, -1] as [number, number, number],
    dirColor: '#FFAA66',
    dirIntensity: 0.9,
    ambColor: '#3D2550',
    ambIntensity: 0.4,
    hemiSky: '#FFAA88',
    hemiGround: '#2D1E30',
    hemiIntensity: 0.5,
    bgColor: '#C07890',
    exposure: 0.42,
    fogColor: [0.722, 0.439, 0.502] as [number, number, number],
    fogDensity: 0.0012,
    oceanDeep: [0.10, 0.13, 0.21] as [number, number, number],
    oceanSky:  [0.75, 0.47, 0.56] as [number, number, number],
  },
  day: {
    label: 'Day',
    skyTurbidity: 6,
    skyRayleigh: 1.0,
    sunPosition: [0.3, 0.25, -1] as [number, number, number],
    dirColor: '#FFFAE0',
    dirIntensity: 1.8,
    ambColor: '#6090A0',
    ambIntensity: 0.55,
    hemiSky: '#A0C8D8',
    hemiGround: '#203040',
    hemiIntensity: 0.65,
    bgColor: '#87C4DC',
    exposure: 0.65,
    fogColor: [0.608, 0.722, 0.800] as [number, number, number],
    fogDensity: 0.0008,
    oceanDeep: [0.043, 0.165, 0.259] as [number, number, number],
    oceanSky:  [0.530, 0.769, 0.863] as [number, number, number],
  },
  dusk: {
    label: 'Dusk',
    skyTurbidity: 15,
    skyRayleigh: 2.5,
    sunPosition: [0.6, 0.04, 1] as [number, number, number],
    dirColor: '#FF6030',
    dirIntensity: 0.85,
    ambColor: '#2A1535',
    ambIntensity: 0.35,
    hemiSky: '#FF8040',
    hemiGround: '#251020',
    hemiIntensity: 0.5,
    bgColor: '#C04030',
    exposure: 0.48,
    fogColor: [0.627, 0.220, 0.125] as [number, number, number],
    fogDensity: 0.0015,
    oceanDeep: [0.10, 0.06, 0.15] as [number, number, number],
    oceanSky:  [0.75, 0.25, 0.19] as [number, number, number],
  },
  night: {
    label: 'Night',
    skyTurbidity: 0.3,
    skyRayleigh: 0.05,
    sunPosition: [-1, -0.5, 0] as [number, number, number],
    dirColor: '#3040A0',
    dirIntensity: 0.12,
    ambColor: '#050810',
    ambIntensity: 0.25,
    hemiSky: '#080C20',
    hemiGround: '#010208',
    hemiIntensity: 0.3,
    bgColor: '#010813',
    exposure: 0.18,
    fogColor: [0.008, 0.024, 0.063] as [number, number, number],
    fogDensity: 0.003,
    oceanDeep: [0.01, 0.03, 0.06] as [number, number, number],
    oceanSky:  [0.01, 0.05, 0.12] as [number, number, number],
  },
} as const

export const WEATHER_PRESETS = {
  clear:   { label: 'Clear',   waveScale: 1.0,  hasRain: false, hasThunder: false },
  calm:    { label: 'Calm',    waveScale: 0.15, hasRain: false, hasThunder: false },
  windy:   { label: 'Windy',   waveScale: 2.4,  hasRain: false, hasThunder: false },
  rain:    { label: 'Rain',    waveScale: 1.6,  hasRain: true,  hasThunder: false },
  thunder: { label: 'Thunder', waveScale: 2.0,  hasRain: true,  hasThunder: true  },
} as const

interface SceneStore {
  timeOfDay: TimeOfDay
  weather: Weather
  setTimeOfDay: (t: TimeOfDay) => void
  setWeather: (w: Weather) => void
}

export const useSceneStore = create<SceneStore>((set) => ({
  timeOfDay: 'day',
  weather: 'clear',
  setTimeOfDay: (t) => set({ timeOfDay: t }),
  setWeather: (w) => set({ weather: w }),
}))
