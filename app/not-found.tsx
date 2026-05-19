import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-32 font-serif text-lg leading-loose text-stone-700">
      <p className="font-mono text-sm text-stone-500 mb-8">— nothing here —</p>
      <p>this page hasn&rsquo;t been written yet. some days stay blank, and that&rsquo;s alright.</p>
      <p className="mt-12 font-mono text-xs text-stone-400">
        <Link href="/today" className="underline hover:text-stone-700">
          return to today
        </Link>
      </p>
    </main>
  )
}
