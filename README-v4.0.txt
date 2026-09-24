ZAHI FIT v4.0.0 — REDESIGN + PHOTO TECHNIQUE GUIDES

WHAT'S NEW
- New light look: teal and orange on bright surfaces, rounded Nunito type, big condensed numbers.
- Today screen: colour tiles for each session, weekly ring (sessions vs target), day pills.
- Workout focus mode: set logger comes first, "last time" values pre-filled, one tap on ✓ repeats
  last session's numbers, next set auto-fills, big Next button, coach button always in reach.
- Rest timer runs on real clock time: correct after the screen sleeps or the app reloads.
- Check-in shows exactly which exercises are kept or dropped before you start.
- Swapping an exercise keeps the sets you already did under the original exercise.
- Technique guide: full photo sequence (swipe between steps), "Talk me through it" reads every step.
  Photos: Kettlebell Swing, Kettlebell Deadlift (new swap option), World's Greatest Stretch.
  Other exercises fall back to the existing illustrations until their photos are uploaded.
- Coach tab: real chat thread, quick questions, formatted answers.
- History: grouped by week, tap a session to see every set; delete lives inside the detail.
- Profile: plan, about you, one set of voice settings, backup AND restore of history.
- Updates no longer reload the app on their own. A banner appears; you tap Update when ready.
- All previous data carries over: history, plan, profile, voice settings, coach chat,
  and a workout that's in progress.

UPLOAD (repository root, commit to main)
Files:
  index.html, app.js, data.js, styles.css, sw.js, manifest.json, README-v4.0.txt, PHOTO-PROMPTS.md
Folders (upload their contents into the folder of the same name):
  fonts/            (6 .woff2 files — NEW folder, see note below)
  pt-assets-v34/    (15 .jpg photos)
  pt-assets-v33/    (190 .svg illustrations — only needed if that folder isn't already in the repo)
Keep: icon-192.png, icon-512.png

Creating the new fonts/ folder on GitHub: Add file > Create new file, type  fonts/.keep  as the
name, commit. Then open the fonts folder > Add file > Upload files > select the 6 .woff2 files.

AFTER UPLOAD
Wait 1–2 minutes, open Zahi Fit, and tap "Update" on the banner if it appears (or close and
reopen the app). Profile > bottom of the page shows the version: 4.0.0.

SAFE TO DELETE (nothing uses them any more — optional tidy-up)
  app.css v24.css v25.css v27.css v31.css
  v24.js v25.js v251.js v27.js v271.js v32.js v33.js v34.js v34-asset-manifest.json
  the 190 *-step1.svg … *-step5.svg files sitting in the repository ROOT (duplicates of pt-assets-v33/)
  pt-assets/ (World's Greatest Stretch photos now live in pt-assets-v34/)
  old README-v2.x / v3.x files

ADDING MORE EXERCISE PHOTOS
See PHOTO-PROMPTS.md: house style, exact file names, and five ready prompts per exercise.
Drop the JPGs into pt-assets-v34/ — no code change needed.

NOTE: The Cloudflare Worker is unchanged. Do not upload your OpenAI API key to GitHub.
