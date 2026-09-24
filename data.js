"use strict";
/* Zahi Fit v4 — exercise library, programme templates and coaching content. Data only. */
function E(n,block,sets,reps,rest,cue,video,how,mistakes,subs){return{n,block,sets,reps,rest,cue,video,how,mistakes,subs}}
const PROGRAM=[
{name:"A — Posterior Strength + StairMaster",duration:80,focus:"Deadlift strength • glutes/hamstrings • conditioning • hip mobility",exercises:[
E("Hip 90/90 Flow","Mobility",2,"6/side",30,"Move slowly through internal and external hip rotation. Stay tall through the trunk.","https://www.youtube.com/results?search_query=90+90+hip+mobility",["Sit tall and rotate from the hips","Keep both sit bones controlled","Use slow breathing"],["Collapsing the torso","Forcing painful range"],["World's Greatest Stretch","Cossack Squat"]),
E("World's Greatest Stretch","Mobility",2,"5/side",30,"Long lunge, thoracic rotation, controlled breathing.","https://www.youtube.com/results?search_query=worlds+greatest+stretch",["Long stable lunge","Rotate through upper back","Keep breathing"],["Rushing positions","Dropping the hips without control"],["Hip Flexor + Rotation Stretch","Inchworm to Down Dog"]),
E("Deadlift","Strength",4,"5",150,"Brace hard, keep the bar close, push the floor away. Keep 1–3 clean reps in reserve.","https://www.youtube.com/results?search_query=deadlift+proper+form",["Brace before the pull","Bar stays close to legs","Push the floor away"],["Jerking the bar","Rounding under load","Hyperextending at lockout"],["Kettlebell Deadlift","Trap-Bar Deadlift","Romanian Deadlift"]),
E("Bulgarian Split Squat","Strength",3,"8/leg",90,"Stable front foot, controlled descent, drive through whole foot.","https://www.youtube.com/results?search_query=bulgarian+split+squat+form",["Front foot fully planted","Descend under control","Drive through mid-foot"],["Front heel lifting","Knee collapsing inward"],["Reverse Lunge","Leg Press"]),
E("Dumbbell Romanian Deadlift","Hypertrophy",3,"10",90,"Soft knees, hips back, long spine, load the hamstrings.","https://www.youtube.com/results?search_query=dumbbell+romanian+deadlift+form",["Hips travel back","Weights stay close","Stop when hamstrings limit range"],["Squatting the movement","Rounding to gain depth"],["Kettlebell Deadlift","Cable Pull-Through","Hamstring Curl"]),
E("Farmer Carry","Durability",4,"30–40 m",60,"Tall posture, ribs stacked, strong grip, smooth steps.","https://www.youtube.com/results?search_query=farmer+carry+proper+form",["Stand tall","Short controlled steps","Keep shoulders stable"],["Leaning side to side","Shrugging excessively"],["Suitcase Carry","Sled Push"]),
E("StairMaster Intervals","Conditioning",6,"1 min hard / 1 min easy",0,"Use repeatable hard efforts; do not sprint to failure.","https://www.youtube.com/results?search_query=stairmaster+interval+workout",["Light hands on rails","Tall posture","Keep hard rounds repeatable"],["Hanging on rails","Starting too hard"],["Bike Intervals","Incline Treadmill Intervals"]),
E("Couch Stretch","Flexibility",2,"45 sec/side",20,"Squeeze the glute on the stretching side and keep the ribs down.","https://www.youtube.com/results?search_query=couch+stretch",["Posterior pelvic tilt","Glute engaged","Easy breathing"],["Arching lower back","Forcing knee angle"],["Hip Flexor Stretch","Half-Kneeling Quad Stretch"]),
E("Supine Hamstring Stretch","Flexibility",2,"45 sec/side",20,"Keep pelvis neutral and stretch without forcing range.","https://www.youtube.com/results?search_query=supine+hamstring+stretch",["Relax shoulders","Keep pelvis stable","Use gentle tension"],["Locking into pain","Lifting pelvis"],["Standing Hamstring Stretch","Adductor Rockback Stretch"])]},
{name:"B — Upper Strength + Bike Engine",duration:75,focus:"Upper-body muscle • posture • work capacity • shoulder mobility",exercises:[
E("Band Shoulder Dislocates","Mobility",2,"10",20,"Use a wide grip and move only through pain-free range.","https://www.youtube.com/results?search_query=band+shoulder+dislocates",["Wide grip","Slow arc","Pain-free range"],["Forcing behind the body","Shrugging"],["Wall Slides","Thoracic Rotation"]),
E("Thoracic Rotation","Mobility",2,"8/side",20,"Rotate from upper back while hips stay controlled.","https://www.youtube.com/results?search_query=thoracic+rotation+mobility",["Hips stay quiet","Rotate upper back","Breathe out into range"],["Twisting from lower back","Rushing"],["Open Book Rotation","Child's Pose Rotation"]),
E("Bench Press","Strength",4,"6–8",120,"Feet planted, shoulder blades set, controlled touch to chest.","https://www.youtube.com/results?search_query=bench+press+proper+form",["Feet planted","Shoulder blades set","Controlled touch"],["Elbows flaring excessively","Bouncing bar"],["Dumbbell Bench Press","Machine Chest Press"]),
E("Chest-Supported Row","Strength",4,"8–10",90,"Pull elbows toward hips and avoid shrugging.","https://www.youtube.com/results?search_query=chest+supported+row+form",["Chest stays supported","Lead with elbows","Pause at top"],["Shrugging","Jerking weight"],["Seated Cable Row","Lat Pulldown"]),
E("Dumbbell Shoulder Press","Hypertrophy",3,"8–10",90,"Brace trunk and finish with control.","https://www.youtube.com/results?search_query=dumbbell+shoulder+press+form",["Ribs down","Forearms vertical","Smooth lockout"],["Overarching back","Bouncing dumbbells"],["Machine Shoulder Press","Landmine Press"]),
E("Lat Pulldown","Hypertrophy",3,"10–12",75,"Drive elbows down; do not swing.","https://www.youtube.com/results?search_query=lat+pulldown+proper+form",["Chest tall","Elbows down","Control return"],["Swinging torso","Pulling behind neck"],["Assisted Pull-Up","Single-Arm Pulldown"]),
E("Push-up + Renegade Row","Durability",3,"6/side",75,"Keep hips square and move deliberately.","https://www.youtube.com/results?search_query=renegade+row+pushup",["Wide stable stance","Brace trunk","Slow row"],["Rotating hips","Rushing reps"],["Push-up + Plank Row","Cable Anti-Rotation Row"]),
E("Bike Intervals","Conditioning",6,"1 min hard / 2 min easy",0,"Hard but controlled. Maintain similar output across rounds.","https://www.youtube.com/results?search_query=stationary+bike+interval+training",["Smooth cadence","Hard rounds repeatable","Recover fully"],["All-out first round","Rocking hips"],["StairMaster Intervals","Rower Intervals"]),
E("Doorway Pec Stretch","Flexibility",2,"45 sec/side",20,"Gentle chest stretch without forcing the shoulder forward.","https://www.youtube.com/results?search_query=doorway+pec+stretch",["Gentle tension","Shoulder down","Turn body slowly"],["Forcing range","Shrugging"],["Wall Pec Stretch","Floor Chest Opener"]),
E("Child's Pose Lat Stretch","Flexibility",2,"45 sec",20,"Reach long through the arms and breathe into the upper back.","https://www.youtube.com/results?search_query=childs+pose+lat+stretch",["Hips back","Long reach","Slow breaths"],["Collapsing shoulders","Holding breath"],["Bench Lat Stretch","Prayer Stretch"])]},
{name:"C — Full-Body Athletic Conditioning",duration:85,focus:"Power • total-body muscle • CrossFit-style engine • trunk durability",exercises:[
E("Deep Squat Pry","Mobility",2,"45 sec",20,"Sit into a comfortable deep squat and gently open the hips.","https://www.youtube.com/results?search_query=deep+squat+pry+mobility",["Feet stable","Chest tall","Gentle hip opening"],["Forcing depth","Heels lifting"],["Cossack Squat","Goblet Squat Hold"]),
E("Inchworm to Down Dog","Mobility",2,"6",30,"Move smoothly through shoulders, trunk and posterior chain.","https://www.youtube.com/results?search_query=inchworm+to+downward+dog",["Walk hands under control","Strong plank","Press hips back"],["Sagging hips","Rushing"],["Bear Plank Walkout","World's Greatest Stretch"]),
E("Front Squat","Strength",4,"6",120,"Elbows high, brace hard, stand through the mid-foot.","https://www.youtube.com/results?search_query=front+squat+proper+form",["Elbows high","Brace before descent","Drive through mid-foot"],["Elbows dropping","Knees collapsing"],["Goblet Squat","Hack Squat"]),
E("Incline Dumbbell Press","Hypertrophy",3,"10",75,"Control the lowering phase and keep shoulders stable.","https://www.youtube.com/results?search_query=incline+dumbbell+press+form",["Shoulders set","Control descent","Press evenly"],["Overextending shoulders","Bouncing"],["Incline Machine Press","Push-up"]),
E("Single-Arm Cable Row","Hypertrophy",3,"10/side",75,"Keep ribs down and finish the pull with the back.","https://www.youtube.com/results?search_query=single+arm+cable+row",["Stable torso","Lead with elbow","Pause at ribs"],["Twisting trunk","Shrugging"],["One-Arm Dumbbell Row","Chest-Supported Row"]),
E("Kettlebell Swing","Power",5,"12",60,"Explosive hip snap; arms guide rather than lift.","https://www.youtube.com/results?search_query=kettlebell+swing+proper+form",["Hinge not squat","Snap hips","Neutral spine"],["Lifting with arms","Squatting too deep"],["Cable Pull-Through","Dumbbell Swing"]),
E("CrossFit Engine Circuit","Conditioning",5,"10 cal bike / 10 box step-ups / 8 DB push press / 10 KB deadlifts",75,"Sustainable pace. Keep movement quality consistent across all rounds.","https://www.youtube.com/results?search_query=crossfit+conditioning+circuit",["Pace round one conservatively","Move cleanly","Use full breaths"],["Racing the first round","Sloppy transitions"],["Bike + Step-Up Circuit","Rower + DB Circuit"]),
E("Pallof Press","Durability",3,"10/side",45,"Resist rotation; keep pelvis and ribs stacked.","https://www.youtube.com/results?search_query=pallof+press+proper+form",["Ribs stacked","Press straight out","Do not rotate"],["Leaning away","Holding breath"],["Cable Chop Hold","Suitcase Carry"]),
E("Hip Flexor + Rotation Stretch","Flexibility",2,"45 sec/side",20,"Open the hip flexor first, then add gentle thoracic rotation.","https://www.youtube.com/results?search_query=hip+flexor+rotation+stretch",["Glute engaged","Rotate upper back","Slow breaths"],["Arching lower back","Forcing twist"],["Couch Stretch","World's Greatest Stretch"]),
E("Figure-4 Glute Stretch","Flexibility",2,"45 sec/side",20,"Relax the hip and keep the lower back neutral.","https://www.youtube.com/results?search_query=figure+4+glute+stretch",["Relax shoulders","Neutral back","Gentle hip tension"],["Pulling aggressively","Twisting pelvis"],["Seated Glute Stretch","Pigeon Stretch"])]},
{name:"D — Lower Muscle + Long StairMaster",duration:80,focus:"Leg hypertrophy • joint durability • aerobic fat-loss work • lower-body flexibility",exercises:[
E("Ankle Dorsiflexion Rock","Mobility",2,"10/side",20,"Keep heel down and drive knee forward over the toes.","https://www.youtube.com/results?search_query=ankle+dorsiflexion+mobility",["Heel stays down","Knee tracks toes","Move slowly"],["Heel lifting","Foot collapsing"],["Calf Wall Mobilization","Split Squat Ankle Rock"]),
E("Cossack Squat","Mobility",2,"6/side",30,"Shift slowly side to side and use only a comfortable depth.","https://www.youtube.com/results?search_query=cossack+squat+mobility",["One leg bends, one stays long","Chest tall","Use comfortable range"],["Collapsing foot","Forcing depth"],["Lateral Lunge","Adductor Rockback"]),
E("Leg Press","Strength",4,"8",120,"Control depth and keep pelvis stable against the pad.","https://www.youtube.com/results?search_query=leg+press+proper+form",["Full foot pressure","Control depth","Do not lock knees hard"],["Pelvis curling off pad","Bouncing bottom"],["Hack Squat","Goblet Squat"]),
E("Walking Dumbbell Lunge","Hypertrophy",3,"10/leg",90,"Stay tall and control each step.","https://www.youtube.com/results?search_query=dumbbell+walking+lunge+form",["Tall torso","Stable step","Drive through front foot"],["Short unstable steps","Knee collapsing"],["Reverse Lunge","Split Squat"]),
E("Hip Thrust","Hypertrophy",4,"10",90,"Finish by squeezing glutes rather than extending the lower back.","https://www.youtube.com/results?search_query=hip+thrust+proper+form",["Chin tucked","Ribs down","Squeeze glutes"],["Overarching back","Feet too far away"],["Glute Bridge","Cable Pull-Through"]),
E("Hamstring Curl","Hypertrophy",3,"12",60,"Smooth tempo, full control.","https://www.youtube.com/results?search_query=hamstring+curl+proper+form",["Control both phases","Keep hips stable","Use full range"],["Jerking weight","Lifting hips"],["Romanian Deadlift","Swiss Ball Curl"]),
E("Step-Down Control","Durability",3,"8/leg",60,"Slow eccentric lowering; knee tracks over the foot.","https://www.youtube.com/results?search_query=step+down+exercise+knee+control",["Slow lowering","Knee tracks toes","Pelvis level"],["Dropping quickly","Hip shifting"],["Low Box Step-Up","Single-Leg Sit-to-Stand"]),
E("StairMaster Steady State","Conditioning",1,"25–30 min",0,"Sustainable pace. Hard breathing but still controlled.","https://www.youtube.com/results?search_query=stairmaster+steady+state+workout",["Tall posture","Light rail contact","Steady rhythm"],["Hanging on rails","Starting too fast"],["Incline Treadmill Walk","Bike Steady State"]),
E("Adductor Rockback Stretch","Flexibility",2,"8/side",20,"Move slowly back until you feel the inner-thigh stretch.","https://www.youtube.com/results?search_query=adductor+rockback",["Neutral spine","Hips back","Gentle range"],["Rounding aggressively","Bouncing"],["Cossack Hold","Frog Stretch"]),
E("Calf Wall Stretch","Flexibility",2,"45 sec/side",20,"Keep heel grounded and toes forward.","https://www.youtube.com/results?search_query=calf+wall+stretch",["Heel down","Toes forward","Lean gradually"],["Foot turning out","Bouncing"],["Step Calf Stretch","Down Dog Calf Stretch"])]}
];

