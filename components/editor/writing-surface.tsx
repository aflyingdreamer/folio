'use client'
import { useEffect, useRef, useState } from 'react'
import { forwardWordCount } from '@/lib/words/count'
import { upsertEntry } from '@/lib/entries/actions'
import { CompletionRule } from './completion-rule'

type Props = { entryDate: string; initialContent: string; initialWordCount: number }

const GOAL = 750
const DEBOUNCE_MS = 1500
const FOCUS_FADE_AFTER_FIRST_KEYSTROKE = true

export function WritingSurface({ entryDate, initialContent, initialWordCount }: Props) {
  const [text, setText] = useState(initialContent)
  const [count, setCount] = useState(initialWordCount)
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

  // Typewriter scroll: keep the line containing the caret vertically centered.
  useEffect(() => {
    const ta = taRef.current
    if (!ta) return
    const lineIndex = text.slice(0, caret).split('\n').length - 1
    const lineHeightPx = parseFloat(getComputedStyle(ta).lineHeight || '28')
    const desiredOffset = window.innerHeight / 2
    const caretY = lineIndex * lineHeightPx + ta.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: caretY - desiredOffset, behavior: 'smooth' })
  }, [caret, text])

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const next = e.target.value
    const nextCount = forwardWordCount({ previousCount: countRef.current, currentText: next })
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
    <div className="mx-auto max-w-[72ch] px-6 py-32 relative">
      {focusOn && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 px-6 py-32 font-serif text-lg leading-loose whitespace-pre-wrap"
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
        className={`folio-caret w-full min-h-[60vh] resize-none bg-transparent focus:outline-none font-serif text-lg leading-loose relative ${focusOn ? 'text-transparent' : ''}`}
        spellCheck={false}
      />
      <CompletionRule show={completed} />
      <div className="fixed bottom-6 right-6 font-mono text-sm tabular-nums flex items-center gap-4">
        {saving && <span className="text-stone-300">saving…</span>}
        <span className={completed ? 'text-stone-900' : 'text-stone-400'}>
          {count} / {GOAL}
        </span>
      </div>
    </div>
  )
}
