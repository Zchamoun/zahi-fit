ZAHI FIT v2.1.0 — SECURITY & FOUNDATION RELEASE

Security changes
- Added Content Security Policy
- Removed inline JavaScript and inline CSS
- Secure DOM rendering for imported workout data
- Strict workout-plan schema validation
- Max plan file size
- Numeric range validation
- Text length validation
- HTTPS-only demo links
- YouTube allowlist for demo links
- No OpenAI API key or password stored
- No Android sensitive permissions requested

Reliability changes
- App version badge
- Update detection banner
- Improved service-worker lifecycle
- Network-first HTML navigation
- Existing local workout history remains compatible
- Export history and PT handoff retained

Deployment
Upload/replace these files in the GitHub Pages repository root:
- index.html
- app.css
- app.js
- manifest.json
- sw.js
Keep the existing icon-192.png and icon-512.png.

After GitHub Pages redeploys:
1. Open Zahi Fit.
2. Close and reopen once if still on the old version.
3. Confirm the header shows v2.1.0.
