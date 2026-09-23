
"use strict";

const APP_VERSION = "2.1.0";
const MAX_IMPORT_BYTES = 200_000;
const MAX_TEXT = 160;
const MAX_CUE = 300;
const MAX_WORKOUTS = 12;
const MAX_EXERCISES = 30;
const MAX_SETS = 12;

const DEFAULT_WORKOUTS = [
  {name:"A — Deadlift + StairMaster",duration:60,exercises:[
    {n:"Deadlift",sets:4,reps:"5",cue:"Brace hard, keep the bar close, push the floor away. Stop before form breaks.",video:"https://www.youtube.com/results?search_query=deadlift+proper+form"},
    {n:"Goblet Squat",sets:3,reps:"10",cue:"Hold the dumbbell close to your chest. Sit between the hips and keep knees tracking over toes.",video:"https://www.youtube.com/results?search_query=goblet+squat+proper+form"},
    {n:"Dumbbell Romanian Deadlift",sets:3,reps:"10",cue:"Soft knees, hinge hips back, keep spine neutral and feel the hamstrings load.",video:"https://www.youtube.com/results?search_query=dumbbell+romanian+deadlift+form"},
    {n:"Walking Lunges",sets:3,reps:"10/leg",cue:"Keep the front heel planted and lower under control.",video:"https://www.youtube.com/results?search_query=walking+lunge+proper+form"},
    {n:"10-min AMRAP",sets:1,reps:"8 swings / 8 push-ups / 10 step-ups / 8 DB thrusters",cue:"Move steadily. Do not race technique.",video:"https://www.youtube.com/results?search_query=crossfit+amrap+beginner"},
    {n:"StairMaster",sets:1,reps:"15 min",cue:"3 min easy, 10 min moderate-hard, 2 min easy.",video:"https://www.youtube.com/results?search_query=stairmaster+technique"}
  ]},
  {name:"B — Upper Body + Bike",duration:60,exercises:[
    {n:"Bench Press",sets:4,reps:"6–8",cue:"Feet planted, shoulder blades set, controlled touch to chest.",video:"https://www.youtube.com/results?search_query=bench+press+proper+form"},
    {n:"Lat Pulldown",sets:4,reps:"8–10",cue:"Pull elbows toward ribs; avoid swinging.",video:"https://www.youtube.com/results?search_query=lat+pulldown+proper+form"},
    {n:"Dumbbell Shoulder Press",sets:3,reps:"8–10",cue:"Brace trunk and press without leaning excessively.",video:"https://www.youtube.com/results?search_query=dumbbell+shoulder+press+form"},
    {n:"Seated Cable Row",sets:3,reps:"10",cue:"Lead with elbows and avoid rounding forward.",video:"https://www.youtube.com/results?search_query=seated+cable+row+form"},
    {n:"Face Pull",sets:3,reps:"12–15",cue:"Pull toward upper face with elbows high.",video:"https://www.youtube.com/results?search_query=face+pull+proper+form"},
    {n:"Plank",sets:3,reps:"45 sec",cue:"Ribs down, glutes tight, straight line head to heel.",video:"https://www.youtube.com/results?search_query=plank+proper+form"},
    {n:"Bike Intervals",sets:1,reps:"20 min",cue:"1 min hard + 2 min easy × 6, then cooldown.",video:"https://www.youtube.com/results?search_query=stationary+bike+interval+training"}
  ]},
  {name:"C — Full Body CrossFit",duration:55,exercises:[
    {n:"Front or Goblet Squat",sets:4,reps:"6–8",cue:"Keep chest tall and control depth.",video:"https://www.youtube.com/results?search_query=front+squat+proper+form"},
    {n:"Romanian Deadlift",sets:3,reps:"8",cue:"Hinge at hips and keep the bar close.",video:"https://www.youtube.com/results?search_query=romanian+deadlift+proper+form"},
    {n:"Incline Dumbbell Press",sets:3,reps:"10",cue:"Control descent and keep shoulders stable.",video:"https://www.youtube.com/results?search_query=incline+dumbbell+press+form"},
    {n:"5-round Metcon",sets:5,reps:"10 KB swings / 8 push press / 10 cal bike / 10 step-ups / 8 rows",cue:"Rest 60–90 sec between rounds. Maintain repeatable pacing.",video:"https://www.youtube.com/results?search_query=crossfit+metcon+beginner"}
  ]},
  {name:"D — Legs + StairMaster",duration:65,exercises:[
    {n:"Squat or Leg Press",sets:4,reps:"8",cue:"Use controlled depth and keep knees tracking with toes.",video:"https://www.youtube.com/results?search_query=leg+press+proper+form"},
    {n:"Bulgarian Split Squat",sets:3,reps:"8/leg",cue:"Keep front foot stable and lower vertically.",video:"https://www.youtube.com/results?search_query=bulgarian+split+squat+form"},
    {n:"Hip Thrust",sets:3,reps:"10",cue:"Finish by squeezing glutes, not arching lower back.",video:"https://www.youtube.com/results?search_query=hip+thrust+proper+form"},
    {n:"Hamstring Curl",sets:3,reps:"10–12",cue:"Control both directions.",video:"https://www.youtube.com/results?search_query=hamstring+curl+proper+form"},
    {n:"Calf Raise",sets:3,reps:"15",cue:"Full stretch and contraction; avoid bouncing.",video:"https://www.youtube.com/results?search_query=calf+raise+proper+form"},
    {n:"StairMaster",sets:1,reps:"25–30 min",cue:"Sustainable steady pace. Hard breathing, but no repeated stopping.",video:"https://www.youtube.com/results?search_query=stairmaster+workout+fat+loss"}
  ]}
];

