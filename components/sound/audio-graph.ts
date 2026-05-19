export type Channel = 'A' | 'B'

export type AudioGraph = {
  ctx: AudioContext
  audioA: HTMLAudioElement
  audioB: HTMLAudioElement
  srcA: MediaElementAudioSourceNode
  srcB: MediaElementAudioSourceNode
  gainA: GainNode
  gainB: GainNode
  master: GainNode
  analyser: AnalyserNode
  activeChannel: Channel
}

export function createGraph(opts: {
  audioA: HTMLAudioElement
  audioB: HTMLAudioElement
}): AudioGraph {
  const g = globalThis as unknown as {
    AudioContext?: typeof AudioContext
    webkitAudioContext?: typeof AudioContext
  }
  const Ctx = g.AudioContext ?? g.webkitAudioContext
  if (!Ctx) throw new Error('Web Audio API unavailable')
  const ctx = new Ctx()

  const { audioA, audioB } = opts
  audioA.crossOrigin = 'anonymous'
  audioB.crossOrigin = 'anonymous'

  const srcA = ctx.createMediaElementSource(audioA)
  const srcB = ctx.createMediaElementSource(audioB)

  const gainA = ctx.createGain()
  const gainB = ctx.createGain()
  gainA.gain.value = 1
  gainB.gain.value = 0

  const master = ctx.createGain()
  master.gain.value = 0.6

  const analyser = ctx.createAnalyser()
  analyser.fftSize = 1024
  analyser.smoothingTimeConstant = 0.6

  srcA.connect(gainA)
  srcB.connect(gainB)
  gainA.connect(master)
  gainB.connect(master)
  master.connect(analyser)
  analyser.connect(ctx.destination)

  return { ctx, audioA, audioB, srcA, srcB, gainA, gainB, master, analyser, activeChannel: 'A' }
}

export function crossfadeTo(
  g: AudioGraph,
  target: Channel,
  src: string,
  durationSec: number,
): void {
  const active = g.activeChannel
  const targetAudio = target === 'A' ? g.audioA : g.audioB
  const targetGain  = target === 'A' ? g.gainA  : g.gainB
  const otherGain   = target === 'A' ? g.gainB  : g.gainA

  if (active === target && targetAudio.src.endsWith(src)) return

  const t = g.ctx.currentTime
  targetAudio.src = src
  targetAudio.loop = true
  targetAudio.play().catch(() => {})

  otherGain.gain.cancelScheduledValues(t)
  targetGain.gain.cancelScheduledValues(t)
  otherGain.gain.setValueAtTime(otherGain.gain.value, t)
  targetGain.gain.setValueAtTime(targetGain.gain.value, t)
  otherGain.gain.linearRampToValueAtTime(0, t + durationSec)
  targetGain.gain.linearRampToValueAtTime(1, t + durationSec)

  g.activeChannel = target
}

export function setMasterGain(g: AudioGraph, value: number): void {
  g.master.gain.value = Math.max(0, Math.min(1, value))
}

export function pauseAll(g: AudioGraph): void {
  g.audioA.pause()
  g.audioB.pause()
}

export function resumeActive(g: AudioGraph): void {
  const a = g.activeChannel === 'A' ? g.audioA : g.audioB
  a.play().catch(() => {})
}
