
"use strict";
const APP_VERSION="2.3.1",ACTIVE_KEY="activeWorkoutV230";
const $=id=>document.getElementById(id);
const MAX_IMPORT_BYTES=200000,MAX_SETS=12;

const PROGRAM=[
{name:"A — Posterior Strength + StairMaster",duration:80,focus:"Deadlift strength • glutes/hamstrings • conditioning • hip mobility",exercises:[
E("Hip 90/90 Flow","Mobility",2,"6/side",30,"Move slowly through internal and external hip rotation. Stay tall through the trunk.","https://www.youtube.com/results?search_query=90+90+hip+mobility",["Sit tall and rotate from the hips","Keep both sit bones controlled","Use slow breathing"],["Collapsing the torso","Forcing painful range"],["World's Greatest Stretch","Cossack Squat"]),
E("World's Greatest Stretch","Mobility",2,"5/side",30,"Long lunge, thoracic rotation, controlled breathing.","https://www.youtube.com/results?search_query=worlds+greatest+stretch",["Long stable lunge","Rotate through upper back","Keep breathing"],["Rushing positions","Dropping the hips without control"],["Hip Flexor + Rotation Stretch","Inchworm to Down Dog"]),
E("Deadlift","Strength",4,"5",150,"Brace hard, keep the bar close, push the floor away. Keep 1–3 clean reps in reserve.","https://www.youtube.com/results?search_query=deadlift+proper+form",["Brace before the pull","Bar stays close to legs","Push the floor away"],["Jerking the bar","Rounding under load","Hyperextending at lockout"],["Trap-Bar Deadlift","Romanian Deadlift"]),
E("Bulgarian Split Squat","Strength",3,"8/leg",90,"Stable front foot, controlled descent, drive through whole foot.","https://www.youtube.com/results?search_query=bulgarian+split+squat+form",["Front foot fully planted","Descend under control","Drive through mid-foot"],["Front heel lifting","Knee collapsing inward"],["Reverse Lunge","Leg Press"]),
E("Dumbbell Romanian Deadlift","Hypertrophy",3,"10",90,"Soft knees, hips back, long spine, load the hamstrings.","https://www.youtube.com/results?search_query=dumbbell+romanian+deadlift+form",["Hips travel back","Weights stay close","Stop when hamstrings limit range"],["Squatting the movement","Rounding to gain depth"],["Cable Pull-Through","Hamstring Curl"]),
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

function E(n,block,sets,reps,rest,cue,video,how,mistakes,subs){return{n,block,sets,reps,rest,cue,video,how,mistakes,subs}}
let workouts=PROGRAM,activeIndex=Number(localStorage.getItem("nextWorkout")||0)%workouts.length,state=null,timerInterval=null,restInterval=null,pendingWorker=null,pendingIndex=null;
let readiness={energy:null,soreness:null,time:null};

function clone(x){return JSON.parse(JSON.stringify(x))}
function getHistory(){try{const h=JSON.parse(localStorage.getItem("history")||"[]");return Array.isArray(h)?h:[]}catch{return[]}}
function node(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
function showTab(id,btn){["home","readiness","session","summary","history","guide"].forEach(x=>$(x).classList.add("hidden"));$(id).classList.remove("hidden");document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));if(btn)btn.classList.add("active");if(id==="history")renderHistory()}
function renderHome(){const w=workouts[activeIndex];$("todayTitle").textContent=w.name;$("todayMeta").textContent=`Approx. ${w.duration} min`;$("todayFocus").textContent=w.focus;const r=$("rotation");r.replaceChildren();workouts.forEach((x,i)=>{const d=node("div","workout");d.append(node("h3","",x.name),node("div","meta",`${x.duration} min`),node("div","notice",x.focus));const b=node("button","btn small secondary","Start this");b.addEventListener("click",()=>openReadiness(i));d.append(b);r.append(d)});const h=getHistory(),weekAgo=new Date(Date.now()-7*86400000),wh=h.filter(x=>new Date(x.date)>=weekAgo);$("statSessions").textContent=wh.length;$("statMinutes").textContent=wh.reduce((a,b)=>a+(b.minutes||0),0);$("statStreak").textContent=streak(h);const s=loadState(false);if(s){$("resumeCard").classList.remove("hidden");$("resumeText").textContent=`${s.workoutName} • exercise ${s.exerciseIndex+1} of ${s.exercises.length}`}else $("resumeCard").classList.add("hidden")}
function streak(h){const ds=[...new Set(h.map(x=>new Date(x.date).toDateString()))];if(!ds.length)return 0;let n=0,d=new Date();for(let i=0;i<365;i++){if(ds.includes(d.toDateString()))n++;else if(i>0)break;d.setDate(d.getDate()-1)}return n}
function openReadiness(i){pendingIndex=i;readiness={energy:null,soreness:null,time:null};document.querySelectorAll(".choice-row button").forEach(b=>b.classList.remove("active"));$("readinessAdvice").textContent="Select your status to generate today's guidance.";showTab("readiness")}
function choice(container,key){$(container).querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{$(container).querySelectorAll("button").forEach(x=>x.classList.remove("active"));b.classList.add("active");readiness[key]=Number(b.dataset.value);updateAdvice()}))}
function readinessProfile(){
  const lowEnergy = readiness.energy <= 2;
  const highFatigue = readiness.soreness >= 4;
  const moderateFatigue = readiness.soreness === 3;
  const shortSession = readiness.time === 60;
  const mediumSession = readiness.time === 75;

  let mode = "full";
  let label = "Full session";
  let message = "Full session: complete the planned work at controlled RPE 7–8, keeping 1–3 reps in reserve on compound lifts.";

  if (lowEnergy || highFatigue) {
    mode = shortSession ? "recovery60" : "reduced";
    label = "Reduced-load session";
    message = "Reduced-load session: keep 3–4 reps in reserve, reduce accessory volume, and keep conditioning controlled.";
  } else if (shortSession) {
    mode = "time60";
    label = "60-minute priority session";
    message = "60-minute mode: keep the warm-up, main strength movement, one key accessory, durability, conditioning and cooldown.";
  } else if (mediumSession || moderateFatigue) {
    mode = "balanced75";
    label = "Balanced session";
    message = "Balanced session: keep the key lifts and conditioning, with slightly reduced accessory volume if needed.";
  }

  return {mode,label,message,lowEnergy,highFatigue,moderateFatigue,shortSession,mediumSession};
}