const $ = id => document.getElementById(id);
let workouts = loadWorkouts();
let activeIndex = Number(localStorage.getItem("nextWorkout") || 0) % workouts.length;
let sessionStart = null;
let timerInterval = null;
let deferredPrompt = null;
let pendingWorker = null;

function loadWorkouts(){
  try{
    const raw = localStorage.getItem("workouts");
    if(!raw) return structuredClone(DEFAULT_WORKOUTS);
    const parsed = JSON.parse(raw);
    return validatePlan(parsed);
  }catch{
    localStorage.removeItem("workouts");
    return structuredClone(DEFAULT_WORKOUTS);
  }
}

function safeText(value, max=MAX_TEXT){
  if(typeof value !== "string") throw new Error("Invalid text field");
  const v = value.trim();
  if(!v || v.length > max) throw new Error("Text field out of range");
  return v;
}

function safeVideoUrl(value){
  if(typeof value !== "string") throw new Error("Invalid video URL");
  let u;
  try{ u = new URL(value); } catch { throw new Error("Invalid video URL"); }
  if(u.protocol !== "https:") throw new Error("Only HTTPS demo URLs are allowed");
  const allowed = ["www.youtube.com","youtube.com","youtu.be"];
  if(!allowed.includes(u.hostname)) throw new Error("Demo URL must be YouTube");
  return u.toString();
}

function validatePlan(input){
  const arr = Array.isArray(input) ? input : input && Array.isArray(input.workouts) ? input.workouts : null;
  if(!arr || arr.length < 1 || arr.length > MAX_WORKOUTS) throw new Error("Invalid number of workouts");
  return arr.map(w=>{
    if(!w || typeof w !== "object") throw new Error("Invalid workout");
    const name = safeText(w.name);
    const duration = Number(w.duration);
    if(!Number.isFinite(duration) || duration < 5 || duration > 240) throw new Error("Invalid workout duration");
    if(!Array.isArray(w.exercises) || w.exercises.length < 1 || w.exercises.length > MAX_EXERCISES) throw new Error("Invalid exercise list");
    const exercises = w.exercises.map(ex=>{
      if(!ex || typeof ex !== "object") throw new Error("Invalid exercise");
      const n = safeText(ex.n);
      const sets = Number(ex.sets);
      if(!Number.isInteger(sets) || sets < 1 || sets > MAX_SETS) throw new Error("Invalid set count");
      return {
        n,
        sets,
        reps: safeText(ex.reps, 120),
        cue: safeText(ex.cue, MAX_CUE),
        video: safeVideoUrl(ex.video)
      };
    });
    return {name,duration,exercises};
  });
}

function node(tag, cls, text){
  const e = document.createElement(tag);
  if(cls) e.className = cls;
  if(text !== undefined) e.textContent = text;
  return e;
}

function showTab(id, btn){
  ["home","session","history","guide"].forEach(x => $(x).classList.add("hidden"));
  $(id).classList.remove("hidden");
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  if(btn) btn.classList.add("active");
  if(id === "history") renderHistory();
}

function renderHome(){
  const w = workouts[activeIndex];
  $("todayTitle").textContent = w.name;
  $("todayMeta").textContent = `Approx. ${w.duration} min`;

  const rotation = $("rotation");
  rotation.replaceChildren();
  workouts.forEach((x,i)=>{
    const wrap = node("div","workout");
    wrap.append(node("h3","",x.name));
    wrap.append(node("div","meta",`${x.duration} min • ${x.exercises.length} blocks`));
    const b = node("button","btn small secondary","Start this");
    b.type = "button";
    b.addEventListener("click",()=>startWorkout(i));
    wrap.append(b);
    rotation.append(wrap);
  });

  const h = getHistory();
  const weekAgo = new Date(Date.now()-7*86400000);
  const wh = h.filter(x => new Date(x.date) >= weekAgo);
  $("statSessions").textContent = wh.length;
  $("statMinutes").textContent = wh.reduce((a,b)=>a+(Number(b.minutes)||0),0);
  $("statStreak").textContent = calcStreak(h);
}

