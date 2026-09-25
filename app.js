"use strict";
/* Zahi Fit v4.0 — single application script.
   Replaces app.js + v24/v25/v251/v27/v271 overlays. Uses the same localStorage keys,
   so workout history, plan, profile and an in-progress workout carry over. */
(() => {
const VERSION = "5.1.0";
const PT_ENDPOINT = "https://zahi-fit-pt.chamounzahi.workers.dev";
const VOICE_ENDPOINT = "https://zahi-fit-voice.chamounzahi.workers.dev";
const K = {
  history:"history", next:"nextWorkout", active:"activeWorkoutV230",
  plan:"zahiFitProfileV25", personal:"zahiFitPersonalProfileV27",
  voiceMode:"zahiFitVoiceModeV27", audio:"zahiFitAudioEnabledV27",
  rate:"zahiFitVoiceRateV312", voiceName:"zahiFitVoiceNameV313", voiceMale:"zahiFitVoiceMaleV494", voiceFemale:"zahiFitVoiceFemaleV494",
  chat:"zahiFitPTConversationV26", onboarded:"zahiFitOnboardedV4",
  lang:"zahiFitVoiceLangV41", gender:"zahiFitVoiceGenderV41", engine:"zahiFitVoiceEngineV41",
  tested:"zahiFitVoiceTestedV43", offline:"zahiFitOfflineSavedV43", installHide:"zahiFitInstallHiddenV44", videoPick:"zahiFitVideoPickV47", food:"zahiFitFoodLogV50", foodSet:"zahiFitFoodSettingsV50", foodQuick:"zahiFitFoodQuickV50", foodSeen:"zahiFitFoodSeenV50", water:"zahiFitWaterV51", balance:"zahiFitBalanceV51"
};

/* ---------- tiny helpers ---------- */
for(const P of [Element.prototype, DocumentFragment.prototype]){
  for(const fn of ["append","replaceChildren"]){ const o = P[fn]; P[fn] = function(...a){ return o.apply(this, a.filter(x => x != null && x !== false)); }; }
}
const $ = s => document.querySelector(s);
function h(tag, props, ...kids){
  const el = document.createElement(tag);
  if(props) for(const [k,v] of Object.entries(props)){
    if(v == null || v === false) continue;
    if(k === "class") el.className = v;
    else if(k === "text") el.textContent = v;
    else if(k === "html") el.innerHTML = v;            // trusted, app-generated markup only
    else if(k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  for(const c of kids.flat(3)) if(c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(String(c)));
  return el;
}
const clone = x => JSON.parse(JSON.stringify(x));
const read = (k, fb) => { try{ const v = JSON.parse(localStorage.getItem(k)); return v ?? fb; }catch{ return fb; } };
const write = (k, v) => { try{ localStorage.setItem(k, JSON.stringify(v)); }catch{} };
const mmss = s => { s = Math.max(0, Math.round(s)); return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`; };
const num = v => { const n = parseFloat(String(v).replace(",", ".")); return Number.isFinite(n) ? n : null; };
const fmtKg = n => (Math.round(n*10)/10).toString();
function splitName(name){
  const m = String(name||"").match(/^([A-Z])\s*[—-]\s*(.+)$/);
  return m ? {letter:m[1], title:m[2]} : {letter:"•", title:String(name||"Workout")};
}
const HEIGHT = {Strength:5, Power:4, Hypertrophy:4, Conditioning:3, Durability:3, Mobility:2, Flexibility:1};

/* ---------- people on this phone ----------
   Each person has their own history, plan, profile, voice settings, coach chat and in-progress workout.
   The first person keeps the original storage keys, so existing data needs no migration. */
const USERS_KEY = "zahiFitUsersV45";
const DEVICE_KEYS = ["installHide", "videoPick"];                 // shared by everyone on this phone
const BASE_K = {...K};
const nsKey = (id, base) => id === "main" ? base : `zf.${id}.${base}`;
function loadUsers(){
  let r = read(USERS_KEY, null);
  if(!r || !Array.isArray(r.users) || !r.users.length){ r = {active:"main", users:[{id:"main", name:"Me", tone:0, created:Date.now()}]}; write(USERS_KEY, r); }
  if(!r.users.some(u => u.id === r.active)) r.active = r.users[0].id;
  return r;
}
const people = loadUsers();
/* Accounts: each person on the phone has a username + password (stored only as a salted PBKDF2 hash).
   Nothing belonging to a person is loaded until they're signed in. */
const SESSION_KEY = "zahiFitSessionV49", FAILS_KEY = "zahiFitAuthFailsV49";
function readSession(){
  for(const store of [sessionStorage, localStorage]){
    try{ const x = JSON.parse(store.getItem(SESSION_KEY)); if(x && x.id && (!x.exp || x.exp > Date.now())) return x; }catch{}
  }
  return null;
}
const session = readSession();
const sessionUser = session ? people.users.find(u => u.id === session.id && u.auth) : null;
const LOCKED = !sessionUser;
const me = LOCKED ? {id:"__locked__", name:"", tone:0} : sessionUser;
if(!LOCKED && people.active !== me.id){ people.active = me.id; write(USERS_KEY, people); }
for(const k of Object.keys(K)) if(!DEVICE_KEYS.includes(k)) K[k] = nsKey(me.id, BASE_K[k]);
const initialOf = u => (u.name || "?").trim().charAt(0).toUpperCase() || "?";
function userStats(u){
  try{
    const hs = JSON.parse(localStorage.getItem(nsKey(u.id, BASE_K.history)) || "[]");
    const last = hs[0] ? new Date(hs[0].date).toLocaleDateString(undefined, {day:"numeric", month:"short"}) : null;
    return `${hs.length} session${hs.length === 1 ? "" : "s"}${last ? ` · last ${last}` : ""}`;
  }catch{ return "0 sessions"; }
}
function signOut(){
  try{ hush(); }catch{}
  try{ sessionStorage.removeItem(SESSION_KEY); }catch{}
  try{ localStorage.removeItem(SESSION_KEY); }catch{}
  location.reload();
}

/* ---------- toast + dialog (replace alert/confirm) ---------- */
let toastTimer;
function toast(msg){
  document.querySelector(".toast")?.remove();
  const t = h("div", {class:"toast", role:"status"}, msg);
  document.body.append(t);
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.remove(), Math.max(2600, String(msg).length * 60));
}
function ask(title, body, okLabel, danger){
  return new Promise(res => {
    const close = v => { d.remove(); res(v); };
    const d = h("div", {class:"dialog", role:"dialog", "aria-modal":"true"},
      h("div", {class:"card"},
        h("h2", {text:title}), h("p", {text:body}),
        h("div", {class:"btn-row"},
          h("button", {class:"btn", onclick:() => close(false)}, "Cancel"),
          h("button", {class:"btn " + (danger ? "danger" : "primary"), onclick:() => close(true)}, okLabel))));
    d.addEventListener("click", e => { if(e.target === d) close(false); });
    document.body.append(d);
    d.querySelector(".btn.primary,.btn.danger").focus();
  });
}
function sheet(build){
  const s = h("div", {class:"sheet"});
  const close = () => s.remove();
  const card = h("div", {class:"card", role:"dialog", "aria-modal":"true"}, h("div", {class:"grip"}));
  build(card, close);
  s.append(card);
  s.addEventListener("click", e => { if(e.target === s) close(); });
  document.body.append(s);
  return close;
}

/* ---------- plan ---------- */
const GOALS = {
  fat_loss:"Fat loss", muscle:"Muscle gain", strength:"Strength",
  endurance:"Endurance", athletic:"Athletic fitness", mobility:"Mobility & flexibility"
};
const EQUIPMENT = {gym:"Gym", bodyweight:"Bodyweight"};
function loadPlan(){
  const p = read(K.plan, null);
  if(p && p.days >= 2 && p.days <= 6 && GOALS[p.primary]) return {
    days:Number(p.days), primary:p.primary,
    secondary:Array.isArray(p.secondary) ? p.secondary.filter(x => GOALS[x] && x !== p.primary).slice(0,3) : [],
    duration:[45,60,75,90].includes(Number(p.duration)) ? Number(p.duration) : 75,
    equipment:EQUIPMENT[p.equipment] ? p.equipment : "gym"
  };
  return {days:4, primary:"fat_loss", secondary:["muscle"], duration:75, equipment:"gym"};
}
let plan = loadPlan();
const library = () => [...PROGRAM.flatMap(w => w.exercises), ...EXTRA];
const findEx = n => library().find(x => x.n === n);

/* ---------- programme builder ----------
   Builds the week from: days, main goal, secondary goals, session length and equipment.
   1) the main goal picks the weekly split and each session's recipe;
   2) the main goal sets sets / reps / rest for each slot;
   3) each secondary goal adds its own emphasis;
   4) session length trims or extends;
   5) sessions of the same type rotate exercises so A and C differ. */
const SPLITS = {
  heavy:   {2:["full","full"], 3:["lower","upper","full"], 4:["lower","upper","lower","upper"], 5:["lower","upper","full","lower","upper"], 6:["lower","upper","full","lower","upper","engine"]},
  engine:  {2:["full","full"], 3:["full","engine","full"], 4:["lower","upper","engine","full"], 5:["lower","upper","engine","full","engine"], 6:["lower","upper","engine","lower","upper","engine"]},
  mobility:{2:["full","mobility"], 3:["full","mobility","full"], 4:["full","mobility","full","mobility"], 5:["full","mobility","lower","mobility","upper"], 6:["lower","mobility","upper","mobility","full","mobility"]}
};
const RECIPES = {
  lower:   [["mobLower","mob"],["mobLower","mob"],["squat","main"],["hinge","main2"],["lunge","acc"],["glute","acc"],["durability","core"],["interval","cond"],["flexLower","flex"]],
  upper:   [["mobUpper","mob"],["mobUpper","mob"],["pushH","main"],["pullH","main2"],["pushV","acc"],["pullV","acc"],["core","core"],["interval","cond"],["flexUpper","flex"]],
  full:    [["mobLower","mob"],["mobUpper","mob"],["squat|hinge","main"],["pushH","main2"],["pullH","acc"],["lunge","acc"],["core","core"],["interval","cond"],["flexLower","flex"]],
  engine:  [["mobLower","mob"],["power","power"],["circuit","circuit"],["pullH","acc"],["core","core"],["steady","cond"],["flexLower","flex"]],
  mobility:[["mobLower","mob"],["mobUpper","mob"],["mobLower","mob"],["durability","core"],["core","core"],["steady","easy"],["flexLower","flex"],["flexUpper","flex"]]
};
/* [sets, reps, rest] per goal and slot; reps null = keep the exercise's own (time-based) target */
const RX = {
  strength: {main:[5,"5",150], main2:[4,"6",120], acc:[3,"8",90],  core:[3,null,60], power:[4,"5",90],  cond:[4,null,0], circuit:[3,null,90]},
  muscle:   {main:[4,"8",120], main2:[4,"10",90], acc:[3,"12",75], core:[3,null,45], power:[3,"8",75],  cond:[4,null,0], circuit:[3,null,75]},
  fat_loss: {main:[3,"10",75], main2:[3,"12",60], acc:[3,"15",45], core:[3,null,30], power:[4,"12",45], cond:[8,null,0], circuit:[5,null,60]},
  endurance:{main:[3,"12",60], main2:[3,"12",60], acc:[2,"15",45], core:[3,null,30], power:[3,"12",45], cond:[6,null,0], circuit:[5,null,60]},
  athletic: {main:[4,"5",120], main2:[3,"8",90],  acc:[3,"10",60], core:[3,null,45], power:[5,"6",75],  cond:[6,null,0], circuit:[5,null,60]},
  mobility: {main:[3,"8",90],  main2:[3,"10",75], acc:[2,"12",60], core:[3,null,45], power:[3,"8",60],  cond:[4,null,0], circuit:[3,null,60]}
};
/* Bodyweight can't go heavy, so reps rise and the lowering slows instead. */
const RX_BW = {
  strength:{main:"6–10 (3 s down)", main2:"8–12 (3 s down)", acc:"10–12"}, muscle:{main:"10–15", main2:"12–15", acc:"15–20"},
  fat_loss:{main:"12–15", main2:"15", acc:"15–20"}, endurance:{main:"15–20", main2:"20", acc:"20"},
  athletic:{main:"8–10", main2:"10", acc:"12"}, mobility:{main:"8–10", main2:"10", acc:"12"}
};
const STEADY_MIN = {endurance:"30–40 min", fat_loss:"25–30 min", mobility:"15–20 min easy"};
const TITLES = {
  lower:   {strength:"Lower Strength", muscle:"Lower Muscle", fat_loss:"Lower-Body Burn", endurance:"Lower Endurance", athletic:"Lower Power", mobility:"Lower Strength & Mobility"},
  upper:   {strength:"Upper Strength", muscle:"Upper Muscle", fat_loss:"Upper-Body Burn", endurance:"Upper Endurance", athletic:"Upper Power", mobility:"Upper Strength & Posture"},
  full:    {strength:"Full-Body Strength", muscle:"Full-Body Muscle", fat_loss:"Full-Body Fat Burn", endurance:"Full-Body Endurance", athletic:"Full-Body Athletic", mobility:"Full-Body Movement"},
  engine:  {strength:"Conditioning", muscle:"Conditioning", fat_loss:"Metabolic Engine", endurance:"Engine Builder", athletic:"Power & Engine", mobility:"Easy Engine"},
  mobility:{strength:"Mobility & Recovery", muscle:"Mobility & Recovery", fat_loss:"Mobility & Recovery", endurance:"Mobility & Recovery", athletic:"Mobility & Recovery", mobility:"Mobility Flow"}
};
const FOCUS_TEXT = {lower:"Squat, hinge and single-leg work", upper:"Push and pull strength", full:"Total-body strength",
  engine:"Power, circuit and conditioning", mobility:"Mobility, core control and easy cardio"};
const SECONDARY_SLOT = {                       // what each secondary goal adds to a session
  muscle:   f => ({lower:["ham","acc"], upper:["pushH","acc"], full:["glute","acc"], engine:["pushH","acc"]})[f],
  strength: () => "mainSet",
  fat_loss: f => f === "mobility" ? null : ["interval","finisher"],
  endurance:() => "condLonger",
  athletic: f => f === "mobility" ? null : ["power","power"],
  mobility: f => f === "lower" || f === "full" ? ["flexLower","flex"] : ["mobUpper","mob"]
};

function buildWeek(p = plan, person = personal){
  const goal = p.primary, eq = POOLS[p.equipment] ? p.equipment : "gym", pools = POOLS[eq];
  const age = person ? person.ageBracket : null, exp = person ? person.experience : "some", focus = focusOf(person);
  const older = age === "50-59" || age === "60+";
  // Names this person should not get (sore areas), and name swaps for age / experience.
  const avoid = new Set((person ? person.areas : []).flatMap(a => AVOID_BY_AREA[a] || []));
  const swaps = {...(EXPERIENCE_SWAPS[exp] || {}), ...(AGE_SWAPS[age] || {})};
  const allowed = new Set([...Object.values(pools).flat(), ...MOB_LOWER, ...FLEX_LOWER, ...FLEX_UPPER, "Thoracic Rotation", "Child's Pose Lat Stretch"]);
  const splitKey = ["strength","muscle"].includes(goal) ? "heavy" : goal === "mobility" ? "mobility" : "engine";
  const split = SPLITS[splitKey][p.days];
  const seen = {};
  return split.map((sfocus, idx) => {
    const rot = seen[sfocus] = (seen[sfocus] ?? -1) + 1;   // 0 for the first "lower", 1 for the second…
    let recipe = RECIPES[sfocus].map(r => r.slice());
    // secondary goals
    let extraMainSet = 0, condLonger = false;
    p.secondary.forEach(g => {
      const add = SECONDARY_SLOT[g] && SECONDARY_SLOT[g](sfocus);
      if(add === "mainSet") extraMainSet = 1;
      else if(add === "condLonger") condLonger = true;
      else if(Array.isArray(add)){
        const at = add[1] === "power" ? 2 : add[1] === "flex" ? recipe.length : add[1] === "mob" ? 1 : add[1] === "finisher" ? recipe.length - 1 : recipe.findIndex(r => r[1] === "core");
        recipe.splice(Math.max(0, at), 0, add);
      }
    });
    if(goal === "mobility" && sfocus !== "mobility") recipe.splice(1, 0, ["mobLower","mob"], ["flexUpper","flex"]);
    if(goal === "athletic" && !recipe.some(r => r[1] === "power")) recipe.splice(2, 0, ["power","power"]);
    // focus emphasis (auto = by sex); short sessions keep only the first extra slot
    const extras = ((FOCUS_SLOTS[focus] || {})[sfocus] || []).slice(0, p.duration <= 60 ? 1 : 2);
    extras.forEach(add => { const at = add[1] === "mob" ? 1 : recipe.findIndex(r => r[1] === "core"); recipe.splice(Math.max(0, at), 0, add); });
    // age: longer warm-up from 50, balance/bone-loading work from 60
    if(older && p.duration >= 60 && sfocus !== "mobility") recipe.splice(1, 0, [sfocus === "upper" ? "mobUpper" : "mobLower", "mob"]);
    if(age === "60+" && ["lower","full"].includes(sfocus) && eq) recipe.splice(Math.max(0, recipe.findIndex(r => r[1] === "cond")), 0, ["durability","balance"]);
    // session length
    const drop = (role) => { const i = recipe.map(r => r[1]).lastIndexOf(role); if(i >= 0) recipe.splice(i, 1); };
    if(p.duration === 45){
      // express: one mobility, main lift(s), one accessory, core, short conditioning, one stretch
      const keepOne = role => { while(recipe.filter(r => r[1] === role).length > 1) drop(role); };
      ["mob","acc","flex","core","balance"].forEach(keepOne); drop("finisher");
      if(goal !== "athletic") drop("power");
      if(!["strength","muscle"].includes(goal)) drop("main2");
    }else if(p.duration === 60){
      drop("mob"); drop("acc"); if(recipe.filter(r => r[1] === "flex").length > 1) drop("flex");
    }else if(p.duration === 90){
      const extra = {lower:["ham","acc"], upper:["pullV","acc"], full:["glute","acc"], engine:["lunge","acc"], mobility:["mobUpper","mob"]}[sfocus];
      recipe.splice(Math.max(0, recipe.findIndex(r => r[1] === "core")), 0, extra);
      recipe.push([sfocus === "upper" ? "flexUpper" : "flexLower", "flex"]);
    }
    // keep sessions realistic for the time: trim the lowest-priority extras first
    const CAP = {45:6, 60:8, 75:10, 90:12}[p.duration] || 10;
    const trimOrder = ["finisher","acc","mob","flex","balance","core","power"];
    for(const role of trimOrder){
      const min = role === "acc" ? 1 : role === "power" && goal === "athletic" ? 1 : ["mob","flex","core"].includes(role) ? 1 : 0;
      while(recipe.length > CAP && recipe.filter(r => r[1] === role).length > min) drop(role);
    }
    // pick exercises: rotate within each pool, never repeat within a session
    const used = new Set(), exercises = [];
    const ok = n => n && !used.has(n) && !avoid.has(n) && allowed.has(n) && findEx(n);
    recipe.forEach(([poolKey, role], k) => {
      const keys = poolKey.split("|"), key = keys[(rot + idx) % keys.length];
      const pool = pools[key] || [];
      let pick = null;
      for(let t = 0; t < pool.length && !pick; t++){
        const n0 = pool[(rot + k + t) % pool.length], n = swaps[n0] || n0;
        if(ok(n)) pick = n; else if(ok(n0) && !swaps[n0]) pick = n0;
      }
      if(!pick) pick = (SAFE_BY_KEY[key] || []).find(ok) || null;       // gentler option when everything is excluded
      if(!pick && role === "balance") pick = ["Step-Down Control","Single-Leg Romanian Deadlift","Side Plank"].find(ok) || null;
      if(!pick) return;
      used.add(pick);
      exercises.push(prescribe(clone(findEx(pick)), role === "balance" ? "core" : role, goal, eq, {extraMainSet, condLonger, age, exp, duration:p.duration}));
    });
    const letter = String.fromCharCode(65 + idx);
    const secondary = p.secondary.map(x => GOALS[x]).join(", ");
    return {
      name:`${letter} — ${TITLES[sfocus][goal]}`,
      duration:p.duration,
      focus:`${FOCUS_TEXT[sfocus]} · ${GOALS[goal]}${secondary ? ` + ${secondary}` : ""} · ${EQUIPMENT[eq]}`,
      exercises
    };
  });
}
function prescribe(x, role, goal, eq, {extraMainSet, condLonger, age, exp, duration}){
  const rx = RX[goal][role === "finisher" ? "cond" : role];
  const perSide = /\/(leg|side)/.exec(x.reps);
  const hold = typeof HOLD_EXERCISES !== "undefined" && HOLD_EXERCISES.has(x.n);
  if(role === "mob" || role === "flex") return x;                       // keep mobility & stretching as written
  if(role === "easy"){ x.sets = 1; x.reps = STEADY_MIN.mobility; return x; }
  if(x.block === "Conditioning"){
    if(/Steady|Walk/.test(x.n)){ x.sets = 1; x.reps = STEADY_MIN[goal] || (condLonger ? "25–30 min" : "20–25 min"); if(condLonger && goal !== "endurance") x.reps = "25–35 min"; if(duration === 45) x.reps = "12–15 min"; return x; }
    if(role === "circuit"){ x.sets = rx[0] + (condLonger ? 1 : 0); x.rest = rx[2]; return x; }
    x.sets = role === "finisher" ? 4 : rx[0] + (condLonger ? 2 : 0);
    if(duration === 45) x.sets = Math.min(x.sets, 5);
    return x;
  }
  if(!rx) return x;
  const isMain = role === "main" || role === "main2";
  x.sets = rx[0] + (isMain ? extraMainSet : 0);
  if(exp === "new" && ["main","main2","acc"].includes(role)) x.sets = Math.max(2, x.sets - 1);   // beginners: less volume
  if(exp === "experienced" && isMain) x.sets += 1;                                                  // trained: more work on key lifts
  x.rest = x.bw ? Math.min(rx[2], 90) : rx[2];          // no heavy loads, so shorter rests
  if(age === "60+" && !x.bw) x.rest += 15;              // a little more recovery between sets
  if(rx[1] && !hold){
    let reps = x.bw ? (role === "power" ? "8–10" : (RX_BW[goal][role] || RX_BW[goal].acc)) : rx[1];
    // Safety caps: technical barbell lifts and hard bodyweight moves don't go to very high reps.
    const cap = REP_CAPS[x.n], top = str => Math.max(...(String(str).match(/\d+/g) || [0]).map(Number));
    if(cap && top(reps) > top(cap)) reps = cap;
    if((exp === "new" || age === "60+") && isMain && !x.bw && top(reps) < 6) reps = exp === "new" ? "8" : "6";   // no very heavy low-rep sets
    x.reps = perSide ? reps.replace(/^([^(]+?)(\s*\(.*\))?$/, (_, r, t) => `${r}/${perSide[1]}${t || ""}`) : reps;
  }
  return x;
}
const REP_CAPS = {"Deadlift":"8", "Front Squat":"10", "Bench Press":"10", "Kettlebell Deadlift":"12", "Pike Push-up":"6–12",
  "Jump Squat":"8–10", "Inverted Row":"8–15", "Chair Dips":"8–15", "Single-Leg Romanian Deadlift":"8–12"};

/* ---------- personal profile (from v2.7) ---------- */
function normPersonal(p){
  if(!p || !p.sex || !p.ageBracket) return null;
  return {sex:p.sex, ageBracket:p.ageBracket, experience:EXPERIENCE[p.experience] ? p.experience : "some",
    bodyweight:Number(p.bodyweight) > 30 && Number(p.bodyweight) < 250 ? Math.round(Number(p.bodyweight)) : null,
    focus:FOCUS_AREAS[p.focus] ? p.focus : "auto", areas:Array.isArray(p.areas) ? p.areas.filter(a => BODY_AREAS[a]) : []};
}
let personal = normPersonal(read(K.personal, null));
const focusOf = (person = personal) => !person ? "balanced" : person.focus === "auto" ? (SEX_DEFAULT_FOCUS[person.sex] || "balanced") : person.focus;
function ageGuidance(b){
  return {"60+":"Favor gradual progression, joint-friendly options and sufficient recovery; do not assume low capacity solely because of age.",
    "50-59":"Use progressive overload with deliberate recovery and mobility; preserve strength and power where technique is sound.",
    "40-49":"Balance progressive overload with recovery, mobility and joint tolerance.",
    "30-39":"Use normal progressive overload while monitoring recovery and movement quality."}[b]
    || "Use normal progressive overload appropriate to training age, technique and readiness.";
}

let workouts = buildWeek();
let nextIndex = (Number(localStorage.getItem(K.next)) || 0) % workouts.length;

/* ---------- history ---------- */
const getHistory = () => { const x = read(K.history, []); return Array.isArray(x) ? x : []; };
const setHistory = hs => write(K.history, hs.slice(0,500));
function previousFor(name){ for(const rec of getHistory()){ const d = (rec.details||[]).find(x => x.exercise === name); if(d) return d; } return null; }
function lastDays(n){ const since = Date.now() - n*86400000; return getHistory().filter(x => new Date(x.date).getTime() >= since); }
function streak(hs){
  const days = new Set(hs.map(x => new Date(x.date).toDateString()));
  let n = 0; const d = new Date();
  for(let i=0;i<365;i++){ if(days.has(d.toDateString())) n++; else if(i>0) break; d.setDate(d.getDate()-1); }
  return n;
}
function volumeOf(details){
  let v = 0;
  details.forEach(d => (d.sets||[]).forEach((s,i) => { if(d.done && d.done[i] === false) return; const w = num(s.w), r = num(s.r); if(w != null && r != null && trackingType({block:d.block, n:d.exercise}) === "loadReps") v += w*r; }));
  return Math.round(v);
}

/* ---------- readiness adaptation (from v2.3.1) ---------- */
/* Today's readiness tier from the check-in. */
function readinessTier(r){
  if(r.energy <= 1 || r.soreness >= 5) return "recovery";
  if(r.energy <= 2 || r.soreness >= 4) return "easy";
  if(r.energy >= 4 && r.soreness <= 2) return "push";
  return "normal";
}
const TIER_TEXT = {
  push:{label:"Fresh — push a little", message:"You're fresh: small step up where last time felt controlled."},
  normal:{label:"Planned session", message:"Train as planned at RPE 7–8, keeping 1–3 reps in reserve on the big lifts."},
  easy:{label:"Lighter day", message:"Low energy or sore: about 7% lighter, one fewer accessory set, stop 3–4 reps short, longer rests, easier cardio."},
  recovery:{label:"Recovery day", message:"Very tired or very sore: about 15% lighter, fewer sets, no jumping, easy cardio. Moving still helps."}
};
function readinessProfile(r){
  const tier = readinessTier(r), t = TIER_TEXT[tier];
  const time = {45:"45-minute express: main lift, one accessory paired with core, short cardio and a stretch.",
    60:"60 minutes: warm-up, main lift, key accessories, core, cardio and a cooldown.", 75:"", 90:""}[r.time] || "";
  const mode = tier === "recovery" || tier === "easy" ? (r.time <= 60 ? "recovery60" : "reduced") : r.time === 45 ? "time45" : r.time === 60 ? "time60" : r.time === 75 ? "balanced75" : "full";
  return {mode, tier, label:t.label + (r.time <= 60 ? ` · ${r.time} min` : ""), message:[t.message, time].filter(Boolean).join(" ")};
}
function adaptExercise(ex, p){
  const x = clone(ex);
  if(p.mode === "recovery60" || p.tier === "recovery"){
    if(["Strength","Hypertrophy","Power","Durability"].includes(x.block)) x.sets = Math.max(2, x.sets-1);
    if(x.block === "Conditioning"){
      if(/Steady|Walk/.test(x.n)) x.reps = "15–20 min easy";
      else if(x.n.includes("Intervals")) x.sets = Math.min(x.sets, 4);
      else x.sets = Math.max(3, x.sets-2);
    }
  }else if(p.mode === "reduced"){
    if(["Hypertrophy","Durability"].includes(x.block)) x.sets = Math.max(2, x.sets-1);
    if(x.block === "Conditioning" && x.sets > 1) x.sets = Math.max(4, x.sets-1);
  }else if(p.mode === "time45"){
    if(["Hypertrophy","Durability"].includes(x.block)) x.sets = Math.min(x.sets, 3);
    if(x.block === "Conditioning"){ if(/Steady|Walk/.test(x.n)) x.reps = "12–15 min"; else if(x.sets > 1) x.sets = Math.min(x.sets, 4); }
  }else if(p.mode === "time60"){
    if(x.block === "Hypertrophy") x.sets = Math.max(2, x.sets-1);
    if(x.block === "Conditioning"){ if(/Steady|Walk/.test(x.n)) x.reps = "18–20 min"; else if(x.sets > 1) x.sets = Math.max(4, x.sets-1); }
  }else if(p.mode === "balanced75"){
    if(x.block === "Hypertrophy" && x.sets > 3) x.sets = 3;
  }
  if((p.tier === "easy" || p.tier === "recovery") && x.rest && ["Strength","Hypertrophy","Power","Durability"].includes(x.block)) x.rest += 30;   // more recovery between working sets
  return x;
}
function adaptWorkout(w, r){
  const p = readinessProfile(r);
  const all = clone(w.exercises);
  let keep = all.slice();
  if(r.time <= 60){
    const pick = [keep.find(x => x.block === "Mobility"), keep.find(x => x.block === "Strength"),
      keep.find(x => ["Hypertrophy","Power"].includes(x.block)), keep.find(x => x.block === "Durability"),
      keep.find(x => x.block === "Conditioning"), keep.find(x => x.block === "Flexibility")].filter(Boolean);
    if(r.time === 60){ const second = keep.find(x => x.block === "Strength" && !pick.includes(x)); if(second) pick.push(second); }
    keep = keep.filter(x => pick.includes(x));
  }else if(r.time === 75){
    let m = false, f = false;
    keep = keep.filter(x => { if(x.block === "Mobility"){ if(m) return false; m = true; } if(x.block === "Flexibility"){ if(f) return false; f = true; } return true; });
  }
  if(p.tier === "easy" || p.tier === "recovery"){ let gone = false; keep = keep.filter(x => { if(!gone && x.block === "Hypertrophy"){ gone = true; return false; } return true; }); }
  if(p.tier === "recovery") keep = keep.filter(x => x.block !== "Power");            // no jumping or explosive work
  const out = keep.map(x => adaptExercise(x, p));
  if(r.time === 45){
    // save time: do the accessory and core back-to-back, then rest
    const acc = out.find(x => ["Hypertrophy","Power"].includes(x.block)), core = out.find(x => x.block === "Durability");
    if(acc && core){ acc.supersetWith = core.n; acc.restPlanned = acc.rest; acc.rest = 15; }
  }
  return {profile:p, all, keep:out};
}

/* ---------- tracking + progression (from v2.4) ---------- */
function trackingType(ex){
  if(ex.block === "Mobility" || ex.block === "Flexibility") return "repsTime";
  if(ex.bw || (typeof BW_NAMES !== "undefined" && BW_NAMES.has(ex.n))){
    if(HOLD_EXERCISES.has(ex.n)) return "hold";
    return ex.block === "Conditioning" ? "bwCond" : "bwReps";
  }
  if(ex.block === "Conditioning"){ if(/Bike/i.test(ex.n)) return "bike"; if(/StairMaster/i.test(ex.n)) return "stair"; return "conditioning"; }
  if(/Carry/i.test(ex.n)) return "carry";
  return "loadReps";
}
function prevLine(ex, prev){
  if(!prev || !Array.isArray(prev.sets)) return "";
  const t = trackingType(ex);
  const rows = prev.sets.map((s,i) => {
    if(prev.done && prev.done[i] === false) return null;
    if(["repsTime","bwReps","hold","bwCond"].includes(t)) return s.r || null;
    if(t === "bike" || t === "stair") return s.w || s.r ? `${s.w ? (t==="bike"?"res ":"lvl ")+s.w : ""}${s.w&&s.r?" · ":""}${s.r||""}` : null;
    if(t === "carry") return s.w || s.r ? `${s.w||"–"} kg · ${s.r||"–"}` : null;
    return s.w || s.r ? `${s.w||"–"}×${s.r||"–"}` : null;
  }).filter(Boolean);
  return rows.length ? `${isDE() ? "Letztes Mal" : "Last time"}: ${rows.join(", ")}${prev.rpe ? ` · RPE ${prev.rpe}` : ""}` : "";
}
function suggestion(ex, prev, reduced){
  const t = trackingType(ex), de = isDE();
  if(t === "hold") return reduced ? (de ? "Heute kürzer halten und die Position perfekt sauber lassen." : "Shorter holds today; keep the position perfect.")
    : (de ? "Füge 5–10 Sekunden hinzu, sobald jeder Durchgang stabil bleibt." : "Add 5–10 seconds once every hold stays solid.");
  if(t === "bwCond") return reduced ? (de ? "Gleichmäßiges, lockeres Tempo. Qualität vor Geschwindigkeit." : "Easy, steady pace. Quality before speed.")
    : (de ? "Halte das Tempo über alle Runden gleich; steigere erst, wenn die letzte Runde sauber bleibt." : "Keep every round at the same pace; build only when the last round stays clean.");
  if(t === "bwReps"){
    const reps = prev && Array.isArray(prev.sets) ? prev.sets.filter((q,i) => !prev.done || prev.done[i] !== false).map(q => num(q.r)).filter(v => v != null) : [];
    if(!reps.length) return reduced ? (de ? "Heute leicht: jeden Satz mit 3–4 sauberen Wiederholungen Reserve beenden." : "Easy today: stop each set with 3–4 clean reps left.")
      : (de ? "Beende jeden Satz mit 2–3 sauberen Wiederholungen Reserve." : "Stop each set with 2–3 clean reps left in the tank.");
    const best = Math.max(...reps), rpe = Number(prev.rpe || 8);
    if(reduced) return de ? `Heute: etwa ${Math.max(1, best - 2)} Wiederholungen pro Satz, ruhiges Tempo.` : `Today: about ${Math.max(1, best - 2)} reps per set, smooth tempo.`;
    if(rpe <= 7) return de ? `Letztes Mal war kontrolliert. Ziel: ${best + 2} Wiederholungen, oder 3 Sekunden absenken.` : `Last time felt controlled. Aim for ${best + 2} reps, or slow the lowering to 3 seconds.`;
    if(rpe >= 9) return de ? `Letztes Mal war sehr schwer. Bleib bei ${best} Wiederholungen und pausiere etwas länger.` : `Last time was very hard. Stay at ${best} reps and rest a little longer.`;
    return de ? `Ziel: ${best}–${best + 1} Wiederholungen mit sauberer Technik.` : `Aim for ${best}–${best + 1} reps with clean form.`;
  }
  if(t === "repsTime") return ex.block === "Flexibility"
    ? (reduced ? (de ? "Heute nur im angenehmen Bereich. Die Endposition nicht erzwingen." : "Comfortable range only today. Don't force end range.")
               : (de ? "Ruhiger atmen und etwas mehr schmerzfreien Umfang anstreben." : "Aim for smoother breathing and slightly more pain-free range."))
    : (de ? "Fortschritt über Kontrolle und schmerzfreien Umfang, nicht über Gewicht." : "Progress through control and pain-free range, not load.");
  if(t === "bike") return reduced ? (de ? "Harte Intervalle bei etwa RPE 6–7 mit gleichmäßiger Trittfrequenz." : "Keep hard intervals around RPE 6–7 with smooth cadence.")
    : (de ? "Widerstand oder Trittfrequenz nur erhöhen, wenn jedes Intervall wiederholbar bleibt." : "Add resistance or cadence only if every interval stays repeatable.");
  if(t === "stair") return reduced ? (de ? "Kontrollierte Stufe wählen, aufrecht bleiben, nicht am Geländer hängen." : "Pick a controlled level, stay tall, don't hang on the rails.")
    : (de ? "Eine Stufe oder etwas mehr Zeit hinzufügen, nur wenn die Haltung stabil bleibt." : "Add one level or a little time only if posture holds.");
  if(t === "conditioning") return reduced ? (de ? "Tempo oder Runden nach Bedarf reduzieren. Bewegungsqualität zuerst." : "Reduce pace or rounds as needed. Movement quality first.")
    : (de ? "Tempo oder Gesamtarbeit leicht steigern, solange die Technik sauber bleibt." : "Nudge pace or total work while technique stays clean.");
  const done = prev && Array.isArray(prev.sets) ? prev.sets.filter((s,i) => !prev.done || prev.done[i] !== false) : [];
  const vals = done.map(s => num(s.w)).filter(v => v != null);
  if(!vals.length) return reduced ? (de ? "Heute ein leichtes Technikgewicht, 3–4 Wiederholungen in Reserve." : "Easy technical load today, 3–4 reps in reserve.")
    : (de ? "Wähle ein Gewicht, bei dem 2–3 Wiederholungen in Reserve bleiben." : "Pick a load you can finish with 2–3 reps in reserve.");
  const avg = vals.reduce((a,b) => a+b, 0) / vals.length, rpe = Number(prev.rpe || 8);
  const lo = fmtKg(Math.max(0, avg-2.5)), hi = fmtKg(avg+2.5), same = fmtKg(avg);
  if(reduced) return de ? `Heute: etwa ${lo} kg oder das letzte Gewicht mit weniger Wiederholungen.` : `Today: about ${lo} kg, or last load with fewer reps.`;
  if(rpe <= 7) return de ? `Letztes Mal war kontrolliert. Versuch ${hi} kg, wenn sich das Aufwärmen gut anfühlt.` : `Last time felt controlled. Try ${hi} kg if the warm-up feels good.`;
  if(rpe >= 9) return de ? `Letztes Mal war sehr schwer. Versuch ${lo} kg oder weniger Wiederholungen.` : `Last time was very hard. Try ${lo} kg or fewer reps.`;
  return de ? `Wiederhole ${same} kg und mach die Wiederholungen sauberer. Steigere, sobald der letzte Satz bei RPE 7–8 liegt.`
            : `Repeat ${same} kg and tighten the reps. Go up once the last set sits at RPE 7–8.`;
}

/* ---------- today's target: profile + history + check-in ----------
   Weight: last time's working weight (progressed by how hard it felt), or a starting estimate from
   the profile when there's no history. Then today's readiness nudges it up or down. */
function loadKind(n){ return (LOAD_GUIDE[n] || [0, /Dumbbell|Farmer|Renegade/.test(n) ? "db" : "bb"])[1]; }
function roundLoad(v, kind){ const st = LOAD_STEP[kind] || 2.5; return Math.max(LOAD_MIN[kind] || st, Math.round(v / st) * st); }
function estimateLoad(ex){
  const g = LOAD_GUIDE[ex.n]; if(!g) return null;
  const [ratio, kind, region] = g, per = personal || {};
  const bw = per.bodyweight || DEFAULT_BW[per.sex] || 72;
  const sexF = ((SEX_LOAD[per.sex] || SEX_LOAD.male)[region]) || 1;
  const reps = Math.max(...(String(ex.reps).match(/\d+/g) || [8]).map(Number));
  const repF = reps <= 5 ? 1.12 : reps >= 15 ? 0.75 : reps >= 12 ? 0.85 : 1;
  return roundLoad(bw * ratio * sexF * (AGE_LOAD[per.ageBracket] || 1) * (EXP_LOAD[per.experience] || 1) * repF, kind);
}
const fmtRest = sec => sec >= 60 ? `${Math.floor(sec/60)}:${String(sec%60).padStart(2,"0")}` : `${sec}s`;
function todayTarget(ex){
  const t = trackingType(ex), tier = (state && state.adaptation && state.adaptation.tier) || "normal", de = isDE();
  const prev = previousFor(ex.n), sets = ex.sets.length, reps = repsText(ex.reps);
  const restTxt = ex.rest ? ` · ${de ? "Pause" : "rest"} ${fmtRest(ex.rest)}` : "";
  const TIER = {push:de ? "Du bist frisch." : "You're fresh.", easy:de ? "Leichter heute (wenig Energie oder Muskelkater)." : "Lighter today (low energy or sore).",
    recovery:de ? "Erholungstag: deutlich leichter." : "Recovery day: much lighter.", normal:""}[tier];
  if(t === "loadReps" || t === "carry"){
    const kind = loadKind(ex.n), inc = LOAD_STEP[kind] || 2.5;
    let base = null, why = "";
    const done = prev && Array.isArray(prev.sets) ? prev.sets.filter((q,i) => !prev.done || prev.done[i] !== false).map(q => num(q.w)).filter(v => v != null && v > 0) : [];
    if(done.length){
      base = Math.max(...done); const rpe = Number(prev.rpe || 8);
      if(rpe <= 7){ base += inc; why = de ? "Mehr als letztes Mal – es fühlte sich kontrolliert an." : "Up from last time — it felt controlled."; }
      else if(rpe >= 9){ base -= inc; why = de ? "Weniger als letztes Mal – es war sehr schwer." : "Down from last time — it was very hard."; }
      else { why = de ? "Wie letztes Mal – mach die Wiederholungen sauberer." : "Same as last time — make the reps cleaner."; if(tier === "push") base += inc; }
    }else{
      base = estimateLoad(ex);
      why = de ? "Startwert aus deinem Profil – nach dem ersten Satz anpassen." : "Starting estimate from your profile — adjust after your first set.";
    }
    if(base == null) return {text:`${sets} × ${reps}${restTxt}`, why:[TIER].filter(Boolean).join(" ")};
    const factor = tier === "easy" ? 0.925 : tier === "recovery" ? 0.85 : 1;
    const w = roundLoad(base * factor, kind);
    const each = kind === "db" ? (de ? " je Hand" : " each") : "";
    const tierWhy = tier === "easy" ? (de ? "Etwa 7 % leichter, 3–4 Wdh. vor dem Limit aufhören." : "About 7% lighter; stop 3–4 reps before your limit.")
      : tier === "recovery" ? (de ? "Etwa 15 % leichter, lockere Anstrengung." : "About 15% lighter; easy effort.") : "";
    return {w:fmtKg(w), text:`${sets} × ${reps} @ ${fmtKg(w)} kg${each}${restTxt}`, why:[TIER, tierWhy, why].filter(Boolean).join(" ")};
  }
  if(t === "bwReps"){
    const firstTime = !prev && personal && (personal.experience === "new" || personal.sex === "female") && ex.n === "Push-up";
    const add = tier === "push" ? (de ? "Versuch 1–2 Wiederholungen mehr oder 3 Sekunden absenken." : "Try 1–2 more reps, or a 3-second lowering.")
      : tier === "easy" || tier === "recovery" ? (de ? "Hör 3–4 Wiederholungen vor dem Limit auf." : "Stop 3–4 reps before your limit.") : "";
    const ver = firstTime ? (de ? "Starte mit den Händen auf einer Bank, wenn nötig." : "Start with hands on a bench if needed.") : "";
    return {text:`${sets} × ${reps}${restTxt}`, why:[TIER, add, ver].filter(Boolean).join(" ")};
  }
  if(["bike","stair","conditioning","bwCond"].includes(t)){
    const eff = tier === "push" ? (de ? "Harte Phasen bei RPE 8." : "Hard efforts at RPE 8.") : tier === "easy" ? (de ? "Harte Phasen nur bei RPE 6." : "Hard efforts only at RPE 6.")
      : tier === "recovery" ? (de ? "Locker bei RPE 5 – du solltest reden können." : "Easy at RPE 5 — you should be able to talk.") : (de ? "Harte Phasen bei RPE 7." : "Hard efforts at RPE 7.");
    return {text:`${sets} × ${reps}${restTxt}`, why:[TIER, eff].filter(Boolean).join(" ")};
  }
  if(t === "hold") return {text:`${sets} × ${reps}${restTxt}`, why:[TIER, tier === "push" ? (de ? "Füge 5–10 Sekunden hinzu." : "Add 5–10 seconds.") : ""].filter(Boolean).join(" ")};
  return {text:`${sets} × ${reps}${restTxt}`, why:""};
}

/* ---------- sound + voice ----------
   Two engines:
   - "natural" (disabled since v4.9.3 to avoid OpenAI credit): neural voices from the zahi-fit-voice
     Cloudflare Worker. Every clip is cached on the phone, so it plays instantly next time and offline.
   - "device": the phone's own voice, used offline or when the natural voice can't be reached. */
/* The voice chosen for Male / Female, remembered separately for each language: {en:"…", de:"…"}.
   Older versions stored one name for all languages; it's kept and only used where it fits. */
function parseSlot(raw){
  if(!raw) return {};
  try{ const o = JSON.parse(raw); if(o && typeof o === "object") return o; }catch{}
  return {_any:raw};
}
const slotName = (g, lang) => (voice.slots[g] && (voice.slots[g][lang] || voice.slots[g]._any)) || "";
function setSlot(g, lang, name){
  const o = {...(voice.slots[g] || {})};
  if(o._any){   // older single-name format: file it under the language that voice belongs to
    const owner = Object.keys(LANG_TAG).find(l => (("speechSynthesis" in window && speechSynthesis.getVoices()) || []).some(v => v.name === o._any && new RegExp(`^${LANG_TAG[l]}([-_]|$)`, "i").test(v.lang || "")));
    if(owner && !o[owner]) o[owner] = o._any;
    delete o._any;
  }
  if(name) o[lang] = name; else delete o[lang];
  voice.slots[g] = o; localStorage.setItem(g === "male" ? K.voiceMale : K.voiceFemale, JSON.stringify(o));
}
const voice = {
  mode: localStorage.getItem(K.voiceMode) || "essential",          // off | essential | full
  sounds: localStorage.getItem(K.audio) !== "off",
  rate: Number(localStorage.getItem(K.rate) || "0.9"),
  name: localStorage.getItem(K.voiceName) || "",
  lang: localStorage.getItem(K.lang) === "de" ? "de" : "en",
  gender: ["male","female","neutral"].includes(localStorage.getItem(K.gender)) ? localStorage.getItem(K.gender) : "male",
  engine: "device",         // phone voices only: free, offline, no OpenAI credit
  slots: {male:parseSlot(localStorage.getItem(K.voiceMale)), female:parseSlot(localStorage.getItem(K.voiceFemale))}
};
let actx = null;
function unlockAudio(){ try{ actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if(actx.state === "suspended") actx.resume(); }catch{} }
function beep(f, d, v){
  if(!voice.sounds) return; unlockAudio(); if(!actx) return;
  const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime;
  o.type = "sine"; o.frequency.value = f; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t+d);
  o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t+d);
}
const cue = {
  start(){ beep(520,.11,.06); setTimeout(() => beep(660,.11,.06),130); },
  warn(){ beep(780,.1,.055); setTimeout(() => beep(780,.1,.055),170); },
  end(){ beep(620,.11,.07); setTimeout(() => beep(820,.13,.07),140); setTimeout(() => beep(1040,.16,.075),300); if(navigator.vibrate) navigator.vibrate([250,100,250]); }
};

/* Spoken phrases. Workout cues are written natively in each language; exercise
   instructions are English in the app and translated by the voice worker for German. */
const pickOne = list => list[Math.floor(Math.random() * list.length)];
const durEN = sec => sec >= 60 ? `${Math.floor(sec/60)} minute${sec >= 120 ? "s" : ""}${sec % 60 ? ` ${sec % 60} seconds` : ""}` : `${sec} seconds`;
const durDE = sec => sec >= 60 ? `${Math.floor(sec/60) === 1 ? "eine Minute" : `${Math.floor(sec/60)} Minuten`}${sec % 60 ? ` ${sec % 60} Sekunden` : ""}` : `${sec} Sekunden`;
const SAY = {
  en:{
    rest:sec => pickOne([`Nice work. Rest for ${durEN(sec)}.`, `Good set. Take ${durEN(sec)} to recover.`, `Well done. Breathe and rest for ${durEN(sec)}.`]),
    get ten(){ return pickOne(["Ten seconds. Get ready.", "Ten seconds. Set yourself up.", "Ten seconds to go. You've got this."]); },
    get done(){ return pickOne(["Rest's done. Next set — you've got this.", "Time to go. Strong and steady.", "Let's go. Nice and controlled."]); },
    get good(){ return pickOne(["Great set!", "Nice work, that looked strong.", "Well done. Keep it smooth.", "Strong effort. Keep going."]); },
    test:"Hi, I'm your Zahi Fit coach. Let's have a great session today. You've got this.",
    step:(n, t, x, c) => `Step ${n}. ${t}. ${x}${c ? ` Remember: ${c}.` : ""}`
  },
  de:{
    rest:sec => pickOne([`Gute Arbeit. Pause für ${durDE(sec)}.`, `Guter Satz. Nimm dir ${durDE(sec)} zum Erholen.`, `Stark. Atme durch und pausiere ${durDE(sec)}.`]),
    get ten(){ return pickOne(["Noch zehn Sekunden. Mach dich bereit.", "Zehn Sekunden. Geh in Position.", "Noch zehn Sekunden. Du schaffst das."]); },
    get done(){ return pickOne(["Pause vorbei. Nächster Satz – du schaffst das.", "Los geht's. Stark und ruhig.", "Weiter geht's. Schön kontrolliert."]); },
    get good(){ return pickOne(["Super Satz!", "Gute Arbeit, das sah stark aus.", "Gut gemacht. Bleib sauber in der Bewegung.", "Starke Leistung. Weiter so."]); },
    test:"Hallo, ich bin dein Zahi Fit Coach. Lass uns heute stark trainieren. Du schaffst das.",
    step:(n, t, x, c) => `Schritt ${n}. ${t}. ${x}${c ? ` Merke: ${c}.` : ""}`
  }
};
const phrase = () => SAY[voice.lang];

/* ---------- exercise language (English / Deutsch) ----------
   The chosen language drives the exercise screen, the step-by-step guide and the voice together.
   Data keys stay English, so history and load suggestions are shared across languages. */
const isDE = () => voice.lang === "de" && typeof DE !== "undefined";
const UI = {
  en:{of:"of", rest:"rest", continuous:"continuous", replacing:"Replacing", howTo:"How to do it", howToSub:"Video demo + 5-step guide with voice",
    kg:"kg", reps:"Reps", done:"Done", repsTime:"Reps / time", timeSide:"Time / side", resistance:"Resistance", time:"Time", level:"Level",
    loadLevel:"Load / level", rounds:"Rounds / time", distance:"Distance", addSet:"+ Add a set", howHard:"How hard was it?", howHardSub:" Guides next time's load.",
    easy:"Easy", good:"Good", hard:"Hard", veryHard:"Very hard", steady:"Steady", technique:"Technique", doIt:"Do", avoid:"Avoid",
    stepGuide:"Step-by-step guide", talk:"Talk me through it", next:"Next", finish:"Finish workout", skipped:"You skipped this exercise. It won't count toward today's progress.",
    include:"Include it again", feel:"What you should feel", voiceSpeed:"Voice speed", slower:"Slower", normal:"Normal", faster:"Faster",
    preparing:"Preparing voice…", stop:"Stop", restLbl:"Rest", skip:"Skip", exercises:"Exercises", setsDone:"of today's sets done",
    skippedState:"skipped", doneState:"done", step:"step", stepByStep:"Step by step", watch:"Watch the demo", openYT:"Open in YouTube", changeVideo:"Change video", findYT:"Find a video on YouTube", addVideo:"Add a video", offlineVideo:"Videos need internet. The steps and voice below work offline.", tapStep:"Tap a step to read it, or let the coach talk you through."},
  de:{of:"von", rest:"Pause", continuous:"durchgehend", replacing:"Ersetzt", howTo:"So geht's", howToSub:"Video + 5-Schritte-Anleitung mit Sprachcoach",
    kg:"kg", reps:"Wdh.", done:"Fertig", repsTime:"Wdh. / Zeit", timeSide:"Zeit / Seite", resistance:"Widerstand", time:"Zeit", level:"Stufe",
    loadLevel:"Last / Stufe", rounds:"Runden / Zeit", distance:"Strecke", addSet:"+ Satz hinzufügen", howHard:"Wie anstrengend war es?", howHardSub:" Bestimmt das Gewicht beim nächsten Mal.",
    easy:"Leicht", good:"Gut", hard:"Schwer", veryHard:"Sehr schwer", steady:"Gleichmäßig", technique:"Technik", doIt:"Achte auf", avoid:"Vermeide",
    stepGuide:"Schritt für Schritt", talk:"Anleitung vorlesen", next:"Weiter", finish:"Training beenden", skipped:"Du hast diese Übung übersprungen. Sie zählt heute nicht zum Fortschritt.",
    include:"Wieder aufnehmen", feel:"Was du spüren solltest", voiceSpeed:"Sprechtempo", slower:"Langsamer", normal:"Normal", faster:"Schneller",
    preparing:"Stimme wird vorbereitet…", stop:"Stopp", restLbl:"Pause", skip:"Überspringen", exercises:"Übungen", setsDone:"der heutigen Sätze erledigt",
    skippedState:"übersprungen", doneState:"fertig", step:"Schritt", stepByStep:"Schritt für Schritt", watch:"Demo ansehen", openYT:"In YouTube öffnen", changeVideo:"Video ändern", findYT:"Video auf YouTube suchen", addVideo:"Video hinzufügen", offlineVideo:"Videos brauchen Internet. Die Schritte und die Stimme unten funktionieren offline.", tapStep:"Tippe auf einen Schritt oder lass dich vom Coach durchführen."}
};
const T = k => (isDE() ? UI.de : UI.en)[k] ?? UI.en[k] ?? k;
const exName = n => isDE() ? (DE.names[n] || n) : n;
const exCue = ex => isDE() && DE.ex[ex.n] ? DE.ex[ex.n][0] : ex.cue;
const exHow = ex => isDE() && DE.ex[ex.n] ? DE.ex[ex.n][1] : (ex.how || []);
const exMistakes = ex => isDE() && DE.ex[ex.n] ? DE.ex[ex.n][2] : (ex.mistakes || []);
const blockName = b => isDE() ? (DE.blocks[b] || b) : b;
const repsText = r => isDE() ? DE.reps(r) : r;
const stepsOf = fam => (isDE() ? (DE.steps[fam] || DE.steps.circuit) : (STEPS[fam] || STEPS.circuit));
const feelOf = fam => isDE() ? (DE.feel[fam] || "Die Zielmuskeln arbeiten kontrolliert und schmerzfrei.") : ((typeof FEEL_EXTRA !== "undefined" && FEEL_EXTRA[fam]) || feelFor(fam));
const ADAPT_DE = {
  recovery60:["Regenerationseinheit","Kurz und locker: 3–4 Wiederholungen in Reserve, weniger Sätze, sanfte Ausdauer."],
  reduced:["Reduzierte Last","3–4 Wiederholungen in Reserve, weniger Zusatzvolumen, kontrollierte Ausdauer."],
  time60:["60-Minuten-Fokus","Aufwärmen, Hauptübung, eine wichtige Zusatzübung, Stabilität, Ausdauer und Cooldown."],
  balanced75:["Ausgewogene Einheit","Hauptübungen und Ausdauer bleiben; etwas weniger Zusatzvolumen."],
  full:["Volle Einheit","Absolviere das geplante Training bei RPE 7–8 mit 1–3 Wiederholungen in Reserve bei Grundübungen."]
};
const TIER_DE = {push:["Frisch – etwas mehr","Du bist frisch: kleiner Schritt nach oben, wo es letztes Mal kontrolliert war."],
  normal:["Geplante Einheit","Trainiere wie geplant bei RPE 7–8 mit 1–3 Wiederholungen in Reserve."],
  easy:["Leichterer Tag","Wenig Energie oder Muskelkater: etwa 7 % leichter, ein Zusatzsatz weniger, längere Pausen, lockereres Cardio."],
  recovery:["Erholungstag","Sehr müde oder starker Muskelkater: etwa 15 % leichter, weniger Sätze, keine Sprünge, lockeres Cardio."]};
const adaptText = a => isDE() && a.tier && TIER_DE[a.tier] ? {label:TIER_DE[a.tier][0] + (a.targetMinutes <= 60 ? ` · ${a.targetMinutes} Min` : ""), message:TIER_DE[a.tier][1]}
  : isDE() && ADAPT_DE[a.mode] ? {label:ADAPT_DE[a.mode][0], message:ADAPT_DE[a.mode][1]} : a;
const langLabel = l => l === "de" ? "Deutsch" : "English";
const genderLabel = g => ({male:"Male", female:"Female", neutral:"Neutral"})[g];
const LANG_TAG = {en:"en", de:"de"};

/* -- device voice: pick by language + gender, prefer network/neural voices, speak sentence by sentence -- */
const FEMALE = /female|woman|frau|nicky|ava|zoe|allison|catherine|kate|martha|shelley|anna|helena|hedda|katja|petra|marlene|vicki|zira|samantha|karen|moira|tessa|serena|susan|aria|jenny|libby|sonia|emma|olivia|amy|salli|joanna|kendra|kimberly|ivy|google uk english female|de-de-x-(dea|deb|nfh)/i;
const MALE = /\bmale\b|\bman\b|mann|aaron|evan|nathan|arthur|gordon|martin|rishi|markus|stefan|hans|yannick|conrad|killian|daniel|david|george|mark|guy|ryan|thomas|alex|fred|oliver|brian|matthew|joey|justin|google uk english male|de-de-x-(deg|deh)/i;
function voices(lang = voice.lang){
  if(!("speechSynthesis" in window)) return [];
  const all = speechSynthesis.getVoices() || [];
  const inLang = all.filter(v => new RegExp(`^${LANG_TAG[lang]}([-_]|$)`, "i").test(v.lang || ""));
  const score = v => (/Natural|Neural|Enhanced|Premium|Online/i.test(v.name) ? 0 : 2) + (v.localService === false ? 0 : 1);
  return (inLang.length ? inLang : all).slice().sort((a,b) => score(a) - score(b) || (a.name||"").localeCompare(b.name||""));
}
/* Google's Android voices carry codes like "en-us-x-iol-local"; these codes tell male from female. */
const GOOGLE_F = /-x-(sfg|iob|iog|tpc|tpf|gba|gbc|gbg|gbs|afh|aua|auc|ahp|cxx|ene|dea|deb|nfh|kda)(-|$)/i;
const GOOGLE_M = /-x-(iol|iom|tpd|gbb|gbd|rjs|aub|aud|end|deg|deh|dej)(-|$)/i;
function genderOf(v){
  const n = `${v.name || ""} ${v.voiceURI || ""}`;
  if(GOOGLE_F.test(n) || FEMALE.test(n)) return "female";
  if(GOOGLE_M.test(n) || MALE.test(n)) return "male";
  return null;
}
const hasLang = lang => ("speechSynthesis" in window) && (speechSynthesis.getVoices() || []).some(v => new RegExp(`^${LANG_TAG[lang]}([-_]|$)`, "i").test(v.lang || ""));
function pickVoice(set){
  if(!hasLang(set.lang)) return {v:null, exact:false, mid:false};          // let the phone use its own voice for that language
  const vs = voices(set.lang);
  // a voice the person assigned to Male or Female is used as-is (it's a real voice, so no pitch trick)
  const slot = set.gender === "male" || set.gender === "female" ? slotName(set.gender, set.lang) : "";
  if(slot){ const own = vs.find(v => v.name === slot); if(own) return {v:own, exact:true}; }
  if(set.gender === "neutral" && set.name){ const own = vs.find(v => v.name === set.name); if(own) return {v:own, exact:true}; }
  if(set.gender === "neutral"){
    const plain = vs.find(v => !genderOf(v));
    if(plain) return {v:plain, exact:false};
    const soft = vs.find(v => genderOf(v) === "female");                    // mid-pitched: a female voice pitched down a little
    return {v:soft || vs[0], exact:false, mid:!!soft};
  }
  const hit = vs.find(v => genderOf(v) === set.gender);
  return {v:hit || vs[0], exact:!!hit};
}
/* Tone: a clear pitch difference so male, female and neutral always sound different —
   stronger when the phone has only one voice for the language, milder on a truly gendered voice. */
/* Male: calm, steady, a little slower. Female: bright and warm. Real voices get only a light touch;
   a shared single voice gets a moderate shift (big shifts sound robotic). Neutral is unchanged. */
function toneFor(gender, exact, mid){
  if(gender === "male") return exact ? {pitch:0.97, rate:0.95} : {pitch:0.78, rate:0.92};
  if(gender === "female") return exact ? {pitch:1.03, rate:1.0} : {pitch:1.12, rate:1.0};
  return mid ? {pitch:0.86, rate:1.0} : {pitch:1.0, rate:1.0};
}
let voicesWaiter = null;
function voicesReady(){
  if(!("speechSynthesis" in window) || (speechSynthesis.getVoices() || []).length) return Promise.resolve();
  if(!voicesWaiter) voicesWaiter = new Promise(res => {
    const done = () => { speechSynthesis.removeEventListener?.("voiceschanged", done); res(); };
    speechSynthesis.addEventListener?.("voiceschanged", done); setTimeout(done, 1500);
  });
  return voicesWaiter;
}
let noLangNoticed = {};
async function speakDevice(text, token, onend, set = voice){
  if(!("speechSynthesis" in window)){ onend && onend(); return; }
  await voicesReady();
  if(token !== speechToken) return;
  if(set.lang === "de" && !hasLang("de") && !noLangNoticed.de){ noLangNoticed.de = true; toast("No German voice is installed on this phone. See Profile › How to set up your phone's voices."); }
  const {v, exact, mid} = pickVoice(set), tone = toneFor(set.gender, exact, mid);
  // Short sentences sound smoother and avoid Android cutting long utterances off.
  const parts = String(text).match(/[^.!?;:]+[.!?;:]*/g)?.map(x => x.trim()).filter(Boolean) || [String(text)];
  speechSynthesis.cancel();
  parts.forEach((p, k) => {
    const u = new SpeechSynthesisUtterance(p);
    if(v){ u.voice = v; u.lang = v.lang; } else u.lang = set.lang === "de" ? "de-DE" : "en-GB";
    u.rate = (set.rate || voice.rate) * tone.rate; u.pitch = tone.pitch; u.volume = 1;
    if(k === parts.length - 1) u.onend = () => { if(token === speechToken && onend) onend(); };
    speechSynthesis.speak(u);
  });
}
/* Play something in a voice that isn't saved yet (previews while choosing). */
function speakWith(text, set, {onend, onready} = {}){
  hush(); const token = ++speechToken; onready && onready();
  speakDevice(text, token, onend, {lang:set.lang, gender:set.gender, name:set.name || "", rate:voice.rate});
}
/* Lists every voice the phone offers for the language (one per accent on most Android phones)
   so the person can hear each one plainly and pick the one that sounds right for Male or Female. */
function voiceFinder(gender, onPicked, lang = voice.lang){
  sheet((card, close) => {
    const vs = voices(lang).filter(v => new RegExp(`^${LANG_TAG[lang]}([-_]|$)`, "i").test(v.lang || ""));
    const list = h("div", {class:"finder-list"});
    const line = lang === "de" ? "Hallo, ich bin dein Coach. Lass uns stark trainieren." : "Hi, I'm your coach. Let's make today a strong one.";
    vs.forEach(v => {
      const tag = genderOf(v), current = slotName(gender, lang) === v.name;
      list.append(h("div", {class:"finder-row" + (current ? " cur" : "")},
        h("button", {class:"icon-btn", "aria-label":`Listen to ${v.name}`, onclick:() => {
          unlockAudio(); hush(); const token = ++speechToken;
          speakDevice(line, token, null, {lang, gender:"neutral", name:v.name, rate:voice.rate});   // plain voice, no pitch change
        }}, "▶"),
        h("div", {class:"finder-name"}, h("b", null, v.name), h("span", null, [v.lang, tag ? `${tag} voice` : null].filter(Boolean).join(" · "))),
        h("button", {class:"btn sm " + (current ? "idle" : "primary"), onclick:() => {
          setSlot(gender, lang, v.name); close(); toast(`${v.name} is now your ${gender} ${langLabel(lang)} voice.`);
          unlockAudio(); speakWith(SAMPLE[lang][gender], {lang, gender}); onPicked && onPicked();
        }}, current ? "In use" : "Use")));
    });
    card.append(h("h2", null, `Find a ${gender} voice`),
      h("p", {class:"small muted"}, `Tap ▶ to hear each voice on your phone as it really sounds. Tap Use on one that sounds ${gender}.`),
      vs.length ? list : h("p", {class:"small"}, "No voices found for this language yet. Install them first (below)."),
      h("div", {class:"finder-help"},
        h("b", null, `None sound ${gender}?`),
        h("p", {class:"small"}, `Add a ${gender} voice on your ${IS_APPLE ? "iPhone" : "phone"} (free, a few minutes):`),
        h("ol", {class:"howto"}, VOICE_STEPS[IS_APPLE ? "ios" : "android"].short.map(x => h("li", null, x))),
        h("button", {class:"linkish", onclick:phoneSetupGuide}, "Full step-by-step guide (Android and iPhone)")));
  });
}
const SAMPLE = {en:{male:"This is the male voice. Let's make today a strong one.", female:"This is the female voice. Let's make today a strong one.", neutral:"This is the neutral voice."},
  de:{male:"Das ist die männliche Stimme. Lass uns heute stark trainieren.", female:"Das ist die weibliche Stimme. Lass uns heute stark trainieren.", neutral:"Das ist die neutrale Stimme."}};

/* -- natural voice: fetch once per clip, keep on the phone -- */
const VOICE_CACHE = "zahi-fit-voice-v1";
const player = new Audio(); player.preload = "auto";
let speechToken = 0, playerUrl = null;
async function sha(text){
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2,"0")).join("").slice(0,32);
}
const inflight = new Map();   // one download per clip, even if play and prefetch ask at the same time
async function naturalClip(text, translate, patient){
  const payload = {text, lang:voice.lang, voice:voice.gender, translate:!!translate && voice.lang === "de"};
  const id = await sha(JSON.stringify(payload));
  const key = new Request(`${location.origin}${location.pathname.replace(/[^/]*$/, "")}__voice/${id}.mp3`);
  let cache = null;
  try{ cache = await caches.open(VOICE_CACHE); const hit = await cache.match(key); if(hit) return await hit.blob(); }catch{}
  if(!inflight.has(id)){
    inflight.set(id, (async () => {
      // Long instructions (and German, which is translated first) can take 5–15 s to generate the first time.
      const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 35000);
      try{
        const res = await fetch(VOICE_ENDPOINT, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload), signal:ctl.signal});
        if(!res.ok || !/audio/.test(res.headers.get("Content-Type") || "")){
          let info = {}; try{ info = await res.json(); }catch{}
          const err = new Error(info.error || `Voice service error ${res.status}`);
          err.status = res.status; err.upstream = info.status || null; err.detail = String(info.detail || "");
          throw err;
        }
        const blob = await res.blob();
        if(cache){
          cache.put(key, new Response(blob, {headers:{"Content-Type":"audio/mpeg"}})).catch(() => {});
          cache.keys().then(ks => { if(ks.length > 500) ks.slice(0, 100).forEach(k => cache.delete(k)); }).catch(() => {});
        }
        return blob;
      }finally{ clearTimeout(t); inflight.delete(id); }
    })());
  }
  // Short workout cues shouldn't keep you waiting; guide narration waits for the natural voice.
  const wait = patient ? 35000 : 12000;
  return Promise.race([inflight.get(id), new Promise((_, rej) => setTimeout(() => rej(new Error("voice timeout")), wait))]);
}
function prefetchVoice(text, translate, force){
  if(voice.engine !== "natural" || (voice.mode === "off" && !force) || navigator.onLine === false) return Promise.resolve();
  return naturalClip(text, translate, true).catch(() => {});
}
let fellBackNoticed = false;
/* speak(text, {force, onend, translate, onready, patient}) — force plays even when workout voice cues are off. */
function speak(text, {force=false, onend, translate=false, onready, patient=false} = {}){
  if(voice.mode === "off" && !force) return;
  hush();
  const token = ++speechToken;
  // Offline, German instructions can't be translated, so the phone reads the English original in an English voice.
  const fallback = () => { if(token !== speechToken) return; onready && onready(); speakDevice(text, token, onend, voice); };
  if(voice.engine !== "natural"){ fallback(); return; }
  naturalClip(text, translate, patient).then(blob => {
    if(token !== speechToken) return;
    if(playerUrl) URL.revokeObjectURL(playerUrl);
    playerUrl = URL.createObjectURL(blob);
    player.src = playerUrl;
    player.playbackRate = voice.rate / .9;            // 0.9 = normal
    player.preservesPitch = true;
    player.onended = () => { if(token === speechToken && onend) onend(); };
    onready && onready();
    return player.play();
  }).catch(err => {
    console.warn("Natural voice unavailable, using phone voice", err);
    if(token === speechToken && !fellBackNoticed){ fellBackNoticed = true; toast("Using your phone's voice. " + voiceProblem(err)); }
    fallback();
  });
}
function hush(){ speechToken++; try{ player.pause(); }catch{} try{ speechSynthesis.cancel(); }catch{} }

/* ---------- active workout state (same shape as v2.3 for resume) ---------- */
let state = (() => { const s = read(K.active, null); return s && Array.isArray(s.exercises) ? s : null; })();
const persist = () => { if(state) write(K.active, state); };
const reducedDay = () => !!(state && state.adaptation && ["recovery60","reduced"].includes(state.adaptation.mode));
const curEx = () => state && state.exercises[state.exerciseIndex];
function completion(){ let t = 0, d = 0; state.exercises.forEach(ex => ex.sets.forEach(s => { t++; if(s.done || ex.skipped) d++; })); return t ? Math.round(d/t*100) : 0; }
const doneSets = () => state ? state.exercises.reduce((a,ex) => a + ex.sets.filter(s => s.done).length, 0) : 0;

function startWorkout(index, r){
  const w = workouts[index], a = adaptWorkout(w, r);
  state = {
    workoutIndex:index, workoutName:w.name, startTime:Date.now(), exerciseIndex:0,
    readiness:clone(r),
    adaptation:{mode:a.profile.mode, tier:a.profile.tier, label:a.profile.label, message:a.profile.message, targetMinutes:r.time},
    exercises:a.keep.map(ex => ({...ex, skipped:false, rpe:null, sets:Array.from({length:ex.sets}, () => ({w:"", r:"", done:false}))}))
  };
  persist(); applyBalance(true); unlockAudio(); go("workout");
}

/* ---------- rest timer: timestamp based, survives screen-off and reloads ---------- */
let restTick = null, restFlags = {};
function startRest(sec){
  if(!state || !sec) return;
  state.rest = {end:Date.now() + sec*1000, total:sec}; persist();
  restFlags = {}; cue.start();
  if(voice.mode !== "off") speak(phrase().rest(sec));
  paintRest();
}
function adjustRest(d){ if(!state?.rest) return; state.rest.end += d*1000; state.rest.total = Math.max(1, state.rest.total + d); if(state.rest.end - Date.now() > 10000) restFlags.warn = false; persist(); paintRest(); }
function stopRest(){ if(state){ delete state.rest; persist(); } clearInterval(restTick); restTick = null; document.querySelector(".rest")?.remove(); document.body.classList.remove("resting"); }
function paintRest(){
  if(!state?.rest || document.body.dataset.view !== "workout"){ document.querySelector(".rest")?.remove(); document.body.classList.remove("resting"); clearInterval(restTick); restTick = null; return; }
  document.body.classList.add("resting");
  let el = document.querySelector(".rest");
  if(!el){
    el = h("div", {class:"rest", role:"timer", "aria-live":"off"},
      h("div", {class:"inner"},
        h("div", null, h("div", {class:"lbl"}, T("restLbl")), h("div", {class:"time"}, "00:00")),
        h("div", {class:"ctrls"},
          h("button", {"aria-label":"Remove 15 seconds", onclick:() => adjustRest(-15)}, "−15"),
          h("button", {"aria-label":"Add 15 seconds", onclick:() => adjustRest(15)}, "+15"),
          h("button", {class:"skip", onclick:stopRest}, T("skip"))),
        h("div", {class:"track"}, h("i"))));
    document.body.append(el);
  }
  const tick = () => {
    if(!state?.rest){ stopRest(); return; }
    const left = (state.rest.end - Date.now())/1000;
    el.querySelector(".time").textContent = mmss(Math.ceil(left));
    el.querySelector(".track i").style.transform = `scaleX(${Math.max(0, Math.min(1, left/state.rest.total))})`;
    el.classList.toggle("ending", left <= 10);
    if(left <= 10.5 && left > 1 && !restFlags.warn){ restFlags.warn = true; cue.warn(); if(voice.mode !== "off") speak(phrase().ten); }
    if(left <= 0){ cue.end(); if(voice.mode !== "off") speak(phrase().done); stopRest(); }
  };
  tick(); clearInterval(restTick); restTick = setInterval(tick, 250);
}

/* ---------- the bar: a session drawn as a loaded barbell ---------- */
function barbell(exs, {current=-1, compact=false, label, onclick} = {}){
  const plates = exs.map((ex,i) => {
    const done = ex.sets && Array.isArray(ex.sets) && ex.sets.length && ex.sets.every(s => s.done);
    const cls = ["plate", done && "done", ex.skipped && "skipped", i === current && "current"].filter(Boolean).join(" ");
    return h("i", {class:cls, "data-block":ex.block, "data-h":HEIGHT[ex.block] || 2});
  });
  return h(onclick ? "button" : "div", {class:"bar" + (compact ? " compact" : ""), "aria-label":label || `${exs.length} exercises`, onclick, type:onclick ? "button" : null},
    h("i", {class:"sleeve"}), h("span", {class:"plates"}, plates), h("i", {class:"collar"}), h("i", {class:"shaft"}), h("i", {class:"sleeve"}));
}

/* ---------- router ---------- */
let view = "today";
const FOCUS = ["workout","checkin","summary"];
function go(v, arg){
  hush();
  view = v; document.body.dataset.view = v;
  document.body.classList.toggle("focus", FOCUS.includes(v));
  const m = $("#view"); m.replaceChildren();
  ({today:renderToday, checkin:renderCheckin, workout:renderWorkout, summary:renderSummary,
    history:renderHistory, coach:renderCoachTab, profile:renderProfile, food:renderFood})[v](m, arg);
  document.querySelectorAll(".tab").forEach(t => t.setAttribute("aria-current", t.dataset.tab === v ? "page" : "false"));
  window.scrollTo(0, 0);
  paintRest();
}
setInterval(() => { if(state) document.querySelectorAll(".clock").forEach(c => c.textContent = mmss((Date.now() - state.startTime)/1000)); }, 1000);

function topline(title){
  return h("div", {class:"topline"}, h("div", {class:"wordmark"}, title || "Zahi Fit"), null);
}

/* ---------- Today ---------- */
function ring(done, target){
  const r = 42, c = 2*Math.PI*r, gap = target > 1 ? 4 : 0, seg = c/target - gap;
  let arcs = "";
  for(let k=0;k<target;k++) arcs += `<circle cx="50" cy="50" r="${r}" fill="none" stroke-width="10" stroke-linecap="butt" class="${k < done ? "on" : "off"}" stroke-dasharray="${seg.toFixed(2)} ${(c-seg).toFixed(2)}" stroke-dashoffset="${(-k*(seg+gap)).toFixed(2)}" transform="rotate(-90 50 50)"/>`;
  return h("div", {class:"ring", role:"img", "aria-label":`${done} of ${target} sessions in the last 7 days`,
    html:`<svg viewBox="0 0 100 100">${arcs}</svg>`}, h("div", {class:"ring-num"}, h("b", null, `${Math.min(done, 99)}`), h("span", null, `of ${target}`)));
}
function greeting(){ const hr = new Date().getHours(); return hr < 12 ? "Good morning" : hr < 18 ? "Good afternoon" : "Good evening"; }
function renderToday(m){
  const w = workouts[nextIndex], nm = splitName(w.name), week = lastDays(7), hs = getHistory();
  m.append(h("div", {class:"topline"}, h("div", null, h("div", {class:"hello"}, me.name && me.name !== "Me" ? `${greeting()}, ${me.name}` : greeting()), h("div", {class:"wordmark"}, "Zahi Fit")),
    h("button", {class:"avatar", "data-tone":me.tone % 4, "aria-label":`${me.name} — account`, onclick:accountSheet}, initialOf(me))));
  if(!state) m.append(installCard("today"));
  if(state){
    const ex = curEx();
    m.append(h("button", {class:"resume", onclick:() => go("workout")},
      h("i", {class:"pulse"}),
      h("div", null, h("b", null, "Workout in progress"), h("span", null, `${exName(ex.n)} · ${state.exerciseIndex+1} of ${state.exercises.length} · ${completion()}% done`)),
      h("span", {class:"go-arrow"}, "Resume")));
  }
  m.append(h("section", {class:"hero", "data-tone":nextIndex % 4},
    h("div", {class:"spread"}, h("span", {class:"kicker"}, state ? "After this workout" : "Up next"), h("span", {class:"kicker"}, `About ${w.duration} min`)),
    h("div", {class:"hero-row"}, h("div", {class:"letter", "aria-hidden":"true"}, nm.letter), h("div", null, h("h1", null, nm.title), h("div", {class:"focus"}, w.focus))),
    barbell(w.exercises, {compact:true, label:`${w.exercises.length} exercises`}),
    state ? null : h("button", {class:"btn cta block", onclick:() => go("checkin", nextIndex)}, `Start session ${nm.letter}`)));

  // Week
  const strip = h("div", {class:"week"});
  for(let i=6;i>=0;i--){
    const d = new Date(); d.setDate(d.getDate()-i);
    const trained = hs.some(x => new Date(x.date).toDateString() === d.toDateString());
    strip.append(h("span", {class:"day" + (trained ? " trained" : "") + (i === 0 ? " today" : "")}, d.toLocaleDateString(undefined, {weekday:"short"})));
  }
  m.append(h("section", {class:"panel section"},
    h("div", {class:"section-head"}, h("h2", null, "Last 7 days")),
    h("div", {class:"week-top"}, ring(week.length, plan.days),
      h("div", {class:"week-stats"},
        h("div", null, h("b", null, week.reduce((a,b) => a + (b.minutes||0), 0)), h("span", null, "minutes trained")),
        h("div", null, h("b", null, streak(hs)), h("span", null, "day streak")),
        h("div", null, h("b", null, week.reduce((a,r) => a + (r.details||[]).reduce((x,d) => x + (d.done||[]).filter(Boolean).length, 0), 0)), h("span", null, "sets logged")))),
    strip));

  m.append(foodTodayCard());
  // Programme tiles
  m.append(h("section", {class:"section"},
    h("div", {class:"section-head"}, h("h2", null, `Your ${plan.days}-day plan`), h("button", {class:"btn ghost sm", onclick:() => go("profile")}, "Edit plan")),
    h("p", {class:"muted small"}, [GOALS[plan.primary], ...plan.secondary.map(x => GOALS[x])].join(", ") + ` · ${plan.duration} min · ${EQUIPMENT[plan.equipment]}`),
    h("div", {class:"tiles"}, workouts.map((x,i) => {
      const n = splitName(x.name);
      return h("button", {class:"tile" + (i === nextIndex ? " is-next" : ""), "data-tone":i % 4, onclick:() => state ? toast("Finish or discard the current workout first.") : go("checkin", i)},
        h("span", {class:"l"}, n.letter), h("b", null, n.title), h("span", null, i === nextIndex ? "Next up" : `${x.exercises.length} exercises`));
    }))));
}

/* ---------- Check-in ---------- */
function renderCheckin(m, index){
  if(index == null) index = nextIndex;
  const w = workouts[index], nm = splitName(w.name);
  const r = {energy:null, soreness:null, time:plan.duration};
  const preview = h("div", {class:"preview"});
  const start = h("button", {class:"btn primary block", disabled:true, onclick:() => startWorkout(index, r)}, "Start workout");
  const paint = () => {
    preview.replaceChildren();
    start.disabled = !(r.energy && r.soreness && r.time);
    if(start.disabled){ preview.append(h("p", {class:"muted small"}, "Answer both questions to see today's version of the session.")); return; }
    const a = adaptWorkout(w, r), kept = new Set(a.keep.map(x => x.n));
    const ul = h("ul", {class:"kept"});
    a.all.forEach(x => {
      const k = a.keep.find(y => y.n === x.n);
      ul.append(h("li", {class:kept.has(x.n) ? "" : "cut", "data-block":x.block}, h("i", {class:"sw"}), exName(x.n), h("em", null, k ? `${k.sets} × ${repsText(k.reps)}` : "dropped")));
    });
    preview.append(h("div", {class:"panel"}, h("div", {class:"mode"}, a.profile.label), h("p", {class:"muted small"}, a.profile.message), ul));
  };
  const scale = (key, vals, labels, three) => {
    const g = h("div", {class:"scale" + (three ? " three" : ""), role:"group"});
    vals.forEach((v,i) => {
      const b = h("button", {"aria-pressed":String(r[key] === v), onclick:() => { r[key] = v; g.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b))); paint(); }},
        three ? v : v, labels[i] ? h("small", null, labels[i]) : null);
      g.append(b);
    });
    return g;
  };
  m.append(
    h("div", {class:"spread topline"}, h("button", {class:"icon-btn plain", "aria-label":"Back", onclick:() => go("today")}, "←"), h("span", {class:"muted small"}, "Check-in"), h("span", {class:"icon-btn plain"})),
    h("h1", null, `${nm.letter} · ${nm.title}`),
    h("p", {class:"muted"}, "Three quick answers. The session adapts to how you feel today."),
    h("div", {class:"q"}, h("label", null, "Energy"), scale("energy", [1,2,3,4,5], ["Flat","","","","Great"])),
    h("div", {class:"q"}, h("label", null, "Soreness"), scale("soreness", [1,2,3,4,5], ["Fresh","","","","Very"])),
    h("div", {class:"q"}, h("label", null, "Time available"), scale("time", [45,60,75,90], ["min","min","min","min"], true)),
    preview,
    h("div", {class:"section"}, start));
  paint();
}

/* ---------- Workout (focus mode) ---------- */
let wk = null; // live references for partial repaint
function prefetchWorkoutVoice(){
  if(!state) return;
  const p = phrase();
  [p.ten, p.done, ...(voice.mode === "full" ? [p.good] : []), ...new Set(state.exercises.map(e => e.rest).filter(Boolean).map(p.rest))]
    .forEach((t, k) => setTimeout(() => prefetchVoice(t), 400 * k));
}
function renderWorkout(m){
  if(!state){ go("today"); return; }
  prefetchWorkoutVoice();
  const nm = splitName(state.workoutName);
  const barSlot = h("div");
  const body = h("div");
  const next = h("button", {class:"btn primary", onclick:nextOrFinish});
  const prev = h("button", {class:"icon-btn", "aria-label":"Previous exercise", onclick:() => move(-1)}, "‹");
  wk = {barSlot, body, next, prev};
  m.append(
    h("div", {class:"wk-top"},
      h("div", {class:"spread"},
        h("button", {class:"icon-btn plain", "aria-label":"Minimise workout", onclick:() => go("today")}, "⌄"),
        h("div", {class:"wk-title"}, h("div", {class:"clock"}, mmss((Date.now()-state.startTime)/1000)), `${nm.letter} · ${nm.title}`),
        h("button", {class:"icon-btn plain", "aria-label":"Workout options", onclick:workoutMenu}, "⋯")),
      barSlot),
    ...(state.adaptation && (state.adaptation.mode !== "full" || state.adaptation.tier === "push")
      ? [h("button", {class:"adapt-pill", onclick:() => toast(adaptText(state.adaptation).message)}, adaptText(state.adaptation).label)] : []),
    body,
    h("nav", {class:"actionbar", "aria-label":"Workout controls"},
      h("div", {class:"inner"}, prev, next,
        h("button", {class:"icon-btn coach-dot", "aria-label":"Ask your coach", onclick:() => openCoachOverlay()}, "✦"))));
  paintExercise();
}
function paintBar(){
  if(!wk) return;
  wk.barSlot.replaceChildren(barbell(state.exercises, {current:state.exerciseIndex, label:`Exercise ${state.exerciseIndex+1} of ${state.exercises.length}. Show all exercises`, onclick:exerciseList}));
}
function paintNav(){
  const i = state.exerciseIndex, last = i === state.exercises.length - 1;
  wk.prev.disabled = i === 0;
  wk.next.className = "btn " + (last ? "go" : "primary");
  wk.next.textContent = last ? T("finish") : `${T("next")}: ${exName(state.exercises[i+1].n)}`;
}
function move(d){
  state.exerciseIndex = Math.max(0, Math.min(state.exercises.length-1, state.exerciseIndex + d));
  persist(); paintExercise(); window.scrollTo({top:0});
}
function nextOrFinish(){ if(state.exerciseIndex < state.exercises.length-1) move(1); else finishFlow(); }

function paintExercise(){
  const ex = curEx(), prev = previousFor(ex.n), type = trackingType(ex), b = wk.body;
  paintBar(); paintNav(); b.replaceChildren();
  const restTxt = ex.rest ? (ex.rest >= 60 ? `${Math.floor(ex.rest/60)}:${String(ex.rest%60).padStart(2,"0")}` : `${ex.rest}s`) : null;
  b.append(h("header", {class:"ex-head"},
    h("div", {class:"spread"}, h("span", {class:"tag", "data-block":ex.block}, blockName(ex.block)), h("span", {class:"ex-count"}, `${state.exerciseIndex+1} ${T("of")} ${state.exercises.length}`)),
    h("h2", {class:"ex-name"}, exName(ex.n)),
    h("div", {class:"target"}, h("b", null, `${ex.sets.length} × ${repsText(ex.reps)}`), restTxt ? ` · ${T("rest")} ${restTxt}` : ` · ${T("continuous")}`),
    ex.substitutedFor ? h("div", {class:"subbed"}, `${T("replacing")} ${exName(ex.substitutedFor)}`) : null));

  if(ex.skipped){
    b.append(h("div", {class:"panel flat section"}, h("p", {class:"muted"}, T("skipped")),
      h("button", {class:"btn block", onclick:() => { ex.skipped = false; persist(); paintExercise(); }}, T("include"))));
    return;
  }

  const last = prevLine(ex, prev), tgt = todayTarget(ex);
  const loadType = ["loadReps","carry"].includes(type);
  b.append(h("div", {class:"advice", "data-block":ex.block},
    h("div", {class:"today-target"}, h("span", {class:"tt-label"}, isDE() ? "Heute" : "Today"), h("b", null, tgt.text)),
    tgt.why ? h("span", {class:"why"}, tgt.why) : null,
    type === "repsTime" ? h("span", {class:"why"}, suggestion(ex, prev, reducedDay())) : null,
    ex.balance ? h("span", {class:"superset"}, isDE() ? "Ausgleich: automatisch hinzugefügt, weil das Essen heute über dem Ziel liegt. Lockeres, gleichmäßiges Tempo." : "Balance: added automatically because today's food is over target. Easy, steady pace — you can still talk.") : null,
    ex.supersetWith ? h("span", {class:"superset"}, isDE() ? `Supersatz: direkt weiter mit ${exName(ex.supersetWith)}, dann pausieren.` : `Superset: go straight to ${exName(ex.supersetWith)}, then rest.`) : null,
    last ? h("span", {class:"last"}, last) : null));
  const vid = videoFor(ex);
  const thumb = h("span", {class:"launch-thumb", "aria-hidden":"true"}, vid ? h("img", {src:ytThumb(vid), alt:"", loading:"lazy"}) : null, h("span", {class:"play"}, "▶"));
  thumb.querySelector("img")?.addEventListener("error", e => e.target.remove());
  b.append(h("button", {class:"guide-launch", onclick:() => openGuide(ex)}, thumb,
    h("div", null, h("b", null, T("howTo")), h("span", null, T("howToSub")))));

  // Set logger
  const simple = ["repsTime","bwReps","hold","bwCond"].includes(type);
  const cols = type === "repsTime" ? ["", ex.block === "Flexibility" ? T("timeSide") : T("repsTime"), T("done")]
    : type === "bwReps" ? ["", T("reps"), T("done")]
    : type === "hold" ? ["", T("time"), T("done")]
    : type === "bwCond" ? ["", T("rounds"), T("done")]
    : type === "bike" ? ["", T("resistance"), T("time"), T("done")]
    : type === "stair" ? ["", T("level"), T("time"), T("done")]
    : type === "conditioning" ? ["", T("loadLevel"), T("rounds"), T("done")]
    : type === "carry" ? ["", T("kg"), T("distance"), T("done")] : ["", T("kg"), T("reps"), T("done")];
  const list = h("div", {class:"sets"});
  const current = ex.sets.findIndex(s => !s.done);
  const step = ["bike","stair","conditioning"].includes(type) ? 1 : 2.5;
  ex.sets.forEach((s,i) => {
    const p = prev && prev.sets && prev.sets[i] && !(prev.done && prev.done[i] === false) ? prev.sets[i] : null;
    const phW = tgt.w || (p && p.w ? p.w : (type === "loadReps" || type === "carry" ? "kg" : "–"));
    const phR = p && p.r ? p.r : repsText(ex.reps);
    const rIn = h("input", {inputmode:type === "bwReps" ? "numeric" : simple || type==="conditioning" || type==="bike" || type==="stair" ? "text" : "numeric", value:s.r, placeholder:phR, "aria-label":`Set ${i+1} ${cols[simple?1:2]}`, maxlength:"40"});
    rIn.addEventListener("input", () => { s.r = rIn.value.slice(0,40); persist(); });
    if((simple && type !== "bwReps") || String(phR).length > 6) rIn.classList.add("txt");
    const tick = h("button", {class:"tick", "aria-pressed":String(!!s.done), "aria-label":`Mark set ${i+1} ${s.done ? "not done" : "done"}`}, "✓");
    let wIn = null;
    const row = h("div", {class:"set" + (simple ? " simple" : "") + (s.done ? " done" : "") + (i === current ? " current" : "")}, h("span", {class:"n"}, i+1));
    if(!simple){
      wIn = h("input", {inputmode:"decimal", value:s.w, placeholder:phW, "aria-label":`Set ${i+1} ${cols[1]}`, maxlength:"12"});
      wIn.addEventListener("input", () => { s.w = wIn.value.slice(0,12); persist(); });
      const bump = d => { const base = num(wIn.value) ?? num(tgt.w) ?? num(p && p.w) ?? 0; wIn.value = fmtKg(Math.max(0, base + d)); s.w = wIn.value; persist(); };
      row.append(h("div", {class:"load"},
        h("button", {"aria-label":`Decrease by ${step}`, onclick:() => bump(-step)}, "−"), wIn,
        h("button", {"aria-label":`Increase by ${step}`, onclick:() => bump(step)}, "+")));
    }
    row.append(h("div", {class:"field"}, rIn), tick);
    tick.addEventListener("click", () => {
      if(!s.done){
        // One tap repeats last time: blanks take the placeholder values from the previous session.
        if(wIn && !s.w && (tgt.w || (p && p.w))) s.w = tgt.w || p.w;
        if(!s.r){ if(p && p.r) s.r = p.r; else if(/^\d+$/.test(String(ex.reps).trim())) s.r = String(ex.reps).trim(); }
        s.done = true;
        const n = ex.sets[i+1];
        if(n && !n.done){ if(!n.w && s.w) n.w = s.w; if(!n.r && s.r) n.r = s.r; }
        persist();
        if(ex.supersetWith && ex.sets.some(q => !q.done)) toast(isDE() ? `Jetzt: ${exName(ex.supersetWith)}` : `Now: ${exName(ex.supersetWith)}`);
        if(ex.rest > 0) startRest(ex.rest);
        else if(voice.mode === "full") speak(phrase().good);
      }else{ s.done = false; persist(); }
      paintExercise();
    });
    list.append(row);
  });
  b.append(h("div", {class:"colhead" + (simple ? " simple" : "")}, cols.map(c => h("span", null, c))), list);
  b.lastChild.previousSibling.classList.add("section");
  if(ex.sets.length < 12) b.append(h("button", {class:"btn ghost sm", onclick:() => { const l = ex.sets[ex.sets.length-1]; ex.sets.push({w:l?.w||"", r:"", done:false}); persist(); paintExercise(); }}, T("addSet")));

  // Effort
  if(type !== "repsTime"){
    const labels = ex.block === "Conditioning" ? [[T("easy"),6],[T("steady"),7],[T("hard"),8],[T("veryHard"),9]] : [[T("easy"),6],[T("good"),7],[T("hard"),8],[T("veryHard"),9]];
    const seg = h("div", {class:"seg", role:"group", "aria-label":"How hard was it"});
    labels.forEach(([t,v]) => seg.append(h("button", {"aria-pressed":String(ex.rpe === v), onclick:() => { ex.rpe = ex.rpe === v ? null : v; persist(); paintExercise(); }}, t, h("small", null, `RPE ${v}`))));
    b.append(h("div", {class:"effort"}, h("div", {class:"small"}, h("b", null, T("howHard")), h("span", {class:"muted"}, T("howHardSub"))), seg));
  }

  // Technique, on demand
  b.append(h("details", {class:"tech"},
    h("summary", null, T("technique")),
    h("p", {class:"cue"}, exCue(ex)),
    h("h4", null, T("doIt")), h("ul", null, exHow(ex).map(x => h("li", null, x))),
    h("h4", null, T("avoid")), h("ul", null, exMistakes(ex).map(x => h("li", null, x))),
    h("div", {class:"btn-row"},
      h("button", {class:"btn sm", onclick:() => openGuide(ex)}, T("stepGuide")),
      h("button", {class:"btn sm", onclick:() => openGuide(ex, true)}, T("talk")))));
}

function exerciseList(){
  sheet((card, close) => {
    card.append(h("h2", null, T("exercises")), h("p", {class:"muted small"}, `${completion()}% ${T("setsDone")}`));
    const l = h("div", {class:"sheet-list"});
    state.exercises.forEach((ex,i) => {
      const d = ex.sets.filter(s => s.done).length;
      l.append(h("button", {"data-block":ex.block, onclick:() => { close(); state.exerciseIndex = i; persist(); paintExercise(); window.scrollTo({top:0}); }},
        h("i", {class:"sw"}), h("div", {class:i === state.exerciseIndex ? "cur" : ""}, exName(ex.n), h("span", null, blockName(ex.block))),
        h("span", {class:"state"}, ex.skipped ? T("skippedState") : d === ex.sets.length ? T("doneState") : `${d}/${ex.sets.length}`)));
    });
    card.append(l);
  });
}

function workoutMenu(){
  const ex = curEx();
  sheet((card, close) => {
    card.append(h("h2", null, "Workout options"), h("div", {class:"sheet-list"},
      h("button", {onclick:() => { close(); substituteFlow(); }}, h("div", null, "Swap this exercise", h("span", null, "Same training purpose, different movement"))),
      h("button", {onclick:() => { close(); ex.skipped = !ex.skipped; persist(); paintExercise(); }}, ex.skipped ? "Include this exercise" : "Skip this exercise"),
      h("button", {onclick:() => { close(); finishFlow(); }}, "Finish and save workout"),
      h("button", {onclick:async () => { try{ await navigator.clipboard.writeText(JSON.stringify(coachContext(), null, 2)); toast("Coach context copied."); }catch{ toast("Couldn't copy on this device."); } close(); }}, "Copy coach context"),
      h("button", {class:"warn", onclick:async () => { close(); if(await ask("Discard workout?", "Nothing from this session will be saved or used for progression.", "Discard", true)){ stopRest(); state = null; localStorage.removeItem(K.active); go("today"); toast("Workout discarded."); } }}, "Discard workout")));
  });
}

function substituteFlow(){
  const ex = curEx();
  const reasons = ["Equipment unavailable","Pain or discomfort","Too difficult today","Too easy","Prefer another movement"];
  sheet((card, close) => {
    card.append(h("h2", null, `Swap ${ex.n}`), h("p", {class:"muted small"}, "Why are you swapping? This shapes the options."));
    const l = h("div", {class:"sheet-list"});
    reasons.forEach(r => l.append(h("button", {onclick:() => { close(); alternatives(r); }}, r)));
    card.append(l);
  });
}
function alternatives(reason){
  const ex = curEx();
  const allowed = new Set(Object.values(POOLS[plan.equipment] || POOLS.gym).flat());
  const pool = library().filter(x => x.n !== ex.n && !state.exercises.some(y => y.n === x.n) && allowed.has(x.n));
  const same = ["Strength","Hypertrophy"].includes(ex.block) ? pool.filter(x => ["Strength","Hypertrophy"].includes(x.block)) : pool.filter(x => x.block === ex.block);
  const seen = new Set();
  // Same movement pattern first (e.g. push for push), then the exercise's listed swaps, then same training type.
  const eqPools = POOLS[plan.equipment] || POOLS.gym;
  const peers = Object.values(eqPools).filter(list => list.includes(ex.n)).flat().map(findEx).filter(x => x && x.n !== ex.n && !state.exercises.some(y => y.n === x.n));
  const subs = (ex.subs||[]).map(findEx).filter(x => x && allowed.has(x.n) && !state.exercises.some(y => y.n === x.n));
  const REGIONS = [["pushH","pushV","pullH","pullV"], ["squat","hinge","lunge","glute","ham"], ["core","durability"], ["power","interval","steady","circuit"],
    ["mobLower","mobUpper"], ["flexLower","flexUpper"]];
  const myKeys = Object.keys(eqPools).filter(k => eqPools[k].includes(ex.n));
  const region = REGIONS.find(g => g.some(k => myKeys.includes(k)));
  const nearby = region ? region.flatMap(k => eqPools[k] || []).map(findEx).filter(x => x && x.n !== ex.n && !state.exercises.some(y => y.n === x.n)) : same;
  const opts = [...peers, ...subs, ...nearby].filter(x => !seen.has(x.n) && seen.add(x.n)).slice(0,6);
  sheet((card, close) => {
    card.append(h("h2", null, "Pick a swap"), h("p", {class:"muted small"}, reason === "Pain or discomfort" ? "If the pain is sharp, stop this movement and get it assessed rather than pushing through." : "These keep today's training purpose."));
    const l = h("div", {class:"sheet-list"});
    if(!opts.length) card.append(h("p", {class:"small muted"}, "Every similar exercise for your equipment is already in today's session. Ask the coach for another option."));
    opts.forEach(src => l.append(h("button", {"data-block":src.block, onclick:() => {
      const doneOld = ex.sets.filter(s => s.done), left = Math.max(1, ex.sets.length - doneOld.length);
      const repl = {...clone(src), substitutedFor:ex.substitutedFor || ex.n, substitutionReason:reason, skipped:false, rpe:null,
        sets:Array.from({length:Math.min(src.sets, left)}, () => ({w:"", r:"", done:false}))};
      if(doneOld.length){
        // Keep what was already lifted under the original exercise, then continue with the swap.
        state.exercises.splice(state.exerciseIndex, 1, {...ex, sets:doneOld}, repl);
        state.exerciseIndex++;
      }else state.exercises[state.exerciseIndex] = repl;
      persist(); close(); paintExercise(); toast(`Swapped to ${src.n}.`);
    }}, h("i", {class:"sw"}), h("div", null, exName(src.n), h("span", null, blockName(src.block))))));
    l.append(h("button", {onclick:() => { close(); openCoachOverlay(`Recommend a substitute for ${ex.n} that keeps the same training purpose. Reason: ${reason}.`); }},
      h("div", null, "Ask the coach instead", h("span", null, "Get a suggestion that fits your situation"))));
    card.append(l);
  });
}

async function finishFlow(){
  if(!state) return;
  if(doneSets() === 0){
    if(await ask("Nothing logged yet", "No sets are ticked, so there's nothing to save. Discard this workout instead?", "Discard", true)){ stopRest(); state = null; localStorage.removeItem(K.active); go("today"); }
    return;
  }
  const open = state.exercises.filter(e => !e.skipped && e.sets.some(s => !s.done)).length;
  if(!(await ask("Finish workout?", open ? `${open} exercise${open>1?"s have":" has"} unticked sets. Only ticked sets are saved.` : "Everything's ticked. Nice work.", "Finish and save"))) return;
  stopRest();
  const hist = getHistory();
  const details = state.exercises.map(ex => ({exercise:ex.n, block:ex.block, sets:ex.sets.map(s => ({w:s.w, r:s.r})), done:ex.sets.map(s => !!s.done), skipped:!!ex.skipped, rpe:ex.rpe,
    ...(ex.substitutedFor ? {substitutedFor:ex.substitutedFor} : {})}));
  // Personal bests: heaviest ticked load vs. every earlier session
  const bests = [];
  details.forEach(d => {
    if(trackingType({block:d.block, n:d.exercise}) !== "loadReps") return;
    const top = Math.max(...d.sets.filter((s,i) => d.done[i]).map(s => num(s.w) ?? 0), 0);
    if(!top) return;
    let before = 0, seen = false;
    hist.forEach(r => (r.details||[]).forEach(x => { if(x.exercise === d.exercise){ seen = true; x.sets.forEach((s,i) => { if(!x.done || x.done[i] !== false) before = Math.max(before, num(s.w) ?? 0); }); } }));
    if(seen && top > before) bests.push(d.exercise);
  });
  const rec = {date:new Date().toISOString(), workout:state.workoutName, minutes:Math.max(1, Math.round((Date.now()-state.startTime)/60000)), readiness:state.readiness, adaptation:state.adaptation?.label, details};
  hist.unshift(rec); setHistory(hist);
  nextIndex = (state.workoutIndex + 1) % workouts.length; localStorage.setItem(K.next, String(nextIndex));
  state = null; localStorage.removeItem(K.active);
  go("summary", {rec, bests});
}

/* ---------- Summary ---------- */
function renderSummary(m, arg){
  if(!arg){ go("today"); return; }
  const {rec, bests} = arg, nm = splitName(rec.workout);
  const sets = rec.details.reduce((a,d) => a + d.done.filter(Boolean).length, 0);
  const ul = h("ul", {class:"recap"});
  rec.details.filter(d => !d.skipped && d.done.some(Boolean)).forEach(d => {
    const t = trackingType({block:d.block, n:d.exercise});
    const line = d.sets.filter((s,i) => d.done[i]).map(s => t === "loadReps" ? `${s.w||"–"}×${s.r||"–"}` : [s.w, s.r].filter(Boolean).join(" · ") || "✓").join("   ");
    ul.append(h("li", null, h("div", {class:"spread"}, h("b", null, d.exercise, bests.includes(d.exercise) ? h("span", {class:"best"}, "New best") : null), d.rpe ? h("span", {class:"muted small"}, `RPE ${d.rpe}`) : null),
      h("div", {class:"sets-line"}, line)));
  });
  m.append(
    h("div", {class:"done-hero"}, h("div", {class:"letter", "aria-hidden":"true"}, nm.letter), h("h1", null, "Session done"), h("p", null, nm.title)),
    h("div", {class:"stats section"},
      h("div", {class:"stat"}, h("b", null, rec.minutes), h("span", null, "min")),
      h("div", {class:"stat"}, h("b", null, sets), h("span", null, sets === 1 ? "set" : "sets")),
      h("div", {class:"stat"}, h("b", null, volumeOf(rec.details).toLocaleString()), h("span", null, "kg lifted"))),
    h("section", {class:"section"}, h("div", {class:"section-head"}, h("h2", null, "What you did")), ul),
    h("div", {class:"section"}, h("button", {class:"btn primary block", onclick:() => go("today")}, "Done"),
      h("button", {class:"btn coach block section", onclick:() => { go("coach"); sendCoach("Review the workout I just finished. What went well and what should I adjust next time?"); }}, "Ask the coach to review it")));
}

/* ---------- History ---------- */
function renderHistory(m){
  const hs = getHistory();
  m.append(topline("History"));
  if(!hs.length){
    m.append(h("div", {class:"empty"}, h("h2", null, "No sessions yet"), h("p", null, "Finished workouts land here with every set you logged."),
      h("button", {class:"btn primary", onclick:() => go("today")}, "Go to today's session")));
    return;
  }
  const now = new Date(), startOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const groupOf = d => { const days = (startOfDay(now) - startOfDay(d)) / 86400000; if(days < 7) return "Last 7 days"; if(days < 14) return "The week before"; return d.toLocaleDateString(undefined, {month:"long", year:"numeric"}); };
  let group = null, box = null;
  hs.forEach((x, idx) => {
    const d = new Date(x.date), g = groupOf(d);
    if(g !== group){ group = g; box = h("div", {class:"hist-list"}); m.append(h("section", {class:"hist-group"}, h("h3", null, g), box)); }
    const nm = splitName(x.workout), details = x.details || [];
    const sets = details.reduce((a,e) => a + (e.done ? e.done.filter(Boolean).length : 0), 0), vol = volumeOf(details);
    const item = h("div", {class:"hist"});
    const detail = h("div", {class:"hist-detail hidden"});
    item.append(h("button", {"aria-expanded":"false", onclick:e => {
      const open = detail.classList.toggle("hidden") === false; item.classList.toggle("open", open); e.currentTarget.setAttribute("aria-expanded", String(open));
    }}, h("span", {class:"l"}, nm.letter), h("div", null, h("b", null, nm.title),
        h("span", null, `${d.toLocaleDateString(undefined, {weekday:"short", day:"numeric", month:"short"})} · ${x.minutes} min · ${sets} set${sets === 1 ? "" : "s"}${vol ? ` · ${vol.toLocaleString()} kg` : ""}`)),
      h("span", {class:"chev", "aria-hidden":"true"}, "›")), detail);
    details.filter(e => !e.skipped && (!e.done || e.done.some(Boolean))).forEach(e => {
      const t = trackingType({block:e.block, n:e.exercise});
      const line = (e.sets||[]).filter((s,i) => !e.done || e.done[i]).map(s => t === "loadReps" ? `${s.w||"–"}×${s.r||"–"}` : [s.w, s.r].filter(Boolean).join(" · ") || "✓").join("   ");
      detail.append(h("div", {class:"ex", "data-block":e.block}, e.exercise, e.rpe ? h("span", null, `${line} · RPE ${e.rpe}`) : h("span", null, line)));
    });
    if(x.readiness) detail.append(h("p", {class:"tiny muted"}, `Check-in: energy ${x.readiness.energy}/5, soreness ${x.readiness.soreness}/5, ${x.readiness.time} min${x.adaptation ? ` · ${x.adaptation}` : ""}`));
    detail.append(h("button", {class:"btn danger sm", onclick:async () => {
      if(!(await ask("Delete this session?", "It will be removed from history and from load suggestions.", "Delete", true))) return;
      const all = getHistory(); all.splice(idx, 1); setHistory(all); go("history"); toast("Session deleted.");
    }}, "Delete session"));
    box.append(item);
  });
}

/* ---------- Coach (embedded AI PT via the Cloudflare Worker) ---------- */
let chat = (() => { const x = read(K.chat, []); return Array.isArray(x) ? x.slice(-20) : []; })();
let coachBusy = false, coachPaint = null;
function coachContext(){
  const ex = curEx();
  return {
    app:`Zahi Fit v${VERSION}`,
    athleteName: me.name && me.name !== "Me" ? me.name : null,
    profile:{trainingDays:plan.days, primaryGoal:GOALS[plan.primary], secondaryGoals:plan.secondary.map(x => GOALS[x]), preferredDuration:plan.duration, equipment:plan.equipment === "bodyweight" ? "Bodyweight only (no gym equipment)" : "Full gym"},
    nutrition: foodContextBrief(),
    personalProfile: personal ? {sex:personal.sex, ageBracket:personal.ageBracket, experience:EXPERIENCE[personal.experience], bodyweightKg:personal.bodyweight,
      focusArea:FOCUS_AREAS[focusOf()] , goEasyOn:personal.areas.map(a => BODY_AREAS[a]), programmingGuidance:ageGuidance(personal.ageBracket),
      instruction:"Use sex only where physiologically relevant. Do not stereotype exercise capability. Tailor recovery, progression and movement options to age bracket, readiness, goals and actual performance."} : {sex:null, ageBracket:null},
    readiness: state ? {...state.readiness, tier:state.adaptation && state.adaptation.tier} : null,
    todayTarget: state && curEx() ? todayTarget(curEx()) : null,
    adaptation: state ? state.adaptation : null,
    workout: state ? state.workoutName : (workouts[nextIndex] || {}).name,
    progressPercent: state ? completion() : 0,
    currentExercise: ex ? {name:ex.n, block:ex.block, target:ex.reps, restSeconds:ex.rest, rpe:ex.rpe, sets:ex.sets} : null,
    remainingExercises: state ? state.exercises.slice(state.exerciseIndex+1).map(e => `${e.n} (${e.sets.length}×${e.reps})`) : null,
    recentHistory: getHistory().slice(0,5),
    voiceCoach:{mode:voice.mode, language:voice.lang},
    ptConversation: chat.slice(-6)
  };
}
function richText(text){
  // Minimal, safe markdown: paragraphs, "- " / "1. " lists, **bold**.
  const frag = document.createDocumentFragment();
  const inline = (el, t) => t.split(/(\*\*[^*]+\*\*)/g).forEach(part => el.append(/^\*\*[^*]+\*\*$/.test(part) ? h("b", null, part.slice(2,-2)) : part));
  let ul = null;
  String(text).split(/\n/).forEach(line => {
    const li = line.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
    if(li){ if(!ul){ ul = h("ul"); frag.append(ul); } const e = h("li"); inline(e, li[1]); ul.append(e); return; }
    ul = null;
    if(!line.trim()) return;
    const p = h("p"); inline(p, line.replace(/^#+\s*/, "")); frag.append(p);
  });
  return frag;
}
async function sendCoach(q){
  q = String(q||"").trim(); if(!q || coachBusy) return;
  coachBusy = true;
  chat.push({role:"user", text:q, at:new Date().toISOString()});
  coachPaint && coachPaint();
  try{
    const res = await fetch(PT_ENDPOINT, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({question:q, context:coachContext()})});
    let data = {}; try{ data = await res.json(); }catch{}
    if(!res.ok || !data.answer) throw new Error(data.error || `HTTP ${res.status}`);
    chat.push({role:"assistant", text:String(data.answer).trim(), at:new Date().toISOString()});
  }catch(err){
    console.error("Coach request failed", err);
    chat.push({role:"error", text:navigator.onLine === false ? "You're offline. Your question is kept here — send it again once you have signal." : "The coach service didn't respond. Check your connection and try again. Your workout is unchanged.", at:new Date().toISOString()});
  }finally{
    coachBusy = false;
    chat = chat.slice(-20); write(K.chat, chat.filter(x => x.role !== "error"));
    coachPaint && coachPaint();
  }
}
function coachPanel(host, {overlay=false, seed} = {}){
  const thread = h("div", {class:"chat", "aria-live":"polite"});
  const input = h("input", {placeholder:state ? `Ask about ${curEx().n}…` : "Ask your coach…", maxlength:"400", enterkeyhint:"send", "aria-label":"Message"});
  const send = () => { const v = input.value; input.value = ""; sendCoach(v); };
  input.addEventListener("keydown", e => { if(e.key === "Enter"){ e.preventDefault(); send(); } });
  const ex = curEx();
  const ctx = h("div", {class:"ctx"}, state
    ? [h("span", null, ex.n), h("span", null, `Session ${splitName(state.workoutName).letter}`), h("span", null, `Energy ${state.readiness.energy} · Soreness ${state.readiness.soreness}`)]
    : [h("span", null, `${plan.days} days/week`), h("span", null, GOALS[plan.primary]), personal ? h("span", null, personal.ageBracket) : null]);
  const quick = state
    ? ["Should I go heavier or lighter?", "Check my form cues", "I'm short on time — trim the rest", "This feels too hard today", "Suggest a swap for this exercise"]
    : ["How is my training going?", "What should I focus on this week?", "I slept badly — adjust today", "Explain my plan"];
  const chips = h("div", {class:"chips"}, quick.map(q => h("button", {class:"chip", onclick:() => sendCoach(q)}, q)));
  coachPaint = () => {
    thread.replaceChildren();
    if(!chat.length) thread.append(h("p", {class:"muted small"}, "Your coach sees your plan, today's check-in, the exercise you're on and your last five sessions. Ask anything."));
    chat.forEach(m => {
      if(m.role === "user") thread.append(h("div", {class:"msg me"}, m.text));
      else thread.append(h("div", {class:"msg pt" + (m.role === "error" ? " err" : "")}, richText(m.text)));
    });
    if(coachBusy) thread.append(h("div", {class:"msg pt thinking"}, "Looking at your session…"));
    const sc = overlay ? host.closest(".overlay") : document.scrollingElement;
    requestAnimationFrame(() => sc && sc.scrollTo({top:sc.scrollHeight, behavior:"smooth"}));
  };
  host.append(ctx, thread, chips, h("div", {class:"composer"}, input, h("button", {"aria-label":"Send", onclick:send}, "↑")));
  if(chat.length) host.append(h("button", {class:"btn ghost sm", onclick:async () => { if(await ask("Clear conversation?", "The coach will stop seeing these earlier messages.", "Clear", true)){ chat = []; write(K.chat, []); coachPaint(); } }}, "Clear conversation"));
  coachPaint();
  if(seed) sendCoach(seed);
}
function renderCoachTab(m){ m.append(topline("Coach")); coachPanel(m); }
function openCoachOverlay(seed){
  const inner = h("div", {class:"app"});
  const ov = h("div", {class:"overlay", role:"dialog", "aria-modal":"true", "aria-label":"Coach"}, inner);
  inner.append(h("div", {class:"ov-top"}, h("button", {class:"icon-btn plain", "aria-label":"Back to workout", onclick:() => { ov.remove(); coachPaint = null; }}, "←"),
    h("div", {class:"t"}, h("b", null, "Coach"), h("span", null, "Your workout keeps running"))));
  coachPanel(inner, {overlay:true, seed});
  document.body.append(ov);
}

/* ---------- Technique guide: YouTube demo + visual step-by-step ---------- */
const familyOf = ex => FAMILY[ex.n] || "circuit";
const videoPicks = () => read(K.videoPick, {}) || {};
function videoFor(ex){ const own = videoPicks()[ex.n]; return own || (typeof VIDEOS !== "undefined" ? VIDEOS[ex.n] : null) || null; }
function ytId(text){
  const m = String(text || "").trim().match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/) || String(text || "").trim().match(/^([\w-]{11})$/);
  return m ? m[1] : null;
}
const ytWatch = id => `https://www.youtube.com/watch?v=${id}`;
const ytSearch = ex => `https://www.youtube.com/results?search_query=${encodeURIComponent((typeof VIDEO_SEARCH !== "undefined" && VIDEO_SEARCH[ex.n]) || `${ex.n} exercise how to proper form`)}`;
const ytThumb = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
/* A simple picture for each step, chosen from what the step asks you to do. */
const STEP_ICONS = [
  [/^(set|setup|start|lie|kneel|choose|arrange|rack|pick up|step on|stand on|take a wide stance|position|place|make an|unlock|forearms down)/i, "📍"],
  [/track the knee/i, "🦵"],
  [/breath|exhale/i, "🌬️"],
  [/feel|tension|bias|load the|touch/i, "🎯"],
  [/rotat|\bturn|twist/i, "🔄"],
  [/pull|row\b|elbow|initiate with the back/i, "↩️"],
  [/hold|pause|squeeze|float|\bown\b|top position/i, "⏸️"],
  [/repeat|switch|alternate|reset|finish|release|return|exit/i, "🔁"],
  [/lower|descend|descent|down|dip|hike|hinge|sink|drop|sit between|land|rock/i, "⬇️"],
  [/drive|press|push|stand up|stand through|lift|rise|explode|jump|snap|raise|curl|arc|\bup\b/i, "⬆️"],
  [/grip|hands|arm/i, "✊"],
  [/brace|tighten|tuck|core|stable|stabil|ribs/i, "🛡️"],
  [/tall|straight|square|neutral|flatten|stack|control|clean|scale/i, "🧍"],
  [/walk|step|carry|feet|heel|stance/i, "👣"],
  [/stretch|reach|lengthen|open|extend|shift|lean|pry|move behind|draw/i, "↔️"],
  [/pace|rhythm|cadence|interval|effort|recover|power|transition/i, "⏱️"]
];
const stepIcon = title => (STEP_ICONS.find(([re]) => re.test(title)) || [null, "•"])[1];

function videoCard(ex, onChange){
  const id = videoFor(ex), box = h("section", {class:"video-card"});
  if(id){
    const frame = h("div", {class:"video-frame"});
    const poster = h("button", {class:"video-poster", "aria-label":`${T("watch")}: ${exName(ex.n)}`, onclick:() => {
      if(navigator.onLine === false){ toast(T("offlineVideo")); return; }
      hush();
      frame.replaceChildren(h("iframe", {src:`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`,
        title:`${exName(ex.n)} — video`, allow:"autoplay; encrypted-media; picture-in-picture; fullscreen", allowfullscreen:true, referrerpolicy:"strict-origin-when-cross-origin"}));
    }}, h("img", {src:ytThumb(id), alt:"", loading:"lazy"}), h("span", {class:"play"}, "▶"), h("span", {class:"watch"}, T("watch")));
    poster.querySelector("img").addEventListener("error", e => e.target.remove());
    frame.append(poster);
    box.append(frame, h("div", {class:"video-links"},
      h("a", {href:ytWatch(id), target:"_blank", rel:"noopener", class:"linkish"}, "↗ " + T("openYT")),
      h("button", {class:"linkish", onclick:() => pickVideo(ex, onChange)}, T("changeVideo"))));
  }else{
    box.append(h("div", {class:"video-empty"},
      h("a", {class:"btn primary block", href:ytSearch(ex), target:"_blank", rel:"noopener"}, "▶ " + T("findYT")),
      h("button", {class:"linkish", onclick:() => pickVideo(ex, onChange)}, "+ " + T("addVideo"))));
  }
  return box;
}
function pickVideo(ex, onChange){
  sheet((card, close) => {
    const input = h("input", {class:"text-input", placeholder:"https://youtu.be/…", "aria-label":"YouTube link", autocomplete:"off", inputmode:"url"});
    const save = h("button", {class:"btn block section", disabled:true}, "Use this video");
    const paint = () => { const ok = !!ytId(input.value); save.disabled = !ok; actionState(save, ok); };
    input.addEventListener("input", paint);
    save.addEventListener("click", () => {
      const id = ytId(input.value); if(!id) return;
      const picks = videoPicks(); picks[ex.n] = id; write(K.videoPick, picks); close(); toast("Video saved."); onChange && onChange();
    });
    card.append(h("h2", null, T("changeVideo")),
      h("p", {class:"small muted"}, `Find a video for ${exName(ex.n)} in YouTube, tap Share › Copy link, then paste it here.`),
      h("a", {class:"btn block", href:ytSearch(ex), target:"_blank", rel:"noopener"}, "Search YouTube"),
      input, save,
      videoPicks()[ex.n] ? h("button", {class:"btn ghost block", onclick:() => { const p = videoPicks(); delete p[ex.n]; write(K.videoPick, p); close(); toast("Back to the recommended video."); onChange && onChange(); }}, "Use the recommended video") : null);
    paint();
  });
}

function openGuide(ex, talk, startAt = 0){
  const fam = familyOf(ex), how = exHow(ex), enSteps = STEPS[fam] || STEPS.circuit;
  const steps = stepsOf(fam).map((st,k) => ({title:st[0], text:st[1], cue:how[k] || null, icon:stepIcon((enSteps[k] || st)[0])}));
  let i = Math.min(startAt, steps.length - 1), playingAll = false;
  const inner = h("div", {class:"app"});
  const ov = h("div", {class:"overlay guide", role:"dialog", "aria-modal":"true", "aria-label":exName(ex.n)}, inner);
  const close = () => { hush(); playingAll = false; ov.remove(); };
  const list = h("ol", {class:"stepper"});
  const playBtn = h("button", {class:"btn primary"}), prev = h("button", {class:"icon-btn", "aria-label":"Previous step"}, "‹"), next = h("button", {class:"icon-btn", "aria-label":"Next step"}, "›");
  const lineFor = k => phrase().step(k+1, steps[k].title, steps[k].text, steps[k].cue);
  const say = (then) => {
    playBtn.textContent = T("preparing");
    speak(lineFor(i), {force:true, patient:true, onend:then, onready:() => { playBtn.textContent = T("stop"); }});
  };
  const paint = (scroll) => {
    list.replaceChildren(...steps.map((st,k) => h("li", {class:"step-row" + (k === i ? " current" : k < i ? " done" : "")},
      h("button", {class:"step-head", "aria-expanded":String(k === i), onclick:() => { hush(); playingAll = false; i = k; paint(true); }},
        h("span", {class:"step-icon", "aria-hidden":"true"}, st.icon), h("span", {class:"step-num"}, k+1),
        h("span", {class:"step-name"}, st.title)),
      k === i ? h("div", {class:"step-body"}, h("p", null, st.text), st.cue ? h("div", {class:"step-cue"}, st.cue) : null) : null)));
    prev.disabled = i === 0;
    next.textContent = i === steps.length-1 ? "✓" : "›";
    next.setAttribute("aria-label", i === steps.length-1 ? "Close guide" : "Next step");
    if(!playingAll) playBtn.textContent = "▶ " + T("talk");
    if(scroll) requestAnimationFrame(() => list.querySelector(".current")?.scrollIntoView({block:"nearest", behavior:"smooth"}));
  };
  const playAll = () => {
    playingAll = true; paint(true);
    const run = () => say(() => { if(!playingAll) return; if(i < steps.length-1){ setTimeout(() => { if(!playingAll) return; i++; paint(true); run(); }, 900); } else { playingAll = false; paint(); } });
    run();
  };
  let card = null;
  const resetVideo = () => { if(card && card.querySelector("iframe")){ const fresh = videoCard(ex, () => reopen()); card.replaceWith(fresh); card = fresh; } };
  playBtn.addEventListener("click", () => { if(playingAll){ playingAll = false; hush(); paint(); } else { resetVideo(); playAll(); } });
  prev.addEventListener("click", () => { hush(); playingAll = false; if(i > 0){ i--; paint(true); } });
  next.addEventListener("click", () => { hush(); playingAll = false; if(i < steps.length-1){ i++; paint(true); } else close(); });
  const speed = h("select", {"aria-label":T("voiceSpeed")}, [["0.75",T("slower")],["0.9",T("normal")],["1.05",T("faster")]].map(([v,t]) => h("option", {value:v}, t)));
  speed.value = String([0.75,0.9,1.05].reduce((a,b) => Math.abs(b-voice.rate) < Math.abs(a-voice.rate) ? b : a));
  speed.addEventListener("change", () => { voice.rate = Number(speed.value); localStorage.setItem(K.rate, speed.value); });
  const chip = h("button", {class:"lang-chip", "aria-label":"Change language and voice", onclick:() => {
    hush(); playingAll = false;
    openVoiceSheet(() => { close(); if(state && wk) paintExercise(); openGuide(ex, false, i); });
  }}, `${voice.lang.toUpperCase()} · ${genderLabel(voice.gender)}`);
  const reopen = () => { close(); if(state && wk) paintExercise(); openGuide(ex, false, i); };
  inner.append(
    h("div", {class:"ov-top"}, h("button", {class:"icon-btn plain", "aria-label":"Close guide", onclick:close}, "←"),
      h("div", {class:"t"}, h("b", null, exName(ex.n)), h("span", {class:"tag", "data-block":ex.block}, blockName(ex.block))), chip),
    (card = videoCard(ex, () => reopen())),
    h("div", {class:"section-head section"}, h("h2", null, T("stepByStep")), h("span", {class:"tiny muted"}, `${steps.length} ${T("step")}${voice.lang === "de" ? "e" : "s"}`)),
    h("p", {class:"tiny muted"}, T("tapStep")),
    list,
    h("div", {class:"guide-extra"},
      h("div", {class:"feel"}, h("h4", null, T("feel")), h("p", {class:"small"}, feelOf(fam))),
      h("div", {class:"avoid"}, h("h4", null, T("avoid")), h("ul", null, exMistakes(ex).map(m => h("li", null, m))))),
    h("div", {class:"voice-opts"}, h("span", {class:"small muted"}, T("voiceSpeed")), speed),
    h("div", {class:"guide-bar"}, prev, playBtn, next));
  document.body.append(ov);
  paint();
  steps.reduce((p, _, k) => p.then(() => ov.isConnected ? prefetchVoice(lineFor(k), false, true) : null), Promise.resolve());
  if(talk) setTimeout(playAll, 250);
}

/* ---------- Language & voice: choose, then confirm ---------- */
function voiceEditor(onApplied, draft = {lang:voice.lang, gender:voice.gender}, onDraft){
  const box = h("div");
  const paint = () => {
    const changed = draft.lang !== voice.lang || draft.gender !== voice.gender;
    const row = (label, opts, key) => h("div", null, h("div", {class:"field-label"}, label),
      h("div", {class:"pick", role:"group"}, opts.map(([v,t]) => h("button", {"aria-pressed":String(draft[key] === v), onclick:() => {
        draft[key] = v; paint(); onDraft && onDraft();
        unlockAudio(); speakWith(SAMPLE[draft.lang][draft.gender], draft);          // hear it straight away
      }}, t))));
    box.replaceChildren(
      row("Language (exercises, guide and voice)", [["en","English"],["de","Deutsch"]], "lang"),
      row("Voice", [["male","Male"],["female","Female"],["neutral","Neutral"]], "gender"),
      h("p", {class:"tiny muted"}, "Tap a voice to hear it. Voices come from your phone: free, offline, no credit used. For even more natural voices, add them in your phone's text-to-speech settings (guide below)."),
      h("div", {class:"apply-row"},
        h("span", {class:"small " + (changed ? "" : "muted")}, changed ? `New: ${langLabel(draft.lang)} · ${genderLabel(draft.gender)}` : `Current: ${langLabel(voice.lang)} · ${genderLabel(voice.gender)}`),
        h("button", {class:"btn " + (changed ? "primary" : "idle"), disabled:!changed, onclick:() => {
          voice.lang = draft.lang; voice.gender = draft.gender; voice.name = "";
          localStorage.setItem(K.lang, voice.lang); localStorage.setItem(K.gender, voice.gender); localStorage.setItem(K.voiceName, "");
          toast(`Applied: ${langLabel(voice.lang)} · ${genderLabel(voice.gender)}`);
          unlockAudio(); speak(phrase().test, {force:true});
          onApplied && onApplied();
          paint();
        }}, changed ? "Confirm" : "Confirmed")));
  };
  paint();
  return box;
}
function openVoiceSheet(onApplied){
  const close = sheet((card, closeSheet) => {
    card.append(h("h2", null, "Language & voice"),
      voiceEditor(() => { closeSheet(); onApplied && onApplied(); }));
  });
  return close;
}

const IS_APPLE = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
/* Step-by-step voice setup for each kind of phone. Short version appears in "Find a voice". */
const VOICE_STEPS = {
  android:{
    title:"Android (Samsung, Google Pixel and others)",
    parts:[
      ["1. Install Google's voice engine", [
        "Open the Play Store and search \"Speech Recognition and Synthesis from Google\" (also called Speech Services by Google).",
        "Tap Install, or Update if you see it. If it only shows Uninstall, it's ready — don't tap it."]],
      ["2. Make it your phone's voice engine", [
        "Open Settings › tap Search › type \"text-to-speech\" › tap Text-to-speech output. (Samsung: usually under General management.)",
        "Tap Preferred engine › choose Speech Recognition and Synthesis from Google (Speech Services by Google). Tap OK if asked."]],
      ["3. Pick a male or female voice for each language", [
        "On Text-to-speech output, tap the ⚙ gear next to the Google engine › Install voice data.",
        "English: tap English (United Kingdom) — download it if there's a ⬇ icon — then tap each voice (Voice I, II, III…) to hear it and select the one you want.",
        "Deutsch: go back, tap Deutsch (Deutschland) and choose a voice the same way.",
        "Tip: for both a male and a female English voice, set English (United Kingdom) to one and English (United States) to the other.",
        "Back on Text-to-speech output, tap Play / Listen to an example to check."]],
      ["4. Use it in Zahi Fit", [
        "Tap Recent apps (|||) › Close all, then open Zahi Fit again.",
        "Profile › Language & voice › choose your language and Male or Female.",
        "Tap Find a male (or female) voice on this phone › ▶ to listen › Use on the one that sounds right. Do this once for English and once for Deutsch.",
        "Tap Confirm, then Test voice. Still the old voice? Restart the phone and repeat this step."]]
    ],
    short:["Settings › search \"text-to-speech\" › Text-to-speech output › Preferred engine: Speech Recognition and Synthesis from Google.",
      "Tap ⚙ › Install voice data › pick your language (e.g. English (United Kingdom) or Deutsch (Deutschland)) › tap each voice to listen › select the one you want.",
      "Recent apps › Close all › reopen Zahi Fit › come back here and tap Use on that voice."]
  },
  ios:{
    title:"iPhone and iPad",
    parts:[
      ["1. Download good voices", [
        "Open Settings › Accessibility › Spoken Content › Voices.",
        "Tap English › pick a voice: male options include Daniel (UK), Arthur (UK), Aaron, Evan or Nathan (US); female options include Serena or Kate (UK), Samantha, Ava or Zoe (US).",
        "Tap the ⬇ download icon next to the voice (choose the Enhanced or Premium version if offered — it sounds much more natural).",
        "Deutsch: go back › German › download a male voice (e.g. Martin, Yannick) and/or a female voice (e.g. Anna, Helena, Petra)."]],
      ["2. Use it in Zahi Fit", [
        "Swipe Zahi Fit away in the app switcher and open it again, so the new voices appear.",
        "Profile › Language & voice › choose your language and Male or Female.",
        "Tap Find a male (or female) voice on this phone › ▶ to listen › Use on the voice you downloaded. Do this once for English and once for Deutsch.",
        "Tap Confirm, then Test voice."]],
      ["No sound?", [
        "Turn off Silent mode (the switch or Action button on the side) and turn the volume up.",
        "Settings › Accessibility › Spoken Content: make sure the voice finished downloading."]]
    ],
    short:["Settings › Accessibility › Spoken Content › Voices › pick your language (English or German).",
      "Tap ⬇ to download a voice you like (Enhanced / Premium sounds best) — e.g. Daniel or Arthur (male, UK), Samantha (female, US), Martin (male, German), Anna (female, German).",
      "Swipe Zahi Fit away, reopen it, come back here and tap Use on that voice."]
  }
};
function phoneSetupGuide(){
  sheet(card => {
    let os = IS_APPLE ? "ios" : "android";
    const body = h("div");
    const tabs = h("div", {class:"pick guide-tabs", role:"tablist"});
    const paint = () => {
      tabs.replaceChildren(...[["android","Android"],["ios","iPhone"]].map(([k,t]) =>
        h("button", {role:"tab", "aria-selected":String(os === k), "aria-pressed":String(os === k), onclick:() => { os = k; paint(); }}, t)));
      const g = VOICE_STEPS[os];
      body.replaceChildren(h("p", {class:"small muted"}, `${g.title}. Do this once on Wi-Fi — the voices then work offline and are free.`),
        ...g.parts.flatMap(([head, items]) => [h("h3", {class:"section"}, head), h("ol", {class:"howto"}, items.map(x => h("li", null, x)))]));
    };
    card.append(h("h2", null, "Set up your phone's voices"), tabs, body);
    paint();
  });
}

/* Plain-language reason for a voice failure, with what to do about it. */
function voiceProblem(err){
  const st = err && err.status, up = err && err.upstream, d = ((err && (err.detail + " " + err.message)) || "").toLowerCase();
  if(!err || err.name === "TypeError" || /timeout|abort|failed to fetch|load failed/.test(d))
    return "Couldn't reach the voice Worker. Check your connection; if it keeps happening, check that the zahi-fit-voice Worker is deployed.";
  if(st === 403) return "The voice Worker refused this app's address. In the Worker code, ALLOWED_ORIGINS must include https://zchamoun.github.io.";
  if(st === 500 && /openai_api_key/.test(d)) return "The OPENAI_API_KEY secret is missing in the zahi-fit-voice Worker (Settings › Variables and Secrets).";
  if(up === 429 && /quota|billing|credit/.test(d)) return "Your OpenAI account has no credit left. Add credit at platform.openai.com › Settings › Billing, then tap again.";
  if(up === 429) return "OpenAI is rate-limiting requests. Wait a minute and tap again — saved clips are kept.";
  if(up === 401 || /incorrect api key|invalid api key/.test(d)) return "OpenAI rejected the key. Re-paste OPENAI_API_KEY in the zahi-fit-voice Worker.";
  if(up === 403 || /permission|scope/.test(d)) return "The OpenAI key doesn't have permission for speech. Edit the key (or make a new one) with Model capabilities: Write, or All.";
  if(up === 404 || /model/.test(d)) return "Your OpenAI account can't use the speech model. Check that the project has access to gpt-4o-mini-tts / tts-1.";
  return `The voice service returned an error (${st || "?"}${up ? "/" + up : ""})${err.detail ? ": " + err.detail.slice(0, 140) : ""}.`;
}

/* ---------- accounts: password hashing ---------- */
const te = new TextEncoder();
const toB64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf)));
const fromB64 = str => Uint8Array.from(atob(str), c => c.charCodeAt(0));
async function pbkdf2(secret, saltB64, iter){
  const key = await crypto.subtle.importKey("raw", te.encode(secret), "PBKDF2", false, ["deriveBits"]);
  return toB64(await crypto.subtle.deriveBits({name:"PBKDF2", hash:"SHA-256", salt:fromB64(saltB64), iterations:iter}, key, 256));
}
async function makeSecret(secret){ const salt = toB64(crypto.getRandomValues(new Uint8Array(16))), iter = 210000; return {salt, iter, hash:await pbkdf2(secret, salt, iter)}; }
async function checkSecret(secret, rec){
  if(!rec || !rec.salt) return false;
  const h2 = await pbkdf2(secret, rec.salt, rec.iter || 210000);
  let diff = h2.length ^ rec.hash.length; for(let i = 0; i < Math.min(h2.length, rec.hash.length); i++) diff |= h2.charCodeAt(i) ^ rec.hash.charCodeAt(i);
  return diff === 0;
}
function newRecoveryCode(){
  const abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", r = crypto.getRandomValues(new Uint8Array(12));
  const raw = [...r].map(x => abc[x % abc.length]).join("");
  return `${raw.slice(0,4)}-${raw.slice(4,8)}-${raw.slice(8)}`;
}
const normCode = c => String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
const normUser = u => String(u || "").trim().toLowerCase();
const USERNAME_OK = u => /^[a-z0-9._-]{3,20}$/i.test(String(u || "").trim());
const PASSWORD_OK = p => String(p || "").length >= 8;
const accountFor = u => people.users.find(x => x.username && normUser(x.username) === normUser(u));
const claimed = () => people.users.filter(u => u.auth);
function hasData(u){ return ["history","plan","personal"].some(k => localStorage.getItem(nsKey(u.id, BASE_K[k]))); }
function failState(u){ const f = read(FAILS_KEY, {}) || {}; return f[normUser(u)] || {n:0, until:0}; }
function setFail(u, st){ const f = read(FAILS_KEY, {}) || {}; if(st) f[normUser(u)] = st; else delete f[normUser(u)]; write(FAILS_KEY, f); }
function startSession(id, stay){
  const rec = JSON.stringify({id, exp:stay ? Date.now() + 180 * 86400000 : 0});
  try{ sessionStorage.removeItem(SESSION_KEY); localStorage.removeItem(SESSION_KEY); }catch{}
  (stay ? localStorage : sessionStorage).setItem(SESSION_KEY, rec);
  people.active = id; write(USERS_KEY, people);
  location.reload();
}

/* ---------- sign-in / create account screens ---------- */
function field(label, attrs){
  const input = h("input", {class:"text-input", autocomplete:"off", autocapitalize:"none", spellcheck:"false", ...attrs});
  const wrap = h("label", {class:"auth-field"}, h("span", null, label), input);
  if(attrs.type === "password"){
    const eye = h("button", {type:"button", class:"eye", "aria-label":"Show password", onclick:() => { input.type = input.type === "password" ? "text" : "password"; eye.textContent = input.type === "password" ? "Show" : "Hide"; }}, "Show");
    wrap.append(eye);
  }
  return {wrap, input};
}
function renderAuth(mode, prefill){
  document.body.classList.add("locked");
  const m = $("#view"); m.replaceChildren();
  mode = mode || (claimed().length ? "login" : "register");
  const head = (title, sub) => [h("div", {class:"auth-brand"}, h("img", {src:"icon-192.png", alt:""}), h("span", null, "Zahi Fit")), h("h1", null, title), sub ? h("p", {class:"muted"}, sub) : null];
  const msg = h("p", {class:"auth-msg", role:"alert"});
  const say = (t, ok) => { msg.textContent = t || ""; msg.classList.toggle("ok", !!ok); };
  const busy = (btn, on, label) => { btn.disabled = on; if(on) btn.textContent = "Checking…"; else btn.textContent = label; };

  if(mode === "register"){
    const u = field("Username", {placeholder:"e.g. zahi", maxlength:"20", value:prefill || ""});
    const p1 = field("Password", {type:"password", placeholder:"At least 8 characters", autocomplete:"new-password"});
    const p2 = field("Confirm password", {type:"password", autocomplete:"new-password"});
    const legacy = people.users.filter(x => !x.auth && hasData(x));
    let linkTo = legacy[0] ? legacy[0].id : "fresh";
    const linkBox = legacy.length ? h("div", {class:"auth-link"},
      h("b", null, "You already have training on this phone"), h("p", {class:"tiny muted"}, "Link it to this account so nothing is lost."),
      h("div", {class:"pick", role:"group"}, [...legacy.map(x => [x.id, `${x.name} · ${userStats(x)}`]), ["fresh", "Start fresh"]].map(([v,t]) =>
        h("button", {"aria-pressed":String(linkTo === v), onclick:e => { linkTo = v; e.currentTarget.parentNode.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b === e.currentTarget))); }}, t)))) : null;
    const go1 = h("button", {class:"btn block"}, "Create account");
    const check = () => { const ok = USERNAME_OK(u.input.value) && PASSWORD_OK(p1.input.value) && p1.input.value === p2.input.value; actionState(go1, ok); go1.disabled = !ok;
      say(u.input.value && !USERNAME_OK(u.input.value) ? "Username: 3–20 letters, numbers, dots, dashes or underscores." : p1.input.value && !PASSWORD_OK(p1.input.value) ? "Password needs at least 8 characters." : p2.input.value && p1.input.value !== p2.input.value ? "Passwords don't match." : ""); };
    [u, p1, p2].forEach(f => f.input.addEventListener("input", check));
    go1.addEventListener("click", async () => {
      const name = u.input.value.trim();
      if(accountFor(name)){ say("That username is already used on this phone."); return; }
      busy(go1, true);
      const code = newRecoveryCode();
      let acct = linkTo !== "fresh" ? people.users.find(x => x.id === linkTo) : people.users.find(x => !x.auth && !hasData(x));
      if(!acct){
        const used = people.users.map(x => x.tone % 4);
        acct = {id:"u" + Date.now().toString(36), tone:[0,1,2,3].find(t => !used.includes(t)) ?? people.users.length % 4, created:Date.now()};
        people.users.push(acct);
      }
      acct.username = name; acct.name = acct.name && acct.name !== "Me" ? acct.name : name;
      acct.auth = await makeSecret(p1.input.value); acct.recovery = await makeSecret(normCode(code));
      write(USERS_KEY, people);
      renderAuth("recovery", {name, code});
    });
    m.append(h("section", {class:"auth"}, ...head("Create your account", "Your workouts, plan and settings stay private to your account on this phone."),
      u.wrap, p1.wrap, p2.wrap, linkBox, msg, go1,
      claimed().length ? h("button", {class:"linkish block", onclick:() => renderAuth("login")}, "Already have an account? Sign in") : null));
    check(); setTimeout(() => u.input.focus(), 100);
    return;
  }

  if(mode === "recovery"){
    const {name, code} = prefill;
    m.append(h("section", {class:"auth"}, ...head("Save your recovery code", `If you forget the password for ${name}, this code lets you set a new one. It's shown only once.`),
      h("div", {class:"code-box"}, code),
      h("button", {class:"btn block", onclick:async e => { try{ await navigator.clipboard.writeText(code); toast("Code copied."); }catch{ toast("Couldn't copy — write it down."); } }}, "Copy code"),
      h("p", {class:"tiny muted"}, "Keep it somewhere safe outside this app, e.g. your password manager or a note."),
      h("button", {class:"btn primary block section", onclick:() => renderAuth("login", name)}, "I've saved it — continue to sign in")));
    return;
  }

  if(mode === "forgot"){
    const u = field("Username", {value:prefill || "", maxlength:"20"});
    const c = field("Recovery code", {placeholder:"XXXX-XXXX-XXXX", maxlength:"14"});
    const p1 = field("New password", {type:"password", placeholder:"At least 8 characters", autocomplete:"new-password"});
    const p2 = field("Confirm new password", {type:"password", autocomplete:"new-password"});
    const btn = h("button", {class:"btn block"}, "Set new password");
    const check = () => { const ok = USERNAME_OK(u.input.value) && normCode(c.input.value).length === 12 && PASSWORD_OK(p1.input.value) && p1.input.value === p2.input.value; actionState(btn, ok); btn.disabled = !ok; };
    [u, c, p1, p2].forEach(f => f.input.addEventListener("input", check));
    btn.addEventListener("click", async () => {
      const acct = accountFor(u.input.value);
      busy(btn, true);
      if(!acct || !(await checkSecret(normCode(c.input.value), acct.recovery))){ busy(btn, false, "Set new password"); say("Username or recovery code isn't right."); return; }
      const code = newRecoveryCode();
      acct.auth = await makeSecret(p1.input.value); acct.recovery = await makeSecret(normCode(code)); write(USERS_KEY, people); setFail(acct.username, null);
      renderAuth("recovery", {name:acct.username, code});
    });
    const erase = h("button", {class:"linkish block danger-link", onclick:async () => {
      const acct = accountFor(u.input.value);
      if(!acct){ say("Enter the username to erase first."); return; }
      if(!(await ask(`Erase ${acct.username}?`, "Without the password or recovery code the account can't be unlocked. Erasing deletes its workouts, plan and settings from this phone so you can start again. This can't be undone.", "Erase account", true))) return;
      Object.keys(BASE_K).filter(k => !DEVICE_KEYS.includes(k)).forEach(k => localStorage.removeItem(nsKey(acct.id, BASE_K[k])));
      people.users = people.users.filter(x => x.id !== acct.id);
      if(!people.users.length) people.users.push({id:"main", name:"Me", tone:0, created:Date.now()});
      write(USERS_KEY, people); setFail(acct.username, null); toast("Account erased."); renderAuth();
    }}, "No recovery code? Erase this account and start over");
    m.append(h("section", {class:"auth"}, ...head("Reset your password", "Use the recovery code you saved when you created the account."),
      u.wrap, c.wrap, p1.wrap, p2.wrap, msg, btn, h("button", {class:"linkish block", onclick:() => renderAuth("login", u.input.value)}, "Back to sign in"), erase));
    check();
    return;
  }

  // sign in
  const u = field("Username", {value:prefill || "", maxlength:"20", autocomplete:"username"});
  const p = field("Password", {type:"password", autocomplete:"current-password"});
  const stay = h("input", {type:"checkbox", checked:true, id:"stay"});
  const btn = h("button", {class:"btn block"}, "Sign in");
  const check = () => { const ok = !!u.input.value.trim() && !!p.input.value; actionState(btn, ok); btn.disabled = !ok; };
  [u, p].forEach(f => { f.input.addEventListener("input", check); f.input.addEventListener("keydown", e => { if(e.key === "Enter" && !btn.disabled) btn.click(); }); });
  btn.addEventListener("click", async () => {
    const name = u.input.value.trim(), fs = failState(name);
    if(fs.until > Date.now()){ say(`Too many attempts. Try again in ${Math.ceil((fs.until - Date.now()) / 1000)} seconds.`); return; }
    busy(btn, true);
    const acct = accountFor(name);
    const ok = acct && await checkSecret(p.input.value, acct.auth);
    if(!ok){
      const n = fs.n + 1; setFail(name, {n: n >= 5 ? 0 : n, until: n >= 5 ? Date.now() + 30000 : 0});
      busy(btn, false, "Sign in"); check(); p.input.value = ""; check();
      say(n >= 5 ? "Too many attempts. Try again in 30 seconds." : "Username or password isn't right."); return;
    }
    setFail(name, null);
    startSession(acct.id, stay.checked);
  });
  m.append(h("section", {class:"auth"}, ...head("Sign in", "Welcome back."),
    u.wrap, p.wrap,
    h("label", {class:"stay", for:"stay"}, stay, h("span", null, h("b", null, "Stay signed in"), h("small", null, "On this phone, for up to 6 months. Untick on a shared phone."))),
    msg, btn,
    h("button", {class:"linkish block", onclick:() => renderAuth("forgot", u.input.value)}, "Forgot password?"),
    h("div", {class:"auth-sep"}, h("span", null, "or")),
    h("button", {class:"btn block", onclick:() => renderAuth("register")}, "Create a new account")));
  check(); setTimeout(() => (prefill ? p : u).input.focus(), 100);
}

