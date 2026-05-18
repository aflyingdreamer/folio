import { describe, it, expect } from 'vitest'
import { countWords, forwardWordCount } from './count'

describe('countWords', () => {
  it('counts whitespace-separated tokens', () => {
    expect(countWords('hello world')).toBe(2)
    expect(countWords('  one   two  three ')).toBe(3)
    expect(countWords('')).toBe(0)
  })
  it('ignores punctuation-only tokens', () => {
    expect(countWords('hello, world!')).toBe(2)
    expect(countWords('— — —')).toBe(0)
  })
})

describe('forwardWordCount', () => {
  it('returns countWords when current text grows', () => {
    expect(forwardWordCount({ previousCount: 2, currentText: 'one two three' })).toBe(3)
  })
  it('never decreases', () => {
    expect(forwardWordCount({ previousCount: 3, currentText: 'one two' })).toBe(3)
    expect(forwardWordCount({ previousCount: 3, currentText: '' })).toBe(3)
  })
  it('increases monotonically across edits', () => {
    let count = 0
    for (const next of ['a', 'a b', 'a', 'a b c', 'a b']) {
      count = forwardWordCount({ previousCount: count, currentText: next })
    }
    expect(count).toBe(3)
  })
})