function updateAdvice(){
  if(!readiness.energy||!readiness.soreness||!readiness.time)return;
  const p=readinessProfile();
  $("readinessAdvice").textContent=p.message;
}

function adaptExercise(ex, profile){
  const x=clone(ex);

  // Volume reduction rules.
  if (profile.mode==="recovery60") {
    if (["Strength","Hypertrophy","Power"].includes(x.block)) x.sets=Math.max(2,x.sets-1);
    if (x.block==="Durability") x.sets=Math.max(2,x.sets-1);
    if (x.block==="Conditioning") {
      if (x.n.includes("StairMaster Steady State")) x.reps="15–20 min";
      else if (x.n.includes("Intervals")) x.sets=Math.max(4,Math.min(x.sets,4));
      else x.sets=Math.max(3,x.sets-2);
    }
  } else if (profile.mode==="reduced") {
    if (["Hypertrophy","Durability"].includes(x.block)) x.sets=Math.max(2,x.sets-1);
    if (x.block==="Conditioning" && x.sets>1) x.sets=Math.max(4,x.sets-1);
  } else if (profile.mode==="time60") {
    if (x.block==="Hypertrophy") x.sets=Math.max(2,x.sets-1);
    if (x.block==="Conditioning") {
      if (x.n.includes("StairMaster Steady State")) x.reps="18–20 min";
      else if (x.sets>1) x.sets=Math.max(4,x.sets-1);
    }
  } else if (profile.mode==="balanced75") {
    if (x.block==="Hypertrophy" && x.sets>3) x.sets=3;
  }

  return x;
}