const FAMILY = {
  "Hip 90/90 Flow":"hip90","World's Greatest Stretch":"worldStretch","Deadlift":"deadlift",
  "Bulgarian Split Squat":"splitSquat","Dumbbell Romanian Deadlift":"hinge","Farmer Carry":"carry",
  "StairMaster Intervals":"stairs","Couch Stretch":"couch","Supine Hamstring Stretch":"supineHam",
  "Band Shoulder Dislocates":"shoulderBand","Thoracic Rotation":"thoracic","Bench Press":"bench",
  "Chest-Supported Row":"chestRow","Dumbbell Shoulder Press":"shoulderPress","Lat Pulldown":"pulldown",
  "Push-up + Renegade Row":"renegade","Bike Intervals":"bike","Doorway Pec Stretch":"doorPec",
  "Child's Pose Lat Stretch":"childLat","Deep Squat Pry":"deepSquat","Inchworm to Down Dog":"inchworm",
  "Front Squat":"frontSquat","Incline Dumbbell Press":"inclinePress","Single-Arm Cable Row":"singleRow",
  "Kettlebell Swing":"swing","CrossFit Engine Circuit":"circuit","Pallof Press":"pallof",
  "Hip Flexor + Rotation Stretch":"hipFlexRotate","Figure-4 Glute Stretch":"figure4",
  "Ankle Dorsiflexion Rock":"ankleRock","Cossack Squat":"cossack","Leg Press":"legPress",
  "Walking Dumbbell Lunge":"walkingLunge","Hip Thrust":"hipThrust","Hamstring Curl":"hamCurl",
  "Step-Down Control":"stepDown","StairMaster Steady State":"stairs","Adductor Rockback Stretch":"adductor",
  "Calf Wall Stretch":"calfWall","Kettlebell Deadlift":"kbDeadlift"
};

