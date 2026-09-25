ZAHI FIT v5.3.0 — ADMIN DASHBOARD (ONLY FOR zchamoun) + ANONYMOUS USAGE STATS
(complete package: includes everything from v5.2 and earlier)

WHAT YOU GET
Profile › 🛡 Admin dashboard (visible only when signed in as zchamoun, unlocked with your secret admin key):
• People: using now (15 min), active today / 7 / 30 days, accounts, phones, new this week, 7-day retention,
  daily-active chart (14 days)
• Training: workouts today / 7 / 30 days, average minutes, workouts per active person per week,
  extra sessions, workouts-per-day chart
• Food: meals logged, people logging food, how food is logged (quick-add, photo, describe…)
• Feature use (7 days): timer, AI coach, videos, guides, extra sessions, new accounts
• Who uses it: goal, training style, equipment, days/week, sex, age group, phone, language
• App versions: who hasn't updated yet

WHO CAN SEE IT
Two locks: (1) the Admin button only shows for username zchamoun; (2) the data is only returned by the
server with your ADMIN_TOKEN. Someone else creating a "zchamoun" account on their phone sees nothing
without the key. The key is saved only in your account on your phone ("Forget the admin key" removes it).

WHAT IS COLLECTED (anonymous)
Random IDs (no usernames), app opens, workouts started/finished (minutes, planned or extra), food logs
(count + method only), timer / coach / video / guide use, plan choices, sex & age group, language,
phone type, app version. NOT collected: names, weight, pain areas, food contents, chat text.
Users are told when creating an account and can switch it off in Profile › "Share anonymous usage stats".

UPLOAD TO GITHUB (repository root)
All app files: app.js, data.js, data-de.js, data-plan.js, data-video.js, data-profile.js, data-functional.js,
data-stretch.js, data-food.js, index.html, styles.css, sw.js, manifest.json, README-v5.3.txt
(the cloudflare/ folder does NOT go to GitHub)

CLOUDFLARE SETUP (one time, ~10 minutes) — see the step-by-step in the chat
1. Storage & Databases › D1 › Create database › name: zahi-fit-stats
2. Workers & Pages › Create › Hello World › name: zahi-fit-stats › Deploy
3. Edit code › paste cloudflare/zahi-fit-stats-worker.js › Deploy
4. Settings › Bindings › Add binding › D1 database › Variable name: DB › Database: zahi-fit-stats › Deploy
5. Settings › Variables and Secrets › Add › Secret › ADMIN_TOKEN › a long password only you know › Deploy
6. Check https://zahi-fit-stats.chamounzahi.workers.dev → {"ok":true,"service":"Zahi Fit Stats","adminToken":"set"}
Then in the app: Profile › Admin dashboard › enter the same ADMIN_TOKEN › Unlock.
