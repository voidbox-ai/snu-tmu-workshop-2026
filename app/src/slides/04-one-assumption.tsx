import type { SlideMeta } from '../types'
import { ImageSlot } from '../components/ImageSlot'
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
        <ImageSlot
          slot="assets/playground.jpg"
          desc="놀이터 3DGS 스캔 — 번진 인물이 보이는 프레임"
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
            So the medium is good at space <strong>on the condition that events are excluded</strong>.
          </li>
        </List>
      </Body>
    </Split>
  )
}
