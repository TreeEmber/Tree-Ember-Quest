# Gemini Hub animation candidate — private review

Uploaded reference: Gemini 10s Hub animation provided by the founder, saved privately in Drive as file `1GprFR5WENVLb8FR1hV9ZRBlCyZE1b1hk`. Public share URL was unavailable to fetch; the user-uploaded MP4 was inspected directly.

Original: 512×910, 30 fps, 10 seconds, H.264 with AAC. The web candidate is soundless H.264 (~1.9 MB) plus a matched JPEG first-frame poster (~0.2 MB). Both preserve the original visual canvas and title signs.

The candidate restores the **approved October 5 six-room arrangement** (Wrenwood Nook upper left, Moon Room upper right, Living Library middle left, The Oaken Emporium middle right, Owl's Lessons lower left, Ember's Photography lower right). This differs from the previous Hub still/animation currently on main. It uses sparkling lights, some moving creatures and soft environmental motion; water itself is mostly static.

Do not force this 512×910 recording into the old 2:3 poster geometry, which would crop or misalign clickable regions. Stage a matched 9:16 image/video with adjusted six transparent hotspot zones and test at multiple screen sizes and reduced-motion.

Original approved Oct 5 Hub art and the current production video must remain recoverable. Do not merge until preview QA and founder visual acceptance. No sales/registrations are opened in this change.

## November 17, 2026 — calmer repeat loop (private only)

After reviewing the founder-uploaded original `gemini_generated_video_DEC3C650.mp4` directly, frame samples at 0/1.5/3/4.5/6/7.5/9.97 seconds confirmed that the moving, bright fairy trail traverses the scene, but the end of the video still contains active sparkles. The first and last frames therefore make a noticeable playback jump. Source MP4 measured 512×910, 30fps, 300 frames, 10.0s with AAC audio; **the original is preserved unchanged** in Drive.

Created an additional **separate** candidate `assets/portal-hub-gemini-softloop.mp4`: 512×910, H.264, 30fps, 10.0s, **silent**, ~2.76 MB. A luminosity/chroma-difference mask softens only newly appearing bright nearly-white sparkles relative to the first frame. During approximately the final two seconds, frames gently transition back to the opening image and settle there to improve wrap continuity. Original soundtrack remains excluded; no camera zoom or sign movement was introduced. The existing `portal-hub-gemini-ambient.mp4` is retained as the unmodified earlier web candidate.

Loop QA from decoded samples: original source mean absolute pixel difference between frame 299 and frame 0 approximately **8.1** at 256×455; revised candidate at full 512×910 approximately **3.24** (different decode resolutions, so these are useful relative indicators rather than a laboratory-controlled direct A/B). End-of-clip last adjacent frames were visually stable. This **improves but does not perfect** looping; a gradual sparkle fade-out remains part of the presentation. Saved the revised MP4 and a matching poster to private Hub Drive folder: [revised animation](https://drive.google.com/file/d/1zn5eErEhsRDDfukDyaq3K1t1jeqoNq19/view), [poster](https://drive.google.com/file/d/18YHG-f_pauMVDxfaN3tXCZGX44Of_vMC/view).

Private draft index and browser QA now reference the new video. The poster in code remains the correctly matched original 512×910 first-frame image; only the animation path changed, and the previous video and existing public Hub remain untouched. Full physical iPhone Safari, VoiceOver, visual preference approval and exact hosted playback have **not** been verified. Do not treat successful code/CI checks as release approval; no public merge authorized by this review.
