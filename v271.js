"use strict";
/* Zahi Fit v2.9.0 — Professional Visual PT Coach */
(() => {
  const VERSION = "v2.9.0";
  const RATE_KEY = "zahiFitVoiceRateV29";
  const MODE_KEY = "zahiFitVoiceModeV29";
  let rate = Number(localStorage.getItem(RATE_KEY) || "0.82");
  let voiceMode = localStorage.getItem(MODE_KEY) || "full";
  let demo = null, ex = null, step = 0, utterance = null, paused = false;

  const FAMILY = {
    "Hip 90/90 Flow":"hip90","World's Greatest Stretch":"lungeRotate","Deadlift":"deadlift",
    "Bulgarian Split Squat":"splitSquat","Dumbbell Romanian Deadlift":"hinge","Farmer Carry":"carry",
    "StairMaster Intervals":"stairs","Couch Stretch":"kneelingStretch","Supine Hamstring Stretch":"supineStretch",
    "Band Shoulder Dislocates":"shoulderMob","Thoracic Rotation":"thoracic","Bench Press":"benchPress",
    "Chest-Supported Row":"row","Dumbbell Shoulder Press":"overheadPress","Lat Pulldown":"pulldown",
    "Push-up + Renegade Row":"plankRow","Bike Intervals":"bike","Doorway Pec Stretch":"doorStretch",
    "Child's Pose Lat Stretch":"childStretch","Deep Squat Pry":"deepSquat","Inchworm to Down Dog":"inchworm",
    "Front Squat":"frontSquat","Incline Dumbbell Press":"inclinePress","Single-Arm Cable Row":"cableRow",
    "Kettlebell Swing":"swing","CrossFit Engine Circuit":"circuit","Pallof Press":"pallof",
    "Hip Flexor + Rotation Stretch":"kneelingRotate","Figure-4 Glute Stretch":"figure4",
    "Ankle Dorsiflexion Rock":"ankleRock","Cossack Squat":"cossack","Leg Press":"legPress",
    "Walking Dumbbell Lunge":"walkingLunge","Hip Thrust":"hipThrust","Hamstring Curl":"hamCurl",
    "Step-Down Control":"stepDown","StairMaster Steady State":"stairs","Adductor Rockback Stretch":"rockback",
    "Calf Wall Stretch":"calfStretch"
  };

  const FAMILY_STEPS = {
    hip90:[
      ["Set the 90/90 position","Sit with both knees bent about 90 degrees. Keep your chest tall and both hips heavy toward the floor."],
      ["Create a stable base","Place your hands lightly for balance. Keep your ribs stacked rather than collapsing over the front leg."],
      ["Rotate from the hips","Move both knees through the centre under control. Let the hips rotate; do not force the knees down with your hands."],
      ["Own the opposite side","Arrive in the opposite 90/90 position and pause briefly while staying tall through the trunk."],
      ["Flow and breathe","Continue side to side for the prescribed reps. Use slow breathing and only the range you can control."]
    ],
    lungeRotate:[
      ["Starting position","Step your right foot forward into a long lunge. Keep the whole right foot flat, left leg extended behind you, and both hands inside the right foot."],
      ["Elbow to instep","Keep the front knee tracking over the toes. Lower the right elbow toward the inside of the right foot only as far as you can control."],
      ["Thoracic rotation","Keep the left hand planted. Turn your chest toward the right knee and reach the right arm toward the ceiling. Follow the hand with your eyes."],
      ["Top position","Pause one to two seconds. Keep the front heel down, hips controlled and chest open while taking a smooth breath."],
      ["Return and repeat","Bring the hand back to the floor under control. Complete the prescribed repetitions, then switch sides."]
    ],
    deadlift:[
      ["Set feet and bar","Stand about hip-width with the bar over mid-foot. Keep the bar close to your shins and pressure through the whole foot."],
      ["Grip and brace","Hinge down, grip just outside your legs, breathe into your abdomen and brace firmly. Set the shoulders and remove slack from the bar."],
      ["Push the floor away","Drive through the whole foot. Let hips and shoulders rise together while the bar stays close to your legs."],
      ["Stand tall","Finish with hips and knees straight, glutes engaged and ribs stacked over the pelvis. Do not lean backward."],
      ["Lower and reset","Push the hips back first, keep the bar close, then bend the knees after the bar passes them. Reset your brace before the next rep."]
    ],
    hinge:[
      ["Set your stance","Stand hip-width with soft knees and the dumbbells close to the thighs."],
      ["Brace and hinge","Brace the trunk, push the hips backward and keep the spine long. The knees bend only slightly."],
      ["Load the hamstrings","Lower the weights close to the legs until the hamstrings limit your range. Do not chase extra depth by rounding."],
      ["Drive the hips forward","Push the floor away and squeeze the glutes to return to standing while keeping the weights close."],
      ["Reset each rep","Finish tall without leaning back. Re-brace and repeat with the same controlled path."]
    ],
    splitSquat:[
      ["Set the stance","Place the rear foot on the bench and position the front foot far enough forward that you can descend without the heel lifting."],
      ["Brace and descend","Stay tall, brace the trunk and lower straight down under control. Keep the front foot fully planted."],
      ["Track the knee","Let the front knee travel naturally while staying in line with the toes. Keep the pelvis level."],
      ["Drive through the front foot","Push through the whole front foot to stand. Use the back leg for balance, not propulsion."],
      ["Reset and repeat","Regain balance at the top and repeat all reps before switching legs."]
    ],
    walkingLunge:[
      ["Stand tall with the load","Hold the dumbbells quietly at your sides, ribs stacked and eyes forward."],
      ["Take a stable step","Step far enough forward to create a stable base. Plant the entire front foot."],
      ["Lower under control","Drop the back knee toward the floor while the front knee tracks with the toes."],
      ["Drive forward","Push through the front foot and bring the back leg through without wobbling side to side."],
      ["Repeat smoothly","Alternate legs with deliberate steps and maintain the same posture as fatigue rises."]
    ],
    frontSquat:[
      ["Rack the bar","Rest the bar across the front shoulders, elbows high, chest tall and feet in your comfortable squat stance."],
      ["Brace before descent","Take a breath, brace around the trunk and keep pressure through the whole foot."],
      ["Sit between the hips","Bend knees and hips together. Keep elbows high and knees tracking over the toes."],
      ["Reach controlled depth","Descend only as far as you can maintain the rack position, whole-foot pressure and spinal control."],
      ["Stand through mid-foot","Drive the floor away, keep elbows up and finish tall before resetting the breath."]
    ],
    deepSquat:[
      ["Set your stance","Stand slightly wider than hip-width with toes turned only as much as needed for comfort."],
      ["Descend slowly","Sit between the hips while keeping the whole foot planted and chest lifted."],
      ["Use the elbows gently","At the bottom, place elbows inside the knees and apply only gentle outward pressure."],
      ["Pry side to side","Shift subtly from side to side without letting the arches collapse or heels lift."],
      ["Breathe and exit","Take slow breaths, then drive through the feet to stand under control."]
    ],
    cossack:[
      ["Take a wide stance","Stand much wider than shoulder-width with both feet controlled and chest tall."],
      ["Shift to one side","Bend one knee and send that hip back while the opposite leg stays long."],
      ["Own the foot position","Keep the working foot planted. Let the straight-leg toes lift if needed, but do not collapse the arch."],
      ["Reach comfortable depth","Stay tall and move only as deep as your hip and ankle mobility allow without pain."],
      ["Drive back to centre","Push through the bent-leg foot to return to centre, then repeat to the other side."]
    ],
    carry:[
      ["Pick up safely","Stand between the weights, hinge down with a braced trunk and stand them up without rounding."],
      ["Set tall posture","Keep ribs stacked over pelvis, shoulders stable and the weights hanging quietly by your sides."],
      ["Walk with short steps","Take controlled, natural steps and keep the torso from leaning or twisting."],
      ["Maintain breathing","Use controlled breaths without losing trunk tension or shrugging the shoulders."],
      ["Finish safely","Stop, hinge at the hips and place the weights down under control."]
    ],
    stairs:[
      ["Step on safely","Use the rails only for balance while you establish your footing and cadence."],
      ["Find tall posture","Keep chest tall, hips under you and only light contact with the rails."],
      ["Build to target effort","Increase level gradually until you reach the programmed intensity without hanging on the machine."],
      ["Hold repeatable rhythm","Use full-foot pressure on each step and keep the same controlled cadence through the interval."],
      ["Recover deliberately","Reduce level for the easy period while staying upright and breathing deeply."]
    ],
    bike:[
      ["Set the bike","Adjust the seat so the knee remains slightly bent at the bottom of the pedal stroke."],
      ["Establish cadence","Start easy, relax the shoulders and pedal smoothly before increasing resistance."],
      ["Build the work interval","Increase resistance or cadence to the programmed hard effort without bouncing in the saddle."],
      ["Hold smooth power","Keep knees tracking forward and maintain an even pedal stroke throughout the interval."],
      ["Recover and repeat","Reduce effort during the recovery period, regain breathing control and prepare for the next round."]
    ],
    benchPress:[
      ["Set your base","Lie with eyes under the bar, feet firmly planted and shoulder blades pulled down and back into the bench."],
      ["Grip and unrack","Use an even grip, straighten the wrists and bring the bar over the shoulders with the upper back still tight."],
      ["Lower with control","Bring the bar toward the lower chest while the elbows track at a controlled angle rather than flaring straight out."],
      ["Press from the chest","Drive through the feet and press the bar up and slightly back while keeping the shoulders anchored."],
      ["Lock out and reset","Finish over the shoulders without losing upper-back tension, then take another controlled breath."]
    ],
    inclinePress:[
      ["Set the bench and shoulders","Sit against the incline bench with feet planted and shoulder blades stable against the pad."],
      ["Position the dumbbells","Start the dumbbells beside the upper chest with wrists stacked over elbows."],
      ["Press evenly","Drive both dumbbells upward while keeping ribs controlled and shoulders from rolling forward."],
      ["Finish under control","Reach the top without crashing the dumbbells together or overextending the shoulders."],
      ["Lower slowly","Return to the start with a deliberate lowering phase and repeat with the same path."]
    ],
    overheadPress:[
      ["Set seated posture","Plant the feet, brace the trunk and start dumbbells around shoulder height with forearms close to vertical."],
      ["Keep ribs down","Brace before pressing so the lower back does not arch to create range."],
      ["Press overhead","Drive the dumbbells upward in a smooth path while keeping the shoulders controlled."],
      ["Finish stacked","End with the weights over the shoulders and the torso still tall rather than leaning back."],
      ["Lower with control","Return to shoulder height slowly, reset the brace and repeat."]
    ],
    row:[
      ["Set against the pad","Place the chest firmly on the support, feet stable and arms hanging naturally."],
      ["Set the shoulders","Keep the neck long and shoulder blades controlled without shrugging toward the ears."],
      ["Pull with the elbows","Drive the elbows back toward the hips and let the back muscles move the load."],
      ["Pause at the top","Briefly squeeze the shoulder blades without lifting the chest away from the pad."],
      ["Control the return","Straighten the arms slowly and allow the shoulder blades to move forward without losing posture."]
    ],
    cableRow:[
      ["Set a stable base","Square the hips and shoulders to the cable, brace the trunk and begin with the working arm long."],
      ["Initiate with the back","Start the pull by setting the shoulder blade rather than twisting the torso."],
      ["Drive elbow to ribs","Pull the elbow back toward the ribs while keeping the chest tall."],
      ["Pause without rotating","Finish the row with the torso still square and the shoulder away from the ear."],
      ["Return slowly","Reach forward under control, keep the ribs stacked and repeat before switching sides."]
    ],
    pulldown:[
      ["Set your seat","Secure the thighs under the pad, take a comfortable grip and sit tall with the chest lifted."],
      ["Set shoulders down","Before pulling, create tension by drawing the shoulders away from the ears."],
      ["Drive elbows down","Pull the bar toward the upper chest by driving elbows down and slightly back."],
      ["Pause at the bottom","Keep the torso controlled and avoid pulling the bar behind the neck."],
      ["Control the return","Let the arms straighten overhead slowly without losing your seated position."]
    ],
    shoulderMob:[
      ["Choose a wide grip","Hold the band wider than shoulder-width so the movement can stay smooth and pain-free."],
      ["Set ribs and posture","Stand tall, brace gently and keep the ribs from flaring as the arms rise."],
      ["Arc overhead","Move the band in a wide arc over the head without bending the elbows excessively."],
      ["Move behind only if comfortable","Continue behind the body only through a pain-free shoulder range; do not force it."],
      ["Return slowly","Reverse the arc under control and adjust the grip wider if the shoulders shrug or pinch."]
    ],
    thoracic:[
      ["Set hips stable","Choose the prescribed position and keep the pelvis quiet so the motion comes from the upper back."],
      ["Brace gently","Create light abdominal tension and keep the lower back from doing the rotation."],
      ["Rotate the chest","Turn the rib cage and shoulders as one unit toward the working side."],
      ["Exhale into range","Use a slow exhale near end range without forcing the twist."],
      ["Return and repeat","Come back under control and repeat the prescribed reps before switching sides."]
    ],
    plankRow:[
      ["Set a wide plank","Place hands on the dumbbells, feet wider than normal and create a straight line from head to heels."],
      ["Brace before rowing","Squeeze glutes and trunk so the hips stay square to the floor."],
      ["Perform the push-up","Lower the chest under control and press back to a strong plank."],
      ["Row one side","Pull one dumbbell toward the ribs without letting the pelvis rotate."],
      ["Reset and alternate","Return the dumbbell, re-establish the plank and repeat on the other side."]
    ],
    swing:[
      ["Set the bell ahead","Stand behind the kettlebell with feet about shoulder-width and hinge to grip it."],
      ["Hike the bell back","Pull the bell between the thighs while keeping the spine long and shins relatively vertical."],
      ["Snap the hips","Drive the feet into the floor and extend the hips explosively. The arms guide; they do not lift."],
      ["Float at the top","Let the bell rise from hip power while the body finishes tall and braced."],
      ["Reload the hinge","Guide the bell back between the thighs, send the hips back and repeat without turning it into a squat."]
    ],
    pallof:[
      ["Set side-on to cable","Stand or kneel perpendicular to the cable with feet stable and the handle held at the chest."],
      ["Stack ribs and pelvis","Brace gently and keep shoulders and hips square rather than leaning away."],
      ["Press straight out","Extend both arms directly forward while resisting the cable's pull to rotate you."],
      ["Hold square","Pause briefly with arms long, breathing without losing your trunk position."],
      ["Return to chest","Bring the handle back slowly and repeat before turning around for the other side."]
    ],
    hipThrust:[
      ["Set upper back and feet","Place the upper back against the bench, feet about hip-width and the load securely across the hips."],
      ["Tuck and brace","Keep the chin slightly tucked and ribs down so the movement comes from the hips, not the lower back."],
      ["Drive through the feet","Push the floor away and raise the hips by squeezing the glutes."],
      ["Reach full hip extension","Finish with torso and thighs roughly level while the pelvis stays controlled."],
      ["Lower under control","Descend until the hips are ready for the next rep without losing foot position."]
    ],
    legPress:[
      ["Set seat and feet","Position the back and pelvis firmly against the pad and place feet securely on the platform."],
      ["Unlock the sled","Brace the trunk and release the safety while keeping the knees aligned with the toes."],
      ["Lower under control","Bend the knees and hips only as far as you can keep the pelvis against the pad."],
      ["Press through whole foot","Drive the platform away without letting the knees collapse inward."],
      ["Finish without hard lockout","Straighten the legs under control, keep a slight softness at the knees and repeat."]
    ],
    hamCurl:[
      ["Set the machine","Align the machine pivot with the knee and secure the pad comfortably against the lower leg."],
      ["Stabilize the hips","Keep the pelvis in contact with the pad and brace lightly before curling."],
      ["Curl smoothly","Bend the knees through the available range without jerking the weight."],
      ["Squeeze briefly","Pause at the shortened position while the hips remain still."],
      ["Control the return","Lower the weight slowly until the knees are nearly straight, then repeat."]
    ],
    stepDown:[
      ["Stand on the step","Balance on one leg near the edge with the pelvis level and the whole supporting foot planted."],
      ["Begin the descent","Bend the standing knee and hip slowly while the free heel travels toward the floor."],
      ["Track the knee","Keep the knee aligned over the foot rather than collapsing inward."],
      ["Touch lightly","Use only the depth you can control; lightly tap the heel without transferring weight."],
      ["Drive back up","Push through the standing foot and return to the top with the pelvis level."]
    ],
    ankleRock:[
      ["Set the foot","Place the whole working foot flat with toes pointing naturally forward."],
      ["Keep heel grounded","Brace the arch and keep the heel down throughout the drill."],
      ["Drive knee forward","Move the knee over the toes while the foot remains stable."],
      ["Pause at end range","Stop before the heel rises or the arch collapses and hold briefly."],
      ["Return and repeat","Rock back smoothly and repeat the prescribed reps on each side."]
    ],
    kneelingStretch:[
      ["Set the kneeling stance","Place one knee near the wall or bench and the opposite foot forward in a stable half-kneeling position."],
      ["Tuck the pelvis","Gently tuck the pelvis and squeeze the glute on the stretching side."],
      ["Stay tall","Bring the torso upright while keeping the ribs down rather than arching the lower back."],
      ["Find the stretch","Shift only enough to feel the front of the hip and thigh open without knee pain."],
      ["Breathe and switch","Hold for the prescribed time with easy breaths, then change sides."]
    ],
    supineStretch:[
      ["Lie tall","Lie on your back with the pelvis neutral and shoulders relaxed."],
      ["Raise one leg","Bring one leg upward using a strap or your hands while the opposite leg stays controlled."],
      ["Keep pelvis stable","Stop before the pelvis lifts or the lower back changes position."],
      ["Find gentle hamstring tension","Straighten the knee only as far as comfortable and breathe without forcing the range."],
      ["Hold and switch","Maintain the prescribed time, lower the leg slowly and repeat on the other side."]
    ],
    doorStretch:[
      ["Set the arm","Place the forearm on the doorway with the shoulder relaxed down from the ear."],
      ["Stand tall","Stack ribs over pelvis and keep the shoulder from rolling forward."],
      ["Turn away slowly","Rotate the body away from the planted arm until you feel a gentle chest stretch."],
      ["Hold without forcing","Keep the sensation in the chest/front shoulder, not a sharp pinch inside the joint."],
      ["Return and switch","Ease out of the stretch and repeat on the other side."]
    ],
    childStretch:[
      ["Set child's pose","Kneel, sit the hips toward the heels and reach both hands forward."],
      ["Lengthen the spine","Keep the neck relaxed and reach the hands away from the hips."],
      ["Bias the lats","Press the palms gently into the floor or bench while keeping the ribs controlled."],
      ["Breathe into the upper back","Use slow breaths to expand the rib cage without shrugging."],
      ["Hold and release","Stay for the prescribed time, then walk the hands back under control."]
    ],
    kneelingRotate:[
      ["Set half-kneeling","Place one knee down and the opposite foot forward in a stable lunge stance."],
      ["Tuck pelvis and engage glute","Gently tuck the pelvis and squeeze the glute of the kneeling side."],
      ["Open the hip first","Shift forward only enough to feel the hip flexor stretch without arching the lower back."],
      ["Add upper-back rotation","Keep the pelvis controlled and rotate the chest toward the front leg."],
      ["Breathe and switch","Hold briefly with slow breaths, return to centre and repeat on the other side."]
    ],
    figure4:[
      ["Set the figure-four","Lie or sit comfortably and cross one ankle over the opposite thigh above the knee."],
      ["Keep pelvis square","Relax the shoulders and keep the pelvis from twisting as you set the position."],
      ["Draw the legs closer","Bring the supporting thigh toward you until you feel the glute stretch."],
      ["Hold gentle tension","Keep the crossed foot active and avoid forcing the knee downward."],
      ["Breathe and switch","Use slow breaths for the prescribed time, release smoothly and change sides."]
    ],
    inchworm:[
      ["Start tall","Stand with feet stable, soften the knees and prepare to hinge toward the floor."],
      ["Walk hands forward","Place the hands down and walk them away while keeping the movement controlled."],
      ["Reach a strong plank","Finish with shoulders over hands and a braced trunk; do not let the hips sag."],
      ["Press into down dog","Push the floor away, send hips up and back and lengthen through the posterior chain."],
      ["Walk back and stand","Return to plank, walk the hands toward the feet and stand under control."]
    ],
    rockback:[
      ["Set all fours","Start on hands and knees, then extend one leg out to the side with the foot planted."],
      ["Keep a neutral spine","Brace gently and keep the back long rather than rounding aggressively."],
      ["Rock hips backward","Send the hips toward the heel of the kneeling leg while the extended leg stays long."],
      ["Find inner-thigh tension","Stop when you feel a gentle adductor stretch without twisting the pelvis."],
      ["Return and repeat","Glide forward smoothly and repeat before switching sides."]
    ],
    calfStretch:[
      ["Set at the wall","Place hands on the wall and step the stretching leg behind you with toes pointing forward."],
      ["Keep heel down","Press the back heel toward the floor and keep the arch controlled."],
      ["Lean forward gradually","Bend the front knee and move the body toward the wall without turning the back foot out."],
      ["Hold the calf stretch","Keep the back knee straight and breathe while maintaining heel contact."],
      ["Release and switch","Ease out slowly and repeat on the opposite side."]
    ],
    circuit:[
      ["Set the first station","Arrange equipment before starting so transitions are safe and efficient."],
      ["Start conservatively","Begin the first round below maximum effort and establish a sustainable rhythm."],
      ["Use clean movement","Complete each station with the same technique standards you would use outside the circuit."],
      ["Control transitions","Move efficiently between stations without rushing setup or sacrificing form."],
      ["Finish repeatably","Aim for similar quality across all rounds rather than exhausting yourself in round one."]
    ]
  };

  const fallbackFamily = "circuit";
  function familyFor(name){ return FAMILY[name] || fallbackFamily; }

  function derivedDemo(o){
    const f = familyFor(o.n || o.name);
    const source = FAMILY_STEPS[f] || FAMILY_STEPS[fallbackFamily];
    const how = Array.isArray(o.how) ? o.how : [];
    const mistakes = Array.isArray(o.mistakes) ? o.mistakes : [];
    const steps = source.map((x,i)=>({
      title:x[0],
      text:x[1],
      cues:[
        how[i % Math.max(1,how.length)] || (o.cue || "Move with control"),
        i===0 ? "Set a stable starting position" : i===4 ? "Finish under control" : "Keep the movement deliberate"
      ]
    }));
    return {
      family:f,
      steps,
      feel: feelFor(o,f),
      mistakes: mistakes.length ? mistakes.map(m=>`${m} — correct it before continuing.`) :
        ["Rushing the movement — slow the tempo.","Losing alignment — reduce range or load.","Holding your breath — breathe with control."]
    };
  }

  function feelFor(o,f){
    const map={
      hip90:"Controlled rotation deep around the hips, not pressure in the knees.",
      lungeRotate:"Hip flexor/groin stretch plus upper-back rotation; no sharp pinch.",
      deadlift:"Hamstrings, glutes, upper back and trunk tension; no sharp lower-back pain.",
      hinge:"Hamstrings and glutes loading as the hips travel backward.",
      splitSquat:"Front-leg glute and quadriceps working with stable balance.",
      walkingLunge:"Front-leg glute and quadriceps with controlled balance from step to step.",
      frontSquat:"Quadriceps, glutes and trunk working while the feet stay fully connected to the floor.",
      deepSquat:"Hips, groin and ankles opening with the heels grounded.",
      cossack:"Adductors and hip mobility on the long-leg side with the working foot stable.",
      carry:"Grip, trunk and upper back working while posture stays tall.",
      stairs:"Leg and cardiovascular effort with controlled breathing and posture.",
      bike:"Smooth cardiovascular and leg effort without bouncing or joint pain.",
      benchPress:"Chest, triceps and shoulders working while the upper back remains stable.",
      inclinePress:"Upper chest, shoulders and triceps with stable shoulder blades.",
      overheadPress:"Shoulders and triceps working while the trunk stays stacked.",
      row:"Mid-back and lats pulling without neck or upper-trap dominance.",
      cableRow:"Back and lat tension on the working side without torso rotation.",
      pulldown:"Lats and upper back working as the elbows drive downward.",
      shoulderMob:"A smooth shoulder/chest stretch without pinching.",
      thoracic:"Rotation through the upper back rather than the lower back.",
      plankRow:"Chest, back and trunk working while the pelvis stays square.",
      swing:"Glutes and hamstrings producing the power; arms should feel secondary.",
      pallof:"Deep trunk tension resisting rotation.",
      hipThrust:"Strong glute contraction at the top without lower-back compression.",
      legPress:"Quadriceps and glutes working while the pelvis stays against the pad.",
      hamCurl:"Hamstrings shortening and controlling the return.",
      stepDown:"Quadriceps and glute controlling the lowering with the knee aligned.",
      ankleRock:"A gentle stretch around the ankle/calf while the heel stays down.",
      kneelingStretch:"Front of hip and thigh stretching with the glute engaged.",
      supineStretch:"Gentle hamstring tension with the pelvis stable.",
      doorStretch:"Gentle stretch through the chest/front shoulder, not a joint pinch.",
      childStretch:"Lats and upper back lengthening with relaxed breathing.",
      kneelingRotate:"Hip flexor opening plus upper-back rotation.",
      figure4:"Glute/deep hip stretch without knee pressure.",
      inchworm:"Shoulders, trunk and posterior chain moving through a controlled sequence.",
      rockback:"Inner-thigh/adductor stretch with a neutral spine.",
      calfStretch:"Calf stretch while the heel remains firmly grounded.",
      circuit:"Whole-body and cardiovascular effort that remains technically repeatable."
    };
    return map[f] || "The target muscles working with controlled, pain-free movement.";
  }

  function currentExercise(){
    try{
      if(typeof state!=="undefined" && state && state.exercises && state.exercises[state.exerciseIndex]) return state.exercises[state.exerciseIndex];
    }catch{}
    const n=document.querySelector("#activeExerciseCard .exercise-title")?.textContent?.trim() || "Current exercise";
    return {n,block:"",reps:"",rest:0,cue:"",how:[],mistakes:[]};
  }

  function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

  function visualScene(family,idx,title,cues){
    const phase = idx/4;
    const defs = `<defs>
      <linearGradient id="vbg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#202b3a"/><stop offset="1" stop-color="#0d1421"/></linearGradient>
      <linearGradient id="shirt" x1="0" x2="1"><stop stop-color="#151b23"/><stop offset="1" stop-color="#2f3a48"/></linearGradient>
      <filter id="shadow"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-opacity=".35"/></filter>
    </defs>`;
    const floor = `<path d="M20 370 H620" stroke="#6b7d92" stroke-width="3" opacity=".55"/>`;
    let x=315,y=130,torsoRot=0,hipX=315,hipY=235,headX=315,headY=95;
    let lArm=[280,170,245,250], rArm=[350,170,390,250], lLeg=[300,245,250,350], rLeg=[330,245,400,350];
    let equip="";
    if(["lungeRotate","splitSquat","walkingLunge","cossack","ankleRock","kneelingRotate"].includes(family)){
      hipY=230; headY=105;
      lLeg=[305,240,215,350]; rLeg=[330,240,415,350];
      if(idx>=1){hipY=250;headY=130;}
      if(family==="lungeRotate" && idx>=2){rArm=[350,185,440,80];}
      if(family==="splitSquat"){equip=`<rect x="430" y="305" width="110" height="18" rx="6" fill="#48576a"/>`;rLeg=[330,240,465,315];}
    } else if(["deadlift","hinge","swing"].includes(family)){
      if(idx<2){headY=135;hipY=235;torsoRot=25;lArm=[290,175,270,300];rArm=[345,175,365,300];}
      else {headY=85+(2-idx)*15;hipY=220;torsoRot=Math.max(0,20-idx*7);}
      equip = family==="swing" ? `<circle cx="${315+(idx>=2?80:0)}" cy="${310-(idx>=2?90:0)}" r="20" fill="#34475d" stroke="#7dd3fc" stroke-width="4"/>`
        : `<line x1="225" y1="${idx<2?315:285}" x2="405" y2="${idx<2?315:285}" stroke="#b8c7d9" stroke-width="8"/><circle cx="235" cy="${idx<2?315:285}" r="28" fill="#283749"/><circle cx="395" cy="${idx<2?315:285}" r="28" fill="#283749"/>`;
    } else if(["benchPress","inclinePress"].includes(family)){
      headX=245;headY=210;hipX=350;hipY=245;torsoRot=90;
      lLeg=[355,250,455,335];rLeg=[375,250,500,335];
      lArm=[280,200,315,130-(idx*12)];rArm=[300,205,360,130-(idx*12)];
      equip=`<rect x="190" y="255" width="240" height="24" rx="8" fill="#4c5c70"/><line x1="250" y1="${145-idx*12}" x2="390" y2="${145-idx*12}" stroke="#c0cede" stroke-width="8"/>`;
    } else if(["overheadPress","pulldown","row","cableRow","shoulderMob","thoracic","pallof"].includes(family)){
      if(family==="overheadPress" && idx>=2){lArm=[285,170,270,70];rArm=[345,170,365,70];}
      if(family==="pulldown"){equip=`<line x1="220" y1="55" x2="420" y2="55" stroke="#9bb3ca" stroke-width="6"/>`;lArm=[285,170,245,80+idx*20];rArm=[345,170,395,80+idx*20];}
      if(["row","cableRow"].includes(family) && idx>=2){lArm=[280,175,225,180];rArm=[350,175,410,180];}
      if(family==="shoulderMob"){lArm=[280,175,230,90-idx*10];rArm=[350,175,405,90-idx*10];equip=`<path d="M230 ${90-idx*10} Q315 35 405 ${90-idx*10}" fill="none" stroke="#63d5ff" stroke-width="5"/>`;}
      if(family==="thoracic" && idx>=2){rArm=[350,175,430,95];}
      if(family==="pallof"){equip=`<line x1="80" y1="180" x2="${260+idx*35}" y2="180" stroke="#63d5ff" stroke-width="4"/>`;lArm=[285,175,300+idx*25,180];rArm=[345,175,300+idx*25,180];}
    } else if(["stairs","bike"].includes(family)){
      if(family==="stairs"){equip=`<path d="M370 350h70v-45h55v-45h55v-45h55" fill="none" stroke="#546a84" stroke-width="18"/>`;lLeg=[300,245,390,305];rLeg=[330,245,440,260];}
      else {equip=`<circle cx="390" cy="320" r="68" fill="none" stroke="#536b85" stroke-width="12"/><circle cx="240" cy="320" r="68" fill="none" stroke="#536b85" stroke-width="12"/><path d="M240 320 L315 240 L390 320 L300 320 Z" fill="none" stroke="#6f89a5" stroke-width="9"/>`;hipX=315;hipY=225;lLeg=[305,235,240,320];rLeg=[330,235,390,320];}
    } else if(["hipThrust","supineStretch","figure4","hamCurl"].includes(family)){
      headX=220;headY=260;hipX=350;hipY=260;torsoRot=90;
      lLeg=[355,265,450,330];rLeg=[375,265,500,330];
      if(family==="hipThrust" && idx>=2){hipY=210;headY=255;lLeg=[355,220,445,330];rLeg=[380,220,500,330];}
      if(family==="supineStretch" && idx>=1){rLeg=[365,260,390,85];}
      if(family==="figure4"){rLeg=[360,260,420,220];}
      if(family==="hamCurl"){equip=`<rect x="160" y="285" width="350" height="20" rx="8" fill="#526277"/>`;}
    } else if(["deepSquat","frontSquat","legPress","stepDown"].includes(family)){
      if(idx>=1 && idx<=3){headY=125;hipY=250;lLeg=[300,255,250,350];rLeg=[330,255,390,350];}
      if(family==="frontSquat"){equip=`<line x1="225" y1="${headY+65}" x2="405" y2="${headY+65}" stroke="#b9c8d8" stroke-width="8"/>`;}
      if(family==="legPress"){equip=`<path d="M420 120 L520 240" stroke="#7089a5" stroke-width="15"/><rect x="470" y="80" width="100" height="20" rx="6" fill="#7089a5"/>`;torsoRot=-25;}
      if(family==="stepDown"){equip=`<rect x="230" y="320" width="160" height="50" rx="6" fill="#3d5068"/>`;rLeg=[330,245,420,350];}
    } else if(["doorStretch","childStretch","kneelingStretch","rockback","calfStretch"].includes(family)){
      if(family==="doorStretch"){equip=`<rect x="430" y="65" width="16" height="305" fill="#677d96"/>`;rArm=[350,175,435,155];}
      if(family==="calfStretch"){equip=`<rect x="500" y="55" width="18" height="315" fill="#677d96"/>`;rArm=[350,175,500,170];lLeg=[300,245,210,350];}
      if(["childStretch","rockback"].includes(family)){headY=230;hipY=250;torsoRot=70;lArm=[285,220,430,300];rArm=[330,220,465,300];lLeg=[300,255,220,340];rLeg=[330,255,285,340];}
      if(family==="kneelingStretch"){lLeg=[300,245,250,350];rLeg=[330,245,430,350];hipY=235;}
    } else if(family==="inchworm" || family==="plankRow"){
      headX=430;headY=200;hipX=320;hipY=220;torsoRot=85;lArm=[390,205,470,330];rArm=[420,205,510,330];lLeg=[300,230,175,330];rLeg=[320,230,230,330];
    }

    const torso = `<g transform="rotate(${torsoRot} ${hipX} ${hipY})" filter="url(#shadow)">
      <path d="M${headX-32} ${headY+30} Q${hipX-55} ${hipY-60} ${hipX-35} ${hipY+5} Q${hipX} ${hipY+25} ${hipX+35} ${hipY+5} Q${hipX+50} ${hipY-60} ${headX+28} ${headY+30} Z" fill="url(#shirt)"/>
      <circle cx="${headX}" cy="${headY}" r="27" fill="#c88f68"/>
      <path d="M${headX-18} ${headY-20} Q${headX} ${headY-40} ${headX+20} ${headY-18}" fill="#1a1d22"/>
    </g>`;
    const limbs = `<g stroke-linecap="round" stroke-linejoin="round" filter="url(#shadow)">
      <path d="M${lArm[0]} ${lArm[1]} L${lArm[2]} ${lArm[3]}" stroke="#c88f68" stroke-width="19"/>
      <path d="M${rArm[0]} ${rArm[1]} L${rArm[2]} ${rArm[3]}" stroke="#c88f68" stroke-width="19"/>
      <path d="M${lLeg[0]} ${lLeg[1]} L${lLeg[2]} ${lLeg[3]}" stroke="#232a34" stroke-width="28"/>
      <path d="M${rLeg[0]} ${rLeg[1]} L${rLeg[2]} ${rLeg[3]}" stroke="#232a34" stroke-width="28"/>
      <ellipse cx="${lLeg[2]}" cy="${lLeg[3]+4}" rx="28" ry="9" fill="#e8eef6"/>
      <ellipse cx="${rLeg[2]}" cy="${rLeg[3]+4}" rx="28" ry="9" fill="#e8eef6"/>
    </g>`;
    const callouts=(cues||[]).slice(0,2).map((c,i)=>{
      const yy=70+i*92, xx=i===0?22:420, tx=i===0?190:425, ty=i===0?150:235;
      return `<g><rect x="${xx}" y="${yy}" width="180" height="54" rx="10" fill="#06111e" stroke="#26b8f5" stroke-width="2"/>
      <text x="${xx+90}" y="${yy+23}" text-anchor="middle" fill="#eaf7ff" font-size="13" font-family="Arial">${esc(c).slice(0,25)}</text>
      <path d="M${i===0?xx+180:xx} ${yy+27} Q${i===0?150:470} ${yy+45} ${tx} ${ty}" fill="none" stroke="#e8f4ff" stroke-width="2" marker-end="url(#arr)"/></g>`;
    }).join("");
    return `<svg class="zf29-svg" viewBox="0 0 640 390" role="img" aria-label="${esc(title)} visual position">
      ${defs}<defs><marker id="arr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#e8f4ff"/></marker></defs>
      <rect width="640" height="390" rx="22" fill="url(#vbg)"/>${floor}${equip}${torso}${limbs}${callouts}
      <rect x="18" y="18" width="112" height="38" rx="19" fill="#0788ff"/><text x="74" y="43" text-anchor="middle" fill="white" font-size="15" font-weight="700" font-family="Arial">STEP ${idx+1} OF 5</text>
    </svg>`;
  }

  function addStyles(){
    if(document.getElementById("zf29-style"))return;
    const s=document.createElement("style");s.id="zf29-style";s.textContent=`
#zf29{position:fixed;inset:0;z-index:999999;background:#071120;color:#eef6ff;font-family:inherit;overflow:auto}
#zf29 *{box-sizing:border-box}.zf29-wrap{max-width:1180px;margin:auto;padding:18px 20px 100px}.zf29-header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding-bottom:15px;border-bottom:1px solid #223650;position:sticky;top:0;background:#071120f2;backdrop-filter:blur(12px);z-index:5}.zf29-brand{display:flex;align-items:center;gap:10px}.zf29-logo{width:46px;height:46px;border:2px solid #28d79e;border-radius:12px;display:grid;place-items:center;font-weight:900;color:#55c8f5}.zf29-close{width:44px;height:44px;border-radius:12px;border:1px solid #334965;background:#101e31;color:#eaf3ff;font-size:24px}.zf29-titlebar{padding:24px 0 14px}.zf29-titlebar h1{font-size:34px;margin:0 0 6px}.zf29-sub{color:#9db0c9}.zf29-pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.zf29-pill{border:1px solid #304965;background:#0c1a2b;border-radius:999px;padding:8px 12px;color:#d2e0f1;font-size:13px}
.zf29-layout{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(310px,.8fr);gap:12px}.zf29-photo{border:1px solid #2f5578;border-radius:20px;overflow:hidden;background:#0c1828}.zf29-svg{display:block;width:100%;height:auto}.zf29-side{border:1px solid #253a55;border-radius:20px;background:#0a1728;padding:18px;display:flex;flex-direction:column;gap:14px}.zf29-step-label{color:#29b9f4;font-weight:800}.zf29-side h2{font-size:27px;margin:0}.zf29-instructions{display:grid;gap:10px}.zf29-instruction{display:grid;grid-template-columns:30px 1fr;gap:9px;align-items:start;color:#dce8f7;line-height:1.45}.zf29-num{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#168cff;color:white;font-weight:800}.zf29-feel,.zf29-errors{padding:13px;border-radius:14px}.zf29-feel{background:#09231b;border:1px solid #1c744f}.zf29-feel b{color:#48e28e}.zf29-errors{background:#221317;border:1px solid #92363b}.zf29-errors b{color:#ff6c67}.zf29-errors ul{padding-left:20px;margin:9px 0 0}.zf29-errors li{margin:7px 0;color:#f2d6d6}
.zf29-stepbar{display:grid;grid-template-columns:repeat(5,1fr);gap:9px;margin:14px 0}.zf29-stepbtn{border:2px solid #243a56;background:#0c192b;color:#dbe8f7;border-radius:14px;padding:6px;text-align:left;cursor:pointer}.zf29-stepbtn.active{border-color:#21aff0;box-shadow:0 0 0 2px #21aff033}.zf29-thumbpic{height:92px;border-radius:9px;overflow:hidden;background:#111d2d}.zf29-thumbpic .zf29-svg{height:100%;width:100%;object-fit:cover}.zf29-stepbtn strong{display:block;font-size:12px;padding:7px 4px 3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.zf29-stepbtn span{display:inline-grid;width:23px;height:23px;border-radius:50%;place-items:center;background:#118cf4;margin-right:4px;color:#fff}
.zf29-voice{position:sticky;bottom:10px;z-index:6;background:#0a1829f5;border:1px solid #2d4664;border-radius:18px;padding:14px;box-shadow:0 12px 40px #0008}.zf29-voice-top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}.zf29-voice-title{display:flex;align-items:center;gap:10px}.zf29-voice-title b{font-size:18px}.zf29-controls{display:grid;grid-template-columns:1.2fr 1fr 1fr 1fr;gap:8px}.zf29-controls button,.zf29-speed{min-height:48px;border-radius:12px;border:1px solid #38526f;background:#112238;color:#fff;font-weight:750;font-size:14px}.zf29-controls .play{background:#148df5}.zf29-controls .stop{background:#26161a;border-color:#8e343c}.zf29-speedrow{display:flex;gap:8px;align-items:center}.zf29-speed{padding:0 12px}.zf29-mode{display:flex;border:1px solid #324a66;border-radius:12px;overflow:hidden}.zf29-mode button{border:0;background:#0e1c30;color:#c9d7e7;padding:10px 14px}.zf29-mode button.active{background:#1ca9ec;color:#07111b;font-weight:800}
.zf29-nav{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}.zf29-nav button{height:58px;border-radius:14px;border:1px solid #304864;background:#14243a;color:#c5d5e8;font-weight:800;font-size:16px}.zf29-nav .next{background:#20d86a;color:#06130b;border-color:#20d86a}.zf29-nav button:disabled{opacity:.35}
@media(max-width:800px){.zf29-wrap{padding:10px 10px 110px}.zf29-header{padding:8px 2px}.zf29-titlebar{padding:16px 4px 10px}.zf29-titlebar h1{font-size:27px}.zf29-layout{grid-template-columns:1fr}.zf29-side{padding:14px}.zf29-stepbar{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:4px}.zf29-stepbtn{min-width:160px;scroll-snap-align:start}.zf29-thumbpic{height:86px}.zf29-voice{bottom:6px}.zf29-voice-top{align-items:flex-start;flex-direction:column}.zf29-controls{grid-template-columns:1fr 1fr}.zf29-mode{width:100%}.zf29-mode button{flex:1}.zf29-nav{grid-template-columns:1fr 1fr}.zf29-photo{border-radius:16px}}
`;document.head.appendChild(s);
  }

  function bestVoice(){
    const vs=speechSynthesis.getVoices();
    return vs.find(v=>/Google.*English|Samsung.*English|Microsoft.*English/i.test(v.name)) ||
      vs.find(v=>/^en-(GB|US)/i.test(v.lang)) || vs.find(v=>/^en/i.test(v.lang)) || vs[0];
  }
  function stopVoice(){try{speechSynthesis.cancel()}catch{} utterance=null;paused=false;syncVoiceButtons();}
  function pauseVoice(){try{if(speechSynthesis.speaking && !speechSynthesis.paused){speechSynthesis.pause();paused=true}else if(speechSynthesis.paused){speechSynthesis.resume();paused=false}}catch{}syncVoiceButtons();}
  function spokenText(i){
    const s=demo.steps[i];
    if(voiceMode==="essential") return `Step ${i+1}. ${s.title}. ${s.cues.join(". ")}.`;
    return `Step ${i+1}. ${s.title}. ${s.text} ${s.cues.join(". ")}.`;
  }
  function playVoice(replay=false){
    if(!("speechSynthesis" in window))return;
    stopVoice();
    const u=new SpeechSynthesisUtterance(spokenText(step));
    const v=bestVoice(); if(v)u.voice=v;
    u.rate=rate;u.pitch=.96;u.volume=.95;
    u.onend=()=>{utterance=null;paused=false;syncVoiceButtons();};
    u.onerror=()=>{utterance=null;paused=false;syncVoiceButtons();};
    utterance=u;speechSynthesis.speak(u);syncVoiceButtons();
  }
  function syncVoiceButtons(){
    const root=document.getElementById("zf29"); if(!root)return;
    const pause=root.querySelector(".pause");
    if(pause)pause.textContent=paused?"▶ Resume":"❚❚ Pause";
  }

  function render(){
    const root=document.getElementById("zf29"); if(!root)return;
    const s=demo.steps[step];
    root.querySelector(".zf29-photo").innerHTML=visualScene(demo.family,step,s.title,s.cues);
    root.querySelector(".zf29-step-label").textContent=`Step ${step+1} of ${demo.steps.length}`;
    root.querySelector(".zf29-side h2").textContent=s.title;
    root.querySelector(".zf29-instructions").innerHTML=`
      <div class="zf29-instruction"><span class="zf29-num">1</span><span>${esc(s.text)}</span></div>
      ${s.cues.map((c,i)=>`<div class="zf29-instruction"><span class="zf29-num">✓</span><span>${esc(c)}</span></div>`).join("")}`;
    root.querySelectorAll(".zf29-stepbtn").forEach((b,i)=>b.classList.toggle("active",i===step));
    const prev=root.querySelector(".prev"),next=root.querySelector(".next");
    prev.disabled=step===0;next.textContent=step===demo.steps.length-1?"Finish Demo":"Next Step →";
  }

  function openDemo(o){
    ex=o;demo=derivedDemo(o);step=0;stopVoice();document.getElementById("zf29")?.remove();
    const root=document.createElement("div");root.id="zf29";
    root.innerHTML=`<div class="zf29-wrap">
      <div class="zf29-header">
        <div class="zf29-brand"><div class="zf29-logo">ZF</div><div><b>Zahi Fit</b><div class="zf29-sub">Your Personal PT</div></div></div>
        <button class="zf29-close" aria-label="Close">×</button>
      </div>
      <section class="zf29-titlebar">
        <h1>${esc(o.n || o.name)}</h1>
        <div class="zf29-sub">${esc(o.cue || "Follow the guided movement sequence.")}</div>
        <div class="zf29-pills">
          <span class="zf29-pill">◷ ${esc(String(o.sets?.length || o.sets || "—"))} sets</span>
          <span class="zf29-pill">◎ ${esc(o.reps || "—")}</span>
          <span class="zf29-pill">⌛ ${o.rest ? `Rest ${o.rest}s` : "Continuous"}</span>
          <span class="zf29-pill">💪 ${esc(o.block || "Exercise")}</span>
        </div>
      </section>
      <section class="zf29-layout">
        <div class="zf29-photo"></div>
        <aside class="zf29-side">
          <div class="zf29-step-label"></div><h2></h2>
          <div class="zf29-instructions"></div>
          <div class="zf29-feel"><b>💡 What you should feel</b><div>${esc(demo.feel)}</div></div>
          <div class="zf29-errors"><b>⚠ Common mistakes</b><ul>${demo.mistakes.slice(0,4).map(m=>`<li>${esc(m)}</li>`).join("")}</ul></div>
        </aside>
      </section>
      <div class="zf29-stepbar">${demo.steps.map((s,i)=>`<button class="zf29-stepbtn" data-step="${i}">
        <div class="zf29-thumbpic">${visualScene(demo.family,i,s.title,[])}</div>
        <strong><span>${i+1}</span>${esc(s.title)}</strong></button>`).join("")}</div>
      <section class="zf29-voice">
        <div class="zf29-voice-top">
          <div class="zf29-voice-title"><span style="font-size:28px">🔊</span><div><b>Voice Coach</b><div class="zf29-sub">Step-by-step guidance with controls always within reach.</div></div></div>
          <div class="zf29-speedrow"><select class="zf29-speed" aria-label="Voice speed">
            <option value="0.70">Very slow</option><option value="0.82">Smooth</option><option value="0.94">Normal</option>
          </select><div class="zf29-mode"><button data-mode="essential">Essential</button><button data-mode="full">Full Coaching</button></div></div>
        </div>
        <div class="zf29-controls"><button class="play">▶ Play Step</button><button class="pause">❚❚ Pause</button><button class="replay">↻ Replay Step</button><button class="stop">■ Stop</button></div>
      </section>
      <div class="zf29-nav"><button class="prev">← Previous Step</button><button class="next">Next Step →</button></div>
    </div>`;
    document.body.appendChild(root);
    root.querySelector(".zf29-speed").value=String(rate);
    root.querySelectorAll(".zf29-mode button").forEach(b=>b.classList.toggle("active",b.dataset.mode===voiceMode));
    root.querySelector(".zf29-close").onclick=()=>{stopVoice();root.remove()};
    root.querySelectorAll(".zf29-stepbtn").forEach(b=>b.onclick=()=>{stopVoice();step=Number(b.dataset.step);render()});
    root.querySelector(".play").onclick=()=>playVoice();
    root.querySelector(".pause").onclick=pauseVoice;
    root.querySelector(".replay").onclick=()=>playVoice(true);
    root.querySelector(".stop").onclick=stopVoice;
    root.querySelector(".zf29-speed").onchange=e=>{rate=Number(e.target.value);localStorage.setItem(RATE_KEY,String(rate));if(utterance)playVoice(true)};
    root.querySelectorAll(".zf29-mode button").forEach(b=>b.onclick=()=>{voiceMode=b.dataset.mode;localStorage.setItem(MODE_KEY,voiceMode);root.querySelectorAll(".zf29-mode button").forEach(x=>x.classList.toggle("active",x===b));});
    root.querySelector(".prev").onclick=()=>{if(step>0){stopVoice();step--;render()}};
    root.querySelector(".next").onclick=()=>{if(step<demo.steps.length-1){stopVoice();step++;render()}else{stopVoice();root.remove()}};
    render();
  }

  function upgradeButtons(){
    document.querySelectorAll("button,a").forEach(el=>{
      const t=(el.textContent||"").trim().toLowerCase();
      if(t.includes("visual pt demo")||t.includes("guided demo")||t.includes("in-app pt demo")||t.includes("full demo")){
        if(el.dataset.zf29)return;
        el.dataset.zf29="1";el.textContent="Open Professional PT Demo";
        el.addEventListener("click",e=>{e.preventDefault();e.stopImmediatePropagation();openDemo(currentExercise())},true);
      }
      if(t.includes("smooth pt coaching")||t.includes("guided voice coaching")||t.includes("hear pt cues")){
        if(el.dataset.zf29)return;
        el.dataset.zf29="1";el.textContent="▶ Open Voice Coach";
        el.addEventListener("click",e=>{e.preventDefault();e.stopImmediatePropagation();openDemo(currentExercise())},true);
      }
    });
    const badge=document.getElementById("versionBadge");
    if(badge && badge.textContent!==VERSION) badge.textContent=VERSION;
  }

  addStyles();upgradeButtons();
  new MutationObserver(()=>upgradeButtons()).observe(document.body,{childList:true,subtree:true});
})();
