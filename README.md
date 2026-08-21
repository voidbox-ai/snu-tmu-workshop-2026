# Presence Before Synchronization

**Rethinking Digital Twins for Community Rebuilding**
Hyeogjin Noh · [voidbox](https://nubim.voidbox.ai) · SNU × TMU Annual Workshop, 2026

A 14-minute talk reporting on two projects: a graduation exhibition run
simultaneously in a physical hall and in a 3D Gaussian Splatting scan of that
hall, and a rural school being remodelled where the same scan became a design
instrument instead of an exhibit.

The short version of the finding: we built a two-way interaction layer to make
the physical and virtual exhibitions behave as one event. Over five days it was
used eleven times, and never once in the virtual → physical direction. What
carried the project instead was something we had treated as a technical
baseline — the scan was good enough that visiting it counted as having gone.
The physical exhibition lived five days; the virtual one is still open.

---

## Contents

| | |
|---|---|
| [`app/`](app/) | **The talk.** reveal.js driven from React + TypeScript, one file per slide |
| [`deck/`](deck/) | The original single-file reveal.js deck, kept frozen as a fallback |
| [`presence-before-sync-script.md`](presence-before-sync-script.md) | Reading copy of the script |

## Running the deck

Everything needed is committed, including reveal.js and the Pretendard
typeface, so it works with no internet at the venue. The one thing that needs
network is the first `npm install` — **do that the day before, not at the venue**.

```
cd app
npm install          # first time only
npm run dev          # or double-click start-presentation.bat on Windows
```

Then `S` for the speaker view, `T` for the pacing clock, `I` for notes on the
current screen. [`app/README.md`](app/README.md) has the rest — how to edit a
slide, how to edit the speaker notes live from the speaker view, and how to drop
images into their slots.

For the presentation itself it is worth building a static copy in advance:

```
npm run build
npm run preview      # dist/ served on localhost:8000
```

The built copy needs no dev server. Slides, speaker view and timer all work;
only note editing and the image drop-in page drop out, and both step aside
quietly when their endpoint is not there.

### If something goes wrong

[`deck/`](deck/) still holds the original hand-written deck, unchanged. It needs
only Python: `deck/start-presentation.bat`. Its content is frozen at the state
it was in before the port — treat it as a last resort, not as a second copy to
keep in step.

## Published slides

**<https://voidbox-ai.github.io/snu-tmu-workshop-2026/>**

Pushing to `master` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds `app/` and publishes it to GitHub Pages, with the old deck alongside
at [`/deck/`](https://voidbox-ai.github.io/snu-tmu-workshop-2026/deck/).

> **One-time setting.** In Settings → Pages → Build and deployment, set
> **Source** to **GitHub Actions**. Until that is switched over, Pages keeps
> serving the branch contents and the workflow's output is ignored.

The slides render in full there, and the speaker view (`S`) works too — so the
URL doubles as a backup if the presenting laptop fails, as long as the venue has
network. Note editing and the image drop-in page are local-only by design; they
need a server that can write files.

---

## 한국어

발표 자료 저장소입니다. 발표는 `app/` 의 React + TypeScript 덱이고, 렌더링은 여전히
reveal.js가 합니다. **슬라이드 한 장 = 파일 한 쌍**이라 고칠 곳을 바로 찾을 수 있습니다.

```
app/src/slides/09-what-the-layer-did.tsx          ← 화면
app/src/slides/09-what-the-layer-did.notes.html   ← 대본
```

- 실행: `app/start-presentation.bat` 더블클릭 (Node.js 필요, 첫 실행은 인터넷 필요)
- 단축키: `S` 발표자 화면 · `T` 타이머 · `I` 노트 · `B` 블랙아웃 · `?` 도움말
- 대본은 발표자 화면에서 직접 고치고 저장할 수 있습니다 (해당 슬라이드 파일에 기록됨)
- 이미지는 <http://localhost:8000/images.html> 에서 끌어다 놓으면 됩니다
- `master` 에 push하면 GitHub Actions가 빌드해서 Pages에 올립니다

자세한 사용법은 [`app/README.md`](app/README.md).
이전 단일 파일 덱은 [`deck/`](deck/) 에 그대로 남아 있습니다 (동결, 비상용).

## Credits

- [reveal.js](https://revealjs.com) 5.1.0 — MIT
- [Pretendard](https://github.com/orioncactus/pretendard) — SIL Open Font License 1.1
- 3D Gaussian Splatting — Kerbl et al., *3D Gaussian Splatting for Real-Time
  Radiance Field Rendering*, SIGGRAPH 2023
