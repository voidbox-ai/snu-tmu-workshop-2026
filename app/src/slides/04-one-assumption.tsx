import type { SlideMeta } from '../types'
import { MediaSlot } from '../components/MediaSlot'
import { Body, Cap, List, Media, Pull, Split } from '../components/layout'

export const meta: SlideMeta = {
  sec: 'Background',
  dur: 30,
  title: 'One assumption, and what it costs',
}

export default function OneAssumption() {
  return (
    <Split>
      <Media>
        {/* The smear is a thing that happened, so it is worth showing as
            motion. Falls back to the still if the clip is not there yet. */}
        <MediaSlot
          slot="assets/playground.mp4"
          poster="assets/playground.jpg"
          desc="놀이터 3DGS 스캔 — 번진 인물이 지나가는 구간"
        />
        <Cap>A playground we scanned. Everything is sharp except the person walking through it.</Cap>
      </Media>
      <Body>
        <Pull style={{ marginBottom: 24 }}>
          The optimization assumes the scene did not change while you were photographing it.
        </Pull>
        <List>
          <li>Anything that moved is not reconstructed as an object — it is baked in as a smear.</li>
          <li>
            What survives is <strong>that he was there</strong>. What is lost is{' '}
            <strong>where he was</strong>.
          </li>
          <li>
            So the medium is good at static objects — and{' '}
            <strong>a community, with its events, is not one</strong>.
          </li>
        </List>
      </Body>
    </Split>
  )
}
