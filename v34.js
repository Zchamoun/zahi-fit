"use strict";
/* Zahi Fit v3.4.0 — Photorealistic Visual PT overlay */
(() => {
  const VERSION = "v3.4.0";
  const PHOTO_ROOT = "./pt-assets-v34/";

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

  const existingWorldStretch = i => `./pt-assets/world-stretch-step${i}.jpg`;
  const photoPath = (family, step) => family === "worldStretch"
    ? existingWorldStretch(step)
    : `${PHOTO_ROOT}${family}-step${step}.jpg`;

  const availability = new Map();
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const trimCue = (s, n=54) => {
    const t = String(s || "").replace(/\s+/g," ").trim();
    return t.length > n ? t.slice(0,n-1).trimEnd()+"…" : t;
  };

  function testImage(url){
    if(availability.has(url)) return Promise.resolve(availability.get(url));
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => { availability.set(url,true); resolve(true); };
      img.onerror = () => { availability.set(url,false); resolve(false); };
      img.src = `${url}?v=340`;
    });
  }

  function exerciseNameFromAlt(img){
    const alt = img.getAttribute("alt") || "";
    return alt.split(" — ")[0].trim();
  }

  function currentMainStep(root){
    const badge = root.querySelector(".zf31-step-badge")?.textContent || "";
    const m = badge.match(/STEP\s+(\d+)/i);
    return m ? Number(m[1]) : 1;
  }

  function stepForThumb(img){
    const thumb = img.closest(".zf30-thumb");
    if(!thumb) return null;
    const all = Array.from(thumb.parentElement?.querySelectorAll(".zf30-thumb") || []);
    const i = all.indexOf(thumb);
    return i >= 0 ? i+1 : null;
  }

  function cuePair(root){
    const items = Array.from(root.querySelectorAll(".zf30-list .zf30-item span:last-child"));
    const a = trimCue(items[0]?.textContent || "Set a stable position");
    const b = trimCue(items[1]?.textContent || "Move with control");
    return [a,b];
  }

  function ensureCallouts(root){
    const wrap = root.querySelector(".zf31-photo-wrap");
    const img = wrap?.querySelector("img.zf34-photo");
    if(!wrap || !img) return;
    wrap.querySelectorAll(".zf34-callout").forEach(n=>n.remove());
    const [a,b] = cuePair(root);
    const one = document.createElement("div");
    one.className = "zf34-callout zf34-callout-a";
    one.textContent = a;
    const two = document.createElement("div");
    two.className = "zf34-callout zf34-callout-b";
    two.textContent = b;
    wrap.append(one,two);
  }

  async function upgradeImage(img, root){
    if(!(img instanceof HTMLImageElement) || img.dataset.zf34Checked === "1") return;
    img.dataset.zf34Checked = "1";
    const exercise = exerciseNameFromAlt(img);
    const family = FAMILY[exercise];
    if(!family) return;
    const isThumb = !!img.closest(".zf30-thumb");
    const step = isThumb ? stepForThumb(img) : currentMainStep(root);
    if(!step) return;
    const url = photoPath(family, step);
    const ok = await testImage(url);
    if(!ok) return; // Safe fallback: retain the working v3.3 visual.
    img.src = `${url}?v=340`;
    img.classList.add("zf34-photo");
    img.dataset.zf34Family = family;
    img.dataset.zf34Step = String(step);
    if(!isThumb) ensureCallouts(root);
  }

  function process(root=document){
    const demo = root.id === "zf30" ? root : document.getElementById("zf30");
    if(!demo) return;
    demo.querySelectorAll("img.zf31-photo").forEach(img => upgradeImage(img,demo));
  }

  function resetChecks(root){
    root.querySelectorAll("img.zf31-photo").forEach(img => delete img.dataset.zf34Checked);
  }

  function addStyles(){
    if(document.getElementById("zf34-style")) return;
    const s=document.createElement("style");
    s.id="zf34-style";
    s.textContent=`
      #zf30 .zf31-photo.zf34-photo{object-fit:cover;background:#111a24}
      #zf30 .zf30-thumb .zf31-photo.zf34-photo{object-fit:cover}
      #zf30 .zf34-callout{position:absolute;z-index:7;max-width:215px;padding:10px 13px;border-radius:10px;border:2px solid #16bdf5;background:rgba(5,18,31,.92);color:#fff;font-size:13px;line-height:1.25;font-weight:800;box-shadow:0 10px 28px rgba(0,0,0,.45)}
      #zf30 .zf34-callout:after{content:"";position:absolute;width:72px;height:2px;background:#f5fbff;opacity:.95;transform-origin:left center}
      #zf30 .zf34-callout:before{content:"";position:absolute;width:0;height:0;border-top:5px solid transparent;border-bottom:5px solid transparent;border-left:9px solid #f5fbff}
      #zf30 .zf34-callout-a{left:4%;top:28%}
      #zf30 .zf34-callout-a:after{left:100%;top:70%;transform:rotate(25deg)}
      #zf30 .zf34-callout-a:before{left:calc(100% + 65px);top:calc(70% + 28px);transform:rotate(25deg)}
      #zf30 .zf34-callout-b{right:4%;bottom:18%}
      #zf30 .zf34-callout-b:after{right:100%;top:45%;transform:rotate(205deg);transform-origin:right center}
      #zf30 .zf34-callout-b:before{right:calc(100% + 65px);top:calc(45% - 34px);transform:rotate(205deg)}
      #zf30 .zf34-photo + .zf31-step-badge{box-shadow:0 6px 22px rgba(0,0,0,.35)}
      @media(max-width:520px){#zf30 .zf34-callout{font-size:11px;max-width:155px;padding:8px 10px}#zf30 .zf34-callout-b{right:2%;bottom:12%}}
    `;
    document.head.appendChild(s);
  }

  const observer = new MutationObserver(mutations => {
    const demo = document.getElementById("zf30");
    if(!demo) return;
    let shouldProcess = false;
    for(const m of mutations){
      if(m.type === "childList" || (m.type === "attributes" && m.attributeName === "src")){ shouldProcess = true; break; }
    }
    if(shouldProcess){
      resetChecks(demo);
      queueMicrotask(()=>process(demo));
    }
  });

  addStyles();
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:["src"]});
  document.addEventListener("click",()=>setTimeout(()=>process(document),30),true);
  document.getElementById("versionBadge")?.replaceChildren(document.createTextNode(VERSION));
  setTimeout(()=>process(document),100);
})();
