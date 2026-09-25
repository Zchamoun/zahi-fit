ZAHI FIT v4.9.3 — FREE PHONE VOICES THAT REALLY CHANGE (MALE / FEMALE / NEUTRAL)

WHAT WAS WRONG (from the screen recording)
- "Test voice" always played the last CONFIRMED voice. Choosing Male/Female/Neutral and tapping
  Test before Confirm replayed the old voice, so every choice sounded the same.
- With Phone voice, the difference between Male/Female/Neutral was only a tiny pitch change.
- The paid "Natural" voice used OpenAI credit.

FIXES
- No credit: the paid Natural voice is removed. All speech uses your phone's own voices —
  free, offline, and it never contacts OpenAI or the zahi-fit-voice Worker.
- Tap Male, Female, Neutral (or English / Deutsch) and you hear a short sample in that voice
  immediately. "Test selected voice" plays exactly what's selected — confirmed or not.
- Voices that really differ:
    • The app picks a real male or female voice when your phone has one (it recognises Google's
      Android voice codes, e.g. en-us-x-iol = male, en-us-x-sfg = female).
    • It adds a clear tone difference: Male lower, Female higher, Neutral in between — so the three
      always sound different, even on phones with only one voice per language.
- German: if no German voice is installed, the app says so and points to the setup guide.

UPLOAD (repository root, commit to main)
Replace: app.js, index.html, sw.js (other files included unchanged so the set is complete)
Add: README-v4.9.3.txt
No Cloudflare changes needed. The zahi-fit-voice Worker is no longer used — you can leave it or
delete it (Cloudflare › Workers & Pages › zahi-fit-voice › Settings › Delete). Deleting its
OPENAI_API_KEY-based key in OpenAI also guarantees it can't use credit.

TIP FOR THE BEST VOICES
Phone Settings › Text-to-speech › Speech Services by Google › Install voice data: download
English and Deutsch. Then fully close and reopen Zahi Fit.