/* ---------- account (Profile) ---------- */
function accountSheet(){
  sheet((card, close) => {
    card.append(h("div", {class:"acct-head"}, h("span", {class:"avatar", "data-tone":me.tone % 4}, initialOf(me)),
        h("div", null, h("b", null, me.name), h("span", null, `@${me.username} · ${userStats(me)}`))),
      h("button", {class:"btn block section", onclick:() => { close(); go("profile"); }}, "Account & settings"),
      h("button", {class:"btn block section", onclick:async () => { close(); if(await ask("Sign out?", state ? "Your workout in progress is saved and waits for you." : "You'll need your password to sign back in.", "Sign out")) signOut(); }}, "Sign out"));
  });
}
function passwordSheet(){
  sheet((card, close) => {
    const cur = field("Current password", {type:"password", autocomplete:"current-password"});
    const p1 = field("New password", {type:"password", placeholder:"At least 8 characters", autocomplete:"new-password"});
    const p2 = field("Confirm new password", {type:"password", autocomplete:"new-password"});
    const msg = h("p", {class:"auth-msg"}), btn = h("button", {class:"btn block section", disabled:true}, "Change password");
    const check = () => { const ok = !!cur.input.value && PASSWORD_OK(p1.input.value) && p1.input.value === p2.input.value; actionState(btn, ok); btn.disabled = !ok; };
    [cur, p1, p2].forEach(f => f.input.addEventListener("input", check));
    btn.addEventListener("click", async () => {
      btn.disabled = true; btn.textContent = "Checking…";
      if(!(await checkSecret(cur.input.value, me.auth))){ msg.textContent = "Current password isn't right."; btn.textContent = "Change password"; check(); return; }
      me.auth = await makeSecret(p1.input.value); write(USERS_KEY, people); close(); toast("Password changed.");
    });
    card.append(h("h2", null, "Change password"), cur.wrap, p1.wrap, p2.wrap, msg, btn); check();
  });
}
async function newCodeFlow(){
  const code = newRecoveryCode(); me.recovery = await makeSecret(normCode(code)); write(USERS_KEY, people);
  sheet(card => card.append(h("h2", null, "New recovery code"), h("p", {class:"small muted"}, "Your old code no longer works. Save this one somewhere safe."),
    h("div", {class:"code-box"}, code), h("button", {class:"btn block", onclick:async () => { try{ await navigator.clipboard.writeText(code); toast("Code copied."); }catch{ toast("Couldn't copy — write it down."); } }}, "Copy code")));
}
function deleteAccountSheet(){
  sheet((card, close) => {
    const p = field("Password", {type:"password", autocomplete:"current-password"});
    const msg = h("p", {class:"auth-msg"}), btn = h("button", {class:"btn danger block section"}, "Delete my account");
    btn.addEventListener("click", async () => {
      btn.disabled = true; btn.textContent = "Checking…";
      if(!(await checkSecret(p.input.value, me.auth))){ msg.textContent = "Password isn't right."; btn.disabled = false; btn.textContent = "Delete my account"; return; }
      Object.keys(BASE_K).filter(k => !DEVICE_KEYS.includes(k)).forEach(k => localStorage.removeItem(nsKey(me.id, BASE_K[k])));
      people.users = people.users.filter(x => x.id !== me.id);
      if(!people.users.length) people.users.push({id:"main", name:"Me", tone:0, created:Date.now()});
      write(USERS_KEY, people); close(); signOut();
    });
    card.append(h("h2", null, "Delete account"), h("p", {class:"small muted"}, `This erases ${me.name}'s workouts, plan and settings from this phone. Back up your history first if you might need it. This can't be undone.`), p.wrap, msg, btn);
  });
}
function accountPanel(){
  return h("section", {class:"panel"},
    h("div", {class:"acct-head"}, h("span", {class:"avatar", "data-tone":me.tone % 4}, initialOf(me)),
      h("div", null, h("b", null, me.name), h("span", null, `Signed in as @${me.username}`))),
    h("div", {class:"acct-actions section"},
      h("button", {class:"btn sm", onclick:() => nameSheet("Display name", me.name, "Save name", name => { me.name = name; write(USERS_KEY, people); go("profile"); toast("Name saved."); })}, "Display name"),
      h("button", {class:"btn sm", onclick:passwordSheet}, "Change password"),
      h("button", {class:"btn sm", onclick:newCodeFlow}, "New recovery code"),
      h("button", {class:"btn sm", onclick:async () => { if(await ask("Sign out?", state ? "Your workout in progress is saved and waits for you." : "You'll need your password to sign back in.", "Sign out")) signOut(); }}, "Sign out")),
    h("p", {class:"tiny muted"}, "Your account lives on this phone. Other people using Zahi Fit here sign in with their own accounts and can't see yours."),
    h("button", {class:"linkish danger-link", onclick:deleteAccountSheet}, "Delete account"));
}
function nameSheet(title, initial, confirmLabel, onSave){
  sheet((card, close) => {
    const input = h("input", {class:"text-input", value:initial || "", maxlength:"24", placeholder:"Name", "aria-label":"Name", autocomplete:"off"});
    const btn = h("button", {class:"btn block section", disabled:true}, confirmLabel);
    const paint = () => { const v = input.value.trim(); const ok = !!v && v !== (initial || ""); btn.disabled = !ok; actionState(btn, ok); };
    input.addEventListener("input", paint);
    input.addEventListener("keydown", e => { if(e.key === "Enter" && !btn.disabled) btn.click(); });
    btn.addEventListener("click", () => { const v = input.value.trim(); if(!v) return; close(); onSave(v); });
    card.append(h("h2", null, title), input, btn);
    paint(); setTimeout(() => input.focus(), 150);
  });
}

