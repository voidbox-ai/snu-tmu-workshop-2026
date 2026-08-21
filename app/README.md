# Presence Before Synchronization — React + TypeScript

SNU × TMU Annual Workshop · 19 슬라이드 + 백업 4장 · 13:35 계획 · reveal.js 5.1.0

발표 엔진은 **그대로 reveal.js**입니다. 바뀐 것은 슬라이드를 담는 방식뿐입니다 —
44KB짜리 `index.html` 하나였던 것이 슬라이드 한 장에 파일 한 쌍으로 갈라졌습니다.

```
src/slides/09-what-the-layer-did.tsx          ← 이 슬라이드의 화면
src/slides/09-what-the-layer-did.notes.html   ← 이 슬라이드의 대본
```

**인터넷 없이 동작합니다.** reveal.js와 Pretendard가 저장소에 함께 들어 있어
발표장 와이파이가 죽어도, 노트북에 폰트가 안 깔려 있어도 상관없습니다.
다만 처음 한 번은 `npm install`이 필요하니 **발표 전날 미리 실행해 두세요**.

---

## 실행

### 발표용 — cmd 에서

```
cd /d D:\voidbox-snu-tmu-workshop\app
npm install     :: 첫 실행 한 번만 (인터넷 필요)
npm run dev
```

<http://localhost:8000/> 이 열립니다. **발표자 화면(S)과 대본 편집을 쓰려면
이 방법으로 실행하세요.** 멈출 때는 `Ctrl+C`.

### 발표 당일 안전망 — 미리 빌드해두기

```
npm run build      # dist/ 생성
npm run preview    # dist/ 를 localhost:8000 에 서빙
```

빌드된 사본은 dev 서버 없이도 슬라이드·발표자 화면·타이머가 모두 동작합니다.
대본 편집과 이미지 넣기만 빠집니다 (저장할 서버가 없으므로 버튼이 스스로 사라집니다).

`deck/` 폴더의 예전 reveal.js 덱도 그대로 남아 있습니다. 무슨 일이 생기면
`deck/start-presentation.bat` 이 마지막 안전망입니다.

---

## 슬라이드 고치기

한 장을 고치려면 그 장의 `.tsx` 파일만 열면 됩니다. 저장하는 순간 브라우저에 반영됩니다.

```tsx
export const meta: SlideMeta = {
  sec: 'Findings',   // 상단 인덱스 바 구간 (deck.config.ts 에서 문장으로 변환)
  dur: 40,           // 계획 시간(초) — 페이스 표시줄이 이 값들로 만들어집니다
  title: 'What the interaction layer actually did',
  sub: 'five days, one department, one graduating class',
}

export default function WhatTheLayerDid() {
  return ( /* 이 슬라이드에만 있는 내용 */ )
}
```

상단 인덱스 바·제목·본문 래퍼·노트 블록은 `components/SlideSection.tsx` 가 `meta` 로부터
자동으로 만듭니다. 슬라이드 파일에는 그 장에만 있는 내용만 씁니다.

**슬라이드 추가**: `NN-이름.tsx` 와 `NN-이름.notes.html` 을 만들면 끝입니다.
파일명 앞 숫자가 순서이고, 목록을 따로 관리하는 곳은 없습니다 (`slides/registry.ts`).

**순서 변경**: 번호를 바꿔 이름을 바꾸면 됩니다.

**구간 문장 변경**: `src/deck.config.ts` 의 `SECTION_LABELS` 한 곳만 고칩니다.

**백업 슬라이드**: `meta` 에 `uncounted: true` 를 넣으면 슬라이드 번호와 시간 계산에서 빠집니다.

### 자주 쓰는 조각

`components/layout.tsx` 에 있는 것들 — `Split`/`Media`/`Body`, `Plate`/`Pic`, `Duo`, `Strip`,
`Stats`/`Stat`, `Lessons`/`Lesson`, `Pull`, `List`, `Rule`, `Text`, `Note`, `Diagram`. deck.css 의 클래스에
이름을 붙인 얇은 껍데기라, 슬라이드 파일이 div 더미가 아니라 구조로 읽힙니다.

도판은 `<ImageSlot slot="assets/x.jpg" desc="어떤 사진인지" />`. 파일이 아직 없으면
**파일 경로와 설명이 적힌 점선 자리표시자**로 대체되므로, 사진 없이도 발표가 됩니다.

영상은 `<VideoSlot slot="assets/x.mp4" poster="assets/x.jpg" desc="…" />`.
슬라이드에 들어오면 **자동으로 재생되고 나가면 멈춥니다** (무음·루프, reveal이 처리).
**영상 → 포스터 스틸 → 점선 자리표시자** 순으로 물러나므로 mp4가 아직 없어도 발표가 됩니다.
지금은 슬라이드 4(놀이터 스캔)가 이 방식입니다 — `public/assets/playground.mp4` 를 넣으면
영상으로, 없으면 지금처럼 `playground.jpg` 로 나옵니다.

