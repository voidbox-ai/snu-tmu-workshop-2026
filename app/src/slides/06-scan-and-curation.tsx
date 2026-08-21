import type { SlideMeta } from '../types'
import { MediaSlot } from '../components/MediaSlot'
import { Col, Lab, List, Note, Rule, Strip } from '../components/layout'

export const meta: SlideMeta = {
  sec: 'Yonsei',
  dur: 40,
  title: 'The scan, and the exhibition placed inside it',
}

/* Three screens, in the order the department used them — planning the show
   before it existed, installing it, and keeping it afterwards. They line up
   with the three points below, so the labels stay short. */
export default function ScanAndCuration() {
  return (
    <>
      <Strip wide style={{ marginBottom: 28 }}>
        <Col>
          <MediaSlot
            slot="assets/planning-tool.png"
            desc="전시 이전 기획 단계에서 쓰인 기능 화면"
          />
          <Lab>
            Planning <i>· before the show was installed</i>
          </Lab>
        </Col>
        <Col>
          <MediaSlot slot="assets/tool-curation.jpg" desc="각 학생별 큐레이션 툴 화면" />
          <Lab>
            Curation <i>· each student's work, placed in the scan</i>
          </Lab>
        </Col>
        <Col>
          <MediaSlot
            slot="assets/archive-years.jpg"
            desc="연도별 전시 아카이빙 사이트 화면"
          />
          <Lab>
            Archive <i>· one site per year, still open</i>
          </Lab>
        </Col>
      </Strip>

      <List>
        <li>We scanned the exhibition hall before installation.</li>
        <li>
          A <strong>curation tool</strong> let the department place each student's work into the
          scanned space, from a plan view.
        </li>
        <li>
          An <strong>archive site</strong> wrapped it: navigation, notices, and a page per work.
        </li>
      </List>
      <Rule />
      <Note>
        So the virtual exhibition was not a video or a photo gallery. It was the hall itself, with
        the show installed in it.
      </Note>
    </>
  )
}
