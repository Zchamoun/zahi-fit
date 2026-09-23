ZAHI FIT v2.7.0 — PERSONAL PT EXPERIENCE

WHAT IS NEW
1) First-run personal profile
   - Sex: Male / Female
   - Age bracket: 18–29, 30–39, 40–49, 50–59, 60+
   - Editable later from PT / Settings.
   - Included automatically in the embedded AI PT context.
   - Sex is used only where physiologically relevant; capability is not assumed from sex or age.

2) Rest timer audio
   - Start cue when rest begins.
   - Warning cue at 10 seconds remaining.
   - Completion cue when rest reaches zero.
   - Can be turned off under PT / Settings.

3) Voice coach
   - Off
   - Essential cues: rest-start, 10-second warning, rest complete.
   - Full encouragement: essential cues + short positive set-completion coaching.
   - Uses the phone/browser text-to-speech engine: no new paid service required.

4) In-app exercise coaching
   - External YouTube handoff is removed from the workout flow.
   - "Watch full video" is replaced by "Open in-app PT demo".
   - Each exercise displays a visual 3–4 step movement sequence using its coaching cues.
   - Includes an optional spoken PT walkthrough.
   - This release intentionally avoids opening YouTube/Chrome.
   NOTE: v2.7 uses an in-app visual + spoken PT demo, not streamed exercise video. A future curated video library can be embedded once specific embeddable video IDs are selected.

5) AI PT context
   - Personal profile is added to every AI request.
   - Age bracket informs recovery/progression context.
   - Sex is available only for relevant physiological tailoring.
   - Existing goals, readiness, set data, RPE and history remain included.

PHONE INSTALL / UPDATE
1. Extract this ZIP.
2. Go to GitHub > Zchamoun/zahi-fit > Add file > Upload files.
3. Upload these 5 files:
   - index.html
   - sw.js
   - manifest.json
   - v27.js
   - v27.css
4. Commit directly to main.
5. Wait 1–2 minutes, then refresh Zahi Fit.
6. The header should show v2.7.0.
7. On first launch, complete the sex + age-bracket profile.
8. In PT / Settings, test Voice coach and Rest timer sounds.

IMPORTANT
- Do not upload your OpenAI API key to GitHub.
- No Cloudflare Worker change is required for v2.7.0.
- Existing workout history/profile data is preserved.
