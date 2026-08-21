/**
 * The hypothesis, set against the two things it gets confused with.
 *
 * Metaverse: two spaces, no coupling. Digital twin: one direction.
 * Space Sync: both directions — the only panel that gets the accent.
 */
export function CouplingDiagram() {
  return (
    <svg
      viewBox="0 0 1200 250"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Metaverse, digital twin and space sync compared"
    >
      <defs>
        <marker
          id="ah2"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6.5"
          markerHeight="6.5"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#111110" />
        </marker>
        <marker
          id="ah2a"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6.5"
          markerHeight="6.5"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#2a78d6" />
        </marker>
      </defs>

      <rect x="872" y="0" width="256" height="248" className="svg-fill-wash" rx="3" />

      {/* metaverse — parallel, not touching */}
      <text x="200" y="24" className="svg-label" textAnchor="middle">
        Metaverse
      </text>
      <text x="200" y="50" className="svg-label-sm" textAnchor="middle" fontStyle="italic">
        an alternative space
      </text>
      <circle cx="128" cy="140" r="48" className="svg-stroke" />
      <circle cx="272" cy="140" r="48" className="svg-stroke" />
      <text x="128" y="146" className="svg-label-xs" textAnchor="middle">
        REAL
      </text>
      <text x="272" y="146" className="svg-label-xs" textAnchor="middle">
        VIRTUAL
      </text>
      <line x1="194" y1="122" x2="194" y2="158" className="svg-stroke" />
      <line x1="206" y1="122" x2="206" y2="158" className="svg-stroke" />
      <text x="200" y="228" className="svg-label-sm" textAnchor="middle">
        no coupling
      </text>

      {/* digital twin — the real world writes into the virtual one */}
      <text x="600" y="24" className="svg-label" textAnchor="middle">
        Digital twin
      </text>
      <text x="600" y="50" className="svg-label-sm" textAnchor="middle" fontStyle="italic">
        a mirror space
      </text>
      <circle cx="528" cy="140" r="48" className="svg-stroke" />
      <circle cx="672" cy="140" r="48" className="svg-stroke" />
      <text x="528" y="146" className="svg-label-xs" textAnchor="middle">
        REAL
      </text>
      <text x="672" y="146" className="svg-label-xs" textAnchor="middle">
        VIRTUAL
      </text>
      <line x1="581" y1="140" x2="616" y2="140" className="svg-stroke" markerEnd="url(#ah2)" />
      <text x="600" y="228" className="svg-label-sm" textAnchor="middle">
        one direction
      </text>

      {/* space sync — what we were testing */}
      <text x="1000" y="24" className="svg-label-acc" textAnchor="middle">
        Space Sync
      </text>
      <text x="1000" y="50" className="svg-label-sm" textAnchor="middle" fontStyle="italic">
        causal coupling
      </text>
      <circle cx="928" cy="140" r="48" className="svg-stroke-acc" />
      <circle cx="1072" cy="140" r="48" className="svg-stroke-acc" />
      <text x="928" y="146" className="svg-label-xs" textAnchor="middle">
        REAL
      </text>
      <text x="1072" y="146" className="svg-label-xs" textAnchor="middle">
        VIRTUAL
      </text>
      <line x1="981" y1="128" x2="1016" y2="128" className="svg-stroke-acc" markerEnd="url(#ah2a)" />
      <line x1="1016" y1="154" x2="981" y2="154" className="svg-stroke-acc" markerEnd="url(#ah2a)" />
      <text
        x="1000"
        y="228"
        className="svg-label-sm"
        textAnchor="middle"
        style={{ fill: '#2a78d6' }}
      >
        both directions
      </text>
    </svg>
  )
}
