# Tree & Ember Portal Hub — Final Animation + Portal Handoff

Status: FINAL ART APPROVED — October 5, 2026

Canonical still:
- Drive: `Portal Hub — FINAL APPROVED ART — 2026-10-05.png`
- Drive file ID: `1XjGKmznKKsfpdomsK_PQGGijguXL--CQ`
- Native size: 1024 × 1536 (2:3 portrait)
- Do not substitute an older Hub still.

## Gemini image-to-video prompt

Use the supplied final Tree & Ember Portal Hub still as the exact first-frame/reference image.

ANIMATE THIS IMAGE ONLY. DO NOT REDESIGN OR RECOMPOSE IT.

Keep the camera completely locked. No zoom, pan, tilt, dolly, parallax, reframing, crop, perspective shift, or camera shake. Preserve the exact 2:3 portrait composition, every room position, every staircase, bridge, root, waterfall, sign, animal, object, and clickable landmark.

Preserve every visible title exactly and keep all lettering readable in every frame:
- Wrenwood Nook
- The Moon Room
- Living Library
- Briarbridge Market
- Tree and Ember Homeschool: Owl's Lessons
- Ember's Photography

The Moon Room title words must remain warm cream/gold like the other destination titles. The Moon Room's blue/cyan celestial rune ring must remain blue/cyan and must not rotate, warp, or change shape.

Add only restrained environmental life:
- lantern and candle flames gently flicker
- tiny warm light shimmer on nearby wood and glass
- waterfall and stream flow softly in place
- very slight movement in hanging wisteria, ivy, leaves, and market fabric as if from a faint breeze
- a few fireflies/magical motes drift slowly
- crystals give occasional subtle glints, not pulsing neon
- stars in the Moon Room twinkle very lightly
- animals remain in their exact locations and may only make tiny natural motions such as blinking, breathing, a small ear twitch, or a gentle tail flick
- no animal walks away, changes species, multiplies, disappears, or changes position

The overall feeling should be alive, magical, cozy, calm, and inhabited — not busy.

ABSOLUTELY DO NOT:
- alter, rewrite, morph, misspell, blur, or animate the sign text
- add or remove rooms, signs, animals, furniture, plants, paths, bridges, stairs, crystals, or props
- change the color palette or lighting design
- move the destination signs
- rotate or animate the Moon Room rune ring
- create new people or characters
- transform objects between frames
- make the tree breathe, bend, swell, or morph
- introduce large particle effects
- create rapid movement
- use cinematic camera motion

Make the first and last frames visually near-identical so the clip can loop cleanly.

Preferred duration: 6–8 seconds.
Preferred motion level: subtle / restrained.
Audio: none.
Output: preserve the original portrait framing; do not crop the artwork.

## Main Hub click destinations

The main Hub contains SIX clickable portals only:

1. Wrenwood Nook → `r-nook`
2. The Moon Room → `r-moon`
3. Living Library → `r-library`
4. Briarbridge Market → `r-market`
5. Tree and Ember Homeschool: Owl's Lessons → `r-homeschool`
6. Ember's Photography → `r-photo`

These are NOT separate main-Hub portals:
- Mythical Beasts & Legends
- The Copper Kettle
- Heartwood Lounge & Music Studio

Those live inside Living Library after the Living Library click.

## Final responsive hotspot geometry

Percentages are relative to the final 1024 × 1536 still/video so alignment survives responsive scaling.

- Wrenwood Nook: left 7%, top 2%, width 36%, height 23%
- The Moon Room: left 54%, top 2%, width 44%, height 23%
- Living Library: left 0%, top 27.5%, width 56%, height 30%
- Briarbridge Market: left 63%, top 27%, width 36%, height 28%
- Homeschool / Owl's Lessons: left 0%, top 54.5%, width 47%, height 25%
- Ember's Photography: left 64%, top 71%, width 35%, height 27%

Keep the central stairway, bridge, waterfall, and open scenic areas non-clickable.

## Web integration rules

- The animation is decorative media under the HTML hotspot layer; the video itself must not capture pointer/touch events.
- Keep the exact hotspot percentages above for both the final still and final animation.
- Use the final still as the video poster/fallback.
- Respect `prefers-reduced-motion`: reduced-motion users should see the accepted final still instead of autoplay animation.
- Video should be `muted autoplay loop playsinline`.
- Never bake click behavior into the video itself.
- Do not move hotspot geometry to follow Gemini drift. If Gemini changes the composition, reject that animation and regenerate it.
- Before merge, test all six portals on phone portrait, phone landscape, tablet, and desktop.
- Confirm sign text remains readable at mobile width.

## Current GitHub state

Branch: `hub-approved-art-staging`

The six clickable hotspot labels and final percentage geometry are already wired in `index.html`.

The final still/video binaries must be placed in the repository before publication. Do not merge the Hub PR until the final media is present and visual hotspot QA passes.