/* ---------- Profile & settings ---------- */
/* Button rule: teal = something to save or test; grey = saved / up to date. */
function actionState(btn, needed, readyLabel, doneLabel){
  btn.classList.toggle("primary", needed);
  btn.classList.toggle("idle", !needed);
  if(readyLabel) btn.textContent = needed ? readyLabel : (doneLabel || readyLabel);
}
const voiceSig = () => [voice.lang, voice.gender, voice.engine, voice.name, voice.rate].join("|");
function planEditor(draft, onChange){
  const wrap = h("div");
  const paint = () => {
    wrap.replaceChildren(
      h("div", {class:"field-label"}, "Where do you train?"),
      h("div", {class:"pick equip", role:"group"}, [["gym","Gym","Machines, barbells, dumbbells"],["bodyweight","Bodyweight","No equipment · a chair, table and step help"]].map(([v,t,sub]) =>
        h("button", {"aria-pressed":String((draft.equipment || "gym") === v), onclick:() => { draft.equipment = v; paint(); onChange && onChange(); }}, h("b", null, t), h("small", null, sub)))),
      h("div", {class:"field-label"}, "Training days per week"),
      h("div", {class:"pick num", role:"group"}, [2,3,4,5,6].map(d => h("button", {"aria-pressed":String(draft.days === d), onclick:() => { draft.days = d; paint(); onChange && onChange(); }}, d))),
      h("div", {class:"field-label"}, "Main goal"),
      h("div", {class:"pick", role:"group"}, Object.entries(GOALS).map(([k,t]) => h("button", {"aria-pressed":String(draft.primary === k), onclick:() => { draft.primary = k; draft.secondary = draft.secondary.filter(x => x !== k); paint(); onChange && onChange(); }}, t))),
      h("div", {class:"field-label"}, "Also working on ", h("small", null, "up to 3, optional")),
      h("div", {class:"pick", role:"group"}, Object.entries(GOALS).map(([k,t]) => h("button", {"aria-pressed":String(draft.secondary.includes(k)), disabled:k === draft.primary, onclick:() => {
        if(draft.secondary.includes(k)) draft.secondary = draft.secondary.filter(x => x !== k); else if(draft.secondary.length < 3) draft.secondary.push(k); else toast("Pick up to three.");
        paint(); onChange && onChange(); }}, t))),
      h("div", {class:"field-label"}, "Session length"),
      h("div", {class:"pick", role:"group"}, [45,60,75,90].map(d => h("button", {"aria-pressed":String(draft.duration === d), onclick:() => { draft.duration = d; paint(); onChange && onChange(); }}, `${d} min`))));
  };
  paint();
  return wrap;
}
function applyPlan(p){
  plan = {...p, secondary:[...p.secondary]}; write(K.plan, plan);
  workouts = buildWeek(); nextIndex = 0; localStorage.setItem(K.next, "0");
}
function aboutEditor(draft, onChange, part = "all"){
  const wrap = h("div");
  draft.areas = Array.isArray(draft.areas) ? draft.areas : [];
  draft.focus = draft.focus || "auto"; draft.experience = draft.experience || "some";
  const pick = (label, opts, key, sub) => [h("div", {class:"field-label"}, label, sub ? h("small", null, " " + sub) : null),
    h("div", {class:"pick", role:"group"}, opts.map(([v,t]) => h("button", {"aria-pressed":String(draft[key] === v), onclick:() => { draft[key] = v; paint(); }}, t)))];
  const paint = () => { onChange && onChange();
    const out = [];
    if(part !== "body"){
      out.push(...pick("Sex", [["male","Male"],["female","Female"]], "sex"),
        ...pick("Age", ["18-29","30-39","40-49","50-59","60+"].map(v => [v, v.replace("-", "–")]), "ageBracket"),
        ...pick("Training experience", Object.entries(EXPERIENCE), "experience"));
      const bwIn = h("input", {class:"text-input small-input", inputmode:"numeric", placeholder:"e.g. 80", value:draft.bodyweight || "", maxlength:"3", "aria-label":"Body weight in kg"});
      bwIn.addEventListener("input", () => { const v = Number(bwIn.value.replace(/\D/g, "")); draft.bodyweight = v > 30 && v < 250 ? v : null; onChange && onChange(); });
      out.push(h("div", {class:"field-label"}, "Body weight ", h("small", null, "kg, optional — for starting weights")), bwIn);
    }
    if(part !== "basic"){
      out.push(...pick("Focus area", Object.entries(FOCUS_AREAS), "focus",
        draft.focus === "auto" ? (draft.sex === "female" ? "— extra glute & leg work" : draft.sex === "male" ? "— extra upper-body work" : "") : ""));
      const toggle = a => { draft.areas = draft.areas.includes(a) ? draft.areas.filter(x => x !== a) : [...draft.areas, a]; paint(); };
      out.push(h("div", {class:"field-label"}, "Joints to go easy on or pain areas ", h("small", null, "optional")),
        h("div", {class:"pick", role:"group"},
          h("button", {"aria-pressed":String(!draft.areas.length), onclick:() => { draft.areas = []; paint(); }}, "None"),
          Object.entries(BODY_AREAS).map(([k,t]) => h("button", {"aria-pressed":String(draft.areas.includes(k)), onclick:() => toggle(k)}, t))),
        h("p", {class:"tiny muted"}, "Exercises that load these areas are swapped for gentler ones. This is a guide, not medical advice: if pain is sharp, getting worse or lasts, stop and get it checked by a physio or doctor."));
    }
    if(part !== "body") out.push(h("p", {class:"tiny muted"}, "Sex, age, experience and body weight set your starting weights, rest and exercise versions. With Auto focus, women get extra glute & leg work and men extra upper-body work — pick a focus to change that."));
    wrap.replaceChildren(...out);
  };
  paint(); return wrap;
}
const aboutKey = p => JSON.stringify(p ? [p.sex, p.ageBracket, p.experience || "some", p.bodyweight || null, p.focus || "auto", [...(p.areas || [])].sort()] : null);
function savePersonal(draft){
  personal = normPersonal(draft); write(K.personal, personal);
  workouts = buildWeek(); nextIndex = nextIndex % workouts.length;       // the plan is rebuilt for the new profile
}
function download(name, data){
  const a = h("a", {href:URL.createObjectURL(new Blob([data], {type:"application/json"})), download:name});
  document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
}
function renderProfile(m){
  m.append(topline("Profile"));
  m.append(accountPanel(), h("h2", {class:"section profile-for"}, `${me.name}'s settings`));
  // Plan (live preview updates as you choose; Save applies it)
  const pd = clone(plan);
  const preview = h("div", {class:"plan-preview"});
  const save = h("button", {class:"btn block section", onclick:async () => {
    if(JSON.stringify(pd) === JSON.stringify(plan)) return;
    if(state && !(await ask("Update your plan?", "Your current workout keeps going. The new plan starts from session A next time.", "Update plan"))) return;
    applyPlan(pd); paintPlanSave(); toast("Plan saved. Today now shows your new programme.");
  }});
  const paintPreview = () => {
    const week = buildWeek(pd), changed = JSON.stringify(pd) !== JSON.stringify(plan);
    preview.replaceChildren(
      h("div", {class:"preview-head"}, h("b", null, changed ? "Preview of your new programme" : "Your current programme"),
        h("span", null, `${pd.days} sessions · ${pd.duration} min · ${EQUIPMENT[pd.equipment || "gym"]}`)),
      ...week.map((w,k) => { const n = splitName(w.name);
        return h("details", {class:"preview-session", "data-tone":k % 4},
          h("summary", null, h("span", {class:"l"}, n.letter), h("div", null, h("b", null, n.title), h("span", null, `${w.exercises.length} exercises`))),
          h("ol", null, w.exercises.map(e => h("li", {"data-block":e.block}, h("i", {class:"sw"}), exName(e.n), h("em", null, `${e.sets} × ${repsText(e.reps)}`))))); }));
  };
  const paintPlanSave = () => { const changed = JSON.stringify(pd) !== JSON.stringify(plan); actionState(save, changed, "Save plan", "Plan saved"); save.disabled = !changed; paintPreview(); };
  m.append(h("section", {class:"panel"}, h("h2", null, "Your plan"), planEditor(pd, paintPlanSave), preview, save));
  paintPlanSave();

  // About you
  const ad = personal ? clone(personal) : {sex:null, ageBracket:null, experience:"some", focus:"auto", areas:[], bodyweight:null};
  const aboutSave = h("button", {class:"btn block section", onclick:() => {
    if(!ad.sex || !ad.ageBracket) return;
    savePersonal(ad); paintAboutSave(); toast("Saved. Your plan has been updated for you."); go("profile");
  }});
  const paintAboutSave = () => {
    const complete = !!(ad.sex && ad.ageBracket);
    const changed = complete && aboutKey(normPersonal(ad)) !== aboutKey(personal);
    actionState(aboutSave, changed, "Save", complete ? "Saved" : "Choose sex and age");
    aboutSave.disabled = !changed;
  };
  m.append(h("section", {class:"panel section"}, h("h2", null, "About you"), aboutEditor(ad, () => paintAboutSave()), aboutSave));
  paintAboutSave();

  // Language & voice (choose, then Confirm)
  const vpanel = h("section", {class:"panel section"});
  const paintVoicePanel = () => {
    const mode = h("select", {"aria-label":"Voice coaching during workouts"}, [["off","Off"],["essential","Rest cues"],["full","Rest cues + encouragement"]].map(([v,t]) => h("option", {value:v}, t)));
    mode.value = voice.mode; mode.addEventListener("change", () => { voice.mode = mode.value; localStorage.setItem(K.voiceMode, voice.mode); });
    const snd = h("select", {"aria-label":"Rest timer sounds"}, h("option", {value:"on"}, "On"), h("option", {value:"off"}, "Off"));
    snd.value = voice.sounds ? "on" : "off"; snd.addEventListener("change", () => { voice.sounds = snd.value === "on"; localStorage.setItem(K.audio, snd.value); unlockAudio(); });
    const rate = h("select", {"aria-label":"Voice speed"}, [["0.75","Slower"],["0.9","Normal"],["1.05","Faster"]].map(([v,t]) => h("option", {value:v}, t)));
    rate.value = String([0.75,0.9,1.05].reduce((a,b) => Math.abs(b-voice.rate) < Math.abs(a-voice.rate) ? b : a));
    rate.addEventListener("change", () => { voice.rate = Number(rate.value); localStorage.setItem(K.rate, rate.value); });
    const vdraft = {lang:voice.lang, gender:voice.gender};
    const phoneVoice = h("div");
    /* Built from the voice you've just tapped (not only the confirmed one), so it updates instantly. */
    const paintSlot = () => {
      const g = vdraft.gender, lang = vdraft.lang, neutral = g === "neutral";
      const current = neutral ? voice.name : slotName(g, lang);
      const vsel = h("select", {"aria-label":`Voice used for ${genderLabel(g)}`});
      const label = v => { const tag = genderOf(v); return `${v.name}${v.lang ? ` · ${v.lang}` : ""}${tag ? ` · ${tag}` : ""}`; };
      const fill = () => { const vs = voices(lang); vsel.replaceChildren(h("option", {value:""}, "Auto (best match)"), ...vs.slice(0,20).map(v => h("option", {value:v.name}, label(v)))); vsel.value = vs.some(v => v.name === current) ? current : ""; };
      fill(); if("speechSynthesis" in window) speechSynthesis.onvoiceschanged = fill;
      vsel.addEventListener("change", () => {
        if(neutral){ voice.name = vsel.value; localStorage.setItem(K.voiceName, vsel.value); } else setSlot(g, lang, vsel.value);
        paintTest(); unlockAudio(); speakWith(SAMPLE[lang][g], {lang, gender:g, name:neutral ? vsel.value : ""});
      });
      const vsAll = voices(lang), assigned = !neutral && vsAll.some(v => v.name === slotName(g, lang));
      const hasReal = vsAll.some(v => genderOf(v) === g) || assigned;
      phoneVoice.replaceChildren(h("div", {class:"setting"}, h("span", null, `Voice used for ${genderLabel(g)}`), vsel),
        !neutral ? h("div", {class:"finder-cta" + (hasReal ? "" : " warn")},
          !hasReal ? h("p", {class:"small"}, g === "male"
            ? "Your phone hasn't given Zahi Fit a male voice yet, so Male is a deeper version of a female voice. Find a real male voice on your phone:"
            : "Find a real female voice on your phone:") : null,
          h("button", {class:"btn block " + (hasReal ? "" : "primary"), onclick:() => voiceFinder(g, () => { paintSlot(); paintTest(); }, lang)}, `Find a ${g} voice on this phone`)) : null);
    };
    const testBtn = h("button", {class:"btn block section"});
    const pending = () => vdraft.lang !== voice.lang || vdraft.gender !== voice.gender;
    const paintTest = () => pending() ? actionState(testBtn, true, "Test selected voice")
      : actionState(testBtn, localStorage.getItem(K.tested) !== voiceSig(), "Test voice", "Test voice again");
    testBtn.addEventListener("click", () => {
      unlockAudio(); cue.start();
      const wasPending = pending();
      const finish = () => { if(!wasPending) localStorage.setItem(K.tested, voiceSig()); paintTest(); };
      speakWith(SAY[vdraft.lang].test, {...vdraft, name:pending() ? "" : voice.name}, {onready:() => { testBtn.textContent = "Playing…"; }, onend:finish});
      setTimeout(() => { if(/Playing/.test(testBtn.textContent)) finish(); }, 12000);
    });
    paintTest(); paintSlot();
    rate.addEventListener("change", paintTest);
    vpanel.replaceChildren(h("h2", null, "Language & voice"),
      voiceEditor(paintVoicePanel, vdraft, () => { paintTest(); paintSlot(); }),
      h("div", {class:"section"}),
      h("div", {class:"setting"}, h("span", null, "During workouts"), mode),
      h("div", {class:"setting"}, h("span", null, "Rest timer sounds"), snd),
      h("div", {class:"setting"}, h("span", null, "Speed"), rate),
      phoneVoice,
      testBtn,
      h("button", {class:"btn ghost block", onclick:phoneSetupGuide}, "How to set up your phone's voices"));
  };
  paintVoicePanel();
  m.append(vpanel);

  // Data
  const file = h("input", {type:"file", accept:".json,application/json", class:"sr", "aria-label":"Choose a history backup file"});
  file.addEventListener("change", async () => {
    const f = file.files[0]; file.value = ""; if(!f) return;
    if(f.size > 2_000_000){ toast("That file is too large to be a Zahi Fit backup."); return; }
    try{
      const data = JSON.parse(await f.text());
      const rows = (Array.isArray(data) ? data : []).filter(r => r && typeof r.workout === "string" && !isNaN(new Date(r.date)) && Array.isArray(r.details));
      if(!rows.length){ toast("No workouts found in that file."); return; }
      const cur = getHistory(), seen = new Set(cur.map(r => r.date + r.workout));
      const add = rows.filter(r => !seen.has(r.date + r.workout));
      if(!(await ask("Import history?", `${add.length} new session${add.length === 1 ? "" : "s"} will be added. ${rows.length - add.length} already in your history will be skipped.`, "Import"))) return;
      setHistory([...cur, ...add].sort((a,b) => new Date(b.date) - new Date(a.date))); toast(`Imported ${add.length} sessions.`);
    }catch{ toast("That file isn't a valid Zahi Fit backup."); }
  });
  m.append(h("section", {class:"panel section"}, h("h2", null, `${me.name}'s data`),
    h("p", {class:"small muted"}, `${me.name}'s data is stored on this phone. Back it up before clearing browser data or switching phones.`),
    h("div", {class:"btn-row"},
      h("button", {class:"btn sm", onclick:() => download(`zahi-fit-${me.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-history-${new Date().toISOString().slice(0,10)}.json`, JSON.stringify(getHistory(), null, 2))}, "Back up history"),
      h("button", {class:"btn sm", onclick:() => file.click()}, "Restore backup")), file,
    h("button", {class:"btn sm block section", onclick:() => download("zahi-fit-coach-context.json", JSON.stringify(coachContext(), null, 2))}, "Export coach file"),
    h("button", {class:"btn danger sm block section", onclick:async () => {
      if(!(await ask(`Erase ${me.name}'s data?`, `${me.name}'s history, plan, profile and any workout in progress will be deleted from this phone. Other people aren't affected. Back up first if you might need it.`, "Erase", true))) return;
      Object.keys(K).filter(k => !DEVICE_KEYS.includes(k)).forEach(k => localStorage.removeItem(K[k])); location.reload();
    }}, `Erase ${me.name}'s data`)));

  m.append(isStandalone()
    ? h("section", {class:"panel section"}, h("h2", null, "App"), h("div", {class:"spread"}, h("span", null, "Installed on this phone"), h("button", {class:"btn idle sm", disabled:true}, "Installed ✓")))
    : installCard("profile"));
  m.append(h("p", {class:"tiny faint section center"}, `Zahi Fit ${VERSION}`, " · ",
    h("button", {class:"linkish", onclick:() => { checkForUpdate(true); }}, "Check for update")));
}

