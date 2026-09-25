ZAHI FIT v4.9.2 — "SAVE GUIDES FOR OFFLINE" REMOVED

CHANGES
- Removed the "Save guides for offline" button and its message from Profile › Language & voice.
  The natural voice still saves each clip on your phone the first time it plays, so anything
  you've listened to keeps working without signal.
- Clearer voice problems: if the natural voice can't be used, the message now says why and what
  to fix (e.g. no OpenAI credit, key rejected, key missing in the Worker, rate limit), and your
  phone's voice reads instead.

UPLOAD (repository root, commit to main)
Replace: app.js, sw.js (the other files are included unchanged so the set is complete)
Add: README-v4.9.2.txt
No Cloudflare changes.
