'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
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
  const [saveError, setSaveError] = useState<string | null>(null)
  const [focusOn, setFocusOn] = useState(false)
  const countRef = useRef(initialWordCount)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedRef = useRef(initialContent)
  const pendingRef = useRef<{ content: string; wordCount: number } | null>(null)
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
    const rect = ta.getBoundingClientRect()
    const vv = window.visualViewport
    const viewportBottom = vv ? vv.height : window.innerHeight
    const comfort = viewportBottom * 0.65
    const overflow = rect.bottom - comfort
    if (overflow > 0) window.scrollBy({ top: overflow })
  }, [text])

  async function flushSave() {
    const pending = pendingRef.current
    if (!pending) return
    pendingRef.current = null
    try {
      await upsertEntry({ entryDate, content: pending.content, wordCount: pending.wordCount })
      lastSavedRef.current = pending.content
      setSaveError(null)
    } catch (err) {
      // Re-queue so the next change retries the save.
      pendingRef.current = pending
      setSaveError(err instanceof Error ? err.message : 'save failed')
    } finally {
      if (!pendingRef.current) setSaving(false)
    }
  }

  // Warn before unload if we still have unsaved keystrokes.
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (pendingRef.current || lastSavedRef.current !== text) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [text])

  // On unmount, flush any pending save. Fire-and-forget; the server action
  // will complete even though the component is gone.
  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current)
        saveTimer.current = null
      }
      if (pendingRef.current) void flushSave()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const next = e.target.value
    const nextCount = countWords(next)
    countRef.current = nextCount
    setText(next)
    setCount(nextCount)
    setCaret(e.target.selectionStart)

    if (FOCUS_FADE_AFTER_FIRST_KEYSTROKE && !focusOn) setFocusOn(true)

    pendingRef.current = { content: next, wordCount: nextCount }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    setSaving(true)
    saveTimer.current = setTimeout(() => {
      saveTimer.current = null
      void flushSave()
    }, DEBOUNCE_MS)
  }

  const { paragraphs, activeIdx } = useMemo(() => {
    const parts = text.split(/\n\n/)
    let running = 0
    let active = 0
    for (let i = 0; i < parts.length; i++) {
      const end = running + parts[i].length + 2
      if (caret >= running && caret <= end) {
        active = i
        break
      }
      running = end
    }
    return { paragraphs: parts, activeIdx: active }
  }, [text, caret])

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pt-28 pb-20 sm:py-24 relative">
      <DateBanner text={dateLabel} count={count} goal={GOAL} saving={saving} error={saveError} />
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
