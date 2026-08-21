/* =========================================================
   Deck-wide configuration.

   The running head shown at the top of each slide comes from here: a slide
   declares a short section key (`sec`) and this maps it to the sentence the
   audience reads. Change the wording here, not in twenty-three files.
   ========================================================= */

export const SECTION_KEYS = [
  'Background',
  'Yonsei',
  'Findings',
  'Munsan',
  'Next',
] as const

export type SectionKey = (typeof SECTION_KEYS)[number]

export const SECTION_LABELS: Record<SectionKey, string> = {
  Background: 'Background',
  Yonsei: 'Case 1 — one exhibition, run in two places at once',
  Findings: 'What failed, what survived, and what we take from it',
  Munsan: 'Case 2 — the same scan, a different user',
  Next: 'Next',
}

/** reveal.js geometry — the deck is authored against a 1600×900 stage. */
export const STAGE = { width: 1600, height: 900 } as const
