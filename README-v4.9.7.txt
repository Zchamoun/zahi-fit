ZAHI FIT v4.9.7 — VOICE ROW UPDATES INSTANTLY + FIX FOR v4.9.6

IMPORTANT FIX
v4.9.6 accidentally contained unfinished code for a downloadable German voice (built before you
asked me not to build it). Its service worker asked for two files that weren't in the zip, so the
v4.9.6 update most likely never installed, and German Male/Female could show a download card that
doesn't work. v4.9.7 is rebuilt from the clean v4.9.5 and removes all of it.
If you uploaded neural-voice.js or piper-phonemize.js to GitHub at any point, delete them.

WHAT'S NEW
- Tap Male, Female or Neutral (or English / Deutsch) and the row below changes straight away:
  "Voice used for Female" + "Find a female voice on this phone" — no need to Confirm first.
- Your chosen Male and Female voices are remembered separately for English and Deutsch.
  Your current Male voice (English United States) is kept for English.
- Includes the Android / iPhone voice setup guide from v4.9.6.

UPLOAD (repository root, commit to main)
Replace: app.js, index.html, sw.js, styles.css (other files included unchanged) + add this README.
Open Zahi Fit, tap Update; Profile shows 4.9.7.