---

## 발표자 화면에서 대본 고치기

`S` 로 발표자 화면을 연 뒤 **NOTES 오른쪽의 `Edit`** 을 누르면 그 슬라이드의 대본이
편집 가능한 텍스트로 바뀝니다. `Save`(또는 `Ctrl+S`)를 누르면 **그 슬라이드의
`.notes.html` 파일에 바로 기록**되고, 화면은 새로고침 없이 갱신됩니다.

- 빈 줄 = 문단 나눔 · `[대괄호 문단]` = 연출 지시 · `*기울임*` · `**굵게**`
- `Raw HTML` 버튼으로 태그 직접 편집 · `Esc` 취소 · `Ctrl+S` 저장
- 저장할 때마다 직전 내용이 `.backups/` 에 슬라이드별로 40개까지 보관됩니다
- 편집 중 슬라이드를 넘겨도 내용은 유지되고, 저장은 **편집을 시작한 슬라이드**로 갑니다

빌드된 사본에는 저장 엔드포인트가 없으므로 `Edit` 버튼이 조용히 사라집니다.

---

## 이미지 넣기

dev 서버를 띄운 뒤 **<http://localhost:8000/images.html>** 을 엽니다. 10개 칸에
**사진을 끌어다 놓기만 하면** 슬라이드가 찾는 이름으로 저장됩니다.

칸 목록은 `src/slides/*.tsx` 의 `<ImageSlot>` 에서 직접 읽어오므로, 슬라이드에 도판을
추가하면 이 페이지에도 자동으로 나타납니다.

- 큰 사진은 브라우저에서 긴 변 2400px으로 줄여 올립니다 (`원본` 버튼으로 무시)
- 교체·삭제된 사진은 `public/assets/_replaced/` 로 옮겨집니다 (지워지지 않습니다)
- 아직 어디 쓸지 안 정한 사진은 `public/assets/_pool/` 에 통째로 복사해 넣고 새로고침
- iPhone HEIC는 브라우저가 못 읽어 거부됩니다 — JPEG로 내보내 주세요

**영상은 이 페이지로 못 넣습니다.** `public/assets/` 에 직접 복사하세요.
H.264 mp4를 쓰고(브라우저가 가장 확실하게 재생합니다), **GitHub 파일당 100MB 제한**이
있으니 필요한 구간만 잘라 압축해 주세요. 포스터 스틸은 이 페이지에서 그대로 넣으면 됩니다.

가장 급한 두 장은 `playground.jpg`(슬라이드 4·19)와 `munsan-overlay.jpg`(슬라이드 17)입니다.

---

## 키

| 키 | 기능 |
|---|---|
| `→` `←` `Space` `N` `P` | 슬라이드 이동 |
| **`S`** | **발표자 화면** — 현재/다음 슬라이드, 노트, 타이머 |
| **`T`** | 페이스 표시줄 켜기/끄기 |
| **`I`** | 발표자 노트를 이 화면 오른쪽에 표시 (모니터 하나뿐일 때) |
| `R` | 타이머 리셋 |
| `B` 또는 `.` | 화면 블랙아웃 |
| `ESC` | 슬라이드 전체 보기 |
| `?` | 단축키 안내 |

> 노트는 `N`이 아니라 **`I`** 입니다 — `N`은 reveal의 "다음 슬라이드"라서 겹칩니다.

`S`를 누르면 메인 창은 관객용 스크린이 되고, 페이스 표시줄·노트 패널·단축키 바가
자동으로 사라집니다. 타이머는 **첫 슬라이드를 넘기는 순간** 시작합니다.

페이스 표시줄 읽는 법:

```
04:12   +0:18 behind   Findings · 14/19 · plan 13:35
```

경과 시간 / 이 슬라이드에 도착했어야 할 시각 대비 지연 (초록 = 여유, 빨강 = 20초 이상 지연) /
현재 구간 · 슬라이드 번호 · 전체 계획.

---

## 구성

| 구간 | 상단에 표시되는 문장 | 슬라이드 | 시간 |
|---|---|---|---|
| Background | Background | 1–4 | 2:00 |
| Yonsei | Case 1 — one exhibition, run in two places at once | 5–8 | 2:30 |
| Findings | What failed, what survived, and what we take from it | 9–14 | 4:45 |
| Munsan | Case 2 — the same scan, a different user | 15–18 | 2:45 |
| Next | Next | 19 | 0:35 |

본편은 19번 "Where this leaves us" 에서 끝납니다.

그 뒤 **백업 4장**(For discussion / Husserl / Borges / Archive–Repertoire)은
슬라이드 번호와 타이머에서 제외되어 있습니다. Q&A 때만 넘겨서 쓰면 되고,
그냥 두면 발표는 19번에서 마무리됩니다.

