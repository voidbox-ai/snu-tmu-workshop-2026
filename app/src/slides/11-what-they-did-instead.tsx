import type { SlideMeta } from '../types'
import { Rule, Stat, Stats, Text } from '../components/layout'

export const meta: SlideMeta = {
  sec: 'Findings',
  dur: 50,
  title: 'What they did instead',
  sub: 'June 5 – August 20, 2026',
}

export default function WhatTheyDidInstead() {
  return (
    <>
      <Stats>
        <Stat value="813" on>
          unique visitors
        </Stat>
        <Stat value="5,397" on>
          page views
        </Stat>
        <Stat value="6.6" on small>
          pages per visit
          <br />
          <b>— not a bounce</b>
        </Stat>
      </Stats>
      <Rule style={{ marginTop: 38 }} />
      <Text>No interaction feature was involved in any of this. People arrived, and walked around.</Text>
    </>
  )
}