function adaptWorkout(i){
  const w=workouts[i];
  const p=readinessProfile();
  let selected=clone(w.exercises);

  // Time-based prioritization: preserve one mobility, main strength, key accessory,
  // durability, conditioning and one flexibility block.
  if (readiness.time===60) {
    const firstMob = selected.find(x=>x.block==="Mobility");
    const strength = selected.find(x=>x.block==="Strength");
    const accessory = selected.find(x=>["Hypertrophy","Power"].includes(x.block));
    const durability = selected.find(x=>x.block==="Durability");
    const conditioning = selected.find(x=>x.block==="Conditioning");
    const flexibility = selected.find(x=>x.block==="Flexibility");
    selected=[firstMob,strength,accessory,durability,conditioning,flexibility].filter(Boolean);
  } else if (readiness.time===75) {
    // Keep all key work, remove only one lower-priority mobility/flexibility item if present.
    let removedMob=false, removedFlex=false;
    selected=selected.filter(x=>{
      if(x.block==="Mobility" && !removedMob){removedMob=true; return true}
      if(x.block==="Mobility" && removedMob) return false;
      if(x.block==="Flexibility" && !removedFlex){removedFlex=true; return true}
      if(x.block==="Flexibility" && removedFlex) return false;
      return true;
    });
  }

  // Low readiness: remove one lower-priority accessory in addition to time rules.
  if (p.lowEnergy || p.highFatigue) {
    let removed=false;
    selected=selected.filter(x=>{
      if(!removed && x.block==="Hypertrophy"){removed=true; return false}
      return true;
    });
  }

  selected=selected.map(x=>adaptExercise(x,p));

  return {
    name:w.name,
    duration:readiness.time,
    focus:w.focus,
    profile:p,
    exercises:selected
  };
}

