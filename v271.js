/* Zahi Fit v2.7.1 — Guided PT Demo upgrade */
"use strict";

(() => {
  const VERSION = "v2.7.1";

  const specific = {
    "world's greatest stretch": {
      feel: "Hip flexors, groin and upper-back rotation. The movement should feel like a controlled stretch, never a sharp pinch.",
      steps: [
        ["Set the lunge", "Step your right foot forward into a long lunge. Keep the entire right foot planted. Extend the left leg behind you and place both hands on the floor inside the right foot."],
        ["Lower with control", "Keeping your right foot flat, bring your right elbow toward the inside of your right foot. Do not force it to the floor. Keep your hips controlled and breathe out slowly."],
        ["Rotate upward", "Keep your left hand planted. Rotate your chest toward your right knee and reach your right arm toward the ceiling. Follow your hand with your eyes instead of twisting only through the shoulder."],
        ["Pause and breathe", "Hold the top position for about one to two seconds. Take a controlled breath while keeping the front knee tracking in line with the toes."],
        ["Return and repeat", "Bring your right hand back to the floor under control. Complete five smooth repetitions, then change sides. Move through the range you can control without pain."]
      ],
      mistakes: [
        "Front heel lifting — shorten the lunge until the whole foot stays planted.",
        "Front knee collapsing inward — keep the knee tracking toward the middle toes.",
        "Forcing the elbow to the floor — use only a comfortable, controlled range.",
        "Rotating only the arm — turn the chest and upper back together.",
        "Rushing — make each repetition deliberate and breathe throughout."
      ]
    },
    "deadlift": {
      feel: "Hamstrings, glutes, upper back and trunk tension. You should not feel sharp pain in the lower back.",
      steps: [
        ["Set your feet", "Stand with the bar over your mid-foot, roughly hip-width apart. Keep the bar close enough that your shins are only a few centimetres away."],
        ["Grip and brace", "Hinge down and grip just outside your legs. Take a breath into your abdomen, brace your trunk, pull your shoulders down and back slightly, and remove the slack from the bar."],
        ["Push the floor away", "Drive through the whole foot. Let your knees and hips extend together while keeping the bar close to your legs. Keep your spine controlled rather than jerking the bar from the floor."],
        ["Stand tall", "Finish with hips and knees straight and ribs stacked over the pelvis. Do not lean backward or overextend your lower back."],
        ["Lower under control", "Push your hips backward first, keep the bar close to your thighs, then bend the knees once the bar passes them. Reset your brace before the next repetition."]
      ],
      mistakes: [
        "Bar drifting forward — keep it close to the legs.",
        "Jerking from the floor — build tension before you pull.",
        "Hips shooting up first — push the floor away and let hips and shoulders rise together.",
        "Overextending at lockout — finish tall, not leaning backward."
      ]
    }
  };

  function key(s){ return String(s || "").trim().toLowerCase(); }
  function esc(s){ return String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

  function currentExercise(){
    try {
      if (typeof window.currentPTContextV25 === "function") {
        const c = window.currentPTContextV25();
        if (c?.currentExercise) return c.currentExercise;
      }
    } catch {}
    const title = document.querySelector("main h1, main h2, .exercise-title, h1, h2");
    return { name: title?.textContent?.trim() || "Current exercise" };
  }

  function findSpecific(name){
    const k = key(name);
    for (const [n,d] of Object.entries(specific)) if (k.includes(n)) return d;
    return null;
  }

  function genericDemo(ex){
    const block = key(ex?.block);
    const target = ex?.target ? String(ex.target) : "";
    if (block.includes("mobility") || block.includes("flexibility")) {
      return {
        feel: "A controlled stretch or mobility challenge in the intended area, without sharp pain, numbness or pinching.",
        steps: [
          ["Set the start position", `Get into a stable starting position for ${ex.name}. Use support if needed so you can control the movement rather than chase range.`],
          ["Create tension", "Brace gently and keep the joints you are not trying to move stable. Start from a range that feels comfortable."],
          ["Move slowly", "Move into the intended range under control. Do not bounce or force the end position."],
          ["Breathe at end range", "Pause briefly and use a slow exhale to relax into the available range while maintaining alignment."],
          ["Return and repeat", `Return smoothly and repeat ${target || "for the prescribed reps or time"}. Stop short of sharp pain or pinching.`]
        ],
        mistakes: ["Rushing or bouncing.", "Forcing range instead of controlling it.", "Losing joint alignment to reach farther.", "Holding your breath."]
      };
    }
    if (block.includes("conditioning")) {
      return {
        feel: "Elevated breathing and muscular effort that matches the prescribed intensity while movement remains controlled.",
        steps: [
          ["Set up", `Adjust the equipment and posture for ${ex.name}. Begin below target intensity so you can establish rhythm safely.`],
          ["Build gradually", "Increase pace or resistance progressively rather than sprinting immediately."],
          ["Hold efficient posture", "Keep your trunk controlled, shoulders relaxed and movement smooth. Avoid wasting energy through excessive upper-body tension."],
          ["Match the target", `Work at the prescribed target ${target ? `(${target})` : ""}. Use the exercise-specific level, resistance, cadence or time shown by Zahi Fit.`],
          ["Finish under control", "Ease down progressively rather than stopping abruptly. Record the exercise-specific result so the next session can be adjusted."]
        ],
        mistakes: ["Starting too hard.", "Letting posture collapse as fatigue rises.", "Using resistance that destroys movement quality.", "Ignoring unusual symptoms."]
      };
    }
    return {
      feel: "The target muscles working with stable joints and repeatable technique. Normal muscular effort is expected; sharp pain is not.",
      steps: [
        ["Set your position", `Set up for ${ex.name} with stable contact points, neutral joint alignment and the load under control.`],
        ["Brace before moving", "Create trunk tension, set the working joints and take the slack out of the movement before the repetition starts."],
        ["Perform the working phase", "Move through the prescribed path smoothly. Keep the load controlled and avoid using momentum to bypass the target muscles."],
        ["Finish the repetition", "Reach the intended end position without forcing extra range or losing alignment."],
        ["Reset and repeat", `Return under control, reset your brace and repeat ${target || "for the prescribed repetitions"}. Stop the set when technique meaningfully deteriorates.`]
      ],
      mistakes: ["Using momentum.", "Losing alignment as effort rises.", "Rushing the lowering phase.", "Continuing after technique clearly breaks down."]
    };
  }

  function demoFor(ex){ return findSpecific(ex?.name) || genericDemo(ex || {}); }

  function speakDemo(ex, demo){
    if (!("speechSynthesis" in window)) {
      alert("Voice coaching is not supported by this browser.");
      return;
    }
    speechSynthesis.cancel();
    const intro = `Guided PT demo for ${ex.name}.`;
    const body = demo.steps.map((s,i)=>`Step ${i+1}. ${s[0]}. ${s[1]}`).join(" ");
    const end = `What you should feel. ${demo.feel}`;
    const u = new SpeechSynthesisUtterance(`${intro} ${body} ${end}`);
    u.rate = 0.88;
    u.pitch = 1;
    speechSynthesis.speak(u);
  }

  function showDemo(ex){
    const demo = demoFor(ex);
    document.getElementById("zf-guided-demo")?.remove();
    const overlay = document.createElement("div");
    overlay.id = "zf-guided-demo";
    overlay.innerHTML = `
      <div class="zf271-backdrop"></div>
      <section class="zf271-sheet" role="dialog" aria-modal="true" aria-label="Guided PT Demo">
        <div class="zf271-handle"></div>
        <div class="zf271-head">
          <div><div class="zf271-kicker">GUIDED PT DEMO</div><h2>${esc(ex.name)}</h2></div>
          <button class="zf271-close" aria-label="Close">×</button>
        </div>
        <p class="zf271-intro">Follow each position in order. The voice coach reads the same instructions so you can follow without looking at the screen.</p>
        <div class="zf271-actions">
          <button class="zf271-speak">▶ Start guided voice</button>
          <button class="zf271-stop">■ Stop voice</button>
        </div>
        <div class="zf271-steps">
          ${demo.steps.map((s,i)=>`
            <article class="zf271-step">
              <div class="zf271-figure" aria-hidden="true">
                <span class="zf271-num">${i+1}</span>
                <div class="zf271-person"><i class="head"></i><i class="body"></i><i class="arm a"></i><i class="arm b"></i><i class="leg a"></i><i class="leg b"></i></div>
              </div>
              <div><h3>Step ${i+1} — ${esc(s[0])}</h3><p>${esc(s[1])}</p></div>
            </article>`).join("")}
        </div>
        <div class="zf271-feel"><strong>What you should feel</strong><p>${esc(demo.feel)}</p></div>
        <div class="zf271-mistakes"><strong>Common mistakes & corrections</strong><ul>${demo.mistakes.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
        <button class="zf271-done">Got it — return to exercise</button>
      </section>`;
    document.body.appendChild(overlay);
    const close = () => { try{speechSynthesis.cancel()}catch{}; overlay.remove(); };
    overlay.querySelector(".zf271-close").onclick = close;
    overlay.querySelector(".zf271-done").onclick = close;
    overlay.querySelector(".zf271-backdrop").onclick = close;
    overlay.querySelector(".zf271-speak").onclick = () => speakDemo(ex,demo);
    overlay.querySelector(".zf271-stop").onclick = () => speechSynthesis.cancel();
  }

  function upgradeButtons(){
    const buttons = [...document.querySelectorAll("button")];
    for (const b of buttons) {
      const t = b.textContent.trim().toLowerCase();
      if (t === "open full demo" || t === "open in-app pt demo") {
        b.textContent = t === "open full demo" ? "Open guided demo" : "Open guided PT demo";
        if (!b.dataset.zf271) {
          b.dataset.zf271 = "1";
          b.addEventListener("click", e => {
            e.preventDefault(); e.stopImmediatePropagation();
            showDemo(currentExercise());
          }, true);
        }
      }
      if (t.includes("hear pt cues")) {
        b.textContent = "▶ Guided voice coaching";
        if (!b.dataset.zf271) {
          b.dataset.zf271 = "1";
          b.addEventListener("click", e => {
            e.preventDefault(); e.stopImmediatePropagation();
            const ex=currentExercise(), d=demoFor(ex); speakDemo(ex,d);
          }, true);
        }
      }
    }
  }

  function addStyles(){
    if(document.getElementById("zf271-style")) return;
    const s=document.createElement("style"); s.id="zf271-style";
    s.textContent=`
      #zf-guided-demo{position:fixed;inset:0;z-index:999999;font-family:inherit;color:#eef5ff}
      .zf271-backdrop{position:absolute;inset:0;background:rgba(0,5,15,.78)}
      .zf271-sheet{position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:min(760px,100%);max-height:94vh;overflow:auto;background:#111b2d;border:1px solid #2c3d57;border-radius:28px 28px 0 0;padding:18px 22px 30px;box-sizing:border-box}
      .zf271-handle{width:72px;height:7px;border-radius:9px;background:#62728a;margin:0 auto 18px}
      .zf271-head{display:flex;justify-content:space-between;gap:12px;align-items:start}.zf271-head h2{margin:4px 0 0;font-size:30px}.zf271-kicker{color:#83efb0;font-weight:800;letter-spacing:.04em}
      .zf271-close{background:#1b2940;color:white;border:1px solid #344762;border-radius:50%;width:42px;height:42px;font-size:28px}
      .zf271-intro{color:#b9c7da;line-height:1.5}.zf271-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:16px 0}
      .zf271-actions button,.zf271-done{border:0;border-radius:14px;padding:15px;font-weight:800;font-size:16px}.zf271-speak,.zf271-done{background:#39b9ee;color:#06101b}.zf271-stop{background:#1b2940;color:#eef5ff}
      .zf271-step{display:grid;grid-template-columns:115px 1fr;gap:15px;padding:15px 0;border-top:1px solid #28374d}.zf271-step h3{margin:2px 0 8px;font-size:18px}.zf271-step p{margin:0;color:#d3ddec;line-height:1.55}
      .zf271-figure{height:112px;border-radius:16px;background:#0b1424;border:1px solid #263a56;position:relative;display:flex;align-items:center;justify-content:center}.zf271-num{position:absolute;top:8px;left:9px;background:#235ddd;border-radius:50%;width:28px;height:28px;display:grid;place-items:center;font-weight:800}
      .zf271-person{position:relative;width:52px;height:76px}.zf271-person i{position:absolute;display:block;background:#53c9f3;border-radius:8px}.zf271-person .head{width:17px;height:17px;border-radius:50%;left:18px;top:0}.zf271-person .body{width:7px;height:33px;left:23px;top:19px}.zf271-person .arm{width:6px;height:30px;top:22px;transform-origin:top}.zf271-person .arm.a{left:22px;transform:rotate(48deg)}.zf271-person .arm.b{left:26px;transform:rotate(-48deg)}.zf271-person .leg{width:7px;height:31px;top:48px;transform-origin:top}.zf271-person .leg.a{left:23px;transform:rotate(28deg)}.zf271-person .leg.b{left:25px;transform:rotate(-28deg)}
      .zf271-feel,.zf271-mistakes{margin:16px 0;padding:16px;border-radius:16px;background:#0c1728;border:1px solid #275e46}.zf271-feel strong,.zf271-mistakes strong{color:#9bf2bd}.zf271-feel p,.zf271-mistakes li{line-height:1.5;color:#d7e1ef}.zf271-done{width:100%;margin-top:4px}
      @media(max-width:520px){.zf271-step{grid-template-columns:90px 1fr}.zf271-figure{height:100px}.zf271-sheet{padding-left:16px;padding-right:16px}.zf271-head h2{font-size:25px}}
    `;
    document.head.appendChild(s);
  }

  function version(){
    document.querySelectorAll("*").forEach(el=>{
      if(el.children.length===0 && /^v2\.7\.0$/.test(el.textContent.trim())) el.textContent=VERSION;
    });
  }

  addStyles(); version(); upgradeButtons();
  new MutationObserver(()=>{version();upgradeButtons()}).observe(document.body,{childList:true,subtree:true});
})();
