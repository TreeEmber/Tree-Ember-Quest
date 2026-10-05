# Tree & Ember Portal Hub — Final Animation + Portal Handoff

Status: **FINAL ART + FINAL ANIMATION APPROVED — October 5, 2026**

## Canonical Hub media

Final approved source still:
- Drive: `Portal Hub — FINAL APPROVED ART — 2026-10-05.png`
- Drive file ID: `1XjGKmznKKsfpdomsK_PQGGijguXL--CQ`
- Native size: 1024 × 1536 (2:3 portrait)
- Do not substitute an older Hub still.

Final web still:
- Drive: `Portal Hub — FINAL WEB — 2026-10-05.jpg`
- Drive file ID: `1lLV6UpZvfvwrnNkr6ELBTY-hKW9t43Ft`
- GitHub: `assets/portal-hub-final.jpg`
- 704 × 1056 (2:3 portrait)

Final approved animation:
- Drive: `Portal Hub — FINAL FAIRY ANIMATION — 2026-10-05.mp4`
- Drive file ID: `1-n3E6RQydbE--v-MwhW7UpYi59cvR5rX`
- GitHub: `assets/portal-hub-final-fairy.mp4`
- 768 × 1152 (2:3 portrait)
- H.264 MP4, 10 seconds, no audio

## FINAL animation direction — locked

The older Gemini prompt is superseded by the approved finished animation.

Keep this visual direction if the Hub animation is ever revised:
- Camera, architecture, rooms, signs, animals' base positions, and clickable landmarks stay fixed.
- Water and reflections visibly move.
- Lantern/candle light flickers naturally.
- Foliage/fabric, mist, crystal glints, stars, and small environmental details may move gently.
- Fairy magic should **encompass the portal names** for:
  - Wrenwood Nook
  - Living Library
  - Briarbridge Market
  - Tree and Ember Homeschool: Owl's Lessons
  - Ember's Photography
- Avoid comet-style streaks and excessive floating glowing balls.

### Moon Room lock

**DO NOT CHANGE THE MOON ROOM.**

Do not alter its:
- title words
- blue/cyan celestial ring
- moon effect
- color treatment
- motion treatment
- room composition

## Main Hub click destinations

The main Hub contains **SIX clickable portals only**:

1. Wrenwood Nook → `r-nook`
2. The Moon Room → `r-moon`
3. Living Library → `r-library`
4. Briarbridge Market → `r-market`
5. Tree and Ember Homeschool: Owl's Lessons → `r-homeschool`
6. Ember's Photography → `r-photo`

These are **not** separate main-Hub portals:
- Mythical Beasts & Legends
- The Copper Kettle
- Heartwood Lounge & Music Studio

Those belong inside Living Library after the Living Library click.

## FINAL responsive hotspot geometry — actual code values

Percentages are relative to the 2:3 still/video. These are the QA-adjusted values currently in `index.html`.

- Wrenwood Nook: left 7%, top 2%, width 36%, height 23%
- The Moon Room: left 54%, top 2%, width 44%, height 23%
- Living Library: left 0%, top 27.5%, width 56%, height **26.5%**
- Briarbridge Market: left 63%, top 27%, width 36%, height **27%**
- Homeschool / Owl's Lessons: left 0%, top 54.5%, width 47%, height 25%
- Ember's Photography: left 64%, top 71%, width 35%, height 27%

The slightly shorter Library/Market zones prevent overlap with the lower destinations.

Keep the central stairway, bridge, waterfall, and scenic breathing areas non-clickable.

## Web integration rules

- Animation is decorative media under the HTML hotspot layer.
- Video must use `pointer-events:none`; all clicks/touches belong to the HTML hotspot layer.
- Still and video must remain the same 2:3 composition.
- Final still is the poster/fallback.
- `prefers-reduced-motion` hides/pauses the Hub video and leaves the approved still.
- Video is `muted autoplay loop playsinline`.
- Hub video pauses when the Hub route is inactive or the document is hidden.
- Keyboard users can activate each Hub portal with Enter or Space.
- Do not move hotspots to compensate for animation drift; reject any future animation that changes composition.

## QA — October 5, 2026

Verified on staging:
- Exactly six `.hub-hit` elements exist in the Hub section.
- All six target route radio IDs exist.
- All six destination sections exist.
- No Hub `h-return` element remains.
- No Hub `h-music` element remains.
- No Hub `h-beasts` element remains.
- Final hotspot rules are present once and override the obsolete legacy geometry earlier in the historical stylesheet.
- Still: 704 × 1056 = exact 2:3.
- Video: 768 × 1152 = exact 2:3.
- Video is H.264, 10 seconds, no audio.
- Still/video geometry correlation was checked; no crop/aspect mismatch.
- Keyboard activation and live reduced-motion preference handling added in commit `ebb915109169997b45a1ef41044c388817d59b6d`.


- Browser-render QA was executed at 390×844 phone portrait, 844×390 phone landscape, 834×1194 tablet portrait, and 1440×1200 desktop.
- All six portals activated the correct route at every tested size.
- Enter/Space keyboard activation passed.
- No hotspot overlap was detected at any tested size.
- Reduced-motion test passed: video hidden/paused, final still visible.
- Hub video loaded and played with pointer-events disabled.
- Obsolete legacy Hub hotspot CSS was removed in commit `2e88ab87e25e1ef9f6c72dfc54904d6734b23f50`, leaving the final geometry defined once.
- Visual QA montage is archived in Drive as `Portal Hub — INTEGRATED QA MONTAGE — 2026-10-05.jpg` (Drive ID `1kNrmynYSoUxTvr9DQlNq71pO_U3-D2cU`).

## Current GitHub state

Repository: `TreeEmber/Tree-Ember-Quest`  
Branch: `hub-approved-art-staging`  
Latest Hub code cleanup commit: `2e88ab87e25e1ef9f6c72dfc54904d6734b23f50`

Draft PR #2 remains open against `main`.

**Do not merge to main/live until founder visual review of the integrated staging result is complete.**
