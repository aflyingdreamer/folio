import type { TrackSlug } from './tracks'
import { TRACKS, DEFAULT_TRACK } from './tracks'

export type LoopMode = 'loop_one' | 'shuffle'

export type SoundPrefs = {
  enabled: boolean | null
  track: TrackSlug
  volume: number
  loopMode: LoopMode
}

export const DEFAULT_PREFS: SoundPrefs = {
  enabled: null,
  track: DEFAULT_TRACK,
  volume: 60,
  loopMode: 'loop_one',
}

const KEYS = {
  enabled:  'folio.sound.enabled',
  track:    'folio.sound.track',
  volume:   'folio.sound.volume',
  loopMode: 'folio.sound.loopMode',
} as const

function isTrack(v: string | null): v is TrackSlug {
  return !!v && TRACKS.some(t => t.slug === v)
}
function isLoopMode(v: string | null): v is LoopMode {
  return v === 'loop_one' || v === 'shuffle'
}

export function readLocalPrefs(): SoundPrefs {
  if (typeof localStorage === 'undefined') return DEFAULT_PREFS

  const enabledRaw = localStorage.getItem(KEYS.enabled)
  const enabled: boolean | null =
    enabledRaw === 'true' ? true : enabledRaw === 'false' ? false : null

  const trackRaw = localStorage.getItem(KEYS.track)
  const track = isTrack(trackRaw) ? trackRaw : DEFAULT_PREFS.track

  const volRaw = localStorage.getItem(KEYS.volume)
  const volNum = volRaw === null ? NaN : Number(volRaw)
  const volume =
    Number.isFinite(volNum) && volNum >= 0 && volNum <= 100
      ? Math.round(volNum)
      : DEFAULT_PREFS.volume

  const loopRaw = localStorage.getItem(KEYS.loopMode)
  const loopMode = isLoopMode(loopRaw) ? loopRaw : DEFAULT_PREFS.loopMode

  return { enabled, track, volume, loopMode }
}

export function writeLocalPrefs(p: SoundPrefs): void {
  if (typeof localStorage === 'undefined') return
  if (p.enabled === null) {
    localStorage.removeItem(KEYS.enabled)
  } else {
    localStorage.setItem(KEYS.enabled, String(p.enabled))
  }
  localStorage.setItem(KEYS.track,    p.track)
  localStorage.setItem(KEYS.volume,   String(p.volume))
  localStorage.setItem(KEYS.loopMode, p.loopMode)
}

type SupabaseFromChain = {
  update: (row: Record<string, unknown>) => { eq: (col: string, val: string) => Promise<unknown> }
  select: (cols: string) => {
    eq: (col: string, val: string) => {
      maybeSingle: () => Promise<{ data: Record<string, unknown> | null; error: unknown }>
    }
  }
}

export async function persistRemote(
  supabase: { from: (t: string) => SupabaseFromChain },
  userId: string,
  p: SoundPrefs,
): Promise<void> {
  await supabase.from('user_meta').update({
    sound_enabled:   p.enabled,
    sound_track:     p.track,
    sound_volume:    p.volume,
    sound_loop_mode: p.loopMode,
  }).eq('user_id', userId)
}

export async function fetchRemote(
  supabase: { from: (t: string) => SupabaseFromChain },
  userId: string,
): Promise<SoundPrefs | null> {
  const { data, error } = await supabase
    .from('user_meta')
    .select('sound_enabled, sound_track, sound_volume, sound_loop_mode')
    .eq('user_id', userId)
    .maybeSingle()
  if (error || !data) return null
  const trackRaw = typeof data.sound_track === 'string' ? data.sound_track : null
  const loopRaw  = typeof data.sound_loop_mode === 'string' ? data.sound_loop_mode : null
  return {
    enabled:  typeof data.sound_enabled === 'boolean' ? data.sound_enabled : null,
    track:    isTrack(trackRaw) ? trackRaw : DEFAULT_PREFS.track,
    volume:   typeof data.sound_volume === 'number' ? data.sound_volume : DEFAULT_PREFS.volume,
    loopMode: isLoopMode(loopRaw) ? loopRaw : DEFAULT_PREFS.loopMode,
  }
}