/* ---------- First-run setup ---------- */
function onboarding(){
  const draftAbout = personal ? clone(personal) : {sex:null, ageBracket:null, experience:"some", focus:"auto", areas:[], bodyweight:null};
  const draftPlan = clone(plan);
  let step = 0;
  const ov = h("div", {class:"onboard", role:"dialog", "aria-modal":"true"}), inner = h("div", {class:"app"});
  ov.append(inner);
  const done = () => { write(K.onboarded, true); ov.remove(); go("today"); };
  const paint = () => {
    inner.replaceChildren(h("div", {class:"progress"}, [0,1,2,3].map(k => h("i", {class:k <= step ? "on" : ""}))));
    if(step === 0){
      inner.append(h("h1", null, me.name && me.name !== "Me" ? `Hi ${me.name}, let's set up your training` : "Let's set up your training"), h("p", {class:"muted"}, "A few quick screens. You can change any of this later in Profile."), aboutEditor(draftAbout, null, "basic"));
    }else if(step === 1){
      inner.append(h("h1", null, "Your body"), h("p", {class:"muted"}, "Choose what to emphasise and anything to go easy on."), aboutEditor(draftAbout, null, "body"));
    }else if(step === 2){
      inner.append(h("h1", null, "What are you training for?"), h("p", {class:"muted"}, "Your weekly sessions are built from this."), planEditor(draftPlan));
    }else{
      const previewWeek = buildWeek(draftPlan, normPersonal(draftAbout));
      inner.append(h("h1", null, `Your ${draftPlan.days}-day plan`), h("p", {class:"muted"}, `${GOALS[draftPlan.primary]} focus · ${draftPlan.duration} min sessions`),
        h("div", {class:"tiles section"}, previewWeek.map((w,k) => { const n = splitName(w.name); return h("div", {class:"tile", "data-tone":k % 4}, h("span", {class:"l"}, n.letter), h("b", null, n.title), h("span", null, `${w.exercises.length} exercises`)); })));
    }
    inner.append(h("div", {class:"foot btn-row"},
      step === 0 ? h("button", {class:"btn", onclick:done}, "Skip for now") : h("button", {class:"btn", onclick:() => { step--; paint(); }}, "Back"),
      h("button", {class:"btn primary", onclick:() => {
        if(step === 1 && draftAbout.sex && draftAbout.ageBracket){ personal = normPersonal(draftAbout); write(K.personal, personal); }
        if(step < 3){ step++; paint(); }
        else { applyPlan(draftPlan); done(); }
      }}, step === 3 ? "Start training" : "Continue")));
    ov.scrollTo(0, 0);
  };
  paint();
  document.body.append(ov);
}

