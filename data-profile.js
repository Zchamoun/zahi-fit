"use strict";
/* Zahi Fit v4.8 — data that personalises the programme from the person's profile.
   Loaded after data.js, data-de.js, data-plan.js. */

const EXPERIENCE = {new:"New to training", some:"Some experience", experienced:"Experienced"};
const FOCUS_AREAS = {auto:"Auto (by sex)", balanced:"Balanced", lower:"Legs & glutes", upper:"Upper body", core:"Core"};
const BODY_AREAS = {knees:"Knees", lowerBack:"Lower back", shoulders:"Shoulders", hips:"Hips", wrists:"Wrists", elbows:"Elbows", neck:"Neck", ankles:"Ankles"};

/* "Auto" emphasis: women get extra glute & leg work, men extra upper-body work. Any explicit focus overrides this. */
const SEX_DEFAULT_FOCUS = {female:"lower", male:"upper"};

/* Extra slots added per session type for each focus (first entry is kept even in short sessions). */
const FOCUS_SLOTS = {
  lower:   {lower:[["glute","acc"],["ham","acc"]], full:[["glute","acc"],["lunge","acc"]], upper:[["glute","acc"]], engine:[["lunge","acc"]], mobility:[["mobLower","mob"]]},
  upper:   {lower:[["pullH","acc"]], full:[["pullV","acc"],["pushV","acc"]], upper:[["pushV","acc"],["pullH","acc"]], engine:[["pushH","acc"]], mobility:[["mobUpper","mob"]]},
  core:    {lower:[["core","core"]], full:[["core","core"]], upper:[["durability","core"]], engine:[["durability","core"]], mobility:[["core","core"]]},
  balanced:{}
};

/* Exercises that load a painful or sensitive area. They're swapped for gentler options. */
const AVOID_BY_AREA = {
  knees:["Jump Squat","Burpee Intervals","High-Knee Intervals","Walking Dumbbell Lunge","Bulgarian Split Squat","Bodyweight Split Squat",
    "Cossack Squat","Deep Squat Pry","Front Squat","StairMaster Intervals","StairMaster Steady State","Couch Stretch","CrossFit Engine Circuit","Bodyweight Engine Circuit"],
  lowerBack:["Deadlift","Kettlebell Swing","Kettlebell Deadlift","Front Squat","Burpee Intervals","Jump Squat","Dumbbell Romanian Deadlift",
    "Single-Leg Romanian Deadlift","CrossFit Engine Circuit","Bodyweight Engine Circuit"],
  shoulders:["Band Shoulder Dislocates","Dumbbell Shoulder Press","Pike Push-up","Chair Dips","Push-up + Renegade Row","Bench Press",
    "Burpee Intervals","Inchworm to Down Dog","Doorway Pec Stretch","CrossFit Engine Circuit","Bodyweight Engine Circuit"],
  hips:["Deep Squat Pry","Cossack Squat","Hip 90/90 Flow","Jump Squat","Bulgarian Split Squat","Couch Stretch","Adductor Rockback Stretch","Walking Dumbbell Lunge"],
  wrists:["Push-up","Push-up + Renegade Row","Pike Push-up","Burpee Intervals","Inchworm to Down Dog","Chair Dips","Front Squat",
    "World's Greatest Stretch","Bodyweight Engine Circuit"],
  elbows:["Chair Dips","Pike Push-up","Push-up + Renegade Row"],
  neck:["Dumbbell Shoulder Press","Pike Push-up","Burpee Intervals","Farmer Carry"],
  ankles:["Jump Squat","Burpee Intervals","High-Knee Intervals","Ankle Dorsiflexion Rock","StairMaster Intervals","StairMaster Steady State",
    "Walking Dumbbell Lunge","Cossack Squat","CrossFit Engine Circuit","Bodyweight Engine Circuit"]
};

