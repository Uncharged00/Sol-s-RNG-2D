// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// merchants.js — Merchant system (Mari, Jester, Rin)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MERCHANTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Spawn every 15-45 min real time → simulated as every ~300-600 rolls
const MERCHANT_DEFS={
  Mari:{
    emoji:"🛍️",color:"#88aaff",
    greeting:"Hmm.. Hello. I hope I have something that catches your attention..",
    items:[
      // Mari stock is randomised each visit from her pool
      ...(()=>{
        const pool=[
          {name:"Lucky Potion",desc:"🍀 +100% Luck · 1 min",cost:100},
          {name:"Lucky Potion L",desc:"🍀 +100% Luck · 5 min",cost:300},
          {name:"Lucky Potion XL",desc:"🍀 +100% Luck · 10 min",cost:600},
          {name:"Speed Potion",desc:"⚡ +10% Speed · 1 min",cost:80},
          {name:"Speed Potion L",desc:"⚡ +10% Speed · 5 min",cost:250},
          {name:"Speed Potion XL",desc:"⚡ +10% Speed · 10 min",cost:500},
          {name:"Fortune Spoid I",desc:"✨ +50% Luck · 1 min",cost:400},
          {name:"Fortune Spoid II",desc:"✨ +75% Luck · 1 min",cost:900},
          {name:"Fortune Spoid III",desc:"✨ +100% Luck · 1 min",cost:1800},
          {name:"Fortune I",desc:"🧪 +150% Luck · 5 min",cost:2000},
          {name:"Fortune II",desc:"🧪 +200% Luck · 7 min",cost:5000},
          {name:"Fortune III",desc:"🧪 +250% Luck · 10 min",cost:10000},
          {name:"Haste Potion I",desc:"🏃 +20% Speed · 5 min",cost:1500},
          {name:"Haste Potion II",desc:"🏃 +25% Speed · 5 min",cost:3500},
          {name:"Haste Potion III",desc:"🏃 +30% Speed · 5 min",cost:8000},
          {name:"Gear Basing",desc:"⚙️ Crafting component",cost:500},
          {name:"Normal Potion Chest",desc:"📦 Buy a Normal Chest",cost:200},
          {name:"Rare Potion Chest",desc:"📦 Buy a Rare Chest",cost:800},
          {name:"Void Coin",desc:"💜 Jester currency",cost:50000},
        ];
        // Pick 5 random items
        const shuffled=[...pool].sort(()=>rnd()-0.5).slice(0,5);
        return shuffled.map(item=>({
          ...item,
          action:()=>{
            if(item.name.includes("Chest")){const t=item.name.includes("Rare")?"Rare":"Normal";openChest(t);}
            else if(item.name==="Fortune Spoid I")  usePotion({name:"Fortune Spoid I",luck_add:50,dur:60});
            else if(item.name==="Fortune Spoid II") usePotion({name:"Fortune Spoid II",luck_add:75,dur:60});
            else if(item.name==="Fortune Spoid III")usePotion({name:"Fortune Spoid III",luck_add:100,dur:60});
            else if(item.name==="Lucky Potion L")   usePotion({name:"Lucky Potion L",luck_add:100,dur:300});
            else if(item.name==="Lucky Potion XL")  usePotion({name:"Lucky Potion XL",luck_add:100,dur:600});
            else if(item.name==="Speed Potion L")   usePotion({name:"Speed Potion L",speed_add:10,dur:300});
            else if(item.name==="Speed Potion XL")  usePotion({name:"Speed Potion XL",speed_add:10,dur:600});
            else{S.owned_items[item.name]=(S.owned_items[item.name]||0)+1;toast("Added: "+item.name);}
          }
        }));
      })(),
    ]
  },
  Jester:{
    emoji:"🃏",color:"#cc44ff",
    greeting:"Welcome! I deal only with special goods! I don't take money—only Dark Points!",
    currency:"Dark Points",
    items:(()=>{
      const pool=[
        {name:"Heavenly Potion",desc:"✨ +15M% Luck · 1 roll",cost:500,currency:"Dark Points",
         action:()=>{S.owned_items["Heavenly Potion"]=(S.owned_items["Heavenly Potion"]||0)+1;toast("Got Heavenly Potion!");}},
        {name:"Oblivion Potion",desc:"🌑 +60M% Luck · 1 roll",cost:5,currency:"Void Coins",
         action:()=>{
           if((S.owned_items["Void Coin"]||0)<5){toast("❌ Need 5 Void Coins!");return;}
           S.owned_items["Void Coin"]-=5;
           S.owned_items["Oblivion Potion"]=(S.owned_items["Oblivion Potion"]||0)+1;
           toast("Got Oblivion Potion!");
         }},
        {name:"Potion of Bound",desc:"🔮 +5M% Luck · 1 roll",cost:300,currency:"Dark Points",
         action:()=>{S.owned_items["Potion of Bound"]=(S.owned_items["Potion of Bound"]||0)+1;toast("Got Potion of Bound!");}},
        {name:"Fortune III",desc:"🧪 +250% Luck · 10 min",cost:150,currency:"Dark Points",
         action:()=>{S.owned_items["Fortune III"]=(S.owned_items["Fortune III"]||0)+1;toast("Got Fortune III!");}},
        {name:"Mega Potion Chest",desc:"📦 Mega loot!",cost:600,currency:"Dark Points",
         action:()=>{openChest("Mega");}},
        {name:"Godlike Potion",desc:"👑 +40M% Luck · 1 roll",cost:1000,currency:"Dark Points",
         action:()=>{S.owned_items["Godlike Potion"]=(S.owned_items["Godlike Potion"]||0)+1;toast("Got Godlike Potion!");}},
        {name:"Lucky Potion",desc:"🍀 Basic luck",cost:20,currency:"Dark Points",
         action:()=>{S.owned_items["Lucky Potion"]=(S.owned_items["Lucky Potion"]||0)+5;toast("Got 5× Lucky Potion!");}},
      ];
      return [...pool].sort(()=>rnd()-0.5).slice(0,4);
    })()
  },
  Rin:{
    emoji:"🌸",color:"#ffaacc",
    greeting:"Come and check out my stock, I guess. I'm not gonna turn down money.",
    items:[
      {name:"Sunstone Talisman",desc:"☀️ +100% Basic Luck (passive)",cost:50000,action:()=>{if(!S.owned_talismans.includes("Sunstone Talisman"))S.owned_talismans.push("Sunstone Talisman");S.equipped_talisman="Sunstone Talisman";toast("🌸 Sunstone Talisman equipped!");updateHUD();}},
      {name:"Moonstone Talisman",desc:"🌙 +100% Basic Luck (passive)",cost:50000,action:()=>{if(!S.owned_talismans.includes("Moonstone Talisman"))S.owned_talismans.push("Moonstone Talisman");S.equipped_talisman="Moonstone Talisman";toast("🌸 Moonstone Talisman equipped!");updateHUD();}},
      {name:"Day and Night Talisman",desc:"🌓 +125% Basic Luck (permanent)",cost:250000,action:()=>{if(!S.owned_talismans.includes("Day and Night Talisman"))S.owned_talismans.push("Day and Night Talisman");S.equipped_talisman="Day and Night Talisman";toast("🌸 Day and Night Talisman equipped!");updateHUD();}},
      {name:"Soul Collector's Talisman",desc:"👻 +0.04% per Lost Soul (max 400%)",cost:1000000,action:()=>{if(!S.owned_talismans.includes("Soul Collector's Talisman"))S.owned_talismans.push("Soul Collector's Talisman");S.equipped_talisman="Soul Collector's Talisman";toast("🌸 Soul Collector's Talisman!");updateHUD();}},
      {name:"Soul Master Talisman",desc:"👻 +0.05% per Lost Soul (max 250%) + 500% Base Luck",cost:1500000,action:()=>{if(!S.owned_talismans.includes("Soul Master Talisman"))S.owned_talismans.push("Soul Master Talisman");S.equipped_talisman="Soul Master Talisman";toast("🌸 Soul Master Talisman!");updateHUD();}},
    ]
  }
};

