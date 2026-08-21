/* =========================================================
   How long each exhibition lived — drawn against time, at real scale.

   The original slide had "77 days" and "15× longer" typed in by hand, which
   was true on the day it was written. Here the axis is computed from the two
   dates below, so the bar, the month ticks and both numbers stay honest
   however long it is until the talk is given.
   ========================================================= */

/** June 4–8, 2026 — five days in the Baekyangnuri hall. */
const PHYSICAL_OPEN = new Date(2026, 5, 4)
const PHYSICAL_DAYS = 5

/** June 5, 2026 — one day later, and still open. */
const VIRTUAL_OPEN = new Date(2026, 5, 5)

const X0 = 120 // Jun 4, the left edge of the axis
const X1 = 1107 // today, the right edge
const MS_PER_DAY = 86400000

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / MS_PER_DAY)
}

/** The first of every month that falls inside the drawn span. */
function monthTicks(from: Date, to: Date): { label: string; date: Date }[] {
  const out: { label: string; date: Date }[] = []
  const cursor = new Date(from.getFullYear(), from.getMonth() + 1, 1)
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  while (cursor < to && out.length < 12) {
    out.push({ label: `${names[cursor.getMonth()]} 1`, date: new Date(cursor) })
    cursor.setMonth(cursor.getMonth() + 1)
  }
  return out
}

export function TimelineDiagram({ today = new Date() }: { today?: Date }) {
  // never let the drawing collapse if the deck is opened before opening day
  const span = Math.max(daysBetween(PHYSICAL_OPEN, today), PHYSICAL_DAYS + 2)
  const pxPerDay = (X1 - X0) / span

  const physicalW = PHYSICAL_DAYS * pxPerDay
  const virtualX = X0 + daysBetween(PHYSICAL_OPEN, VIRTUAL_OPEN) * pxPerDay
  const virtualW = X1 - virtualX
  const virtualDays = Math.max(daysBetween(VIRTUAL_OPEN, today), 1)
  const multiple = Math.round(virtualDays / PHYSICAL_DAYS)

  const ticks = monthTicks(PHYSICAL_OPEN, today)

  return (
    <svg
      viewBox="0 0 1200 290"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`The physical exhibition lasted ${PHYSICAL_DAYS} days; the virtual exhibition has been open ${virtualDays} days and counting`}
    >
      <defs>
        <marker
          id="ah3"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#2a78d6" />
        </marker>
      </defs>

      {/* five days */}
      <text x={X0} y="28" className="svg-label-sm">
        Physical exhibition
      </text>
      <rect x={X0} y="40" width={physicalW} height="34" rx="3" className="svg-fill-dim" />
      <text x={X0 + physicalW + 14} y="66" className="svg-label">
        {PHYSICAL_DAYS} days
      </text>

      {/* and counting */}
      <text x={virtualX} y="106" className="svg-label-sm">
        Virtual exhibition
      </text>
      <text x={X1} y="106" className="svg-label-acc" textAnchor="end" style={{ fontSize: 26 }}>
        {multiple}× longer
      </text>
      <rect x={virtualX} y="118" width={virtualW} height="34" rx="3" className="svg-fill-acc" />
      <path d={`M ${X1 + 7} 135 L ${X1 + 45} 135`} className="svg-stroke-acc" markerEnd="url(#ah3)" />
      <text x={virtualX + 17} y="142" className="svg-label" style={{ fill: '#ffffff' }}>
        {virtualDays} days — and counting
      </text>

      {/* the daily-visitor curve, once the numbers come out of the database */}
      <rect
        x={virtualX}
        y="172"
        width={virtualW}
        height="52"
        fill="none"
        stroke="#d5d4cd"
        strokeWidth="1"
        strokeDasharray="4 6"
        rx="3"
      />
      <text x={virtualX + virtualW / 2} y="203" className="svg-label-xs" textAnchor="middle">
        daily unique visitors — pending DB export
      </text>

      {/* axis */}
      <line x1={X0} y1="246" x2={X1 + 13} y2="246" className="svg-stroke-dim" />
      <line x1={X0} y1="246" x2={X0} y2="255" className="svg-stroke-dim" />
      <text x={X0} y="276" className="svg-label-xs" textAnchor="start">
        Jun 4
      </text>

      {ticks.map((tick) => {
        const x = X0 + daysBetween(PHYSICAL_OPEN, tick.date) * pxPerDay
        // drop a tick that would collide with either end label
        if (x < X0 + 60 || x > X1 - 60) return null
        return (
          <g key={tick.label}>
            <line x1={x} y1="246" x2={x} y2="255" className="svg-stroke-dim" />
            <text x={x} y="276" className="svg-label-xs" textAnchor="middle">
              {tick.label}
            </text>
          </g>
        )
      })}

      <line x1={X1} y1="246" x2={X1} y2="255" className="svg-stroke-dim" />
      <text x={X1} y="276" className="svg-label-xs" textAnchor="end">
        today
      </text>
    </svg>
  )
}
