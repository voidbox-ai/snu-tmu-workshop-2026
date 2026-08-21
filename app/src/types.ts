import type { ComponentType } from 'react'
import type { SectionKey } from './deck.config'

/**
 * Everything a slide declares about itself. Exported as `meta` from the
 * slide's own file, so a slide is one self-contained unit: its markup, its
 * timing, its title, and (alongside it) its speaker notes.
 */
export interface SlideMeta {
  /** Which part of the talk this slide belongs to (drives the running head). */
  sec: SectionKey
  /** Planned duration in seconds — the pacing clock is built from these. */
  dur: number
  /** Slide title, shown under the running head. Omit for a full-bleed slide. */
  title?: string
  /** Secondary title, set beside the title in a lighter weight. */
  sub?: string
  /** Suppress the running head entirely (the opening slide). */
  noTopbar?: boolean
  /** Backup slides: excluded from slide numbering and from the time plan. */
  uncounted?: boolean
}

/** A slide module as it appears once the registry has loaded it. */
export interface Slide {
  /** 0-based position in the deck — the index the speaker view saves against. */
  index: number
  /** Source file stem, e.g. `09-what-the-layer-did`. Used as a stable id. */
  id: string
  meta: SlideMeta
  Component: ComponentType
  /** Speaker notes as an HTML fragment, from the paired `.notes.html` file. */
  notes: string
}

/** What each `src/slides/NN-*.tsx` file is expected to export. */
export interface SlideModule {
  meta: SlideMeta
  default: ComponentType
}
