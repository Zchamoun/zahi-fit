"use strict";
// Zahi Fit v2.6.0 patch: seamless embedded AI PT powered by the secure Cloudflare Worker.

(function(){
  const PT_ENDPOINT = "https://zahi-fit-pt.chamounzahi.workers.dev";
  const PT_HISTORY_KEY = "zahiFitPTConversationV26";
  let ptBusyV26 = false;

  function loadConversationV26(){
    try{
      const x = JSON.parse(localStorage.getItem(PT_HISTORY_KEY) || "[]");
      return Array.isArray(x) ? x.slice(-8) : [];
    }catch(e){
      return [];
    }
  }

  let ptConversationV26 = loadConversationV26();

  function saveConversationV26(){
    localStorage.setItem(PT_HISTORY_KEY, JSON.stringify(ptConversationV26.slice(-8)));
  }

  function ensurePTResultV26(){
    const sheet = document.getElementById("ptSheetV25");
    if(!sheet) return null;

    let box = document.getElementById("ptResultV26");
    if(box) return box;

    box = document.createElement("div");
    box.id = "ptResultV26";
    box.style.marginTop = "12px";
    box.style.padding = "14px";
    box.style.border = "1px solid #166534";
    box.style.borderRadius = "14px";
    box.style.background = "#0d1525";
    box.style.display = "none";

    const title = document.createElement("div");
    title.id = "ptResultTitleV26";
    title.textContent = "Zahi Fit PT";
    title.style.fontWeight = "800";
    title.style.color = "#bbf7d0";
    title.style.marginBottom = "8px";

    const answer = document.createElement("div");
    answer.id = "ptAnswerV26";
    answer.style.whiteSpace = "pre-wrap";
    answer.style.lineHeight = "1.5";
    answer.style.color = "#e2e8f0";
    answer.style.fontSize = "14px";

    box.append(title, answer);

    const custom = sheet.querySelector(".pt-custom-v25");
    if(custom) custom.parentNode.insertBefore(box, custom);
    else sheet.querySelector(".sheet-card").append(box);

    return box;
  }

  function showPTSheetV26(){
    if(typeof window.openSheet === "function"){
      window.openSheet("ptSheetV25");
    }else{
      const el = document.getElementById("ptSheetV25");
      if(el) el.classList.remove("hidden");
    }
  }

  function setPTStatusV26(text, mode){
    const box = ensurePTResultV26();
    if(!box) return;
    box.style.display = "block";

    const title = document.getElementById("ptResultTitleV26");
    const answer = document.getElementById("ptAnswerV26");

    if(mode === "loading"){
      title.textContent = "Zahi Fit PT • thinking…";
      title.style.color = "#7dd3fc";
    }else if(mode === "error"){
      title.textContent = "Zahi Fit PT • connection issue";
      title.style.color = "#fca5a5";
    }else{
      title.textContent = "Zahi Fit PT";
      title.style.color = "#bbf7d0";
    }

    answer.textContent = text;
  }

  function contextV26(){
    let base = {};
    try{
      if(typeof window.currentPTContextV25 === "function"){
        base = window.currentPTContextV25() || {};
      }else if(typeof currentPTContextV25 === "function"){
        base = currentPTContextV25() || {};
      }
    }catch(e){}

    return {
      ...base,
      app: "Zahi Fit v2.6.0",
      ptConversation: ptConversationV26.slice(-6)
    };
  }

  async function askEmbeddedPTV26(question){
    const q = String(question || "").trim();
    if(!q || ptBusyV26) return;

    showPTSheetV26();
    setPTStatusV26("Reviewing your current workout, readiness and recent training…", "loading");
    ptBusyV26 = true;

    const sendBtn = document.getElementById("sendPtV25");
    if(sendBtn){
      sendBtn.disabled = true;
      sendBtn.textContent = "Thinking…";
    }

    try{
      const response = await fetch(PT_ENDPOINT, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          question: q,
          context: contextV26()
        })
      });

      let data = {};
      try{
        data = await response.json();
      }catch(e){}

      if(!response.ok || !data.answer){
        const detail = data && data.error ? data.error : `Request failed (${response.status})`;
        throw new Error(detail);
      }

      const answer = String(data.answer).trim();

      ptConversationV26.push(
        {role:"user", text:q, at:new Date().toISOString()},
        {role:"assistant", text:answer, at:new Date().toISOString()}
      );
      ptConversationV26 = ptConversationV26.slice(-8);
      saveConversationV26();

      setPTStatusV26(answer, "ok");

      const input = document.getElementById("ptQuestionV25");
      if(input){
        input.value = "";
        input.placeholder = "Ask a follow-up question…";
      }
    }catch(error){
      console.error("Zahi Fit PT request failed", error);
      setPTStatusV26(
        "I couldn't reach the PT service. Check your connection and try again. Your workout remains unchanged.",
        "error"
      );
    }finally{
      ptBusyV26 = false;
      if(sendBtn){
        sendBtn.disabled = false;
        sendBtn.textContent = "Ask PT";
      }
    }
  }

  // Replace the old browser / ChatGPT-app handoff with an in-app API request.
  window.launchPTV25 = askEmbeddedPTV26;

  function rewirePTButtonsV26(){
    ensurePTResultV26();

    document.querySelectorAll(".pt-quick-v25").forEach(button=>{
      button.onclick = function(){
        askEmbeddedPTV26(button.textContent);
      };
    });

    const send = document.getElementById("sendPtV25");
    if(send){
      send.onclick = function(){
        const input = document.getElementById("ptQuestionV25");
        const q = input ? input.value.trim() : "";
        if(q) askEmbeddedPTV26(q);
      };
    }

    const input = document.getElementById("ptQuestionV25");
    if(input){
      input.addEventListener("keydown", function(e){
        if(e.key === "Enter"){
          e.preventDefault();
          const q = input.value.trim();
          if(q) askEmbeddedPTV26(q);
        }
      });
    }

    ["askPtHomeBtn","askPtSessionBtn","askPtSettingsBtn"].forEach(id=>{
      const b = document.getElementById(id);
      if(b && typeof window.openPTV25 === "function") b.onclick = window.openPTV25;
    });
  }

  // v25 has already created the PT sheet before this patch loads.
  rewirePTButtonsV26();

  const originalOpenPT = window.openPTV25;
  if(typeof originalOpenPT === "function"){
    window.openPTV25 = function(){
      originalOpenPT();
      ensurePTResultV26();
      const box = document.getElementById("ptResultV26");
      if(box) box.style.display = "none";
    };

    ["askPtHomeBtn","askPtSessionBtn","askPtSettingsBtn"].forEach(id=>{
      const b = document.getElementById(id);
      if(b) b.onclick = window.openPTV25;
    });
  }

  const badge = document.getElementById("versionBadge");
  if(badge) badge.textContent = "v2.6.0";
})();