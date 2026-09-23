Zahi Fit v2.8.1 HOTFIX

Fixes:
- Prevents the v2.8 MutationObserver loop that could freeze the UI and make buttons unresponsive.
- Bumps the service-worker cache so the installed PWA refreshes from the old v2.7.x cache.

Upload/replace these 2 files in the repository root:
1. v271.js
2. sw.js

Then refresh the Chrome version once. Fully close the installed Zahi Fit app and reopen it.

If the installed app still shows v2.7.x, remove it from recent apps and reopen. If still stale, clear only Zahi Fit site data / reinstall the PWA after confirming Chrome shows v2.8.1.
