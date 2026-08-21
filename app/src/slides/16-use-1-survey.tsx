import type { SlideMeta } from '../types'
import { MediaSlot } from '../components/MediaSlot'
import { Body, Cap, List, Media, Note, Rule, Split } from '../components/layout'

export const meta: SlideMeta = {
  sec: 'Munsan',
  dur: 40,
  title: 'Use 1 — existing-condition survey',
}

export default function UseOneSurvey() {
  return (
    <Split>
      <Media>
        <MediaSlot
          slot="assets/munsan-pointcloud.jpg"
          desc="추출된 저밀도 포인트클라우드 / 실측 화면"
        />
        <Cap>Low-density point cloud, extracted alongside the Gaussians.</Cap>
      </Media>
      <Body>
        <List>
          <li>A school built decades ago; the drawings are old and incomplete.</li>
          <li>The scan stands in for going out and measuring it.</li>
          <li>
            Gaussians are appearance, not geometry — so we extract a{' '}
            <strong>low-density point cloud</strong> alongside them. Not survey-grade, but
            dimensionable.
          </li>
        </List>
        <Rule />
        <Note>Good enough to design against. I would not hand it to a structural engineer.</Note>
      </Body>
    </Split>
  )
}
