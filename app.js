"use strict";
/* Zahi Fit v4.0 — single application script.
   Replaces app.js + v24/v25/v251/v27/v271 overlays. Uses the same localStorage keys,
   so workout history, plan, profile and an in-progress workout carry over. */
(() => {
const VERSION = "4.0.0";
const PT_ENDPOINT = "https://zahi-fit-pt.chamounzahi.workers.dev";
const K = {
  history:"history", next:"nextWorkout", active:"activeWorkoutV230",
  plan:"zahiFitProfileV25", personal:"zahiFitPersonalProfileV27",
  voiceMode:"zahiFitVoiceModeV27", audio:"zahiFitAudioEnabledV27",
  rate:"zahiFitVoiceRateV312", voiceName:"zahiFitVoiceNameV313",
  chat:"zahiFitPTConversationV26", onboarded:"zahiFitOnboardedV4"
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

/* ---------- toast + dialog (replace alert/confirm) ---------- */
let toastTimer;
function toast(msg){
  document.querySelector(".toast")?.remove();
  const t = h("div", {class:"toast", role:"status"}, msg);
  document.body.append(t);
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.remove(), 2600);
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

/* ---------- plan (from v2.5 planner) ---------- */
const GOALS = {
  fat_loss:"Fat loss", muscle:"Muscle gain", strength:"Strength",
  endurance:"Endurance", athletic:"Athletic fitness", mobility:"Mobility & flexibility"
};
function loadPlan(){
  const p = read(K.plan, null);
  if(p && p.days >= 2 && p.days <= 6 && GOALS[p.primary]) return {
    days:Number(p.days), primary:p.primary,
    secondary:Array.isArray(p.secondary) ? p.secondary.filter(x => GOALS[x] && x !== p.primary).slice(0,3) : [],
    duration:[60,75,90].includes(Number(p.duration)) ? Number(p.duration) : 75
  };
  return {days:4, primary:"fat_loss", secondary:["muscle"], duration:75};
}
let plan = loadPlan();
const library = () => [...PROGRAM.flatMap(w => w.exercises), ...EXTRA];
const findEx = n => library().find(x => x.n === n);
const session = (name, focus, names) => ({name, duration:plan.duration, focus, exercises:names.map(findEx).filter(Boolean).map(clone)});
function condFor(g){ return {endurance:"Bike Intervals", fat_loss:"StairMaster Intervals", athletic:"CrossFit Engine Circuit", mobility:"StairMaster Steady State"}[g] || "Bike Intervals"; }
function booster(slot){
  const g = plan.primary, one = slot === 1;
  const B = {
    muscle:[one?"E — Hypertrophy Booster":"F — Muscle + Core","Extra hypertrophy volume, balanced upper and lower work, controlled conditioning",
      one?["Thoracic Rotation","Incline Dumbbell Press","Lat Pulldown","Hip Thrust","Hamstring Curl","Pallof Press","Bike Intervals","Doorway Pec Stretch"]
         :["Hip 90/90 Flow","Dumbbell Shoulder Press","Chest-Supported Row","Bulgarian Split Squat","Dumbbell Romanian Deadlift","Farmer Carry","StairMaster Steady State","Figure-4 Glute Stretch"]],
    strength:[one?"E — Strength Technique":"F — Strength + Carry","Submaximal strength practice, technical quality, trunk durability",
      one?["World's Greatest Stretch","Front Squat","Bench Press","Chest-Supported Row","Farmer Carry","Pallof Press","Bike Intervals","Hip Flexor + Rotation Stretch"]
         :["Hip 90/90 Flow","Deadlift","Incline Dumbbell Press","Bulgarian Split Squat","Lat Pulldown","Farmer Carry","StairMaster Steady State","Supine Hamstring Stretch"]],
    endurance:[one?"E — Engine Development":"F — Aerobic + Mobility","Cardiovascular endurance, repeatable output, mobility and trunk control",
      one?["Inchworm to Down Dog","Kettlebell Swing","Push-up + Renegade Row","Bike Intervals","Pallof Press","Hip Flexor + Rotation Stretch"]
         :["Deep Squat Pry","Step-Down Control","StairMaster Steady State","Farmer Carry","Adductor Rockback Stretch","Calf Wall Stretch"]],
    athletic:[one?"E — Athletic Power":"F — Work Capacity","Power, work capacity, total-body durability",
      one?["Deep Squat Pry","Front Squat","Kettlebell Swing","Push-up + Renegade Row","Farmer Carry","Bike Intervals","Figure-4 Glute Stretch"]
         :["Inchworm to Down Dog","Bulgarian Split Squat","Incline Dumbbell Press","Single-Arm Cable Row","CrossFit Engine Circuit","Pallof Press","Hip Flexor + Rotation Stretch"]],
    mobility:[one?"E — Mobility + Durability":"F — Movement Quality","Mobility, flexibility, low-impact durability, easy aerobic work",
      one?["Hip 90/90 Flow","World's Greatest Stretch","Thoracic Rotation","Pallof Press","Step-Down Control","StairMaster Steady State","Couch Stretch","Supine Hamstring Stretch"]
         :["Ankle Dorsiflexion Rock","Cossack Squat","Deep Squat Pry","Farmer Carry","Bike Intervals","Doorway Pec Stretch","Figure-4 Glute Stretch"]],
    fat_loss:[one?"E — Metabolic Conditioning":"F — Fat-Loss Engine","Conditioning, full-body work capacity, muscle retention",
      one?["World's Greatest Stretch","Kettlebell Swing","Incline Dumbbell Press","Single-Arm Cable Row","CrossFit Engine Circuit","Pallof Press","Figure-4 Glute Stretch"]
         :["Hip 90/90 Flow","Bulgarian Split Squat","Dumbbell Shoulder Press","Farmer Carry","StairMaster Intervals","Couch Stretch"]]
  }[g] || null;
  return session(...(B || []));
}
function buildWeek(){
  const cond = condFor(plan.primary);
  if(plan.days === 2) return [
    session("A — Full Body Strength + Engine","Full-body strength, muscle, conditioning",
      ["Hip 90/90 Flow","Deadlift","Bench Press","Bulgarian Split Squat","Chest-Supported Row","Farmer Carry",cond,"Couch Stretch"]),
    session("B — Full Body Athletic + Engine","Squat strength, upper and lower muscle, trunk durability, conditioning",
      ["Deep Squat Pry","Front Squat","Incline Dumbbell Press","Single-Arm Cable Row","Hip Thrust","Pallof Press",cond,"Figure-4 Glute Stretch"])];
  const base = PROGRAM.map(w => ({...clone(w), duration:plan.duration}));
  if(plan.days === 3) return base.slice(0,3).map((w,i) => ({...w, name:["A — Posterior Strength + Engine","B — Upper Strength + Engine","C — Full-Body Athletic"][i]}));
  if(plan.days === 4) return base;
  if(plan.days === 5) return [...base, booster(1)];
  return [...base, booster(1), booster(2)];
}
let workouts = buildWeek();
let nextIndex = (Number(localStorage.getItem(K.next)) || 0) % workouts.length;

/* ---------- personal profile (from v2.7) ---------- */
let personal = (() => { const p = read(K.personal, null); return p && p.sex && p.ageBracket ? p : null; })();
function ageGuidance(b){
  return {"60+":"Favor gradual progression, joint-friendly options and sufficient recovery; do not assume low capacity solely because of age.",
    "50-59":"Use progressive overload with deliberate recovery and mobility; preserve strength and power where technique is sound.",
    "40-49":"Balance progressive overload with recovery, mobility and joint tolerance.",
    "30-39":"Use normal progressive overload while monitoring recovery and movement quality."}[b]
    || "Use normal progressive overload appropriate to training age, technique and readiness.";
}

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
function readinessProfile(r){
  const low = r.energy <= 2, high = r.soreness >= 4, mod = r.soreness === 3;
  if(low || high) return r.time === 60
    ? {mode:"recovery60", label:"Recovery session", message:"Short and easy today: 3–4 reps in reserve, fewer sets, gentle conditioning."}
    : {mode:"reduced", label:"Reduced load", message:"Keep 3–4 reps in reserve, trim accessory volume and keep conditioning controlled."};
  if(r.time === 60) return {mode:"time60", label:"60-minute priority", message:"Warm-up, main lift, one key accessory, durability, conditioning and a cooldown."};
  if(r.time === 75 || mod) return {mode:"balanced75", label:"Balanced session", message:"Key lifts and conditioning stay; accessory volume is slightly reduced."};
  return {mode:"full", label:"Full session", message:"Complete the planned work at RPE 7–8, keeping 1–3 reps in reserve on compound lifts."};
}
function adaptExercise(ex, p){
  const x = clone(ex);
  if(p.mode === "recovery60"){
    if(["Strength","Hypertrophy","Power","Durability"].includes(x.block)) x.sets = Math.max(2, x.sets-1);
    if(x.block === "Conditioning"){
      if(x.n.includes("StairMaster Steady State")) x.reps = "15–20 min";
      else if(x.n.includes("Intervals")) x.sets = Math.min(x.sets, 4);
      else x.sets = Math.max(3, x.sets-2);
    }
  }else if(p.mode === "reduced"){
    if(["Hypertrophy","Durability"].includes(x.block)) x.sets = Math.max(2, x.sets-1);
    if(x.block === "Conditioning" && x.sets > 1) x.sets = Math.max(4, x.sets-1);
  }else if(p.mode === "time60"){
    if(x.block === "Hypertrophy") x.sets = Math.max(2, x.sets-1);
    if(x.block === "Conditioning"){ if(x.n.includes("StairMaster Steady State")) x.reps = "18–20 min"; else if(x.sets > 1) x.sets = Math.max(4, x.sets-1); }
  }else if(p.mode === "balanced75"){
    if(x.block === "Hypertrophy" && x.sets > 3) x.sets = 3;
  }
  return x;
}
function adaptWorkout(w, r){
  const p = readinessProfile(r);
  const all = clone(w.exercises);
  let keep = all.slice();
  if(r.time === 60){
    const pick = [keep.find(x => x.block === "Mobility"), keep.find(x => x.block === "Strength"),
      keep.find(x => ["Hypertrophy","Power"].includes(x.block)), keep.find(x => x.block === "Durability"),
      keep.find(x => x.block === "Conditioning"), keep.find(x => x.block === "Flexibility")].filter(Boolean);
    keep = keep.filter(x => pick.includes(x));
  }else if(r.time === 75){
    let m = false, f = false;
    keep = keep.filter(x => { if(x.block === "Mobility"){ if(m) return false; m = true; } if(x.block === "Flexibility"){ if(f) return false; f = true; } return true; });
  }
  if(r.energy <= 2 || r.soreness >= 4){ let gone = false; keep = keep.filter(x => { if(!gone && x.block === "Hypertrophy"){ gone = true; return false; } return true; }); }
  return {profile:p, all, keep:keep.map(x => adaptExercise(x, p))};
}

/* ---------- tracking + progression (from v2.4) ---------- */
function trackingType(ex){
  if(ex.block === "Mobility" || ex.block === "Flexibility") return "repsTime";
  if(ex.block === "Conditioning"){ if(/Bike/i.test(ex.n)) return "bike"; if(/StairMaster/i.test(ex.n)) return "stair"; return "conditioning"; }
  if(/Carry/i.test(ex.n)) return "carry";
  return "loadReps";
}
function prevLine(ex, prev){
  if(!prev || !Array.isArray(prev.sets)) return "";
  const t = trackingType(ex);
  const rows = prev.sets.map((s,i) => {
    if(prev.done && prev.done[i] === false) return null;
    if(t === "repsTime") return s.r || null;
    if(t === "bike" || t === "stair") return s.w || s.r ? `${s.w ? (t==="bike"?"res ":"lvl ")+s.w : ""}${s.w&&s.r?" · ":""}${s.r||""}` : null;
    if(t === "carry") return s.w || s.r ? `${s.w||"–"} kg · ${s.r||"–"}` : null;
    return s.w || s.r ? `${s.w||"–"}×${s.r||"–"}` : null;
  }).filter(Boolean);
  return rows.length ? `Last time: ${rows.join(", ")}${prev.rpe ? ` · RPE ${prev.rpe}` : ""}` : "";
}
function suggestion(ex, prev, reduced){
  const t = trackingType(ex);
  if(t === "repsTime") return ex.block === "Flexibility"
    ? (reduced ? "Comfortable range only today. Don't force end range." : "Aim for smoother breathing and slightly more pain-free range.")
    : "Progress through control and pain-free range, not load.";
  if(t === "bike") return reduced ? "Keep hard intervals around RPE 6–7 with smooth cadence." : "Add resistance or cadence only if every interval stays repeatable.";
  if(t === "stair") return reduced ? "Pick a controlled level, stay tall, don't hang on the rails." : "Add one level or a little time only if posture holds.";
  if(t === "conditioning") return reduced ? "Reduce pace or rounds as needed. Movement quality first." : "Nudge pace or total work while technique stays clean.";
  const done = prev && Array.isArray(prev.sets) ? prev.sets.filter((s,i) => !prev.done || prev.done[i] !== false) : [];
  const vals = done.map(s => num(s.w)).filter(v => v != null);
  if(!vals.length) return reduced ? "Easy technical load today, 3–4 reps in reserve." : "Pick a load you can finish with 2–3 reps in reserve.";
  const avg = vals.reduce((a,b) => a+b, 0) / vals.length, rpe = Number(prev.rpe || 8);
  if(reduced) return `Today: about ${fmtKg(Math.max(0, avg-2.5))} kg, or last load with fewer reps.`;
  if(rpe <= 7) return `Last time felt controlled. Try ${fmtKg(avg+2.5)} kg if the warm-up feels good.`;
  if(rpe >= 9) return `Last time was very hard. Try ${fmtKg(Math.max(0, avg-2.5))} kg or fewer reps.`;
  return `Repeat ${fmtKg(avg)} kg and tighten the reps. Go up once the last set sits at RPE 7–8.`;
}

/* ---------- sound + voice (merged v2.7 and v3.1 settings into one) ---------- */
const voice = {
  mode: localStorage.getItem(K.voiceMode) || "essential",          // off | essential | full
  sounds: localStorage.getItem(K.audio) !== "off",
  rate: Number(localStorage.getItem(K.rate) || "0.9"),
  name: localStorage.getItem(K.voiceName) || ""
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
function voices(){
  if(!("speechSynthesis" in window)) return [];
  const all = speechSynthesis.getVoices() || [], en = all.filter(v => /^en([-_]|$)/i.test(v.lang || ""));
  return (en.length ? en : all).sort((a,b) => {
    const s = v => /Google|Samsung|Microsoft|Natural|Neural|Enhanced|Premium/i.test(v.name||"") ? 0 : 1;
    return s(a) - s(b) || (a.name||"").localeCompare(b.name||"");
  });
}
function speak(text, {force=false, onend} = {}){
  if(!("speechSynthesis" in window)) { onend && onend(); return; }
  if(voice.mode === "off" && !force) return;
  try{
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text), vs = voices();
    const v = vs.find(x => x.name === voice.name) || vs[0]; if(v) u.voice = v;
    u.rate = voice.rate; u.pitch = .95; u.volume = .95;
    if(onend){ u.onend = onend; u.onerror = () => {}; }
    speechSynthesis.speak(u);
  }catch{}
}
const hush = () => { try{ speechSynthesis.cancel(); }catch{} };

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
    adaptation:{mode:a.profile.mode, label:a.profile.label, message:a.profile.message, targetMinutes:r.time},
    exercises:a.keep.map(ex => ({...ex, skipped:false, rpe:null, sets:Array.from({length:ex.sets}, () => ({w:"", r:"", done:false}))}))
  };
  persist(); unlockAudio(); go("workout");
}

/* ---------- rest timer: timestamp based, survives screen-off and reloads ---------- */
let restTick = null, restFlags = {};
function startRest(sec){
  if(!state || !sec) return;
  state.rest = {end:Date.now() + sec*1000, total:sec}; persist();
  restFlags = {}; cue.start();
  if(voice.mode !== "off") speak(`Rest. ${sec >= 60 ? `${Math.floor(sec/60)} minute${sec>=120?"s":""}${sec%60?` ${sec%60} seconds`:""}` : `${sec} seconds`}.`);
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
        h("div", null, h("div", {class:"lbl"}, "Rest"), h("div", {class:"time"}, "00:00")),
        h("div", {class:"ctrls"},
          h("button", {"aria-label":"Remove 15 seconds", onclick:() => adjustRest(-15)}, "−15"),
          h("button", {"aria-label":"Add 15 seconds", onclick:() => adjustRest(15)}, "+15"),
          h("button", {class:"skip", onclick:stopRest}, "Skip")),
        h("div", {class:"track"}, h("i"))));
    document.body.append(el);
  }
  const tick = () => {
    if(!state?.rest){ stopRest(); return; }
    const left = (state.rest.end - Date.now())/1000;
    el.querySelector(".time").textContent = mmss(Math.ceil(left));
    el.querySelector(".track i").style.transform = `scaleX(${Math.max(0, Math.min(1, left/state.rest.total))})`;
    el.classList.toggle("ending", left <= 10);
    if(left <= 10.5 && left > 1 && !restFlags.warn){ restFlags.warn = true; cue.warn(); if(voice.mode !== "off") speak("Ten seconds."); }
    if(left <= 0){ cue.end(); if(voice.mode !== "off") speak("Rest complete. Next set."); stopRest(); }
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
    history:renderHistory, coach:renderCoachTab, profile:renderProfile})[v](m, arg);
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
  m.append(h("div", {class:"topline"}, h("div", null, h("div", {class:"hello"}, greeting()), h("div", {class:"wordmark"}, "Zahi Fit")),
    h("button", {class:"avatar", "aria-label":"Profile", onclick:() => go("profile")}, personal ? (personal.sex === "female" ? "♀" : "♂") : "•")));
  if(state){
    const ex = curEx();
    m.append(h("button", {class:"resume", onclick:() => go("workout")},
      h("i", {class:"pulse"}),
      h("div", null, h("b", null, "Workout in progress"), h("span", null, `${ex.n} · ${state.exerciseIndex+1} of ${state.exercises.length} · ${completion()}% done`)),
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

  // Programme tiles
  m.append(h("section", {class:"section"},
    h("div", {class:"section-head"}, h("h2", null, `Your ${plan.days}-day plan`), h("button", {class:"btn ghost sm", onclick:() => go("profile")}, "Edit plan")),
    h("p", {class:"muted small"}, [GOALS[plan.primary], ...plan.secondary.map(x => GOALS[x])].join(", ") + ` · ${plan.duration} min sessions`),
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
      ul.append(h("li", {class:kept.has(x.n) ? "" : "cut", "data-block":x.block}, h("i", {class:"sw"}), x.n, h("em", null, k ? `${k.sets} × ${k.reps}` : "dropped")));
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
    h("div", {class:"q"}, h("label", null, "Time available"), scale("time", [60,75,90], ["min","min","min"], true)),
    preview,
    h("div", {class:"section"}, start));
  paint();
}

/* ---------- Workout (focus mode) ---------- */
let wk = null; // live references for partial repaint
function renderWorkout(m){
  if(!state){ go("today"); return; }
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
    ...(state.adaptation && state.adaptation.mode !== "full"
      ? [h("button", {class:"adapt-pill", onclick:() => toast(state.adaptation.message)}, state.adaptation.label)] : []),
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
  wk.next.textContent = last ? "Finish workout" : `Next: ${state.exercises[i+1].n}`;
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
    h("div", {class:"spread"}, h("span", {class:"tag", "data-block":ex.block}, ex.block), h("span", {class:"ex-count"}, `${state.exerciseIndex+1} of ${state.exercises.length}`)),
    h("h2", {class:"ex-name"}, ex.n),
    h("div", {class:"target"}, h("b", null, `${ex.sets.length} × ${ex.reps}`), restTxt ? ` · rest ${restTxt}` : " · continuous"),
    ex.substitutedFor ? h("div", {class:"subbed"}, `Replacing ${ex.substitutedFor}`) : null));

  if(ex.skipped){
    b.append(h("div", {class:"panel flat section"}, h("p", {class:"muted"}, "You skipped this exercise. It won't count toward today's progress."),
      h("button", {class:"btn block", onclick:() => { ex.skipped = false; persist(); paintExercise(); }}, "Include it again")));
    return;
  }

  const last = prevLine(ex, prev);
  b.append(h("div", {class:"advice", "data-block":ex.block}, suggestion(ex, prev, reducedDay()), last ? h("span", {class:"last"}, last) : null));
  const fam = familyOf(ex);
  b.append(h("button", {class:"guide-launch", onclick:() => openGuide(ex)}, stepImage(fam, 0, ""),
    h("div", null, h("b", null, "How to do it"), h("span", null, "5-step photo guide with voice coaching"))));

  // Set logger
  const simple = type === "repsTime";
  const cols = type === "repsTime" ? ["", ex.block === "Flexibility" ? "Time / side" : "Reps / time", "Done"]
    : type === "bike" ? ["", "Resistance", "Time", "Done"]
    : type === "stair" ? ["", "Level", "Time", "Done"]
    : type === "conditioning" ? ["", "Load / level", "Rounds / time", "Done"]
    : type === "carry" ? ["", "kg", "Distance", "Done"] : ["", "kg", "Reps", "Done"];
  const list = h("div", {class:"sets"});
  const current = ex.sets.findIndex(s => !s.done);
  const step = ["bike","stair","conditioning"].includes(type) ? 1 : 2.5;
  ex.sets.forEach((s,i) => {
    const p = prev && prev.sets && prev.sets[i] && !(prev.done && prev.done[i] === false) ? prev.sets[i] : null;
    const phW = p && p.w ? p.w : (type === "loadReps" || type === "carry" ? "kg" : "–");
    const phR = p && p.r ? p.r : ex.reps;
    const rIn = h("input", {inputmode:simple || type==="conditioning" || type==="bike" || type==="stair" ? "text" : "numeric", value:s.r, placeholder:phR, "aria-label":`Set ${i+1} ${cols[simple?1:2]}`, maxlength:"40"});
    rIn.addEventListener("input", () => { s.r = rIn.value.slice(0,40); persist(); });
    if(simple || String(phR).length > 6) rIn.classList.add("txt");
    const tick = h("button", {class:"tick", "aria-pressed":String(!!s.done), "aria-label":`Mark set ${i+1} ${s.done ? "not done" : "done"}`}, "✓");
    let wIn = null;
    const row = h("div", {class:"set" + (simple ? " simple" : "") + (s.done ? " done" : "") + (i === current ? " current" : "")}, h("span", {class:"n"}, i+1));
    if(!simple){
      wIn = h("input", {inputmode:"decimal", value:s.w, placeholder:phW, "aria-label":`Set ${i+1} ${cols[1]}`, maxlength:"12"});
      wIn.addEventListener("input", () => { s.w = wIn.value.slice(0,12); persist(); });
      const bump = d => { const base = num(wIn.value) ?? num(p && p.w) ?? 0; wIn.value = fmtKg(Math.max(0, base + d)); s.w = wIn.value; persist(); };
      row.append(h("div", {class:"load"},
        h("button", {"aria-label":`Decrease by ${step}`, onclick:() => bump(-step)}, "−"), wIn,
        h("button", {"aria-label":`Increase by ${step}`, onclick:() => bump(step)}, "+")));
    }
    row.append(h("div", {class:"field"}, rIn), tick);
    tick.addEventListener("click", () => {
      if(!s.done){
        // One tap repeats last time: blanks take the placeholder values from the previous session.
        if(wIn && !s.w && p && p.w) s.w = p.w;
        if(!s.r){ if(p && p.r) s.r = p.r; else if(/^\d+$/.test(String(ex.reps).trim())) s.r = String(ex.reps).trim(); }
        s.done = true;
        const n = ex.sets[i+1];
        if(n && !n.done){ if(!n.w && s.w) n.w = s.w; if(!n.r && s.r) n.r = s.r; }
        persist();
        if(ex.rest > 0) startRest(ex.rest);
        else if(voice.mode === "full") speak("Good. Keep it smooth.");
      }else{ s.done = false; persist(); }
      paintExercise();
    });
    list.append(row);
  });
  b.append(h("div", {class:"colhead" + (simple ? " simple" : "")}, cols.map(c => h("span", null, c))), list);
  b.lastChild.previousSibling.classList.add("section");
  if(ex.sets.length < 12) b.append(h("button", {class:"btn ghost sm", onclick:() => { const l = ex.sets[ex.sets.length-1]; ex.sets.push({w:l?.w||"", r:"", done:false}); persist(); paintExercise(); }}, "+ Add a set"));

  // Effort
  if(!simple){
    const labels = ex.block === "Conditioning" ? [["Easy",6],["Steady",7],["Hard",8],["Very hard",9]] : [["Easy",6],["Good",7],["Hard",8],["Very hard",9]];
    const seg = h("div", {class:"seg", role:"group", "aria-label":"How hard was it"});
    labels.forEach(([t,v]) => seg.append(h("button", {"aria-pressed":String(ex.rpe === v), onclick:() => { ex.rpe = ex.rpe === v ? null : v; persist(); paintExercise(); }}, t, h("small", null, `RPE ${v}`))));
    b.append(h("div", {class:"effort"}, h("div", {class:"small"}, h("b", null, "How hard was it?"), h("span", {class:"muted"}, " Guides next time's load.")), seg));
  }

  // Technique, on demand
  b.append(h("details", {class:"tech"},
    h("summary", null, "Technique"),
    h("p", {class:"cue"}, ex.cue),
    h("h4", null, "Do"), h("ul", null, (ex.how||[]).map(x => h("li", null, x))),
    h("h4", null, "Avoid"), h("ul", null, (ex.mistakes||[]).map(x => h("li", null, x))),
    h("div", {class:"btn-row"},
      h("button", {class:"btn sm", onclick:() => openGuide(ex)}, "Step-by-step guide"),
      h("button", {class:"btn sm", onclick:() => openGuide(ex, true)}, "Talk me through it"))));
}

function exerciseList(){
  sheet((card, close) => {
    card.append(h("h2", null, "Exercises"), h("p", {class:"muted small"}, `${completion()}% of today's sets done`));
    const l = h("div", {class:"sheet-list"});
    state.exercises.forEach((ex,i) => {
      const d = ex.sets.filter(s => s.done).length;
      l.append(h("button", {"data-block":ex.block, onclick:() => { close(); state.exerciseIndex = i; persist(); paintExercise(); window.scrollTo({top:0}); }},
        h("i", {class:"sw"}), h("div", {class:i === state.exerciseIndex ? "cur" : ""}, ex.n, h("span", null, ex.block)),
        h("span", {class:"state"}, ex.skipped ? "skipped" : d === ex.sets.length ? "done" : `${d}/${ex.sets.length}`)));
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
  const pool = library().filter(x => x.n !== ex.n && !state.exercises.some(y => y.n === x.n));
  const same = ["Strength","Hypertrophy"].includes(ex.block) ? pool.filter(x => ["Strength","Hypertrophy"].includes(x.block)) : pool.filter(x => x.block === ex.block);
  const seen = new Set();
  const opts = [...(ex.subs||[]).map(findEx).filter(Boolean), ...same].filter(x => !seen.has(x.n) && seen.add(x.n)).slice(0,6);
  sheet((card, close) => {
    card.append(h("h2", null, "Pick a swap"), h("p", {class:"muted small"}, reason === "Pain or discomfort" ? "If the pain is sharp, stop this movement and get it assessed rather than pushing through." : "These keep today's training purpose."));
    const l = h("div", {class:"sheet-list"});
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
    }}, h("i", {class:"sw"}), h("div", null, src.n, h("span", null, src.block)))));
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
    profile:{trainingDays:plan.days, primaryGoal:GOALS[plan.primary], secondaryGoals:plan.secondary.map(x => GOALS[x]), preferredDuration:plan.duration},
    personalProfile: personal ? {sex:personal.sex, ageBracket:personal.ageBracket, programmingGuidance:ageGuidance(personal.ageBracket),
      instruction:"Use sex only where physiologically relevant. Do not stereotype exercise capability. Tailor recovery, progression and movement options to age bracket, readiness, goals and actual performance."} : {sex:null, ageBracket:null},
    readiness: state ? state.readiness : null,
    adaptation: state ? state.adaptation : null,
    workout: state ? state.workoutName : (workouts[nextIndex] || {}).name,
    progressPercent: state ? completion() : 0,
    currentExercise: ex ? {name:ex.n, block:ex.block, target:ex.reps, restSeconds:ex.rest, rpe:ex.rpe, sets:ex.sets} : null,
    remainingExercises: state ? state.exercises.slice(state.exerciseIndex+1).map(e => `${e.n} (${e.sets.length}×${e.reps})`) : null,
    recentHistory: getHistory().slice(0,5),
    voiceCoach:{mode:voice.mode},
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

/* ---------- Technique guide (photos first, SVG fallback) ---------- */
const PHOTO_ROOT = "pt-assets-v34/", SVG_ROOT = "pt-assets-v33/";
const familyOf = ex => FAMILY[ex.n] || "circuit";
function stepImage(family, i, alt){
  const img = h("img", {src:`${PHOTO_ROOT}${family}-step${i+1}.jpg`, alt, decoding:"async"});
  img.addEventListener("error", () => { if(!img.dataset.fb){ img.dataset.fb = "1"; img.classList.add("svg"); img.src = `${SVG_ROOT}${family}-step${i+1}.svg`; } }, {once:false});
  return img;
}
function openGuide(ex, talk){
  const fam = familyOf(ex), steps = (STEPS[fam] || STEPS.circuit).map((s,i) => ({title:s[0], text:s[1], cue:(ex.how||[])[i] || null}));
  let i = 0, playingAll = false;
  const inner = h("div", {class:"app"});
  const ov = h("div", {class:"overlay guide", role:"dialog", "aria-modal":"true", "aria-label":`${ex.n} guide`}, inner);
  const close = () => { hush(); playingAll = false; ov.remove(); };
  const stage = h("div", {class:"stage"}), dots = h("div", {class:"steps-dots"}), content = h("div");
  const playBtn = h("button", {class:"btn primary"}), prev = h("button", {class:"icon-btn", "aria-label":"Previous step"}, "‹"), next = h("button", {class:"icon-btn", "aria-label":"Next step"}, "›");
  const say = (then) => speak(`Step ${i+1}. ${steps[i].title}. ${steps[i].text}${steps[i].cue ? ` Cue: ${steps[i].cue}.` : ""}`, {force:true, onend:then});
  const paint = () => {
    stage.replaceChildren(stepImage(fam, i, `${ex.n}, step ${i+1}: ${steps[i].title}`), h("span", {class:"stage-step"}, `${i+1} / ${steps.length}`));
    dots.replaceChildren(...steps.map((s,k) => h("button", {"aria-label":`Step ${k+1}: ${s.title}`, "aria-current":String(k === i), class:k < i ? "seen" : "", onclick:() => { hush(); playingAll = false; i = k; paint(); }})));
    content.replaceChildren(...[
      h("h2", {class:"step-title"}, steps[i].title),
      h("p", {class:"step-text"}, steps[i].text),
      steps[i].cue ? h("div", {class:"step-cue"}, steps[i].cue) : null,
      i === steps.length - 1 ? h("div", null,
        h("div", {class:"feel"}, h("h4", null, "What you should feel"), h("p", {class:"small"}, feelFor(fam))),
        h("div", {class:"avoid"}, h("h4", null, "Avoid"), h("ul", null, (ex.mistakes||[]).map(m => h("li", null, m))))) : null].filter(Boolean));
    prev.disabled = i === 0;
    next.textContent = i === steps.length-1 ? "✓" : "›";
    next.setAttribute("aria-label", i === steps.length-1 ? "Close guide" : "Next step");
    playBtn.textContent = playingAll ? "Stop" : "▶ Talk me through it";
  };
  const playAll = () => {
    playingAll = true; paint();
    const run = () => say(() => { if(!playingAll) return; if(i < steps.length-1){ setTimeout(() => { if(!playingAll) return; i++; paint(); run(); }, 900); } else { playingAll = false; paint(); } });
    run();
  };
  playBtn.addEventListener("click", () => { if(playingAll){ playingAll = false; hush(); paint(); } else playAll(); });
  prev.addEventListener("click", () => { hush(); playingAll = false; if(i > 0){ i--; paint(); } });
  next.addEventListener("click", () => { hush(); playingAll = false; if(i < steps.length-1){ i++; paint(); } else close(); });
  // swipe between steps
  let x0 = null;
  stage.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, {passive:true});
  stage.addEventListener("touchend", e => { if(x0 == null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if(Math.abs(dx) > 50){ hush(); playingAll = false; i = Math.max(0, Math.min(steps.length-1, i + (dx < 0 ? 1 : -1))); paint(); } });
  const speed = h("select", {"aria-label":"Voice speed"}, [["0.75","Slower"],["0.9","Normal"],["1.05","Faster"]].map(([v,t]) => h("option", {value:v}, t)));
  speed.value = String([0.75,0.9,1.05].reduce((a,b) => Math.abs(b-voice.rate) < Math.abs(a-voice.rate) ? b : a));
  speed.addEventListener("change", () => { voice.rate = Number(speed.value); localStorage.setItem(K.rate, speed.value); });
  inner.append(
    h("div", {class:"ov-top"}, h("button", {class:"icon-btn plain", "aria-label":"Close guide", onclick:close}, "←"),
      h("div", {class:"t"}, h("b", null, ex.n), h("span", {class:"tag", "data-block":ex.block}, ex.block))),
    stage, dots, content,
    h("div", {class:"voice-opts"}, h("span", {class:"small muted"}, "Voice speed"), speed),
    h("div", {class:"guide-bar"}, prev, playBtn, next));
  document.body.append(ov);
  paint();
  if(talk) setTimeout(playAll, 250);
}

/* ---------- Profile & settings ---------- */
function planEditor(draft, onChange){
  const wrap = h("div");
  const paint = () => {
    wrap.replaceChildren(
      h("div", {class:"field-label"}, "Training days per week"),
      h("div", {class:"pick num", role:"group"}, [2,3,4,5,6].map(d => h("button", {"aria-pressed":String(draft.days === d), onclick:() => { draft.days = d; paint(); onChange && onChange(); }}, d))),
      h("div", {class:"field-label"}, "Main goal"),
      h("div", {class:"pick", role:"group"}, Object.entries(GOALS).map(([k,t]) => h("button", {"aria-pressed":String(draft.primary === k), onclick:() => { draft.primary = k; draft.secondary = draft.secondary.filter(x => x !== k); paint(); onChange && onChange(); }}, t))),
      h("div", {class:"field-label"}, "Also working on ", h("small", null, "up to 3, optional")),
      h("div", {class:"pick", role:"group"}, Object.entries(GOALS).map(([k,t]) => h("button", {"aria-pressed":String(draft.secondary.includes(k)), disabled:k === draft.primary, onclick:() => {
        if(draft.secondary.includes(k)) draft.secondary = draft.secondary.filter(x => x !== k); else if(draft.secondary.length < 3) draft.secondary.push(k); else toast("Pick up to three.");
        paint(); onChange && onChange(); }}, t))),
      h("div", {class:"field-label"}, "Session length"),
      h("div", {class:"pick", role:"group"}, [60,75,90].map(d => h("button", {"aria-pressed":String(draft.duration === d), onclick:() => { draft.duration = d; paint(); onChange && onChange(); }}, `${d} min`))));
  };
  paint();
  return wrap;
}
function applyPlan(p){
  plan = {...p, secondary:[...p.secondary]}; write(K.plan, plan);
  workouts = buildWeek(); nextIndex = 0; localStorage.setItem(K.next, "0");
}
function aboutEditor(draft){
  const wrap = h("div");
  const paint = () => wrap.replaceChildren(
    h("div", {class:"field-label"}, "Sex"),
    h("div", {class:"pick", role:"group"}, [["male","Male"],["female","Female"]].map(([v,t]) => h("button", {"aria-pressed":String(draft.sex === v), onclick:() => { draft.sex = v; paint(); }}, t))),
    h("div", {class:"field-label"}, "Age"),
    h("div", {class:"pick", role:"group"}, ["18-29","30-39","40-49","50-59","60+"].map(v => h("button", {"aria-pressed":String(draft.ageBracket === v), onclick:() => { draft.ageBracket = v; paint(); }}, v.replace("-", "–")))),
    h("p", {class:"tiny muted"}, "Used by your coach for recovery and progression. Sex is only used where it's physiologically relevant."));
  paint(); return wrap;
}
function download(name, data){
  const a = h("a", {href:URL.createObjectURL(new Blob([data], {type:"application/json"})), download:name});
  document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
}
function renderProfile(m){
  m.append(topline("Profile"));
  // Plan
  const pd = clone(plan);
  const save = h("button", {class:"btn primary block section hidden", onclick:async () => {
    if(state && !(await ask("Update your plan?", "Your current workout keeps going. The new plan starts from session A next time.", "Update plan"))) return;
    applyPlan(pd); save.classList.add("hidden"); toast("Plan updated.");
  }}, "Save plan");
  m.append(h("section", {class:"panel"}, h("h2", null, "Your plan"), planEditor(pd, () => save.classList.toggle("hidden", JSON.stringify(pd) === JSON.stringify(plan))), save));

  // About you
  const ad = personal ? {...personal} : {sex:null, ageBracket:null};
  m.append(h("section", {class:"panel section"}, h("h2", null, "About you"), aboutEditor(ad),
    h("button", {class:"btn block section", onclick:() => { if(!ad.sex || !ad.ageBracket){ toast("Choose both to save."); return; } personal = {...ad}; write(K.personal, personal); toast("Saved."); }}, "Save")));

  // Voice & sound
  const vsel = h("select", {"aria-label":"Coach voice"});
  const fillVoices = () => { const vs = voices(); vsel.replaceChildren(h("option", {value:""}, "Device default"), ...vs.slice(0,10).map(v => h("option", {value:v.name}, `${v.name}`))); vsel.value = voice.name; };
  fillVoices(); if("speechSynthesis" in window) speechSynthesis.onvoiceschanged = fillVoices;
  vsel.addEventListener("change", () => { voice.name = vsel.value; localStorage.setItem(K.voiceName, voice.name); });
  const mode = h("select", {"aria-label":"Voice coaching"}, [["off","Off"],["essential","Rest cues"],["full","Rest cues + encouragement"]].map(([v,t]) => h("option", {value:v}, t)));
  mode.value = voice.mode; mode.addEventListener("change", () => { voice.mode = mode.value; localStorage.setItem(K.voiceMode, voice.mode); });
  const snd = h("select", {"aria-label":"Rest timer sounds"}, h("option", {value:"on"}, "On"), h("option", {value:"off"}, "Off"));
  snd.value = voice.sounds ? "on" : "off"; snd.addEventListener("change", () => { voice.sounds = snd.value === "on"; localStorage.setItem(K.audio, snd.value); unlockAudio(); });
  const rate = h("select", {"aria-label":"Voice speed"}, [["0.75","Slower"],["0.9","Normal"],["1.05","Faster"]].map(([v,t]) => h("option", {value:v}, t)));
  rate.value = String([0.75,0.9,1.05].reduce((a,b) => Math.abs(b-voice.rate) < Math.abs(a-voice.rate) ? b : a));
  rate.addEventListener("change", () => { voice.rate = Number(rate.value); localStorage.setItem(K.rate, rate.value); });
  m.append(h("section", {class:"panel section"}, h("h2", null, "Voice & sound"),
    h("div", {class:"setting"}, h("span", null, "Voice coaching"), mode),
    h("div", {class:"setting"}, h("span", null, "Rest timer sounds"), snd),
    h("div", {class:"setting"}, h("span", null, "Voice"), vsel),
    h("div", {class:"setting"}, h("span", null, "Speed"), rate),
    h("button", {class:"btn block", onclick:() => { unlockAudio(); cue.start(); speak("This is your Zahi Fit coach. Rest cues are ready.", {force:true}); }}, "Test voice and sound")));

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
  m.append(h("section", {class:"panel section"}, h("h2", null, "Your data"),
    h("p", {class:"small muted"}, "Everything is stored on this phone. Back it up before clearing browser data or switching phones."),
    h("div", {class:"btn-row"},
      h("button", {class:"btn sm", onclick:() => download(`zahi-fit-history-${new Date().toISOString().slice(0,10)}.json`, JSON.stringify(getHistory(), null, 2))}, "Back up history"),
      h("button", {class:"btn sm", onclick:() => file.click()}, "Restore backup")), file,
    h("button", {class:"btn sm block section", onclick:() => download("zahi-fit-coach-context.json", JSON.stringify(coachContext(), null, 2))}, "Export coach file"),
    h("button", {class:"btn danger sm block section", onclick:async () => {
      if(!(await ask("Erase all data?", "History, plan, profile and any workout in progress will be deleted from this phone. Back up first if you might need it.", "Erase everything", true))) return;
      Object.values(K).forEach(k => localStorage.removeItem(k)); location.reload();
    }}, "Erase all data")));

  m.append(h("p", {class:"tiny faint section center"}, `Zahi Fit ${VERSION}`, " · ",
    h("button", {class:"linkish", onclick:() => { checkForUpdate(true); }}, "Check for update")));
}

/* ---------- First-run setup ---------- */
function onboarding(){
  const draftAbout = personal ? {...personal} : {sex:null, ageBracket:null};
  const draftPlan = clone(plan);
  let step = 0;
  const ov = h("div", {class:"onboard", role:"dialog", "aria-modal":"true"}), inner = h("div", {class:"app"});
  ov.append(inner);
  const done = () => { write(K.onboarded, true); ov.remove(); go("today"); };
  const paint = () => {
    inner.replaceChildren(h("div", {class:"progress"}, [0,1,2].map(k => h("i", {class:k <= step ? "on" : ""}))));
    if(step === 0){
      inner.append(h("h1", null, "Let's set up your training"), h("p", {class:"muted"}, "Two quick screens. You can change any of this later in Profile."), aboutEditor(draftAbout));
    }else if(step === 1){
      inner.append(h("h1", null, "What are you training for?"), h("p", {class:"muted"}, "Your weekly sessions are built from this."), planEditor(draftPlan));
    }else{
      plan = draftPlan; workouts = buildWeek(); // preview only
      inner.append(h("h1", null, `Your ${draftPlan.days}-day plan`), h("p", {class:"muted"}, `${GOALS[draftPlan.primary]} focus · ${draftPlan.duration} min sessions`),
        h("div", {class:"tiles section"}, workouts.map((w,k) => { const n = splitName(w.name); return h("div", {class:"tile", "data-tone":k % 4}, h("span", {class:"l"}, n.letter), h("b", null, n.title), h("span", null, `${w.exercises.length} exercises`)); })));
    }
    inner.append(h("div", {class:"foot btn-row"},
      step === 0 ? h("button", {class:"btn", onclick:done}, "Skip for now") : h("button", {class:"btn", onclick:() => { step--; paint(); }}, "Back"),
      h("button", {class:"btn primary", onclick:() => {
        if(step === 0){ if(draftAbout.sex && draftAbout.ageBracket){ personal = {...draftAbout}; write(K.personal, personal); } step++; paint(); }
        else if(step === 1){ step++; paint(); }
        else { applyPlan(draftPlan); done(); }
      }}, step === 2 ? "Start training" : "Continue")));
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

/* ---------- boot ---------- */
document.querySelectorAll(".tab").forEach(t => t.addEventListener("click", () => go(t.dataset.tab)));
document.addEventListener("pointerdown", unlockAudio, {once:true});
document.addEventListener("visibilitychange", () => { if(document.visibilityState === "visible") paintRest(); });
setupSW();
go(state ? "workout" : "today");
if(!personal && !read(K.onboarded, false) && !getHistory().length) onboarding();
})();
