import { useState } from 'react'

const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogv)$/i

/** Is this path a video? The extension is the only thing we can go on. */
export function isVideoPath(path: string): boolean {
  return VIDEO_EXT.test(path)
}

/**
 * A media slot — one picture or one video, whichever the file happens to be.
 *
 * The kind is read off the extension in `slot`, so swapping a still for a clip
 * is a one-string change (and the image drop-in page makes that change for you
 * when you drop a video onto a slot that used to hold a picture).
 *
 * It degrades rather than breaking:
 *   the file → its poster still, if any → a dashed placeholder naming the file.
 * So the deck is presentable before any of the assets have landed.
 *
 * Video playback is handed to reveal.js via `data-autoplay`: it starts when
 * the slide comes up and pauses when you leave. Muted and looping, because a
 * scan flythrough has nothing to say — and because browsers refuse to autoplay
 * anything with sound.
 */
export function MediaSlot({
  slot,
  poster,
  desc = '',
  alt = '',
  className,
}: {
  /** Path relative to `public/` — e.g. `assets/playground.mp4`. */
  slot: string
  /** Only meaningful for a video: the still shown before the first frame. */
  poster?: string
  desc?: string
  alt?: string
  className?: string
}) {
  /* 0 = the file itself, 1 = its poster, 2 = a placeholder */
  const [stage, setStage] = useState<0 | 1 | 2>(0)
  const video = isVideoPath(slot)

  if (stage === 2 || (stage === 1 && !poster)) {
    return (
      <div className={className ? `slot ${className}` : 'slot'}>
        <div className="slot-file">{slot}</div>
        <div className="slot-desc">{desc}</div>
      </div>
    )
  }

  if (stage === 1 && poster) {
    return (
      <img
        className={className}
        src={poster}
        alt={alt}
        data-slot={slot}
        data-desc={desc}
        onError={() => setStage(2)}
      />
    )
  }

  if (video) {
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
        onError={() => setStage(poster ? 1 : 2)}
      />
    )
  }

  return (
    <img
      className={className}
      src={slot}
      alt={alt}
      data-slot={slot}
      data-desc={desc}
      onError={() => setStage(2)}
    />
  )
}
