ZAHI FIT v4.1.0 — NATURAL VOICE COACH (ENGLISH / DEUTSCH)

WHAT'S NEW
- Natural, human-sounding AI-generated voice for rest cues, encouragement and the step-by-step
  technique guide.
- Choose language: English or Deutsch. Choose voice: Male, Female or Neutral.
  (Profile > Voice & sound)
- German: workout cues are written in German; exercise instructions are translated into natural
  spoken German automatically.
- Every phrase downloads once and is saved on the phone, so it plays instantly next time and
  works in the gym without signal. Rest cues for your session are prepared when a workout starts.
- The guide prepares the next step while the current one is playing, so "Talk me through it"
  flows without gaps.
- "Phone voice" option: uses the phone's built-in voice, fully offline. It now picks a voice in
  your language and gender where the phone offers one, and reads sentence by sentence so it
  sounds smoother. If the natural voice can't be reached, the phone voice takes over automatically.

PART 1 — CLOUDFLARE (one time, about 5 minutes)
1. Cloudflare dashboard > Workers & Pages > Create > Create Worker.
2. Name it exactly:  zahi-fit-voice   > Deploy.
3. Edit code > delete everything > paste the whole contents of
   cloudflare/zahi-fit-voice-worker.js > Deploy.
4. Worker > Settings > Variables and Secrets > Add > type "Secret",
   name  OPENAI_API_KEY , value = your OpenAI API key > Deploy.
5. Check the address shown for the Worker is:
   https://zahi-fit-voice.chamounzahi.workers.dev
   (If it's different, tell Claude the address so app.js and index.html can be updated.)
Your existing zahi-fit-pt Worker is not changed.

PART 2 — GITHUB (repository root, commit to main)
Replace:  app.js, index.html, sw.js
Add:      README-v4.1.txt
Do NOT upload the cloudflare/ folder to GitHub — it's only for step 1 above.

AFTER UPLOAD
Wait 1–2 minutes, open Zahi Fit, tap "Update" on the banner. Profile > bottom shows 4.1.0.
Then Profile > Voice & sound > pick language and voice > Test voice.

COST
Each phrase is generated once per phone and then reused from the phone's storage.
Setting a monthly spending limit in your OpenAI account is still recommended, especially
if friends are testing the app.
