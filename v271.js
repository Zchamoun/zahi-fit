"use strict";
/* Zahi Fit v3.0.0 — Professional Guided PT Experience */
(() => {
  const VERSION = "v3.0.0";
  const RATE_KEY = "zahiFitVoiceRateV30";
  const MODE_KEY = "zahiFitVoiceModeV30";

  let currentDemo = null;
  let currentExercise = null;
  let currentStep = 0;
  let voiceRate = Number(localStorage.getItem(RATE_KEY) || "0.82");
  let voiceMode = localStorage.getItem(MODE_KEY) || "full";
  let utterance = null;
  let paused = false;

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
    "Calf Wall Stretch":"calfWall"
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
      ["Set the bell ahead","Stand behind the kettlebell with feet about shoulder-width and hinge to grip it."],
      ["Hike the bell back","Pull the bell between the thighs while keeping the spine long."],
      ["Snap the hips","Drive the feet into the floor and extend the hips explosively. The arms guide rather than lift."],
      ["Float at the top","Let the bell rise from hip power while the body finishes tall and braced."],
      ["Reload the hinge","Guide the bell back between the thighs, send the hips back and repeat."]
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

  function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function getExercise(){
    try{
      if(typeof state!=="undefined" && state && state.exercises && state.exercises[state.exerciseIndex]){
        return state.exercises[state.exerciseIndex];
      }
    }catch(e){}
    const name=document.querySelector("#activeExerciseCard .exercise-title")?.textContent?.trim()||"Current exercise";
    return {n:name,block:"Exercise",sets:[],reps:"",rest:0,cue:"",how:[],mistakes:[]};
  }
  function familyFor(ex){return FAMILY[ex.n]||"circuit";}
  function makeDemo(ex){
    const family=familyFor(ex);
    const base=STEPS[family]||STEPS.circuit;
    const how=Array.isArray(ex.how)?ex.how:[];
    return {
      family,
      steps:base.map((s,i)=>({
        title:s[0],
        text:s[1],
        cue:how[i%Math.max(1,how.length)] || ex.cue || "Move with control."
      })),
      feel:feelFor(family),
      mistakes:(Array.isArray(ex.mistakes)&&ex.mistakes.length?ex.mistakes:["Rushing the movement","Losing stable alignment","Using more range than you can control"]).slice(0,4)
    };
  }

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
      calfWall:"Calf stretch while the heel remains grounded."
    };
    return m[f]||"The target muscles working with controlled, pain-free movement.";
  }

  /* A fuller trainer illustration — body masses, clothing, shading and equipment.
     This intentionally avoids the old stick-figure appearance. */
  function trainerSvg(family,idx,title,cues=[],thumb=false){
    const p=poseFor(family,idx);
    const W=thumb?260:760,H=thumb?150:470;
    const sx=W/760, sy=H/470;
    const q=n=>Math.round(n*sx), r=n=>Math.round(n*sy);
    const label=(txt,x,y,w=190)=>thumb?"":`<g>
      <rect x="${q(x)}" y="${r(y)}" width="${q(w)}" height="${r(58)}" rx="${q(12)}" fill="#081421" stroke="#31b7f2" stroke-width="${q(2)}"/>
      <text x="${q(x+w/2)}" y="${r(y+24)}" text-anchor="middle" fill="#eaf7ff" font-size="${q(15)}" font-family="Arial, sans-serif" font-weight="700">${esc(txt).slice(0,24)}</text>
      <path d="M${q(x+w/2)} ${r(y+58)} Q${q(p.hip[0])} ${r(y+85)} ${q(p.hip[0])} ${r(p.hip[1]-8)}" fill="none" stroke="#e7f4ff" stroke-width="${q(2)}" opacity=".92"/>
    </g>`;

    const equipment=equipmentSvg(family,p,thumb,sx,sy);
    const torsoPath=`M ${q(p.shoulderL[0])} ${r(p.shoulderL[1])}
      Q ${q((p.shoulderL[0]+p.hip[0])/2-18)} ${r((p.shoulderL[1]+p.hip[1])/2)}
        ${q(p.hip[0]-34)} ${r(p.hip[1])}
      Q ${q(p.hip[0])} ${r(p.hip[1]+18)}
        ${q(p.hip[0]+34)} ${r(p.hip[1])}
      Q ${q((p.shoulderR[0]+p.hip[0])/2+18)} ${r((p.shoulderR[1]+p.hip[1])/2)}
        ${q(p.shoulderR[0])} ${r(p.shoulderR[1])} Z`;

    function limb(a,b,c,d,width,fill,outline="#101820"){
      const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy)||1,nx=-dy/len*width/2,ny=dx/len*width/2;
      const dx2=d[0]-c[0],dy2=d[1]-c[1],len2=Math.hypot(dx2,dy2)||1,nx2=-dy2/len2*width/2,ny2=dx2/len2*width/2;
      return `<path d="M${q(a[0]+nx)} ${r(a[1]+ny)} L${q(b[0]+nx)} ${r(b[1]+ny)}
        L${q(c[0]+nx2)} ${r(c[1]+ny2)} L${q(d[0]+nx2)} ${r(d[1]+ny2)}
        L${q(d[0]-nx2)} ${r(d[1]-ny2)} L${q(c[0]-nx2)} ${r(c[1]-ny2)}
        L${q(b[0]-nx)} ${r(b[1]-ny)} L${q(a[0]-nx)} ${r(a[1]-ny)} Z"
        fill="${fill}" stroke="${outline}" stroke-width="${q(2)}"/>`;
    }

    const skin="#bf8463",skinHi="#db9b75",shirt="#1c2430",shirtHi="#333f4f",shorts="#111923",shoe="#e9eef4";
    const body=`<g filter="url(#shadow)">
      <ellipse cx="${q(p.hip[0])}" cy="${r(432)}" rx="${q(140)}" ry="${r(20)}" fill="#000" opacity=".25"/>
      ${limb(p.hipL,p.kneeL,p.kneeL,p.ankleL,34,shorts)}
      ${limb(p.hipR,p.kneeR,p.kneeR,p.ankleR,34,shorts)}
      <ellipse cx="${q(p.ankleL[0])}" cy="${r(p.ankleL[1]+7)}" rx="${q(28)}" ry="${r(10)}" fill="${shoe}"/>
      <ellipse cx="${q(p.ankleR[0])}" cy="${r(p.ankleR[1]+7)}" rx="${q(28)}" ry="${r(10)}" fill="${shoe}"/>
      <path d="${torsoPath}" fill="url(#shirtGrad)" stroke="#0d131b" stroke-width="${q(3)}"/>
      <path d="M${q(p.shoulderL[0]+8)} ${r(p.shoulderL[1]+8)} Q${q(p.hip[0])} ${r(p.hip[1]-20)} ${q(p.shoulderR[0]-8)} ${r(p.shoulderR[1]+8)}" fill="none" stroke="#445568" stroke-width="${q(7)}" opacity=".45"/>
      ${limb(p.shoulderL,p.elbowL,p.elbowL,p.handL,24,skin)}
      ${limb(p.shoulderR,p.elbowR,p.elbowR,p.handR,24,skin)}
      <circle cx="${q(p.handL[0])}" cy="${r(p.handL[1])}" r="${q(13)}" fill="${skinHi}" stroke="#8b5d48" stroke-width="${q(2)}"/>
      <circle cx="${q(p.handR[0])}" cy="${r(p.handR[1])}" r="${q(13)}" fill="${skinHi}" stroke="#8b5d48" stroke-width="${q(2)}"/>
      <ellipse cx="${q(p.head[0])}" cy="${r(p.head[1])}" rx="${q(26)}" ry="${r(31)}" fill="url(#skinGrad)" stroke="#7f5743" stroke-width="${q(2)}"/>
      <path d="M${q(p.head[0]-25)} ${r(p.head[1]-10)} Q${q(p.head[0])} ${r(p.head[1]-42)} ${q(p.head[0]+26)} ${r(p.head[1]-10)} Q${q(p.head[0]+8)} ${r(p.head[1]-26)} ${q(p.head[0]-25)} ${r(p.head[1]-10)}" fill="#16191d"/>
      <path d="M${q(p.head[0]+5)} ${r(p.head[1]+8)} q${q(15)} ${r(8)} ${q(17)} ${r(20)}" fill="none" stroke="#3a241d" stroke-width="${q(4)}" opacity=".7"/>
    </g>`;

    return `<svg class="zf30-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)} trainer demonstration">
      <defs>
        <linearGradient id="bg30" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#263442"/><stop offset=".6" stop-color="#171f29"/><stop offset="1" stop-color="#0d141f"/></linearGradient>
        <linearGradient id="shirtGrad" x1="0" x2="1"><stop stop-color="${shirtHi}"/><stop offset=".55" stop-color="${shirt}"/><stop offset="1" stop-color="#0e141c"/></linearGradient>
        <linearGradient id="skinGrad" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#dda079"/><stop offset="1" stop-color="#a96f53"/></linearGradient>
        <filter id="shadow"><feDropShadow dx="0" dy="${q(8)}" stdDeviation="${q(8)}" flood-color="#000" flood-opacity=".35"/></filter>
      </defs>
      <rect width="${W}" height="${H}" rx="${q(24)}" fill="url(#bg30)"/>
      <path d="M${q(18)} ${r(406)} H${q(742)}" stroke="#66788b" stroke-width="${q(3)}" opacity=".45"/>
      ${equipment}
      ${body}
      ${thumb?"":`<rect x="${q(22)}" y="${r(20)}" width="${q(116)}" height="${r(40)}" rx="${q(20)}" fill="#0a8fff"/><text x="${q(80)}" y="${r(47)}" text-anchor="middle" fill="#fff" font-size="${q(16)}" font-family="Arial" font-weight="800">STEP ${idx+1} OF 5</text>`}
      ${label(cues[0]||"Set a stable position",22,90,190)}
      ${label(cues[1]||"Move with control",548,275,190)}
    </svg>`;
  }

  function poseFor(f,idx){
    const stand={head:[380,90],shoulderL:[340,145],shoulderR:[420,145],hip:[380,245],hipL:[355,245],hipR:[405,245],kneeL:[340,335],kneeR:[420,335],ankleL:[330,400],ankleR:[430,400],elbowL:[320,215],elbowR:[440,215],handL:[315,280],handR:[445,280]};
    const p=JSON.parse(JSON.stringify(stand));
    if(["worldStretch","splitSquat","walkingLunge","hipFlexRotate","ankleRock","cossack"].includes(f)){
      p.head=[390,125];p.shoulderL=[350,175];p.shoulderR=[430,175];p.hip=[380,255];p.hipL=[350,255];p.hipR=[410,255];p.kneeL=[275,320];p.ankleL=[205,390];p.kneeR=[470,315];p.ankleR=[545,390];
      p.elbowL=[330,245];p.handL=[285,345];p.elbowR=[445,235];p.handR=[470,335];
      if(idx===1){p.head[1]+=18;p.hip[1]+=12;p.handR=[320,340];}
      if(f==="worldStretch"&&idx>=2){p.handR=[525,80];p.elbowR=[460,155];}
      if(f==="cossack"){p.kneeL=[285,345];p.ankleL=[230,395];p.kneeR=[495,280];p.ankleR=[600,390];}
    }
    if(["deadlift","hinge","swing"].includes(f)){
      if(idx<=1){p.head=[430,150];p.shoulderL=[385,185];p.shoulderR=[455,205];p.hip=[360,275];p.hipL=[335,275];p.hipR=[385,275];p.kneeL=[320,345];p.kneeR=[420,345];p.ankleL=[300,405];p.ankleR=[440,405];p.elbowL=[365,250];p.elbowR=[465,260];p.handL=[345,355];p.handR=[470,355];}
      if(idx>=2){p.head=[390,95];p.shoulderL=[350,145];p.shoulderR=[430,145];p.hip=[380,245];p.handL=[335,300];p.handR=[425,300];}
      if(f==="swing"&&idx>=2){p.handL=[450,200];p.handR=[470,200];p.elbowL=[395,195];p.elbowR=[420,190];}
    }
    if(["bench","inclinePress"].includes(f)){
      p.head=[230,275];p.shoulderL=[275,270];p.shoulderR=[340,245];p.hip=[420,285];p.hipL=[400,285];p.hipR=[440,285];p.kneeL=[480,330];p.kneeR=[510,330];p.ankleL=[545,395];p.ankleR=[600,395];p.elbowL=[300,210];p.elbowR=[390,205];p.handL=[320,155-idx*16];p.handR=[425,150-idx*16];
    }
    if(["shoulderPress","pulldown","chestRow","singleRow","shoulderBand","thoracic","pallof"].includes(f)){
      if(f==="shoulderPress"&&idx>=2){p.elbowL=[335,125];p.elbowR=[425,125];p.handL=[325,65];p.handR=[435,65];}
      if(f==="pulldown"){p.elbowL=[320,150+idx*12];p.elbowR=[440,150+idx*12];p.handL=[290,70+idx*25];p.handR=[470,70+idx*25];}
      if(["chestRow","singleRow"].includes(f)&&idx>=2){p.elbowL=[300,180];p.handL=[240,190];p.elbowR=[455,180];p.handR=[520,190];}
      if(f==="shoulderBand"){p.elbowL=[310,115-idx*10];p.elbowR=[450,115-idx*10];p.handL=[285,65-idx*8];p.handR=[475,65-idx*8];}
      if(f==="thoracic"&&idx>=2){p.handR=[525,85];p.elbowR=[465,150];}
      if(f==="pallof"){p.handL=[405+idx*18,205];p.handR=[405+idx*18,220];p.elbowL=[365,205];p.elbowR=[365,225];}
    }
    if(["stairs","bike"].includes(f)){
      if(f==="stairs"){p.kneeL=[390,325];p.ankleL=[430,360];p.kneeR=[455,275];p.ankleR=[500,315];}
      else {p.head=[360,120];p.shoulderL=[325,175];p.shoulderR=[405,175];p.hip=[390,260];p.hipL=[370,260];p.hipR=[410,260];p.kneeL=[295,335];p.ankleL=[250,390];p.kneeR=[475,335];p.ankleR=[520,390];p.handL=[285,215];p.handR=[475,215];}
    }
    if(["supineHam","figure4","hipThrust","hamCurl"].includes(f)){
      p.head=[220,300];p.shoulderL=[270,295];p.shoulderR=[330,285];p.hip=[420,295];p.hipL=[400,295];p.hipR=[440,295];p.kneeL=[500,330];p.kneeR=[540,330];p.ankleL=[565,390];p.ankleR=[610,390];p.elbowL=[300,335];p.elbowR=[365,335];p.handL=[330,350];p.handR=[405,350];
      if(f==="supineHam"&&idx>=1){p.kneeR=[445,190];p.ankleR=[430,65];}
      if(f==="figure4"){p.kneeR=[470,245];p.ankleR=[400,245];}
      if(f==="hipThrust"&&idx>=2){p.hip=[430,235];p.hipL=[410,235];p.hipR=[450,235];p.kneeL=[510,305];p.kneeR=[550,305];}
    }
    if(["deepSquat","frontSquat","legPress","stepDown"].includes(f)){
      if(idx>=1&&idx<=3){p.head=[380,140];p.shoulderL=[340,190];p.shoulderR=[420,190];p.hip=[380,285];p.hipL=[350,285];p.hipR=[410,285];p.kneeL=[300,345];p.kneeR=[460,345];p.ankleL=[255,400];p.ankleR=[505,400];}
      if(f==="stepDown"){p.kneeR=[470,365];p.ankleR=[530,410];}
    }
    if(["doorPec","childLat","couch","adductor","calfWall"].includes(f)){
      if(f==="doorPec"){p.handR=[560,185];p.elbowR=[500,170];}
      if(f==="calfWall"){p.handL=[560,185];p.handR=[560,220];p.elbowL=[485,180];p.elbowR=[490,220];p.kneeL=[300,345];p.ankleL=[220,400];}
      if(["childLat","adductor"].includes(f)){p.head=[500,250];p.shoulderL=[440,270];p.shoulderR=[500,270];p.hip=[330,300];p.hipL=[310,300];p.hipR=[350,300];p.kneeL=[280,350];p.kneeR=[365,350];p.ankleL=[245,395];p.ankleR=[400,395];p.elbowL=[500,310];p.elbowR=[545,310];p.handL=[590,355];p.handR=[625,355];}
    }
    if(["inchworm","renegade"].includes(f)){
      p.head=[525,235];p.shoulderL=[470,250];p.shoulderR=[515,260];p.hip=[355,285];p.hipL=[335,285];p.hipR=[375,285];p.kneeL=[270,335];p.kneeR=[310,335];p.ankleL=[190,390];p.ankleR=[250,390];p.elbowL=[500,315];p.elbowR=[555,315];p.handL=[545,390];p.handR=[600,390];
    }
    return p;
  }

  function equipmentSvg(f,p,thumb,sx,sy){
    const q=n=>Math.round(n*sx),r=n=>Math.round(n*sy);
    if(["deadlift"].includes(f)) return `<g filter="url(#shadow)"><line x1="${q(270)}" y1="${r(365)}" x2="${q(500)}" y2="${r(365)}" stroke="#d3dde7" stroke-width="${q(10)}"/><circle cx="${q(290)}" cy="${r(365)}" r="${q(35)}" fill="#2b3744"/><circle cx="${q(480)}" cy="${r(365)}" r="${q(35)}" fill="#2b3744"/></g>`;
    if(["hinge"].includes(f)) return `<g fill="#23384b"><rect x="${q(320)}" y="${r(330)}" width="${q(28)}" height="${r(60)}" rx="${q(10)}"/><rect x="${q(455)}" y="${r(330)}" width="${q(28)}" height="${r(60)}" rx="${q(10)}"/></g>`;
    if(f==="swing") return `<g><circle cx="${q(475)}" cy="${r(300)}" r="${q(28)}" fill="#25394e" stroke="#5ccaf6" stroke-width="${q(4)}"/><path d="M${q(455)} ${r(280)} Q${q(475)} ${r(245)} ${q(495)} ${r(280)}" fill="none" stroke="#5ccaf6" stroke-width="${q(7)}"/></g>`;
    if(f==="splitSquat") return `<rect x="${q(500)}" y="${r(335)}" width="${q(150)}" height="${r(24)}" rx="${q(8)}" fill="#4b5c70"/>`;
    if(["bench","inclinePress"].includes(f)) return `<g><rect x="${q(180)}" y="${r(325)}" width="${q(340)}" height="${r(24)}" rx="${q(10)}" fill="#4b5d72"/><line x1="${q(275)}" y1="${r(145)}" x2="${q(470)}" y2="${r(145)}" stroke="#d2dce6" stroke-width="${q(9)}"/></g>`;
    if(f==="pulldown") return `<g><line x1="${q(255)}" y1="${r(75)}" x2="${q(505)}" y2="${r(75)}" stroke="#9fb2c6" stroke-width="${q(8)}"/><line x1="${q(380)}" y1="${r(35)}" x2="${q(380)}" y2="${r(75)}" stroke="#60778d" stroke-width="${q(4)}"/></g>`;
    if(f==="stairs") return `<path d="M${q(445)} ${r(400)}h${q(80)}v-${r(55)}h${q(65)}v-${r(55)}h${q(65)}v-${r(55)}h${q(65)}" fill="none" stroke="#536a82" stroke-width="${q(20)}"/>`;
    if(f==="bike") return `<g fill="none" stroke="#5a728b" stroke-width="${q(11)}"><circle cx="${q(270)}" cy="${r(365)}" r="${q(70)}"/><circle cx="${q(500)}" cy="${r(365)}" r="${q(70)}"/><path d="M${q(270)} ${r(365)} L${q(385)} ${r(265)} L${q(500)} ${r(365)} L${q(355)} ${r(365)} Z"/></g>`;
    if(f==="frontSquat") return `<line x1="${q(265)}" y1="${r(205)}" x2="${q(495)}" y2="${r(205)}" stroke="#d1dbe5" stroke-width="${q(9)}"/>`;
    if(f==="legPress") return `<g><path d="M${q(500)} ${r(105)} L${q(620)} ${r(260)}" stroke="#6b8299" stroke-width="${q(18)}"/><rect x="${q(535)}" y="${r(80)}" width="${q(145)}" height="${r(24)}" rx="${q(8)}" fill="#6b8299"/></g>`;
    if(f==="stepDown") return `<rect x="${q(270)}" y="${r(350)}" width="${q(180)}" height="${r(55)}" rx="${q(8)}" fill="#41546a"/>`;
    if(f==="doorPec"||f==="calfWall") return `<rect x="${q(590)}" y="${r(70)}" width="${q(22)}" height="${r(335)}" fill="#667d93"/>`;
    if(f==="pallof"||f==="singleRow") return `<g><rect x="${q(70)}" y="${r(95)}" width="${q(24)}" height="${r(290)}" fill="#52677d"/><line x1="${q(94)}" y1="${r(210)}" x2="${q(350)}" y2="${r(210)}" stroke="#59c9f5" stroke-width="${q(4)}"/></g>`;
    return "";
  }

  function addStyles(){
    if(document.getElementById("zf30-style")) return;
    const s=document.createElement("style");s.id="zf30-style";s.textContent=`
#zf30{position:fixed;inset:0;z-index:1000000;background:#07111f;color:#eef6ff;overflow:auto;font-family:inherit}
#zf30 *{box-sizing:border-box}.zf30-shell{max-width:1200px;margin:auto;min-height:100%;padding:14px 18px 118px}
.zf30-top{display:grid;grid-template-columns:220px 1fr 54px;gap:18px;align-items:center;padding:12px 0 16px;border-bottom:1px solid #24364d;position:sticky;top:0;background:#07111ff5;backdrop-filter:blur(10px);z-index:8}
.zf30-brand{display:flex;align-items:center;gap:10px}.zf30-logo{width:48px;height:48px;border:2px solid #28d69b;border-radius:12px;display:grid;place-items:center;color:#4bc9f6;font-weight:900}.zf30-brand b{font-size:23px}.zf30-context{display:flex;align-items:center;gap:12px;justify-content:flex-end}.zf30-context b{font-size:18px}.zf30-progress{width:260px;height:7px;background:#1d3048;border-radius:99px;overflow:hidden}.zf30-progress span{display:block;height:100%;background:#23b8ef;border-radius:99px}.zf30-close{height:44px;width:44px;border-radius:12px;border:1px solid #3b516d;background:#101f33;color:#fff;font-size:26px}
.zf30-exhead{padding:18px 0 12px}.zf30-exhead h1{margin:0;font-size:34px}.zf30-exhead p{margin:6px 0 0;color:#9fb3cb;font-size:16px}.zf30-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:11px}.zf30-chip{padding:8px 12px;border-radius:999px;border:1px solid #304a68;background:#0d1b2d;color:#dbe7f4;font-size:13px}
.zf30-grid{display:grid;grid-template-columns:150px minmax(0,1.25fr) minmax(310px,.75fr);gap:12px;align-items:stretch}.zf30-rail,.zf30-copy,.zf30-visual{border:1px solid #263b56;background:#0b1829;border-radius:20px}.zf30-rail{padding:12px}.zf30-rail button{width:100%;display:grid;grid-template-columns:34px 1fr;gap:8px;align-items:center;text-align:left;border:0;border-left:3px solid #2c4059;background:transparent;color:#9eb1c7;padding:12px 6px;min-height:72px}.zf30-rail button.active{color:#eef8ff;border-left-color:#28b8f1;background:#0d2138;border-radius:0 10px 10px 0}.zf30-rail .n{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#14263c;border:1px solid #38526f;font-weight:800}.zf30-rail button.active .n{background:#0d8ef7;border-color:#42c8ff}.zf30-rail small{font-size:11px;line-height:1.2}
.zf30-visual{padding:10px;display:grid;align-items:center;background:linear-gradient(145deg,#101d2d,#07111f)}.zf30-svg{display:block;width:100%;height:auto}.zf30-copy{padding:20px}.zf30-kicker{color:#33bdf3;font-weight:800;margin-bottom:7px}.zf30-copy h2{font-size:28px;margin:0 0 16px}.zf30-list{display:grid;gap:12px}.zf30-item{display:grid;grid-template-columns:30px 1fr;gap:10px;align-items:start;color:#dce7f4;line-height:1.45}.zf30-item .num{width:28px;height:28px;border-radius:50%;background:#0b8ef7;display:grid;place-items:center;font-weight:800}.zf30-tip{margin-top:14px;padding:13px;border-radius:14px;background:#09271d;border:1px solid #1d7650}.zf30-tip b{color:#48e28f}.zf30-warn{margin-top:10px;padding:13px;border-radius:14px;background:#24171a;border:1px solid #7e3a3f}.zf30-warn b{color:#ff7b74}.zf30-warn ul{margin:8px 0 0;padding-left:19px}.zf30-warn li{margin:6px 0;color:#f0d5d5}
.zf30-thumbs{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin:12px 0}.zf30-thumb{border:2px solid #283f5b;background:#0a1728;border-radius:14px;padding:5px;color:#d8e5f4;text-align:left;overflow:hidden}.zf30-thumb.active{border-color:#2ebcf3;box-shadow:0 0 0 2px #2ebcf332}.zf30-thumb .pic{height:105px;border-radius:10px;overflow:hidden;background:#111c2b}.zf30-thumb strong{display:block;padding:7px 5px 4px;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.zf30-thumb strong span{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#0b8ef7;margin-right:5px}
.zf30-voice{position:sticky;bottom:7px;z-index:10;background:#0a1829f7;border:1px solid #304a68;border-radius:18px;padding:13px;box-shadow:0 14px 44px #0008}.zf30-voicehead{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}.zf30-vtitle{display:flex;align-items:center;gap:10px}.zf30-vtitle .icon{font-size:27px}.zf30-vtitle b{font-size:18px}.zf30-vtitle small{display:block;color:#96aac2}.zf30-options{display:flex;gap:8px;align-items:center}.zf30-options select{height:42px;border-radius:10px;border:1px solid #39536f;background:#102039;color:#fff;padding:0 10px}.zf30-mode{display:flex;border:1px solid #39536f;border-radius:10px;overflow:hidden}.zf30-mode button{border:0;background:#0d1c30;color:#cbd9e8;padding:10px 12px}.zf30-mode button.active{background:#20b5ef;color:#061019;font-weight:800}
.zf30-controls{display:grid;grid-template-columns:1.2fr 1fr 1fr 1fr;gap:8px}.zf30-controls button{height:48px;border-radius:12px;border:1px solid #39536f;background:#14253a;color:#fff;font-weight:800;font-size:14px}.zf30-controls .play{background:#1593f7}.zf30-controls .stop{border-color:#874049;background:#28171b}.zf30-bottomnav{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:13px}.zf30-bottomnav button{height:58px;border-radius:14px;border:1px solid #354d69;background:#14243a;color:#d2dfed;font-weight:800;font-size:16px}.zf30-bottomnav .next{background:#20d56a;color:#06130b;border-color:#20d56a}.zf30-bottomnav button:disabled{opacity:.35}
.zf30-launch{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0}.zf30-launch button{min-height:54px;border-radius:14px;border:1px solid #38526f;background:#14243a;color:#fff;font-weight:800}.zf30-launch .visual{background:#24b8f2;color:#07111b;border-color:#24b8f2}.zf30-launch .voice{background:#0f7e52;border-color:#29b77f}
@media(max-width:900px){.zf30-top{grid-template-columns:1fr auto}.zf30-context{display:none}.zf30-grid{grid-template-columns:1fr}.zf30-rail{display:flex;overflow:auto;padding:8px;scroll-snap-type:x mandatory}.zf30-rail button{min-width:160px;border-left:0;border-bottom:3px solid #2c4059;scroll-snap-align:start}.zf30-rail button.active{border-left:0;border-bottom-color:#28b8f1;border-radius:10px}.zf30-copy{order:3}.zf30-thumbs{display:flex;overflow-x:auto;scroll-snap-type:x mandatory}.zf30-thumb{min-width:165px;scroll-snap-align:start}.zf30-thumb .pic{height:90px}.zf30-voicehead{align-items:flex-start;flex-direction:column}.zf30-options{width:100%;flex-wrap:wrap}.zf30-mode{flex:1}.zf30-mode button{flex:1}.zf30-controls{grid-template-columns:1fr 1fr}.zf30-shell{padding:8px 8px 124px}.zf30-exhead h1{font-size:28px}.zf30-visual{padding:6px}.zf30-copy{padding:15px}.zf30-launch{grid-template-columns:1fr 1fr}}
`;document.head.appendChild(s);
  }

  function bestVoice(){
    const voices=speechSynthesis.getVoices();
    return voices.find(v=>/Google.*English|Samsung.*English|Microsoft.*English/i.test(v.name))
      || voices.find(v=>/^en-(GB|US)/i.test(v.lang))
      || voices.find(v=>/^en/i.test(v.lang))
      || voices[0];
  }
  function stopVoice(){
    try{speechSynthesis.cancel()}catch(e){}
    utterance=null;paused=false;paintVoiceState();
  }
  function pauseResume(){
    try{
      if(speechSynthesis.paused){speechSynthesis.resume();paused=false}
      else if(speechSynthesis.speaking){speechSynthesis.pause();paused=true}
    }catch(e){}
    paintVoiceState();
  }
  function stepSpeech(){
    if(!currentDemo)return"";
    const s=currentDemo.steps[currentStep];
    if(voiceMode==="essential")return `Step ${currentStep+1}. ${s.title}. ${s.cue}.`;
    return `Step ${currentStep+1}. ${s.title}. ${s.text} Coaching cue. ${s.cue}.`;
  }
  function playVoice(){
    if(!("speechSynthesis" in window)||!currentDemo)return;
    stopVoice();
    const u=new SpeechSynthesisUtterance(stepSpeech());
    const v=bestVoice();if(v)u.voice=v;
    u.rate=voiceRate;u.pitch=.96;u.volume=.95;
    u.onend=()=>{utterance=null;paused=false;paintVoiceState()};
    u.onerror=()=>{utterance=null;paused=false;paintVoiceState()};
    utterance=u;speechSynthesis.speak(u);paintVoiceState();
  }
  function replayVoice(){playVoice()}
  function paintVoiceState(){
    const root=document.getElementById("zf30");if(!root)return;
    const b=root.querySelector("[data-action='pause']");
    if(b)b.textContent=paused?"▶ Resume":"❚❚ Pause";
  }

  function renderDemo(){
    const root=document.getElementById("zf30");if(!root||!currentDemo||!currentExercise)return;
    const s=currentDemo.steps[currentStep];
    root.querySelector(".zf30-visual").innerHTML=trainerSvg(currentDemo.family,currentStep,s.title,[s.cue,currentDemo.feel],false);
    root.querySelector(".zf30-kicker").textContent=`Step ${currentStep+1} of ${currentDemo.steps.length}`;
    root.querySelector(".zf30-copy h2").textContent=s.title;
    root.querySelector(".zf30-list").innerHTML=`
      <div class="zf30-item"><span class="num">1</span><span>${esc(s.text)}</span></div>
      <div class="zf30-item"><span class="num">2</span><span><b>Coach cue:</b> ${esc(s.cue)}</span></div>
      <div class="zf30-item"><span class="num">3</span><span>Move slowly enough that you can stop and hold the position at any point.</span></div>`;
    root.querySelector(".zf30-tip").innerHTML=`<b>💡 What you should feel</b><div>${esc(currentDemo.feel)}</div>`;
    root.querySelector(".zf30-warn").innerHTML=`<b>⚠ Common mistakes</b><ul>${currentDemo.mistakes.map(m=>`<li>${esc(m)}</li>`).join("")}</ul>`;
    root.querySelectorAll("[data-step]").forEach(b=>b.classList.toggle("active",Number(b.dataset.step)===currentStep));
    root.querySelector(".zf30-progress span").style.width=`${((currentStep+1)/currentDemo.steps.length)*100}%`;
    const prev=root.querySelector("[data-action='prev']"),next=root.querySelector("[data-action='next']");
    prev.disabled=currentStep===0;next.textContent=currentStep===currentDemo.steps.length-1?"Finish Demo":"Next Step →";
  }

  function openDemo(ex,autoplay=false){
    currentExercise=ex||getExercise();currentDemo=makeDemo(currentExercise);currentStep=0;stopVoice();
    document.getElementById("zf30")?.remove();
    const root=document.createElement("div");root.id="zf30";
    const sessionTitle=(()=>{try{return typeof state!=="undefined"&&state?state.workoutName:"Workout"}catch(e){return"Workout"}})();
    const setCount=Array.isArray(currentExercise.sets)?currentExercise.sets.length:currentExercise.sets||"—";
    root.innerHTML=`<div class="zf30-shell">
      <header class="zf30-top">
        <div class="zf30-brand"><div class="zf30-logo">ZF</div><div><b>Zahi Fit</b><small style="display:block;color:#9eb1c7">Your Personal PT</small></div></div>
        <div class="zf30-context"><div><b>${esc(sessionTitle)}</b><div style="color:#9db0c8;font-size:13px">Exercise guidance</div></div><div class="zf30-progress"><span></span></div></div>
        <button class="zf30-close" data-action="close" aria-label="Close">×</button>
      </header>

      <section class="zf30-exhead">
        <h1>${esc(currentExercise.n)}</h1>
        <p>${esc(currentExercise.cue||"Follow the coached movement sequence below.")}</p>
        <div class="zf30-meta">
          <span class="zf30-chip">◷ ${esc(String(setCount))} sets</span>
          <span class="zf30-chip">◎ ${esc(currentExercise.reps||"—")}</span>
          <span class="zf30-chip">⌛ ${currentExercise.rest?`Rest ${currentExercise.rest}s`:"Continuous"}</span>
          <span class="zf30-chip">💪 ${esc(currentExercise.block||"Exercise")}</span>
        </div>
      </section>

      <section class="zf30-grid">
        <nav class="zf30-rail">
          ${currentDemo.steps.map((s,i)=>`<button data-step="${i}"><span class="n">${i+1}</span><small>${esc(s.title)}</small></button>`).join("")}
        </nav>
        <div class="zf30-visual"></div>
        <aside class="zf30-copy">
          <div class="zf30-kicker"></div><h2></h2>
          <div class="zf30-list"></div>
          <div class="zf30-tip"></div>
          <div class="zf30-warn"></div>
        </aside>
      </section>

      <section class="zf30-thumbs">
        ${currentDemo.steps.map((s,i)=>`<button class="zf30-thumb" data-step="${i}">
          <div class="pic">${trainerSvg(currentDemo.family,i,s.title,[],true)}</div>
          <strong><span>${i+1}</span>${esc(s.title)}</strong>
        </button>`).join("")}
      </section>

      <section class="zf30-voice">
        <div class="zf30-voicehead">
          <div class="zf30-vtitle"><div class="icon">🔊</div><div><b>Voice Coach</b><small>Controls stay visible while you follow the movement.</small></div></div>
          <div class="zf30-options">
            <select data-action="speed" aria-label="Voice speed"><option value="0.70">Very slow</option><option value="0.82">Smooth</option><option value="0.94">Normal</option></select>
            <div class="zf30-mode"><button data-mode="essential">Essential cues</button><button data-mode="full">Full coaching</button></div>
          </div>
        </div>
        <div class="zf30-controls">
          <button class="play" data-action="play">▶ Play Step</button>
          <button data-action="pause">❚❚ Pause</button>
          <button data-action="replay">↻ Replay Step</button>
          <button class="stop" data-action="stop">■ Stop</button>
        </div>
      </section>

      <section class="zf30-bottomnav">
        <button data-action="prev">← Previous Step</button>
        <button class="next" data-action="next">Next Step →</button>
      </section>
    </div>`;
    document.body.appendChild(root);
    root.querySelector("[data-action='speed']").value=String(voiceRate);
    root.querySelectorAll("[data-mode]").forEach(b=>b.classList.toggle("active",b.dataset.mode===voiceMode));
    bindDemoEvents(root);
    renderDemo();
    if(autoplay)setTimeout(playVoice,180);
  }

  function bindDemoEvents(root){
    root.addEventListener("click",e=>{
      const stepBtn=e.target.closest("[data-step]");
      if(stepBtn){stopVoice();currentStep=Number(stepBtn.dataset.step);renderDemo();return}
      const a=e.target.closest("[data-action]");if(!a)return;
      const action=a.dataset.action;
      if(action==="close"){stopVoice();root.remove();return}
      if(action==="play"){playVoice();return}
      if(action==="pause"){pauseResume();return}
      if(action==="replay"){replayVoice();return}
      if(action==="stop"){stopVoice();return}
      if(action==="prev"&&currentStep>0){stopVoice();currentStep--;renderDemo();return}
      if(action==="next"){
        if(currentStep<currentDemo.steps.length-1){stopVoice();currentStep++;renderDemo()}
        else{stopVoice();root.remove()}
      }
    });
    root.querySelector("[data-action='speed']").addEventListener("change",e=>{
      voiceRate=Number(e.target.value);localStorage.setItem(RATE_KEY,String(voiceRate));
      if(utterance)playVoice();
    });
    root.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>{
      voiceMode=b.dataset.mode;localStorage.setItem(MODE_KEY,voiceMode);
      root.querySelectorAll("[data-mode]").forEach(x=>x.classList.toggle("active",x===b));
    }));
  }

  function injectLaunchers(){
    const box=document.getElementById("activeExerciseCard");if(!box)return;
    box.querySelectorAll(".v27-demo,.zf29-launch,.zf30-launch").forEach(x=>x.remove());
    const old=box.querySelector(".demo-link");if(old)old.style.display="none";
    const launch=document.createElement("div");launch.className="zf30-launch";
    launch.innerHTML=`<button class="visual" data-zf30="visual">▣ Open Visual PT</button><button class="voice" data-zf30="voice">🔊 Open Voice Coach</button>`;
    const coach=box.querySelector(".coach-grid");
    if(coach)box.insertBefore(launch,coach);else box.append(launch);
  }

  function wireExerciseRender(){
    try{
      const prior=renderExercise;
      renderExercise=function(){prior();injectLaunchers()};
      if(typeof state!=="undefined"&&state)injectLaunchers();
    }catch(e){console.error("Zahi Fit v3 launcher setup failed",e)}
  }

  /* Robust delegated click handling: no dependence on the older v2.7 buttons. */
  document.addEventListener("click",e=>{
    const b=e.target.closest("[data-zf30]");
    if(!b)return;
    e.preventDefault();
    const ex=getExercise();
    if(b.dataset.zf30==="voice")openDemo(ex,true);
    else openDemo(ex,false);
  },true);

  addStyles();
  wireExerciseRender();

  const badge=document.getElementById("versionBadge");
  if(badge)badge.textContent=VERSION;
})();