## 파일

```
app/
├── index.html                  Vite 진입점 — reveal.js / notes.js 를 <script> 로 로드
├── vite.config.ts              base './' (어느 경로에 올려도 동작) + dev API 플러그인
├── tsconfig.json
├── package.json                npm run dev / build / preview / typecheck
│
├── src/
│   ├── main.tsx                React 마운트
│   ├── App.tsx                 슬라이드 목록 렌더 + 발표자 UI 상태
│   ├── deck.config.ts          구간 문장(SECTION_LABELS), 무대 크기 1600×900
│   ├── types.ts                SlideMeta — 슬라이드가 자기 자신에 대해 선언하는 것
│   ├── reveal.d.ts             벤더링된 reveal.js 타입 선언
│   │
│   ├── slides/                 ★ 슬라이드 한 장 = 파일 한 쌍
│   │   ├── registry.ts                      파일명으로 순서·시간표를 자동 구성
│   │   ├── 01-title.tsx                     화면
│   │   ├── 01-title.notes.html              대본
│   │   ├── 02-what-we-do.tsx  ·  .notes.html
│   │   ├── …                                (03 – 19, 같은 규칙)
│   │   ├── 20-backup-for-discussion.*       ┐
│   │   ├── 21-backup-husserl.*              ├ 백업 4장
│   │   ├── 22-backup-borges.*               │ (번호·타이머에서 제외)
│   │   └── 23-backup-archive-repertoire.*   ┘
│   │
│   ├── components/
│   │   ├── SlideSection.tsx    상단 인덱스 바 + 제목 + 본문 래퍼 + 노트 블록
│   │   ├── layout.tsx          Split · Duo · Strip · Stats · Lessons · Pull · List …
│   │   ├── ImageSlot.tsx       도판 — 파일이 없으면 점선 자리표시자로 대체
│   │   ├── VideoSlot.tsx       영상 — 자동재생·무음·루프, 없으면 포스터로 후퇴
│   │   ├── PaceBar.tsx         왼쪽 아래 페이스 표시줄 (T)
│   │   ├── NotesOverlay.tsx    화면 내 노트 패널 (I)
│   │   ├── HelpBar.tsx         단축키 바 (?)
│   │   └── diagrams/
│   │       ├── PipelineDiagram.tsx   슬라이드 3 — 3DGS 파이프라인
│   │       ├── CouplingDiagram.tsx   슬라이드 8 — 메타버스 / 디지털 트윈 / Space Sync
│   │       └── TimelineDiagram.tsx   슬라이드 12 — 오늘 날짜로 계산되는 타임라인
│   │
│   ├── hooks/
│   │   ├── useReveal.ts        reveal 초기화 · 키 바인딩 · 현재 슬라이드 · 타이머 시작
│   │   ├── useLiveNotes.ts     발표자 화면에서 저장한 대본을 새로고침 없이 반영
│   │   └── useSpeakerView.ts   발표자 화면 연결 감지 (하트비트)
│   │
│   ├── styles/deck.css         테마 (원본 그대로)
│   └── assets/fonts/           Pretendard Variable (동봉 — 설치 불필요)
│
├── server/
│   └── deck-api.ts             dev 전용 API — 구 serve.py
│                               /api/notes · /api/assets · /api/pool
│
├── public/                     빌드할 때 그대로 복사되는 것들
│   ├── reveal/                 reveal.js 5.1.0 (오프라인 동봉, 발표자 화면 패치본)
│   ├── assets/                 ★ 이미지가 들어가는 곳
│   │   ├── _pool/              아직 어느 칸에 넣을지 안 정한 사진
│   │   └── _replaced/          교체·삭제된 사진 보관 (자동 · git 제외)
│   └── images.html             이미지 넣기 페이지
│
├── .backups/                   대본 저장 시마다 자동 생성 (git 제외)
├── dist/                       빌드 결과 (git 제외)
└── node_modules/               (git 제외)
```

> reveal.js는 발표자 화면 HTML을 `notes.js` 안에 문자열로 품고 있습니다.
> `public/reveal/plugin/notes/speaker-view.html` 을 고친 뒤에는
> `deck/build-speaker-view.py` 를 돌려 다시 심어야 반영됩니다.

## PDF로 뽑기

`npm run build && npm run preview` 후 <http://localhost:8000/?print-pdf> 을 열고
인쇄 → PDF로 저장. 용지 가로, 배경 그래픽 켜기.

## 배포

`master` 에 push하면 `.github/workflows/deploy.yml` 이 이 앱을 빌드해
GitHub Pages에 올립니다. 예전 덱은 `/deck/` 경로에 함께 올라갑니다.

**저장소 설정 한 번**: Settings → Pages → Build and deployment → Source 를
**GitHub Actions** 로 바꿔야 합니다. 그전까지는 예전 브랜치 내용이 계속 서빙됩니다.
