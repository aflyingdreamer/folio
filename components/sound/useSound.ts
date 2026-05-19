'use client'
import { createContext, useContext } from 'react'
import type { SoundPrefs, LoopMode } from './persistence'
import type { TrackSlug } from './tracks'

export type SoundContextValue = {
  prefs: SoundPrefs
  amplitude: number
  controlsOpen: boolean
  toggleControls: () => void
  setEnabled: (v: boolean) => void
  setTrack: (s: TrackSlug) => void
  setVolume: (v: number) => void
  toggleLoopMode: () => void
  togglePlay: () => void
  isPlaying: boolean
}

export const SoundContext = createContext<SoundContextValue | null>(null)

export function useSound(): SoundContextValue {
  const v = useContext(SoundContext)
  if (!v) throw new Error('useSound must be used inside <SoundProvider>')
  return v
}

export type { LoopMode }
