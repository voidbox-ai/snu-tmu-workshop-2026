import type { CSSProperties, ReactNode } from 'react'

/* =========================================================
   Layout primitives.

   Thin, honest wrappers around the class names in deck.css — nothing here
   invents styling of its own. They exist so a slide file reads as structure
   ("a split, media left, body right") instead of as a pile of divs.
   ========================================================= */

type Kids = { children?: ReactNode; style?: CSSProperties; className?: string }

function cx(...parts: (string | undefined | false)[]): string {
  return parts.filter(Boolean).join(' ')
}

/** A horizontal hairline. The deck's only divider. */
export function Rule({ style }: { style?: CSSProperties }) {
  return <hr className="rule" style={style} />
}

/** Media on the left (47%), running text on the right. */
export function Split({ children, style }: Kids) {
  return (
    <div className="split" style={style}>
      {children}
    </div>
  )
}
export function Media({ children, style }: Kids) {
  return (
    <div className="media" style={style}>
      {children}
    </div>
  )
}
export function Body({ children, style }: Kids) {
  return (
    <div className="body" style={style}>
      {children}
    </div>
  )
}

/**
 * One picture at its own proportions, with the sentence it illustrates set
 * beside it. Unlike `Split`, the image is never cropped to fit a band.
 */
export function Plate({ children, style }: Kids) {
  return (
    <div className="plate" style={style}>
      {children}
    </div>
  )
}
export function Pic({ children, style }: Kids) {
  return (
    <div className="pic" style={style}>
      {children}
    </div>
  )
}

/**
 * Two columns of imagery.
 *
 * By default the two are balanced: one shape, one size, cropped to 16:9 —
 * which is what you want when the sources have very different proportions.
 * `fit` instead gives each column the width its own figure asks for at a
 * shared height — nothing is cropped, and the two still line up.
 */
export function Duo({ children, style, fit }: Kids & { fit?: boolean }) {
  return (
    <div className={cx('duo', fit && 'fit')} style={style}>
      {children}
    </div>
  )
}

/**
 * A row of figures — three, typically.
 *
 * By default they sit in a short band. `wide` makes them the subject of the
 * slide instead: equal 3:2 panels, set wider than the text measure, cropped a
 * little at the sides in exchange for a third more height.
 */
export function Strip({ children, style, wide }: Kids & { wide?: boolean }) {
  return (
    <div className={cx('strip', wide && 'wide')} style={style}>
      {children}
    </div>
  )
}

/** A column inside a Duo or a Strip. */
export function Col({ children, style }: Kids) {
  return (
    <div className="col" style={style}>
      {children}
    </div>
  )
}

/** Caption under a picture. */
export function Cap({ children, style }: Kids) {
  return (
    <p className="cap" style={style}>
      {children}
    </p>
  )
}

/** Label under a Strip thumbnail. */
export function Lab({ children }: Kids) {
  return <p className="lab">{children}</p>
}

/** A full-width SVG figure. */
export function Diagram({ children, style }: Kids) {
  return (
    <div className="diagram" style={style}>
      {children}
    </div>
  )
}

/**
 * A pulled-out sentence. `plain` drops the accent rule and the bold weight —
 * used where the sentence is a premise rather than a claim.
 */
export function Pull({
  children,
  plain,
  style,
}: Kids & { plain?: boolean }) {
  return (
    <p className={cx('pull', plain && 'plain')} style={style}>
      {children}
    </p>
  )
}

/** The deck's only list style: a hairline dash, no bullets. */
export function List({ children, style }: Kids) {
  return (
    <ul className="plain" style={style}>
      {children}
    </ul>
  )
}

/**
 * A row of big numbers.
 *
 * `pair` fixes two columns instead of packing the tiles, so several rows line
 * up under each other and each column can stand for one side of a comparison.
 */
export function Stats({ children, style, pair }: Kids & { pair?: boolean }) {
  return (
    <div className={cx('stats', pair ? 'pair' : 'wide')} style={style}>
      {children}
    </div>
  )
}

/**
 * One number and its label. `on` paints it in the accent — reserved for the
 * side that survived (the online exhibition). Failure numbers stay black.
 */
export function Stat({
  value,
  on,
  small,
  word,
  children,
}: {
  value: ReactNode
  on?: boolean
  small?: boolean
  /** The figure is a word, not a number — set it smaller so it does not pose as one. */
  word?: boolean
  children?: ReactNode
}) {
  return (
    <div className={cx('stat', on && 'on')}>
      <div className={cx('v', small && 'sm', word && 'word')}>{value}</div>
      <div className="k">{children}</div>
    </div>
  )
}

/** The numbered findings block. */
export function Lessons({ children }: Kids) {
  return <div className="lessons">{children}</div>
}
export function Lesson({
  n,
  heading,
  children,
}: {
  n: string
  heading: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="lesson">
      <div className="n">{n}</div>
      <div>
        <p className="h">{heading}</p>
        <p className="d">{children}</p>
      </div>
    </div>
  )
}

/* ---- typography ------------------------------------------------------- */

export function Title({ children, style }: Kids) {
  return (
    <h1 className="t-title" style={style}>
      {children}
    </h1>
  )
}
export function Sub({ children, style }: Kids) {
  return (
    <p className="t-sub" style={style}>
      {children}
    </p>
  )
}
export function Lead({ children, style }: Kids) {
  return (
    <h3 className="t-lead" style={style}>
      {children}
    </h3>
  )
}
export function Text({
  children,
  lg,
  style,
}: Kids & { lg?: boolean }) {
  return (
    <p className={lg ? 't-body-lg' : 't-body'} style={style}>
      {children}
    </p>
  )
}
export function Note({ children, style }: Kids) {
  return (
    <p className="t-cap" style={style}>
      {children}
    </p>
  )
}
export function Credit({ children }: Kids) {
  return <p className="credit">{children}</p>
}

/** The single accent color, used inline. */
export function Acc({ children }: Kids) {
  return <span className="acc">{children}</span>
}
