# Tree & Ember — Portal Landing Lock

Status: **STAGING LOCKDOWN COMPLETE — founder review required before merge**

Branch: `portal-landing-lockdown`

## Locked entrance sequence

1. **Briarlight Gate** — `assets/page1-briarlight-gate.mp4`
2. **Forest Journey** — `assets/page2-forest-journey.mp4`
3. **Portal Hub** — current approved production Hub

The Hub itself is not redesigned or altered by this landing lock.

## Page 1 — Briarlight Gate

- Source video remains unchanged.
- Video is muted and plays inline.
- JavaScript controls playback instead of the HTML `autoplay` attribute so reduced-motion preferences cannot be bypassed.
- Main invisible Enter hotspot remains aligned to the approved Gate sign:
  - desktop/landscape: left 31%, top 17%, width 38%, height 31%
  - narrow portrait: left 28%, top 18%, width 44%, height 32%
- Visible **Skip Journey** control remains available.
- Enter/Space keyboard activation works on both the Enter hotspot and Skip Journey.
- Normal video completion advances to Forest Journey.
- Video load/playback error falls forward to Forest Journey instead of trapping the visitor on a broken black screen.

## Page 2 — Forest Journey

- Source video remains unchanged.
- Playback speed remains **1.5×**.
- Video is muted and plays inline.
- Initial preload is metadata only to reduce front-door bandwidth.
- Entire Journey viewport remains the approved skip/continue interaction layer.
- Enter/Space keyboard activation works.
- Normal completion advances automatically to the Portal Hub.
- Video error falls forward to the Portal Hub.
- Reduced-motion users remain on a paused frame and can explicitly continue.

## Reduced motion

`prefers-reduced-motion: reduce` is checked dynamically.

- Page 1 does not autoplay.
- Page 2 does not autoplay.
- Changing the preference while the page is open immediately updates playback behavior.
- The visitor can still navigate Gate → Journey → Hub using the existing controls.

## Background / visibility behavior

When the page/app is backgrounded:
- entrance videos pause.

When the page/app returns:
- the active entrance video resumes from its current point instead of restarting from 0.

A route change back into Gate or Journey intentionally resets that route's video to the beginning.

## Accessibility

- Entrance videos are decorative to assistive technology with `aria-hidden="true"`.
- Gate Enter, Skip Journey, and Forest Journey continue layers have explicit button roles and keyboard support.
- Existing focus-visible outlines remain.
- The Portal Hub's previously approved keyboard/reduced-motion behavior is unchanged.

## QA

Browser interaction harness passed:

### Normal motion
- Gate video plays.
- Enter key on Gate routes to Forest Journey.
- Forest Journey plays at 1.5×.
- Space on Journey routes to Hub.
- Natural video endings route Gate → Journey → Hub automatically.

### Reduced motion
- Gate video remains paused.
- Enter still routes to Journey.
- Journey remains paused.
- Space still routes to Hub.

### Responsive interaction geometry
Tested:
- 390×844 phone portrait
- 844×390 phone landscape
- 834×1194 tablet portrait
- 1440×1200 desktop

Gate Enter hotspot and Skip Journey did not overlap at any tested size.

## Commits

- `44ca9f9a426df0ac1b074512c2ce6d9b19df0225` — Lock Portal Landing entrance flow
- `0f8b0959f497c675160af9a40988ec1d520e18bc` — Make Portal Landing styles authoritative

## Merge gate

Do not merge this branch until founder review/approval.

After approval:
1. merge to `main`
2. verify GitHub Pages deployment succeeds
3. verify production source still contains the two approved entrance videos and the final Hub assets
4. update Drive master records to production baseline
