export type TrackSlug =
  | 'soft_rain'
  | 'room_tone'
  | 'distant_cafe'
  | 'fireplace'
  | 'forest_dawn'

export type Track = {
  slug: TrackSlug
  label: string
  src: string
  credit: { artist: string; source: string; licence: string }
}

export const TRACKS: readonly Track[] = [
  { slug: 'soft_rain',    label: 'soft rain',      src: '/sounds/soft-rain.mp3',    credit: { artist: 'Ylmir', source: 'https://opengameart.org/content/rain-loopable', licence: 'CC0' } },
  { slug: 'room_tone',    label: 'room tone',      src: '/sounds/room-tone.mp3',    credit: { artist: 'TBD', source: 'TBD', licence: 'CC0' } },
  { slug: 'distant_cafe', label: 'distant café',   src: '/sounds/distant-cafe.mp3', credit: { artist: 'TBD', source: 'TBD', licence: 'CC0' } },
  { slug: 'fireplace',    label: 'fireplace',      src: '/sounds/fireplace.mp3',    credit: { artist: 'TBD', source: 'TBD', licence: 'CC0' } },
  { slug: 'forest_dawn',  label: 'forest at dawn', src: '/sounds/forest-dawn.mp3',  credit: { artist: 'TBD', source: 'TBD', licence: 'CC0' } },
] as const

export const DEFAULT_TRACK: TrackSlug = 'soft_rain'

export function getTrack(slug: TrackSlug): Track {
  const t = TRACKS.find(t => t.slug === slug)
  if (!t) throw new Error(`unknown track: ${slug}`)
  return t
}
