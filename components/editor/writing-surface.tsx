'use client'
import { useEffect, useRef, useState } from 'react'
import { countWords } from '@/lib/words/count'
import { upsertEntry } from '@/lib/entries/actions'
import { CompletionRule } from './completion-rule'
import { DateBanner } from './date-banner'

type Props = { entryDate: string; dateLabel: string; initialContent: string; initialWordCount: number }

const GOAL = 750
const DEBOUNCE_MS = 1500
const FOCUS_FADE_AFTER_FIRST_KEYSTROKE = false

export function WritingSurface({ entryDate, dateLabel, initialContent, initialWordCount }: Props) {
  const [text, setText] = useState(initialContent)
  const [count, setCount] = useState(() => countWords(initialContent))
  const [caret, setCaret] = useState(0)
  const [saving, setSaving] = useState(false)
  const [focusOn, setFocusOn] = useState(false)
  const countRef = useRef(initialWordCount)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const taRef = useRef<HTMLTextAreaElement | null>(null)
  const completed = count >= GOAL

  // Keyboard shortcut: ⌘⇧F toggles focus mode.
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault()
        setFocusOn((v) => !v)
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  // Auto-grow the textarea so the page (not the textarea) handles scroll.
  useEffect(() => {
    const ta = taRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${ta.scrollHeight}px`
  }, [text])

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const next = e.target.value
    const nextCount = countWords(next)
    countRef.current = nextCount
    setText(next)
    setCount(nextCount)
    setCaret(e.target.selectionStart)

    if (FOCUS_FADE_AFTER_FIRST_KEYSTROKE && !focusOn) setFocusOn(true)

    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSaving(true)
    saveTimer.current = setTimeout(async () => {
      try {
        await upsertEntry({ entryDate, content: next, wordCount: nextCount })
      } finally {
        setSaving(false)
      }
    }, DEBOUNCE_MS)
  }

  // Compute paragraph dimming.
  const paragraphs = text.split(/\n\n/)
  let runningOffset = 0
  let activeIdx = 0
  for (let i = 0; i < paragraphs.length; i++) {
    const end = runningOffset + paragraphs[i].length + 2
    if (caret >= runningOffset && caret <= end) {
      activeIdx = i
      break
    }
    runningOffset = end
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pt-28 pb-20 sm:py-24 relative">
      <DateBanner text={dateLabel} count={count} goal={GOAL} saving={saving} />
      {focusOn && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 px-6 pt-28 pb-20 sm:py-32 font-serif text-base sm:text-lg leading-loose whitespace-pre-wrap"
        >
          {paragraphs.map((p, i) => (
            <p key={i} className={i === activeIdx ? 'folio-active-paragraph' : 'folio-dim-paragraph'}>
              {p || '\u00A0'}
            </p>
          ))}
        </div>
      )}
      <textarea
        ref={taRef}
        autoFocus
        value={text}
        onChange={handleChange}
        onSelect={(e) => setCaret(e.currentTarget.selectionStart)}
        placeholder="begin anywhere. three pages, no rules."
        className={`folio-caret w-full resize-none overflow-hidden bg-transparent focus:outline-none font-serif text-base sm:text-lg leading-loose relative ${focusOn ? 'text-transparent' : ''}`}
        spellCheck={false}
      />
      <CompletionRule show={completed} />
    </div>
  )
}
