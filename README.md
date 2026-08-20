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
| [`deck/`](deck/) | The talk itself — a self-contained reveal.js deck with speaker notes |
| [`push-to-github.bat`](push-to-github.bat) | Commit and push whatever changed, on Windows |
| [`presence-before-sync-script.md`](presence-before-sync-script.md) | Reading copy of the script (the deck is the source of truth) |

## Running the deck

Everything needed is committed, including reveal.js and the Pretendard
typeface, so it works with no internet at the venue.

```
cd deck
python serve.py          # or double-click start-presentation.bat on Windows
```

Then `S` for the speaker view, `T` for the pacing clock, `I` for notes on the
current screen. [`deck/README.md`](deck/README.md) has the rest — including how
to edit the speaker notes live from the speaker view, and how to drop images
into their slots.

Opening `deck/index.html` directly also works for a quick look, but the speaker
view and the editing tools need the local server.

## Published slides

**<https://voidbox-ai.github.io/snu-tmu-workshop-2026/>**

GitHub Pages serves the `master` branch from the repository root; the root
redirects to `deck/`. The slides render in full there, and the speaker view
(`S`) works too — so the URL doubles as a backup if the presenting laptop
fails, as long as the venue has network.

Two things are local-only by design, because they need `serve.py` to write
files: editing speaker notes from the speaker view, and the image drop-in page.
Both detect that there is no server and step aside quietly.

---

## 한국어

발표 자료 저장소입니다. `deck/` 안에 reveal.js 덱과 발표자 노트가 모두 들어 있고,
reveal.js와 Pretendard를 함께 커밋해두어 **인터넷 없이 동작**합니다.

- 실행: `deck/start-presentation.bat` 더블클릭 (또는 `python deck/serve.py`)
- 단축키: `S` 발표자 화면 · `T` 타이머 · `I` 노트 · `B` 블랙아웃 · `?` 도움말
- 대본은 발표자 화면에서 직접 고치고 저장할 수 있습니다 (`index.html`에 기록됨)
- 이미지는 `deck/images.html` 에서 끌어다 놓으면 됩니다
- 작업한 내용은 `push-to-github.bat` 더블클릭으로 커밋·push (`master` 브랜치)

자세한 사용법은 [`deck/README.md`](deck/README.md).

## Credits

- [reveal.js](https://revealjs.com) 5.1.0 — MIT
- [Pretendard](https://github.com/orioncactus/pretendard) — SIL Open Font License 1.1
- 3D Gaussian Splatting — Kerbl et al., *3D Gaussian Splatting for Real-Time
  Radiance Field Rendering*, SIGGRAPH 2023
