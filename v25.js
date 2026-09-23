
"use strict";
// Zahi Fit v2.5 overlay: flexible weekly planner + goal-driven sessions + live PT/substitution.

const V25_PROFILE_KEY="zahiFitProfileV25";

const GOALS={
  fat_loss:{label:"Fat loss",short:"Fat loss"},
  muscle:{label:"Muscle gain",short:"Muscle"},
  strength:{label:"Strength",short:"Strength"},
  endurance:{label:"Endurance",short:"Endurance"},
  athletic:{label:"Athletic fitness",short:"Athletic"},
  mobility:{label:"Mobility / flexibility",short:"Mobility"}
};

function loadProfileV25(){
  try{
    const p=JSON.parse(localStorage.getItem(V25_PROFILE_KEY)||"null");
    if(p&&p.days>=2&&p.days<=6&&GOALS[p.primary]) return {
      days:Number(p.days),
      primary:p.primary,
      secondary:Array.isArray(p.secondary)?p.secondary.filter(x=>GOALS[x]&&x!==p.primary).slice(0,3):[],
      duration:[60,75,90].includes(Number(p.duration))?Number(p.duration):75
    };
  }catch{}
  return {days:4,primary:"fat_loss",secondary:["muscle"],duration:75};
}

let profileV25=loadProfileV25();

function saveProfileV25(){
  localStorage.setItem(V25_PROFILE_KEY,JSON.stringify(profileV25));
}

function allExercisesV25(){
  return PROGRAM.flatMap(w=>w.exercises);
}

function findExerciseV25(name){
  return allExercisesV25().find(x=>x.n===name);
}

function pickExerciseV25(name){
  const ex=findExerciseV25(name);
  return ex?clone(ex):null;
}

function buildSessionV25(name,duration,focus,names){
  return {
    name,
    duration,
    focus,
    exercises:names.map(pickExerciseV25).filter(Boolean)
  };
}

function conditioningForGoalV25(goal){
  if(goal==="endurance") return "Bike Intervals";
  if(goal==="fat_loss") return "StairMaster Intervals";
  if(goal==="athletic") return "CrossFit Engine Circuit";
  if(goal==="mobility") return "StairMaster Steady State";
  return "Bike Intervals";
}

