export function DateBanner({
  text,
  count,
  goal,
  saving,
  error,
}: {
  text: string
  count: number
  goal: number
  saving?: boolean
  error?: string | null
}) {
  const done = count >= goal
  return (
    <div className="mornings-fade-in fixed top-6 left-6 pointer-events-none font-mono text-xs sm:text-sm z-10">
      <p className="hidden sm:block text-stone-500">{text}</p>
      <p className="sm:mt-1 tabular-nums flex items-center gap-3">
        <span className={done ? 'text-stone-900' : 'text-stone-400'}>
          {count} / {goal}
        </span>
        {error ? (
          <span className="text-rose-500" role="status">couldn’t save — keep typing</span>
        ) : saving ? (
          <span className="text-stone-300">saving…</span>
        ) : null}
      </p>
    </div>
  )
}
