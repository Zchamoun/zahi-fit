"use strict";
// Zahi Fit v2.5.1 patch: direct ChatGPT Android app handoff with prompt context.

// Patch the existing v2.5 launchPTV25 function after v25.js loads.
(function(){
  if(typeof window.launchPTV25!=="function") return;
  window.launchPTV25 = async function(question){
    const prompt=`Act as my Zahi Fit personal trainer. Use the structured context below and answer my immediate question. Keep the recommendation practical for the current workout. If I mention sharp pain, chest pain, fainting, or unusual shortness of breath, tell me to stop the exercise and seek appropriate medical assessment rather than pushing through.

QUESTION:
${question}

ZAHI FIT CONTEXT:
${JSON.stringify(currentPTContextV25(),null,2)}`;

    try{ await navigator.clipboard.writeText(prompt); }catch(e){}

    const encoded=encodeURIComponent(prompt);
    const intent="intent:#Intent;action=android.intent.action.SEND;type=text/plain;package=com.openai.chatgpt;S.android.intent.extra.TEXT="+encoded+";S.browser_fallback_url=https%3A%2F%2Fchatgpt.com%2F;end";
    window.location.href=intent;
  };

  const badge=document.getElementById("versionBadge");
  if(badge) badge.textContent="v2.5.1";
})();