function calcStreak(h){
  const days = [...new Set(h.map(x=>new Date(x.date).toDateString()))];
  if(!days.length) return 0;
  let streak=0,d=new Date();
  for(let i=0;i<365;i++){
    if(days.includes(d.toDateString())) streak++;
    else if(i>0) break;
    d.setDate(d.getDate()-1);
  }
  return streak;
}

function createExerciseCard(ex, ei){
  const card = node("div","card exercise");
  card.dataset.ex = String(ei);
  card.append(node("div","exercise-title",ex.n));
  card.append(node("div","cue",ex.cue));

  const link = node("a","btn small blue demo-link","▶ Demo video");
  link.href = ex.video;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  card.append(link);

  const sets = node("div","sets");
  sets.append(node("div","setnum","Set"), node("div","meta","Weight / level"), node("div","meta","Reps / time"), node("div",""));
  for(let si=0; si<ex.sets; si++){
    sets.append(node("div","setnum",String(si+1)));
    const w = document.createElement("input");
    w.inputMode = "decimal";
    w.maxLength = 12;
    w.placeholder = (ex.n.includes("Stair")||ex.n.includes("Bike")) ? "Level" : "kg";
    w.dataset.key = `${ei}-${si}-w`;

    const r = document.createElement("input");
    r.maxLength = 40;
    r.placeholder = ex.reps;
    r.dataset.key = `${ei}-${si}-r`;

    const c = node("button","check","✓");
    c.type = "button";
    c.addEventListener("click",()=>{ c.classList.toggle("done"); updateProgress(); });

    sets.append(w,r,c);
  }
  card.append(sets);
  return card;
}

function startWorkout(i){
  activeIndex=i;
  sessionStart=Date.now();
  clearInterval(timerInterval);
  timerInterval=setInterval(updateTimer,1000);
  const w=workouts[i];
  $("sessionTitle").textContent=w.name;
  const list=$("exerciseList");
  list.replaceChildren();
  w.exercises.forEach((ex,ei)=>list.append(createExerciseCard(ex,ei)));
  $("sessionNotes").value="";
  updateProgress();
  showTab("session",document.querySelector('[data-tab="session"]'));
}

function updateProgress(){
  const checks=[...document.querySelectorAll(".check")];
  const done=checks.filter(x=>x.classList.contains("done")).length;
  $("bar").style.width=checks.length?`${done/checks.length*100}%`:"0%";
}

function updateTimer(){
  if(!sessionStart) return;
  const s=Math.floor((Date.now()-sessionStart)/1000),m=Math.floor(s/60),sec=s%60;
  $("timer").textContent=`${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
}

function getHistory(){
  try{
    const h=JSON.parse(localStorage.getItem("history")||"[]");
    return Array.isArray(h)?h:[];
  }catch{return [];}
}

function finishWorkout(){
  if(!sessionStart) return;
  const w=workouts[activeIndex], details=[];
  document.querySelectorAll(".exercise").forEach((card,ei)=>{
    const exInputs=[...card.querySelectorAll("input")];
    const sets=[];
    exInputs.forEach(inp=>{
      const [e,s,type]=inp.dataset.key.split("-");
      if(!sets[Number(s)]) sets[Number(s)]={};
      sets[Number(s)][type]=inp.value.slice(0,40);
    });
    const done=[...card.querySelectorAll(".check")].map(x=>x.classList.contains("done"));
    details.push({exercise:w.exercises[ei].n,sets,done});
  });

  const rec={
    date:new Date().toISOString(),
    workout:w.name,
    minutes:Math.max(1,Math.round((Date.now()-sessionStart)/60000)),
    notes:$("sessionNotes").value.slice(0,500),
    details
  };
  const h=getHistory();
  h.unshift(rec);
  localStorage.setItem("history",JSON.stringify(h.slice(0,500)));
  activeIndex=(activeIndex+1)%workouts.length;
  localStorage.setItem("nextWorkout",String(activeIndex));
  clearInterval(timerInterval);
  sessionStart=null;
  $("timer").textContent="00:00";
  renderHome();
  renderHistory();
  showTab("home",document.querySelector('[data-tab="home"]'));
  alert("Workout saved.");
}

function renderHistory(){
  const box=$("historyList");
  box.replaceChildren();
  const h=getHistory();
  if(!h.length){box.append(node("div","meta","No workouts logged yet."));return;}
  h.forEach(x=>{
    const item=node("div","workout");
    item.append(node("b","",String(x.workout||"Workout")));
    item.append(node("div","meta",`${new Date(x.date).toLocaleString()} • ${Number(x.minutes)||0} min`));
    if(x.notes) item.append(node("div","cue",String(x.notes)));
    box.append(item);
  });
}

function ptContext(){
  const h=getHistory().slice(0,5),w=workouts[activeIndex];
  return `I am using my Zahi Fit gym app. Act as my PT for this plan.
NEXT/CURRENT WORKOUT:
${JSON.stringify(w,null,2)}

RECENT HISTORY:
${JSON.stringify(h,null,2)}

Help me with progression, substitutions, technique, or today's session. Do not change the whole program unless I ask.`;
}

