export function countWords(text: string): number {
  const tokens = text.trim().split(/\s+/).filter(Boolean)
  return tokens.filter((t) => /[\p{L}\p{N}]/u.test(t)).length
}

export function forwardWordCount(args: { previousCount: number; currentText: string }): number {
  return Math.max(args.previousCount, countWords(args.currentText))
}