function buildGoalBoosterV25(slot){
  const g=profileV25.primary;
  const d=profileV25.duration;

  if(g==="muscle"){
    return buildSessionV25(
      slot===1?"E — Hypertrophy Booster":"F — Muscle + Core",
      d,
      "Additional hypertrophy volume • balanced upper/lower muscle work • controlled conditioning",
      slot===1
        ? ["Thoracic Rotation","Incline Dumbbell Press","Lat Pulldown","Hip Thrust","Hamstring Curl","Pallof Press","Bike Intervals","Doorway Pec Stretch"]
        : ["Hip 90/90 Flow","Dumbbell Shoulder Press","Chest-Supported Row","Bulgarian Split Squat","Dumbbell Romanian Deadlift","Farmer Carry","StairMaster Steady State","Figure-4 Glute Stretch"]
    );
  }

  if(g==="strength"){
    return buildSessionV25(
      slot===1?"E — Strength Technique":"F — Strength + Carry",
      d,
      "Submaximal strength practice • technical quality • trunk durability",
      slot===1
        ? ["World's Greatest Stretch","Front Squat","Bench Press","Chest-Supported Row","Farmer Carry","Pallof Press","Bike Intervals","Hip Flexor + Rotation Stretch"]
        : ["Hip 90/90 Flow","Deadlift","Incline Dumbbell Press","Bulgarian Split Squat","Lat Pulldown","Farmer Carry","StairMaster Steady State","Supine Hamstring Stretch"]
    );
  }

  if(g==="endurance"){
    return buildSessionV25(
      slot===1?"E — Engine Development":"F — Aerobic + Mobility",
      d,
      "Cardiovascular endurance • repeatable output • mobility and trunk control",
      slot===1
        ? ["Inchworm to Down Dog","Kettlebell Swing","Push-up + Renegade Row","Bike Intervals","Pallof Press","Hip Flexor + Rotation Stretch"]
        : ["Deep Squat Pry","Step-Down Control","StairMaster Steady State","Farmer Carry","Adductor Rockback Stretch","Calf Wall Stretch"]
    );
  }

  if(g==="athletic"){
    return buildSessionV25(
      slot===1?"E — Athletic Power":"F — Work Capacity",
      d,
      "Power • work capacity • total-body durability",
      slot===1
        ? ["Deep Squat Pry","Front Squat","Kettlebell Swing","Push-up + Renegade Row","Farmer Carry","Bike Intervals","Figure-4 Glute Stretch"]
        : ["Inchworm to Down Dog","Bulgarian Split Squat","Incline Dumbbell Press","Single-Arm Cable Row","CrossFit Engine Circuit","Pallof Press","Hip Flexor + Rotation Stretch"]
    );
  }

  if(g==="mobility"){
    return buildSessionV25(
      slot===1?"E — Mobility + Durability":"F — Movement Quality",
      d,
      "Mobility • flexibility • low-impact durability • controlled aerobic work",
      slot===1
        ? ["Hip 90/90 Flow","World's Greatest Stretch","Thoracic Rotation","Pallof Press","Step-Down Control","StairMaster Steady State","Couch Stretch","Supine Hamstring Stretch"]
        : ["Ankle Dorsiflexion Rock","Cossack Squat","Deep Squat Pry","Farmer Carry","Bike Intervals","Doorway Pec Stretch","Figure-4 Glute Stretch"]
    );
  }

  // Fat loss default
  return buildSessionV25(
    slot===1?"E — Metabolic Conditioning":"F — Fat-Loss Engine",
    d,
    "Fat-loss conditioning • full-body work capacity • muscle retention",
    slot===1
      ? ["World's Greatest Stretch","Kettlebell Swing","Incline Dumbbell Press","Single-Arm Cable Row","CrossFit Engine Circuit","Pallof Press","Figure-4 Glute Stretch"]
      : ["Hip 90/90 Flow","Bulgarian Split Squat","Dumbbell Shoulder Press","Farmer Carry","StairMaster Intervals","Couch Stretch"]
  );
}

function buildTwoDayV25(){
  const cond=conditioningForGoalV25(profileV25.primary);
  return [
    buildSessionV25("A — Full Body Strength + Engine",profileV25.duration,
      "Full-body strength • muscle retention/building • conditioning",
      ["Hip 90/90 Flow","Deadlift","Bench Press","Bulgarian Split Squat","Chest-Supported Row","Farmer Carry",cond,"Couch Stretch"]),
    buildSessionV25("B — Full Body Athletic + Engine",profileV25.duration,
      "Squat strength • upper/lower muscle • trunk durability • conditioning",
      ["Deep Squat Pry","Front Squat","Incline Dumbbell Press","Single-Arm Cable Row","Hip Thrust","Pallof Press",cond,"Figure-4 Glute Stretch"])
  ];
}

function buildThreeDayV25(){
  return [
    clone(PROGRAM[0]),
    clone(PROGRAM[1]),
    clone(PROGRAM[2])
  ].map((w,i)=>({...w,name:["A — Posterior Strength + Engine","B — Upper Strength + Engine","C — Full-Body Athletic"][i],duration:profileV25.duration}));
}

function buildWeeklyPlanV25(){
  if(profileV25.days===2) return buildTwoDayV25();
  if(profileV25.days===3) return buildThreeDayV25();
  const base=PROGRAM.map(x=>({...clone(x),duration:profileV25.duration}));
  if(profileV25.days===4) return base;
  if(profileV25.days===5) return [...base,buildGoalBoosterV25(1)];
  return [...base,buildGoalBoosterV25(1),buildGoalBoosterV25(2)];
}

function applyPlanV25(){
  workouts=buildWeeklyPlanV25();
  activeIndex=Number(localStorage.getItem("nextWorkout")||0)%workouts.length;
}

function weeklyCountV25(){
  const h=getHistory();
  const weekAgo=new Date(Date.now()-7*86400000);
  return h.filter(x=>new Date(x.date)>=weekAgo).length;
}

