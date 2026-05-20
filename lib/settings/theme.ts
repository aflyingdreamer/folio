export type ThemeChoice = 'light' | 'dark' | 'system'
export const THEME_COOKIE = 'folio-theme'

export function isThemeChoice(v: unknown): v is ThemeChoice {
  return v === 'light' || v === 'dark' || v === 'system'
}
