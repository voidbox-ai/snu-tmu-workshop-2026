# Presence Before Synchronization
### Rethinking Digital Twins for Community Rebuilding

Hyeogjin Noh — CEO, voidbox
SNU × TMU Annual Workshop · 14 min · 21 slides

> **Status:** 트래픽 차트(S14) 데이터 대기 중. 그 외 전 슬라이드 확정.
> **정본은 `deck/index.html`입니다** — 이 파일은 읽기용 사본.

---

## ① QUESTION — 1:00

### S1 — Title (0:10)

> **Presence Before Synchronization**
> Rethinking Digital Twins for Community Rebuilding
>
> Hyeogjin Noh · voidbox

*Name and company only. Do not preview the argument.*

---

### S2 — The question (0:50)

**Visual:** 철거 후 빈 전시장 로비, 또는 문산초 외관

> Places disappear faster than communities can remember them.

**Script**
"A graduation exhibition lasts five days. A school gets remodeled. A neighborhood is redeveloped. In Korea this is not occasional — it is the normal condition.

The digital twin is offered as the answer. Keep the place. But keep *what* about it? The space? Or what happened in it?

Today I want to report on one attempt to answer that. And I should say at the start — most of what I have to report is failure."

---

## ② HOW 3DGS WORKS — 2:00

### S3 — Three ways to build a space out of looking (0:25)

**Visual:** 알베르티 원근법 작도 / 세잔 «Mont Sainte-Victoire» / 3DGS 스캔 — 기존 덱 3분할 재사용

> **Alberti, 1435** — space constructed from a single point.
> **Cézanne, 1900s** — space assembled from many acts of looking.
> **3DGS, 2023** — space optimized from thousands of them.

**Script**
"Cézanne stopped obeying the single vanishing point. He built the mountain out of many separate glances, held together on one canvas. That is almost exactly what our scanning does — so let me show you how."

---

### S4 — The pipeline (0:40)

**Visual:** 파이프라인 다이어그램 (제작 예정)

> **1 · Input** — thousands of photographs; camera positions estimated by structure-from-motion
> **2 · Representation** — millions of translucent 3D ellipsoids: position, shape, opacity, and colour that changes with viewing direction
> **3 · Optimization** — render from a known camera, compare against the real photograph, adjust, repeat

**Script**
"Walk through a space with a camera. The space is decomposed into thousands of images. From those images the system estimates a cloud of translucent ellipsoids — Gaussians. Then it renders that cloud from a camera position it knows, compares the render to the actual photograph, and nudges every ellipsoid to reduce the difference. Millions of times."

---

### S5 — What it does not do (0:30)

> No mesh. No surfaces. No geometry.
>
> 3DGS does not reconstruct what a place is *made of*.
> It reconstructs how a place *looks*.

**Script**
"This is the important difference from photogrammetry or LiDAR, which chase surfaces. There is no model here. Only appearance. Hold onto this — it comes back at the end of the talk."

---

### S6 — The one assumption (0:25)

> **The optimization assumes the scene did not change while you were photographing it.**

*Large type, nothing else on the slide. Say it once and move.*

---

## ③ THE PLAYGROUND — 1:00

### S7 — What the blur is (1:00)

**Visual:** 놀이터 3DGS 스캔 — 번진 인물

**Script**
"This is a playground we scanned. Everything is sharp. The slide, the railing, the paving.

Except this. This is a person. He walked while we were photographing. He violated the assumption — so he was not reconstructed as an object. He was baked into the scene as a smear.

What survives is *that he was there*. What is lost is *where he was*.

And I want to state this as precisely as I can. 3DGS is not merely weak at events. It is good at space **on the condition that events are excluded.**

Now — a community is not geometry. Geometry is only the substrate a community sits on. What makes it a community is **a second layer, laid over the physical one: the events.** People meeting. Someone presenting. Someone stopping in front of a drawing for five minutes.

