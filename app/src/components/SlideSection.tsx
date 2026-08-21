import { SECTION_LABELS } from '../deck.config'
import type { Slide } from '../types'

/**
 * One reveal.js `<section>`.
 *
 * Everything a slide file does *not* have to repeat lives here: the running
 * head naming the part of the talk, the slide's own title, the body wrapper,
 * and the notes block reveal reads for the speaker view.
 *
 * Note the deliberate absence of `className` and `style` on the <section>:
 * reveal.js writes `present` / `past` / `future` onto those elements, and a
 * React-controlled class attribute would fight it.
 */
export function SlideSection({ slide, notes }: { slide: Slide; notes: string }) {
  const { meta, Component } = slide

  return (
    <section
      data-sec={meta.sec}
      data-dur={meta.dur}
      data-slide-id={slide.id}
      {...(meta.title ? { 'data-title': meta.title } : {})}
      {...(meta.sub ? { 'data-sub': meta.sub } : {})}
      {...(meta.noTopbar ? { 'data-notopbar': '' } : {})}
      {...(meta.uncounted ? { 'data-visibility': 'uncounted' } : {})}
    >
      {!meta.noTopbar && (
        <div className="topbar">
          <nav className="secnav">
            <span className="cur">{SECTION_LABELS[meta.sec]}</span>
          </nav>
          {meta.title && (
            <h2 className="slide-title">
              {meta.title}
              {meta.sub && <span className="sub">{meta.sub}</span>}
            </h2>
          )}
        </div>
      )}

      {meta.noTopbar ? (
        <Component />
      ) : (
        <div className={meta.title ? 'body-area has-title' : 'body-area'}>
          <Component />
        </div>
      )}

      <aside className="notes" dangerouslySetInnerHTML={{ __html: notes }} />
    </section>
  )
}
