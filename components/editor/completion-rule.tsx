export function CompletionRule({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <div className="folio-fade-in mt-12 mb-6">
      <hr className="border-t border-stone-300" />
      <p className="mt-3 font-mono text-sm text-stone-400">complete</p>
    </div>
  )
}