/* ---------- Service worker: user-controlled updates (never reload mid-set) ---------- */
let waitingSW = null, swReg = null;
function showUpdate(){
  if(document.querySelector(".update")) return;
  document.body.append(h("div", {class:"update", role:"status"}, h("span", null, "A new version of Zahi Fit is ready."),
    h("button", {class:"btn primary sm", onclick:() => { if(state) persist(); if(waitingSW) waitingSW.postMessage({type:"SKIP_WAITING"}); else location.reload(); }}, "Update")));
}
function checkForUpdate(manual){
  if(!swReg){ if(manual) toast("Updates aren't available in this browser."); return; }
  swReg.update().then(() => { if(swReg.waiting){ waitingSW = swReg.waiting; showUpdate(); } else if(manual) toast("You're on the latest version."); }).catch(() => manual && toast("Couldn't check. Are you online?"));
}
function setupSW(){
  if(!("serviceWorker" in navigator)) return;
  let reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => { if(reloading) return; reloading = true; location.reload(); });
  navigator.serviceWorker.register("sw.js").then(reg => {
    swReg = reg;
    if(reg.waiting && navigator.serviceWorker.controller){ waitingSW = reg.waiting; showUpdate(); }
    reg.addEventListener("updatefound", () => {
      const nw = reg.installing; if(!nw) return;
      nw.addEventListener("statechange", () => { if(nw.state === "installed" && navigator.serviceWorker.controller){ waitingSW = nw; showUpdate(); } });
    });
    document.addEventListener("visibilitychange", () => { if(document.visibilityState === "visible") reg.update().catch(() => {}); });
  }).catch(() => {});
}

