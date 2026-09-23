ZAHI FIT v2.5.1 — CHATGPT APP HANDOFF PATCH

Purpose
- Keeps all v2.5 features unchanged.
- Changes Ask PT handoff so Android targets the installed ChatGPT app instead of opening chatgpt.com in Chrome.
- Sends the prepared PT prompt/context through Android ACTION_SEND.
- Keeps clipboard copy as fallback.

Upload
1. Upload v251.js to the repository root.
2. Replace index.html with the included index.html.
3. Replace sw.js with the included sw.js.
4. Keep all other existing files unchanged.

Expected result
- Tapping Ask PT should open the ChatGPT Android app directly when installed.
- The workout prompt/context should be shared to ChatGPT instead of just opening a blank browser tab.
