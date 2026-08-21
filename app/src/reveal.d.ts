/**
 * Minimal typings for the vendored reveal.js 5.1.0 build.
 *
 * reveal.js and our patched notes plugin are loaded as classic <script> tags
 * from `index.html` (see public/reveal/), not as npm packages — that is what
 * keeps the speaker view's note editor, which lives inside the patched
 * `notes.js`, working untouched.
 */

interface RevealKeyBinding {
  keyCode: number
  key: string
  description?: string
}

interface RevealConfig {
  width?: number
  height?: number
  margin?: number
  minScale?: number
  maxScale?: number
  center?: boolean
  hash?: boolean
  history?: boolean
  controls?: boolean
  progress?: boolean
  slideNumber?: boolean | string
  showSlideNumber?: string
  transition?: string
  transitionSpeed?: string
  backgroundTransition?: string
  overview?: boolean
  help?: boolean
  pdfSeparateFragments?: boolean
  plugins?: unknown[]
  [key: string]: unknown
}

interface RevealSlideEvent {
  indexh: number
  indexv: number
  currentSlide: HTMLElement
  previousSlide?: HTMLElement
}

interface RevealStatic {
  initialize(config: RevealConfig): Promise<void>
  addKeyBinding(binding: RevealKeyBinding, callback: () => void): void
  on(type: 'slidechanged' | 'ready' | string, listener: (event: RevealSlideEvent) => void): void
  getIndices(): { h: number; v: number }
  isReady(): boolean
  layout(): void
}

interface Window {
  Reveal: RevealStatic
  RevealNotes: unknown
}

declare const Reveal: RevealStatic
