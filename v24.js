"use strict";
// Zahi Fit v2.4 overlay: smart progression + exercise-specific tracking.

function trackingType(ex){
  if(ex.block==="Mobility"||ex.block==="Flexibility") return "repsTime";
  if(ex.block==="Conditioning"){
    if(/Bike/i.test(ex.n)) return "bike";
    if(/StairMaster/i.test(ex.n)) return "stair";
    return "conditioning";
  }
  if(/Carry/i.test(ex.n)) return "carry";
  return "loadReps";
}

function previousSummaryV24(ex,prev){
  if(!prev||!Array.isArray(prev.sets)) return "No previous logged performance yet.";
  const type=trackingType(ex),rows=[];
  prev.sets.forEach((s,i)=>{
    if(prev.done&&prev.done[i]===false)return;
    if(type==="repsTime") rows.push(`S${i+1}: ${s.r||"—"}`);
    else if(type==="bike") rows.push(`I${i+1}: ${s.w?`res ${s.w} `:""}${s.r||"—"}`);
    else if(type==="stair") rows.push(`I${i+1}: ${s.w?`level ${s.w} `:""}${s.r||"—"}`);
    else if(type==="carry") rows.push(`S${i+1}: ${s.w||"—"} kg • ${s.r||"—"}`);
    else rows.push(`S${i+1}: ${s.w||"—"} kg × ${s.r||"—"}`);
  });
  return rows.length?rows.join(" • "):"No completed previous sets logged.";
}

suggestion=function(ex,prev){
  const reduced=state&&state.adaptation&&["recovery60","reduced"].includes(state.adaptation.mode);
  const type=trackingType(ex);
  if(type==="repsTime"){
    if(ex.block==="Flexibility") return reduced
      ? "Use comfortable range only; do not force end-range while fatigued."
      : "Progress with smoother breathing and slightly better pain-free range.";
    return "Progress through control and pain-free range rather than adding load.";
  }
  if(type==="bike") return reduced
    ? "Keep hard intervals controlled around RPE 6–7 with smooth, repeatable cadence."
    : "Progress resistance or cadence only when every interval remains repeatable.";
  if(type==="stair") return reduced
    ? "Choose a controlled level, stay tall, and avoid hanging on the rails."
    : "Progress one level or add a small amount of time only when posture stays consistent.";
  if(type==="conditioning") return reduced
    ? "Reduce pace or rounds as needed; movement quality stays the priority."
    : "Progress pace or total work slightly while maintaining technique.";
  if(!prev||!Array.isArray(prev.sets)) return reduced
    ? "Reduced-load day — choose an easy technical load and keep 3–4 reps in reserve."
    : "First logged session — choose a comfortable load and finish with 2–3 reps in reserve.";
  const completed=prev.sets.filter((s,i)=>!prev.done||prev.done[i]!==false);
  const vals=completed.map(s=>parseFloat(s.w)).filter(Number.isFinite);
  if(!vals.length) return reduced
    ? "Use a conservative load today and prioritize clean technique."
    : "No numeric load was recorded previously; choose a controlled starting load.";
  const avg=vals.reduce((a,b)=>a+b,0)/vals.length;
  const rpe=Number(prev.rpe||8);
  if(reduced) return `Reduced-load target: about ${Math.max(0,avg-2.5).toFixed(1)} kg, or repeat the prior load with fewer reps.`;
  if(rpe<=7) return `Last effort was controlled. If warm-up feels good, try about ${(avg+2.5).toFixed(1)} kg.`;
  if(rpe>=9) return `Last effort was very hard. Try about ${Math.max(0,avg-2.5).toFixed(1)} kg, or repeat with fewer reps.`;
  return `Repeat around ${avg.toFixed(1)} kg and improve rep quality; increase only if the final set stays around RPE 7–8.`;
};

