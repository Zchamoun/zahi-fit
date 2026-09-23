"use strict";
/* Zahi Fit v2.7 — Personal PT Experience */
(function(){
  const PROFILE_KEY="zahiFitPersonalProfileV27";
  const VOICE_KEY="zahiFitVoiceModeV27";
  const AUDIO_KEY="zahiFitAudioEnabledV27";
  let audioCtx=null;
  let voiceMode=localStorage.getItem(VOICE_KEY)||"essential";
  let audioEnabled=localStorage.getItem(AUDIO_KEY)!=="off";
  let encouragementIndex=0;

  function loadPersonal(){
    try{
      const x=JSON.parse(localStorage.getItem(PROFILE_KEY)||"null");
      return x&&x.sex&&x.ageBracket?x:null;
    }catch(e){return null}
  }
  let personal=loadPersonal();

  function ensureAudio(){
    try{
      if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)();
      if(audioCtx.state==="suspended") audioCtx.resume();
    }catch(e){}
  }

  function beep(freq=660,duration=.16,volume=.08){
    if(!audioEnabled)return;
    ensureAudio();
    if(!audioCtx)return;
    const o=audioCtx.createOscillator(),g=audioCtx.createGain();
    o.frequency.value=freq;o.type="sine";g.gain.value=volume;
    o.connect(g);g.connect(audioCtx.destination);
    const now=audioCtx.currentTime;
    g.gain.setValueAtTime(volume,now);
    g.gain.exponentialRampToValueAtTime(.001,now+duration);
    o.start(now);o.stop(now+duration);
  }
  function cueStart(){beep(520,.11,.06);setTimeout(()=>beep(660,.11,.06),130)}
  function cueWarn(){beep(780,.10,.055);setTimeout(()=>beep(780,.10,.055),170)}
  function cueEnd(){beep(620,.11,.07);setTimeout(()=>beep(820,.13,.07),140);setTimeout(()=>beep(1040,.16,.075),300)}

  function speak(text,force=false){
    if(!("speechSynthesis" in window))return;
    if(voiceMode==="off"&&!force)return;
    try{
      speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(text);
      u.rate=1.02;u.pitch=1;u.volume=.9;
      speechSynthesis.speak(u);
    }catch(e){}
  }

  function ageGuidance(bracket){
    if(bracket==="60+") return "Favor gradual progression, joint-friendly exercise options and sufficient recovery; do not assume low capacity solely because of age.";
    if(bracket==="50-59") return "Use progressive overload with deliberate recovery and mobility; preserve strength and power where technique is sound.";
    if(bracket==="40-49") return "Balance progressive overload with recovery, mobility and joint tolerance.";
    if(bracket==="30-39") return "Use normal progressive overload while monitoring recovery and movement quality.";
    return "Use normal progressive overload appropriate to training age, technique and readiness.";
  }

  function injectOnboarding(){
    if(document.getElementById("v27Onboarding"))return;
    const wrap=document.createElement("div");
    wrap.id="v27Onboarding";
    wrap.className="v27-overlay"+(personal?" hidden":"");
    wrap.innerHTML=`
      <div class="v27-onboard">
        <div class="v27-kicker">Personal PT setup</div>
        <h2>Personalize Zahi Fit</h2>
        <div class="notice">Set this once. Zahi Fit will use it as context for exercise selection, recovery, progression and AI PT guidance.</div>

        <div class="v27-step">
          <label>Sex</label>
          <div class="v27-choices" id="v27Sex">
            <button class="v27-choice" data-v="male">Male</button>
            <button class="v27-choice" data-v="female">Female</button>
          </div>
        </div>

        <div class="v27-step">
          <label>Age bracket</label>
          <div class="v27-choices age" id="v27Age">
            <button class="v27-choice" data-v="18-29">18–29</button>
            <button class="v27-choice" data-v="30-39">30–39</button>
            <button class="v27-choice" data-v="40-49">40–49</button>
            <button class="v27-choice" data-v="50-59">50–59</button>
            <button class="v27-choice" data-v="60+">60+</button>
          </div>
        </div>

        <div class="v27-profile-summary" id="v27ProfileSummary">Choose sex and age bracket to continue.</div>
        <div class="v27-actions">
          <button class="btn secondary" id="v27ProfileCancel">Not now</button>
          <button class="btn" id="v27ProfileSave" disabled>Save profile</button>
        </div>
        <div class="v27-note">Sex is used only where physiologically relevant. Age changes recovery/progression guidance, not an assumption about capability.</div>
      </div>`;
    document.body.append(wrap);

    let draft=personal?{...personal}:{sex:null,ageBracket:null};
    const paint=()=>{
      wrap.querySelectorAll("#v27Sex button").forEach(b=>b.classList.toggle("active",b.dataset.v===draft.sex));
      wrap.querySelectorAll("#v27Age button").forEach(b=>b.classList.toggle("active",b.dataset.v===draft.ageBracket));
      const s=wrap.querySelector("#v27ProfileSummary");
      if(draft.sex&&draft.ageBracket){
        s.textContent=`${draft.sex==="male"?"Male":"Female"} • ${draft.ageBracket} • ${ageGuidance(draft.ageBracket)}`;
        wrap.querySelector("#v27ProfileSave").disabled=false;
      }else{
        s.textContent="Choose sex and age bracket to continue.";
        wrap.querySelector("#v27ProfileSave").disabled=true;
      }
    };
    wrap.querySelectorAll("#v27Sex button").forEach(b=>b.onclick=()=>{draft.sex=b.dataset.v;paint()});
    wrap.querySelectorAll("#v27Age button").forEach(b=>b.onclick=()=>{draft.ageBracket=b.dataset.v;paint()});
    wrap.querySelector("#v27ProfileSave").onclick=()=>{
      personal={...draft};
      localStorage.setItem(PROFILE_KEY,JSON.stringify(personal));
      wrap.classList.add("hidden");
      refreshProfileCard();
    };
    wrap.querySelector("#v27ProfileCancel").onclick=()=>wrap.classList.add("hidden");
    paint();
  }

  function refreshProfileCard(){
    const box=document.getElementById("v27ProfileReadout");
    if(box) box.textContent=personal?`${personal.sex==="male"?"Male":"Female"} • ${personal.ageBracket}`:"Not set";
  }

  function injectSettings(){
    const guide=document.getElementById("guide");
    if(!guide||document.getElementById("v27ExperienceCard"))return;

    const card=document.createElement("div");
    card.className="card";
    card.id="v27ExperienceCard";
    card.innerHTML=`
      <div class="section-title">Personal PT profile & voice</div>
      <div class="v27-setting"><span>Profile</span><b id="v27ProfileReadout">Not set</b></div>
      <button class="btn secondary top-gap" id="v27EditProfile">Edit sex / age bracket</button>
      <div class="v27-setting">
        <span>Voice coach</span>
        <select id="v27VoiceMode">
          <option value="off">Off</option>
          <option value="essential">Essential cues</option>
          <option value="full">Full encouragement</option>
        </select>
      </div>
      <div class="v27-setting">
        <span>Rest timer sounds</span>
        <select id="v27AudioMode">
          <option value="on">On</option>
          <option value="off">Off</option>
        </select>
      </div>
      <button class="btn blue top-gap" id="v27TestVoice">Test voice & sound</button>
      <div class="v27-note">Essential: rest countdown and rest-complete voice. Full: also adds short set-completion encouragement.</div>`;
    guide.insertBefore(card,guide.firstChild);

    document.getElementById("v27VoiceMode").value=voiceMode;
    document.getElementById("v27AudioMode").value=audioEnabled?"on":"off";
    document.getElementById("v27VoiceMode").onchange=e=>{voiceMode=e.target.value;localStorage.setItem(VOICE_KEY,voiceMode)};
    document.getElementById("v27AudioMode").onchange=e=>{audioEnabled=e.target.value==="on";localStorage.setItem(AUDIO_KEY,audioEnabled?"on":"off");ensureAudio()};
    document.getElementById("v27EditProfile").onclick=()=>{
      const o=document.getElementById("v27Onboarding"); if(o)o.classList.remove("hidden");
    };
    document.getElementById("v27TestVoice").onclick=()=>{ensureAudio();cueStart();speak("Zahi Fit voice coach is ready.",true)};
    refreshProfileCard();
  }

  function symbolFor(step){
    const s=String(step).toLowerCase();
    if(/breath/.test(s))return "≋";
    if(/foot|feet|heel|stance/.test(s))return "⌁";
    if(/brace|ribs|core|trunk|spine/.test(s))return "◉";
    if(/hip|glute|pelvis/.test(s))return "↔";
    if(/rotate|rotation|turn/.test(s))return "⟳";
    if(/press|push|drive|stand/.test(s))return "↑";
    if(/pull|row|elbow/.test(s))return "←";
    if(/slow|control|pause|tempo/.test(s))return "◫";
    if(/shoulder|chest/.test(s))return "↗";
    if(/knee|squat|lunge/.test(s))return "⌄";
    return "◆";
  }

  function buildVisualDemo(ex){
    const d=document.createElement("div");
    d.className="v27-demo";
    const steps=(ex.how||[]).slice(0,4);
    d.innerHTML=`<div class="v27-demo-title"><strong>PT VISUAL DEMO</strong><span class="v27-coach-badge">Step-by-step</span></div>`;
    const grid=document.createElement("div");grid.className="v27-demo-grid";
    steps.forEach((step,i)=>{
      const c=document.createElement("div");c.className="v27-demo-step";
      c.innerHTML=`<div class="v27-demo-num">${i+1}</div><div class="v27-demo-icon">${symbolFor(step)}</div><div class="v27-demo-text">${String(step).replace(/[<>]/g,"")}</div>`;
      grid.append(c);
    });
    d.append(grid);
    const controls=document.createElement("div");controls.className="v27-inline-controls";
    const voice=document.createElement("button");voice.className="btn secondary";voice.textContent="▶ Hear PT cues";
    voice.onclick=()=>speak(`${ex.n}. ${steps.join(". ")}.`,true);
    const expand=document.createElement("button");expand.className="btn blue";expand.textContent="Open full demo";
    expand.onclick=()=>openDemoSheet(ex);
    controls.append(voice,expand);d.append(controls);
    return d;
  }

  function injectDemoSheet(){
    if(document.getElementById("v27DemoSheet"))return;
    const el=document.createElement("div");
    el.id="v27DemoSheet";el.className="sheet hidden v27-video-sheet";
    el.innerHTML=`<div class="sheet-card">
      <div class="sheet-handle"></div>
      <h3 id="v27DemoName">Exercise demo</h3>
      <div id="v27DemoBody"></div>
      <button id="v27DemoSpeak" class="btn blue top-gap">▶ PT voice walkthrough</button>
      <button id="v27DemoClose" class="sheet-btn">Back to workout</button>
    </div>`;
    document.body.append(el);
    document.getElementById("v27DemoClose").onclick=()=>el.classList.add("hidden");
  }

  let demoExercise=null;
  function openDemoSheet(ex){
    demoExercise=ex;
    injectDemoSheet();
    const sheet=document.getElementById("v27DemoSheet");
    document.getElementById("v27DemoName").textContent=ex.n;
    const body=document.getElementById("v27DemoBody");body.replaceChildren();
    const info=document.createElement("div");info.className="v27-video-placeholder";
    info.innerHTML=`<div class="v27-coach-badge">IN-APP PT DEMO</div>
      <div class="cue" style="margin-top:10px">${ex.cue}</div>
      <div class="v27-note">This replaces the external YouTube jump. You stay inside Zahi Fit while reviewing movement steps and voice cues.</div>`;
    body.append(info,buildVisualDemo(ex));
    document.getElementById("v27DemoSpeak").onclick=()=>speak(`${ex.n}. ${ex.cue}. ${(ex.how||[]).join(". ")}. Avoid: ${(ex.mistakes||[]).join(". ")}.`,true);
    sheet.classList.remove("hidden");
  }

  function enhanceCurrentExercise(){
    if(!window.state && typeof state==="undefined")return;
    try{
      if(!state)return;
      const ex=state.exercises[state.exerciseIndex];
      const box=document.getElementById("activeExerciseCard");
      if(!box||!ex)return;

      box.querySelectorAll(".v27-demo").forEach(x=>x.remove());
      const coach=box.querySelector(".coach-grid");
      const demo=buildVisualDemo(ex);
      if(coach)box.insertBefore(demo,coach); else box.append(demo);

      const old=box.querySelector(".demo-link");
      if(old){
        const b=document.createElement("button");
        b.className="btn blue demo-link";
        b.textContent="Open in-app PT demo";
        b.onclick=()=>openDemoSheet(ex);
        old.replaceWith(b);
      }
    }catch(e){console.error("v2.7 demo enhancement",e)}
  }

  // Re-render exercise with visual coaching after the existing app renders it.
  try{
    const baseRender=renderExercise;
    renderExercise=function(){baseRender();enhanceCurrentExercise()};
    if(typeof state!=="undefined"&&state)enhanceCurrentExercise();
  }catch(e){}

  // Add personal context to every AI PT request.
  try{
    const baseContext=currentPTContextV25;
    currentPTContextV25=function(){
      const c=baseContext();
      c.personalProfile=personal?{
        sex:personal.sex,
        ageBracket:personal.ageBracket,
        programmingGuidance:ageGuidance(personal.ageBracket),
        instruction:"Use sex only where physiologically relevant. Do not stereotype exercise capability. Tailor recovery, progression and movement options to age bracket, readiness, goals and actual performance."
      }:{sex:null,ageBracket:null};
      c.voiceCoach={mode:voiceMode};
      c.app="Zahi Fit v2.7.0";
      return c;
    };
  }catch(e){}

  // Rest timer sound + voice cues.
  try{
    const baseStart=startRest;
    startRest=function(sec){
      ensureAudio();cueStart();
      if(voiceMode!=="off")speak(`Rest started. ${sec} seconds.`);
      return baseStart(sec);
    };
  }catch(e){}

  const rest=document.getElementById("restTimer");
  if(rest){
    let last="";
    new MutationObserver(()=>{
      const v=rest.textContent;
      if(v===last)return;last=v;
      if(v==="00:10"){cueWarn();if(voiceMode!=="off")speak("Ten seconds.");}
      if(v==="00:00"){cueEnd();if(voiceMode!=="off")speak("Rest complete.");}
    }).observe(rest,{childList:true,subtree:true,characterData:true});
  }

  // Full voice mode encouragement when a set is completed.
  const exerciseCard=document.getElementById("activeExerciseCard");
  if(exerciseCard){
    exerciseCard.addEventListener("click",e=>{
      const b=e.target.closest("button.check");
      if(!b||voiceMode!=="full")return;
      setTimeout(()=>{
        if(!b.classList.contains("done"))return;
        const phrases=["Good set. Stay controlled.","Nice work. Keep the technique clean.","Set complete. Strong and steady.","Good. Recover, then repeat the quality."];
        speak(phrases[encouragementIndex++%phrases.length]);
      },30);
    });
  }

  document.addEventListener("pointerdown",ensureAudio,{once:true});

  injectDemoSheet();
  injectOnboarding();
  injectSettings();

  const badge=document.getElementById("versionBadge");
  if(badge)badge.textContent="v2.7.0";
})();