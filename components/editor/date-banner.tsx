export function DateBanner({ text }: { text: string }) {
  return (
    <p className="folio-fade-in font-mono text-sm text-stone-500 absolute top-6 left-6 pointer-events-none">
      {text}
    </p>
  )
}