function makeInputV24(value,placeholder,inputMode,onChange){
  const el=document.createElement("input");
  el.value=value||""; el.placeholder=placeholder||""; el.inputMode=inputMode||"text";
  el.addEventListener("input",()=>onChange(el.value.slice(0,45)));
  return el;
}

function doneButtonV24(s,ex){
  const c=node("button","check"+(s.done?" done":""),"✓");
  c.addEventListener("click",()=>{
    s.done=!s.done; c.classList.toggle("done",s.done); persist(); renderProgress();
    if(s.done&&ex.rest>0)startRest(ex.rest);
  });
  return c;
}

function renderTrackingV24(ex,box){
  const type=trackingType(ex),table=node("div","set-table");
  if(type==="repsTime"){
    const head=node("div","track-head");
    head.append(node("span","","Set"),node("span","",ex.block==="Flexibility"?"Time / side":"Reps / time"),node("span","","Done"));
    table.append(head);
    ex.sets.forEach((s,i)=>{
      const row=node("div","track-row-simple");
      const r=makeInputV24(s.r,ex.reps,"text",v=>{s.r=v;persist()});
      row.append(node("div","setnum",String(i+1)),r,doneButtonV24(s,ex)); table.append(row);
    });
  }else if(type==="bike"||type==="stair"||type==="conditioning"){
    const head=node("div","track-head-cardio");
    head.append(node("span","","Round"),node("span","",type==="bike"?"Resistance":type==="stair"?"Level":"Load / level"),node("span","","Time / target"),node("span","","Done"));
    table.append(head);
    ex.sets.forEach((s,i)=>{
      const row=node("div","track-row-cardio");
      const w=makeInputV24(s.w,type==="stair"?"Level":"Optional","decimal",v=>{s.w=v;persist()});
      const r=makeInputV24(s.r,ex.reps,"text",v=>{s.r=v;persist()});
      row.append(node("div","setnum",String(i+1)),w,r,doneButtonV24(s,ex)); table.append(row);
    });
  }else{
    const head=node("div","set-row set-head");
    ["Set","−","kg","＋",type==="carry"?"Distance / time":"Reps","Done"].forEach(t=>head.append(node("div","",t)));
    table.append(head);
    ex.sets.forEach((s,i)=>{
      const row=node("div","set-row"); row.append(node("div","setnum",String(i+1)));
      const minus=node("button","step-btn","−");
      const w=makeInputV24(s.w,"kg","decimal",v=>{s.w=v;persist()});
      const plus=node("button","step-btn","+");
      const r=makeInputV24(s.r,ex.reps,"text",v=>{s.r=v;persist()});
      minus.addEventListener("click",()=>{const v=parseFloat(w.value)||0;w.value=Math.max(0,v-2.5);s.w=w.value;persist()});
      plus.addEventListener("click",()=>{const v=parseFloat(w.value)||0;w.value=(v+2.5).toFixed(1);s.w=w.value;persist()});
      row.append(minus,w,plus,r,doneButtonV24(s,ex)); table.append(row);
    });
  }
  box.append(table);
}

