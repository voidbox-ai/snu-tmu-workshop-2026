import type { SlideMeta } from '../types'
import { Col, Credit, Duo, Lead, Rule, Text } from '../components/layout'

export const meta: SlideMeta = {
  sec: 'Next',
  dur: 0,
  uncounted: true,
  title: 'Backup',
  sub: 'Archive and repertoire',
}

export default function BackupArchiveRepertoire() {
  return (
    <>
      <Duo style={{ alignItems: 'flex-start' }}>
        <Col>
          <Lead>Archive</Lead>
          <Rule style={{ margin: '16px 0' }} />
          <Text>Knowledge preserved in enduring media — text, image, object, building.</Text>
        </Col>
        <Col>
          <Lead>Repertoire</Lead>
          <Rule style={{ margin: '16px 0' }} />
          <Text>
            Knowledge transmitted only through embodied practice — gesture, speech, ritual,
            encounter.
          </Text>
        </Col>
      </Duo>
      <Rule style={{ marginTop: 34 }} />
      <Text lg>
        3DGS is by nature an archive medium; the events at an exhibition are repertoire. Our nine
        comments were an attempt to graft one onto the other, and it did not take.
      </Text>
      <Credit>
        Diana Taylor, <em>The Archive and the Repertoire</em>, Duke University Press, 2003.
      </Credit>
    </>
  )
}