/* ---------- Install on phone (Add to Home screen) ---------- */
let installPrompt = null;
const isStandalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault(); installPrompt = e;
  if(view === "today" || view === "profile") go(view);   // show the Install button now that it can work
});
window.addEventListener("appinstalled", () => {
  installPrompt = null; toast("Zahi Fit is installed. Open it from your home screen.");
  if(view === "today" || view === "profile") go(view);
});
async function installApp(){
  if(installPrompt){
    installPrompt.prompt();
    const choice = await installPrompt.userChoice.catch(() => null);
    installPrompt = null;
    if(choice && choice.outcome === "accepted") toast("Installing Zahi Fit…");
    if(view === "today" || view === "profile") go(view);
    return;
  }
  installHelp();
}
function installHelp(){
  sheet(card => {
    const ol = (...items) => h("ol", {class:"howto"}, items.map(x => h("li", null, x)));
    card.append(h("h2", null, "Install Zahi Fit on your phone"),
      h("p", {class:"small muted"}, "It installs straight from this page — no app store needed. It then opens full screen from its own icon and works offline."),
      isIOS()
        ? h("div", null, h("h3", {class:"section"}, "iPhone (Safari)"),
            ol("Open this page in Safari (not Chrome).", "Tap the Share button (square with an arrow).", "Scroll down and tap Add to Home Screen, then Add."))
        : h("div", null, h("h3", {class:"section"}, "Android (Chrome)"),
            ol("Tap the ⋮ menu at the top right of Chrome.", "Tap Install app (or Add to Home screen › Install).", "Confirm. The Zahi Fit icon appears on your home screen."),
            h("p", {class:"tiny muted"}, "Don't see Install app? Zahi Fit may already be installed — check your home screen and app drawer for the Zahi Fit icon.")),
      h("p", {class:"small muted section"}, "Your workouts, plan and settings stay on this phone; the installed app uses the same data."));
  });
}
function installCard(where){
  if(isStandalone()) return null;
  if(where === "today" && localStorage.getItem(K.installHide) === "1") return null;
  const ready = !!installPrompt;
  return h("section", {class:"install-card" + (where === "profile" ? " section" : "")},
    h("img", {src:"icon-192.png", alt:"", width:"48", height:"48"}),
    h("div", {class:"install-copy"}, h("b", null, "Install Zahi Fit"), h("span", null, ready ? "Add it to your home screen. Opens full screen, works offline." : "Add it to your home screen in a few taps.")),
    h("div", {class:"install-actions"},
      h("button", {class:"btn primary sm", onclick:installApp}, ready ? "Install" : "How to install"),
      where === "today" ? h("button", {class:"linkish tiny", onclick:() => { localStorage.setItem(K.installHide, "1"); go("today"); }}, "Not now") : null));
}