renderExercise=function(){
  const ex=state.exercises[state.exerciseIndex],box=$("activeExerciseCard"); box.replaceChildren();
  $("exerciseCounter").textContent=`Exercise ${state.exerciseIndex+1} of ${state.exercises.length}`;
  $("completionCounter").textContent=`${completion()}% complete`; $("bar").style.width=`${completion()}%`;
  $("prevExerciseBtn").disabled=state.exerciseIndex===0; $("nextExerciseBtn").disabled=state.exerciseIndex===state.exercises.length-1;
  if(state.adaptation){const ad=node("div","suggestion-box");ad.append(node("strong","",state.adaptation.label),node("div","meta",`${state.adaptation.message} Target session: ${state.adaptation.targetMinutes} min.`));box.append(ad)}
  box.append(node("div","block-label",ex.block),node("div","exercise-title",ex.n),node("div","cue",ex.cue));
  const meta=node("div","exercise-meta"); meta.append(node("span","chip",ex.block),node("span","chip",`${ex.sets.length} sets`),node("span","chip",`Target: ${ex.reps}`),node("span","chip",ex.rest?`Rest: ${ex.rest}s`:"Continuous")); box.append(meta);
  const cg=node("div","coach-grid"),how=node("div","coach-box"),mist=node("div","coach-box");
  how.append(node("b","","HOW TO DO IT")); let ul=node("ul"); ex.how.forEach(x=>ul.append(node("li","",x))); how.append(ul);
  mist.append(node("b","","COMMON MISTAKES")); ul=node("ul"); ex.mistakes.forEach(x=>ul.append(node("li","",x))); mist.append(ul); cg.append(how,mist); box.append(cg);
  const prev=previousFor(ex.n),pb=node("div","previous-box"); pb.append(node("b","","Previous performance"),node("div","meta",previousSummaryV24(ex,prev))); box.append(pb);
  const sg=node("div","suggestion-box"); sg.append(node("strong","","PT progression suggestion"),node("div","meta",suggestion(ex,prev))); box.append(sg);
  const a=node("a","btn blue demo-link","Watch full video"); a.href=ex.video; a.target="_blank"; a.rel="noopener noreferrer"; box.append(a);
  renderTrackingV24(ex,box);
  if(!["Mobility","Flexibility"].includes(ex.block)){
    const rp=node("div","rpe-buttons");
    const labels=ex.block==="Conditioning"?[["Easy",6],["Controlled",7],["Hard",8],["Very hard",9]]:[["Easy",6],["Good",7],["Hard",8],["Very hard",9]];
    labels.forEach(([lab,v])=>{const b=node("button","rpe"+(ex.rpe===v?" active":""),`${lab} • ${v}`);b.addEventListener("click",()=>{ex.rpe=v;persist();renderExercise()});rp.append(b)}); box.append(rp);
  }
  $("skipExerciseBtn").textContent=ex.skipped?"Unskip":"Skip"; renderProgress();
};

function completedSetCountV24(){return state?state.exercises.reduce((a,ex)=>a+ex.sets.filter(s=>s.done).length,0):0}

function discardWorkoutV24(){
  if(!state)return;
  if(!confirm("Discard this workout? It will not be saved to history or used for progression."))return;
  stopRest(); clearInterval(timerInterval); localStorage.removeItem(ACTIVE_KEY); state=null; renderHome(); showTab("home",document.querySelector('[data-tab="home"]'));
}

const finishV23=finish;
finish=function(){
  if(!state)return;
  if(completedSetCountV24()===0){alert("No sets are marked complete. Use Discard workout for a test or cancelled session.");return}
  finishV23();
};

function deleteHistoryAtV24(index){
  const h=getHistory(); if(!h[index])return;
  if(!confirm("Delete this workout from history and progression data?"))return;
  h.splice(index,1); localStorage.setItem("history",JSON.stringify(h)); renderHistory(); renderHome();
}

renderHistory=function(){
  const box=$("historyList"); box.replaceChildren(); const h=getHistory();
  if(!h.length){box.append(node("div","meta","No workouts logged yet."));return}
  h.forEach((x,i)=>{
    const it=node("div","history-item"),s=node("div","history-summary");
    s.append(node("b","",x.workout),node("span","meta",`${x.minutes} min`));
    it.append(s,node("div","history-detail",new Date(x.date).toLocaleString()));
    const del=node("button","history-delete","Delete"); del.addEventListener("click",()=>deleteHistoryAtV24(i)); it.append(del); box.append(it);
  });
};

const discardBtn=$("discardWorkoutBtn");
if(discardBtn) discardBtn.onclick=()=>{closeSheet("sessionSheet");discardWorkoutV24()};
$("versionBadge").textContent="v2.4.0";
renderHistory();
