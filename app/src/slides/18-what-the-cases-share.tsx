import type { SlideMeta } from '../types'
import { Note, Pull, Rule, Text } from '../components/layout'

export const meta: SlideMeta = {
  sec: 'Munsan',
  dur: 35,
  title: 'What the two cases share',
}

export default function WhatTheCasesShare() {
  return (
    <>
      <Pull style={{ marginBottom: 26 }}>The scan will outlive the school's current state.</Pull>
      <Text lg style={{ marginBottom: 20 }}>
        At Yonsei that was an accident — we found it out afterwards. Here it is deliberate. This
        building is about to be rebuilt for its community, and the scan is the last full record of
        what it was before. Which is also a different posture toward the existing than designing on a
        cleared model.
      </Text>
      <Rule />
      <Note>Competition result pending.</Note>
    </>
  )
}
