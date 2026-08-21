/* =========================================================
   Slide registry.

   Every `src/slides/NN-name.tsx` is picked up automatically, in filename
   order, together with its `NN-name.notes.html` sibling. Adding a slide means
   adding two files and nothing else — there is no list to keep in step.

   The numeric prefix is the running order. To move a slide, renumber it.
   ========================================================= */

import type { Slide, SlideModule } from '../types'

const modules = import.meta.glob<SlideModule>('./*.tsx', { eager: true })
const notes = import.meta.glob<string>('./*.notes.html', {
  eager: true,
  query: '?raw',
  import: 'default',
})

/** `./09-what-the-layer-did.tsx` -> `09-what-the-layer-did` */
function stem(path: string): string {
  return path.replace(/^\.\//, '').replace(/\.tsx$/, '')
}

export const SLIDES: Slide[] = Object.keys(modules)
  .sort()
  .map((path, index) => {
    const id = stem(path)
    const mod = modules[path]!

    if (!mod.meta) {
      throw new Error(`slide ${id} does not export \`meta\``)
    }
    if (!mod.default) {
      throw new Error(`slide ${id} has no default export`)
    }

    return {
      index,
      id,
      meta: mod.meta,
      Component: mod.default,
      notes: (notes[`./${id}.notes.html`] ?? '').trim(),
    }
  })

/** Slides that count towards the slide number and the time plan (no backups). */
export const COUNTED: Slide[] = SLIDES.filter((s) => !s.meta.uncounted)

/**
 * Cumulative seconds by which the speaker should have *arrived* at each
 * counted slide. `PLANNED_TOTAL` is the whole talk.
 */
export const ARRIVE_AT: number[] = (() => {
  let acc = 0
  return COUNTED.map((s) => {
    const at = acc
    acc += s.meta.dur
    return at
  })
})()

export const PLANNED_TOTAL: number = COUNTED.reduce((n, s) => n + s.meta.dur, 0)

/** Position within the counted run, or null for a backup slide. */
export function countedIndexOf(slideIndex: number): number | null {
  const i = COUNTED.findIndex((s) => s.index === slideIndex)
  return i < 0 ? null : i
}