const renderHomeBaseV25=renderHome;
renderHome=function(){
  renderHomeBaseV25();

  const title=document.querySelector("#home .card:last-child .section-title");
  if(title) title.textContent=`${profileV25.days}-day medium–advanced program`;

  const notice=document.querySelector("#home .card:last-child .notice");
  if(notice){
    const goals=[profileV25.primary,...profileV25.secondary].map(x=>GOALS[x].label).join(" + ");
    notice.textContent=`Weekly target: ${profileV25.days} sessions • ${profileV25.duration} min preference • Focus: ${goals}`;
  }

  const sessions=$("statSessions");
  if(sessions){
    const count=weeklyCountV25();
    sessions.textContent=`${count}/${profileV25.days}`;
    const lab=sessions.nextElementSibling;
    if(lab) lab.textContent="weekly target";
  }
};

function buildPlannerCardV25(){
  if($("plannerV25")) return;

  const guide=$("guide");
  const card=node("div","card");
  card.id="plannerV25";
  card.innerHTML=`
    <div class="section-title">Weekly training planner</div>
    <div class="notice">Choose how often you want to train and what you want the program to emphasize. You can change this whenever your week changes.</div>

    <div class="field-block">
      <label>Training days per week</label>
      <div class="choice-row v25-days" id="daysV25"></div>
    </div>

    <div class="field-block">
      <label>Primary goal</label>
      <div class="choice-row v25-goals" id="primaryV25"></div>
    </div>

    <div class="field-block">
      <label>Secondary goals — optional</label>
      <div class="choice-row v25-goals" id="secondaryV25"></div>
    </div>

    <div class="field-block">
      <label>Preferred session duration</label>
      <div class="choice-row" id="durationV25"></div>
    </div>

    <div class="advice-box" id="planSummaryV25"></div>
    <button class="btn top-gap" id="savePlannerV25">Generate my program</button>
  `;
  guide.insertBefore(card,guide.firstChild);

  [2,3,4,5,6].forEach(d=>{
    const b=node("button","",String(d));
    b.dataset.value=d;
    b.onclick=()=>{profileV25.days=d;paintPlannerV25()};
    $("daysV25").append(b);
  });

  Object.entries(GOALS).forEach(([key,g])=>{
    const b=node("button","",g.label);
    b.dataset.value=key;
    b.onclick=()=>{profileV25.primary=key;profileV25.secondary=profileV25.secondary.filter(x=>x!==key);paintPlannerV25()};
    $("primaryV25").append(b);

    const s=node("button","",g.label);
    s.dataset.value=key;
    s.onclick=()=>{
      if(key===profileV25.primary)return;
      if(profileV25.secondary.includes(key)) profileV25.secondary=profileV25.secondary.filter(x=>x!==key);
      else if(profileV25.secondary.length<3) profileV25.secondary.push(key);
      paintPlannerV25();
    };
    $("secondaryV25").append(s);
  });

  [60,75,90].forEach(d=>{
    const b=node("button","",`${d} min`);
    b.dataset.value=d;
    b.onclick=()=>{profileV25.duration=d;paintPlannerV25()};
    $("durationV25").append(b);
  });

  $("savePlannerV25").onclick=()=>{
    saveProfileV25();
    applyPlanV25();
    localStorage.setItem("nextWorkout","0");
    activeIndex=0;
    renderHome();
    paintPlannerV25();
    alert("Your weekly program has been updated.");
  };

  paintPlannerV25();
}

function paintPlannerV25(){
  if(!$("plannerV25"))return;
  document.querySelectorAll("#daysV25 button").forEach(b=>b.classList.toggle("active",Number(b.dataset.value)===profileV25.days));
  document.querySelectorAll("#primaryV25 button").forEach(b=>b.classList.toggle("active",b.dataset.value===profileV25.primary));
  document.querySelectorAll("#secondaryV25 button").forEach(b=>{
    b.disabled=b.dataset.value===profileV25.primary;
    b.classList.toggle("active",profileV25.secondary.includes(b.dataset.value));
  });
  document.querySelectorAll("#durationV25 button").forEach(b=>b.classList.toggle("active",Number(b.dataset.value)===profileV25.duration));

  const focus=[GOALS[profileV25.primary].label,...profileV25.secondary.map(x=>GOALS[x].label)].join(" + ");
  $("planSummaryV25").textContent=`${profileV25.days} training days • ${profileV25.duration}-minute preference • Primary: ${GOALS[profileV25.primary].label}${profileV25.secondary.length?` • Secondary: ${profileV25.secondary.map(x=>GOALS[x].label).join(", ")}`:""}`;
}

