export type Quote = { text: string; author: string }

export const QUOTES: Quote[] = [
  { text: 'I write entirely to find out what I\'m thinking.', author: 'Joan Didion' },
  { text: 'We write to taste life twice.', author: 'Anaïs Nin' },
  { text: 'Fill your paper with the breathings of your heart.', author: 'William Wordsworth' },
  { text: 'There is no greater agony than bearing an untold story inside you.', author: 'Maya Angelou' },
  { text: 'The faintest ink is more powerful than the strongest memory.', author: 'Chinese proverb' },
  { text: 'Write hard and clear about what hurts.', author: 'Ernest Hemingway' },
  { text: 'Easy reading is damn hard writing.', author: 'Nathaniel Hawthorne' },
  { text: 'A word after a word after a word is power.', author: 'Margaret Atwood' },
  { text: 'You can\'t wait for inspiration. You have to go after it with a club.', author: 'Jack London' },
  { text: 'The first draft is just you telling yourself the story.', author: 'Terry Pratchett' },
  { text: 'A page a day is a book a year.', author: 'anon' },
  { text: 'Write without fear. Edit without mercy.', author: 'anon' },
  { text: 'Almost all good writing begins with terrible first efforts.', author: 'Anne Lamott' },
  { text: 'Start writing, no matter what. The water does not flow until the faucet is turned on.', author: 'Louis L\'Amour' },
  { text: 'Tomorrow may be hell, but today was a good writing day.', author: 'Jane Yolen' },
]

export function pickQuote(seed?: number): Quote {
  const i = seed === undefined ? Math.floor(Math.random() * QUOTES.length) : seed % QUOTES.length
  return QUOTES[i]
}
