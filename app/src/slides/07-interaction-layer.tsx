import type { SlideMeta } from '../types'
import { MediaSlot } from '../components/MediaSlot'
import { Cap, Col, Duo, Note, Pull, Rule } from '../components/layout'

export const meta: SlideMeta = {
  sec: 'Yonsei',
  dur: 70,
  title: 'And then the layer we cared most about',
}

/* The two directions, shown as the two things they actually were. Neither
   caption carries the accent: slide 9 is about to report that one of these
   two ran zero times, and the deck's one color belongs to what survived. */
export default function InteractionLayer() {
  return (
    <>
      <Duo style={{ marginBottom: 24 }}>
        <Col>
          <MediaSlot
            slot="assets/sync-online-to-hall.png"
            desc="온라인에서 쓴 방명록을 현장 방명록에 손으로 옮겨 적는 장면"
          />
          <Cap>
            <b>Virtual → physical</b> — a note written online, copied out by hand into the
            guestbook at the booth in the hall.
          </Cap>
        </Col>
        <Col>
          <MediaSlot
            slot="assets/sync-hall-to-online.webp"
            desc="현장에서 쓴 방명록을 QR 코드로 촬영해 온라인에 올리는 장면"
          />
          <Cap>
            <b>Physical → virtual</b> — a note written by hand in the hall, photographed through a
            QR code and posted online.
          </Cap>
        </Col>
      </Duo>

      {/* Two sentences, one per line: the parallel is the point. */}
      <Pull>
        Something happening in the hall should change the virtual exhibition.
        <br />
        Something happening in the virtual exhibition should change the hall.
      </Pull>
      <Rule />
      <Note>
        This is where most of our design effort went. It is the second layer — our attempt to lay
        events back over the geometry.
      </Note>
    </>
  )
}
