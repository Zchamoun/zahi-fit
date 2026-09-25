ZAHI FIT v5.0.0 — FOOD: MEAL LOGGING, TARGETS, WEEKLY VIEW, SMART SUGGESTIONS

WHAT'S NEW — a Food tab (Today · Food · History · Coach · Profile)
FREE, works offline, no AI:
- Quick-add buttons (Sandwich, Bowl of rice + protein, Coffee + pastry, Pizza slice, Eggs + toast,
  Protein shake, Grilled chicken + veggies, Chicken shawarma wrap). One tap → adjust portion → Log.
- After you log the same meal twice: "Save it as a quick-add?" → it becomes a ★ one-tap button.
- Built-in food list (80+ foods incl. shawarma, hummus, machboos, mandi, manakish, karak…) with search.
- Calorie + protein + carbs + fat targets from your profile (sex, age, weight) + height, diet and goal
  set in Food › ⚙. Keto shows net carbs. Workout days are shown with estimated burn.
- Weekly view first: 7-day chart, averages, days on target, a friendly one-line summary.
- "What I've noticed" after a week of logging (skipped breakfasts, biggest day, protein gap, go-to meal).
- Quick meal ideas based on what's left today and your diet/protein preferences.
- A "Food today" card on the Today screen; the AI coach (Coach tab) now also sees your nutrition.
ONLINE:
- 🔍 "Search more foods online" — USDA FoodData Central (free).
- 📷 Photo, 💬 Describe ("eggs and toast", or a whole day in one sentence), 🎙 Say it,
  ✨ Ask the food coach (incl. post-workout refuel), ✨ Coach review of my week.
  These use OpenAI (gpt-4o-mini) — roughly a fraction of a cent each. Nothing calls OpenAI unless you tap them.

ONE-TIME SETUP: the zahi-fit-food Worker (same steps as the voice Worker)
1. Cloudflare › Workers & Pages › Create › Start with Hello World › name: zahi-fit-food › Deploy.
2. Edit code › select all › delete › paste cloudflare/zahi-fit-food-worker.js › Deploy (check ⓧ 0).
3. Settings › Variables and Secrets › Add › Secret › OPENAI_API_KEY › your OpenAI key › Deploy.
4. Recommended: free USDA key at https://fdc.nal.usda.gov/api-key-signup (email only) →
   add Secret USDA_API_KEY. Without it, USDA search uses a shared demo key with low hourly limits.
5. Check: open https://zahi-fit-food.chamounzahi.workers.dev → {"ok":true,"service":"Zahi Fit Food",...}
The cloudflare/ folder does NOT go to GitHub.
Until the Worker is set up, everything free still works and the AI buttons say so.

UPLOAD (repository root, commit to main)
Replace/add: app.js, data.js, data-de.js, data-plan.js, data-video.js, data-profile.js,
data-food.js (NEW), index.html, styles.css, sw.js, manifest.json, README-v5.0.txt
Open Zahi Fit › Update › Profile shows 5.0.0 › Food tab › set up (height, diet, protein sources).

PRIVACY
Meals are stored on your phone, per account. Photos are sent to the Worker only when you tap Photo,
are not stored, and OpenAI is called with store:false.
