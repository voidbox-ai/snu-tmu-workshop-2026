/**
 * How 3D Gaussian Splatting works, in three moves:
 * photographs with estimated poses → a cloud of translucent ellipsoids →
 * render, compare against the real photograph, adjust. Repeat.
 */
export function PipelineDiagram() {
  return (
    <svg
      viewBox="0 0 1200 340"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="3D Gaussian Splatting pipeline"
    >
      <defs>
        <marker
          id="ah"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#111110" />
        </marker>
        <marker
          id="aha"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#2a78d6" />
        </marker>
      </defs>

      {/* 1 — the photographs, and the path you walked while filming */}
      <text x="185" y="26" className="svg-label" textAnchor="middle">
        Photographs
      </text>
      <text x="185" y="52" className="svg-label-sm" textAnchor="middle">
        + estimated camera poses
      </text>
      <path
        d="M 95 185 C 130 110 235 100 285 160"
        className="svg-stroke-dim"
        strokeDasharray="5 6"
      />
      <path d="M 88 192 L 102 192 L 95 179 Z" className="svg-fill" />
      <path d="M 133 142 L 147 142 L 140 129 Z" className="svg-fill" />
      <path d="M 185 113 L 199 113 L 192 100 Z" className="svg-fill" />
      <path d="M 236 122 L 250 122 L 243 109 Z" className="svg-fill" />
      <path d="M 274 162 L 288 162 L 281 149 Z" className="svg-fill" />
      <text x="185" y="232" className="svg-label-xs" textAnchor="middle">
        the path you walk while filming
      </text>

      <path d="M 340 145 L 465 145" className="svg-stroke" markerEnd="url(#ah)" />

      {/* 2 — the Gaussians themselves: no mesh, no surfaces */}
      <text x="600" y="26" className="svg-label" textAnchor="middle">
        Millions of 3D Gaussians
      </text>
      <text x="600" y="52" className="svg-label-sm" textAnchor="middle">
        position · shape · opacity · colour
      </text>
      <g>
        <ellipse cx="556" cy="118" rx="26" ry="12" transform="rotate(-25 556 118)" className="svg-fill-dim" />
        <ellipse cx="602" cy="103" rx="30" ry="13" transform="rotate(10 602 103)" className="svg-stroke" />
        <ellipse cx="648" cy="123" rx="24" ry="11" transform="rotate(-15 648 123)" className="svg-fill-dim" />
        <ellipse cx="540" cy="152" rx="20" ry="9" transform="rotate(30 540 152)" className="svg-stroke" />
        <ellipse cx="572" cy="156" rx="32" ry="14" transform="rotate(5 572 156)" className="svg-fill-dim" />
        <ellipse cx="618" cy="148" rx="27" ry="12" transform="rotate(-30 618 148)" className="svg-stroke" />
        <ellipse cx="666" cy="138" rx="18" ry="8" transform="rotate(-20 666 138)" className="svg-fill-dim" />
        <ellipse cx="586" cy="188" rx="29" ry="13" transform="rotate(-10 586 188)" className="svg-stroke" />
        <ellipse cx="634" cy="184" rx="25" ry="11" transform="rotate(15 634 184)" className="svg-fill-dim" />
        <ellipse cx="663" cy="172" rx="17" ry="8" transform="rotate(25 663 172)" className="svg-stroke" />
      </g>
      <text x="600" y="232" className="svg-label-xs" textAnchor="middle">
        no mesh, no surfaces — only translucent ellipsoids
      </text>

      <path d="M 745 145 L 900 145" className="svg-stroke" markerEnd="url(#ah)" />

      {/* 3 — the optimisation loop */}
      <text x="1010" y="26" className="svg-label" textAnchor="middle">
        Compare &amp; adjust
      </text>
      <text x="1010" y="52" className="svg-label-sm" textAnchor="middle">
        render → difference → gradient
      </text>
      <rect x="948" y="98" width="96" height="66" className="svg-stroke" />
      <rect x="988" y="132" width="96" height="66" className="svg-stroke-dim" />
      <text x="1010" y="232" className="svg-label-xs" textAnchor="middle">
        render vs. the real photograph
      </text>

      <path
        d="M 1005 214 C 1005 278 850 292 700 292 C 645 292 618 258 610 208"
        className="svg-stroke-acc"
        strokeDasharray="6 7"
        markerEnd="url(#aha)"
      />
      <text
        x="812"
        y="324"
        className="svg-label-xs"
        textAnchor="middle"
        style={{ fill: '#2a78d6' }}
      >
        repeat — tens of thousands of iterations
      </text>
    </svg>
  )
}
