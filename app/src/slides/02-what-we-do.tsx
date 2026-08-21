import type { SlideMeta } from '../types'
import { ImageSlot } from '../components/ImageSlot'
import { Body, Cap, Media, Pull, Rule, Split, Text } from '../components/layout'

export const meta: SlideMeta = {
  sec: 'Background',
  dur: 35,
  title: 'What we do, and the question behind it',
}

export default function WhatWeDo() {
  return (
    <Split>
      <Media>
        <ImageSlot
          slot="assets/empty-hall.jpg"
          desc="철거 후 빈 전시장 로비 / 또는 문산초 외관"
        />
        <Cap>The empty Baekyangnuri hall in Yonsei University after the exhibition.</Cap>
      </Media>
      <Body>
        <Text lg style={{ marginBottom: 22 }}>
          We scan buildings and places with 3D Gaussian Splatting, and turn them into spaces you
          can walk through in a web browser.
        </Text>
        <Rule style={{ margin: '20px 0' }} />
        <Pull plain>
          A graduation exhibition lasts only five days.
          <br />
          A neighborhood is redeveloped.
        </Pull>
        <Text style={{ marginTop: 20 }}>
          The digital twin is offered as the way to keep such places. But keep{' '}
          <strong>what</strong> — the space, what happened in it, or the{' '}
          <strong>community</strong> itself?
        </Text>
      </Body>
    </Split>
  )
}