async function copyText(t){
  try{ await navigator.clipboard.writeText(t); return true; }catch{return false;}
}

async function askChatGPT(){
  await copyText(ptContext());
  const intent="intent://chatgpt.com/#Intent;scheme=https;package=com.openai.chatgpt;S.browser_fallback_url=https%3A%2F%2Fchatgpt.com%2F;end";
  window.location.href=intent;
}

function download(name,data,type="application/json"){
  const blob=new Blob([data],{type});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=name;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),500);
}

async function importPlan(ev){
  const f=ev.target.files && ev.target.files[0];
  ev.target.value="";
  if(!f) return;
  if(f.size > MAX_IMPORT_BYTES){ alert("Plan file is too large."); return; }
  try{
    const text=await f.text();
    const parsed=JSON.parse(text);
    const plan=validatePlan(parsed);
    workouts=plan;
    localStorage.setItem("workouts",JSON.stringify(plan));
    activeIndex=0;
    localStorage.setItem("nextWorkout","0");
    renderHome();
    alert("Secure plan import completed. Workout history was kept.");
  }catch(err){
    alert(`Plan rejected: ${err.message || "invalid file"}`);
  }
}

function resetData(){
  if(!confirm("Delete workout history and reset the custom plan? This cannot be undone unless you exported a backup.")) return;
  ["history","nextWorkout","workouts"].forEach(k=>localStorage.removeItem(k));
  workouts=structuredClone(DEFAULT_WORKOUTS);
  activeIndex=0;
  renderHome();
  renderHistory();
}

function setupInstall(){
  window.addEventListener("beforeinstallprompt",e=>{
    e.preventDefault();deferredPrompt=e;$("installCard").style.display="block";
  });
  $("installBtn").addEventListener("click",async()=>{
    if(!deferredPrompt){ alert("Use Chrome menu > Add to Home screen / Install app."); return; }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt=null;
  });
}

function setupServiceWorker(){
  if(!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("sw.js").then(reg=>{
    reg.update().catch(()=>{});
    reg.addEventListener("updatefound",()=>{
      const nw=reg.installing;
      if(!nw) return;
      nw.addEventListener("statechange",()=>{
        if(nw.state==="installed" && navigator.serviceWorker.controller){
          pendingWorker=nw;
          $("updateBanner").classList.remove("hidden");
        }
      });
    });
  }).catch(()=>{});
  navigator.serviceWorker.addEventListener("controllerchange",()=>window.location.reload());
  $("updateNowBtn").addEventListener("click",()=>{
    if(pendingWorker) pendingWorker.postMessage({type:"SKIP_WAITING"});
    else window.location.reload();
  });
}

function bindEvents(){
  $("startTodayBtn").addEventListener("click",()=>startWorkout(activeIndex));
  $("askPtHomeBtn").addEventListener("click",askChatGPT);
  $("askPtSessionBtn").addEventListener("click",askChatGPT);
  $("askPtSettingsBtn").addEventListener("click",askChatGPT);
  $("copySessionBtn").addEventListener("click",async()=>alert(await copyText(ptContext())?"Session context copied.":"Could not access clipboard."));
  $("finishWorkoutBtn").addEventListener("click",finishWorkout);
  $("exportPtBtn").addEventListener("click",()=>download("zahi-fit-pt-handoff.json",JSON.stringify({version:APP_VERSION,nextWorkout:activeIndex,workouts,history:getHistory()},null,2)));
  $("exportDataBtn").addEventListener("click",()=>download("zahi-fit-history.json",JSON.stringify(getHistory(),null,2)));
  $("resetDataBtn").addEventListener("click",resetData);
  $("planImport").addEventListener("change",importPlan);
  document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>showTab(b.dataset.tab,b)));
}

$("versionBadge").textContent=`v${APP_VERSION}`;
setupInstall();
setupServiceWorker();
bindEvents();
renderHome();
renderHistory();
