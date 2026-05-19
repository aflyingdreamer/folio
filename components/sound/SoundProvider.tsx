'use client'
import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { SoundContext, type SoundContextValue } from './useSound'
import { DEFAULT_PREFS, readLocalPrefs, writeLocalPrefs, fetchRemote, persistRemote, type SoundPrefs } from './persistence'
import { getTrack, TRACKS, type TrackSlug } from './tracks'
import { rms, smooth } from './amplitude'
import { createClient } from '@/lib/supabase/client'
import {
  createGraph,
  crossfadeTo,
  setMasterGain,
  pauseAll,
  resumeActive,
  type AudioGraph,
} from './audio-graph'

const CROSSFADE_SEC = 1.5
const SMOOTH_ALPHA  = 0.15

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<SoundPrefs>(DEFAULT_PREFS)
  const [amplitude, setAmplitude] = useState(0)
  const [controlsOpen, setControlsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const graphRef = useRef<AudioGraph | null>(null)
  const audioARef = useRef<HTMLAudioElement | null>(null)
  const audioBRef = useRef<HTMLAudioElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const ampPrevRef = useRef<number | null>(null)

  // Hydrate prefs from localStorage on mount.
  useEffect(() => {
    setPrefs(readLocalPrefs())
  }, [])

  // Hydrate from server for signed-in users; server wins.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const remote = await fetchRemote(
          supabase as unknown as Parameters<typeof fetchRemote>[0],
          user.id,
        )
        if (cancelled || !remote) return
        setPrefs(remote)
      } catch { /* ignore */ }
    })()
    return () => { cancelled = true }
  }, [])

  // Persist prefs on every change — localStorage always, supabase if signed-in.
  useEffect(() => {
    writeLocalPrefs(prefs)
    ;(async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        await persistRemote(
          supabase as unknown as Parameters<typeof persistRemote>[0],
          user.id,
          prefs,
        )
      } catch { /* swallow; localStorage holds the truth */ }
    })()
  }, [prefs])

  // Lazily initialise the audio graph after the first user gesture.
  const ensureGraph = useCallback((): AudioGraph | null => {
    if (graphRef.current) return graphRef.current
    if (typeof window === 'undefined') return null
    const audioA = audioARef.current
    const audioB = audioBRef.current
    if (!audioA || !audioB) return null
    const w = window as unknown as { AudioContext?: unknown; webkitAudioContext?: unknown }
    if (typeof w.AudioContext === 'undefined' && typeof w.webkitAudioContext === 'undefined') return null
    try {
      const g = createGraph({ audioA, audioB })
      audioA.src = getTrack(prefs.track).src
      audioA.loop = true
      setMasterGain(g, prefs.volume / 100)
      graphRef.current = g
      return g
    } catch {
      return null
    }
  }, [prefs.track, prefs.volume])

  // Amplitude rAF loop.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const buf = new Uint8Array(1024)
    function tick() {
      const g = graphRef.current
      if (g && document.visibilityState === 'visible' && isPlaying) {
        g.analyser.getByteTimeDomainData(buf)
        const next = rms(buf)
        const smoothed = smooth(next, ampPrevRef.current, SMOOTH_ALPHA)
        ampPrevRef.current = smoothed
        setAmplitude(smoothed)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isPlaying])

  // Apply volume changes to the live graph.
  useEffect(() => {
    const g = graphRef.current
    if (g) setMasterGain(g, prefs.volume / 100)
  }, [prefs.volume])

  // Track changes: crossfade.
  useEffect(() => {
    const g = graphRef.current
    if (!g) return
    const target: 'A' | 'B' = g.activeChannel === 'A' ? 'B' : 'A'
    crossfadeTo(g, target, getTrack(prefs.track).src, CROSSFADE_SEC)
  }, [prefs.track])

  // Enabled changes drive play/pause.
  useEffect(() => {
    if (prefs.enabled === true) {
      const g = ensureGraph()
      if (!g) return
      g.ctx.resume().then(() => {
        resumeActive(g)
        setIsPlaying(true)
      }).catch(() => {})
    } else if (prefs.enabled === false) {
      const g = graphRef.current
      if (g) pauseAll(g)
      setIsPlaying(false)
    }
  }, [prefs.enabled, ensureGraph])

  // Shuffle behaviour: when active <audio> ends, pick a random other track.
  useEffect(() => {
    if (prefs.loopMode !== 'shuffle') {
      if (audioARef.current) audioARef.current.loop = true
      if (audioBRef.current) audioBRef.current.loop = true
      return
    }
    if (audioARef.current) audioARef.current.loop = false
    if (audioBRef.current) audioBRef.current.loop = false
    const onEnded = () => {
      const others = TRACKS.filter(t => t.slug !== prefs.track)
      const next = others[Math.floor(Math.random() * others.length)].slug
      setPrefs(p => ({ ...p, track: next }))
    }
    const a = audioARef.current
    const b = audioBRef.current
    a?.addEventListener('ended', onEnded)
    b?.addEventListener('ended', onEnded)
    return () => {
      a?.removeEventListener('ended', onEnded)
      b?.removeEventListener('ended', onEnded)
    }
  }, [prefs.loopMode, prefs.track])

  const setEnabled     = useCallback((v: boolean)   => setPrefs(p => ({ ...p, enabled: v })), [])
  const setTrack       = useCallback((s: TrackSlug) => setPrefs(p => ({ ...p, track: s })), [])
  const setVolume      = useCallback((v: number)    => setPrefs(p => ({ ...p, volume: Math.max(0, Math.min(100, Math.round(v))) })), [])
  const toggleLoopMode = useCallback(()             => setPrefs(p => ({ ...p, loopMode: p.loopMode === 'loop_one' ? 'shuffle' : 'loop_one' })), [])
  const toggleControls = useCallback(()             => setControlsOpen(o => !o), [])
  const togglePlay     = useCallback(() => {
    setPrefs(p => ({ ...p, enabled: p.enabled === true ? false : true }))
  }, [])

  const value: SoundContextValue = useMemo(() => ({
    prefs, amplitude, controlsOpen, isPlaying,
    toggleControls, setEnabled, setTrack, setVolume, toggleLoopMode, togglePlay,
  }), [prefs, amplitude, controlsOpen, isPlaying, toggleControls, setEnabled, setTrack, setVolume, toggleLoopMode, togglePlay])

  return (
    <SoundContext.Provider value={value}>
      <audio ref={audioARef} preload="auto" aria-hidden />
      <audio ref={audioBRef} preload="auto" aria-hidden />
      {children}
    </SoundContext.Provider>
  )
}