function beginWorkout(){if(!readiness.energy||!readiness.soreness||!readiness.time){alert("Complete the readiness check first.");return}state=newState(pendingIndex);persist();activate()}
function newState(i){
  const aw=adaptWorkout(i);
  return{
    workoutIndex:i,
    workoutName:aw.name,
    startTime:Date.now(),
    exerciseIndex:0,
    readiness:clone(readiness),
    adaptation:{
      mode:aw.profile.mode,
      label:aw.profile.label,
      message:aw.profile.message,
      targetMinutes:aw.duration
    },
    exercises:aw.exercises.map(ex=>({
      ...clone(ex),
      skipped:false,
      rpe:null,
      sets:Array.from({length:ex.sets},()=>({w:"",r:"",done:false}))
    }))
  }
}
function persist(){if(state)localStorage.setItem(ACTIVE_KEY,JSON.stringify(state))}
function loadState(set=true){try{const s=JSON.parse(localStorage.getItem(ACTIVE_KEY)||"null");if(!s||!Array.isArray(s.exercises))return null;if(set)state=s;return s}catch{return null}}
function activate(){
  activeIndex=state.workoutIndex;
  $("sessionTitle").textContent=state.workoutName;
  clearInterval(timerInterval);
  timerInterval=setInterval(clock,1000);
  renderExercise();
  showTab("session",document.querySelector('[data-tab="session"]'));
}
function clock(){if(!state)return;const s=Math.floor((Date.now()-state.startTime)/1000);$("timer").textContent=`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`}
function previousFor(name){for(const rec of getHistory()){const d=(rec.details||[]).find(x=>x.exercise===name);if(d)return d}return null}
function suggestion(ex,prev){
  const reduced = state && state.adaptation && ["recovery60","reduced"].includes(state.adaptation.mode);
  if(!prev||!Array.isArray(prev.sets)){
    return reduced
      ? "Reduced-load day — choose a technically easy load and keep 3–4 reps in reserve."
      : "First logged session — choose a technically comfortable load.";
  }
  const vals=prev.sets.map(s=>parseFloat(s.w)).filter(Number.isFinite);
  if(!vals.length) return reduced
    ? "Use a conservative load today and prioritize clean technique."
    : "Use the previous session as a technique reference; no numeric load was recorded.";
  const avg=vals.reduce((a,b)=>a+b,0)/vals.length;
  const rpe=Number(prev.rpe||8);

  if(reduced) return `Reduced-load target: approximately ${Math.max(0,avg-2.5).toFixed(1)} kg, or keep the prior load with fewer reps.`;
  if(rpe<=7)return`Suggested load: about ${(avg+2.5).toFixed(1)} kg if warm-up feels good.`;
  if(rpe>=9)return`Suggested load: around ${Math.max(0,avg-2.5).toFixed(1)} kg or repeat with fewer reps.`;
  return`Suggested load: repeat around ${avg.toFixed(1)} kg and aim for cleaner/more complete reps.`;
}
function completion(){let t=0,d=0;state.exercises.forEach(ex=>ex.sets.forEach(s=>{t++;if(s.done||ex.skipped)d++}));return t?Math.round(d/t*100):0}
function renderExercise(){const ex=state.exercises[state.exerciseIndex],box=$("activeExerciseCard");box.replaceChildren();$("exerciseCounter").textContent=`Exercise ${state.exerciseIndex+1} of ${state.exercises.length}`;$("completionCounter").textContent=`${completion()}% complete`;$("bar").style.width=`${completion()}%`;$("prevExerciseBtn").disabled=state.exerciseIndex===0;$("nextExerciseBtn").disabled=state.exerciseIndex===state.exercises.length-1;
if(state.adaptation){
  const ad=node("div","suggestion-box");
  ad.append(node("strong","",state.adaptation.label),node("div","meta",`${state.adaptation.message} Target session: ${state.adaptation.targetMinutes} min.`));
  box.append(ad);
}
box.append(node("div","block-label",ex.block),node("div","exercise-title",ex.n),node("div","cue",ex.cue));
const meta=node("div","exercise-meta");meta.append(node("span","chip",ex.block),node("span","chip",`${ex.sets.length} sets`),node("span","chip",`Target: ${ex.reps}`),node("span","chip",ex.rest?`Rest: ${ex.rest}s`:"Continuous"));box.append(meta);
const cg=node("div","coach-grid"),how=node("div","coach-box"),mist=node("div","coach-box");how.append(node("b","","HOW TO DO IT"));let ul=node("ul");ex.how.forEach(x=>ul.append(node("li","",x)));how.append(ul);mist.append(node("b","","COMMON MISTAKES"));ul=node("ul");ex.mistakes.forEach(x=>ul.append(node("li","",x)));mist.append(ul);cg.append(how,mist);box.append(cg);
const prev=previousFor(ex.n),pb=node("div","previous-box");pb.append(node("b","","Previous performance"));pb.append(node("div","meta",prev&&prev.sets?prev.sets.map((s,i)=>`S${i+1}: ${s.w||"—"} × ${s.r||"—"}`).join(" • "):"No previous logged performance yet."));box.append(pb);
const sg=node("div","suggestion-box");sg.append(node("strong","","PT progression suggestion"),node("div","meta",suggestion(ex,prev)));box.append(sg);
const a=node("a","btn blue demo-link","Watch full video");a.href=ex.video;a.target="_blank";a.rel="noopener noreferrer";box.append(a);
const table=node("div","set-table"),head=node("div","set-row set-head");["Set","−","kg","＋","Reps","Done"].forEach(t=>head.append(node("div","",t)));table.append(head);
ex.sets.forEach((s,i)=>{const row=node("div","set-row");row.append(node("div","setnum",String(i+1)));const minus=node("button","step-btn","−"),w=document.createElement("input"),plus=node("button","step-btn","+"),r=document.createElement("input"),c=node("button","check"+(s.done?" done":""),"✓");w.inputMode="decimal";w.value=s.w;w.placeholder=["Mobility","Flexibility"].includes(ex.block)?"—":"kg";r.value=s.r;r.placeholder=ex.reps;minus.addEventListener("click",()=>{const v=parseFloat(w.value)||0;w.value=Math.max(0,v-2.5);s.w=w.value;persist()});plus.addEventListener("click",()=>{const v=parseFloat(w.value)||0;w.value=(v+2.5).toFixed(1);s.w=w.value;persist()});w.addEventListener("input",()=>{s.w=w.value.slice(0,12);persist()});r.addEventListener("input",()=>{s.r=r.value.slice(0,45);persist()});c.addEventListener("click",()=>{s.done=!s.done;c.classList.toggle("done",s.done);persist();renderProgress();if(s.done&&ex.rest>0)startRest(ex.rest)});row.append(minus,w,plus,r,c);table.append(row)});box.append(table);
if(!["Mobility","Flexibility"].includes(ex.block)){const rp=node("div","rpe-buttons");[["Easy",6],["Good",7],["Hard",8],["Very hard",9]].forEach(([lab,v])=>{const b=node("button","rpe"+(ex.rpe===v?" active":""),`${lab} • ${v}`);b.addEventListener("click",()=>{ex.rpe=v;persist();renderExercise()});rp.append(b)});box.append(rp)}
$("skipExerciseBtn").textContent=ex.skipped?"Unskip":"Skip";renderProgress()}
function renderProgress(){const p=completion();$("completionCounter").textContent=`${p}% complete`;$("bar").style.width=`${p}%`}
function goto(delta){stopRest();state.exerciseIndex=Math.max(0,Math.min(state.exercises.length-1,state.exerciseIndex+delta));persist();renderExercise()}
function startRest(sec){stopRest();let rem=sec;$("restCard").classList.remove("hidden");const paint=()=>{$("restTimer").textContent=`${String(Math.floor(rem/60)).padStart(2,"0")}:${String(rem%60).padStart(2,"0")}`};paint();restInterval=setInterval(()=>{rem--;paint();if(rem<=0){stopRest();if(navigator.vibrate)navigator.vibrate([250,100,250])}},1000);$("restMinusBtn").onclick=()=>{rem=Math.max(0,rem-15);paint()};$("restPlusBtn").onclick=()=>{rem+=15;paint()}}
function stopRest(){clearInterval(restInterval);restInterval=null;$("restCard").classList.add("hidden")}
function toggleSkip(){const ex=state.exercises[state.exerciseIndex];ex.skipped=!ex.skipped;persist();renderExercise()}
function openSheet(id){$(id).classList.remove("hidden")}function closeSheet(id){$(id).classList.add("hidden")}
function replacements(){const ex=state.exercises[state.exerciseIndex],box=$("replacementList");box.replaceChildren();ex.subs.forEach(name=>{const b=node("button","sheet-btn",name);b.addEventListener("click",()=>{const src=PROGRAM.flatMap(w=>w.exercises).find(x=>x.n===name);if(src){const oldSets=ex.sets;state.exercises[state.exerciseIndex]={...clone(src),skipped:false,rpe:null,sets:Array.from({length:src.sets},(_,i)=>oldSets[i]||{w:"",r:"",done:false})};persist();closeSheet("replaceSheet");renderExercise()}else alert("Substitute is listed but not yet in the built-in library.")});box.append(b)});openSheet("replaceSheet")}
function calcVolume(details){let v=0;details.forEach(d=>(d.sets||[]).forEach(s=>{const w=parseFloat(s.w),r=parseFloat(s.r);if(Number.isFinite(w)&&Number.isFinite(r))v+=w*r}));return Math.round(v)}
function finish(){if(!state)return;if(!confirm("Finish and save this workout?"))return;stopRest();clearInterval(timerInterval);const mins=Math.max(1,Math.round((Date.now()-state.startTime)/60000)),details=state.exercises.map(ex=>({exercise:ex.n,block:ex.block,sets:ex.sets.map(s=>({w:s.w,r:s.r})),done:ex.sets.map(s=>s.done),skipped:ex.skipped,rpe:ex.rpe})),rec={date:new Date().toISOString(),workout:state.workoutName,minutes:mins,readiness:state.readiness,details};const h=getHistory();h.unshift(rec);localStorage.setItem("history",JSON.stringify(h.slice(0,500)));activeIndex=(state.workoutIndex+1)%workouts.length;localStorage.setItem("nextWorkout",String(activeIndex));localStorage.removeItem(ACTIVE_KEY);state=null;$("summaryTitle").textContent=rec.workout;$("summaryMinutes").textContent=mins;$("summarySets").textContent=details.reduce((a,d)=>a+d.done.filter(Boolean).length,0);$("summaryVolume").textContent=calcVolume(details);const review=$("summaryReview");review.replaceChildren();details.filter(d=>d.rpe).forEach(d=>review.append(node("div","history-item",`${d.exercise} • RPE ${d.rpe}`)));if(!review.children.length)review.append(node("div","meta","No RPE values were logged."));showTab("summary")}
function renderHistory(){const box=$("historyList");box.replaceChildren();const h=getHistory();if(!h.length){box.append(node("div","meta","No workouts logged yet."));return}h.forEach(x=>{const it=node("div","history-item"),s=node("div","history-summary");s.append(node("b","",x.workout),node("span","meta",`${x.minutes} min`));it.append(s,node("div","history-detail",new Date(x.date).toLocaleString()));box.append(it)})}
function context(){return JSON.stringify({
  app:`Zahi Fit v${APP_VERSION}`,
  readiness:state?state.readiness:null,
  adaptation:state?state.adaptation:null,
  current:state?state.exercises[state.exerciseIndex]:workouts[activeIndex],
  progress:state?completion():0,
  recent:getHistory().slice(0,5)
},null,2)}
async function askPT(){try{await navigator.clipboard.writeText(`Act as my PT using this Zahi Fit context:\n${context()}`)}catch{}window.location.href="intent://chatgpt.com/#Intent;scheme=https;package=com.openai.chatgpt;S.browser_fallback_url=https%3A%2F%2Fchatgpt.com%2F;end"}
function download(name,data){const b=new Blob([data],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
function setupSW(){if(!("serviceWorker"in navigator))return;navigator.serviceWorker.register("sw.js").then(reg=>{reg.update().catch(()=>{});reg.addEventListener("updatefound",()=>{const nw=reg.installing;if(!nw)return;nw.addEventListener("statechange",()=>{if(nw.state==="installed"&&navigator.serviceWorker.controller){pendingWorker=nw;$("updateBanner").classList.remove("hidden")}})})});navigator.serviceWorker.addEventListener("controllerchange",()=>location.reload());$("updateNowBtn").onclick=()=>pendingWorker?pendingWorker.postMessage({type:"SKIP_WAITING"}):location.reload()}
function bind(){
$("startTodayBtn").onclick=()=>openReadiness(activeIndex);$("resumeBtn").onclick=()=>{loadState(true);activate()};$("cancelReadinessBtn").onclick=()=>showTab("home",document.querySelector('[data-tab="home"]'));$("beginWorkoutBtn").onclick=beginWorkout;
choice("energyChoices","energy");choice("sorenessChoices","soreness");choice("timeChoices","time");
$("prevExerciseBtn").onclick=()=>goto(-1);$("nextExerciseBtn").onclick=()=>goto(1);$("skipExerciseBtn").onclick=toggleSkip;$("restSkipBtn").onclick=stopRest;
$("sessionMenuBtn").onclick=()=>openSheet("sessionSheet");$("closeSheetBtn").onclick=()=>closeSheet("sessionSheet");$("finishWorkoutBtn").onclick=()=>{closeSheet("sessionSheet");finish()};$("replaceExerciseBtn").onclick=()=>{closeSheet("sessionSheet");replacements()};$("closeReplaceBtn").onclick=()=>closeSheet("replaceSheet");$("copyContextBtn").onclick=async()=>{try{await navigator.clipboard.writeText(context());alert("PT context copied.")}catch{}};
["askPtHomeBtn","askPtSessionBtn","askPtSettingsBtn"].forEach(id=>$(id).onclick=askPT);
$("summaryDoneBtn").onclick=()=>{renderHome();renderHistory();showTab("home",document.querySelector('[data-tab="home"]'))};
$("exportDataBtn").onclick=()=>download("zahi-fit-history.json",JSON.stringify(getHistory(),null,2));$("exportPtBtn").onclick=()=>download("zahi-fit-pt-handoff.json",context());$("resetDataBtn").onclick=()=>{if(confirm("Delete all Zahi Fit data?")){localStorage.clear();location.reload()}};
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>showTab(b.dataset.tab,b))
}
$("versionBadge").textContent=`v${APP_VERSION}`;setupSW();bind();renderHome();renderHistory();
