import type { SlideMeta } from '../types'
import { ImageSlot } from '../components/ImageSlot'
import { Acc, Cap, Col, Duo, Text } from '../components/layout'

export const meta: SlideMeta = {
  sec: 'Yonsei',
  dur: 40,
  title: 'Yonsei University, Dept. of Architectural Engineering',
  sub: 'Graduation Exhibition 2026',
}

export default function YonseiTwoPlaces() {
  return (
    <>
      <Duo style={{ marginBottom: 24 }}>
        <Col>
          <ImageSlot slot="assets/yonsei-physical.jpg" desc="연세대 졸업전시 물리 전시장 사진" />
          <Cap>
            <b>Physical</b> — June 4–8, 2026 · five days
          </Cap>
        </Col>
        <Col>
          <ImageSlot slot="assets/yonsei-virtual.jpg" desc="온라인 전시 스크린샷 (스캔된 전시장)" />
          <Cap>
            <b className="acc">Virtual</b> — opened June 5, 2026 · <Acc>still open today</Acc>
          </Cap>
        </Col>
      </Duo>
      <Text>
        A partnership between the department and voidbox: run one graduation exhibition in two
        places at once, and see whether the two could behave as a single event.
      </Text>
    </>
  )
}
