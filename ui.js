// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ui.js — All overlay screens, companions, chat, roulette
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── Companions ────────────────────────────────────────────────────────────────
var COMPANIONS =[
  {id:"cat",name:"Cat",color:"#ffcc88",rarity:"Common",svg:`<svg viewBox="0 0 60 80" width="60" height="80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="cBody" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="#ffe0a0"/><stop offset="100%" stop-color="#d4823a"/></radialGradient><radialGradient id="cHead" cx="38%" cy="32%" r="62%"><stop offset="0%" stop-color="#ffe8b0"/><stop offset="100%" stop-color="#cc7a30"/></radialGradient><filter id="sf0"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.35"/></filter></defs><path d="M42 62 Q58 54 55 44 Q52 36 46 40" stroke="#c07030" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="30" cy="54" rx="16" ry="19" fill="url(#cBody)" filter="url(#sf0)"/><ellipse cx="30" cy="57" rx="9" ry="12" fill="#fff4dd"/><ellipse cx="20" cy="71" rx="6" ry="4" fill="#d4823a"/><ellipse cx="40" cy="71" rx="6" ry="4" fill="#d4823a"/><ellipse cx="20" cy="70" rx="5" ry="3" fill="#ffe0a0"/><ellipse cx="40" cy="70" rx="5" ry="3" fill="#ffe0a0"/><polygon points="16,22 11,10 22,16" fill="#d4823a"/><polygon points="44,22 49,10 38,16" fill="#d4823a"/><polygon points="17,21 13,13 21,17" fill="#f0a060"/><polygon points="43,21 47,13 39,17" fill="#f0a060"/><ellipse cx="30" cy="28" rx="15" ry="14" fill="url(#cHead)" filter="url(#sf0)"/><ellipse cx="23" cy="27" rx="4" ry="4.5" fill="#1a4a1a"/><ellipse cx="37" cy="27" rx="4" ry="4.5" fill="#1a4a1a"/><ellipse cx="23" cy="26" rx="1.5" ry="2" fill="white" opacity="0.7"/><ellipse cx="37" cy="26" rx="1.5" ry="2" fill="white" opacity="0.7"/><circle cx="23.8" cy="25.5" r="0.7" fill="white" opacity="0.9"/><circle cx="37.8" cy="25.5" r="0.7" fill="white" opacity="0.9"/><path d="M28.5 32 L30 34 L31.5 32 Z" fill="#e87070"/><line x1="8" y1="31" x2="22" y2="32" stroke="#888" stroke-width="0.7" opacity="0.7"/><line x1="38" y1="32" x2="52" y2="31" stroke="#888" stroke-width="0.7" opacity="0.7"/></svg>`},
  {id:"dog",name:"Dog",color:"#c8964a",rarity:"Common",svg:`<svg viewBox="0 0 60 80" width="60" height="80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="dBody" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="#e8b870"/><stop offset="100%" stop-color="#a06830"/></radialGradient><radialGradient id="dHead" cx="38%" cy="32%" r="62%"><stop offset="0%" stop-color="#f0c880"/><stop offset="100%" stop-color="#a87030"/></radialGradient><filter id="sf1"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/></filter></defs><path d="M44 58 Q58 48 56 38" stroke="#a06830" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="30" cy="54" rx="17" ry="19" fill="url(#dBody)" filter="url(#sf1)"/><ellipse cx="30" cy="57" rx="10" ry="12" fill="#f8e0b0"/><ellipse cx="19" cy="71" rx="7" ry="4.5" fill="#a06830"/><ellipse cx="41" cy="71" rx="7" ry="4.5" fill="#a06830"/><ellipse cx="13" cy="26" rx="7" ry="10" fill="#8a5820" transform="rotate(-20 13 26)"/><ellipse cx="47" cy="26" rx="7" ry="10" fill="#8a5820" transform="rotate(20 47 26)"/><ellipse cx="30" cy="27" rx="16" ry="15" fill="url(#dHead)" filter="url(#sf1)"/><ellipse cx="30" cy="33" rx="8" ry="6" fill="#dda860"/><ellipse cx="23" cy="25" rx="4.5" ry="4.5" fill="#301808"/><ellipse cx="37" cy="25" rx="4.5" ry="4.5" fill="#301808"/><circle cx="23.8" cy="23.5" r="0.8" fill="white" opacity="0.95"/><circle cx="37.8" cy="23.5" r="0.8" fill="white" opacity="0.95"/><ellipse cx="30" cy="31" rx="3.5" ry="2.5" fill="#1a0a00"/><path d="M27 34.5 Q30 37.5 33 34.5" stroke="#805028" stroke-width="1" fill="none"/></svg>`},
  {id:"ghost",name:"Ghost",color:"#c8c8ff",rarity:"Common",svg:`<svg viewBox="0 0 60 80" width="60" height="80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="gBody" cx="42%" cy="30%" r="65%"><stop offset="0%" stop-color="#f0f0ff"/><stop offset="100%" stop-color="#9898cc"/></radialGradient><filter id="sf2"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#6060aa" flood-opacity="0.5"/></filter></defs><path d="M8 30 Q8 10 30 8 Q52 10 52 30 L52 58 Q46 52 40 58 Q34 52 30 58 Q26 52 20 58 Q14 52 8 58 Z" fill="url(#gBody)" filter="url(#sf2)"/><ellipse cx="30" cy="32" rx="12" ry="14" fill="rgba(255,255,255,0.12)"/><ellipse cx="21" cy="30" rx="5.5" ry="6.5" fill="#202070"/><ellipse cx="39" cy="30" rx="5.5" ry="6.5" fill="#202070"/><circle cx="20.5" cy="27.5" r="1.2" fill="white" opacity="0.9"/><circle cx="38.5" cy="27.5" r="1.2" fill="white" opacity="0.9"/><path d="M22 40 Q25 44 30 42 Q35 44 38 40" stroke="#5050aa" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M8 36 Q2 32 4 26" stroke="#b0b0e8" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M52 36 Q58 32 56 26" stroke="#b0b0e8" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="4" cy="25" r="4" fill="#c0c0ee"/><circle cx="56" cy="25" r="4" fill="#c0c0ee"/></svg>`},
  {id:"star",name:"Star",color:"#ffd700",rarity:"Rare",svg:`<svg viewBox="0 0 60 80" width="60" height="80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="sBody" cx="42%" cy="35%" r="60%"><stop offset="0%" stop-color="#fff0a0"/><stop offset="100%" stop-color="#c89000"/></radialGradient><filter id="sf3"><feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#ffd700" flood-opacity="0.6"/></filter></defs><polygon points="30,8 35,22 50,22 38,31 42,46 30,37 18,46 22,31 10,22 25,22" fill="url(#sBody)" filter="url(#sf3)"/><ellipse cx="24" cy="25" rx="3" ry="3.2" fill="#3a2000"/><ellipse cx="36" cy="25" rx="3" ry="3.2" fill="#3a2000"/><circle cx="24" cy="23.5" r="0.7" fill="white" opacity="0.9"/><circle cx="36" cy="23.5" r="0.7" fill="white" opacity="0.9"/><path d="M26 30 Q30 33 34 30" stroke="#7a5000" stroke-width="1" fill="none"/><rect x="24" y="46" width="5" height="14" rx="2.5" fill="#ffd700"/><rect x="31" y="46" width="5" height="14" rx="2.5" fill="#ffd700"/><ellipse cx="26.5" cy="61" rx="5" ry="3" fill="#c89000"/><ellipse cx="33.5" cy="61" rx="5" ry="3" fill="#c89000"/></svg>`},
  {id:"moon",name:"Moon",color:"#aaaaff",rarity:"Rare",svg:`<svg viewBox="0 0 60 80" width="60" height="80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="mBody" cx="38%" cy="32%" r="62%"><stop offset="0%" stop-color="#e8e8ff"/><stop offset="100%" stop-color="#8080cc"/></radialGradient><filter id="sf4"><feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#8888ff" flood-opacity="0.5"/></filter></defs><circle cx="6" cy="12" r="1.5" fill="#ffffaa" opacity="0.8"/><circle cx="54" cy="8" r="1" fill="#ffffaa" opacity="0.7"/><path d="M44 16 A22 22 0 1 0 44 54 A16 16 0 1 1 44 16 Z" fill="url(#mBody)" filter="url(#sf4)"/><circle cx="22" cy="40" r="3.5" fill="none" stroke="rgba(140,140,220,0.5)" stroke-width="1.2"/><circle cx="16" cy="28" r="2" fill="none" stroke="rgba(140,140,220,0.35)" stroke-width="0.8"/><ellipse cx="24" cy="27" rx="4" ry="4.2" fill="#202070"/><ellipse cx="34" cy="27" rx="4" ry="4.2" fill="#202070"/><circle cx="24" cy="25" r="0.8" fill="white" opacity="0.9"/><circle cx="34" cy="25" r="0.8" fill="white" opacity="0.9"/><path d="M22 33 Q28 37 34 33" stroke="#5050aa" stroke-width="1.2" fill="none"/><ellipse cx="29" cy="68" rx="12" ry="5" fill="#8080cc" opacity="0.7"/><ellipse cx="29" cy="66" rx="7" ry="2.5" fill="#d8d8ff"/></svg>`},
  {id:"flame",name:"Flame",color:"#ff6030",rarity:"Rare",svg:`<svg viewBox="0 0 60 80" width="60" height="80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="fOut" cx="50%" cy="70%" r="60%"><stop offset="0%" stop-color="#ff4000"/><stop offset="100%" stop-color="#cc0000"/></radialGradient><radialGradient id="fMid" cx="50%" cy="65%" r="55%"><stop offset="0%" stop-color="#ffaa00"/><stop offset="100%" stop-color="#ff5500"/></radialGradient><radialGradient id="fCore" cx="50%" cy="60%" r="50%"><stop offset="0%" stop-color="#ffffff"/><stop offset="40%" stop-color="#ffee80"/><stop offset="100%" stop-color="#ffaa00"/></radialGradient><filter id="sf5"><feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#ff4000" flood-opacity="0.7"/></filter></defs><path d="M30 72 Q10 62 12 44 Q14 30 18 22 Q16 34 24 36 Q18 26 22 14 Q28 24 26 32 Q32 24 30 14 Q36 24 34 32 Q40 26 38 14 Q44 24 42 36 Q48 34 46 22 Q52 30 48 44 Q50 62 30 72 Z" fill="url(#fOut)" filter="url(#sf5)"/><path d="M30 68 Q16 58 18 44 Q20 34 22 28 Q21 36 26 38 Q22 30 26 20 Q30 28 28 36 Q34 28 32 20 Q36 30 34 36 Q38 34 38 28 Q42 34 42 44 Q44 58 30 68 Z" fill="url(#fMid)"/><path d="M30 62 Q22 54 24 44 Q26 36 28 32 Q29 38 30 36 Q31 38 32 32 Q34 36 36 44 Q38 54 30 62 Z" fill="url(#fCore)"/><ellipse cx="24" cy="44" rx="3.5" ry="3.8" fill="#4a0000" opacity="0.85"/><ellipse cx="36" cy="44" rx="3.5" ry="3.8" fill="#4a0000" opacity="0.85"/><circle cx="24" cy="42.5" r="0.7" fill="white" opacity="0.8"/><circle cx="36" cy="42.5" r="0.7" fill="white" opacity="0.8"/><path d="M26 50 Q30 54 34 50" stroke="#4a0000" stroke-width="1.2" fill="none"/></svg>`},
  {id:"crown",name:"Crown",color:"#ff8c00",rarity:"Epic",svg:`<svg viewBox="0 0 60 80" width="60" height="80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="crH" cx="38%" cy="35%" r="60%"><stop offset="0%" stop-color="#ffe0b0"/><stop offset="100%" stop-color="#d4a060"/></radialGradient><radialGradient id="crR" cx="50%" cy="30%" r="65%"><stop offset="0%" stop-color="#cc2020"/><stop offset="100%" stop-color="#880808"/></radialGradient><radialGradient id="crC" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="#ffe060"/><stop offset="100%" stop-color="#cc7000"/></radialGradient><filter id="sf6"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.4"/></filter></defs><path d="M12 40 Q10 62 14 72 L46 72 Q50 62 48 40 Q40 44 30 43 Q20 44 12 40 Z" fill="url(#crR)" filter="url(#sf6)"/><circle cx="22" cy="54" r="2.5" fill="white" opacity="0.5"/><circle cx="30" cy="60" r="2.5" fill="white" opacity="0.5"/><circle cx="38" cy="54" r="2.5" fill="white" opacity="0.5"/><ellipse cx="30" cy="45" rx="4" ry="3" fill="#ffd700" opacity="0.9"/><ellipse cx="30" cy="26" rx="14" ry="13" fill="url(#crH)" filter="url(#sf6)"/><rect x="16" y="12" width="28" height="9" rx="1.5" fill="url(#crC)"/><polygon points="16,12 16,6 20,12" fill="#ffa800"/><polygon points="27,12 30,5 33,12" fill="#ffa800"/><polygon points="44,12 44,6 40,12" fill="#ffa800"/><circle cx="18" cy="8" r="2.8" fill="#ff4444"/><circle cx="30" cy="6.5" r="2.8" fill="#44aaff"/><circle cx="42" cy="8" r="2.8" fill="#44dd44"/><ellipse cx="24" cy="26" rx="4" ry="4.2" fill="#3a2000"/><ellipse cx="36" cy="26" rx="4" ry="4.2" fill="#3a2000"/><circle cx="24" cy="24" r="0.8" fill="white" opacity="0.9"/><circle cx="36" cy="24" r="0.8" fill="white" opacity="0.9"/><path d="M25 32 Q30 36 35 32" stroke="#8a5000" stroke-width="1.2" fill="none"/></svg>`},
  {id:"alien",name:"Alien",color:"#60ff80",rarity:"Epic",svg:`<svg viewBox="0 0 60 80" width="60" height="80" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="aH" cx="38%" cy="32%" r="62%"><stop offset="0%" stop-color="#a0ff90"/><stop offset="100%" stop-color="#308040"/></radialGradient><radialGradient id="aB" cx="42%" cy="36%" r="60%"><stop offset="0%" stop-color="#80e870"/><stop offset="100%" stop-color="#408040"/></radialGradient><radialGradient id="aE" cx="35%" cy="30%" r="60%"><stop offset="0%" stop-color="#00ff88"/><stop offset="100%" stop-color="#002010"/></radialGradient><filter id="sf7"><feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#00ff80" flood-opacity="0.5"/></filter></defs><line x1="22" y1="10" x2="16" y2="2" stroke="#60cc60" stroke-width="1.8"/><line x1="38" y1="10" x2="44" y2="2" stroke="#60cc60" stroke-width="1.8"/><circle cx="16" cy="2" r="3" fill="#00ffcc" filter="url(#sf7)"/><circle cx="44" cy="2" r="3" fill="#00ffcc" filter="url(#sf7)"/><ellipse cx="30" cy="56" rx="12" ry="14" fill="url(#aB)" filter="url(#sf7)"/><ellipse cx="30" cy="56" rx="6" ry="7" fill="rgba(0,255,136,0.25)"/><path d="M18 50 Q8 44 10 36" stroke="#50aa50" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M42 50 Q52 44 50 36" stroke="#50aa50" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="10" cy="35" r="4" fill="#60cc60"/><circle cx="50" cy="35" r="4" fill="#60cc60"/><path d="M22 68 Q18 74 20 78" stroke="#50aa50" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M38 68 Q42 74 40 78" stroke="#50aa50" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="20" cy="78" rx="6" ry="3" fill="#408040"/><ellipse cx="40" cy="78" rx="6" ry="3" fill="#408040"/><ellipse cx="30" cy="22" rx="18" ry="16" fill="url(#aH)" filter="url(#sf7)"/><ellipse cx="22" cy="21" rx="7.5" ry="8.5" fill="#001a00"/><ellipse cx="38" cy="21" rx="7.5" ry="8.5" fill="#001a00"/><ellipse cx="22" cy="21" rx="6" ry="7" fill="url(#aE)" opacity="0.7"/><ellipse cx="38" cy="21" rx="6" ry="7" fill="url(#aE)" opacity="0.7"/><circle cx="20.5" cy="17.5" r="1.5" fill="white" opacity="0.9"/><circle cx="36.5" cy="17.5" r="1.5" fill="white" opacity="0.9"/><path d="M24 29 Q30 32 36 29" stroke="#204020" stroke-width="1.2" fill="none"/></svg>`},
];

