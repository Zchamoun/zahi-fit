ZAHI FIT v2.3.1 — ADAPTIVE PRESCRIPTION

This release keeps all v2.3 PT Experience features and makes the readiness check actually modify the workout.

Adaptive logic
- Energy, soreness and available time now change the prescription.
- 60-minute mode:
  - one mobility block
  - main strength movement
  - one key accessory
  - durability
  - shortened conditioning
  - one flexibility cooldown
- 75-minute mode:
  - keeps main training blocks
  - trims secondary mobility/flexibility volume
- 90-minute mode:
  - full programmed session
- Low energy or high soreness:
  - reduced accessory volume
  - fewer sets
  - conservative progression guidance
  - controlled conditioning
- Progressive-load recommendations now respect readiness.
- The active workout shows the applied adaptation and target duration.
- PT / ChatGPT context includes readiness + actual adaptation.

Retained from v2.3
- in-app technique coaching
- common mistakes
- previous performance
- progression guidance
- +/-2.5 kg controls
- exercise substitutions
- automatic rest timer
- RPE
- safe session menu
- workout summary
- persistent workout
- security controls

Deployment:
Replace index.html, app.js, sw.js and README.txt.
app.css and manifest.json may also be uploaded unchanged for consistency.
Keep icon-192.png and icon-512.png.
