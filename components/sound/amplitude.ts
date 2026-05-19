export function rms(buf: Uint8Array): number {
  if (buf.length === 0) return 0
  let sumSquares = 0
  for (let i = 0; i < buf.length; i++) {
    const v = (buf[i] - 128) / 128
    sumSquares += v * v
  }
  return Math.sqrt(sumSquares / buf.length)
}

export function smooth(next: number, prev: number | null, alpha: number): number {
  if (prev === null) return next
  return prev + alpha * (next - prev)
}
