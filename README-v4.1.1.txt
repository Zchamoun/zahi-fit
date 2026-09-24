ZAHI FIT v4.1.1 — VOICE FIX

FIXES
- "Talk me through it" now waits for the natural voice instead of switching to the phone voice
  when a step takes a few seconds to prepare (German steps are translated first, so they take
  longest the first time). The button shows "Preparing voice…" while it waits.
- All five steps of an exercise are prepared in the background as soon as the guide opens,
  so narration flows from step to step.
- Each clip is downloaded only once, even if two parts of the app ask for it at the same time.
- If the natural voice genuinely can't be reached, a short message now says the phone voice is
  being used, instead of switching silently.
- Clearer note under "Phone voice" about what it can and can't do.

UPLOAD (repository root, commit to main)
Replace: app.js, sw.js
Add:     README-v4.1.1.txt
No Cloudflare changes. index.html is unchanged from v4.1.0.

AFTER UPLOAD
Open Zahi Fit, tap Update on the banner. Profile > bottom shows 4.1.1.
Profile > Voice & sound > Voice quality: choose NATURAL.
