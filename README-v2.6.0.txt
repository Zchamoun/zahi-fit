ZAHI FIT v2.6.0 — EMBEDDED AI PT

What this update does
- Keeps the current v2.5 flexible planner, readiness adaptation, exercise tracking, substitutions and history.
- Replaces the old ChatGPT/Chrome handoff with a seamless AI PT inside Zahi Fit.
- Sends questions securely to the Cloudflare Worker already created:
  https://zahi-fit-pt.chamounzahi.workers.dev
- The OpenAI API key remains only in Cloudflare as OPENAI_API_KEY.
- Shows the PT answer inside the existing Ask PT sheet without leaving the workout.
- Supports follow-up questions and sends recent PT conversation plus current workout context.
- Changes the visible app version to v2.6.0.

UPLOAD FROM YOUR PHONE
1. Extract this ZIP.
2. In GitHub > Zchamoun/zahi-fit > Add file > Upload files.
3. Upload BOTH files:
   - index.html
   - v251.js
4. GitHub will show that both filenames already exist. This is expected; they are replacements.
5. Commit directly to main.
6. Wait about 1–2 minutes for GitHub Pages.
7. Open Zahi Fit and refresh. The header should show v2.6.0.
8. Tap Ask Zahi Fit PT and test a question.

Do not upload your OpenAI API key to GitHub.