So if a digital twin is going to hold a community, **a layer of events has to be added on top of the geometry.** Our scan reconstructs the substrate almost perfectly. On its own it cannot carry the layer.

So we decided to build that second layer ourselves. That was our hypothesis, and we built an experiment to test it."

---

## ④ THE EXPERIMENT — 2:00

### S8 — Yonsei Graduation Exhibition 2026 (0:40)

**Visual:** 전시장 실사 + 온라인 전시 스크린샷

> **Yonsei University, Dept. of Architectural Engineering — Graduation Exhibition 2026**
>
> Physical: June 4–8, 2026 · 5 days
> Virtual: opened June 5, 2026 · **still open today**
>
> voidbox × Yonsei Dept. of Architectural Engineering — MOU

---

### S9 — What we built (0:40)

**Visual:** 카드 배치 툴 + 아카이브 사이트 화면

> — 3DGS scan of the exhibition hall
> — A curation tool for placing works inside the scanned space
> — An archive site: navigation, notices, works
> — **An interaction layer: comments, and two-way sync between the physical and the virtual exhibition**

**Script**
"The last one is **the second layer** — our attempt to lay events over the geometry. It is what this talk is about, and it is where most of our design effort went."

---

### S10 — The hypothesis (0:40)

**Visual:** Metaverse / Digital Twin / Space Sync 3분할 다이어그램 (영문화)

> **Metaverse** — an alternative space
> **Digital twin** — a mirror space
> **Space Sync** — causal coupling, in both directions
>
> If the two spaces act on each other, they become one event.
> If they become one event, online and offline participants become one community.

**Script**
"That was the bet."

---

## ⑤ WHAT FAILED — 2:00

### S11 — What happened (0:45)

> **9** comments
> **2** physical → virtual
> **0** virtual → physical
>
> *over five days*

*Say the numbers. Then stop talking for two seconds.*

---

### S12 — Reading it honestly (1:15)

**Script**
"Eleven interactions in total. Across five days, one department, an entire graduating class.

And look at the asymmetry. Two events crossed from the physical side to the virtual one. Zero crossed the other way. The coupling we designed was bidirectional. In practice, one of the two directions never ran at all. The virtual exhibition was never able to act on the physical one. It could only watch.

One caveat, because I want to be accurate: this tells you that *our* interaction layer was not used. It does not prove that interaction is impossible. This is one event, five days, one department.

The honest summary is that **the second layer never formed.** We laid it over the geometry, and it did not take.

But at some point I stopped asking why people didn't use what we built, and started asking what they did instead."

---

## ⑥ WHAT SURVIVED — 2:00

### S13 — The other numbers (0:40)

> **813** unique visitors
> **5,397** page views
> **6.6** pages per visit

**Script**
"6.6 pages per visit is not a bounce. People arrived and wandered."

---

### S14 — Five days versus seventy-seven (0:45)

**Visual:** ⚠️ 일별 트래픽 차트 — **데이터 대기 중**

> Physical exhibition: **5 days**
> Virtual exhibition: **77 days and counting** — fifteen times longer

**Script**
"The physical exhibition was dismantled in June. The virtual one is open right now, while I am standing here."

---

### S15 — Why (0:35)

> Not because of interaction.
> Because the scan was good enough that going there **counted as having gone**.

**Script**
"The feedback came back, repeatedly, in some version of: this is close enough that I don't feel I missed it.

That is the one thing we did not design for. And it is the only thing that worked."

---

## ⑦ LESSONS — 1:00

### S16 — Three lessons (1:00)

> **1 · Presence before synchronization.**
> We optimized the coupling. What carried the project was the fidelity of simply being there.
>
> **2 · We measured the wrong thing.**
> We built metrics for interaction. The metric that mattered was how long the space stayed open.
>
> **3 · Not simultaneity, but asynchrony.**
> Nobody wanted to be in two places at once. They wanted to be in one place, later.

**Script** — *deliver fast, one breath each*
"One. Presence before synchronization.

