import type { SlideMeta } from '../types'
import { Rule, Stat, Stats, Text } from '../components/layout'

export const meta: SlideMeta = {
  sec: 'Findings',
  dur: 40,
  title: 'What the interaction layer actually did',
  sub: 'five days, one department, one graduating class',
}

/* The failure numbers deliberately carry no accent: the deck's one colour is
   reserved for the side that survived. Colour on both would blur the point. */
export default function WhatTheLayerDid() {
  return (
    <>
      <Stats>
        <Stat value="9">comments</Stat>
        <Stat value="2">
          syncs
          <br />
          <b>physical → virtual</b>
        </Stat>
        <Stat value="0">
          syncs
          <br />
          <b>virtual → physical</b>
        </Stat>
      </Stats>
      <Rule style={{ marginTop: 38 }} />
      <Text>Eleven interactions in total.</Text>
    </>
  )
}
