import type { SlideMeta } from '../types'
import { Pull, Rule, Text } from '../components/layout'

export const meta: SlideMeta = {
  sec: 'Findings',
  dur: 40,
  title: 'Why it held',
}

export default function WhyItHeld() {
  return (
    <>
      <Pull style={{ marginBottom: 26 }}>
        The scan was good enough that going there counted as having gone.
      </Pull>
      <Text lg style={{ marginBottom: 18 }}>
        The feedback came back repeatedly as some version of the same sentence:{' '}
        <em>this is close enough that I don't feel I missed it.</em>
      </Text>
      <Rule />
      <Text>
        Scan quality was the thing we treated as a technical baseline rather than as the product. It
        turned out to be the product.
      </Text>
    </>
  )
}
