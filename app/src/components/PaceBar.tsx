import { useEffect, useState } from 'react'
import { ARRIVE_AT, COUNTED, PLANNED_TOTAL, SLIDES, countedIndexOf } from '../slides/registry'

function mmss(sec: number): string {
  const neg = sec < 0
  const abs = Math.abs(Math.round(sec))
  const m = Math.floor(abs / 60)
  const s = abs % 60
  return `${neg ? '-' : ''}${m}:${s < 10 ? '0' : ''}${s}`
}

/**
 * The pacing strip in the bottom-left corner:
 *
 *     04:12   +0:18 behind   Findings · 14/22 · plan 13:55
 *
 * Elapsed time, drift against the moment you should have *arrived* at this
 * slide, and where you are. Green means you have room, red means twenty
 * seconds or more late.
 */
export function PaceBar({
  on,
  slideIndex,
  startedAt,
}: {
  on: boolean
  slideIndex: number
  startedAt: number | null
}) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!on) return
    const timer = window.setInterval(() => setNow(Date.now()), 500)
    return () => window.clearInterval(timer)
  }, [on])

  const elapsed = startedAt ? (now - startedAt) / 1000 : 0
  const m = Math.floor(elapsed / 60)
  const s = Math.floor(elapsed % 60)
  const clock = `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`

  const i = countedIndexOf(slideIndex)

  let delta = ''
  let deltaClass = 'delta'
  let where = 'backup'

  if (i !== null) {
    const sec = SLIDES[slideIndex]?.meta.sec ?? ''
    where = `${sec}  ·  ${i + 1}/${COUNTED.length}  ·  plan ${mmss(PLANNED_TOTAL)}`

    if (!startedAt) {
      delta = 'ready'
    } else {
      const drift = elapsed - (ARRIVE_AT[i] ?? 0)
      delta = `${drift >= 0 ? '+' : ''}${mmss(drift)}${drift >= 0 ? ' behind' : ' ahead'}`
      deltaClass = `delta ${drift > 20 ? 'behind' : drift < -20 ? 'ahead' : ''}`.trim()
    }
  }

  return (
    <div id="pace" className={on ? 'on' : undefined}>
      <span className="clock">{clock}</span>
      <span className={deltaClass}>{delta}</span>
      <span className="sec">{where}</span>
    </div>
  )
}