Two. We measured the wrong thing. And here is the sharpest version of that: I can tell you exactly how many people visited the virtual exhibition. Eight hundred and thirteen. I cannot tell you how many visited the physical one. We never counted. That asymmetry is what a digital twin actually gives you — it makes presence countable. It is also the trap, because countable is not the same as meaningful.

Three. Not simultaneity, but asynchrony. What joined the online and the offline participants was not shared time. It was a shared place that stayed open."

---

## ⑧ MUNSAN — 2:10

### S17 — A different question (0:15)

> If what we actually deliver is presence — who else needs it?

**Script**
"Our answer, for now, is not an audience."

---

### S18 — Munsan Elementary School (0:40)

**Visual:** 문산초 3DGS 스캔

> **Munsan Elementary School** — Seocheon-gun, Chungcheongnam-do
>
> A rural region losing population. A small school to be converted and extended as a special-education school. An open design competition.

**Script**
"Let me be honest about this one. It is not a community-building case study. It is what we did with the finding."

---

### S19 — The twin as an instrument (0:45)

**Visual:** 스캔 위에 설계안 오버레이한 화면

> — **Existing-condition survey** — the scan stands in for measuring a building whose drawings are old or incomplete
> — **Design review** — our proposal is overlaid onto the scan and judged *inside* the existing place, not against an abstracted model

**Script**
"The user of the twin here is not a visitor. It is the designer. Same capability, different consumer."

---

### S20 — And the same thing is happening again (0:30)

> The scan will outlive the school's current state.
>
> *Limitation: Gaussians are appearance, not geometry — they cannot be dimensioned directly.*
> *Competition result pending.*

**Script**
"At Yonsei that was an accident. Here it is deliberate. This building is about to be rebuilt for its community, and the scan is the last full record of what it was before.

Designing in the presence of what is actually there is a different posture from designing on a cleared model."

---

## ⑨ CLOSE — 0:45

### S21 — Close (0:45)

**Visual:** 놀이터 번짐 이미지 (S7 재등장)

> We spent a long time trying to remove this blur.
> I now think it is the part worth keeping.

**Script**
"Presence before synchronization. Thank you."

---

### S22 — Optional: open questions for discussion

> — Can two spaces be one event — and does anyone actually want them to be?
> — What would it take for an archive to become a place where events continue, rather than a monument?
> — If a twin makes presence countable, what does it make invisible?

---

## BACKUP SLIDES (Q&A only)

- **B1** — Husserl's *Abschattung* ↔ 3DGS 대응표 (기존 덱 재사용, 영문화)
- **B2** — Borges, *Del rigor en la ciencia* — the 1:1 map
- **B3** — nubim.voidbox.ai 서비스 구조 / 가격 정책
- **B4** — 3DGS vs photogrammetry vs LiDAR 기술 비교

---

## TIMING CHECK

| | Section | Target | Script |
|---|---|---|---|
| ① | Question | 1:00 | 1:00 |
| ② | 3DGS | 2:00 | 2:00 |
| ③ | Playground | 1:00 | 1:00 |
| ④ | Yonsei | 2:00 | 2:00 |
| ⑤ | What failed | 2:00 | 2:00 |
| ⑥ | What survived | 2:00 | 2:00 |
| ⑦ | Lessons | 1:00 | 1:00 |
| ⑧ | Munsan | 2:00 | 2:10 |
| ⑨ | Close | 1:00 | 0:45 |
| | **Total** | **14:00** | **13:55** |

---

## OPEN ITEMS

1. **일별/주별 트래픽 데이터** → S14 차트. 필요 형식: `date, unique_visitors, pageviews`
2. **참여 학생·작품 수** → S13에서 813과 대비시킬 앵커 (선택)
3. **문산초 스캔 이미지 / 설계안 오버레이 화면** → S18, S19
4. **철거 후 빈 전시장 사진** → S2 (있으면 도입부가 훨씬 강해짐)
