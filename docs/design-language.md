# Mornings Design Language

The shared rules that keep Mornings feeling like one thing. Read this before changing UI copy, components, or styles.

## Mood

Calm. Underground-cult. Substack-tier typography. The ritual matters more than the product. The right person should feel at home within five seconds; the wrong person should bounce.

## Voice & copy

Mornings sounds like a thoughtful 28-year-old peer who happens to be quietly funny. The audience often skews older — copy should land warmly for everyone.

**Voice traits**

- Calm and declarative as default
- Smart humor that lands without trying — usually a half-line that names a truth (e.g. *"happens to all of us"*, *"no streaks, no likes, no algorithm"*)
- **Lowercase mono** for UI chrome (buttons, nav, microcopy, placeholders, errors)
- **Serif (Lora)** for emotional or hero moments (greetings, hero phrases, tribute, body copy)
- Specific over abstract — *"no streaks, no likes, no algorithm"* beats *"no distractions"*
- Warm, not chatty. Never marketing-speak. Never exclamation points.
- Comfortable with silence — a short phrase beats a paragraph

**Anti-patterns**

- No emojis in UI
- No *"let's get started!"*, *"exciting"*, *"amazing"*
- No corporate hedging (*"please"*, *"kindly"*)
- No Gen-Z signaling (*"vibes"*, *"lowkey"*, *"fr"*)
- Don't be clever for cleverness's sake — the line must also be true

**The voice test**

Before shipping a string, read it aloud as if you were that 28-year-old talking to someone 38. If it would feel wrong, rewrite it.

## Typography

- **Serif:** `Lora` — used for hero, body copy, greetings, dates, the writing surface itself
- **Mono:** `JetBrains Mono` — used for UI chrome, nav, buttons, microcopy, dates
- **Italic serif** for tagline-style emphasis (*"Three pages. Every morning. For yourself."*)
- Body sizes scale up generously on hero moments; chrome stays small (`text-xs`, `text-sm`)
- `text-balance` on most paragraphs and headings

## Color

Stone palette only. No accents, no brand colors.

| Role | Token |
| --- | --- |
| Background | `bg-stone-50` |
| Subtle background detail | `mornings-paper-grain` (SVG noise) |
| Body text | `text-stone-700` |
| Strong text / headings | `text-stone-900` |
| Quiet text / placeholders | `text-stone-500` / `text-stone-400` |
| Ghost / hint | `text-stone-300` |
| Dim paragraph (editor) | `mornings-dim-paragraph` |
| Active paragraph (editor) | `mornings-active-paragraph` |
| Errors | `text-red-700` (used sparingly, only when literal errors)

No dark mode for now. No gradients. No shadows beyond what `mornings-paper-grain` provides.

## Layout

- Generous whitespace — pages breathe
- Hero content is centered, max-width `2xl` or `md`
- Editor / reading content uses `max-w-3xl` and serif body
- Top-right floating nav for app screens (mono, stone-400)
- Footers small, mono, near-invisible

## Motion

- Slow, soft fades preferred over slides
- Typewriter for the homepage hero phrase (~80ms/char)
- Welcome screen: fade-in greeting, then fade-in quote slightly later
- All motion respects `prefers-reduced-motion: reduce` — skip animation, render final state
- No bounces, no parallax, no scroll-jacking

## Components

- Buttons: bordered rectangles, mono lowercase label, hover swaps to dark fill
- Inputs: bottom-border only, no surrounding box, focus deepens the border
- Links: stone-500 default, stone-900 hover, underline offset 4, stone-300 decoration
- Cards: avoid — Mornings is mostly prose on bare cream

## What Mornings is not

- Not a social product. No followers, comments, shares, likes.
- Not a gamified habit tracker. No streaks, badges, XP, fire emojis.
- Not a knowledge base. Past entries are archived, not browsed for insight.
- Not AI-first. Writing is the human's job.
- Not a 750words clone. It's a tribute — credit Cameron and Benson openly, never compete by SEO.

## When in doubt

Take a thing out, not add one.
