import type { SlideMeta } from '../types'
import { Rule, Stat, Stats, Text } from '../components/layout'

export const meta: SlideMeta = {
  sec: 'Findings',
  dur: 40,
  title: 'What the interaction layer actually did',
  sub: 'five days, one department, one graduating class',
}

/* Left column is the hall, right column is online — the same two sides as the
   two directions on slide 7, held in the same position down the slide.
   Nothing here carries the accent: the deck's one color belongs to what
   survived, and none of these numbers did. */
export default function WhatTheLayerDid() {
  return (
    <>
      <Stats pair>
        <Stat value="uncountable" word>
          comments
          <br />
          <b>offline, in the hall</b>
        </Stat>
        <Stat value="9">
          comments
          <br />
          <b>online</b>
        </Stat>
      </Stats>

      <Rule style={{ margin: '34px 0' }} />

      <Stats pair>
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

      <Rule style={{ marginTop: 34 }} />
      <Text>
        Eleven interactions in total on the layer we built. For the paper guestbook in the hall we
        have no number at all.
      </Text>
    </>
  )
}