let activeMerchant=null, merchantTimer=0, merchantDespawnTimer=0, merchantRollCount=0;
const MERCHANT_SPAWN_INTERVAL=350; // ~every 350 rolls (simulates 15-45min)
const MERCHANT_DURATION=180; // despawn after 180 rolls

function tickMerchant(){
  merchantRollCount++;
  if(!activeMerchant){
    merchantTimer++;
    if(merchantTimer>=MERCHANT_SPAWN_INTERVAL){
      merchantTimer=0;
      spawnMerchant();
    }
  } else {
    merchantDespawnTimer++;
    if(merchantDespawnTimer>=MERCHANT_DURATION){
      despawnMerchant();
    }
  }
}

function spawnMerchant(){
  const r=rnd();
  const key=r<0.8?"Mari":r<0.9?"Rin":"Jester";
  activeMerchant=key;
  merchantDespawnTimer=0;
  const m=MERCHANT_DEFS[key];
  toast(`${m.emoji} ${key} has arrived! Tap to trade.`,4000);
  // Show merchant button
  document.getElementById("merchant-btn").style.display="flex";
  document.getElementById("merchant-btn").textContent=m.emoji;
}

function despawnMerchant(){
  activeMerchant=null;
  document.getElementById("merchant-btn").style.display="none";
  toast("Merchant has left.",1500);
}

