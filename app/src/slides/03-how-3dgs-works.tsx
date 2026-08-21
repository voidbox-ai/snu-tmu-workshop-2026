import type { SlideMeta } from '../types'
import { ImageSlot } from '../components/ImageSlot'
import { Col, Diagram, Lab, Strip } from '../components/layout'
import { PipelineDiagram } from '../components/diagrams/PipelineDiagram'

export const meta: SlideMeta = {
  sec: 'Background',
  dur: 45,
  title: 'How 3D Gaussian Splatting works',
  sub: 'space from many acts of looking, not from one construction',
}

export default function How3dgsWorks() {
  return (
    <>
      <Strip style={{ marginBottom: 20 }}>
        <Col>
          <ImageSlot slot="assets/alberti.jpg" desc="알베르티 원근법 작도, 1435" />
          <Lab>
            Alberti <i>· 1435 · one fixed point</i>
          </Lab>
        </Col>
        <Col>
          <ImageSlot slot="assets/cezanne.jpg" desc="Cézanne, Mont Sainte-Victoire" />
          <Lab>
            Cézanne <i>· 1900s · many separate glances</i>
          </Lab>
        </Col>
        <Col>
          <ImageSlot slot="assets/scan-lake.jpg" desc="voidbox 3DGS 스캔 (호수/저수지 프레임)" />
          <Lab>
            3DGS <i>· 2023 · thousands of them, optimized</i>
          </Lab>
        </Col>
      </Strip>

      <Diagram>
        <PipelineDiagram />
      </Diagram>
    </>
  )
}
