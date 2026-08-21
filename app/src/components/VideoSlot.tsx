import { useState } from 'react'
import { ImageSlot } from './ImageSlot'

/**
 * A video in a picture slot.
 *
 * Degrades in two steps, so the deck is always presentable:
 *   the video → its poster still → a dashed placeholder naming the file.
 *
 * Playback is handed to reveal.js via `data-autoplay`: it starts the video
 * when the slide comes up and pauses it when you leave. Muted and looping,
 * because a scan flythrough has nothing to say and everything to show — and
 * because browsers refuse to autoplay anything with sound.
 *
 * Unlike pictures, a video cannot be dropped in through `/images.html`
 * (the server only accepts formats a browser can display as an image).
 * Copy the file into `public/assets/` yourself, and keep it small — GitHub
 * refuses single files over 100 MB.
 */
export function VideoSlot({
  slot,
  poster,
  desc = '',
  className,
}: {
  /** Path to the video, relative to `public/` — e.g. `assets/playground.mp4`. */
  slot: string
  /** Still shown before the first frame, and used if the video will not load. */
  poster: string
  desc?: string
  className?: string
}) {
  const [missing, setMissing] = useState(false)

  if (missing) {
    return <ImageSlot slot={poster} desc={desc} className={className} />
  }

  return (
    <video
      className={className}
      src={slot}
      poster={poster}
      data-autoplay=""
      data-slot={slot}
      data-desc={desc}
      muted
      loop
      playsInline
      preload="auto"
      onError={() => setMissing(true)}
    />
  )
}