/* Zahi Fit v5.0 — Food: meal logging, calorie & protein targets, weekly view, pattern learning, suggestions.
   Free on-device: quick-add, favourites, built-in food list, targets, weekly view, patterns.
   Online: USDA search (free) and AI features (photo, "I had…", ideas, coach review) via the zahi-fit-food Worker. */
const FOOD_ENDPOINT = "https://zahi-fit-food.chamounzahi.workers.dev";
const SLOTS = {breakfast:"Breakfast", lunch:"Lunch", dinner:"Dinner", snack:"Snacks"};
const DIETS = {balanced:"Balanced", high_protein:"High-protein", keto:"Keto", mediterranean:"Mediterranean", vegan:"Vegan"};
const PROTEIN_SRC = {meat_fish:"Meat, chicken & fish", pescatarian:"Fish, no meat", plant:"Plant-based", any:"Anything"};
const COOKING = {cook:"Mostly cook", order:"Mostly order", mix:"A mix"};
const EFFORT = {high:"Happy to meal-prep", low:"Low effort", zero:"Zero effort"};
const FOOD_GOALS = {plan:"Follow my training goal", fat_loss:"Lose fat", maintain:"Maintain", muscle:"Gain muscle"};

const dayKey = (d = new Date()) => { const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,"0")}-${String(x.getDate()).padStart(2,"0")}`; };
const shiftDay = (key, n) => { const [y,m,d] = key.split("-").map(Number); return dayKey(new Date(y, m-1, d + n)); };
const r0 = n => Math.round(Number(n) || 0);
const foodLog = () => read(K.food, []) || [];
const saveFoodLog = list => write(K.food, list);
const foodSettings = () => read(K.foodSet, null);
const slotForNow = (t = new Date()) => { const h = t.getHours(); return h < 11 ? "breakfast" : h < 16 ? "lunch" : h < 22 ? "dinner" : "snack"; };
const NUTR = ["kcal","protein","carbs","fat","fiber","satFat","sodium"];
const totals = items => items.reduce((a, x) => { NUTR.forEach(k => { a[k] += +x[k] || 0; }); return a; }, {kcal:0, protein:0, carbs:0, fat:0, fiber:0, satFat:0, sodium:0});
const mealsOn = key => foodLog().filter(m => m.date === key);
const normName = s => String(s || "").trim().toLowerCase().replace(/\s+/g, " ");
let foodDay = null;   // the day shown on the Food tab

/* ---------- targets (from the training profile + food setup) ---------- */
const AGE_MID = {"18-29":24, "30-39":35, "40-49":45, "50-59":55, "60+":65};
function foodTargets(){
  const fs = foodSettings() || {}, per = personal || {};
  const sex = per.sex || "male", age = AGE_MID[per.ageBracket] || 35;
  const w = Number(fs.weight) || per.bodyweight || (sex === "female" ? 65 : 80);
  const ht = Number(fs.height) || (sex === "female" ? 163 : 176);
  const bmr = 10*w + 6.25*ht - 5*age + (sex === "female" ? -161 : 5);
  const act = {2:1.375, 3:1.45, 4:1.5, 5:1.6, 6:1.7}[plan.days] || 1.45;
  const goal = fs.goal && fs.goal !== "plan" ? fs.goal : ({fat_loss:"fat_loss", muscle:"muscle", strength:"muscle"}[plan.primary] || "maintain");
  const adj = {fat_loss:0.85, muscle:1.08, maintain:1}[goal] || 1;
  let kcal = Math.round(bmr * act * adj / 10) * 10;
  // protein from a healthy reference weight so it stays realistic at any body size
  const refW = Math.min(w, 25 * (ht/100) ** 2);
  const perKg = fs.diet === "high_protein" ? 2.2 : goal === "muscle" || goal === "fat_loss" ? 2.0 : 1.6;
  let protein = Math.round(refW * perKg / 5) * 5;
  if(Number(fs.kcalTarget) > 800) kcal = Number(fs.kcalTarget);
  if(Number(fs.proteinTarget) > 20) protein = Number(fs.proteinTarget);
  const keto = fs.diet === "keto";
  const fat = keto ? Math.round((kcal - protein*4 - 30*4) / 9) : Math.round(kcal * 0.3 / 9);
  const carbs = keto ? 30 : Math.max(0, Math.round((kcal - protein*4 - fat*9) / 4));
  const satFat = Math.round(kcal * 0.10 / 9);                  // under 10% of calories
  const sodium = 2300;                                          // mg per day (about one teaspoon of salt)
  const fiber = Math.round(kcal / 1000 * 14);                   // 14 g per 1,000 kcal
  const water = Math.round(Math.min(4500, Math.max(2000, w * 33)) / 250) * 250;   // ml
  return {kcal, protein, carbs, fat, keto, goal, weight:w, height:ht, satFat, sodium, fiber, water};
}

/* ---------- workouts (from the training side) ---------- */
function workoutsOn(key){
  return getHistory().filter(x => dayKey(x.date) === key).map(x => {
    const min = Number(x.minutes) || 45, w = (foodSettings() || {}).weight || (personal && personal.bodyweight) || 80;
    return {name:String(x.workout || "Workout").replace(/^[A-Z] — /, ""), minutes:min, estimatedBurn:Math.round(min * 6.5 * w / 80), finishedAt:x.date};
  });
}
function recentWorkout(){
  const last = getHistory()[0]; if(!last) return null;
  const mins = (Date.now() - new Date(last.date).getTime()) / 60000;
  return mins >= 0 && mins <= 120 ? {...workoutsOn(dayKey(last.date))[0], minutesAgo:Math.round(mins)} : null;
}

/* ---------- what the app learns (all on this phone) ---------- */
function foodPatterns(){
  const log = foodLog(), days = [...new Set(log.map(m => m.date))].sort();
  const counts = {};
  log.forEach(m => { const k = normName(m.name); counts[k] = counts[k] || {name:m.name, n:0, kcal:0, protein:0, items:m.items}; counts[k].n++; counts[k].kcal += m.kcal; counts[k].protein += m.protein; });
  const repertoire = Object.values(counts).sort((a,b) => b.n - a.n).slice(0, 20).map(x => ({meal:x.name, times:x.n, avgKcal:r0(x.kcal/x.n), avgProtein:r0(x.protein/x.n)}));
  const recent = days.slice(-14);
  const breakfastDays = recent.filter(d => log.some(m => m.date === d && m.slot === "breakfast")).length;
  const byWeekday = Array(7).fill(0).map(() => ({kcal:0, n:0}));
  recent.forEach(d => { const t = totals(log.filter(m => m.date === d)); const wd = new Date(d + "T12:00").getDay(); byWeekday[wd].kcal += t.kcal; byWeekday[wd].n++; });
  const orders = log.filter(m => /shawarma|pizza|burger|pad thai|mandi|kebab|fries|mcdonald|kfc|starbucks/i.test(m.name)).length;
  return {daysLogged:days.length, repertoire,
    breakfast: recent.length >= 5 ? (breakfastDays / recent.length < 0.4 ? "often skipped" : breakfastDays / recent.length > 0.8 ? "regular" : "sometimes") : "not enough data",
    biggestDay: recent.length >= 7 ? byWeekday.map((x,i) => ({i, avg:x.n ? x.kcal/x.n : 0})).sort((a,b) => b.avg - a.avg)[0].i : null,
    orderedShare: log.length ? Math.round(100 * orders / log.length) : 0};
}
const WEEKDAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
function noticed(){
  const p = foodPatterns(), t = foodTargets(), out = [];
  if(p.daysLogged < 7) return out;
  if(p.breakfast === "often skipped") out.push("You often skip breakfast. That's fine — a 60-second protein shake or Greek yogurt would make protein much easier.");
  if(p.biggestDay != null) out.push(`${WEEKDAYS[p.biggestDay]}s are usually your biggest eating day. Worth planning around, not avoiding.`);
  const w = weekStats(dayKey());
  if(w.logged >= 4 && w.avgProtein < t.protein * 0.85) out.push(`Protein has averaged ${w.avgProtein} g against ${t.protein} g. One extra protein hit a day closes most of that gap.`);
  if(p.repertoire[0] && p.repertoire[0].times >= 3) out.push(`Your go-to is "${p.repertoire[0].meal}" (${p.repertoire[0].times}×). It's saved as a one-tap meal.`);
  return out.slice(0, 3);
}
function weekStats(endKey){
  const t = foodTargets(), keys = Array.from({length:7}, (_, i) => shiftDay(endKey, i - 6));
  const days = keys.map(k => { const s = totals(mealsOn(k)); return {key:k, ...s, logged:mealsOn(k).length > 0}; });
  const logged = days.filter(d => d.logged);
  const avg = f => logged.length ? r0(logged.reduce((a, d) => a + d[f], 0) / logged.length) : 0;
  return {days, logged:logged.length, avgKcal:avg("kcal"), avgProtein:avg("protein"),
    onTarget:logged.filter(d => d.kcal >= t.kcal*0.85 && d.kcal <= t.kcal*1.1 && d.protein >= t.protein*0.9).length,
    proteinDays:logged.filter(d => d.protein >= t.protein*0.9).length};
}
function localWeekLine(w, t){
  if(!w.logged) return "Log a few meals and your week will show up here — no pressure to be perfect.";
  const parts = [];
  if(w.proteinDays >= 4) parts.push(`You hit protein on ${w.proteinDays} days — that's what builds muscle.`);
  else parts.push(`${w.logged} day${w.logged > 1 ? "s" : ""} logged this week — nice.`);
  const diff = w.avgKcal - t.kcal;
  parts.push(Math.abs(diff) <= t.kcal * 0.08 ? "Calories are averaging right on target." : diff > 0 ? `Averaging about ${r0(diff)} kcal over — easy to balance over the week.` : `Averaging about ${r0(-diff)} kcal under — room for a solid meal or two.`);
  return parts.join(" ");
}

/* ---------- context for the AI coach ---------- */
function foodContext(extra = {}){
  const fs = foodSettings() || {}, t = foodTargets(), key = foodDay || dayKey();
  const meals = mealsOn(key), tt = totals(meals), w = weekStats(key);
  return {
    now:new Date().toString().slice(0, 21), language:typeof voice !== "undefined" ? voice.lang : "en",
    person:{name:me && me.name, sex:personal && personal.sex, ageBracket:personal && personal.ageBracket, weightKg:t.weight, heightCm:t.height},
    goal:FOOD_GOALS[fs.goal || "plan"], trainingGoal:GOALS[plan.primary], targets:{kcal:t.kcal, protein_g:t.protein, carbs_g:t.carbs, fat_g:t.fat, netCarbs:t.keto},
    diet:DIETS[fs.diet || "balanced"], proteinSources:PROTEIN_SRC[fs.protein || "any"], cooking:COOKING[fs.cooking || "mix"], effort:EFFORT[fs.effort || "low"],
    today:{date:key, meals:meals.map(m => ({slot:m.slot, meal:m.name, kcal:r0(m.kcal), protein:r0(m.protein), time:new Date(m.time).toTimeString().slice(0,5)})),
      totals:{kcal:r0(tt.kcal), protein:r0(tt.protein), carbs:r0(tt.carbs), fat:r0(tt.fat), fiber:r0(tt.fiber), satFat:r0(tt.satFat), sodium_mg:r0(tt.sodium)}},
    workoutsToday:workoutsOn(key), recentWorkout:recentWorkout(), burnedToday:burnedOn(key).total, balance:balances()[key] || null,
    limits:{satFat_g:t.satFat, sodium_mg:t.sodium, fiber_g:t.fiber, water_ml:t.water}, waterToday_ml:waterOn(key),
    nextPlannedSession:workouts && workouts[nextIndex] ? workouts[nextIndex].name : null,
    week:{daysLogged:w.logged, avgKcal:w.avgKcal, avgProtein:w.avgProtein, daysOnTarget:w.onTarget, proteinDays:w.proteinDays},
    patterns:foodPatterns(), ...extra
  };
}
function foodContextBrief(){
  if(!foodLog().length) return null;
  const c = foodContext(); return {targets:c.targets, today:c.today.totals, week:c.week, diet:c.diet};
}
async function foodAI(path, body, ms = 30000){
  if(navigator.onLine === false) throw new Error("offline");
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), ms);
  try{
    const res = await fetch(FOOD_ENDPOINT + path, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body), signal:ctl.signal});
    const data = await res.json().catch(() => ({}));
    if(!res.ok) throw Object.assign(new Error(data.error || `Food service error ${res.status}`), {status:res.status});
    return data;
  } finally { clearTimeout(timer); }
}
function aiTrouble(err){
  if(err && err.message === "offline") return "You're offline. Quick-add and the food list still work.";
  if(err && err.name === "AbortError") return "The food coach took too long. Try again, or use quick-add.";
  if(err && (err.status === 404 || err.name === "TypeError")) return "The food coach isn't set up yet (zahi-fit-food Worker). Quick-add and the food list work without it.";
  return (err && err.message) || "The food coach didn't answer. Quick-add and the food list still work.";
}
function busySheet(text){
  let closeIt = () => {};
  sheet((card, close) => { closeIt = close; card.append(h("div", {class:"food-busy"}, h("span", {class:"spinner"}), h("b", null, text), h("p", {class:"tiny muted"}, "This uses the AI food coach.")));});
  return () => closeIt();
}

/* ---------- logging ---------- */
function asItem(f, mult = 1){ const base = {}; NUTR.forEach(k => { base[k] = +f[k] || 0; }); return {name:f.name, serving:f.serving || "1 serving", base, qty:mult}; }
const itemValues = it => { const v = {name:it.name, serving:it.serving, qty:it.qty}; NUTR.forEach(k => { v[k] = (it.base[k] || 0) * it.qty; }); return v; };
const roundMeal = t => ({kcal:r0(t.kcal), protein:+t.protein.toFixed(1), carbs:+t.carbs.toFixed(1), fat:+t.fat.toFixed(1), fiber:+t.fiber.toFixed(1), satFat:+t.satFat.toFixed(1), sodium:r0(t.sodium)});
function saveMeal(meal){
  const list = foodLog(); list.push(meal); saveFoodLog(list);
  if(meal.date === dayKey()) setTimeout(() => applyBalance(), 50);
  // after the same meal twice, offer a one-tap button
  const quick = quickList(), n = list.filter(m => normName(m.name) === normName(meal.name)).length;
  if(n >= 2 && !quick.some(q => normName(q.name) === normName(meal.name)) && !(read(K.foodSeen, []) || []).includes(normName(meal.name))){
    setTimeout(async () => {
      const yes = await ask(`Save "${meal.name}" as a quick-add?`, "Next time it's one tap.", "Save it");
      if(yes){ addQuick({name:meal.name, items:meal.items}); toast("Saved as a quick-add."); if(view === "food") go("food"); }
      else write(K.foodSeen, [...(read(K.foodSeen, []) || []), normName(meal.name)]);
    }, 400);
  }
}
/* Voice typing into a text box (Chrome/Android; free, uses the phone's speech recognition). */
function dictate(input, btn, after){
  const SRX = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SRX){ toast("Voice input isn't available here — type it instead."); return; }
  try{
    const rec = new SRX(); rec.lang = voice.lang === "de" ? "de-DE" : "en-US"; rec.interimResults = false;
    const label = btn.textContent; btn.textContent = "…";
    rec.onresult = e => { input.value = (input.value ? input.value + " " : "") + e.results[0][0].transcript; input.dispatchEvent(new Event("input")); after && after(); };
    rec.onend = () => { btn.textContent = label; }; rec.onerror = () => { btn.textContent = label; toast("Couldn't hear that — try again or type it."); };
    rec.start();
  }catch{ toast("Voice input isn't available here — type it instead."); }
}
function logSheet({name, items, slot, source, note, question, date}){
  const its = items.map(x => x.base ? {...x} : asItem(x, x.qty || 1));
  let mealName = name || its.map(x => x.name).join(" + "), mealSlot = slot || slotForNow();
  let curNote = note || null, curQuestion = question || null, askOpen = !!question, asking = false;
  sheet((card, close) => {
    const body = h("div");
    /* Answer the coach's question — or add more to this meal by describing it. */
    const ansIn = h("input", {class:"text-input", placeholder:"e.g. toast with butter and a coffee", "aria-label":"Your answer", autocomplete:"off"});
    const ansBtn = h("button", {class:"btn sm primary"}, "Add");
    const micBtn = h("button", {class:"icon-btn", "aria-label":"Say it", onclick:() => dictate(ansIn, micBtn)}, "🎙");
    ansIn.addEventListener("keydown", e => { if(e.key === "Enter") ansBtn.click(); });
    ansBtn.addEventListener("click", async () => {
      const ans = ansIn.value.trim(); if(!ans || asking) return;
      asking = true; ansBtn.textContent = "Adding…"; ansBtn.disabled = true;
      const already = its.map(itemValues).map(v => `${v.name} (${v.serving}${v.qty !== 1 ? ` ×${v.qty}` : ""}, ${r0(v.kcal)} kcal)`).join("; ");
      const text = `Follow-up for a ${SLOTS[mealSlot].toLowerCase()} I'm logging. Already in it: ${already}. ` +
        (curQuestion ? `You asked: "${curQuestion}". My answer: "${ans}". ` : `Also add: "${ans}". `) +
        "List ONLY the foods to ADD from my answer — do not repeat foods already in the meal. If my answer adds nothing (like \"no\" or \"that's all\"), return an empty meals list and a short friendly note.";
      try{
        const data = await foodAI("/log", {text, context:foodContext()});
        const added = (data.meals || []).flatMap(m => m.items || []).filter(x => x && x.name);
        added.forEach(x => its.push(asItem({name:x.name, serving:x.serving || "estimate", kcal:+x.kcal||0, protein:+x.protein||0, carbs:+x.carbs||0, fat:+x.fat||0, fiber:+x.fiber||0, satFat:+x.satFat||0, sodium:+x.sodium||0})));
        curNote = data.note || (added.length ? `Added ${added.map(x => x.name).join(", ")}.` : "Got it — nothing added.");
        curQuestion = added.length ? (data.question || null) : null;
        askOpen = !!curQuestion; ansIn.value = "";
        if(added.length && !name) mealName = its.map(x => x.name).join(" + ");
        nameIn.value = mealName;
      }catch(err){ curNote = aiTrouble(err); }
      asking = false; ansBtn.textContent = "Add"; ansBtn.disabled = false; paint();
    });
    const answerBox = () => askOpen || curQuestion
      ? h("div", {class:"answer-box"},
          curQuestion ? h("p", {class:"small food-q"}, "🤔 " + curQuestion) : h("p", {class:"small"}, "Anything else in this meal? Describe it:"),
          h("div", {class:"answer-row"}, ansIn, micBtn, ansBtn),
          curQuestion ? h("div", {class:"chip-line"}, h("button", {class:"chip", onclick:() => { curQuestion = null; askOpen = false; curNote = "Got it."; paint(); }}, "No, that's all")) : null)
      : h("button", {class:"linkish", onclick:() => { askOpen = true; paint(); setTimeout(() => ansIn.focus(), 50); }}, "💬 Add more by describing it");
    const paint = () => {
      const vals = its.map(itemValues), t = totals(vals);
      body.replaceChildren(
        curNote ? h("p", {class:"small food-note"}, curNote) : null,
        h("div", {class:"pick slot-pick", role:"group"}, Object.entries(SLOTS).map(([k,v]) => h("button", {"aria-pressed":String(mealSlot === k), onclick:() => { mealSlot = k; paint(); }}, v))),
        ...its.map((it, i) => { const v = vals[i];
          const kIn = h("input", {class:"kcal-in", inputmode:"numeric", value:String(r0(v.kcal)), "aria-label":`Calories for ${it.name}`});
          kIn.addEventListener("change", () => { const nv = Number(kIn.value); if(nv > 0 && v.kcal > 0){ const f = nv / (it.base.kcal * it.qty); NUTR.forEach(k => it.base[k] *= f); } else if(nv > 0){ it.base.kcal = nv / it.qty; } paint(); });
          return h("div", {class:"food-item"},
            h("div", {class:"fi-name"}, h("b", null, it.name), h("span", null, `${it.qty === 1 ? "" : `${+it.qty.toFixed(2)} × `}${it.serving} · ${r0(v.protein)} g protein`)),
            h("div", {class:"fi-qty"}, h("button", {class:"icon-btn", "aria-label":"Less", onclick:() => { it.qty = Math.max(0.25, it.qty - (it.qty > 1 ? 0.5 : 0.25)); paint(); }}, "−"),
              h("span", null, `×${+it.qty.toFixed(2)}`), h("button", {class:"icon-btn", "aria-label":"More", onclick:() => { it.qty = Math.min(10, it.qty + (it.qty >= 1 ? 0.5 : 0.25)); paint(); }}, "+")),
            h("label", {class:"fi-kcal"}, kIn, h("span", null, "kcal")),
            its.length > 1 ? h("button", {class:"icon-btn plain", "aria-label":`Remove ${it.name}`, onclick:() => { its.splice(i, 1); paint(); }}, "✕") : null); }),
        answerBox(),
        h("button", {class:"linkish", onclick:() => searchSheet(f => { its.push(asItem(f)); paint(); }, true)}, "+ Add from the food list"),
        h("div", {class:"food-total"}, h("b", null, `${r0(t.kcal)} kcal`), h("span", null, `P ${r0(t.protein)} g · C ${r0(t.carbs)} g · F ${r0(t.fat)} g`)));
    };
    const nameIn = h("input", {class:"text-input", value:mealName, maxlength:"60", "aria-label":"Meal name"});
    nameIn.addEventListener("input", () => { mealName = nameIn.value; });
    const go1 = h("button", {class:"btn primary block section", onclick:() => {
      const vals = its.map(itemValues); if(!vals.length) return;
      const t = totals(vals), day = date || foodDay || dayKey();
      const when = day === dayKey() ? new Date() : new Date(day + "T" + ({breakfast:"08:00", lunch:"13:00", dinner:"19:30", snack:"16:00"}[mealSlot]));
      saveMeal({id:"m" + Date.now().toString(36) + Math.random().toString(36).slice(2,5), date:day, time:when.toISOString(), slot:mealSlot,
        name:(mealName || vals.map(x => x.name).join(" + ")).trim(), items:vals.map(v => ({name:v.name, serving:v.serving, qty:v.qty, ...roundMeal(v)})),
        ...roundMeal(t), source:source || "quick"});
      close(); toast(`Logged: ${r0(t.kcal)} kcal, ${r0(t.protein)} g protein.`); if(view === "food" || view === "today") go(view);
    }}, "Log it ✓");
    card.append(h("h2", null, "Log a meal"), nameIn, body, go1);
    paint();
  });
}
function dietAllows(f){
  const p = (foodSettings() || {}).protein || "any", tags = f.tags || [];
  if(p === "plant") return !tags.includes("meat") && !tags.includes("fish") && (tags.includes("vegan") || !tags.includes("veg"));
  if(p === "pescatarian") return !tags.includes("meat");
  if(p === "meat_fish") return !(tags.includes("vegan") && /tofu|tempeh|lentil|chickpea curry|falafel/i.test(f.name));
  return true;
}
function searchSheet(onPick, nested){
  sheet((card, close) => {
    const input = h("input", {class:"text-input", placeholder:"Search: chicken, hummus, latte…", "aria-label":"Search foods", autocomplete:"off"});
    const list = h("div", {class:"food-results"}), more = h("div");
    const pick = f => { close(); onPick ? onPick(f) : logSheet({items:[f], source:f.source || "search"}); };
    const row = f => h("button", {class:"food-row", onclick:() => pick(f)}, h("div", null, h("b", null, f.name), h("span", null, `${f.serving} · ${r0(f.protein)} g protein`)), h("em", null, `${r0(f.kcal)} kcal`));
    const paint = () => {
      const q = normName(input.value), words = q.split(" ").filter(Boolean);
      const pool = FOODS.filter(dietAllows), fav = quickList().map(x => ({name:x.name, serving:"your usual", ...totals(x.items), items:x.items, fav:true}));
      const hits = (words.length ? [...fav, ...pool].filter(f => words.every(w => normName(f.name).includes(w))) : [...fav, ...pool.filter(f => f.tags.includes("quick"))]).slice(0, 30);
      list.replaceChildren(...hits.map(f => f.fav ? h("button", {class:"food-row", onclick:() => { close(); logSheet({name:f.name, items:f.items.map(x => asItem(x, 1)), source:"template"}); }}, h("div", null, h("b", null, "★ " + f.name), h("span", null, `${f.serving} · ${r0(f.protein)} g protein`)), h("em", null, `${r0(f.kcal)} kcal`)) : row(f)));
      more.replaceChildren(q.length >= 3 ? h("button", {class:"btn block section", onclick:() => usdaSearch(q)}, `Search more foods online for "${input.value.trim()}"`) : null);
    };
    const usdaSearch = async q => {
      more.replaceChildren(h("p", {class:"small muted"}, "Searching the USDA food database…"));
      try{
        const data = await foodAI("/usda", {q});
        const foods = (data.foods || []).map(f => ({...f, source:"usda", tags:[]}));
        more.replaceChildren(h("h3", {class:"section"}, "More foods (USDA)"), ...(foods.length ? foods.map(row) : [h("p", {class:"small muted"}, "Nothing found — try fewer words, or use \"Describe it\".")]));
      }catch(err){ more.replaceChildren(h("p", {class:"small muted"}, aiTrouble(err))); }
    };
    input.addEventListener("input", paint);
    card.append(h("h2", null, nested ? "Add a food" : "Search foods"), input, list, more);
    paint(); setTimeout(() => input.focus(), 150);
  });
}
function mealsFromAI(data, source){
  const meals = (data.meals || []).filter(m => m.items && m.items.length).map(m => ({
    name:m.name, slot:SLOTS[m.slot] ? m.slot : null,
    items:m.items.map(x => ({name:x.name, serving:x.serving || "estimate", kcal:+x.kcal||0, protein:+x.protein||0, carbs:+x.carbs||0, fat:+x.fat||0, fiber:+x.fiber||0, satFat:+x.satFat||0, sodium:+x.sodium||0}))}));
  if(!meals.length){ toast(data.question || "I couldn't work that out — try a few more words."); return; }
  if(meals.length === 1) logSheet({...meals[0], source, note:data.note, question:data.question});
  else batchSheet(meals, source, data.note);
}
function batchSheet(meals, source, note){
  const keep = meals.map(() => true);
  sheet((card, close) => {
    const list = h("div");
    const paint = () => list.replaceChildren(...meals.map((m, i) => { const t = totals(m.items);
      return h("label", {class:"batch-row"}, h("input", {type:"checkbox", checked:keep[i], onchange:e => { keep[i] = e.target.checked; }}),
        h("div", null, h("b", null, `${SLOTS[m.slot || "snack"]}: ${m.name}`), h("span", null, `${r0(t.kcal)} kcal · ${r0(t.protein)} g protein`))); }));
    card.append(h("h2", null, "Log these meals?"), note ? h("p", {class:"small food-note"}, note) : null, list,
      h("button", {class:"btn primary block section", onclick:() => {
        const day = foodDay || dayKey(); let n = 0;
        meals.forEach((m, i) => { if(!keep[i]) return; const vals = m.items, t = totals(vals); n++;
          const slotTime = {breakfast:"08:00", lunch:"13:00", dinner:"19:30", snack:"16:00"}[m.slot || "snack"];
          const at = day === dayKey() && (m.slot || "snack") === slotForNow() ? new Date() : new Date(day + "T" + slotTime);
          saveMeal({id:"m" + Date.now().toString(36) + i, date:day, time:at.toISOString(), slot:m.slot || "snack", name:m.name, items:vals,
            ...roundMeal(t), source}); });
        close(); toast(`Logged ${n} meal${n === 1 ? "" : "s"}.`); if(view === "food") go("food");
      }}, "Log selected"));
    paint();
  });
}
function describeSheet(){
  sheet((card, close) => {
    const ta = h("textarea", {class:"text-input food-ta", rows:"3", placeholder:"e.g. \"eggs and toast for breakfast\" or \"light day — coffee, salad for lunch, steak and potatoes for dinner\"", "aria-label":"Describe what you ate"});
    const go1 = h("button", {class:"btn block section", disabled:true}, "Work it out");
    const paint = () => { const ok = ta.value.trim().length >= 3; go1.disabled = !ok; actionState(go1, ok); };
    ta.addEventListener("input", paint);
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const mic = SR ? h("button", {class:"btn block", onclick:() => {
      try{
        const rec = new SR(); rec.lang = typeof voice !== "undefined" && voice.lang === "de" ? "de-DE" : "en-US"; rec.interimResults = false;
        mic.textContent = "🎙 Listening…"; rec.onresult = e => { ta.value = (ta.value ? ta.value + " " : "") + e.results[0][0].transcript; paint(); };
        rec.onend = () => { mic.textContent = "🎙 Say it"; }; rec.onerror = () => { mic.textContent = "🎙 Say it"; toast("Couldn't hear that — try again or type it."); };
        rec.start();
      }catch{ toast("Voice input isn't available here — type it instead."); }
    }}, "🎙 Say it") : null;
    go1.addEventListener("click", async () => {
      const text = ta.value.trim(); close();
      const done = busySheet("Working out your meal…");
      try{ const data = await foodAI("/log", {text, context:foodContext()}); done(); mealsFromAI(data, mic ? "text" : "text"); }
      catch(err){ done(); toast(aiTrouble(err)); }
    });
    card.append(h("h2", null, "Describe what you ate"), h("p", {class:"small muted"}, "Simple is fine — \"pizza\" works. Add detail if you like."), ta, mic, go1);
    paint(); setTimeout(() => ta.focus(), 150);
  });
}
function photoFlow(){
  const input = h("input", {type:"file", accept:"image/*", capture:"environment", hidden:true});
  document.body.append(input);
  input.addEventListener("change", async () => {
    const file = input.files && input.files[0]; input.remove(); if(!file) return;
    const done = busySheet("Looking at your meal…");
    try{
      const image = await shrinkImage(file, 768);
      const data = await foodAI("/photo", {image, context:foodContext()}, 45000);
      done(); mealsFromAI(data, "photo");
    }catch(err){ done(); toast(aiTrouble(err)); }
  });
  input.click();
}
function shrinkImage(file, max){
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => { const s = Math.min(1, max / Math.max(img.width, img.height)); const c = document.createElement("canvas");
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s); c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url); res(c.toDataURL("image/jpeg", 0.8)); };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error("Couldn't read that photo.")); };
    img.src = url;
  });
}