function openMerchant(){
  if(!activeMerchant) return;
  const m=MERCHANT_DEFS[activeMerchant];
  document.getElementById("overlay-title").textContent=`${m.emoji} ${activeMerchant}`;
  document.getElementById("tab-bar").innerHTML="";
  const c=document.getElementById("overlay-content");c.innerHTML="";

  // greeting
  const greet=document.createElement("div");
  greet.style.cssText="grid-column:1/-1;color:#888;font-size:11px;padding:8px;border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:4px;font-style:italic;";
  greet.textContent=`"${m.greeting}"`;
  c.appendChild(greet);

  // dark points balance for Jester
  if(activeMerchant==="Jester"){
    const dp=document.createElement("div");
    dp.style.cssText="grid-column:1/-1;color:#cc44ff;font-size:11px;padding:4px 8px;";
    dp.textContent=`Dark Points: ${S.owned_items["Dark Points"]||0} P`;
    c.appendChild(dp);
  }

  m.items.forEach(item=>{
    const card=document.createElement("div");card.className="card";
    const currency=item.currency||"🪙 Coins";
    let balance;
    if(item.currency==="Dark Points") balance=S.owned_items["Dark Points"]||0;
    else if(item.currency==="Void Coins") balance=S.owned_items["Void Coin"]||0;
    else balance=S.coins;
    const canAfford=balance>=item.cost;
    card.style.borderColor=canAfford?"rgba(255,200,80,0.4)":"rgba(255,255,255,0.08)";
    card.innerHTML=`
      <div class="card-name" style="color:${m.color}">${item.name}</div>
      <div class="card-sub">${item.desc}</div>
      <div class="card-cost" style="color:${canAfford?'#ffd700':'#ff6060'}">
        ${item.currency==="Void Coins"?"💜 "+item.cost+" Void Coins (have: "+(S.owned_items["Void Coin"]||0)+")":item.currency==="Dark Points"?"⚫ "+item.cost+" Dark Points":"🪙 "+item.cost.toLocaleString()+" Coins"}
      </div>
      <button style="margin-top:8px;width:100%;padding:6px;background:${canAfford?"rgba(255,180,0,0.2)":"rgba(255,255,255,0.04)"};border:1px solid ${canAfford?"rgba(255,180,0,0.4)":"rgba(255,255,255,0.1)"};border-radius:6px;color:${canAfford?"#ffcc60":"#555"};font-family:inherit;font-size:10px;cursor:pointer;">${canAfford?"BUY":"CAN'T AFFORD"}</button>
    `;
    card.querySelector("button").onclick=(e)=>{
      e.stopPropagation();
      if(!canAfford){
        if(item.currency==="Void Coins") toast("❌ Need "+item.cost+" Void Coins! (buy from Mari)");
        else if(item.currency==="Dark Points") toast("❌ Need "+item.cost+" Dark Points!");
        else toast("❌ Not enough coins!");
        return;
      }
      if(item.currency==="Dark Points") S.owned_items["Dark Points"]=(S.owned_items["Dark Points"]||0)-item.cost;
      else if(item.currency==="Void Coins") S.owned_items["Void Coin"]-=item.cost;
      else S.coins-=item.cost;
      item.action();
      toast(`✅ Bought: ${item.name}`);
      updateHUD();save();openMerchant();
    };
    c.appendChild(card);
  });

  // dark point exchange for Jester
  if(activeMerchant==="Jester"){
    const exBtn=document.createElement("div");
    exBtn.style.cssText="grid-column:1/-1;padding:10px;background:rgba(200,60,255,0.08);border:1px solid rgba(200,60,255,0.3);border-radius:8px;font-size:10px;color:#cc44ff;cursor:pointer;text-align:center;";
    const BIOME_ITEM_DP={"Wind Essence":1,"Icicle":1,"Rainy Bottle":1,"Piece of Star":3,"Eternal Flame":13,"Curruptaine":10,"NULL":20};
    exBtn.innerHTML="🔮 Exchange items for Dark Points<br/><span style='color:#888;font-size:9px'>10 Lucky Potions=100DP · Void Coin=500DP · Biome items=1-20DP each</span>";
    exBtn.onclick=()=>{
      const lp=S.owned_items["Lucky Potion"]||0;
      const vc=S.owned_items["Void Coin"]||0;
      // Check biome items first
      let biomeGain=0;
      Object.entries(BIOME_ITEM_DP).forEach(([item,dp])=>{
        const qty=S.owned_items[item]||0;
        if(qty>0){biomeGain+=qty*dp;S.owned_items[item]=0;}
      });
      if(biomeGain>0){
        S.owned_items["Dark Points"]=(S.owned_items["Dark Points"]||0)+biomeGain;
        toast("+"+biomeGain+" Dark Points from biome items!");
      } else if(lp>=10){
        S.owned_items["Lucky Potion"]-=10;
        S.owned_items["Dark Points"]=(S.owned_items["Dark Points"]||0)+100;
        toast("+100 Dark Points!");
      } else if(vc>=1){
        S.owned_items["Void Coin"]--;
        S.owned_items["Dark Points"]=(S.owned_items["Dark Points"]||0)+500;
        toast("+500 Dark Points from Void Coin!");
      } else {
        toast("❌ No Lucky Potions, Void Coins or biome items to exchange");return;
      }
      updateHUD();save();openMerchant();
    };
    c.appendChild(exBtn);
  }

  document.getElementById("overlay").classList.add("open");
}
