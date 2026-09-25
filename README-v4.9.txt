ZAHI FIT v4.9.0 — ACCOUNTS: CREATE ACCOUNT, SIGN IN, STAY SIGNED IN

THE FLOW
1. First launch: "Create your account" — username, password (8+ characters), confirm.
   If this phone already has training data, you're offered to link it to the new account
   (selected by default), so nothing is lost.
2. A one-time recovery code is shown. Save it: it's the only way to reset a forgotten password.
3. You're taken to "Sign in" with your username filled in. Enter your password.
   "Stay signed in" (ticked by default): stays signed in on this phone for up to 6 months.
   Unticked: you sign in again after fully closing the app — use this on a shared phone.
4. Straight into the app (a new account gets the short setup first).

PROFILE › ACCOUNT
Shows only the signed-in account: Display name, Change password, New recovery code, Sign out,
Delete account. The old "People on this phone" list and the switch-person sheet are gone —
listing or switching without a password would defeat the login. Another person uses their own
account: Sign out › "Create a new account" (or sign in). The round initial on Today opens a
small account sheet (Account & settings, Sign out).

SECURITY NOTES
• Passwords are never stored — only a salted PBKDF2 hash (210,000 rounds).
• 5 wrong passwords → 30-second pause before trying again.
• Forgot password: "Forgot password?" › username + recovery code › new password (you get a new code).
  No code: you can erase that account and start again (its data is deleted).
• The account lives on this phone: it keeps each person's training private from others using
  the same phone. It is not a cloud account — no sync between phones, and stored workout data
  itself isn't encrypted. Back up history from Profile if you change phones.
• Works fully offline.

UPLOAD (repository root, commit to main)
Replace/add: app.js, data.js, data-de.js, data-plan.js, data-video.js, data-profile.js,
index.html, styles.css, sw.js, manifest.json, README-v4.9.txt
Includes everything from v4.6–v4.8. No Cloudflare changes.

AFTER UPLOAD
Open Zahi Fit, tap Update. You'll see "Create your account": choose your username and password,
keep "Zahi" selected to link your existing training, save the recovery code, then sign in.
