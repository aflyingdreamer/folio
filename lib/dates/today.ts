export function todayIsoIn(timezone: string, now: Date = new Date()): string {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit',
  })
  return fmt.format(now)
}

export function formatDateBanner(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })
  const month = date.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' })
  return `${weekday.toLowerCase()}, ${d} ${month.toLowerCase()} ${y}`
}