/* Gentler options to use when a slot's normal choices are all excluded (filtered by equipment afterwards). */
const SAFE_BY_KEY = {
  squat:["Leg Press","Hip Thrust","Single-Leg Glute Bridge","Bodyweight Squat"],
  hinge:["Hip Thrust","Single-Leg Glute Bridge","Hamstring Curl"],
  lunge:["Step-Down Control","Single-Leg Glute Bridge","Hip Thrust"],
  glute:["Single-Leg Glute Bridge","Hip Thrust","Hamstring Curl"],
  ham:["Hamstring Curl","Single-Leg Glute Bridge","Hip Thrust"],
  pushH:["Incline Dumbbell Press","Push-up","Chest-Supported Row","Inverted Row"],
  pushV:["Incline Dumbbell Press","Prone Y-T-W Raise","Pallof Press","Push-up"],
  pullH:["Chest-Supported Row","Single-Arm Cable Row","Inverted Row"],
  pullV:["Lat Pulldown","Prone Y-T-W Raise","Chest-Supported Row","Inverted Row"],
  core:["Dead Bug","Pallof Press","Side Plank","Plank"],
  durability:["Dead Bug","Pallof Press","Side Plank","Step-Down Control"],
  power:["Kettlebell Deadlift","Single-Leg Glute Bridge","Hip Thrust","Bodyweight Squat"],
  interval:["Bike Intervals","Brisk Walk or Easy Jog"],
  steady:["Bike Intervals","Brisk Walk or Easy Jog"],
  circuit:["Bike Intervals","Brisk Walk or Easy Jog"],
  mobLower:["Supine Hamstring Stretch","Figure-4 Glute Stretch","Thoracic Rotation","Child's Pose Lat Stretch"],
  mobUpper:["Thoracic Rotation","Child's Pose Lat Stretch","Supine Hamstring Stretch"],
  flexLower:["Supine Hamstring Stretch","Figure-4 Glute Stretch","Calf Wall Stretch"],
  flexUpper:["Child's Pose Lat Stretch","Supine Hamstring Stretch"]
};

/* Age: lower impact, more balance and joint-friendly versions. Beginners get simpler versions of technical lifts. */
const AGE_SWAPS = {
  "50-59":{"Jump Squat":"Bodyweight Squat", "Burpee Intervals":"High-Knee Intervals"},
  "60+":{"Jump Squat":"Bodyweight Squat", "Burpee Intervals":"Brisk Walk or Easy Jog", "High-Knee Intervals":"Brisk Walk or Easy Jog",
    "Deadlift":"Kettlebell Deadlift", "Front Squat":"Leg Press", "Kettlebell Swing":"Kettlebell Deadlift", "Cossack Squat":"Step-Down Control"}
};
const EXPERIENCE_SWAPS = { new:{"Deadlift":"Kettlebell Deadlift", "Front Squat":"Leg Press", "Push-up + Renegade Row":"Pallof Press", "Pike Push-up":"Push-up"} };

/* Starting-weight estimate for exercises with no history: ratio of body weight for a working set of ~8 reps
   (someone with some experience). kind: bb barbell, db per dumbbell, mc machine, cable, kb kettlebell. */
const LOAD_GUIDE = {
  "Deadlift":[0.9,"bb","lower"], "Front Squat":[0.55,"bb","lower"], "Bench Press":[0.55,"bb","upper"], "Leg Press":[1.3,"mc","lower"],
  "Hip Thrust":[0.8,"bb","lower"], "Incline Dumbbell Press":[0.16,"db","upper"], "Dumbbell Shoulder Press":[0.12,"db","upper"],
  "Dumbbell Romanian Deadlift":[0.2,"db","lower"], "Chest-Supported Row":[0.17,"db","upper"], "Lat Pulldown":[0.5,"cable","upper"],
  "Single-Arm Cable Row":[0.22,"cable","upper"], "Hamstring Curl":[0.3,"mc","lower"], "Walking Dumbbell Lunge":[0.12,"db","lower"],
  "Bulgarian Split Squat":[0.1,"db","lower"], "Farmer Carry":[0.3,"db","grip"], "Kettlebell Swing":[0.2,"kb","lower"],
  "Kettlebell Deadlift":[0.25,"kb","lower"], "Push-up + Renegade Row":[0.1,"db","upper"], "Pallof Press":[0.12,"cable","core"]
};
const LOAD_STEP = {bb:2.5, db:2, mc:5, cable:2.5, kb:4};
const LOAD_MIN = {bb:20, db:2, mc:10, cable:5, kb:8};
const SEX_LOAD = {female:{upper:0.65, lower:0.8, grip:0.75, core:0.8}, male:{upper:1, lower:1, grip:1, core:1}};
const AGE_LOAD = {"18-29":1, "30-39":1, "40-49":0.95, "50-59":0.85, "60+":0.75};
const EXP_LOAD = {new:0.6, some:1, experienced:1.3};
const DEFAULT_BW = {male:80, female:65};

/* Bodyweight-style exercises from the gym library: log reps, not kg. */
["Step-Down Control"].forEach(n => BW_NAMES.add(n));
