ZAHI FIT v3.4.0 — PHOTOREALISTIC VISUAL PT ENGINE

PURPOSE
v3.4.0 adds a safe photorealistic-asset layer on top of the working v3.3 Visual PT engine.

UPLOAD TO REPOSITORY ROOT
1. index.html
2. sw.js
3. v34.js
4. README-v3.4.0.txt

CREATE / KEEP FOLDER
pt-assets-v34/

PHOTO NAMING STANDARD
Each exercise family supports five JPG files:
  <family>-step1.jpg
  <family>-step2.jpg
  <family>-step3.jpg
  <family>-step4.jpg
  <family>-step5.jpg

Examples:
  swing-step1.jpg ... swing-step5.jpg
  deadlift-step1.jpg ... deadlift-step5.jpg
  bench-step1.jpg ... bench-step5.jpg

BEHAVIOUR
- If a v3.4 JPG exists, Zahi Fit automatically uses it.
- If it is missing, the app safely falls back to the existing v3.3 SVG visual.
- World's Greatest Stretch keeps the approved existing photographic sequence in /pt-assets/.
- v3.4 automatically applies the same cyan instructional callout treatment to available photo assets.

PHOTO PRODUCTION STANDARD
- 16:9 landscape; recommended 1536 x 864 or higher.
- Same trainer, clothing, lighting, studio and camera angle across each five-step sequence.
- Dark neutral gym/studio background.
- Full body and all equipment inside frame.
- Correct exercise mechanics and materially different movement phase for each step.
- No embedded text is required; the app overlays concise cyan coaching callouts.
- Avoid watermarks, logos and busy backgrounds.

IMPORTANT
The v3.4 code is intentionally non-destructive. You can upload photographic exercise packs progressively without breaking exercises that do not yet have v3.4 photos.