const STEPS = {
  hip90:[
    ["Starting position","Sit tall with your front leg and back leg both bent close to 90 degrees. Keep both sit bones heavy and your chest lifted."],
    ["Brace the trunk","Place your fingertips lightly on the floor only for balance. Keep your ribs stacked over your pelvis."],
    ["Rotate through the hips","Move both knees through the middle under control. Let the hips rotate; do not push the knees down with your hands."],
    ["Own the opposite side","Arrive in the opposite 90/90 position, sit tall and pause for one smooth breath."],
    ["Repeat the flow","Continue side to side slowly for the prescribed repetitions without forcing range."]
  ],
  worldStretch:[
    ["Starting position","Step your right foot forward into a long lunge. Keep the whole right foot flat, extend the left leg behind you and place both hands inside the right foot."],
    ["Elbow to instep","Keep the front knee tracking with the toes. Lower the right elbow toward the inside of the right foot only as far as you can control."],
    ["Thoracic rotation","Keep the left hand planted. Rotate your chest toward the right knee and reach the right arm toward the ceiling."],
    ["Top position","Pause for one to two seconds. Keep the front heel down, hips controlled and chest open while you breathe."],
    ["Return and repeat","Bring the hand back to the floor under control. Complete the reps, then switch sides."]
  ],
  deadlift:[
    ["Set feet and bar","Stand about hip-width with the bar directly over mid-foot. Keep the bar close to your shins and distribute pressure through the whole foot."],
    ["Grip and brace","Hinge down, grip just outside your legs, breathe into the abdomen and brace firmly. Set your shoulders and remove slack from the bar."],
    ["Push the floor away","Drive through the whole foot. Let hips and shoulders rise together while the bar stays close to your legs."],
    ["Stand tall","Finish with knees and hips straight, glutes engaged and ribs stacked over the pelvis. Do not lean backward."],
    ["Lower and reset","Push the hips back first, keep the bar close, then bend the knees after the bar passes them. Reset before the next rep."]
  ],
  splitSquat:[
    ["Set your stance","Place the rear foot on the bench and the front foot far enough forward that your heel can stay flat."],
    ["Brace and descend","Stay tall and lower straight down under control. Keep the entire front foot planted."],
    ["Track the knee","Let the front knee travel naturally in line with the toes while the pelvis remains stable."],
    ["Drive through the front leg","Push through the whole front foot to stand. Use the back leg only for balance."],
    ["Reset and repeat","Regain balance at the top and complete all reps before switching legs."]
  ],
  hinge:[
    ["Set your stance","Stand hip-width with soft knees and the dumbbells close to the front of the thighs."],
    ["Push the hips back","Brace your trunk and hinge by sending the hips backward while the spine stays long."],
    ["Load the hamstrings","Lower only until the hamstrings limit your range. Keep the dumbbells close to the legs."],
    ["Drive the hips forward","Push through the feet and squeeze the glutes to return to standing."],
    ["Finish and reset","Stand tall without leaning backward, then re-brace before the next repetition."]
  ],
  carry:[
    ["Pick up safely","Stand between the weights, hinge down with a long spine and stand them up using the legs and hips."],
    ["Set tall posture","Keep ribs stacked over pelvis, shoulders stable and the weights hanging quietly by your sides."],
    ["Walk with short steps","Take controlled natural steps while keeping the torso from leaning or twisting."],
    ["Maintain breathing","Use smooth breaths without losing trunk tension or shrugging the shoulders."],
    ["Finish safely","Stop, hinge at the hips and place the weights down under control."]
  ],
  stairs:[
    ["Step on safely","Use the rails only for balance while you establish your footing and cadence."],
    ["Find tall posture","Keep the chest tall, hips under you and only light contact with the rails."],
    ["Build to target effort","Increase the level gradually until you reach the programmed effort."],
    ["Hold a repeatable rhythm","Use full-foot pressure and maintain the same controlled cadence across the interval."],
    ["Recover deliberately","Reduce the level for recovery while staying upright and controlling your breathing."]
  ],
  couch:[
    ["Set the kneeling position","Place one knee near the wall or bench and the opposite foot forward in a stable half-kneeling stance."],
    ["Tuck the pelvis","Gently tuck the pelvis and squeeze the glute on the stretching side."],
    ["Bring the torso tall","Raise the torso without arching the lower back. Keep the ribs down."],
    ["Find the stretch","Shift only enough to feel the front of the hip and thigh opening without knee pain."],
    ["Breathe and switch","Hold for the prescribed time using relaxed breaths, then change sides."]
  ],
  supineHam:[
    ["Lie tall","Lie on your back with the pelvis neutral and shoulders relaxed."],
    ["Raise one leg","Bring one leg upward using a strap or your hands while the other leg stays controlled."],
    ["Keep the pelvis stable","Stop before the pelvis rolls or the lower back changes position."],
    ["Find gentle tension","Straighten the knee only as far as comfortable and breathe without forcing range."],
    ["Hold and switch","Maintain the prescribed time, lower slowly and repeat on the other side."]
  ],
  shoulderBand:[
    ["Choose a wide grip","Hold the band wider than shoulder-width so the movement can remain smooth and pain-free."],
    ["Set ribs and posture","Stand tall and keep the ribs from flaring as the arms begin to rise."],
    ["Arc overhead","Move the band in a wide arc overhead without aggressively bending the elbows."],
    ["Move behind only if comfortable","Continue behind the body only through a pain-free shoulder range."],
    ["Return slowly","Reverse the arc under control and widen the grip if the shoulders shrug or pinch."]
  ],
  thoracic:[
    ["Set hips stable","Choose the prescribed position and keep the pelvis quiet so the motion comes from the upper back."],
    ["Brace gently","Create light abdominal tension and keep the lower back from doing the rotation."],
    ["Rotate the chest","Turn the rib cage and shoulders together toward the working side."],
    ["Exhale into range","Use a slow exhale near end range without forcing the twist."],
    ["Return and repeat","Come back under control and complete the reps before switching sides."]
  ],
  bench:[
    ["Set your base","Lie with eyes under the bar, feet planted and shoulder blades pulled down and back into the bench."],
    ["Grip and unrack","Use an even grip, keep wrists stacked and bring the bar over the shoulders."],
    ["Lower with control","Bring the bar toward the lower chest while the elbows track at a controlled angle."],
    ["Press from the chest","Drive through the feet and press the bar up and slightly back while the shoulders remain anchored."],
    ["Lock out and reset","Finish over the shoulders without losing upper-back tension, then take another controlled breath."]
  ],
  chestRow:[
    ["Set against the pad","Place your chest firmly on the support, feet stable and arms hanging naturally."],
    ["Set the shoulders","Keep your neck long and shoulder blades controlled without shrugging."],
    ["Pull with the elbows","Drive the elbows back toward the hips and let the back muscles move the load."],
    ["Pause at the top","Briefly squeeze the shoulder blades without lifting the chest from the pad."],
    ["Control the return","Straighten the arms slowly and repeat without losing posture."]
  ],
  shoulderPress:[
    ["Set seated posture","Plant the feet, brace the trunk and start the dumbbells around shoulder height."],
    ["Keep ribs down","Brace before pressing so the lower back does not arch to create range."],
    ["Press overhead","Drive the dumbbells upward smoothly while keeping the shoulders controlled."],
    ["Finish stacked","End with the weights over the shoulders and the torso still tall."],
    ["Lower with control","Return to shoulder height slowly, reset the brace and repeat."]
  ],
  pulldown:[
    ["Set your seat","Secure the thighs, take a comfortable grip and sit tall with the chest lifted."],
    ["Set shoulders down","Create tension by drawing the shoulders away from the ears before pulling."],
    ["Drive elbows down","Pull the bar toward the upper chest by driving elbows down and slightly back."],
    ["Pause at the bottom","Keep the torso controlled and avoid pulling the bar behind the neck."],
    ["Control the return","Let the arms straighten overhead slowly without losing your seated posture."]
  ],
  renegade:[
    ["Set a wide plank","Place hands on the dumbbells, feet wider than normal and make a straight line from head to heels."],
    ["Brace before moving","Squeeze glutes and trunk so the hips stay square to the floor."],
    ["Perform the push-up","Lower the chest under control and press back to a strong plank."],
    ["Row one side","Pull one dumbbell toward the ribs without letting the pelvis rotate."],
    ["Reset and alternate","Return the dumbbell, re-establish the plank and repeat on the other side."]
  ],
  bike:[
    ["Set the bike","Adjust the seat so the knee remains slightly bent at the bottom of the pedal stroke."],
    ["Establish cadence","Start easy, relax the shoulders and pedal smoothly before adding resistance."],
    ["Build the work interval","Increase resistance or cadence to the programmed hard effort without bouncing."],
    ["Hold smooth power","Keep knees tracking forward and maintain an even pedal stroke."],
    ["Recover and repeat","Reduce effort, regain breathing control and prepare for the next round."]
  ],
  doorPec:[
    ["Set the arm","Place the forearm on the doorway with the shoulder relaxed down from the ear."],
    ["Stand tall","Stack ribs over pelvis and keep the shoulder from rolling forward."],
    ["Turn away slowly","Rotate the body away from the planted arm until you feel a gentle chest stretch."],
    ["Hold without forcing","Keep the sensation in the chest/front shoulder, not a sharp pinch inside the joint."],
    ["Return and switch","Ease out of the stretch and repeat on the other side."]
  ],
  childLat:[
    ["Set child's pose","Kneel, sit the hips toward the heels and reach both hands forward."],
    ["Lengthen the spine","Keep the neck relaxed and reach the hands away from the hips."],
    ["Bias the lats","Press the palms gently into the floor or bench while keeping the ribs controlled."],
    ["Breathe into the upper back","Use slow breaths to expand the rib cage without shrugging."],
    ["Hold and release","Stay for the prescribed time, then walk the hands back under control."]
  ],
  deepSquat:[
    ["Set your stance","Stand slightly wider than hip-width with toes turned only as much as needed for comfort."],
    ["Descend slowly","Sit between the hips while keeping the whole foot planted and the chest lifted."],
    ["Use the elbows gently","At the bottom, place elbows inside the knees and apply only gentle outward pressure."],
    ["Pry side to side","Shift subtly from side to side without letting the arches collapse or heels lift."],
    ["Breathe and exit","Take slow breaths, then drive through the feet to stand under control."]
  ],
  inchworm:[
    ["Start tall","Stand with feet stable, soften the knees and prepare to hinge toward the floor."],
    ["Walk hands forward","Place the hands down and walk them away while keeping the movement controlled."],
    ["Reach a strong plank","Finish with shoulders over hands and a braced trunk; do not let the hips sag."],
    ["Press into down dog","Push the floor away, send hips up and back and lengthen through the posterior chain."],
    ["Walk back and stand","Return to plank, walk the hands toward the feet and stand under control."]
  ],
  frontSquat:[
    ["Rack the bar","Rest the bar across the front shoulders, elbows high and feet in your comfortable squat stance."],
    ["Brace before descent","Take a breath, brace around the trunk and keep pressure through the whole foot."],
    ["Sit between the hips","Bend knees and hips together while keeping the elbows high."],
    ["Reach controlled depth","Descend only as far as you can keep the rack position and spinal control."],
    ["Stand through mid-foot","Drive the floor away, keep elbows up and finish tall before resetting."]
  ],
  inclinePress:[
    ["Set the bench and shoulders","Sit against the incline bench with feet planted and shoulder blades stable against the pad."],
    ["Position the dumbbells","Start the dumbbells beside the upper chest with wrists stacked over elbows."],
    ["Press evenly","Drive both dumbbells upward while keeping ribs controlled and shoulders stable."],
    ["Finish under control","Reach the top without crashing the dumbbells together or overextending the shoulders."],
    ["Lower slowly","Return to the start with a deliberate lowering phase and repeat."]
  ],
  singleRow:[
    ["Set a stable base","Square the hips and shoulders to the cable, brace the trunk and begin with the working arm long."],
    ["Initiate with the back","Start the pull by setting the shoulder blade rather than twisting the torso."],
    ["Drive elbow to ribs","Pull the elbow back toward the ribs while keeping the chest tall."],
    ["Pause without rotating","Finish the row with the torso still square and the shoulder away from the ear."],
    ["Return slowly","Reach forward under control and repeat before switching sides."]
  ],
  swing:[
    ["Setup","Feet shoulder-width apart with the kettlebell a short step ahead. Hinge at the hips, keep a neutral spine and chest up, and grasp the handle with both hands."],
    ["Hike (backswing)","Hike the kettlebell back between your legs. Keep your back flat, shoulders packed and eyes forward while the hips load."],
    ["Hip drive","Explosively extend your hips and drive the feet into the floor. The bell rises to chest height from hip power while the arms stay relaxed."],
    ["Float at the top","Let the bell float at chest height with arms straight and shoulders down. Stand tall with core tight and glutes squeezed; don't lift with the arms."],
    ["Return","Let the kettlebell drop naturally, then hinge at the hips to guide it back between the thighs. Keep the back flat, stay in control and repeat."]
  ],
  kbDeadlift:[
    ["Setup","Stand with feet shoulder-width apart and the kettlebell between your feet. Hinge at the hips with a neutral spine, chest up and eyes forward."],
    ["Grip","Grasp the handle with both hands, arms straight. Set the shoulders down and back, brace the core and keep weight through the mid-foot and heels."],
    ["Lift","Drive through the floor and extend hips and knees together, keeping the kettlebell close to your body until you stand tall."],
    ["Squeeze","Pause at the top for one second. Squeeze the glutes, keep the core tight and shoulders back without leaning backward."],
    ["Lower","Push the hips back to hinge, keep the bell close and the spine neutral, and lower until it is just above the floor. Repeat."]
  ],
  circuit:[
    ["Set the first station","Arrange all equipment before starting so each transition is safe and efficient."],
    ["Start conservatively","Begin round one below maximum effort and establish a sustainable rhythm."],
    ["Use clean movement","Complete every station with the same technique standards you would use outside the circuit."],
    ["Control transitions","Move efficiently between stations without rushing setup or sacrificing form."],
    ["Finish repeatably","Aim for similar quality across all rounds rather than exhausting yourself in round one."]
  ],
  pallof:[
    ["Set side-on to the cable","Stand or kneel perpendicular to the cable with the handle held at your chest."],
    ["Stack ribs and pelvis","Brace gently and keep shoulders and hips square."],
    ["Press straight out","Extend both arms directly forward while resisting the cable's pull to rotate you."],
    ["Hold square","Pause briefly with the arms long and breathe without losing trunk position."],
    ["Return to chest","Bring the handle back slowly and repeat before turning to the other side."]
  ],
  hipFlexRotate:[
    ["Set half-kneeling","Place one knee down and the opposite foot forward in a stable lunge stance."],
    ["Tuck pelvis and engage glute","Gently tuck the pelvis and squeeze the glute on the kneeling side."],
    ["Open the hip first","Shift forward only enough to feel the hip flexor stretch without arching the lower back."],
    ["Add upper-back rotation","Keep the pelvis controlled and rotate the chest toward the front leg."],
    ["Breathe and switch","Hold briefly, return to centre and repeat on the other side."]
  ],
  figure4:[
    ["Set the figure-four","Lie or sit comfortably and cross one ankle over the opposite thigh above the knee."],
    ["Keep pelvis square","Relax the shoulders and keep the pelvis from twisting."],
    ["Draw the legs closer","Bring the supporting thigh toward you until you feel the glute stretch."],
    ["Hold gentle tension","Keep the crossed foot active and avoid forcing the knee downward."],
    ["Breathe and switch","Use slow breaths, release smoothly and change sides."]
  ],
  ankleRock:[
    ["Set the foot","Place the whole working foot flat with toes pointing naturally forward."],
    ["Keep heel grounded","Brace the arch and keep the heel down throughout the drill."],
    ["Drive knee forward","Move the knee over the toes while the foot remains stable."],
    ["Pause at end range","Stop before the heel rises or the arch collapses and hold briefly."],
    ["Return and repeat","Rock back smoothly and repeat the prescribed reps on each side."]
  ],
  cossack:[
    ["Take a wide stance","Stand much wider than shoulder-width with both feet controlled and the chest tall."],
    ["Shift to one side","Bend one knee and send that hip back while the opposite leg stays long."],
    ["Own the foot position","Keep the working foot planted. Let the straight-leg toes lift if needed."],
    ["Reach comfortable depth","Move only as deep as your hip and ankle mobility allow without pain."],
    ["Drive back to centre","Push through the bent-leg foot, return to centre and repeat to the other side."]
  ],
  legPress:[
    ["Set seat and feet","Position your back and pelvis firmly against the pad and place the feet securely on the platform."],
    ["Unlock the sled","Brace the trunk and release the safety while keeping knees aligned with toes."],
    ["Lower under control","Bend knees and hips only as far as you can keep the pelvis against the pad."],
    ["Press through whole foot","Drive the platform away without letting the knees collapse inward."],
    ["Finish without hard lockout","Straighten the legs under control, keep slight softness at the knees and repeat."]
  ],
  walkingLunge:[
    ["Stand tall with the load","Hold the dumbbells quietly at your sides, ribs stacked and eyes forward."],
    ["Take a stable step","Step far enough forward to create a stable base. Plant the entire front foot."],
    ["Lower under control","Drop the back knee toward the floor while the front knee tracks with the toes."],
    ["Drive forward","Push through the front foot and bring the back leg through without wobbling."],
    ["Repeat smoothly","Alternate legs with deliberate steps and maintain posture as fatigue rises."]
  ],
  hipThrust:[
    ["Set upper back and feet","Place the upper back against the bench, feet hip-width and the load securely across the hips."],
    ["Tuck and brace","Keep the chin slightly tucked and ribs down so the movement comes from the hips."],
    ["Drive through the feet","Push the floor away and raise the hips by squeezing the glutes."],
    ["Reach full hip extension","Finish with torso and thighs roughly level while the pelvis stays controlled."],
    ["Lower under control","Descend smoothly, keep foot position and repeat."]
  ],
  hamCurl:[
    ["Set the machine","Align the machine pivot with the knee and secure the pad comfortably against the lower leg."],
    ["Stabilize the hips","Keep the pelvis in contact with the pad and brace lightly."],
    ["Curl smoothly","Bend the knees through the available range without jerking the weight."],
    ["Squeeze briefly","Pause at the shortened position while the hips remain still."],
    ["Control the return","Lower the weight slowly until the knees are nearly straight, then repeat."]
  ],
  stepDown:[
    ["Stand on the step","Balance on one leg near the edge with the pelvis level and the whole supporting foot planted."],
    ["Begin the descent","Bend the standing knee and hip slowly while the free heel travels toward the floor."],
    ["Track the knee","Keep the knee aligned over the foot rather than collapsing inward."],
    ["Touch lightly","Use only the depth you can control and lightly tap the heel without transferring weight."],
    ["Drive back up","Push through the standing foot and return to the top with the pelvis level."]
  ],
  adductor:[
    ["Set all fours","Start on hands and knees, then extend one leg out to the side with the foot planted."],
    ["Keep a neutral spine","Brace gently and keep the back long rather than rounding."],
    ["Rock hips backward","Send the hips toward the heel of the kneeling leg while the extended leg stays long."],
    ["Find inner-thigh tension","Stop when you feel a gentle adductor stretch without twisting the pelvis."],
    ["Return and repeat","Glide forward smoothly and repeat before switching sides."]
  ],
  calfWall:[
    ["Set at the wall","Place hands on the wall and step the stretching leg behind you with toes pointing forward."],
    ["Keep heel down","Press the back heel toward the floor and keep the arch controlled."],
    ["Lean forward gradually","Bend the front knee and move the body toward the wall without turning the back foot out."],
    ["Hold the calf stretch","Keep the back knee straight and breathe while maintaining heel contact."],
    ["Release and switch","Ease out slowly and repeat on the opposite side."]
  ]
};

