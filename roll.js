function doRoll(){
  const luck = calcLuck();
  const biome = BIOMES[S.biomeIdx];
  S.rolls++; 
  S.bonusRollCtr++;

  // 1. Calculate Luck
  let bonusMult = 1;
  if(S.equipped_L === "Gravitational Device") bonusMult = 6;
  else if(S.equipped_L === "Flesh Device") bonusMult = 1.3;
  
  const isBonus = (S.equipped_L === "Flesh Device") || (S.bonusRollCtr % 10 === 0);
  let gemBonus = (S.equipped_L === "Gemstone Gauntlet") ? Math.floor(rnd() * 160) : 0;
  const effLuck = (luck + gemBonus) * (isBonus ? bonusMult : 1);

  // 2. THE SELECTION FIX: Sort Common to Rare
  // We sort by chance ASCENDING (1, 2, 5, 10...)
  const aurasCommonFirst = [...AURAS].sort((a, b) => a[1] - b[1]);
  
  let picked = aurasCommonFirst[0]; // Default to the most common aura (e.g. "Common")

  for (let i = 0; i < aurasCommonFirst.length; i++) {
    const a = aurasCommonFirst[i];
    
    // Skip if biome doesn't match
    if (a[4] && a[4] !== biome.name) continue;

    let mult = 1;
    if (a[4] === biome.name) mult *= BIOMES[S.biomeIdx].mult;
    if (a[0] === "Solar" && S.isDay) mult *= 10;
    if (a[0] === "Lunar" && !S.isDay) mult *= 10;

    // Check probability: (Luck / Rarity)
    // If Luck is 3 and Rarity is 1000, chance is 0.003
    if (rnd() < (effLuck * mult) / a[1]) {
        // If we succeed, we "upgrade" our picked aura to this rarer one
        // We DON'T break here, so we can keep trying for even rarer ones
        picked = a;
    }
  }

  // 3. Process the Result
  const [name, chance, col, glow, _] = picked;
  const tier = auraTier(chance);
  
  // Coin Multiplier
  let coinMult = 1;
  [S.equipped_R, S.equipped_L].forEach(n => {
    if(!n) return;
    const g = GEARS.find(x => x && x.name === n);
    if(g && g.coin_mult) coinMult = Math.max(coinMult, g.coin_mult);
  });
  S.coins += Math.round(Math.max(10, Math.floor(Math.log10(chance + 1) * 10)) * coinMult);

  // Collection/Inventory
  if(!S.collection[name]) S.collection[name] = {count: 0, unlocked: true};
  S.collection[name].count++;

  if(S.autoDelete.includes(name)){
    if(!document.hidden) addChatEntry(name, chance, col, glow, tier);
  } else {
    S.owned_auras[name] = (S.owned_auras[name] || 0) + 1;
    S.lastAura = { name, chance, col, glow, tier, isBonus };
  }

  // UI and Effects
  if(!document.hidden){
    spawnParticles(col, glow, tier);
    addChatEntry(name, chance, col, glow, tier);
    if(tier >= 4 || chance >= 10000) playCutscene(picked, tier);
    else updateAuraDisplay();
  }

  tickMerchant();
  updateHUD();
  save();
}
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  LOOT CHESTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CHEST_TABLES={
  Normal:[
    {item:"Lucky Potion",  w:40,qty:()=>Math.ceil(rnd()*3)},
    {item:"Speed Potion",  w:40,qty:()=>Math.ceil(rnd()*3)},
    {item:"Fortune I",     w:12,qty:()=>1},
    {item:"Haste Potion I",w:5, qty:()=>1},
    {item:"Fortune II",    w:2, qty:()=>1},
    {item:"Warp Potion",   w:0.5,qty:()=>1},
    {item:"Transcendent Potion",w:0.01,qty:()=>1},
  ],
  Rare:[
    {item:"Lucky Potion",  w:20,qty:()=>Math.ceil(rnd()*10+2)},
    {item:"Speed Potion",  w:20,qty:()=>Math.ceil(rnd()*10+2)},
    {item:"Fortune II",    w:20,qty:()=>1},
    {item:"Fortune III",   w:12,qty:()=>1},
    {item:"Haste Potion II",w:10,qty:()=>1},
    {item:"Godly Potion (Zeus)",w:5,qty:()=>1},
    {item:"Godly Potion (Poseidon)",w:5,qty:()=>1},
    {item:"Godly Potion (Hades)",w:5,qty:()=>1},
    {item:"Potion of Bound",w:5,qty:()=>1},
    {item:"Heavenly Potion",w:2,qty:()=>1},
    {item:"Warp Potion",   w:1, qty:()=>1},
    {item:"Transcendent Potion",w:0.05,qty:()=>1},
    {item:"Oblivion Potion",w:0.05,qty:()=>1},
  ],
  Mega:[
    {item:"Fortune III",   w:20,qty:()=>Math.ceil(rnd()*3)},
    {item:"Godly Potion (Zeus)",w:15,qty:()=>1},
    {item:"Godly Potion (Poseidon)",w:12,qty:()=>1},
    {item:"Godly Potion (Hades)",w:12,qty:()=>1},
    {item:"Potion of Bound",w:4,qty:()=>1},
    {item:"Warp Potion",w:2,qty:()=>1},
    {item:"Heavenly Potion",w:1,qty:()=>1},
  ],
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ROLLING ENGINE  (setInterval — works in all contexts)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// We use a plain setInterval instead of a Worker.
// When the tab is visible: runs at full speed.
// When hidden: browsers throttle to ~1Hz but it still fires,
//   so we use Date.now() delta to calculate how many rolls
//   should have happened and catch them all up at once.

let lastTickTime=Date.now();
let bgRollsWhileAway=0;
let _rollTick=null;

function startBgWorker(){
  if(_rollTick) return;
  lastTickTime=Date.now();
  _rollTick=setInterval(gameTick, 100); // 100ms ticks
}

function stopBgWorker(){
  if(_rollTick){clearInterval(_rollTick);_rollTick=null;}
}

// Called every 100ms (or ~1s when tab hidden)
function gameTick(){
  const now=Date.now();
  const dt=Math.min(now-lastTickTime, 5000); // cap at 5s to avoid huge catch-ups on re-focus
  lastTickTime=now;

  S.rollInterval=calcSpeed();

  // Potion timers (array — each potion ticks independently)
  if(S.active_potions.length>0){
    let expired=[];
    S.active_potions=S.active_potions.filter(p=>{
      if(p.rollsLeft!==undefined) return true; // roll-based — timer not used, managed in doRoll
      p.timer-=dt;
      if(p.timer<=0){
        if(!document.hidden) toast(`🧪 ${p.name} wore off`);
        return false;
      }
      return true;
    });
    if(!document.hidden) updateHUD();
  }

  // ── Timers always run regardless of autoRoll ──
  tickBiome(dt);
  tickPassiveDrops(dt);
  tickDayNight(dt);

  // Roll cooldown
  if(S.rollCooldown>0) S.rollCooldown=Math.max(0, S.rollCooldown-dt);

  if(!S.autoRoll) return;

  if(S.rollCooldown<=0){
    if(document.hidden){
      const missedRolls=Math.max(1, Math.floor(dt/S.rollInterval));
      for(let i=0;i<missedRolls;i++) doBgRoll();
      bgRollsWhileAway+=missedRolls;
    } else if(!csActive&&!starCsActive){
      doRoll();
      S.rollCooldown=S.rollInterval;
    }
  }
}

// Called from endCutscene/endStarCutscene — fires next roll immediately
function onCutsceneDone(){
  if(S.autoRoll) S.rollCooldown=0;
}

// Silent background roll — no visuals, no cutscenes
function doBgRoll(){
  const luck=calcLuck();
  const biome=BIOMES[S.biomeIdx];
  S.rolls++;S.bonusRollCtr++;

  // FIX: Change 60 back to 2 to prevent "Background Luck God" mode
  let bonusMult=2;
  if(S.equipped_L==="Gravitational Device")bonusMult=6;
  else if(S.equipped_L==="Flesh Device")bonusMult=1.3;
  
  const fleshActive=S.equipped_L==="Flesh Device";
  const isBonus=fleshActive||(S.bonusRollCtr%10===0);
  let gemBonus=0;
  if(S.equipped_L==="Gemstone Gauntlet") gemBonus=Math.floor(rnd()*160);
  const effLuck=(luck+gemBonus)*(isBonus?bonusMult:1);

  let coinMult=1;
  [S.equipped_R,S.equipped_L].forEach(n=>{if(!n)return;const g=GEARS.find(x=>x&&x.name===n);if(g&&g.coin_mult) coinMult=Math.max(coinMult,g.coin_mult);});

  const biomeMult=BIOMES[S.biomeIdx].mult;
  const elig=AURAS.filter(a=>!a[4]||a[4]===biome.name).sort((a,b)=>b[1]-a[1]);

  // FIX: Default to the MOST COMMON aura (last in sorted list), not the rarest
  let picked=elig[elig.length - 1]; 

  for(let i=0;i<elig.length;i++){
    const a=elig[i];
    let mult=1;
    if(a[4]===biome.name) mult*=biomeMult;
    if(a[0]==="Solar"&&S.isDay) mult*=10;
    if(a[0]==="Lunar"&&!S.isDay) mult*=10;

    // Use proper independent probability check
    if(rnd() < (effLuck * mult) / a[1]){
      picked=a;
      break;
    }
  }
  // ... rest of processing (Coins, Collection, Save)
  const [name,chance,col,glow]=picked;
  const tier=auraTier(chance);
  S.coins+=Math.round(Math.max(1,Math.floor(Math.log10(chance+1)))*coinMult);
  S.active_potions=S.active_potions.filter(p=>{
    if(p.isRoll) return false;
    if(p.rollsLeft!==undefined){p.rollsLeft--;if(p.rollsLeft<=0)return false;}
    return true;
  });
  if(!S.collection[name]) S.collection[name]={count:0,unlocked:true};
  S.collection[name].count=(S.collection[name].count||0)+1;
  if(!S.autoDelete.includes(name)){
    S.owned_auras[name]=(S.owned_auras[name]||0)+1;
    if(S.autoEquip===name){S.equipped_aura=name;}
    S.lastAura={name,chance,col,glow,tier,isBonus:false};
  }
  tickMerchant();
  if(rnd()<(0.0005*(Math.max(100,calcLuck())/100))){S.roulette_tickets++;}
  S.rollCooldown=S.rollInterval;
  if(S.rolls%60===0) save();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PAGE VISIBILITY — show summary when returning
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.addEventListener("visibilitychange",()=>{
  if(!document.hidden){
    // Tab became visible — update everything
    updateHUD();
    updateAuraDisplay();
    updateBiomeBar();
    updateEquippedBadge();
    if(bgRollsWhileAway>0){
      const n=bgRollsWhileAway;
      bgRollsWhileAway=0;
      save();
      setTimeout(()=>toast(`💤 Rolled ${n.toLocaleString()} times while away!`,3500),300);
    }
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GAME LOOP  (visuals only — logic runs in worker)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let last=performance.now();
function loop(ts){
  // VISUAL ONLY loop — all game logic (rolling, cooldowns, timers) handled by worker
  last=ts;

  if(!document.hidden){
    // Day/night tick in visual loop too (ensures it runs even without rolling)
    const _now2=performance.now();
    if(typeof _lastDayTick==='undefined') window._lastDayTick=_now2;
    const _dayDt=(_now2-window._lastDayTick)/1000;
    window._lastDayTick=_now2;
    if(_dayDt<2){ // sanity cap
      S.dayNightTimer-=_dayDt;
      if(S.dayNightTimer<=0){S.isDay=!S.isDay;S.dayNightTimer=150;if(!document.hidden)toast(S.isDay?'☀️ Daytime!':'🌙 Nighttime!');}
      // Also tick potion timers
      S.active_potions=S.active_potions.filter(p=>{
        if(p.rollsLeft!==undefined)return true;
        p.timer-=_dayDt*1000;
        if(p.timer<=0){toast('🧪 '+p.name+' wore off');return false;}
        return true;
      });
      // Biome timer
      if(S.biomeIdx>0){
        S.biomeTimer-=_dayDt;
        if(S.biomeTimer<=0){S.biomeIdx=0;updateBiomeBar();}
      }
    }
    const _tb=document.getElementById('time-bar');if(_tb)_tb.textContent=(S.isDay?'☀️ DAY ':'🌙 NIGHT ')+Math.ceil(S.dayNightTimer||0)+'s';
    // Update biome bar timer live every frame
    if(S.biomeIdx>0){const _bb=document.getElementById('biome-bar');const _bm=BIOMES[S.biomeIdx];if(_bb)_bb.textContent=_bm.emoji+' '+_bm.name+' · '+Math.ceil(S.biomeTimer)+'s';}
    // Update potion bar
    // Buff tray — render icon per active potion
    updateBuffTray();
    // Update cooldown bar (convert ms to 0-1 fraction)
    const pct=S.rollInterval>0?Math.max(0,1-(S.rollCooldown/S.rollInterval)):1;
    document.getElementById("coolbar-fill").style.width=(pct*100)+"%";
    // Bonus roll countdown
    const bcEl=document.getElementById("bonus-countdown");
    if(bcEl){
      const fleshActive=S.equipped_L==="Flesh Device";
      if(fleshActive){
        bcEl.textContent="✨ EVERY ROLL IS BONUS";
        bcEl.style.color="#ffd700";
      } else {
        // Period is 10 by default
        const period=10;
        const remaining=period-(S.bonusRollCtr%period);
        const bonusMult=S.equipped_L==="Gravitational Device"?6:S.equipped_L==="Blessed Tide Gauntlet"?2:2;
        const isNext=remaining===period; // about to trigger
        bcEl.textContent=remaining===period?"⚡ BONUS NEXT ROLL!":"🎲 Bonus in "+remaining+" rolls (×"+bonusMult+")";
        bcEl.style.color=remaining<=2?"#ffd700":remaining<=5?"#aa8840":"#555";
      }
    }

    tickCutscene();
    tickStarCutscene();
    draw(ts);
  }
  requestAnimationFrame(loop);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  BUTTON WIRING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const rollBtn=document.getElementById("btn-roll");
rollBtn.addEventListener("click",()=>{
  if(csActive||starCsActive)return;
  if(S.rollCooldown>0.5){
    S.autoRoll=!S.autoRoll;
    rollBtn.textContent=S.autoRoll?"AUTO ●":"ROLL";
    toast(S.autoRoll?"⚡ Auto-Roll ON — rolls in background too!":"⏹ Auto-Roll OFF");
    return;
  }
  doRoll();S.rollCooldown=S.rollInterval; // ms
});

// long-press for auto-roll
let pressT;
rollBtn.addEventListener("pointerdown",()=>{pressT=setTimeout(()=>{
  S.autoRoll=!S.autoRoll;
  rollBtn.textContent=S.autoRoll?"AUTO ●":"ROLL";
  toast(S.autoRoll?"⚡ Auto-Roll ON — rolls in background!":"⏹ Auto-Roll OFF");
},500);});
rollBtn.addEventListener("pointerup",()=>clearTimeout(pressT));
rollBtn.addEventListener("pointerleave",()=>clearTimeout(pressT));

document.getElementById("btn-events").addEventListener("click",openEvents);
document.getElementById("btn-shop").addEventListener("click",openShop2);
document.getElementById("btn-inv").addEventListener("click",openInventory2);
document.getElementById("btn-collect").addEventListener("click",openCollection);
document.getElementById("btn-settings").addEventListener("click",openSettings);
document.getElementById("merchant-btn").addEventListener("click",openMerchant);
document.getElementById("close-overlay").addEventListener("click",()=>{
  const c=document.getElementById("overlay-content");
  c.className="grid";c.style.cssText="";
  document.getElementById("overlay").classList.remove("open");
});function openChest(type){
  const table=CHEST_TABLES[type];if(!table)return;
  const total=table.reduce((s,r)=>s+r.w,0);
  let rv=rnd()*total,reward=table[0];
  for(const row of table){rv-=row.w;if(rv<=0){reward=row;break;}}
  const qty=reward.qty();
  S.owned_items[reward.item]=(S.owned_items[reward.item]||0)+qty;
  save();updateHUD();
  toast(`📦 ${type} Chest: ${qty}× ${reward.item}!`,3000);
}

// ── Passive drops every minute ────────────────────────────────────
let passiveDropTimer=0;
let cloudSaveTimer=0;
function tickPassiveDrops(dt){
  // Cloud auto-save every 60 seconds if signed in
  if(sbUser && sbClient){
    cloudSaveTimer+=dt;
    if(cloudSaveTimer>=60000){
      cloudSaveTimer=0;
      saveCloudSave(true); // silent=true, no toast
    }
  }
  passiveDropTimer+=dt;
  if(passiveDropTimer>=60000){
    passiveDropTimer=0;
    const r=rnd();
    if(r<0.30){S.owned_items["Lucky Potion"]=(S.owned_items["Lucky Potion"]||0)+1;if(!document.hidden)toast("🍀 Found a Lucky Potion!");}
    else if(r<0.55){S.owned_items["Speed Potion"]=(S.owned_items["Speed Potion"]||0)+1;if(!document.hidden)toast("⚡ Found a Speed Potion!");}
    // 3% chance normal chest, 1% rare chest
    else if(r<0.58){openChest("Normal");}
    else if(r<0.59){openChest("Rare");}
    save();
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  BIOME TICK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function tickBiome(dt){
  const dtSec=dt/1000;
  if(S.biomeIdx>0){
    S.biomeTimer-=dtSec;
    if(S.biomeTimer<=0){
      S.biomeIdx=0;
      updateBiomeBar();
      if(!document.hidden) toast("🌍 Biome returned to Normal");
    }
  }
  // Per-second spawn check — each biome has its own wiki-accurate chance per second
  if(S.biomeIdx===0){
    for(let i=1;i<BIOMES.length;i++){
      const b=BIOMES[i];
      if(rnd()<b.spawnChance*dtSec){
        S.biomeIdx=i;
        S.biomeTimer=b.dur;
        updateBiomeBar();
        if(b.item){
          const qty=b.itemQty+(b.itemQty>1?Math.floor(rnd()*3):0);
          S.owned_items[b.item]=(S.owned_items[b.item]||0)+qty;
          save();
          if(!document.hidden) toast(`${b.emoji} ${b.name} biome! Got ${qty}× ${b.item}!`,4000);
        } else {
          if(!document.hidden) toast(`${b.emoji} ${b.name} biome!`,3000);
        }
        break; // only one biome at a time
      }
    }
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  SHOP OVERLAY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ── Crafting helpers ──────────────────────────────────────────────────────
function canCraft(recipe){
  // Check if player has all needed auras/items/gears
  for(const ing of recipe.ingredients){
    const have=S.owned_auras[ing.name]||S.owned_items[ing.name]||0;
    const haveGear=S.owned_gears[ing.name]?1:0;
    if(have+haveGear<ing.qty) return false;
  }
  return true;
}

function consumeIngredients(recipe){
  for(const ing of recipe.ingredients){
    // consume from auras first, then items, then gears
    let need=ing.qty;
    if(S.owned_auras[ing.name]){
      const take=Math.min(need,S.owned_auras[ing.name]);
      S.owned_auras[ing.name]-=take; need-=take;
      if(S.owned_auras[ing.name]<=0) delete S.owned_auras[ing.name];
    }
    if(need>0&&S.owned_items[ing.name]){
      const take=Math.min(need,S.owned_items[ing.name]);
      S.owned_items[ing.name]-=take; need-=take;
      if(S.owned_items[ing.name]<=0) delete S.owned_items[ing.name];
    }
    if(need>0&&S.owned_gears[ing.name]){
      delete S.owned_gears[ing.name];
      if(S.equipped_R===ing.name) S.equipped_R=null;
      if(S.equipped_L===ing.name) S.equipped_L=null;
    }
  }
}

function getIngredientHave(name){
  return (S.owned_auras[name]||0)+(S.owned_items[name]||0)+(S.owned_gears[name]?1:0);
}

function openShop(){
  shopTab=0;
  document.getElementById("overlay-title").textContent="CRAFTING";
  renderTabBar(["⚔️ Gears","🧪 Potions","✨ Auras"],t=>{shopTab=t;renderCraftItems();});
  renderCraftItems();
  document.getElementById("overlay").classList.add("open");
}

function renderCraftItems(){
  const c=document.getElementById("overlay-content");c.innerHTML="";
  const recipes=shopTab===0?GEAR_RECIPES:shopTab===1?POTION_RECIPES:AURA_RECIPES;

  recipes.forEach(rec=>{
    const name=rec.gear||rec.name||rec.aura;
    const can=canCraft(rec);
    const owned=shopTab===0?S.owned_gears[name]:S.owned_items[name]>0;
    const card=document.createElement("div");card.className="card";
    card.style.borderColor=can?"rgba(60,200,60,0.5)":"rgba(255,255,255,0.08)";
    if(can) card.style.background="rgba(60,200,60,0.06)";

    // ingredient list
    const ingHtml=rec.ingredients.map(ing=>{
      const have=getIngredientHave(ing.name);
      const ok=have>=ing.qty;
      return `<span style="font-size:9px;color:${ok?"#60e880":"#ff6060"}">${ing.qty}× ${ing.name} (${have})</span>`;
    }).join('<br/>');

    card.innerHTML=`
      ${owned?`<span class="owned-tag">✓</span>`:""}
      <div class="card-name" style="color:${can?"#60e880":"#aaa"}">${name}</div>
      <div class="card-sub" style="margin-bottom:6px">${rec.desc||""}</div>
      <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:5px">${ingHtml}</div>
      <button style="margin-top:8px;width:100%;padding:6px;background:${can?"rgba(60,200,60,0.2)":"rgba(255,255,255,0.05)"};border:1px solid ${can?"rgba(60,200,60,0.4)":"rgba(255,255,255,0.1)"};border-radius:6px;color:${can?"#60e880":"#555"};font-family:inherit;font-size:10px;cursor:pointer;letter-spacing:1px;">${can?"⚒️ CRAFT":"❌ MISSING"}</button>
    `;
    card.querySelector("button").onclick=(e)=>{
      e.stopPropagation();
      if(!can){toast("❌ Missing ingredients!");return;}
      consumeIngredients(rec);
      if(shopTab===2){
        // aura craft
        const auraName=rec.aura;
        S.owned_auras[auraName]=(S.owned_auras[auraName]||0)+1;
        if(!S.collection[auraName]) S.collection[auraName]={count:0,unlocked:true};
        S.collection[auraName].count=(S.collection[auraName].count||0)+1;
        const auraData=AURAS.find(a=>a[0]===auraName);
        if(auraData){
          S.lastAura={name:auraName,chance:auraData[1],col:auraData[2],glow:auraData[3],tier:auraTier(auraData[1]),isBonus:false,crafted:true};
          updateAuraDisplay();
          // play cutscene if rare enough
          if(auraTier(auraData[1])>=3) playCutscene(auraData,auraTier(auraData[1]));
          else if(auraData[1]>=10000) playStarCutscene(auraData,auraTier(auraData[1]));
        }
        toast(`✨ Crafted: ${auraName}! Added to storage.`);
      } else if(shopTab===0){
        // gear
        S.owned_gears[name]=true;
        const gearDef=GEARS.find(g=>g&&g.name===name);
        if(gearDef){gearDef.hand==="R"?S.equipped_R=name:S.equipped_L=name;}
        if(name==="Gear Basing"){S.owned_items["Gear Basing"]=(S.owned_items["Gear Basing"]||0)+1;}
        toast(`✅ Crafted: ${name}!`);
      } else {
        // potion or item — add to owned_items inventory
        S.owned_items[name]=(S.owned_items[name]||0)+1;
        toast(`🧪 Crafted: ${name}! Check Items tab.`);
      }
      updateHUD();save();renderCraftItems();
    };
    c.appendChild(card);
  });
}

function updateEquippedBadge(){
  const badge=document.getElementById("equipped-aura-badge");
  const nameEl=document.getElementById("eb-name");
  if(!S.equipped_aura){
    badge.style.display="none";return;
  }
  const aura=AURAS.find(x=>x[0]===S.equipped_aura);
  badge.style.display="block";
  if(aura){
    nameEl.textContent=aura[0];
    nameEl.style.color=rgb(aura[3]);
    nameEl.style.textShadow=`0 0 8px ${rgb(aura[2])}`;
    badge.style.borderColor=rgba(aura[2],0.4);
  }
}

function openInventory(){
  document.getElementById("overlay-title").textContent="MY AURAS";
  const entries=Object.entries(S.owned_auras).sort((a,b)=>{
    const ta=AURAS.find(x=>x[0]===a[0]),tb=AURAS.find(x=>x[0]===b[0]);
    return(tb?tb[1]:0)-(ta?ta[1]:0);
  });
  document.getElementById("tab-bar").innerHTML="";
  const c=document.getElementById("overlay-content");c.innerHTML="";
  if(!entries.length){
    c.innerHTML='<div class="empty-msg">No auras yet.<br/>Start rolling!</div>';
    document.getElementById("overlay").classList.add("open");return;
  }
  // Equipped banner
  const banner=document.createElement("div");
  banner.style.cssText="grid-column:1/-1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:8px 12px;font-size:10px;margin-bottom:4px;";
  if(S.equipped_aura){
    const ea=AURAS.find(x=>x[0]===S.equipped_aura);
    banner.innerHTML=`<span style="color:#777;letter-spacing:2px">EQUIPPED: </span><span style="color:${ea?rgb(ea[3]):"#fff"};font-weight:bold">${S.equipped_aura}</span>`;
  } else {
    banner.innerHTML='<span style="color:#444;letter-spacing:2px">No aura equipped — tap one to equip</span>';
  }
  c.appendChild(banner);

  entries.forEach(([name,count])=>{
    const aura=AURAS.find(x=>x[0]===name);if(!aura)return;
    const tier=auraTier(aura[1]);
    const isEq=S.equipped_aura===name;
    const card=document.createElement("div");card.className="card";
    card.style.borderColor=rgba(aura[2],isEq?0.8:0.35);
    if(isEq) card.style.background="rgba(255,255,255,0.07)";
    card.innerHTML=`
      ${isEq?'<span class="owned-tag" style="background:rgba(60,200,60,0.2);color:#60ff60;border:1px solid rgba(60,200,60,0.3)">EQ</span>':""}
      <div class="tier-label" style="color:${TIER_COLS[tier]}">${TIER_NAMES[tier]}</div>
      <div class="card-name" style="color:${rgb(aura[3])};text-shadow:0 0 6px ${rgb(aura[2])}">${name}</div>
      <div class="card-sub">1 in ${aura[1].toLocaleString()}</div>
      <span class="aura-count">×${count}</span>
    `;
    card.onclick=()=>{
      S.equipped_aura=isEq?null:name;
      save();updateEquippedBadge();updateMusic();
      if(!isEq){
        toast("✨ Equipped: "+name);
        S.lastAura={name,chance:aura[1],col:aura[2],glow:aura[3],tier,isBonus:false};
        updateAuraDisplay();
      } else {
        toast("Aura unequipped");
      }
      // re-render
      openInventory();
    };
    c.appendChild(card);
  });
  document.getElementById("overlay").classList.add("open");
}



// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DAY / NIGHT SYSTEM
//  Day/night switches every 150s (2.5 min, wiki accurate)
//  Solar exclusive to DAYTIME, Lunar exclusive to NIGHTTIME
//  Both get 10x spawn weight boost in their time period
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// (S.isDay and S.dayNightTimer added to state)
function tickDayNight(dt){
  S.dayNightTimer-=dt/1000;
  if(S.dayNightTimer<=0){
    S.isDay=!S.isDay;
    S.dayNightTimer=150; // 2.5 minutes
    const timeBar=document.getElementById("time-bar");
    if(timeBar){
      timeBar.textContent=S.isDay?"☀️ DAY":"🌙 NIGHT";
      timeBar.style.color=S.isDay?"#ffd700":"#8888ff";
      timeBar.style.borderColor=S.isDay?"rgba(255,200,0,0.35)":"rgba(100,100,255,0.35)";
    }
    if(!document.hidden) toast(S.isDay?"☀️ Daytime — Solar boost active!":"🌙 Nighttime — Lunar boost active!");
  }
}

function initDayNight(){
  // Already in state via save/load, but set defaults if missing
  if(S.isDay===undefined) S.isDay=true;
  if(!S.dayNightTimer||S.dayNightTimer<=0) S.dayNightTimer=150;
  const timeBar=document.getElementById("time-bar");
  if(timeBar){
    timeBar.textContent=S.isDay?"☀️ DAY":"🌙 NIGHT";
    timeBar.style.color=S.isDay?"#ffd700":"#8888ff";
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  INIT — runs after ALL scripts are loaded
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
(function init(){
  load();
  // Clear equipped gears that no longer exist in GEARS array
  if(S.equipped_R && !GEARS.find(g=>g&&g.name===S.equipped_R)) S.equipped_R=null;
  if(S.equipped_L && !GEARS.find(g=>g&&g.name===S.equipped_L)) S.equipped_L=null;
  updateHUD();
  updateBiomeBar();
  updateEquippedBadge();
  initDayNight();
  updateCompanion();
  resize();
  requestAnimationFrame(loop);
  startBgWorker();
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("sw.js").catch(()=>{});
  }
  // Supabase init last — auto-loads cloud save if already signed in
  setTimeout(initSupabase, 500);
})();
