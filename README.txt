ZAHI FIT v2 — Android installation

WHAT CHANGED
- Branded Android app icon (192px + 512px)
- Install-to-home-screen support
- Standalone full-screen app experience
- Offline app shell
- "Ask ChatGPT PT" button
- Copies current workout + recent history before opening the official ChatGPT Android app
- Export PT handoff file
- Import updated workout-plan JSON without losing history

IMPORTANT
A PWA cannot install directly from a ZIP/file:// URL. It must be served from an HTTPS website.
Once hosted:
1. Open the site in Chrome on Android.
2. Tap "Install Zahi Fit" inside the app, or Chrome menu -> Install app / Add to Home screen.
3. Zahi Fit appears with its own icon and opens standalone like an app.

CHATGPT LINK
The app uses the official ChatGPT Android package (com.openai.chatgpt) and falls back to chatgpt.com.
The app DOES NOT contain your OpenAI password or API key.

UPDATING THE PLAN
- Export "PT file" from Settings and upload it to ChatGPT.
- Ask ChatGPT to change the workout.
- Import the returned plan JSON in Zahi Fit.
This preserves workout history.

To achieve automatic two-way updates without importing a file, the app would need a hosted backend plus an OpenAI API integration and authentication.
