ZAHI FIT v5.1.0 — DAILY BALANCE, AUTOMATIC CARDIO, MORE NUTRIENTS, FOLLOW-UP ANSWERS

1) TODAY'S BALANCE (Food tab)
   Eaten · Burned in training · Net · Target. The calorie target is FIXED; burned calories are shown
   separately (estimated from session length, type and your weight).
2) AUTOMATIC BALANCING (fat-loss or maintain goal)
   When food runs more than 150 kcal over target, steady cardio is added to TODAY'S WORKOUT automatically:
   • not started yet → added when you start the session;  • in progress → added now (before the stretch);
   • already trained today → a timed "balance session" (e.g. around 19:30) with Done / Not today.
   Guardrails: max 40 min a day; never on a lighter/recovery day (low energy or very sore check-in);
   never on a muscle-gain goal; anything left over is balanced across the week. "Not today" removes it.
   The exercise shows "Balance: added automatically…" and it's easy pace (you can still talk).
3) MORE NUTRIENTS
   Fiber (aim), saturated fat (limit <10% of calories), sodium (limit 2,300 mg), water (33 ml per kg).
   Water: + Glass 250 ml / + Bottle 500 ml. Bars turn orange only when a limit is exceeded.
4) ANSWER THE FOOD COACH
   When the coach asks "Did you add anything else?", type or say your answer (🎙) and tap Add —
   items are added to the same meal. "No, that's all" closes it. Any meal can also use
   "💬 Add more by describing it".

UPLOAD (repository root, commit to main)
Replace: app.js, data-food.js, styles.css, sw.js (+ others included unchanged) and README-v5.1.txt

CLOUDFLARE (recommended, 2 minutes)
Update the zahi-fit-food Worker with cloudflare/zahi-fit-food-worker.js (Edit code › select all ›
paste › Deploy) so photo/describe/USDA also estimate saturated fat and salt. Without it everything
still works; AI-logged meals just show 0 for those two.