/* ---------- quick-add ---------- */
function quickList(){ return read(K.foodQuick, []) || []; }
function addQuick(q){ const l = quickList().filter(x => normName(x.name) !== normName(q.name)); l.unshift(q); write(K.foodQuick, l.slice(0, 16)); }
function quickChips(){
  const fav = quickList().map(q => ({label:q.name, fav:true, run:() => logSheet({name:q.name, items:q.items.map(x => asItem(x, 1)), source:"template"})}));
  const defs = DEFAULT_QUICK.map(n => FOODS.find(f => f.name === n)).filter(f => f && dietAllows(f) && !fav.some(q => normName(q.label) === normName(f.name)))
    .map(f => ({label:f.name.replace(/ \(.+\)$/, ""), run:() => logSheet({items:[f], source:"quick"})}));
  return h("div", {class:"quick-chips"}, [...fav, ...defs].slice(0, 12).map(q => h("button", {class:"chip" + (q.fav ? " fav" : ""), onclick:q.run}, (q.fav ? "★ " : "") + q.label)));
}

/* ---------- suggestions ---------- */
function localIdeas(){
  const t = foodTargets(), key = foodDay || dayKey(), tt = totals(mealsOn(key)), left = Math.max(0, t.protein - tt.protein);
  const rep = foodPatterns().repertoire.map(r => FOODS.find(f => normName(f.name) === normName(r.meal))).filter(Boolean);
  const pool = FOODS.filter(f => dietAllows(f) && f.protein >= 20).sort((a,b) => b.protein/b.kcal - a.protein/a.kcal);
  const quick = pool.filter(f => f.tags.includes("quick"));
  const opts = [rep[0] || pool[0], pool.find(f => f !== rep[0] && f.tags.includes("combo")) || pool[1], quick[0] || pool[2]].filter(Boolean);
  return {headline:left > 10 ? `${r0(left)} g protein to go today. A few easy options:` : "You're on track. If you're hungry:", options:opts.map((f, i) => ({kind:["familiar","new","fastest"][i], name:f.name, why:f.serving, kcal:f.kcal, protein:f.protein, carbs:f.carbs, fat:f.fat, prep_min:f.tags.includes("quick") ? 2 : 15})), local:true};
}
function ideasCard(){
  const box = h("section", {class:"panel section food-ideas"});
  const rw = recentWorkout();
  const kind = rw ? "post_workout" : "next";
  const title = rw ? `Refuel after ${rw.name}` : "What should I eat next?";
  const show = data => {
    box.replaceChildren(h("h2", null, title), h("p", {class:"small"}, data.headline || ""),
      ...(data.options || []).slice(0, 3).map(o => h("div", {class:"idea"},
        h("div", null, h("b", null, o.name), h("span", null, [o.kind === "familiar" ? "Your usual" : o.kind === "fastest" ? "Fastest" : o.kind === "new" ? "Something new" : null, o.prep_min ? `${o.prep_min} min` : null, `${r0(o.kcal)} kcal`, `${r0(o.protein)} g protein`].filter(Boolean).join(" · ")),
          o.why ? h("small", null, o.why) : null),
        h("button", {class:"btn sm primary", onclick:() => logSheet({items:[{name:o.name, serving:"estimate", kcal:o.kcal, protein:o.protein, carbs:o.carbs || 0, fat:o.fat || 0, fiber:0}], source:"suggestion"})}, "Log"))),
      h("button", {class:"linkish", onclick:ask1}, data.local ? "✨ Personal ideas from the food coach" : "↻ Other ideas"));
  };
  const ask1 = async () => {
    box.replaceChildren(h("h2", null, title), h("p", {class:"small muted"}, "Thinking about your day…"));
    try{ show(await foodAI("/suggest", {kind, context:foodContext()})); }
    catch(err){ show({...localIdeas(), headline:aiTrouble(err)}); }
  };
  box.append(h("h2", null, title),
    h("p", {class:"small muted"}, rw ? `You trained ${rw.minutesAgo} min ago (~${rw.estimatedBurn} kcal). Protein + carbs now helps recovery.` : "Ideas that fit what you've eaten today, your training and how you like to eat."),
    h("div", {class:"row2"}, h("button", {class:"btn", onclick:() => show(localIdeas())}, "Quick ideas"), h("button", {class:"btn primary", onclick:ask1}, "✨ Ask the food coach")));
  return box;
}

/* ---------- water ---------- */
const waterOn = key => (read(K.water, {}) || {})[key] || 0;
function addWater(key, ml){ const w = read(K.water, {}) || {}; w[key] = Math.max(0, (w[key] || 0) + ml); write(K.water, w); }

/* ---------- energy out + automatic balancing ----------
   Target stays fixed. Calories burned in training are shown separately.
   When food runs over the target on a fat-loss (or maintain) goal, steady cardio is added to today's workout
   automatically — capped at 40 min, never on a lighter/recovery day, and the rest is balanced over the week. */
const balances = () => read(K.balance, {}) || {};
const saveBalance = (key, b) => { const all = balances(); all[key] = b; write(K.balance, all); };
function steadyChoice(){
  const areas = (personal && personal.areas) || [];
  if(plan.equipment === "bodyweight" || areas.includes("knees") || areas.includes("ankles")) return "Brisk Walk or Easy Jog";
  return "StairMaster Steady State";
}
function burnRate(){ const w = foodTargets().weight; return 5.5 * w / 80; }          // kcal per minute of steady cardio (estimate)
function burnedOn(key){
  const done = workoutsOn(key).reduce((a, x) => a + x.estimatedBurn, 0);
  const b = balances()[key];
  const walk = b && b.mode === "walk" && b.done ? r0(b.minutes * burnRate()) : 0;
  const live = state && dayKey(new Date(state.startTime)) === key ? r0(Math.min(180, (Date.now() - state.startTime) / 60000) * 6.5 * foodTargets().weight / 80) : 0;
  return {training:done, walk, live, total:done + walk};
}
function balancePlan(key = dayKey()){
  const t = foodTargets(), eaten = totals(mealsOn(key)).kcal, over = r0(eaten - t.kcal);
  const tier = state && state.adaptation ? state.adaptation.tier : null;
  const base = {eaten:r0(eaten), target:t.kcal, over, minutes:0, kcal:0};
  if(over < 150) return {...base, reason:over > 0 ? "small" : "under"};
  if(!["fat_loss","maintain"].includes(t.goal)) return {...base, reason:"goal"};
  if(tier === "recovery" || tier === "easy") return {...base, reason:"light-day"};
  const extra = Math.min(over, 400), minutes = Math.min(40, Math.max(10, Math.round(extra / burnRate() / 5) * 5));
  return {...base, minutes, kcal:r0(minutes * burnRate()), rest:Math.max(0, over - r0(minutes * burnRate())), reason:"add"};
}
function balanceTime(key){
  const last = mealsOn(key).map(m => new Date(m.time)).sort((a,b) => b - a)[0] || new Date();
  const at = new Date(Math.max(Date.now(), last.getTime() + 75 * 60000));
  if(at.getHours() >= 22 || at.getHours() < 5) return "tomorrow morning";
  const m = Math.round(at.getMinutes() / 15) * 15; at.setMinutes(m % 60); if(m === 60) at.setHours(at.getHours() + 1);
  return `around ${at.toTimeString().slice(0,5)}`;
}
function balanceExercise(minutes){
  const src = findEx(steadyChoice()); if(!src) return null;
  const x = clone(src); x.sets = 1; x.reps = `${minutes} min easy-steady`; x.rest = 0; x.balance = true;
  return x;
}
/* Called whenever food changes and when a workout starts. Updates today's session automatically. */
function applyBalance(quiet){
  const key = dayKey(), p = balancePlan(key), prev = balances()[key] || {};
  if(prev.removed) return p;
  const trainedToday = workoutsOn(key).length > 0;
  const inSession = state && dayKey(new Date(state.startTime)) === key;
  const mode = inSession ? "session" : trainedToday ? "walk" : "next";
  if(!p.minutes){
    if(prev.minutes && inSession){ state.exercises = state.exercises.filter(x => !(x.balance && !x.sets.some(q => q.done))); persist(); }
    saveBalance(key, {...prev, minutes:0, kcal:0, mode, reason:p.reason});
    return p;
  }
  if(inSession){
    const existing = state.exercises.find(x => x.balance);
    if(existing){ existing.reps = `${p.minutes} min easy-steady`; existing.sets.forEach(q => { if(!q.done) q.r = ""; }); }
    else {
      const x = balanceExercise(p.minutes);
      if(x){ const at = state.exercises.findIndex(e => e.block === "Flexibility"); const row = {...x, skipped:false, rpe:null, sets:[{w:"", r:"", done:false}]};
        at >= 0 ? state.exercises.splice(at, 0, row) : state.exercises.push(row); }
    }
    persist();
  }
  const changed = prev.minutes !== p.minutes || prev.mode !== mode;
  saveBalance(key, {minutes:p.minutes, kcal:p.kcal, mode, over:p.over, done:prev.mode === mode ? !!prev.done : false, reason:"add", time:mode === "walk" ? balanceTime(key) : null});
  if(changed && !quiet) toast(mode === "session" ? `Added ${p.minutes} min steady cardio to today's workout to balance ~${p.over} kcal.`
    : mode === "next" ? `${p.minutes} min steady cardio will be added to today's workout.` : `Balance: ${p.minutes}-min brisk walk ${balanceTime(key)}.`);
  return p;
}
function balanceCard(key){
  if(key !== dayKey()) return null;
  const b = balances()[key] || {}, p = balancePlan(key), burn = burnedOn(key), t = foodTargets();
  const lines = [], actions = [];
  const walkName = steadyChoice() === "Brisk Walk or Easy Jog" ? "brisk walk" : "steady cardio";
  if(b.removed) lines.push("Balancing is off for today. The weekly average takes care of it.");
  else if(p.reason === "add" && b.mode === "session") lines.push(`✅ Added ${b.minutes} min ${walkName} to the workout you're doing now (~${b.kcal} kcal).`);
  else if(p.reason === "add" && b.mode === "next") lines.push(`✅ ${b.minutes} min ${walkName} will be added automatically when you start today's workout (~${b.kcal} kcal).`);
  else if(p.reason === "add" && b.mode === "walk") lines.push(b.done ? `✅ Balance walk done — ${b.minutes} min (~${b.kcal} kcal). Nice.` : `🚶 You've trained today, so a ${b.minutes}-min ${walkName} ${b.time || balanceTime(key)} balances it (~${b.kcal} kcal).`);
  else if(p.reason === "light-day") lines.push(`You're ~${p.over} kcal over, but today is a lighter day — no extra exercise. The week will balance it.`);
  else if(p.reason === "goal") lines.push(p.over > 0 ? `~${p.over} kcal over target — that's fine while you're building muscle.` : "");
  else if(p.reason === "small") lines.push("Right around target. 👌");
  else lines.push(`${r0(t.kcal - p.eaten).toLocaleString()} kcal left today.`);
  if(p.reason === "add" && p.rest > 50 && !b.removed) lines.push(`The other ~${p.rest} kcal is balanced over the rest of the week — no need to chase it today.`);
  if(p.reason === "add" && !b.removed){
    if(b.mode === "walk" && !b.done) actions.push(h("button", {class:"btn sm primary", onclick:() => { saveBalance(key, {...balances()[key], done:true}); toast("Logged. Well done."); go(view); }}, "Done ✓"));
    actions.push(h("button", {class:"btn sm", onclick:() => { saveBalance(key, {...balances()[key], removed:true, minutes:0});
      if(state){ state.exercises = state.exercises.filter(x => !(x.balance && !x.sets.some(q => q.done))); persist(); }
      toast("Removed for today."); go(view); }}, "Not today"));
  }
  const net = p.eaten - burn.total;
  return h("section", {class:"panel section balance-card"},
    h("h2", null, "Today's balance"),
    h("div", {class:"bal-row"},
      h("div", null, h("b", null, p.eaten.toLocaleString()), h("span", null, "eaten")),
      h("div", null, h("b", null, burn.total + burn.live ? `−${(burn.total + burn.live).toLocaleString()}` : "0"), h("span", null, burn.live ? "burned (live)" : "burned in training")),
      h("div", null, h("b", null, (net - burn.live).toLocaleString()), h("span", null, "net kcal")),
      h("div", null, h("b", null, t.kcal.toLocaleString()), h("span", null, "target"))),
    ...lines.filter(Boolean).map(l => h("p", {class:"small"}, l)),
    actions.length ? h("div", {class:"row2"}, ...actions) : null,
    h("p", {class:"tiny muted"}, "Burned calories are estimates from session length, type and your weight."));
}

/* ---------- screens ---------- */
/* kind "limit": turns orange when over (calories, carbs, fat, sat fat, salt); "aim": more is good (protein, fiber, water). */
function macroBar(label, val, target, unit = "g", kind = "limit"){
  const pct = target ? Math.min(100, 100 * val / target) : 0;
  const fill = h("i"); fill.style.width = `${pct}%`;          // set via CSSOM (inline style attributes are blocked by the CSP)
  if(kind === "limit" && target && val > target * 1.05) fill.classList.add("over");
  const fmt = n => unit === "L" ? (Math.round(n * 100) / 100).toString() : r0(n).toLocaleString();
  return h("div", {class:"macro"}, h("div", {class:"macro-top"}, h("span", null, label), h("b", null, `${fmt(val)} / ${fmt(target)} ${unit}`)),
    h("div", {class:"macro-bar"}, fill));
}
function kcalRing(val, target){
  const pct = Math.min(1, target ? val / target : 0), r = 42, c = 2 * Math.PI * r;
  const el = h("div", {class:"kcal-ring", role:"img", "aria-label":`${r0(val)} of ${r0(target)} calories`});
  el.innerHTML = `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="${r}" class="bg"/><circle cx="50" cy="50" r="${r}" class="fg" stroke-dasharray="${(c*pct).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 50 50)"/></svg>`;
  el.append(h("div", {class:"kr-text"}, h("b", null, r0(val).toLocaleString()), h("span", null, `of ${r0(target).toLocaleString()} kcal`)));
  return el;
}
function weekChart(w, t){
  const max = Math.max(t.kcal * 1.3, ...w.days.map(d => d.kcal)), el = h("div", {class:"week-chart", role:"img", "aria-label":"Calories for the last 7 days"});
  const bars = w.days.map((d, i) => { const hgt = d.kcal ? Math.max(4, 70 * d.kcal / max) : 0, y = 80 - hgt, cls = !d.logged ? "none" : d.protein >= t.protein * 0.9 ? "good" : "ok";
    return `<rect x="${i*40 + 8}" y="${y}" width="24" height="${hgt}" rx="5" class="${cls}"/><text x="${i*40 + 20}" y="96" text-anchor="middle">${WEEKDAYS[new Date(d.key + "T12:00").getDay()][0]}</text>`; }).join("");
  const ty = 80 - 70 * t.kcal / max;
  el.innerHTML = `<svg viewBox="0 0 280 100"><line x1="0" x2="280" y1="${ty}" y2="${ty}" class="target"/>${bars}</svg>`;
  return el;
}
function foodSetupSheet(first){
  const fs = {...{diet:"balanced", protein:"any", cooking:"mix", effort:"low", goal:"plan"}, ...(foodSettings() || {})};
  if(!fs.weight && personal && personal.bodyweight) fs.weight = personal.bodyweight;
  sheet((card, close) => {
    const body = h("div");
    const pick = (label, opts, key) => [h("div", {class:"field-label"}, label), h("div", {class:"pick", role:"group"}, Object.entries(opts).map(([v,t]) => h("button", {"aria-pressed":String(fs[key] === v), onclick:() => { fs[key] = v; paint(); }}, t)))];
    const num = (label, key, ph, sub) => { const i = h("input", {class:"text-input small-input", inputmode:"numeric", value:fs[key] || "", placeholder:ph, maxlength:"4"});
      i.addEventListener("input", () => { fs[key] = Number(i.value.replace(/\D/g, "")) || null; }); return [h("div", {class:"field-label"}, label, sub ? h("small", null, " " + sub) : null), i]; };
    const paint = () => body.replaceChildren(
      ...pick("How do you eat?", DIETS, "diet"), ...pick("Protein sources you actually eat", PROTEIN_SRC, "protein"),
      ...pick("Cooking or ordering?", COOKING, "cooking"), ...pick("Effort", EFFORT, "effort"), ...pick("Eating goal", FOOD_GOALS, "goal"),
      ...num("Height", "height", "cm", "cm — for your calorie target"), ...num("Weight", "weight", "kg", "kg"),
      ...num("Calorie target (optional)", "kcalTarget", "auto", "leave empty for automatic"), ...num("Protein target (optional)", "proteinTarget", "auto", "g"));
    paint();
    card.append(h("h2", null, first ? "Set up Food" : "Food settings"), h("p", {class:"small muted"}, "A few taps so suggestions fit how you really eat. Change it any time."), body,
      h("button", {class:"btn primary block section", onclick:() => { write(K.foodSet, fs); close(); toast("Saved. Targets updated."); if(view === "food") go("food"); }}, "Save"));
  });
}
function renderFood(m){
  foodDay = foodDay || dayKey();
  const t = foodTargets(), meals = mealsOn(foodDay), tt = totals(meals), isToday = foodDay === dayKey();
  const dateLabel = isToday ? "Today" : foodDay === shiftDay(dayKey(), -1) ? "Yesterday" : new Date(foodDay + "T12:00").toLocaleDateString(undefined, {weekday:"short", day:"numeric", month:"short"});
  m.append(h("div", {class:"topline"}, h("div", null, h("div", {class:"hello"}, "Food"), h("div", {class:"wordmark"}, dateLabel)),
    h("div", {class:"day-nav"}, h("button", {class:"icon-btn", "aria-label":"Previous day", onclick:() => { foodDay = shiftDay(foodDay, -1); go("food"); }}, "‹"),
      h("button", {class:"icon-btn", "aria-label":"Next day", disabled:isToday, onclick:() => { foodDay = shiftDay(foodDay, 1); go("food"); }}, "›"),
      h("button", {class:"icon-btn", "aria-label":"Food settings", onclick:() => foodSetupSheet(false)}, "⚙"))));
  const wo = workoutsOn(foodDay);
  m.append(h("section", {class:"panel food-summary"},
    h("div", {class:"fs-row"}, kcalRing(tt.kcal, t.kcal),
      h("div", {class:"fs-macros"}, macroBar("Protein", tt.protein, t.protein, "g", "aim"), t.keto ? macroBar("Net carbs", tt.carbs - tt.fiber, t.carbs) : macroBar("Carbs", tt.carbs, t.carbs), macroBar("Fat", tt.fat, t.fat))),
    h("details", {class:"more-nutr"}, h("summary", null, "Fiber, saturated fat & salt"),
      macroBar("Fiber (aim for)", tt.fiber, t.fiber, "g", "aim"), macroBar("Saturated fat (limit)", tt.satFat, t.satFat), macroBar("Sodium (limit)", tt.sodium, t.sodium, "mg")),
    wo.length ? h("p", {class:"tiny muted"}, `🔥 Burned in training: ${wo.map(x => `${x.name} ~${x.estimatedBurn} kcal`).join(", ")}`) : null));
  const wml = waterOn(foodDay);
  const wbar = h("div", {class:"macro-bar"}, (() => { const i = h("i"); i.style.width = `${Math.min(100, 100 * wml / t.water)}%`; return i; })());
  m.append(h("section", {class:"panel section water-card"}, h("div", {class:"spread"}, h("h2", null, "💧 Water"), h("span", {class:"small muted"}, `${Math.round(wml/10)/100} / ${Math.round(t.water/100)/10} L`)), wbar,
    h("div", {class:"row3"}, h("button", {class:"btn sm", onclick:() => { addWater(foodDay, -250); go("food"); }, disabled:wml <= 0}, "−"),
      h("button", {class:"btn sm primary", onclick:() => { addWater(foodDay, 250); go("food"); }}, "+ Glass 250 ml"),
      h("button", {class:"btn sm primary", onclick:() => { addWater(foodDay, 500); go("food"); }}, "+ Bottle 500 ml"))));
  const bc = balanceCard(foodDay); if(bc) m.append(bc);
  m.append(h("div", {class:"log-actions"},
    h("button", {class:"la", onclick:photoFlow}, h("span", null, "📷"), "Photo"),
    h("button", {class:"la", onclick:describeSheet}, h("span", null, "💬"), "Describe"),
    h("button", {class:"la", onclick:() => searchSheet()}, h("span", null, "🔍"), "Search")));
  m.append(h("h2", {class:"section"}, "Quick add"), quickChips());
  Object.entries(SLOTS).forEach(([k, label]) => {
    const list = meals.filter(x => x.slot === k); if(!list.length) return;
    const st = totals(list);
    m.append(h("section", {class:"panel section meal-slot"}, h("div", {class:"spread"}, h("h3", null, label), h("span", {class:"small muted"}, `${r0(st.kcal)} kcal · ${r0(st.protein)} g protein`)),
      ...list.map(x => h("button", {class:"meal-row", onclick:() => mealMenu(x)}, h("div", null, h("b", null, x.name), h("span", null, `${new Date(x.time).toTimeString().slice(0,5)}${x.source === "photo" ? " · 📷" : ""}`)), h("em", null, `${r0(x.kcal)} kcal`)))));
  });
  if(!meals.length) m.append(h("p", {class:"small muted section center"}, isToday ? "Nothing logged yet. Tap a quick-add — that's all it takes." : "Nothing logged this day."));
  m.append(ideasCard());
  const w = weekStats(foodDay);
  const review = h("p", {class:"small"}, localWeekLine(w, t));
  m.append(h("section", {class:"panel section"}, h("div", {class:"spread"}, h("h2", null, "Your week"), h("span", {class:"small muted"}, `${w.logged}/7 days logged`)),
    weekChart(w, t),
    h("div", {class:"week-stats"}, h("div", null, h("b", null, w.avgKcal.toLocaleString()), h("span", null, "avg kcal")), h("div", null, h("b", null, `${w.avgProtein} g`), h("span", null, "avg protein")), h("div", null, h("b", null, `${w.onTarget}/7`), h("span", null, "days on target"))),
    review,
    w.logged >= 3 ? h("button", {class:"linkish", onclick:async e => { const b = e.currentTarget; b.textContent = "Writing your review…";
      try{ const d = await foodAI("/weekly", {context:foodContext()}); review.textContent = d.summary || review.textContent; b.remove(); }
      catch(err){ b.textContent = "✨ Coach review of my week"; toast(aiTrouble(err)); } }}, "✨ Coach review of my week") : null));
  const notes = noticed();
  if(notes.length) m.append(h("section", {class:"panel section"}, h("h2", null, "What I've noticed"), h("ul", {class:"noticed"}, notes.map(n => h("li", null, n)))));
  m.append(h("p", {class:"tiny faint section center"}, "Estimates, not exact science. Weekly averages matter more than any single day."));
  if(!foodSettings()) setTimeout(() => { if(view === "food" && !foodSettings()) foodSetupSheet(true); }, 300);
}
function mealMenu(x){
  sheet((card, close) => card.append(h("h2", null, x.name), h("p", {class:"small muted"}, `${SLOTS[x.slot]} · ${r0(x.kcal)} kcal · P ${r0(x.protein)} g · C ${r0(x.carbs)} g · F ${r0(x.fat)} g`),
    h("ul", {class:"small"}, x.items.map(i => h("li", null, `${i.name} — ${r0(i.kcal)} kcal`))),
    h("button", {class:"btn block section", onclick:() => { close(); logSheet({name:x.name, items:x.items.map(i => asItem(i, 1)), slot:slotForNow(), source:"template", date:dayKey()}); }}, "Log again today"),
    !quickList().some(q => normName(q.name) === normName(x.name)) ? h("button", {class:"btn block section", onclick:() => { addQuick({name:x.name, items:x.items}); close(); toast("Saved as a quick-add."); go("food"); }}, "★ Save as quick-add") : null,
    h("button", {class:"btn danger sm block section", onclick:() => { saveFoodLog(foodLog().filter(y => y.id !== x.id)); close(); applyBalance(true); toast("Removed."); go(view); }}, "Remove")));
}
/* Small card on Today */
function foodTodayCard(){
  const t = foodTargets(), tt = totals(mealsOn(dayKey()));
  return h("section", {class:"panel section food-today", onclick:() => { foodDay = dayKey(); go("food"); }, role:"button", tabindex:"0"},
    h("div", {class:"spread"}, h("h2", null, "Food today"), h("span", {class:"linkish"}, "Log ›")),
    macroBar("Calories", tt.kcal, t.kcal, "kcal"), macroBar("Protein", tt.protein, t.protein, "g", "aim"),
    (() => { const b = burnedOn(dayKey()), bl = balances()[dayKey()] || {};
      return h("p", {class:"tiny muted"}, [b.total ? `🔥 ~${b.total} kcal burned in training` : null, `💧 ${(waterOn(dayKey())/1000).toFixed(1)} / ${(t.water/1000).toFixed(1)} L`,
        bl.minutes && !bl.removed ? `➕ ${bl.minutes} min balance cardio ${bl.mode === "walk" ? (bl.done ? "done" : "today") : "added to today's workout"}` : null].filter(Boolean).join(" · ")); })());
}

/* ---------- boot ---------- */
document.querySelectorAll(".tab").forEach(t => t.addEventListener("click", () => go(t.dataset.tab)));
document.addEventListener("pointerdown", unlockAudio, {once:true});
document.addEventListener("visibilitychange", () => { if(document.visibilityState === "visible") paintRest(); });
setupSW();
if(LOCKED) renderAuth();
else {
  go(state ? "workout" : "today");
  if(!personal && !read(K.onboarded, false) && !getHistory().length) onboarding();
}
})();
