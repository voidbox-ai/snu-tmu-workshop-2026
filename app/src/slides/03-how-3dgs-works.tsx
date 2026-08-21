import type { SlideMeta } from '../types'
import { ImageSlot } from '../components/ImageSlot'
import { Body, Cap, Diagram, Pic, Plate, Pull, Text } from '../components/layout'
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
      <Plate style={{ marginBottom: 26 }}>
        <Pic>
          <ImageSlot slot="assets/cezanne.jpg" desc="Cézanne, Mont Sainte-Victoire" />
          <Cap>
            Cézanne, <i>Mont Sainte-Victoire</i> — one mountain, held on one canvas as many
            separate glances.
          </Cap>
        </Pic>
        <Body>
          <Pull>
            Photograph one object from many directions, and its three-dimensional form can be
            estimated.
          </Pull>
          <Text style={{ marginTop: 18 }}>
            Not a space constructed from a single fixed viewpoint, but one optimized out of
            thousands of separate looks.
          </Text>
        </Body>
      </Plate>

      <Diagram>
        <PipelineDiagram />
      </Diagram>
    </>
  )
}