function feelFor(f){
  const m={
    hip90:"Rotation deep around the hips, not pressure in the knees.",
    worldStretch:"A controlled stretch through the hip flexors/groin plus rotation through the upper back.",
    deadlift:"Hamstrings, glutes, upper back and trunk tension while the bar stays close.",
    splitSquat:"Front-leg glute and quadriceps working with stable balance.",
    hinge:"Hamstrings and glutes loading as the hips travel backward.",
    carry:"Grip, trunk and upper back working while posture stays tall.",
    stairs:"Leg and cardiovascular effort with controlled posture and breathing.",
    couch:"Front of the hip and thigh stretching with the glute engaged.",
    supineHam:"Gentle hamstring tension while the pelvis stays stable.",
    shoulderBand:"A smooth shoulder/chest stretch without pinching.",
    thoracic:"Rotation through the upper back rather than the lower back.",
    bench:"Chest, triceps and shoulders working while the upper back remains stable.",
    chestRow:"Mid-back and lats pulling without shrugging.",
    shoulderPress:"Shoulders and triceps working while the trunk stays stacked.",
    pulldown:"Lats and upper back working as the elbows drive downward.",
    renegade:"Chest, back and trunk working while the pelvis stays square.",
    bike:"Smooth cardiovascular and leg effort without bouncing.",
    doorPec:"Gentle stretch through the chest/front shoulder.",
    childLat:"Lats and upper back lengthening with relaxed breathing.",
    deepSquat:"Hips, groin and ankles opening while the heels stay grounded.",
    inchworm:"Shoulders, trunk and posterior chain moving through a controlled sequence.",
    frontSquat:"Quadriceps, glutes and trunk working while the feet stay connected to the floor.",
    inclinePress:"Upper chest, shoulders and triceps with stable shoulder blades.",
    singleRow:"Back and lat tension without torso rotation.",
    swing:"Glutes and hamstrings producing the power; the arms should feel secondary.",
    circuit:"Whole-body and cardiovascular effort that remains technically repeatable.",
    pallof:"Deep trunk tension resisting rotation.",
    hipFlexRotate:"Hip flexor opening plus upper-back rotation.",
    figure4:"Glute/deep hip stretch without knee pressure.",
    ankleRock:"A gentle ankle/calf stretch while the heel remains down.",
    cossack:"Adductors and hip mobility on the long-leg side with the working foot stable.",
    legPress:"Quadriceps and glutes working while the pelvis stays against the pad.",
    walkingLunge:"Front-leg glute and quadriceps with controlled balance from step to step.",
    hipThrust:"Strong glute contraction at the top without lower-back compression.",
    hamCurl:"Hamstrings shortening and controlling the return.",
    stepDown:"Quadriceps and glute controlling the lowering with the knee aligned.",
    adductor:"Inner-thigh/adductor stretch with a neutral spine.",
    calfWall:"Calf stretch while the heel remains grounded.",
    kbDeadlift:"Glutes and hamstrings doing the lifting, with the core braced and the lower back neutral."
  };
  return m[f]||"The target muscles working with controlled, pain-free movement.";
}

/* Library-only exercises (available as swaps, not in a default session). */
const EXTRA = [
E("Kettlebell Deadlift","Strength",4,"8",90,"Hinge, grip, drive the floor away and squeeze at the top. Keep the bell close.","",["Hinge, don't squat","Bell stays close","Squeeze glutes at the top"],["Rounding the lower back","Leaning back at lockout"],["Dumbbell Romanian Deadlift","Deadlift"])
];
