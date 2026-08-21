import { useState } from 'react'

/**
 * A picture slot.
 *
 * Until the real photograph lands in `public/<slot>`, this renders a dashed
 * placeholder naming the file it wants and describing the shot — so the deck
 * is fully presentable with the pictures still missing.
 *
 * `slot` doubles as the file path *and* as the identifier the image drop-in
 * page (`/images.html`) uses; the dev server scans these props to build the
 * list of slots, so keep `slot=` and `desc=` as plain string literals.
 */
export function ImageSlot({
  slot,
  desc = '',
  alt = '',
  className,
}: {
  slot: string
  desc?: string
  alt?: string
  className?: string
}) {
  const [missing, setMissing] = useState(false)

  if (missing) {
    return (
      <div className={className ? `slot ${className}` : 'slot'}>
        <div className="slot-file">{slot}</div>
        <div className="slot-desc">{desc}</div>
      </div>
    )
  }

  return (
    <img
      className={className}
      src={slot}
      alt={alt}
      data-slot={slot}
      data-desc={desc}
      onError={() => setMissing(true)}
    />
  )
}