var COMP_WEIGHTS ={Common:60,Rare:30,Epic:10};

// ── Companion display ──────────────────────────────────────────────────────────
function updateHUD() {
    // If S doesn't exist yet, stop the function so it doesn't break the game
    if (typeof S === 'undefined') return;

    const coinsEl = document.getElementById("hud-coins");
    const rollsEl = document.getElementById("hud-rolls");
    const luckEl = document.getElementById("hud-luck");

    if (coinsEl) coinsEl.textContent = (S.coins || 0).toLocaleString();
    if (rollsEl) rollsEl.textContent = (S.rolls || 0).toLocaleString();
    
    if (luckEl) {
        const luckVal = typeof calcLuck === "function" ? calcLuck() : 1;
        luckEl.textContent = Math.round(luckVal * 100) + "%";
    }
}

function updateBiomeBar() {
    const bar = document.getElementById("biome-bar");
    if (bar) {
        // This assumes BIOMES is an array defined in your data.js
        // and S.biomeIdx is the current biome index
        const currentBiome = BIOMES[S.biomeIdx];
        bar.textContent = "🌍 " + (currentBiome ? currentBiome.name : "Normal");
        
        // Optional: Change the color of the bar based on the biome
        if (currentBiome && currentBiome.color) {
            bar.style.borderColor = currentBiome.color;
        }
    }
}

function updateAuraDisplay(aura) {
    const nameEl = document.getElementById("aura-name");
    const tierEl = document.getElementById("aura-tier");
    
    if (nameEl && aura) {
        nameEl.textContent = aura.name;
        nameEl.style.color = aura.color || "#fff";
        // If your aura object has a tier, display it too
        if (tierEl) tierEl.textContent = aura.tier || "";
    }
}

