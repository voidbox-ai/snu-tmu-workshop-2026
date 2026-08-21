import type { SlideMeta } from '../types'
import { Rule, Sub, Title } from '../components/layout'

export const meta: SlideMeta = {
  sec: 'Background',
  dur: 10,
  noTopbar: true,
}

export default function TitleSlide() {
  return (
    <div className="center-stack">
      <Title>Presence Before Synchronization</Title>
      <Sub style={{ marginTop: 20 }}>Rethinking Digital Twins for Community Rebuilding</Sub>
      <Rule style={{ width: 180, margin: '34px auto' }} />
      <p className="t-note" style={{ fontStyle: 'normal' }}>
        <strong style={{ fontWeight: 600 }}>Hyeogjin Noh</strong> &nbsp;·&nbsp; CEO at voidbox Inc.
        <br />
        <span className="faint">SNU × TMU Annual Workshop &nbsp;·&nbsp; 2026.08.24</span>
      </p>
      <img className="logo" src="assets/logo.svg" alt="voidbox" />
    </div>
  )
}
