"use strict";
/* Zahi Fit v4.7 — YouTube technique videos (video ID per exercise).
   Chosen from established coaching channels. If a video ever disappears, change it in the app
   (guide › Change video) or edit the ID here. Exercises without an ID show "Find on YouTube". */
const VIDEOS = {
  "Hip 90/90 Flow":"f_7qIPxw6nE", "World's Greatest Stretch":"-CiWQ2IvY34", "Deadlift":"CWsxP4xat9M",
  "Bulgarian Split Squat":"2C-uNgKwPLE", "Dumbbell Romanian Deadlift":"aa57T45iFSE", "Farmer Carry":"lLAw6fUccKA",
  "StairMaster Intervals":"01H1FkKiQMI", "StairMaster Steady State":"01H1FkKiQMI", "Couch Stretch":"-rsIS-wl-ig",
  "Supine Hamstring Stretch":"Il1L75v6gq0", "Band Shoulder Dislocates":"riVxa9By-pM", "Thoracic Rotation":"snzLuyYgbVI",
  "Bench Press":"rT7DgCr-3pg", "Chest-Supported Row":"Nx0TzjgsI-0", "Dumbbell Shoulder Press":"qEwKCR5JCog",
  "Lat Pulldown":"CAwf7n6Luuc", "Push-up + Renegade Row":"vpOeK4BrUyc", "Bike Intervals":"rlOOqDgDU3U",
  "Doorway Pec Stretch":"M850sCj9LHQ", "Child's Pose Lat Stretch":"E3NlQbRI1L8", "Deep Squat Pry":"0wzrgyAurT8",
  "Inchworm to Down Dog":"LNLkYrcKStY", "Front Squat":"uYumuL_G_V0", "Incline Dumbbell Press":"sK4Rvug6ufo",
  "Single-Arm Cable Row":"CrylzZHfO1c", "Kettlebell Swing":"bDCeXbMJVNs", "Pallof Press":"SY5lRzBPtM4",
  "Hip Flexor + Rotation Stretch":"rUpfzNKqBys", "Figure-4 Glute Stretch":"-g0nuyTHMrI", "Ankle Dorsiflexion Rock":"Y1IZXkdPPdw",
  "Cossack Squat":"p_scPPvWD2I", "Leg Press":"cDGOn-yfKJA", "Walking Dumbbell Lunge":"_DLIS8SySzs", "Hip Thrust":"LM8XHLYJoYs",
  "Hamstring Curl":"lUH80pneL5w", "Step-Down Control":"d93bbZvxe_w", "Adductor Rockback Stretch":"yF8o6I6aSZg",
  "Calf Wall Stretch":"i1eJqJ3v3lQ", "Kettlebell Deadlift":"-N4NjwW7bGA",
  "Bodyweight Squat":"P-yaD24bUE8", "Jump Squat":"tZSYZdtbONc", "Single-Leg Romanian Deadlift":"Zfr6wizR8rs",
  "Reverse Lunge":"raQl44N_REc", "Bodyweight Split Squat":"qtblVwEz2a8", "Push-up":"WDIpL0pjun0", "Pike Push-up":"pHR5yG6xBps",
  "Inverted Row":"dnpDUwqMX04", "Prone Y-T-W Raise":"OmgJCA_lzrs", "Chair Dips":"AWz_7B1cch0",
  "Single-Leg Glute Bridge":"VUl8R0kn6v4", "Plank":"mwlp75MS6Rg", "Side Plank":"44ND4bOB-T0", "Dead Bug":"bxn9FBrt4-A",
  "Burpee Intervals":"G2hv_NYhM-A", "High-Knee Intervals":"D0GwAezTvtg"
};
/* What to search for when an exercise has no fixed video. */
const VIDEO_SEARCH = {
  "CrossFit Engine Circuit":"conditioning circuit bike box step up push press kettlebell deadlift",
  "Bodyweight Engine Circuit":"bodyweight circuit squats push ups lunges plank beginner",
  "Brisk Walk or Easy Jog":"zone 2 walking jogging technique beginner"
};