function updateCompanion(){
  let el=document.getElementById("companion-display");
  if(!el){
    el=document.createElement("div");
    el.id="companion-display";
    el.style.cssText="position:fixed;bottom:118px;right:6px;width:192px;height:288px;z-index:15;pointer-events:none;transition:opacity 0.5s;filter:drop-shadow(0 3px 8px rgba(0,0,0,0.8));";
    document.body.appendChild(el);
  }
  if(S.equipped_companion){
    const comp=COMPANIONS.find(x=>x.id===S.equipped_companion);
    el.style.opacity="1";
    el.innerHTML=comp?comp.svg:"";
    const svgEl=el.querySelector("svg");
    if(svgEl){svgEl.setAttribute("width","100%");svgEl.setAttribute("height","100%");svgEl.style.display="block";}
  } else {
    el.style.opacity="0"; el.innerHTML="";
  }
}

// ── Roll Chat ──────────────────────────────────────────────────────────────────
var CHAT_TIER_NAMES =["Common","Uncommon","Rare","Epic","Unique","Legendary","Mythic","Exalted","Transcendent"];
var CHAT_TIER_COLS =["#999","#b070ff","#00e5ff","#ffd700","#ff70ff","#ff5050","#ffff40","#ffffff","#ffffff"];

function addChatEntry(name,chance,col,glow,tier){
  const min=S.chatMinChance||1;
  if(chance<min) return;
  const chat=document.getElementById("roll-chat");
  if(!chat) return;
  const t=Math.min(tier,CHAT_TIER_NAMES.length-1);
  const div=document.createElement("div");
  div.className="chat-entry";
  div.style.borderLeftColor="rgb("+col[0]+","+col[1]+","+col[2]+")";
  div.innerHTML=
    "<div style='font-size:9px;color:"+CHAT_TIER_COLS[t]+";letter-spacing:2px;text-transform:uppercase'>"+CHAT_TIER_NAMES[t]+"</div>"+
    "<div style='color:rgb("+glow[0]+","+glow[1]+","+glow[2]+");font-size:14px;font-weight:bold;text-shadow:0 0 8px rgb("+col[0]+","+col[1]+","+col[2]+")'>"+name+"</div>"+
    "<div style='color:#555;font-size:10px'>1 in "+chance.toLocaleString()+"</div>";
  chat.insertBefore(div,chat.firstChild||null);
  setTimeout(function(){div.style.opacity="0";setTimeout(function(){if(div.parentNode)div.parentNode.removeChild(div);},700);},7000);
  while(chat.childElementCount>20) chat.removeChild(chat.lastChild);
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function renderTabBar(tabs,onSwitch){
  const bar=document.getElementById("tab-bar");bar.innerHTML="";
  tabs.forEach((t,i)=>{
    const b=document.createElement("button");b.className="tab-btn"+(i===0?" active":"");
    b.textContent=t;
    b.onclick=()=>{bar.querySelectorAll(".tab-btn").forEach(x=>x.classList.remove("active"));b.classList.add("active");onSwitch(i);};
    bar.appendChild(b);
  });
}

function canCraft(rec){
  if(!rec.ingredients) return false;
  return rec.ingredients.every(ing=>{
    const inAuras=(S.owned_auras[ing.name]||0);
    const inItems=(S.owned_items[ing.name]||0);
    const inGears=S.owned_gears[ing.name]?1:0;
    return (inAuras+inItems+inGears)>=ing.qty;
  });
}

function consumeIngredients(rec){
  rec.ingredients.forEach(ing=>{
    let need=ing.qty;
    if(S.owned_auras[ing.name]){const take=Math.min(need,S.owned_auras[ing.name]);S.owned_auras[ing.name]-=take;need-=take;}
    if(need>0&&S.owned_items[ing.name]){const take=Math.min(need,S.owned_items[ing.name]);S.owned_items[ing.name]-=take;need-=take;}
    if(need>0&&S.owned_gears[ing.name]){delete S.owned_gears[ing.name];need--;}
  });
}

function usePotion(rec){
  const isRoll=rec.dur<=1;
  const isRollBased=rec.rollsLeft!==undefined;
  const existing=S.active_potions.find(p=>p.name===rec.name);
  if(existing){
    if(isRoll) return toast("❌ "+rec.name+" already active!");
    if(isRollBased) existing.rollsLeft=(existing.rollsLeft||0)+rec.rollsLeft;
    else existing.timer+=rec.dur*1000;
    toast("🧪 "+rec.name+" extended!");
  } else {
    const entry={name:rec.name,luck_add:rec.luck_add||0,speed_add:rec.speed_add||0,isRoll,timer:isRoll?999999:rec.dur*1000};
    if(isRollBased) entry.rollsLeft=rec.rollsLeft;
    S.active_potions.push(entry);
    toast("🧪 "+rec.name+" active!");
  }
  updateHUD();save();
}

function useItem(name){
  if(name==="Strange Controller"||name==="Biome Randomizer"){
    let bi;
    if(rnd()<1/5000){bi=BIOMES.findIndex(b=>b.name==="Cyberspace");}
    else{
      const pool=BIOMES.map((b,i)=>({i,w:b.controllerWeight||0})).filter(x=>x.w>0);
      const total=pool.reduce((s,x)=>s+x.w,0);let rv=rnd()*total;bi=pool[0].i;
      for(const x of pool){rv-=x.w;if(rv<=0){bi=x.i;break;}}
    }
    S.biomeIdx=bi;S.biomeTimer=BIOMES[bi].dur;updateBiomeBar();
    const b=BIOMES[bi];
    if(b.item){const qty=b.itemQty+(b.itemQty>1?Math.floor(rnd()*3):0);S.owned_items[b.item]=(S.owned_items[b.item]||0)+qty;toast(b.emoji+" "+b.name+"! Got "+qty+"x "+b.item+"!");}
    else toast(b.emoji+" Forced biome: "+b.name+"!");
    if(name==="Strange Controller"){S.owned_items["Strange Controller"]=(S.owned_items["Strange Controller"]||0)-1;if(S.owned_items["Strange Controller"]<=0)delete S.owned_items["Strange Controller"];}
    save();updateHUD();if(typeof renderInventoryTab==='function')renderInventoryTab();
  }
}

function openChest(type){
  const table=CHEST_TABLES[type];if(!table)return;
  const total=table.reduce((s,r)=>s+r.w,0);
  let rv=rnd()*total,reward=table[0];
  for(const row of table){rv-=row.w;if(rv<=0){reward=row;break;}}
  const qty=reward.qty();
  S.owned_items[reward.item]=(S.owned_items[reward.item]||0)+qty;
  save();updateHUD();
  toast("📦 "+type+" Chest: "+qty+"× "+reward.item+"!",3000);
}

// ── Overlay helpers ────────────────────────────────────────────────────────────
function getOverlay(){return {
  title:document.getElementById("overlay-title"),
  content:document.getElementById("overlay-content"),
  tabbar:document.getElementById("tab-bar"),
  overlay:document.getElementById("overlay"),
};}
function openOverlay(title){
  const o=getOverlay();
  o.title.textContent=title;o.tabbar.innerHTML="";
  o.content.className="";o.content.style.cssText="";o.content.innerHTML="";
  o.overlay.classList.add("open");
  return o.content;
}

// ── CRAFT SHOP ────────────────────────────────────────────────────────────────
let shopTab=0;
function openShop2(){
  const o=getOverlay();
  o.title.textContent="CRAFT";
  renderTabBar(["⚔️ Gears","🧪 Potions","✨ Auras"],t=>{shopTab=t;renderCraftItems();});
  shopTab=0;renderCraftItems();
  o.overlay.classList.add("open");
}
function renderCraftItems(){
  const c=document.getElementById("overlay-content");
  c.className="grid";c.style.cssText="";c.innerHTML="";
  const recipes=shopTab===0?GEAR_RECIPES:shopTab===1?POTION_RECIPES:AURA_RECIPES;
  recipes.forEach(rec=>{
    const name=rec.gear||rec.name||rec.aura;
    const can=canCraft(rec);
    const owned=shopTab===0?(S.owned_gears[name]?true:false):(S.owned_items[name]>0);
    const card=document.createElement("div");card.className="card";
    card.style.borderColor=can?"rgba(60,200,60,0.4)":"rgba(255,255,255,0.08)";
    let ingHtml=rec.ingredients?rec.ingredients.map(ing=>{
      const have=(S.owned_auras[ing.name]||0)+(S.owned_items[ing.name]||0)+(S.owned_gears[ing.name]?1:0);
      const ok=have>=ing.qty;
      return "<span style='color:"+(ok?"#60e880":"#ff6060")+"'>"+ing.name+" ×"+ing.qty+"</span>";
    }).join(", "):"";
    card.innerHTML=
      (owned?"<span class='owned-tag'>✓</span>":"")+
      "<div class='card-name' style='color:"+(can?"#60e880":"#aaa")+"'>"+name+"</div>"+
      "<div class='card-sub'>"+rec.desc+"</div>"+
      "<div style='font-size:9px;color:#555;margin-top:3px'>"+ingHtml+"</div>"+
      "<button style='margin-top:6px;width:100%;padding:5px;background:"+(can?"rgba(60,200,60,0.15)":"rgba(255,255,255,0.04)")+";border:1px solid "+(can?"rgba(60,200,60,0.3)":"rgba(255,255,255,0.1)")+";border-radius:5px;color:"+(can?"#60e880":"#555")+";font-family:inherit;font-size:10px;cursor:pointer;'>"+(can?"⚒️ CRAFT":"❌ MISSING")+"</button>";
    card.querySelector("button").onclick=(e)=>{
      e.stopPropagation();
      if(!can){toast("❌ Missing ingredients!");return;}
      consumeIngredients(rec);
      if(shopTab===2){
        const auraName=rec.aura;
        S.owned_auras[auraName]=(S.owned_auras[auraName]||0)+1;
        if(!S.collection[auraName])S.collection[auraName]={count:0,unlocked:true};
        S.collection[auraName].count=(S.collection[auraName].count||0)+1;
        const auraData=AURAS.find(a=>a[0]===auraName);
        if(auraData){S.lastAura={name:auraName,chance:auraData[1],col:auraData[2],glow:auraData[3],tier:auraTier(auraData[1]),isBonus:false,crafted:true};updateAuraDisplay();}
        toast("✨ Crafted: "+auraName+"! Added to storage.");
      } else if(shopTab===0){
        S.owned_gears[name]=true;
        const gearDef=GEARS.find(g=>g&&g.name===name);
        if(gearDef&&gearDef.hand==="R"&&!S.equipped_R)S.equipped_R=name;
        else if(gearDef&&gearDef.hand==="L"&&!S.equipped_L)S.equipped_L=name;
        toast("✅ Crafted: "+name+"!");
      } else {
        S.owned_items[name]=(S.owned_items[name]||0)+1;
        toast("🧪 Crafted: "+name+"! Check Items tab.");
      }
      updateHUD();save();renderCraftItems();
    };
    c.appendChild(card);
  });
}

// ── INVENTORY ─────────────────────────────────────────────────────────────────
var invTab=0;
function openInventory2(){
  const o=getOverlay();
  o.title.textContent="INVENTORY";
  renderTabBar(["⚔️ Gears","🎒 Items","🔮 Talisman"],t=>{invTab=t;renderInventoryTab();});
  invTab=0;renderInventoryTab();
  o.overlay.classList.add("open");
}
function renderInventoryTab(){
  const c=document.getElementById("overlay-content");
  c.className="grid";c.style.cssText="";c.innerHTML="";
  if(invTab===0){
    // Gears
    ["R","L"].forEach(hand=>{
      const equippedName=hand==="R"?S.equipped_R:S.equipped_L;
      const slot=document.createElement("div");
      slot.style.cssText="grid-column:1/-1;padding:8px 10px;background:rgba(255,200,0,0.06);border:1px solid rgba(255,200,0,0.2);border-radius:8px;font-size:10px;margin-bottom:4px;";
      const eqGear=equippedName&&GEARS.find(g=>g&&g.name===equippedName);
      slot.innerHTML="<span style='color:#888;letter-spacing:2px'>"+(hand==="R"?"RIGHT HAND":"LEFT HAND")+": </span>"+
        (equippedName?"<span style='color:#ffd700;font-weight:bold'>"+equippedName+"</span> <button id='uneq-"+hand+"' style='margin-left:6px;padding:2px 6px;background:rgba(255,80,80,0.15);border:1px solid rgba(255,80,80,0.3);border-radius:4px;color:#ff8080;font-family:inherit;font-size:9px;cursor:pointer;'>Unequip</button>":"<span style='color:#444'>Empty</span>");
      c.appendChild(slot);
      slot.querySelector("#uneq-"+hand)?.addEventListener("click",()=>{if(hand==="R")S.equipped_R=null;else S.equipped_L=null;save();renderInventoryTab();});
    });
    GEARS.filter(g=>g&&S.owned_gears[g.name]).forEach(g=>{
      const isEqR=S.equipped_R===g.name,isEqL=S.equipped_L===g.name,isEq=isEqR||isEqL;
      const card=document.createElement("div");card.className="card";
      card.style.borderColor=rgba(g.color||[200,200,200],isEq?0.8:0.3);
      if(isEq)card.style.background="rgba(255,255,255,0.06)";
      card.innerHTML=(isEq?"<span class='owned-tag' style='background:rgba(60,200,60,0.2);color:#60ff60'>EQ</span>":"")+
        "<div class='card-name' style='color:"+rgb(g.color||[200,200,200])+"'>"+g.name+"</div>"+
        "<div class='card-sub'>"+g.effect+"</div>"+
        "<div style='display:flex;gap:4px;margin-top:6px'>"+
        (g.hand==="R"?"<button style='flex:1;padding:5px;background:"+(S.equipped_R===g.name?"rgba(255,80,80,0.15)":"rgba(60,200,60,0.15)")+";border:1px solid "+(S.equipped_R===g.name?"rgba(255,80,80,0.3)":"rgba(60,200,60,0.3)")+";border-radius:5px;color:"+(S.equipped_R===g.name?"#ff8080":"#60e880")+";font-family:inherit;font-size:10px;cursor:pointer;'>"+(S.equipped_R===g.name?"Unequip R":"Equip R")+"</button>":"")+
        (g.hand==="L"?"<button style='flex:1;padding:5px;background:"+(S.equipped_L===g.name?"rgba(255,80,80,0.15)":"rgba(100,100,255,0.15)")+";border:1px solid "+(S.equipped_L===g.name?"rgba(255,80,80,0.3)":"rgba(100,100,255,0.3)")+";border-radius:5px;color:"+(S.equipped_L===g.name?"#ff8080":"#8888ff")+";font-family:inherit;font-size:10px;cursor:pointer;'>"+(S.equipped_L===g.name?"Unequip L":"Equip L")+"</button>":"")+"</div>";
      const btns=card.querySelectorAll("button");
      btns.forEach(btn=>{btn.onclick=(e)=>{e.stopPropagation();if(g.hand==="R")S.equipped_R=S.equipped_R===g.name?null:g.name;else S.equipped_L=S.equipped_L===g.name?null:g.name;save();renderInventoryTab();};});
      c.appendChild(card);
    });
    if(!GEARS.some(g=>g&&S.owned_gears[g.name]))c.innerHTML='<div class="empty-msg">No gears yet. Craft them in the shop!</div>';
  } else if(invTab===1){
    // Items
    if(S.active_potions.length>0){
      const banner=document.createElement("div");
      banner.style.cssText="grid-column:1/-1;padding:8px 10px;background:rgba(160,100,255,0.1);border:1px solid rgba(160,100,255,0.25);border-radius:8px;font-size:10px;margin-bottom:4px;";
      banner.innerHTML="<b style='color:#c080ff'>ACTIVE:</b> "+S.active_potions.map(p=>{const rem=p.rollsLeft!==undefined?p.rollsLeft+" rolls":p.isRoll?"1 roll":Math.max(0,Math.ceil(p.timer/1000))+"s";return "<span style='color:#ddd'>"+p.name+"("+rem+")</span>";}).join(", ");
      c.appendChild(banner);
    }
    // Chest buy section
    const chestDiv=document.createElement("div");
    chestDiv.style.cssText="grid-column:1/-1;display:flex;gap:6px;margin-bottom:8px;";
    [["Normal Potion Chest",500,"#80c880","rgba(100,180,100,0.15)","rgba(100,180,100,0.3)"],
     ["Rare Potion Chest",2500,"#8080ff","rgba(80,80,220,0.15)","rgba(80,80,220,0.3)"],
     ["Mega Potion Chest",15000,"#ffaa40","rgba(200,100,0,0.15)","rgba(200,100,0,0.3)"]].forEach(function(arr){
      const key=arr[0],cost=arr[1],col=arr[2],bg=arr[3],brd=arr[4];
      const owned=S.owned_items[key]||0;
      const btn=document.createElement("button");
      btn.style.cssText="flex:1;padding:6px 3px;background:"+bg+";border:1px solid "+brd+";border-radius:8px;color:"+col+";font-family:'Courier New',monospace;font-size:9px;font-weight:bold;cursor:pointer;";
      btn.innerHTML="📦 Buy<br><span style='font-size:8px'>"+key.replace(" Potion Chest","")+"</span><br><span style='font-size:8px'>"+cost.toLocaleString()+"🪙"+(owned?" ("+owned+")":"")+"</span>";
      btn.onclick=function(){if(S.coins<cost){toast("❌ Need "+cost.toLocaleString()+" coins");return;}S.coins-=cost;S.owned_items[key]=(S.owned_items[key]||0)+1;save();updateHUD();renderInventoryTab();toast("📦 Got a "+key+"!");};
      chestDiv.appendChild(btn);
    });
    c.appendChild(chestDiv);
    const USABLE=[
      {key:"Lucky Potion",col:[100,200,100],desc:"🍀 +100% Luck · 1 min"},
      {key:"Speed Potion",col:[80,220,80],desc:"⚡ +10% Speed · 1 min"},
      {key:"Haste Potion I",col:[80,220,80],desc:"🏃 +20% Speed · 5 min"},
      {key:"Haste Potion II",col:[60,255,60],desc:"🏃 +25% Speed · 5 min"},
      {key:"Haste Potion III",col:[0,255,80],desc:"🏃 +30% Speed · 5 min"},
      {key:"Fortune I",col:[200,200,80],desc:"🍀 +150% Luck · 5 min"},
      {key:"Fortune II",col:[220,220,100],desc:"🍀 +200% Luck · 7 min"},
      {key:"Fortune III",col:[255,255,120],desc:"🍀 +250% Luck · 10 min"},
      {key:"Godly Potion (Zeus)",col:[255,220,50],desc:"⚡ +200% Luck +30% Spd · 4h"},
      {key:"Godly Potion (Poseidon)",col:[0,180,255],desc:"🔱 -50% Luck +75% Spd · 4h"},
      {key:"Godly Potion (Hades)",col:[160,0,60],desc:"💀 +300% Luck -10% Spd · 4h"},
      {key:"Potion of Bound",col:[100,0,200],desc:"🔮 +5,000,000% Luck · 1 roll"},
      {key:"Heavenly Potion",col:[255,240,160],desc:"✨ +15,000,000% Luck · 1 roll"},
      {key:"Godlike Potion",col:[255,100,255],desc:"👑 +40,000,000% Luck · 1 roll"},
      {key:"Oblivion Potion",col:[80,0,160],desc:"🌑 +60,000,000% Luck · 1 roll"},
      {key:"Warp Potion",col:[0,255,200],desc:"⏩ +1000% Speed · 2000 rolls"},
      {key:"Transcendent Potion",col:[255,220,255],desc:"🌟 +1000% Speed · 20k rolls"},
      {key:"Normal Potion Chest",col:[100,180,100],desc:"📦 Open for random potions"},
      {key:"Rare Potion Chest",col:[80,80,220],desc:"📦 Open for better potions"},
      {key:"Mega Potion Chest",col:[200,100,0],desc:"📦 Open for the best potions"},
      {key:"Strange Controller",col:[200,100,255],desc:"🎲 Force random biome"},
      {key:"Biome Randomizer",col:[255,180,0],desc:"🎰 Force random biome (tool)"},
      {key:"Void Coin",col:[60,0,120],desc:"💜 Jester currency"},
      {key:"Gear Basing",col:[160,160,160],desc:"⚙️ Crafting component"},
    ];
    let any=false;
    USABLE.forEach(function(item){
      const qty=S.owned_items[item.key]||0;if(!qty)return;any=true;
      const card=document.createElement("div");card.className="card";
      card.style.borderColor=rgba(item.col,0.4);
      const isCurrency=(item.key==="Void Coin"||item.key==="Gear Basing");
      const isTool=(item.key==="Biome Randomizer");
      card.innerHTML="<div class='card-name' style='color:"+rgb(item.col)+"'>"+item.key+"</div>"+
        "<div class='card-sub'>"+item.desc+"</div>"+
        (!isTool?"<span class='aura-count'>×"+qty+"</span>":"")+
        (!isCurrency?"<button style='margin-top:6px;width:100%;padding:5px;background:rgba(255,200,0,0.15);border:1px solid rgba(255,200,0,0.3);border-radius:5px;color:#ffd700;font-family:inherit;font-size:10px;cursor:pointer;'>"+(isTool?"USE (∞)":"USE")+"</button>":"");
      if(!isCurrency){
        const btn=card.querySelector("button");
        if(btn)btn.onclick=function(e){
          e.stopPropagation();
          if(!isTool&&(S.owned_items[item.key]||0)<=0){toast("❌ None left!");return;}
          const r=POTION_RECIPES.find(p=>p.name===item.key);
          if(item.key==="Strange Controller"||item.key==="Biome Randomizer")useItem(item.key);
          else if(item.key==="Lucky Potion"){S.owned_items[item.key]--;usePotion({name:"Lucky Potion",luck_add:100,dur:60});}
          else if(item.key==="Speed Potion"){S.owned_items[item.key]--;usePotion({name:"Speed Potion",speed_add:10,dur:60});}
          else if(item.key==="Warp Potion"){S.owned_items[item.key]--;usePotion({name:"Warp Potion",speed_add:1000,dur:999999999,rollsLeft:2000});}
          else if(item.key==="Transcendent Potion"){S.owned_items[item.key]--;usePotion({name:"Transcendent Potion",speed_add:1000,dur:999999999,rollsLeft:20000});}
          else if(item.key==="Oblivion Potion"){S.owned_items[item.key]--;usePotion({name:"Oblivion Potion",luck_add:60000000,dur:1,isRoll:true});toast("⚠️ Oblivion active!");}
          else if(item.key.includes("Potion Chest")){S.owned_items[item.key]--;const ct=item.key.replace(" Potion Chest","");openChest(ct);updateHUD();}
          else if(r){S.owned_items[item.key]--;usePotion(r);}
          save();updateHUD();renderInventoryTab();
        };
      }
      c.appendChild(card);
    });
    if(!any)c.innerHTML+='<div class="empty-msg">No items yet.</div>';
  } else {
    // Talisman
    const slotDiv=document.createElement("div");
    slotDiv.style.cssText="grid-column:1/-1;padding:12px;background:rgba(255,180,60,0.08);border:1px solid rgba(255,180,60,0.25);border-radius:10px;margin-bottom:8px;";
    slotDiv.innerHTML="<div style='font-size:10px;color:#888;letter-spacing:3px;margin-bottom:6px'>TALISMAN SLOT</div>"+
      "<div style='font-size:13px;font-weight:bold;color:"+(S.equipped_talisman?"#ffd700":"#444")+"'>"+
      (S.equipped_talisman?(TALISMANS.find(t=>t.name===S.equipped_talisman)?.emoji||"🔮")+" "+S.equipped_talisman:"Empty")+"</div>"+
      (S.equipped_talisman?"<button id='uneq-tal-btn' style='margin-top:8px;padding:5px 12px;background:rgba(255,80,80,0.15);border:1px solid rgba(255,80,80,0.3);border-radius:5px;color:#ff8080;font-family:inherit;font-size:10px;cursor:pointer;'>Unequip</button>":"");
    c.appendChild(slotDiv);
    slotDiv.querySelector("#uneq-tal-btn")?.addEventListener("click",()=>{S.equipped_talisman=null;save();updateHUD();renderInventoryTab();});
    if(!S.owned_talismans.length){c.innerHTML+='<div class="empty-msg">No talismans yet.<br/>Buy from Rin!</div>';return;}
    S.owned_talismans.forEach(tname=>{
      const tal=TALISMANS.find(t=>t.name===tname);if(!tal)return;
      const isEq=S.equipped_talisman===tname;
      const card=document.createElement("div");card.className="card";
      card.style.borderColor="rgba(255,180,60,"+(isEq?"0.8":"0.3")+")";
      if(isEq)card.style.background="rgba(255,180,60,0.07)";
      card.innerHTML=(tal.emoji||"🔮")+"<div class='card-name' style='color:#ffd700'>"+tname+"</div>"+
        "<div class='card-sub'>"+tal.desc+"</div>"+
        "<button style='margin-top:6px;width:100%;padding:5px;background:"+(isEq?"rgba(255,80,80,0.15)":"rgba(255,180,60,0.15)")+";border:1px solid "+(isEq?"rgba(255,80,80,0.3)":"rgba(255,180,60,0.3)")+";border-radius:5px;color:"+(isEq?"#ff8080":"#ffd700")+";font-family:inherit;font-size:10px;cursor:pointer;'>"+(isEq?"Unequip":"Equip")+"</button>";
      card.querySelector("button").onclick=(e)=>{e.stopPropagation();S.equipped_talisman=isEq?null:tname;save();updateHUD();renderInventoryTab();};
      c.appendChild(card);
    });
  }
}

// ── COLLECTION ────────────────────────────────────────────────────────────────
var collTab=0;
function openCollection(){
  const o=getOverlay();
  o.title.textContent="COLLECTION";
  renderTabBar(["📦 Storage","🏆 All Rolled"],t=>{collTab=t;renderCollTab();});
  collTab=0;renderCollTab();
  o.overlay.classList.add("open");
}
function renderCollTab(){
  const c=document.getElementById("overlay-content");
  c.className="grid";c.style.cssText="";c.innerHTML="";
  if(collTab===0){
    const entries=Object.entries(S.owned_auras).filter(([,n])=>n>0).sort((a,b)=>{
      const ta=AURAS.find(x=>x[0]===a[0]),tb=AURAS.find(x=>x[0]===b[0]);
      return(tb?tb[1]:0)-(ta?ta[1]:0);
    });
    const banner=document.createElement("div");
    banner.style.cssText="grid-column:1/-1;padding:8px 10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;font-size:10px;margin-bottom:4px;";
    const ea=S.equipped_aura&&AURAS.find(x=>x[0]===S.equipped_aura);
    banner.innerHTML=S.equipped_aura?
      "<span style='color:#888;letter-spacing:2px'>DISPLAYING: </span><span style='color:"+(ea?rgb(ea[3]):"#fff")+";font-weight:bold'>"+S.equipped_aura+"</span> <button id='uneq-aura-btn' style='margin-left:8px;padding:2px 8px;background:rgba(255,80,80,0.15);border:1px solid rgba(255,80,80,0.3);border-radius:4px;color:#ff8080;font-family:inherit;font-size:9px;cursor:pointer;'>Remove</button>":
      "<span style='color:#444;letter-spacing:2px'>Tap an aura to display it</span>";
    c.appendChild(banner);
    banner.querySelector("#uneq-aura-btn")?.addEventListener("click",()=>{S.equipped_aura=null;save();updateEquippedBadge();renderCollTab();});
    if(!entries.length){c.innerHTML+='<div class="empty-msg" style="grid-column:1/-1">No auras in storage yet.</div>';return;}
    entries.forEach(([name,count])=>{
      const aura=AURAS.find(x=>x[0]===name);if(!aura)return;
      const tier=auraTier(aura[1]);const isEq=S.equipped_aura===name;
      const TIER_NAMES_LOCAL=["Common","Uncommon","Rare","Epic","Unique","Legendary","Mythic","Exalted","Transcendent"];
      const TIER_COLS_LOCAL=["#aaa","#b070ff","#00e5ff","#ffd700","#ff70ff","#ff5050","#ffff40","#ffffff","#ffffff"];
      const card=document.createElement("div");card.className="card";
      card.style.borderColor=rgba(aura[2],isEq?0.8:0.35);
      if(isEq)card.style.background="rgba(255,255,255,0.07)";
      const isCraftOnly=(name==="Eclipse"||name==="Atlas : A.T.L.A.S.");
      card.innerHTML=(isEq?"<span class='owned-tag' style='background:rgba(60,200,60,0.2);color:#60ff60'>EQ</span>":"")+
        (!isCraftOnly?"<div class='tier-label' style='color:"+TIER_COLS_LOCAL[Math.min(tier,8)]+"'>"+TIER_NAMES_LOCAL[Math.min(tier,8)]+"</div>":"")+
        "<div class='card-name' style='color:"+rgb(aura[3])+";text-shadow:0 0 6px "+rgb(aura[2])+"'>"+name+"</div>"+
        "<div class='card-sub'>"+(isCraftOnly?"[ Crafted aura ]":"1 in "+aura[1].toLocaleString())+"</div>"+
        "<span class='aura-count'>×"+count+"</span>"+
        "<button style='margin-top:6px;width:100%;padding:5px;background:"+(isEq?"rgba(255,80,80,0.15)":"rgba(60,200,60,0.15)")+";border:1px solid "+(isEq?"rgba(255,80,80,0.3)":"rgba(60,200,60,0.3)")+";border-radius:5px;color:"+(isEq?"#ff8080":"#60e880")+";font-family:inherit;font-size:10px;cursor:pointer;'>"+(isEq?"Remove":"Display")+"</button>";
      card.querySelector("button").onclick=(e)=>{e.stopPropagation();S.equipped_aura=isEq?null:name;save();updateEquippedBadge();updateMusic();if(!isEq){S.lastAura={name,chance:aura[1],col:aura[2],glow:aura[3],tier,isBonus:false};updateAuraDisplay();toast("✨ Displaying: "+name);}else toast("Aura removed");renderCollTab();};
      c.appendChild(card);
    });
  } else {
    const unlocked=Object.keys(S.collection).sort((a,b)=>{
      const ta=AURAS.find(x=>x[0]===a),tb=AURAS.find(x=>x[0]===b);
      return(tb?tb[1]:0)-(ta?ta[1]:0);
    });
    if(!unlocked.length){c.innerHTML='<div class="empty-msg">Roll auras to fill your collection!</div>';return;}
    unlocked.forEach(name=>{
      const aura=AURAS.find(x=>x[0]===name);if(!aura)return;
      const tier=auraTier(aura[1]);const col=S.collection[name]||{};
      const TIER_NAMES_LOCAL=["Common","Uncommon","Rare","Epic","Unique","Legendary","Mythic","Exalted","Transcendent"];
      const TIER_COLS_LOCAL=["#aaa","#b070ff","#00e5ff","#ffd700","#ff70ff","#ff5050","#ffff40","#ffffff","#ffffff"];
      const card=document.createElement("div");card.className="card";
      card.style.borderColor=rgba(aura[2],0.4);
      const isCraftOnly=(name==="Eclipse"||name==="Atlas : A.T.L.A.S.");
      card.innerHTML="<div class='tier-label' style='color:"+TIER_COLS_LOCAL[Math.min(tier,8)]+"'>"+TIER_NAMES_LOCAL[Math.min(tier,8)]+"</div>"+
        "<div class='card-name' style='color:"+rgb(aura[3])+";text-shadow:0 0 5px "+rgb(aura[2])+"'>"+name+"</div>"+
        "<div class='card-sub'>"+(isCraftOnly?"[ Crafted aura ]":"1 in "+aura[1].toLocaleString())+"</div>"+
        "<span class='aura-count'>×"+(col.count||0)+"</span>"+
        (!isCraftOnly?"<button style='margin-top:6px;width:100%;padding:5px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:5px;color:#aaa;font-family:inherit;font-size:9px;cursor:pointer;'>▶ Opening</button>":"");
      const btn=card.querySelector("button");
      if(btn)btn.onclick=(e)=>{e.stopPropagation();document.getElementById("overlay").classList.remove("open");const t2=auraTier(aura[1]);if(t2>=4)playCutscene(aura,t2);else if(aura[1]>=100000)playStarCutscene(aura,t2);else if(aura[1]>=10000)playStarCutscene(aura,t2);else{S.lastAura={name,chance:aura[1],col:aura[2],glow:aura[3],tier:t2,isBonus:false};updateAuraDisplay();toast("Viewing: "+name);}};
      c.appendChild(card);
    });
  }
}

// ── SETTINGS ──────────────────────────────────────────────────────────────────
function openSettings(){
  const o = getOverlay();
  
  // 1. CLEAR THE TABS (This removes the Collection/Shop categories)
  o.tabbar.innerHTML = ""; 
  
  // 2. CLEAR THE CONTENT (This removes the actual Collection items/Auras)
  o.content.innerHTML = ""; 
  
  // 3. RESET THE SCROLL (Prevents the menu from being scrolled halfway down)
  o.content.scrollTop = 0;

  o.title.textContent = "⚙️ SETTINGS";

  const c=o.content;
  c.style.cssText="padding:4px;display:flex;flex-direction:column;gap:10px;overflow-y:auto;";

  // Auto-Equip
  const aeSection=document.createElement("div");
  aeSection.style.cssText="background:rgba(255,255,255,0.04);border-radius:10px;padding:12px;border:1px solid rgba(255,255,255,0.1);";
  aeSection.innerHTML="<div style='font-size:10px;color:#888;letter-spacing:2px;margin-bottom:8px'>AUTO-EQUIP AURA</div>";
  const aeSelect=document.createElement("select");
  aeSelect.style.cssText="width:100%;background:rgba(0,0,20,0.8);color:#ccc;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px;font-family:'Courier New',monospace;font-size:11px;";
  const aeNone=document.createElement("option");aeNone.value="";aeNone.textContent="— Off —";aeSelect.appendChild(aeNone);
  Object.keys(S.owned_auras || {}).forEach(name=>{const o2=document.createElement("option");o2.value=name;o2.textContent=name;if(S.autoEquip===name)o2.selected=true;aeSelect.appendChild(o2);});
  aeSelect.onchange=()=>{S.autoEquip=aeSelect.value||null;save();};
  aeSection.appendChild(aeSelect);
  c.appendChild(aeSection);

  // Auto-Delete
  const adSection=document.createElement("div");
  adSection.style.cssText="background:rgba(255,255,255,0.04);border-radius:10px;padding:12px;border:1px solid rgba(255,255,255,0.1);";
  adSection.innerHTML="<div style='font-size:10px;color:#888;letter-spacing:2px;margin-bottom:8px'>AUTO-DELETE AURAS</div>";
  const commonAuras=AURAS.filter(a=>a[1]<10000).map(a=>a[0]);
  commonAuras.forEach(name=>{
    const row=document.createElement("label");
    row.style.cssText="display:flex;align-items:center;gap:8px;padding:4px 0;font-size:11px;color:#aaa;cursor:pointer;";
    const cb=document.createElement("input");cb.type="checkbox";cb.checked=S.autoDelete.includes(name);
    cb.onchange=()=>{if(cb.checked){if(!S.autoDelete.includes(name))S.autoDelete.push(name);}else S.autoDelete=S.autoDelete.filter(x=>x!==name);save();};
    row.appendChild(cb);row.appendChild(document.createTextNode(name));
    adSection.appendChild(row);
  });
  c.appendChild(adSection);

  // Music toggle
  const musicSection=document.createElement("div");
  musicSection.style.cssText="background:rgba(255,255,255,0.04);border-radius:10px;padding:12px;border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:space-between;";
  musicSection.innerHTML="<div style='font-size:10px;color:#888;letter-spacing:2px'>MUSIC</div>";
  const musicBtn=document.createElement("button");
  musicBtn.style.cssText="padding:6px 14px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);border-radius:6px;color:#fff;font-family:inherit;font-size:11px;cursor:pointer;";
  musicBtn.textContent=musicEnabled?"🎵 ON":"🔇 OFF";
  musicBtn.style.opacity=musicEnabled?"1":"0.5";
  musicBtn.onclick=()=>{
    musicEnabled=!musicEnabled;
    musicBtn.textContent=musicEnabled?"🎵 ON":"🔇 OFF";
    musicBtn.style.opacity=musicEnabled?"1":"0.5";
    if(musicEnabled)updateMusic();else stopMusic(0.8);
    openSettings();
  };
  musicSection.appendChild(musicBtn);
  c.appendChild(musicSection);

  // Chat threshold
  const chatSection=document.createElement("div");
  chatSection.style.cssText="background:rgba(255,255,255,0.04);border-radius:10px;padding:12px;border:1px solid rgba(255,255,255,0.1);";
  chatSection.innerHTML="<div style='font-size:10px;color:#888;letter-spacing:2px;margin-bottom:8px'>ROLL CHAT</div><div style='font-size:10px;color:#555;margin-bottom:6px'>Show auras in the live feed (top-right)</div>";
  const CHAT_OPTIONS=[{label:"All auras",val:1},{label:"Rare+ (1/100+)",val:100},{label:"Epic+ (1/1k+)",val:1000},{label:"Unique+ (1/10k+)",val:10000},{label:"Legendary+ (1/100k+)",val:100000},{label:"Mythic+ (1/1M+)",val:1000000},{label:"Off",val:999999999}];
  const chatSel=document.createElement("select");
  chatSel.style.cssText="width:100%;background:rgba(0,0,20,0.8);color:#ccc;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px;font-family:'Courier New',monospace;font-size:11px;";
  CHAT_OPTIONS.forEach(opt=>{const o2=document.createElement("option");o2.value=opt.val;o2.textContent=opt.label;if(S.chatMinChance===opt.val)o2.selected=true;chatSel.appendChild(o2);});
  chatSel.onchange=()=>{S.chatMinChance=parseInt(chatSel.value);save();};
  chatSection.appendChild(chatSel);
  c.appendChild(chatSection);

  // Account / Cloud Save
  const authSection=document.createElement("div");
  authSection.style.cssText="background:rgba(0,200,100,0.05);border-radius:10px;padding:12px;border:1px solid rgba(0,200,100,0.15);";
  authSection.innerHTML="<div style='font-size:10px;color:#888;letter-spacing:2px;margin-bottom:8px'>☁️ ACCOUNT & CLOUD SAVE</div><div id='auth-status'><div style='color:#555;font-size:10px'>Loading...</div></div>";
  c.appendChild(authSection);
  updateAuthUI();

  o.overlay.classList.add("open");
}

// ── EVENTS ────────────────────────────────────────────────────────────────────
function openEvents(){
  const o=getOverlay();
  o.title.textContent="EVENTS";
  renderTabBar(["🎰 Cosmetic Roulette","🎟️ Item Roulette"],t=>{
    if(t===0)renderCosmeticRoulette();
    else renderItemRoulette();
  });
  renderCosmeticRoulette();
  o.overlay.classList.add("open");
}

function weightedRoulettePick(items,weightFn){
  const total=items.reduce((s,x)=>s+weightFn(x),0);
  let r=rnd()*total;
  for(const x of items){r-=weightFn(x);if(r<=0)return x;}
  return items[items.length-1];
}

function animateRoulette(containerId,items,displayFn,onLand,isSVG=false){
  const container=document.getElementById(containerId);
  if(!container)return;
  container.innerHTML="";
  const ITEM_W=60,VISIBLE=7;
  const picked=onLand();
  const stripItems=[];
  for(let i=0;i<34;i++)stripItems.push(items[Math.floor(rnd()*items.length)]);
  for(let i=0;i<5;i++)stripItems.push(items[Math.floor(rnd()*items.length)]);
  stripItems.push(picked);
  const strip=document.createElement("div");
  strip.style.cssText="display:flex;gap:4px;will-change:transform;";
  stripItems.forEach(item=>{
    const cell=document.createElement("div");
    cell.style.cssText="width:"+ITEM_W+"px;height:"+ITEM_W+"px;flex-shrink:0;background:rgba(255,255,255,0.07);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;border:2px solid rgba(255,255,255,0.1);overflow:hidden;";
    if(isSVG)cell.innerHTML=displayFn(item);else cell.textContent=displayFn(item);
    strip.appendChild(cell);
  });
  const wrapper=document.createElement("div");
  wrapper.style.cssText="overflow:hidden;width:"+(VISIBLE*(ITEM_W+4))+"px;margin:0 auto;position:relative;border-radius:10px;border:2px solid rgba(255,255,255,0.15);background:rgba(0,0,0,0.4);";
  const marker=document.createElement("div");
  marker.style.cssText="position:absolute;top:0;bottom:0;left:50%;transform:translateX(-50%);width:4px;background:rgba(255,200,0,0.8);z-index:2;border-radius:2px;pointer-events:none;";
  wrapper.appendChild(strip);wrapper.appendChild(marker);container.appendChild(wrapper);
  const centerOffset=Math.floor(VISIBLE/2);
  const endX=(stripItems.length-1-centerOffset)*(ITEM_W+4);
  let start=null;const duration=3200;
  function ease(t){return t<0.5?4*t*t*t:(t-1)*(2*t-2)*(2*t-2)+1;}
  function frame(ts){
    if(!start)start=ts;
    const progress=Math.min(1,(ts-start)/duration);
    strip.style.transform="translateX(-"+(endX*ease(progress))+"px)";
    if(progress<1){requestAnimationFrame(frame);}
    else{
      strip.style.transform="translateX(-"+endX+"px)";
      const cells=strip.querySelectorAll("div");
      cells[stripItems.length-1].style.background="rgba(255,200,0,0.25)";
      cells[stripItems.length-1].style.borderColor="rgba(255,200,0,0.8)";
      setTimeout(()=>container.dispatchEvent(new CustomEvent("landed",{detail:picked})),300);
    }
  }
  requestAnimationFrame(frame);
}

function renderCosmeticRoulette(){
  const c=document.getElementById("overlay-content");
  c.className="";c.style.cssText="padding:10px;display:flex;flex-direction:column;gap:10px;overflow-y:auto;";
  c.innerHTML="";
  // Equipped companion section
  if(S.companions&&S.companions.length>0){
    const eqSection=document.createElement("div");
    eqSection.style.cssText="background:rgba(255,255,255,0.04);border:1px solid rgba(255,200,0,0.2);border-radius:10px;padding:10px;";
    eqSection.innerHTML="<div style='font-size:10px;color:#888;letter-spacing:2px;margin-bottom:8px'>EQUIPPED COMPANION</div><div style='display:flex;align-items:center;gap:10px;flex-wrap:wrap;'></div>";
    const row=eqSection.querySelector("div[style*='display:flex']");
    S.companions.forEach(id=>{
      const comp=COMPANIONS.find(x=>x.id===id);if(!comp)return;
      const isEq=S.equipped_companion===id;
      const btn=document.createElement("div");
      btn.style.cssText="cursor:pointer;padding:4px;border-radius:8px;border:2px solid "+(isEq?"rgba(255,200,0,0.8)":"rgba(255,255,255,0.1)")+";background:"+(isEq?"rgba(255,200,0,0.1)":"transparent")+";text-align:center;";
      btn.innerHTML=comp.svg+"<div style='font-size:8px;color:"+comp.color+";margin-top:2px'>"+comp.name+"</div>";
      btn.onclick=()=>{S.equipped_companion=isEq?null:id;save();updateCompanion();renderCosmeticRoulette();};
      const svgEl=btn.querySelector("svg");if(svgEl){svgEl.setAttribute("width","40");svgEl.setAttribute("height","60");}
      row.appendChild(btn);
    });
    if(!S.equipped_companion){const none=document.createElement("span");none.style.cssText="font-size:10px;color:#444;align-self:center;";none.textContent="None — tap to equip";row.appendChild(none);}
    c.appendChild(eqSection);
  }
  const info=document.createElement("div");
  info.style.cssText="background:rgba(255,180,0,0.08);border:1px solid rgba(255,180,0,0.25);border-radius:10px;padding:10px;font-size:11px;color:#aaa;text-align:center;";
  info.innerHTML="<b style='color:#ffd700'>Cosmetic Roulette</b><br>Win a companion!<br><span style='color:#ffd700;font-size:13px'>💰 100 coins per spin</span>";
  c.appendChild(info);
  const rouletteArea=document.createElement("div");
  rouletteArea.id="cosmetic-roulette-area";
  rouletteArea.style.cssText="min-height:80px;display:flex;align-items:center;justify-content:center;";
  rouletteArea.innerHTML="<div style='color:#555;font-size:12px;letter-spacing:2px'>Press SPIN to play</div>";
  c.appendChild(rouletteArea);
  const resultDiv=document.createElement("div");resultDiv.id="cosmetic-roulette-result";resultDiv.style.cssText="text-align:center;font-size:13px;min-height:24px;color:#888;";c.appendChild(resultDiv);
  const odds=document.createElement("div");odds.style.cssText="display:grid;grid-template-columns:repeat(4,1fr);gap:5px;";
  COMPANIONS.forEach(comp=>{
    const cell=document.createElement("div");cell.style.cssText="background:rgba(255,255,255,0.04);border-radius:8px;padding:6px;text-align:center;border:1px solid rgba(255,255,255,0.07);";
    cell.innerHTML="<div style='display:flex;justify-content:center;margin-bottom:2px'>"+comp.svg+"</div><div style='font-size:9px;color:"+comp.color+"'>"+comp.name+"</div><div style='font-size:8px;color:#555'>"+comp.rarity+"</div>";
    const svg=cell.querySelector("svg");if(svg){svg.setAttribute("width","32");svg.setAttribute("height","48");}
    odds.appendChild(cell);
  });
  c.appendChild(odds);
  const spinBtn=document.createElement("button");
  spinBtn.style.cssText="padding:14px;background:linear-gradient(145deg,#2a1a00,#aa6600);border:1px solid #ffaa00;border-radius:10px;color:#ffd700;font-family:'Courier New',monospace;font-size:13px;font-weight:bold;cursor:pointer;letter-spacing:2px;";
  spinBtn.textContent="🎰 SPIN — 100 🪙";
  spinBtn.onclick=()=>{
    if(S.coins<100){toast("❌ Need 100 coins!");return;}
    S.coins-=100;updateHUD();save();
    spinBtn.disabled=true;spinBtn.style.opacity="0.5";
    resultDiv.textContent="";
    animateRoulette("cosmetic-roulette-area",COMPANIONS,comp=>comp.svg,()=>weightedRoulettePick(COMPANIONS,comp=>COMP_WEIGHTS[comp.rarity]),true);
    document.getElementById("cosmetic-roulette-area").addEventListener("landed",function handler(e){
      document.getElementById("cosmetic-roulette-area").removeEventListener("landed",handler);
      const comp=e.detail;
      const isNew=!S.companions.includes(comp.id);
      if(isNew)S.companions.push(comp.id);
      S.equipped_companion=comp.id;
      save();updateCompanion();
      resultDiv.innerHTML="<div style='display:inline-flex;align-items:center;gap:8px'>"+comp.svg+"<span style='color:"+comp.color+";font-size:16px;font-weight:bold'>"+comp.name+"</span></div><br>"+(isNew?"<span style='color:#60e880;font-size:11px'>✨ NEW!</span>":"<span style='color:#888;font-size:11px'>Auto-equipped!</span>");
      spinBtn.disabled=false;spinBtn.style.opacity="1";
    });
  };
  c.appendChild(spinBtn);
}

function renderItemRoulette(){
  const c=document.getElementById("overlay-content");
  c.className="";c.style.cssText="padding:10px;display:flex;flex-direction:column;gap:10px;overflow-y:auto;";
  c.innerHTML="";
  const ticketCount=S.roulette_tickets||0;
  const info=document.createElement("div");
  info.style.cssText="background:rgba(80,80,220,0.08);border:1px solid rgba(80,80,220,0.25);border-radius:10px;padding:10px;font-size:11px;color:#aaa;text-align:center;";
  info.innerHTML="<b style='color:#8080ff'>Item Roulette</b><br>Same loot as Rare Potion Chest<br><span style='color:#8080ff;font-size:13px'>🎟️ 1 ticket per spin (1 in 2,000 per roll, luck-scaled)</span><br><span style='color:#ffd700'>You have: "+ticketCount+" ticket"+(ticketCount!==1?"s":"")+"</span>";
  c.appendChild(info);
  const rouletteArea=document.createElement("div");rouletteArea.id="item-roulette-area";rouletteArea.style.cssText="min-height:80px;display:flex;align-items:center;justify-content:center;";rouletteArea.innerHTML="<div style='color:#555;font-size:12px;letter-spacing:2px'>Press SPIN to play</div>";c.appendChild(rouletteArea);
  const resultDiv=document.createElement("div");resultDiv.id="item-roulette-result";resultDiv.style.cssText="text-align:center;font-size:13px;min-height:24px;color:#888;";c.appendChild(resultDiv);
  const spinBtn=document.createElement("button");
  spinBtn.style.cssText="padding:14px;background:linear-gradient(145deg,#0a0a2a,#2020aa);border:1px solid #4040ff;border-radius:10px;color:#8080ff;font-family:'Courier New',monospace;font-size:13px;font-weight:bold;cursor:pointer;letter-spacing:2px;";
  spinBtn.textContent="🎟️ SPIN — 1 Ticket";
  spinBtn.onclick=()=>{
    if(S.roulette_tickets<1){toast("❌ No tickets! Roll to find them.");return;}
    S.roulette_tickets--;save();
    info.querySelector("span[style*='ffd700']").textContent="You have: "+S.roulette_tickets+" ticket"+(S.roulette_tickets!==1?"s":"");
    spinBtn.disabled=true;spinBtn.style.opacity="0.5";resultDiv.textContent="";
    const picked=weightedRoulettePick(CHEST_TABLES.Rare,row=>row.w);
    const EMOJIS={"Lucky Potion":"🍀","Speed Potion":"⚡","Fortune II":"🧪","Fortune III":"🧪","Haste Potion II":"🏃","Godly Potion (Zeus)":"⚡","Godly Potion (Poseidon)":"🔱","Godly Potion (Hades)":"💀","Potion of Bound":"🔮","Warp Potion":"⏩","Transcendent Potion":"🌟"};
    animateRoulette("item-roulette-area",CHEST_TABLES.Rare,row=>EMOJIS[row.item]||"📦",()=>picked);
    document.getElementById("item-roulette-area").addEventListener("landed",function handler(e){
      document.getElementById("item-roulette-area").removeEventListener("landed",handler);
      const row=e.detail;const qty=row.qty();
      S.owned_items[row.item]=(S.owned_items[row.item]||0)+qty;
      save();updateHUD();
      resultDiv.innerHTML="<span style='color:#ffd700;font-size:16px'>+"+qty+"× "+row.item+"</span><br><span style='color:#888;font-size:10px'>Added to items!</span>";
      spinBtn.disabled=false;spinBtn.style.opacity="1";
    });
  };
  c.appendChild(spinBtn);
}

// ── Buff Tray ─────────────────────────────────────────────────────────────────
function updateBuffTray(){
  const tray=document.getElementById("buff-tray");
  if(!tray)return;
  tray.innerHTML="";
  // Day/night
  const timeDiv=document.createElement("div");timeDiv.className="buff-icon";
  timeDiv.style.borderColor=S.isDay?"rgba(255,200,0,0.4)":"rgba(100,100,255,0.4)";
  timeDiv.innerHTML="<span class='buff-emoji'>"+(S.isDay?"☀️":"🌙")+"</span><div class='buff-info'><span class='buff-name'>"+(S.isDay?"DAYTIME":"NIGHTTIME")+"</span><span class='buff-timer' style='color:"+(S.isDay?"#ffd700":"#8888ff")+"'>"+Math.ceil(S.dayNightTimer||0)+"s</span></div>";
  tray.appendChild(timeDiv);
  // Gear buffs
  if(S.equipped_R){
    const g=GEARS.find(x=>x&&x.name===S.equipped_R);
    if(g&&(g.luck_add||g.speed_add)){
      const parts=[];
      if(g.luck_add)parts.push("+"+g.luck_add+"% luck");
      if(g.speed_add>0)parts.push("+"+g.speed_add+"% spd");
      else if(g.speed_add<0)parts.push(g.speed_add+"% spd");
      const d=document.createElement("div");d.className="buff-icon";d.style.borderColor="rgba(255,215,0,0.35)";
      d.innerHTML="<span class='buff-emoji'>🧤</span><div class='buff-info'><span class='buff-name'>"+g.name.replace(" Device","").replace(" Gauntlet","").replace(" Glove","")+"</span><span class='buff-timer' style='color:#ffd700'>"+parts.join(" ")+"</span></div>";
      tray.appendChild(d);
    }
  }
  if(S.equipped_L){
    const g=GEARS.find(x=>x&&x.name===S.equipped_L);
    if(g){
      const d=document.createElement("div");d.className="buff-icon";d.style.borderColor="rgba(180,100,255,0.35)";
      d.innerHTML="<span class='buff-emoji'>🫱</span><div class='buff-info'><span class='buff-name'>"+g.name.replace(" Device","").replace(" Gauntlet","").replace(" (L)","")+"</span><span class='buff-timer' style='color:#c080ff'>"+(g.effect||"").split(".")[0]+"</span></div>";
      tray.appendChild(d);
    }
  }
  // Active potions
  const PEMOJIS={"Lucky Potion":"🍀","Speed Potion":"⚡","Haste Potion I":"🏃","Haste Potion II":"🏃","Haste Potion III":"🏃","Fortune I":"🧪","Fortune II":"🧪","Fortune III":"🧪","Potion of Bound":"🔮","Heavenly Potion":"✨","Godlike Potion":"👑","Oblivion Potion":"🌑","Warp Potion":"⏩","Transcendent Potion":"🌟"};
  S.active_potions.forEach(p=>{
    const div=document.createElement("div");div.className="buff-icon";
    const isLuck=(p.luck_add||0)>0;
    div.style.borderColor=isLuck?"rgba(100,200,100,0.4)":"rgba(80,160,255,0.4)";
    const emoji=PEMOJIS[p.name]||"🧪";
    let rem=p.rollsLeft!==undefined?p.rollsLeft+" rolls":p.isRoll?"1 roll":Math.max(0,Math.ceil(p.timer/1000))+"s";
    const statTxt=isLuck?"+"+p.luck_add+"%":p.speed_add?"+"+p.speed_add+"% spd":"";
    const shortName=p.name.replace(" Potion","").replace("Fortune ","F").replace("Haste ","H");
    div.innerHTML="<span class='buff-emoji'>"+emoji+"</span><div class='buff-info'><span class='buff-name'>"+shortName+(statTxt?" "+statTxt:"")+"</span><span class='buff-timer' style='color:"+(isLuck?"#60e880":"#60a0ff")+"'>"+rem+"</span></div>";
    tray.appendChild(div);
  });
}

document.getElementById("btn-settings").addEventListener("click", openSettings);