function builtInAlternativesV25(ex){
  const pool=allExercisesV25().filter(x=>x.n!==ex.n);
  let same=pool.filter(x=>x.block===ex.block);
  if(ex.block==="Strength") same=pool.filter(x=>["Strength","Hypertrophy"].includes(x.block));
  if(ex.block==="Hypertrophy") same=pool.filter(x=>["Hypertrophy","Strength"].includes(x.block));
  const preferred=(ex.subs||[]).map(n=>findExerciseV25(n)).filter(Boolean);
  const merged=[...preferred,...same];
  const seen=new Set();
  return merged.filter(x=>!seen.has(x.n)&&seen.add(x.n)).slice(0,6);
}

let substitutionReasonV25="Prefer another movement";

function injectSubstitutionSheetsV25(){
  if($("reasonSheetV25"))return;
  document.body.insertAdjacentHTML("beforeend",`
    <div id="reasonSheetV25" class="sheet hidden">
      <div class="sheet-card">
        <div class="sheet-handle"></div>
        <h3>Why do you want to substitute?</h3>
        <button class="sheet-btn sub-reason-v25">Equipment unavailable</button>
        <button class="sheet-btn sub-reason-v25">Pain / discomfort</button>
        <button class="sheet-btn sub-reason-v25">Too difficult today</button>
        <button class="sheet-btn sub-reason-v25">Too easy</button>
        <button class="sheet-btn sub-reason-v25">Prefer another movement</button>
        <button id="askSubPtV25" class="sheet-btn pt-action-v25">Ask PT to recommend</button>
        <button id="closeReasonV25" class="sheet-btn">Cancel</button>
      </div>
    </div>
  `);

  document.querySelectorAll(".sub-reason-v25").forEach(b=>{
    b.onclick=()=>{
      substitutionReasonV25=b.textContent;
      closeSheet("reasonSheetV25");
      showAlternativesV25();
    };
  });
  $("askSubPtV25").onclick=()=>{
    closeSheet("reasonSheetV25");
    launchPTV25("Recommend a substitute for my current exercise. Preserve the same training purpose. Reason: "+substitutionReasonV25);
  };
  $("closeReasonV25").onclick=()=>closeSheet("reasonSheetV25");
}

function showAlternativesV25(){
  const ex=state.exercises[state.exerciseIndex],box=$("replacementList");
  box.replaceChildren();

  const info=node("div","notice",`Reason: ${substitutionReasonV25}. Alternatives preserve the current exercise's training purpose.`);
  box.append(info);

  builtInAlternativesV25(ex).forEach(src=>{
    const b=node("button","sheet-btn",`${src.n} • ${src.block}`);
    b.onclick=()=>{
      const oldSets=ex.sets;
      const setCount=Math.max(1,Math.min(src.sets,oldSets.length||src.sets));
      state.exercises[state.exerciseIndex]={
        ...clone(src),
        substitutedFor:ex.n,
        substitutionReason:substitutionReasonV25,
        skipped:false,
        rpe:null,
        sets:Array.from({length:setCount},(_,i)=>oldSets[i]||{w:"",r:"",done:false})
      };
      persist();
      closeSheet("replaceSheet");
      renderExercise();
    };
    box.append(b);
  });

  const ask=node("button","sheet-btn pt-action-v25","Ask PT for another option");
  ask.onclick=()=>{closeSheet("replaceSheet");launchPTV25(`Recommend another substitute for ${ex.n}. Reason: ${substitutionReasonV25}.`)};
  box.append(ask);
  openSheet("replaceSheet");
}

replacements=function(){
  if(!state)return;
  substitutionReasonV25="Prefer another movement";
  openSheet("reasonSheetV25");
};

function currentPTContextV25(){
  const ex=state?state.exercises[state.exerciseIndex]:null;
  return {
    app:"Zahi Fit v2.5.0",
    profile:{
      trainingDays:profileV25.days,
      primaryGoal:GOALS[profileV25.primary].label,
      secondaryGoals:profileV25.secondary.map(x=>GOALS[x].label),
      preferredDuration:profileV25.duration
    },
    readiness:state?state.readiness:null,
    adaptation:state?state.adaptation:null,
    workout:state?state.workoutName:(workouts[activeIndex]||{}).name,
    progressPercent:state?completion():0,
    currentExercise:ex?{
      name:ex.n,block:ex.block,target:ex.reps,
      restSeconds:ex.rest,rpe:ex.rpe,
      sets:ex.sets
    }:null,
    recentHistory:getHistory().slice(0,5)
  };
}

async function launchPTV25(question){
  const prompt=`Act as my Zahi Fit personal trainer. Use the structured context below and answer my immediate question. Keep the recommendation practical for the current workout. If I mention sharp pain, chest pain, fainting, or unusual shortness of breath, tell me to stop the exercise and seek appropriate medical assessment rather than pushing through.

QUESTION:
${question}

ZAHI FIT CONTEXT:
${JSON.stringify(currentPTContextV25(),null,2)}`;

  try{await navigator.clipboard.writeText(prompt)}catch{}
  window.location.href="intent://chatgpt.com/#Intent;scheme=https;package=com.openai.chatgpt;S.browser_fallback_url=https%3A%2F%2Fchatgpt.com%2F;end";
}

function injectPTSheetV25(){
  if($("ptSheetV25"))return;
  document.body.insertAdjacentHTML("beforeend",`
    <div id="ptSheetV25" class="sheet hidden">
      <div class="sheet-card">
        <div class="sheet-handle"></div>
        <h3>Ask your PT</h3>
        <div class="notice" id="ptNowV25">Your workout context will be included automatically.</div>
        <button class="sheet-btn pt-quick-v25">Should I increase or reduce the load?</button>
        <button class="sheet-btn pt-quick-v25">Check my technique cues for this exercise</button>
        <button class="sheet-btn pt-quick-v25">I have less time — adjust the rest of my workout</button>
        <button class="sheet-btn pt-quick-v25">Recommend a substitute exercise</button>
        <button class="sheet-btn pt-quick-v25">This feels too hard today — what should I change?</button>
        <div class="pt-custom-v25">
          <input id="ptQuestionV25" maxlength="240" placeholder="Ask anything about this workout…">
          <button id="sendPtV25" class="btn blue">Ask PT</button>
        </div>
        <button id="closePtV25" class="sheet-btn">Cancel</button>
      </div>
    </div>
  `);

  document.querySelectorAll(".pt-quick-v25").forEach(b=>b.onclick=()=>{closeSheet("ptSheetV25");launchPTV25(b.textContent)});
  $("sendPtV25").onclick=()=>{
    const q=$("ptQuestionV25").value.trim();
    if(!q)return;
    closeSheet("ptSheetV25");launchPTV25(q);
  };
  $("closePtV25").onclick=()=>closeSheet("ptSheetV25");
}

function openPTV25(){
  if(state){
    const ex=state.exercises[state.exerciseIndex];
    $("ptNowV25").textContent=`Current: ${ex.n} • ${state.workoutName}. Your readiness, goals, completed work and recent history will be included automatically.`;
  }else{
    $("ptNowV25").textContent=`Current plan: ${profileV25.days} days/week • ${GOALS[profileV25.primary].label}. Your plan and recent history will be included automatically.`;
  }
  $("ptQuestionV25").value="";
  openSheet("ptSheetV25");
}

function wireV25(){
  applyPlanV25();
  buildPlannerCardV25();
  injectSubstitutionSheetsV25();
  injectPTSheetV25();

  const replaceBtn=$("replaceExerciseBtn");
  if(replaceBtn) replaceBtn.textContent="Substitute current exercise";

  ["askPtHomeBtn","askPtSessionBtn","askPtSettingsBtn"].forEach(id=>{
    const b=$(id);
    if(b) b.onclick=openPTV25;
  });

  renderHome();
  $("versionBadge").textContent="v2.5.0";
}

wireV25();
