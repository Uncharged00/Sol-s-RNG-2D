// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ui.js — All overlay screens: crafting, inventory, collection, settings, events
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  HUD + AURA DISPLAY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function updateHUD(){
  document.getElementById("hud-coins").textContent=S.coins.toLocaleString();
  document.getElementById("hud-rolls").textContent=S.rolls.toLocaleString();
  const spd=calcSpeedBonus();
  document.getElementById("hud-luck").textContent=calcLuck()+"%"+(spd?` +${Math.round(spd)}⚡`:"");
}

function updateAuraDisplay(){
  if(!S.lastAura)return;
  const {name,chance,col,glow,tier,isBonus}=S.lastAura;
  const nameEl=document.getElementById("aura-name");
  const tierEl=document.getElementById("aura-tier");
  const subEl=document.getElementById("aura-sub");
  const bonEl=document.getElementById("bonus-tag");
  nameEl.textContent=name;
  nameEl.style.color=rgb(glow);
  nameEl.style.textShadow=`0 0 20px ${rgb(col)},0 0 40px ${rgb(glow)}`;
  tierEl.textContent=TIER_NAMES[tier];
  tierEl.style.color=TIER_COLS[tier];
  const isCraftOnly=(name==="Eclipse"||name==="Atlas : A.T.L.A.S.");
  subEl.textContent=(S.lastAura.crafted||isCraftOnly)?"[ Crafted aura ]":`1 in ${chance.toLocaleString()}`;
  tierEl.style.display=isCraftOnly?"none":"";
  bonEl.style.opacity=isBonus?"1":"0";
  // Keep equipped badge in sync - it shows equipped_aura not lastAura
  updateEquippedBadge();
}

function updateBiomeBar(){
  const b=BIOMES[S.biomeIdx];
  const bar=document.getElementById("biome-bar");
  bar.textContent=`${b.emoji} ${b.name}${S.biomeTimer>0?` · ${Math.ceil(S.biomeTimer)}s`:""}`;
  bar.style.color=rgb(b.color);
  bar.style.borderColor=rgba(b.color,0.4);
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CRAFTING RECIPES  (wiki-accurate)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const GEAR_RECIPES=[
  {gear:"Gear Basing",desc:"Base crafting component",hand:"item",
   ingredients:[{name:"Common",qty:1},{name:"Uncommon",qty:1},{name:"Good",qty:1},{name:"Rare",qty:1}]},
  {gear:"Luck Glove",desc:"+25% Luck",hand:"R",
   ingredients:[{name:"Gear Basing",qty:1},{name:"Crystallized",qty:1},{name:"Divinus",qty:1},{name:"Rare",qty:3}]},
  {gear:"Solar Device",desc:"+50% Luck +15% Speed",hand:"R",
   ingredients:[{name:"Gear Basing",qty:1},{name:"Solar",qty:1},{name:"Divinus",qty:1},{name:"Rare",qty:1}]},
  {gear:"Lunar Device",desc:"+25% Speed",hand:"R",
   ingredients:[{name:"Gear Basing",qty:1},{name:"Lunar",qty:1},{name:"Divinus",qty:1},{name:"Rare",qty:1}]},
  {gear:"Eclipse Device",desc:"+50% Luck +15% Speed",hand:"R",
   ingredients:[{name:"Eclipse",qty:1},{name:"Solar Device",qty:1},{name:"Lunar Device",qty:1}]},
  {gear:"Exo Gauntlet",desc:"+100% Luck +20% Speed",hand:"R",
   ingredients:[{name:"Gear Basing",qty:3},{name:"Gilded",qty:5},{name:"Precious",qty:2},{name:"Magnetic",qty:2},{name:"Sidereum",qty:1},{name:"Undead",qty:1},{name:"Exotic",qty:1}]},
  {gear:"Jackpot Gauntlet",desc:"+77% Luck +7% Speed +coins",hand:"R",
   ingredients:[{name:"Gear Basing",qty:7},{name:"Jackpot",qty:77},{name:"Gilded",qty:77},{name:"Rare",qty:777}]},
  {gear:"Windstorm Device",desc:"+115% Luck +25% Speed",hand:"R",
   ingredients:[{name:"Gear Basing",qty:5},{name:"Wind",qty:25},{name:"Stormal",qty:1},{name:"Aquatic",qty:1},{name:"Sidereum",qty:4},{name:"Precious",qty:12}]},
  {gear:"Subzero Device",desc:"+150% Luck +30% Speed",hand:"R",
   ingredients:[{name:"Gear Basing",qty:5},{name:"Permafrost",qty:2},{name:"Crystallized",qty:600},{name:"Aquatic",qty:2},{name:"Glacier",qty:60},{name:"Sidereum",qty:10},{name:"Magnetic",qty:20},{name:"Precious",qty:40}]},
  {gear:"Galactic Device",desc:"+250% Luck +30% Speed",hand:"R",
   ingredients:[{name:"Galaxy",qty:1},{name:"Sapphire",qty:100},{name:"Solar",qty:15},{name:"Magnetic",qty:62},{name:"Comet",qty:3},{name:"Gear Basing",qty:25},{name:"Diaboli",qty:80},{name:"Eclipse Device",qty:1},{name:"Lunar",qty:15}]},
  {gear:"Volcanic Device",desc:"+290% Luck +35% Speed",hand:"R",
   ingredients:[{name:"Hades",qty:1},{name:"Rage: Heated",qty:10},{name:"Diaboli",qty:140},{name:"Rage",qty:1000},{name:"Bleeding",qty:55},{name:"Gear Basing",qty:6},{name:"Solar Device",qty:1},{name:"Windstorm Device",qty:1}]},
  {gear:"Genesis Drive",desc:"+1000% Luck +80% Speed",hand:"R",
   ingredients:[{name:"GENESIS",qty:1},{name:"Galactic Device",qty:1},{name:"Volcanic Device",qty:1},{name:"Powered",qty:100},{name:"Exotic",qty:50}]},
  {gear:"Jackpot Gauntlet (L)",desc:"Bonus Roll: ×60 Luck",hand:"L",
   ingredients:[{name:"Gear Basing",qty:7},{name:"Jackpot",qty:77},{name:"Gilded",qty:77},{name:"Rare",qty:777}]},
  {gear:"Gemstone Gauntlet",desc:"+80% Luck (random each roll)",hand:"L",
   ingredients:[{name:"Gear Basing",qty:3},{name:"Sapphire",qty:5},{name:"Aquamarine",qty:5},{name:"Topaz",qty:5},{name:"Ruby",qty:3}]},
  {gear:"Tide Gauntlet",desc:"+50% Luck, every 6th = Rainy",hand:"L",
   ingredients:[{name:"Gear Basing",qty:3},{name:"Aquatic",qty:2},{name:"Nautilus",qty:1},{name:"Aquamarine",qty:10}]},
  {gear:"Flesh Device",desc:"Every roll is a Bonus Roll (×1.3)",hand:"L",
   ingredients:[{name:"Gear Basing",qty:5},{name:"Bleeding",qty:20},{name:"Undead",qty:5},{name:"Undead: Devil",qty:1},{name:"Diaboli",qty:30}]},
  {gear:"Blessed Tide Gauntlet",desc:"+120% Luck, every 6th = Starfall",hand:"L",
   ingredients:[{name:"Gear Basing",qty:5},{name:"Starlight",qty:3},{name:"Aquatic",qty:5},{name:"Tide Gauntlet",qty:1},{name:"Aquamarine",qty:30}]},
  {gear:"Gravitational Device",desc:"Bonus Roll Multiplier: ×6",hand:"L",
   ingredients:[{name:"Gravitational",qty:1},{name:"Bounded",qty:3},{name:"Exotic",qty:5},{name:"Magnetic",qty:75},{name:"Diaboli",qty:152},{name:"Gear Basing",qty:15},{name:"Sidereum",qty:31},{name:"Nautilus",qty:5},{name:"Precious",qty:152}]},
  // ── Tier 9 additions ──
  {gear:"Heavenly Device",desc:"+1500% Luck, +120% Speed",hand:"R",
   ingredients:[{name:"Neuralyzer",qty:1},{name:"Genesis Drive",qty:1},{name:"ASCENDANT",qty:1},{name:"Precious",qty:200},{name:"Gear Basing",qty:50}]},
  {gear:"Pole Light Core Device",desc:"+500% Luck, every 30th roll = Polar Shift",hand:"L",
   ingredients:[{name:"Borealis",qty:3},{name:"Starshaper",qty:1},{name:"Gravitational Device",qty:1},{name:"Neuralyzer",qty:1},{name:"Gear Basing",qty:30}]},
];

const POTION_RECIPES=[
  // ── Speed/Haste ──────────────────────────────────────────────────
  {name:"Haste Potion I",  speed_add:20,dur:300, color:[80,220,80], desc:"+20% Roll Speed · 5 min",
   ingredients:[{name:"Speed Potion",qty:10}]},
  {name:"Haste Potion II", speed_add:25,dur:300, color:[60,255,60], desc:"+25% Roll Speed · 5 min",
   ingredients:[{name:"Speed Potion",qty:25},{name:"Haste Potion I",qty:1}]},
  {name:"Haste Potion III",speed_add:30,dur:300, color:[0,255,80],  desc:"+30% Roll Speed · 5 min",
   ingredients:[{name:"Speed Potion",qty:50},{name:"Haste Potion II",qty:1}]},
  {name:"Rage Potion",     speed_add:35,dur:600, color:[220,40,40],  desc:"+35% Roll Speed · 10 min",
   ingredients:[{name:"Diaboli",qty:1},{name:"Rage",qty:5},{name:"Speed Potion",qty:10}]},
  {name:"Diver Potion",    speed_add:40,dur:600, color:[0,160,220],  desc:"+40% Roll Speed · 10 min",
   ingredients:[{name:"Nautilus",qty:1},{name:"Speed Potion",qty:20}]},
  // ── Luck ────────────────────────────────────────────────────────
  {name:"Fortune I",  luck_add:150,dur:300, color:[200,200,80],  desc:"+150% Luck · 5 min",
   ingredients:[{name:"Lucky Potion",qty:5},{name:"Uncommon",qty:1},{name:"Rare",qty:5},{name:"Gilded",qty:1}]},
  {name:"Fortune II", luck_add:200,dur:420, color:[220,220,100], desc:"+200% Luck · 7 min",
   ingredients:[{name:"Lucky Potion",qty:10},{name:"Fortune I",qty:1},{name:"Uncommon",qty:5},{name:"Rare",qty:10},{name:"Gilded",qty:2}]},
  {name:"Fortune III",luck_add:250,dur:600, color:[255,255,120], desc:"+250% Luck · 10 min",
   ingredients:[{name:"Lucky Potion",qty:20},{name:"Fortune II",qty:1},{name:"Uncommon",qty:10},{name:"Rare",qty:15},{name:"Gilded",qty:5}]},
  // ── Godly Potions ────────────────────────────────────────────────
  {name:"Godly Potion (Zeus)",    luck_add:200, speed_add:30, dur:14400, color:[255,220,50],  desc:"+200% Luck +30% Speed · 4 hrs",
   ingredients:[{name:"Zeus",qty:1},{name:"Lucky Potion",qty:150},{name:"Speed Potion",qty:20}]},
  {name:"Godly Potion (Poseidon)",luck_add:-50, speed_add:75, dur:14400, color:[0,180,255],   desc:"-50% Luck +75% Speed · 4 hrs",
   ingredients:[{name:"Poseidon",qty:1},{name:"Lucky Potion",qty:150},{name:"Speed Potion",qty:20}]},
  {name:"Godly Potion (Hades)",   luck_add:300, speed_add:-10,dur:14400, color:[160,0,60],    desc:"+300% Luck -10% Speed · 4 hrs",
   ingredients:[{name:"Hades",qty:1},{name:"Lucky Potion",qty:150},{name:"Speed Potion",qty:20}]},
  // ── Heavenly (current: only 1 Heavenly Potion exists) ────────────
  {name:"Heavenly Potion",luck_add:15000000,dur:1,color:[255,240,160],desc:"+15,000,000% Luck · 1 roll",
   ingredients:[{name:"Celestial",qty:2},{name:"Exotic",qty:1},{name:"Quartz",qty:5},{name:"Lucky Potion",qty:250},{name:"Powered",qty:2}]},
  // ── Bounded ─────────────────────────────────────────────────────
  {name:"Potion of Bound",luck_add:5000000,dur:1,color:[100,0,200],desc:"+5,000,000% Luck · 1 roll",
   ingredients:[{name:"Bounded",qty:1},{name:"Permafrost",qty:3},{name:"Lucky Potion",qty:100}]},
  // ── Godlike ─────────────────────────────────────────────────────
  {name:"Godlike Potion",luck_add:40000000,dur:1,color:[255,100,255],desc:"+40,000,000% Luck · 1 roll",
   ingredients:[{name:"Godly Potion (Zeus)",qty:1},{name:"Godly Potion (Poseidon)",qty:1},{name:"Godly Potion (Hades)",qty:1},{name:"Lucky Potion",qty:225},{name:"Speed Potion",qty:75}]},
  // ── Warp ────────────────────────────────────────────────────────
  {name:"Warp Potion",speed_add:1000,rolls:2000,dur:0,color:[0,255,200],desc:"+1000% Roll Speed · 2000 rolls",
   ingredients:[{name:"Arcane",qty:1},{name:"Comet",qty:5}]},
  // ── Biome tools ─────────────────────────────────────────────────
  {name:"Strange Controller",isItem:true,desc:"Force a random biome",color:[200,100,255],
   ingredients:[{name:"NULL",qty:1},{name:"Eternal Flame",qty:1},{name:"Piece of Star",qty:1},{name:"Curruptaine",qty:1},{name:"Rainy Bottle",qty:1},{name:"Icicle",qty:1},{name:"Wind Essence",qty:1},{name:"Eternal flame",qty:1},{name:"Feather vial",qty:1},{name:"Hour Glass",qty:1}]},
  {name:"Biome Randomizer",isItem:true,desc:"Force a random biome (repeatable)",color:[255,180,0],
   ingredients:[{name:"Strange Controller",qty:5}]},
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  UTIL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const rgb=c=>`rgb(${c[0]},${c[1]},${c[2]})`;
const rgba=(c,a)=>`rgba(${c[0]},${c[1]},${c[2]},${a})`;
const rnd=()=>Math.random();
const TIER_NAMES=["Basic","Epic","Unique","Legendary","Mythic","Exalted","Glorious","Transcendent"];
const TIER_COLS=["#aaa","#b070ff","#00e5ff","#ffd700","#ff70ff","#ff5050","#ffff40","#ffffff"];
function auraTier(c){return c<1000?0:c<10000?1:c<100000?2:c<1000000?3:c<10000000?4:c<100000000?5:c<1000000000?6:7;}

let toastTimer;
function toast(msg,dur=2600){
  const el=document.getElementById("toast");
  el.textContent=msg;el.style.opacity="1";
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>{el.style.opacity="0";},dur);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  STATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const S={
  coins:0, rolls:0,
  biomeIdx:0, biomeTimer:0,
  rollCooldown:0, rollInterval:60,
  particles:[],
  lastAura:null,
  autoRoll:true,
  bonusRollCtr:0,
  owned_auras:{},
  owned_items:{},        // lucky potions, gear basings, crafted potions
  owned_talismans:[],     // names of owned talismans
  equipped_talisman:null, // name of equipped talisman
  talisman_stacks:0,      // for stacking talismans
  equipped_aura:null,
  equipped_R:null, equipped_L:null,
  owned_gears:{},
  active_potions:[],
  isDay:true,
  dayNightTimer:150,
  companions:[],        // owned cosmetic companions
  chatMinChance:1,      // show in roll chat only if chance >= this value (default: all)
  equipped_companion:null,
  roulette_tickets:0,   // item roulette tickets
  // settings
  autoDelete:[],         // aura names to auto-delete
  autoEquip:null,        // aura name to auto-equip when rolled
  // collection
  collection:{},         // aura name -> {count, unlocked}
};

function save(){
  try{localStorage.setItem("sols2d",JSON.stringify({
    coins:S.coins,rolls:S.rolls,owned_auras:S.owned_auras,active_potions:S.active_potions||[],isDay:S.isDay,dayNightTimer:S.dayNightTimer||150,companions:S.companions||[],chatMinChance:S.chatMinChance||1000,equipped_companion:S.equipped_companion,roulette_tickets:S.roulette_tickets||0,
    owned_items:S.owned_items||{},
    owned_gears:S.owned_gears,equipped_R:S.equipped_R,equipped_L:S.equipped_L,
    equipped_aura:S.equipped_aura,
    autoDelete:S.autoDelete||[],autoEquip:S.autoEquip||null,
    collection:S.collection||{},
    owned_talismans:S.owned_talismans||[],
    equipped_talisman:S.equipped_talisman||null,
    talisman_stacks:S.talisman_stacks||0
  }));}catch(e){}
}
function load(){
  try{
    const d=JSON.parse(localStorage.getItem("sols2d")||"{}");
    if(d.coins!==undefined){
      Object.assign(S,{coins:d.coins,rolls:d.rolls||0,active_potions:(d.active_potions||[]).map(p=>{
        // Migrate old timer-based Warp/Transcendent to roll-based
        if(p.name==="Warp Potion"&&p.rollsLeft===undefined) return {...p,rollsLeft:2000,dur:999999999,timer:999999999};
        if(p.name==="Transcendent Potion"&&p.rollsLeft===undefined) return {...p,rollsLeft:20000,dur:999999999,timer:999999999};
        return p;
      }),isDay:d.isDay!==undefined?d.isDay:true,dayNightTimer:d.dayNightTimer||150,companions:d.companions||[],chatMinChance:d.chatMinChance||1000,equipped_companion:d.equipped_companion||null,roulette_tickets:d.roulette_tickets||0,
        owned_auras:d.owned_auras||{},owned_gears:d.owned_gears||{},
        owned_items:d.owned_items||{},
        equipped_R:d.equipped_R||null,equipped_L:d.equipped_L||null,
        equipped_aura:d.equipped_aura||null,
        autoDelete:d.autoDelete||[],autoEquip:d.autoEquip||null,
        collection:d.collection||{},
        owned_talismans:d.owned_talismans||[],
        equipped_talisman:d.equipped_talisman||null,
        talisman_stacks:d.talisman_stacks||0});
    }
  }catch(e){}
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CANVAS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const bgC=document.getElementById("bg-canvas");
const bgX=bgC.getContext("2d");
function resize(){bgC.width=window.innerWidth;bgC.height=window.innerHeight;}
resize();window.addEventListener("resize",resize);

// Stars
const STARS=Array.from({length:80},()=>({x:rnd(),y:rnd(),r:rnd()*1.4+0.2,s:rnd()*0.8+0.2}));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  PARTICLES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class P{
  constructor(x,y,col,sz,vx,vy,life,glow=true){
    this.x=x;this.y=y;this.col=col;this.sz=sz;this.osZ=sz;
    this.vx=vx??(rnd()-0.5)*6;this.vy=vy??(rnd()*-5-0.5);
    this.life=life;this.max=life;this.glow=glow;
  }
  tick(){this.x+=this.vx;this.y+=this.vy;this.vy+=0.13;this.life--;this.sz=Math.max(0,this.osZ*(this.life/this.max));}
  draw(ctx){
    if(this.life<=0||this.sz<0.5)return;
    const a=this.life/this.max;const s=this.sz;
    if(this.glow){
      const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,s*3.5);
      g.addColorStop(0,rgba(this.col,a));g.addColorStop(0.5,rgba(this.col,a*0.4));g.addColorStop(1,rgba(this.col,0));
      ctx.beginPath();ctx.arc(this.x,this.y,s*3.5,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
    }
    ctx.beginPath();ctx.arc(this.x,this.y,Math.max(1,s),0,Math.PI*2);
    ctx.fillStyle=rgba(this.col,a);ctx.fill();
  }
}

function spawnParticles(col,glow,tier){
  const cx=bgC.width/2,cy=bgC.height*0.45;
  const n=[3,7,12,18,28,45,70,100][Math.min(tier,7)];
  for(let i=0;i<n;i++){
    const a=rnd()*Math.PI*2,sp=rnd()*4+1+tier*0.6;
    S.particles.push(new P(cx,cy,rnd()<0.5?col:glow,
      rnd()*5+2+tier*0.6,
      Math.cos(a)*sp,Math.sin(a)*sp-2,
      45+rnd()*45+tier*18));
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  LUCK / SPEED CALC
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function calcLuck(){
  let base=100;
  if(S.equipped_R){const g=GEARS.find(x=>x&&x.name===S.equipped_R);if(g)base+=g.luck_add||0;}
  // Talisman
  if(S.equipped_talisman){
    const tal=TALISMANS.find(t=>t.name===S.equipped_talisman);
    if(tal){
      if(tal.effectDynamic) base+=tal.effectDynamic(S.talisman_stacks||0);
      else base+=tal.luck_add||0;
    }
  }
  // Regular timed potions: additive
  let mult=1;
  S.active_potions.forEach(p=>{
    if(!p.luck_add) return;
    // One-roll ultra potions (Heavenly, Godlike, Oblivion, Bounded) multiply instead of add
    if(p.isRoll && p.luck_add>=1000000){
      mult*=(1+p.luck_add/100); // e.g. 15,000,000% = ×150,001 multiplier
    } else {
      base+=p.luck_add;
    }
  });
  return Math.round(base*mult);
}
function calcSpeedBonus(){
  // Returns total speed reduction % (positive = faster)
  let spd=0;
  if(S.equipped_R){const g=GEARS.find(x=>x&&x.name===S.equipped_R);if(g)spd+=g.speed_add||0;}
  S.active_potions.forEach(p=>{ if(p.speed_add) spd+=p.speed_add; });
  return spd;
}
function calcSpeed(){
  // Returns cooldown in MILLISECONDS
  let base=1000;
  const spd=calcSpeedBonus();
  base*=(1-Math.min(0.9,spd/100)); // cap at 90% reduction
  return Math.max(100,Math.round(base));
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ROLL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function doRoll(){
  const luck=calcLuck();
  const biome=BIOMES[S.biomeIdx];
  S.rolls++;S.bonusRollCtr++;

  // bonus roll
  let bonusMult=2;
  if(S.equipped_L==="Jackpot Gauntlet (L)")bonusMult=2;
  else if(S.equipped_L==="Gravitational Device")bonusMult=6;
  else if(S.equipped_L==="Flesh Device")bonusMult=1.3;
  else if(S.equipped_L==="Blessed Tide Gauntlet")bonusMult=2;
  const fleshActive=S.equipped_L==="Flesh Device";
  // Tide/Blessed Tide: every 6th roll triggers a biome boost
  if((S.equipped_L==="Tide Gauntlet"||S.equipped_L==="Blessed Tide Gauntlet")&&S.bonusRollCtr%6===0){
    const targetBiome=S.equipped_L==="Blessed Tide Gauntlet"?"Starfall":"Rainy";
    const bi=BIOMES.findIndex(b=>b.name===targetBiome);
    if(bi>0){S.biomeIdx=bi;S.biomeTimer=5;updateBiomeBar();toast(`🌊 Tide triggered: ${targetBiome}!`);}
  }
  // Gemstone: random luck bonus each roll
  let gemBonus=0;
  if(S.equipped_L==="Gemstone Gauntlet") gemBonus=Math.floor(rnd()*160);
  const isBonus=fleshActive||(S.bonusRollCtr%10===0);
  const effLuck=(luck+gemBonus)*(isBonus?bonusMult:1);

  // coin mult
  let coinMult=1;
  [S.equipped_R,S.equipped_L].forEach(n=>{if(!n)return;const g=GEARS.find(x=>x&&x.name===n);if(g&&g.coin_mult)coinMult=Math.max(coinMult,g.coin_mult);});

  // eligible auras — biome exclusive auras get weight boosted by biome.mult
  const biomeMult=BIOMES[S.biomeIdx].mult;
  const elig=AURAS.filter(a=>!a[4]||a[4]===biome.name);
  const weights=elig.map(a=>{
    const base=(effLuck/100)/a[1];
    let w=(a[4]&&a[4]===biome.name)?base*biomeMult:base;
    if(a[0]==="Solar"&&S.isDay) w*=10;
    if(a[0]==="Lunar"&&!S.isDay) w*=10;
    return w;
  });
  const total=weights.reduce((s,w)=>s+w,0);
  let r=rnd()*total,picked=elig[0];
  for(let i=0;i<elig.length;i++){r-=weights[i];if(r<=0){picked=elig[i];break;}}

  const [name,chance,col,glow,_]=picked;
  const tier=auraTier(chance);
  const baseCoins=Math.max(10,Math.floor(Math.log10(chance+1)*10));
  S.coins+=Math.round(baseCoins*coinMult);
  // Consume roll-type potions + decrement roll-based ones (Warp, Transcendent)
  S.active_potions=S.active_potions.filter(p=>{
    if(p.isRoll) return false; // single-roll potions consumed
    if(p.rollsLeft!==undefined){
      p.rollsLeft--;
      if(p.rollsLeft<=0) return false; // expired
    }
    return true;
  });

  // Collection unlock
  if(!S.collection[name]) S.collection[name]={count:0,unlocked:true};
  S.collection[name].count=(S.collection[name].count||0)+1;

  // Auto-delete check
  if(S.autoDelete.includes(name)){
    if(!document.hidden) addChatEntry(name,chance,col,glow,tier); // still show in chat
    updateHUD();save();return;
  }

  S.owned_auras[name]=(S.owned_auras[name]||0)+1;
  S.lastAura={name,chance,col,glow,tier,isBonus};

  // Auto-equip check
  if(S.autoEquip===name){
    S.equipped_aura=name;
    updateEquippedBadge();
    updateMusic();
    updateMusic();
  }

  // Random lucky potion drop (~1% chance)
  if(rnd()<0.01){
    S.owned_items["Lucky Potion"]=(S.owned_items["Lucky Potion"]||0)+1;
    toast("🍀 Lucky Potion found!");
  }
  // Roulette ticket drop — base 1/10000, scales with luck
  if(rnd()<(0.0005*(Math.max(100,calcLuck())/100))){
    S.roulette_tickets++;
    toast("🎟️ Item Roulette Ticket found! ("+S.roulette_tickets+" total)",3000);
  }

  spawnParticles(col,glow,tier);
  if(!document.hidden) addChatEntry(name,chance,col,glow,tier);

  // Cutscene thresholds: 10k+ gets one; tier 3+ (Legendary) gets full cutscene
  if(name==="Eclipse"||name==="Atlas : A.T.L.A.S."){
    updateAuraDisplay(); // craft-only auras — no cutscene, handled by craft flow
  } else if(tier>=4) playCutscene(picked,tier);            // Mythic+ (1M+) = full cutscene
  else if(chance>=100000) playStarCutscene(picked,tier);   // Legendary (100k-999k) = 8-pt star
  else if(chance>=10000) playStarCutscene(picked,tier);    // Unique (10k-99k) = 4-pt star
  else updateAuraDisplay();

  tickMerchant();
  updateHUD();save();
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  SETTINGS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function openSettings(){
  document.getElementById("overlay-title").textContent="SETTINGS";
  document.getElementById("tab-bar").innerHTML="";
  const c=document.getElementById("overlay-content");
  c.className="";c.style.cssText="padding:4px;display:flex;flex-direction:column;gap:10px;";
  c.innerHTML="";

  // Auto-Equip
  const aeSection=document.createElement("div");
  aeSection.style.cssText="background:rgba(255,255,255,0.04);border-radius:10px;padding:12px;border:1px solid rgba(255,255,255,0.1);";
  aeSection.innerHTML=`
    <div style="font-size:12px;color:#ffd700;letter-spacing:2px;margin-bottom:8px">⚡ AUTO-EQUIP</div>
    <div style="font-size:10px;color:#666;margin-bottom:10px">Auto-equip a specific aura whenever you roll it.</div>
    <div style="font-size:11px;color:#aaa;margin-bottom:6px">Currently: <span style="color:#60e880">${S.autoEquip||"None"}</span></div>
  `;
  // aura selector for auto-equip
  const select=document.createElement("select");
  select.style.cssText="width:100%;padding:8px;background:#0a0a1a;color:#fff;border:1px solid rgba(255,255,255,0.2);border-radius:6px;font-family:'Courier New',monospace;font-size:11px;";
  const noneOpt=document.createElement("option");noneOpt.value="";noneOpt.textContent="— None —";
  select.appendChild(noneOpt);
  AURAS.forEach(a=>{
    const o=document.createElement("option");o.value=a[0];o.textContent=`${a[0]} (1 in ${a[1].toLocaleString()})`;
    if(S.autoEquip===a[0]) o.selected=true;
    select.appendChild(o);
  });
  select.onchange=()=>{S.autoEquip=select.value||null;save();toast(`Auto-equip: ${S.autoEquip||"off"}`);};
  aeSection.appendChild(select);
  c.appendChild(aeSection);

  // Auto-Delete
  const adSection=document.createElement("div");
  adSection.style.cssText="background:rgba(255,255,255,0.04);border-radius:10px;padding:12px;border:1px solid rgba(255,255,255,0.1);";
  adSection.innerHTML=`
    <div style="font-size:12px;color:#ff6060;letter-spacing:2px;margin-bottom:8px">🗑️ AUTO-DELETE</div>
    <div style="font-size:10px;color:#666;margin-bottom:10px">Auras checked below will be silently discarded when rolled (they still count in collection).</div>
    <div id="ad-list" style="display:flex;flex-direction:column;gap:4px;max-height:200px;overflow-y:auto;"></div>
  `;
  c.appendChild(adSection);
  // Populate auto-delete list
  const adList=adSection.querySelector("#ad-list");
  AURAS.forEach(a=>{
    const row=document.createElement("label");
    row.style.cssText="display:flex;align-items:center;gap:8px;font-size:10px;color:#888;padding:3px 0;cursor:pointer;";
    const cb=document.createElement("input");cb.type="checkbox";
    cb.checked=S.autoDelete.includes(a[0]);
    cb.onchange=()=>{
      if(cb.checked){if(!S.autoDelete.includes(a[0]))S.autoDelete.push(a[0]);}
      else{S.autoDelete=S.autoDelete.filter(x=>x!==a[0]);}
      save();
    };
    row.appendChild(cb);
    const txt=document.createElement("span");txt.textContent=`${a[0]} (1 in ${a[1].toLocaleString()})`;
    if(S.autoDelete.includes(a[0])) txt.style.color="#ff6060";
    row.appendChild(txt);
    adList.appendChild(row);
  });

  // Music toggle
  const musSection=document.createElement("div");
  musSection.style.cssText="background:rgba(255,255,255,0.04);border-radius:10px;padding:12px;border:1px solid rgba(255,255,255,0.1);";
  musSection.innerHTML=`
    <div style="font-size:12px;color:#a080ff;letter-spacing:2px;margin-bottom:8px">🎵 MUSIC</div>
    <button id="music-toggle-btn" style="width:100%;padding:10px;background:rgba(160,128,255,0.15);border:1px solid rgba(160,128,255,0.3);border-radius:8px;color:#a080ff;font-family:'Courier New',monospace;font-size:12px;cursor:pointer;">
      ${musicEnabled?"🎵 Music ON — tap to mute":"🔇 Music OFF — tap to unmute"}
    </button>
  `;
  c.appendChild(musSection);
  musSection.querySelector("#music-toggle-btn").onclick=()=>{
    musicEnabled=!musicEnabled;
    document.getElementById("music-btn").textContent=musicEnabled?"🎵":"🔇";
    document.getElementById("music-btn").style.opacity=musicEnabled?"1":"0.5";
    if(musicEnabled) updateMusic(); else stopMusic(0.8);
    openSettings();
  };

  // ── Account / Cloud Save ──
  const authSection=document.createElement("div");
  authSection.style.cssText="padding:12px;background:rgba(0,200,100,0.05);border-radius:10px;border:1px solid rgba(0,200,100,0.15);";
  authSection.innerHTML="<div style='font-size:10px;color:#888;letter-spacing:2px;margin-bottom:8px'>☁️ ACCOUNT & CLOUD SAVE</div>"+
    "<div id='auth-status'><div style='color:#555;font-size:10px'>Loading...</div></div>";
  c.appendChild(authSection);
  updateAuthUI();

  // Chat threshold setting
  const chatSection=document.createElement("div");
  chatSection.style.cssText="padding:12px;background:rgba(255,255,255,0.03);border-radius:10px;border:1px solid rgba(255,255,255,0.07);margin-top:8px;";
  const CHAT_OPTIONS=[
    {label:"All auras",val:1},
    {label:"Rare+ (1/100+)",val:100},
    {label:"Epic+ (1/1k+)",val:1000},
    {label:"Unique+ (1/10k+)",val:10000},
    {label:"Legendary+ (1/100k+)",val:100000},
    {label:"Mythic+ (1/1M+)",val:1000000},
    {label:"Off",val:999999999},
  ];
  chatSection.innerHTML="<div style='font-size:10px;color:#888;letter-spacing:2px;margin-bottom:8px'>ROLL CHAT</div>"+
    "<div style='font-size:10px;color:#555;margin-bottom:6px'>Show auras rolled in the live feed (bottom-left)</div>";
  const chatSel=document.createElement("select");
  chatSel.style.cssText="width:100%;background:rgba(0,0,20,0.8);color:#ccc;border:1px solid rgba(255,255,255,0.2);border-radius:6px;padding:6px;font-family:'Courier New',monospace;font-size:11px;";
  CHAT_OPTIONS.forEach(opt=>{
    const o=document.createElement("option");
    o.value=opt.val;o.textContent=opt.label;
    if(S.chatMinChance===opt.val) o.selected=true;
    chatSel.appendChild(o);
  });
  chatSel.onchange=()=>{S.chatMinChance=parseInt(chatSel.value);save();};
  chatSection.appendChild(chatSel);
  c.appendChild(chatSection);

  document.getElementById("overlay").classList.add("open");
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  COLLECTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  INVENTORY  (equip gear/talisman, use potions)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let invTab=0;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  USE POTION  (stacking logic)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function usePotion(rec){
  const isRoll=rec.dur<=1;
  const isRollBased=rec.rollsLeft!==undefined; // Warp/Transcendent
  const existing=S.active_potions.find(p=>p.name===rec.name);
  if(existing){
    if(isRoll) return toast(`❌ ${rec.name} is already active!`);
    if(isRollBased) existing.rollsLeft=(existing.rollsLeft||0)+rec.rollsLeft;
    else existing.timer+=rec.dur*1000;
    toast(`🧪 ${rec.name} extended!`);
  } else {
    const entry={
      name:rec.name,
      luck_add:rec.luck_add||0,
      speed_add:rec.speed_add||0,
      isRoll,
      timer:isRoll?999999:rec.dur*1000,
    };
    if(isRollBased) entry.rollsLeft=rec.rollsLeft; // carry over rollsLeft
    S.active_potions.push(entry);
    toast(`🧪 ${rec.name} active!`);
  }
  updateHUD();save();
}

function useItem(name){
  if(name==="Strange Controller"||name==="Biome Randomizer"){
    let bi;
    // 1/5000 chance to get Cyberspace (rare, controller-only)
    if(rnd()<1/5000){
      bi=BIOMES.findIndex(b=>b.name==="Cyberspace");
    } else {
      // Weighted pick from non-rare biomes with controllerWeight>0
      const pool=BIOMES.map((b,i)=>({i,w:b.controllerWeight||0})).filter(x=>x.w>0);
      const total=pool.reduce((s,x)=>s+x.w,0);
      let rv=rnd()*total; bi=pool[0].i;
      for(const x of pool){rv-=x.w;if(rv<=0){bi=x.i;break;}}
    }
    S.biomeIdx=bi; S.biomeTimer=BIOMES[bi].dur;
    updateBiomeBar();
    const b=BIOMES[bi];
    if(b.item){
      const qty=b.itemQty+(b.itemQty>1?Math.floor(rnd()*3):0);
      S.owned_items[b.item]=(S.owned_items[b.item]||0)+qty;
      toast(`${b.emoji} ${b.name}! Got ${qty}x ${b.item}!`);
    } else {
      toast(`${b.emoji} Forced biome: ${b.name}!`);
    }
    if(name==="Strange Controller"){
      S.owned_items["Strange Controller"]=(S.owned_items["Strange Controller"]||0)-1;
      if(S.owned_items["Strange Controller"]<=0) delete S.owned_items["Strange Controller"];
    }
    save(); updateHUD(); if(typeof renderInventoryTab==='function') renderInventoryTab();
  }
}

function openInventory2(){
  document.getElementById("overlay-title").textContent="INVENTORY";
  renderTabBar(["⚔️ Gears","🎒 Items","🔮 Talisman"],t=>{invTab=t;renderInventoryTab();});
  renderInventoryTab();
  document.getElementById("overlay").classList.add("open");
}

function renderInventoryTab(){
  const c=document.getElementById("overlay-content");
  c.className="grid"; c.style.cssText="";c.innerHTML="";

  if(invTab===0){
    // Gears — R slot and L slot
    const slots=[
      {label:"🤜 Right Hand",key:"equipped_R",hand:"R"},
      {label:"🤛 Left Hand", key:"equipped_L",hand:"L"},
    ];
    slots.forEach(slot=>{
      const banner=document.createElement("div");
      banner.style.cssText="grid-column:1/-1;padding:8px 10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;font-size:10px;";
      banner.innerHTML=`<span style="color:#888;letter-spacing:2px">${slot.label}: </span><span style="color:${S[slot.key]?"#60e880":"#444"}">${S[slot.key]||"Empty"}</span>`;
      c.appendChild(banner);

      const ownedGears=Object.keys(S.owned_gears).filter(n=>{
        const g=GEARS.find(x=>x&&x.name===n); return g&&g.hand===slot.hand;
      });
      if(!ownedGears.length){
        const empty=document.createElement("div");
        empty.style.cssText="font-size:10px;color:#444;padding:8px;grid-column:1/-1;";
        empty.textContent=`No ${slot.hand==="R"?"right":"left"}-hand gears crafted yet`;
        c.appendChild(empty);
      }
      ownedGears.forEach(gname=>{
        const gdef=GEARS.find(x=>x&&x.name===gname);
        const eq=S[slot.key]===gname;
        const card=document.createElement("div");card.className="card";
        card.style.borderColor=rgba(gdef?gdef.color:[200,200,200],eq?0.8:0.3);
        if(eq) card.style.background="rgba(60,200,60,0.07)";
        card.innerHTML=`
          ${eq?'<span class="owned-tag" style="background:rgba(60,200,60,0.2);color:#60ff60">EQ</span>':""}
          <div class="card-name" style="color:${gdef?rgb(gdef.color):"#aaa"}">${gname}</div>
          <div class="card-sub">${gdef?gdef.effect:""}</div>
          <button style="margin-top:6px;width:100%;padding:5px;background:${eq?"rgba(255,80,80,0.15)":"rgba(60,200,60,0.15)"};border:1px solid ${eq?"rgba(255,80,80,0.3)":"rgba(60,200,60,0.3)"};border-radius:5px;color:${eq?"#ff8080":"#60e880"};font-family:inherit;font-size:10px;cursor:pointer;">${eq?"Unequip":"Equip"}</button>
        `;
        card.querySelector("button").onclick=(e)=>{
          e.stopPropagation();
          if(eq) S[slot.key]=null;
          else S[slot.key]=gname;
          save();updateHUD();renderInventoryTab();
        };
        c.appendChild(card);
      });

      // Spacer between slots
      const sp=document.createElement("div");sp.style.cssText="grid-column:1/-1;height:4px;";c.appendChild(sp);
    });

  } else if(invTab===1){
    // ITEMS TAB — potions, tools, void coins, chests
    // Active potions banner
    if(S.active_potions.length>0){
      const abanner=document.createElement("div");
      abanner.style.cssText="grid-column:1/-1;padding:8px 10px;background:rgba(160,100,255,0.1);border:1px solid rgba(160,100,255,0.25);border-radius:8px;font-size:10px;margin-bottom:4px;";
      abanner.innerHTML="<b style='color:#c080ff'>ACTIVE:</b> "+
        S.active_potions.map(p=>{
          const rem=p.rollsLeft!==undefined?p.rollsLeft+" rolls":p.isRoll?"1 roll":Math.max(0,Math.ceil(p.timer/1000))+"s";
          return "<span style='color:#ddd'>"+p.name+"("+rem+")</span>";
        }).join(", ");
      c.appendChild(abanner);
    }
    // Chest BUY buttons (give box item, not instant open)
    const chestDiv=document.createElement("div");
    chestDiv.style.cssText="grid-column:1/-1;display:flex;gap:6px;margin-bottom:8px;";
    [["Normal Potion Chest",500,"#80c880","rgba(100,180,100,0.15)","rgba(100,180,100,0.3)"],
     ["Rare Potion Chest",2500,"#8080ff","rgba(80,80,220,0.15)","rgba(80,80,220,0.3)"],
     ["Mega Potion Chest",15000,"#ffaa40","rgba(200,100,0,0.15)","rgba(200,100,0,0.3)"]].forEach(function(arr){
      const key=arr[0],cost=arr[1],col=arr[2],bg=arr[3],brd=arr[4];
      const owned=S.owned_items[key]||0;
      const btn=document.createElement("button");
      btn.style.cssText="flex:1;padding:6px 3px;background:"+bg+";border:1px solid "+brd+";border-radius:8px;color:"+col+";font-family:'Courier New',monospace;font-size:9px;font-weight:bold;cursor:pointer;";
      btn.innerHTML="📦 Buy<br><span style='font-size:8px;opacity:0.7'>"+key.replace(" Potion Chest","")+"</span><br><span style='font-size:8px'>"+cost.toLocaleString()+"🪙"+(owned?" ("+owned+")":"")+"</span>";
      btn.onclick=function(){
        if(S.coins<cost){toast("❌ Need "+cost.toLocaleString()+" coins");return;}
        S.coins-=cost;
        S.owned_items[key]=(S.owned_items[key]||0)+1;
        save();updateHUD();renderInventoryTab();
        toast("📦 Got a "+key+"!");
      };
      chestDiv.appendChild(btn);
    });
    c.appendChild(chestDiv);

    // Usable item list
    var USABLE=[
      {key:"Lucky Potion",    col:[100,200,100],desc:"🍀 +100% Luck · 1 min"},
      {key:"Speed Potion",    col:[80,220,80],  desc:"⚡ +10% Speed · 1 min"},
      {key:"Haste Potion I",  col:[80,220,80],  desc:"🏃 +20% Speed · 5 min"},
      {key:"Haste Potion II", col:[60,255,60],  desc:"🏃 +25% Speed · 5 min"},
      {key:"Haste Potion III",col:[0,255,80],   desc:"🏃 +30% Speed · 5 min"},
      {key:"Rage Potion",     col:[220,40,40],  desc:"💢 +35% Speed · 10 min"},
      {key:"Diver Potion",    col:[0,160,220],  desc:"🤿 +40% Speed · 10 min"},
      {key:"Fortune I",       col:[200,200,80], desc:"🍀 +150% Luck · 5 min"},
      {key:"Fortune II",      col:[220,220,100],desc:"🍀 +200% Luck · 7 min"},
      {key:"Fortune III",     col:[255,255,120],desc:"🍀 +250% Luck · 10 min"},
      {key:"Fortune Spoid I", col:[200,220,80], desc:"✨ +50% Luck · 1 min"},
      {key:"Fortune Spoid II",col:[220,240,80], desc:"✨ +75% Luck · 1 min"},
      {key:"Fortune Spoid III",col:[255,255,80],desc:"✨ +100% Luck · 1 min"},
      {key:"Lucky Potion L",  col:[120,220,120],desc:"🍀 +100% Luck · 5 min"}, // Mari only
      {key:"Lucky Potion XL", col:[140,255,140],desc:"🍀 +100% Luck · 10 min"},
      {key:"Speed Potion L",  col:[100,240,100],desc:"⚡ +10% Speed · 5 min"},
      {key:"Speed Potion XL", col:[120,255,120],desc:"⚡ +10% Speed · 10 min"},
      {key:"Godly Potion (Zeus)",    col:[255,220,50], desc:"⚡ +200% Luck +30% Spd · 4h"},
      {key:"Godly Potion (Poseidon)",col:[0,180,255],  desc:"🔱 -50% Luck +75% Spd · 4h"},
      {key:"Godly Potion (Hades)",   col:[160,0,60],   desc:"💀 +300% Luck -10% Spd · 4h"},
      {key:"Potion of Bound", col:[100,0,200],  desc:"🔮 +5,000,000% Luck · 1 roll"},
      {key:"Heavenly Potion", col:[255,240,160],desc:"✨ +15,000,000% Luck · 1 roll"},
      {key:"Godlike Potion",  col:[255,100,255],desc:"👑 +40,000,000% Luck · 1 roll"},
      {key:"Oblivion Potion", col:[80,0,160],   desc:"🌑 +60,000,000% Luck · 1 roll"},
      {key:"Warp Potion",     col:[0,255,200],  desc:"⏩ +1000% Speed · 2000 rolls"},
      {key:"Transcendent Potion",col:[255,220,255],desc:"🌟 +1000% Speed · 20k rolls"},
      {key:"Strange Controller",col:[200,100,255],desc:"🎲 Force random biome"},
      {key:"Biome Randomizer",col:[255,180,0],  desc:"🎰 Force random biome with higher chance"},
      {key:"Void Coin",       col:[60,0,120],   desc:"💜 Jester currency"},
      {key:"Gear Basing",     col:[160,160,160],desc:"⚙️ Crafting component"},
      {key:"Normal Potion Chest",col:[100,180,100],desc:"📦 Open for random potions"},
      {key:"Rare Potion Chest",  col:[80,80,220], desc:"📦 Open for better potions"},
      {key:"Mega Potion Chest",  col:[200,100,0], desc:"📦 Open for the best potions"},
    ];

    var any=false;
    USABLE.forEach(function(item){
      var key=item.key,col=item.col,desc=item.desc;
      var qty=S.owned_items[key]||0; if(!qty) return; any=true;
      var card=document.createElement("div");card.className="card";
      card.style.borderColor=rgba(col,0.4);
      var isCurrency=(key==="Void Coin"||key==="Gear Basing");
      var isTool=(key==="Biome Randomizer"||key==="Strange Controller");
      var btnTxt=isCurrency?"(CURRENCY)":isTool?"USE (∞)":"USE";
      card.innerHTML="<div class='card-name' style='color:"+rgb(col)+"'>"+key+"</div>"+
        "<div class='card-sub'>"+desc+"</div>"+
        (!isTool?"<span class='aura-count'>×"+qty+"</span>":"")+
        (!isCurrency?"<button style='margin-top:6px;width:100%;padding:5px;background:rgba(255,200,0,0.15);border:1px solid rgba(255,200,0,0.3);border-radius:5px;color:#ffd700;font-family:inherit;font-size:10px;cursor:pointer;'>"+btnTxt+"</button>":"");
      if(!isCurrency){
        var btn=card.querySelector("button");
        if(btn) btn.onclick=function(e){
          e.stopPropagation();
          if(!isTool&&(S.owned_items[key]||0)<=0){toast("❌ None left!");return;}
          var r=POTION_RECIPES.find(function(p){return p.name===key;});
          if(key==="Strange Controller"||key==="Biome Randomizer"){useItem(key);}
          else if(key.includes("Potion Chest")){S.owned_items[key]--;var ct=key.replace(" Potion Chest","");openChest(ct);updateHUD();}
          else if(key==="Lucky Potion"){S.owned_items[key]--;usePotion({name:"Lucky Potion",luck_add:100,dur:60});}
          else if(key==="Speed Potion"){S.owned_items[key]--;usePotion({name:"Speed Potion",speed_add:10,dur:60});}
          else if(key==="Lucky Potion L"){S.owned_items[key]--;usePotion({name:"Lucky Potion L",luck_add:100,dur:300});}
          else if(key==="Lucky Potion XL"){S.owned_items[key]--;usePotion({name:"Lucky Potion XL",luck_add:100,dur:600});}
          else if(key==="Speed Potion L"){S.owned_items[key]--;usePotion({name:"Speed Potion L",speed_add:10,dur:300});}
          else if(key==="Speed Potion XL"){S.owned_items[key]--;usePotion({name:"Speed Potion XL",speed_add:10,dur:600});}
          else if(key==="Fortune Spoid I"){S.owned_items[key]--;usePotion({name:"Fortune Spoid I",luck_add:50,dur:60});}
          else if(key==="Fortune Spoid II"){S.owned_items[key]--;usePotion({name:"Fortune Spoid II",luck_add:75,dur:60});}
          else if(key==="Fortune Spoid III"){S.owned_items[key]--;usePotion({name:"Fortune Spoid III",luck_add:100,dur:60});}
          else if(key==="Warp Potion"){S.owned_items[key]--;usePotion({name:"Warp Potion",speed_add:1000,dur:999999999,rollsLeft:2000});}
          else if(key==="Transcendent Potion"){S.owned_items[key]--;usePotion({name:"Transcendent Potion",speed_add:1000,dur:20000000,rollsLeft:2000});}
          else if(key==="Oblivion Potion"){S.owned_items[key]--;usePotion({name:"Oblivion Potion",luck_add:60000000,dur:1,isRoll:true});toast("⚠️ Luck stacking disabled for 1 roll!");}
          else if(r){S.owned_items[key]--;usePotion(r);}
          save();updateHUD();renderInventoryTab();
        };
      }
      c.appendChild(card);
    });
    if(!any) c.innerHTML+="<div class='empty-msg'>No items yet.<br/>Find Lucky and Speed Potions by rolling,<br/>or buy from merchants!</div>";
  } else {
    // Talisman slot
    const slotDiv=document.createElement("div");
    slotDiv.style.cssText="grid-column:1/-1;padding:12px;background:rgba(255,180,60,0.08);border:1px solid rgba(255,180,60,0.25);border-radius:10px;margin-bottom:8px;";
    slotDiv.innerHTML=`
      <div style="font-size:10px;color:#888;letter-spacing:3px;margin-bottom:6px">TALISMAN SLOT</div>
      <div style="font-size:13px;font-weight:bold;color:${S.equipped_talisman?"#ffd700":"#444"}">
        ${S.equipped_talisman?`${TALISMANS.find(t=>t.name===S.equipped_talisman)?.emoji||"🔮"} ${S.equipped_talisman}`:"Empty — equip a talisman below"}
      </div>
      ${S.equipped_talisman?`<button id="unequip-tal-btn" style="margin-top:8px;padding:5px 12px;background:rgba(255,80,80,0.15);border:1px solid rgba(255,80,80,0.3);border-radius:5px;color:#ff8080;font-family:inherit;font-size:10px;cursor:pointer;">Unequip</button>`:""}
    `;
    c.appendChild(slotDiv);
    slotDiv.querySelector("#unequip-tal-btn")?.addEventListener("click",()=>{
      S.equipped_talisman=null;save();updateHUD();renderInventoryTab();
    });

    if(!S.owned_talismans.length){
      const empty=document.createElement("div");
      empty.className="empty-msg";empty.style.cssText="grid-column:1/-1;color:#555;text-align:center;padding:20px;font-size:11px;";
      empty.innerHTML="No talismans yet.<br/>Buy from Rin when she appears!";
      c.appendChild(empty);return;
    }

    S.owned_talismans.forEach(tname=>{
      const tal=TALISMANS.find(t=>t.name===tname);if(!tal)return;
      const eq=S.equipped_talisman===tname;
      const card=document.createElement("div");card.className="card";
      card.style.borderColor=eq?"rgba(255,200,60,0.7)":"rgba(255,200,60,0.25)";
      if(eq) card.style.background="rgba(255,200,60,0.07)";
      const stacks=S.talisman_stacks||0;
      const luckVal=tal.effectDynamic?tal.effectDynamic(stacks):tal.luck_add;
      card.innerHTML=`
        ${eq?'<span class="owned-tag" style="background:rgba(255,200,0,0.2);color:#ffd700;border-color:rgba(255,200,0,0.4)">EQ</span>':""}
        <div class="card-name" style="color:${tal.color}">${tal.emoji} ${tname}</div>
        <div class="card-sub">${tal.desc}</div>
        <div style="font-size:10px;color:#60e880;margin-top:4px">+${luckVal}% luck active</div>
        <button style="margin-top:6px;width:100%;padding:5px;background:${eq?"rgba(255,80,80,0.15)":"rgba(255,200,0,0.15)"};border:1px solid ${eq?"rgba(255,80,80,0.3)":"rgba(255,200,0,0.3)"};border-radius:5px;color:${eq?"#ff8080":"#ffd700"};font-family:inherit;font-size:10px;cursor:pointer;">${eq?"Unequip":"Equip"}</button>
      `;
      card.querySelector("button").onclick=(e)=>{
        e.stopPropagation();
        S.equipped_talisman=eq?null:tname;
        save();updateHUD();renderInventoryTab();
        toast(eq?`Unequipped ${tname}`:`Equipped: ${tname}`);
      };
      c.appendChild(card);
    });
  }
}
let collTab=0;
function openCollection(){
  document.getElementById("overlay-title").textContent="COLLECTION";
  renderTabBar(["📦 Storage","🏆 All Rolled"],t=>{collTab=t;renderCollTab();});
  collTab=0;renderCollTab();
  document.getElementById("overlay").classList.add("open");
}
function renderCollTab(){
  const c=document.getElementById("overlay-content");
  c.className="grid";c.style.cssText="";c.innerHTML="";
  if(collTab===0){
    // STORAGE: auras you own right now
    const entries=Object.entries(S.owned_auras).filter(([,n])=>n>0).sort((a,b)=>{
      const ta=AURAS.find(x=>x[0]===a[0]),tb=AURAS.find(x=>x[0]===b[0]);
      return(tb?tb[1]:0)-(ta?ta[1]:0);
    });
    const banner=document.createElement("div");
    banner.style.cssText="grid-column:1/-1;padding:8px 10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;font-size:10px;margin-bottom:4px;";
    const ea=S.equipped_aura&&AURAS.find(x=>x[0]===S.equipped_aura);
    banner.innerHTML=S.equipped_aura
      ?`<span style="color:#888;letter-spacing:2px">DISPLAYING: </span><span style="color:${ea?rgb(ea[3]):"#fff"};font-weight:bold">${S.equipped_aura}</span> <button id="uneq-aura-btn" style="margin-left:8px;padding:2px 8px;background:rgba(255,80,80,0.15);border:1px solid rgba(255,80,80,0.3);border-radius:4px;color:#ff8080;font-family:inherit;font-size:9px;cursor:pointer;">Remove</button>`
      :`<span style="color:#444;letter-spacing:2px">Tap an aura to display it</span>`;
    c.appendChild(banner);
    banner.querySelector("#uneq-aura-btn")?.addEventListener("click",()=>{S.equipped_aura=null;save();updateEquippedBadge();renderCollTab();});
    if(!entries.length){c.innerHTML+='<div class="empty-msg" style="grid-column:1/-1">No auras in storage yet.</div>';return;}
    entries.forEach(([name,count])=>{
      const aura=AURAS.find(x=>x[0]===name);if(!aura)return;
      const tier=auraTier(aura[1]);const isEq=S.equipped_aura===name;
      const card=document.createElement("div");card.className="card";
      card.style.borderColor=rgba(aura[2],isEq?0.8:0.35);
      if(isEq)card.style.background="rgba(255,255,255,0.07)";
      card.innerHTML=`${isEq?'<span class="owned-tag" style="background:rgba(60,200,60,0.2);color:#60ff60">EQ</span>':""}<div class="tier-label" style="color:${TIER_COLS[tier]}">${TIER_NAMES[tier]}</div><div class="card-name" style="color:${rgb(aura[3])};text-shadow:0 0 6px ${rgb(aura[2])}">${name}</div><div class="card-sub">1 in ${aura[1].toLocaleString()}</div><span class="aura-count">×${count}</span><button style="margin-top:6px;width:100%;padding:5px;background:${isEq?"rgba(255,80,80,0.15)":"rgba(60,200,60,0.15)"};border:1px solid ${isEq?"rgba(255,80,80,0.3)":"rgba(60,200,60,0.3)"};border-radius:5px;color:${isEq?"#ff8080":"#60e880"};font-family:inherit;font-size:10px;cursor:pointer;">${isEq?"Remove":"Display"}</button>`;
      card.querySelector("button").onclick=(e)=>{e.stopPropagation();S.equipped_aura=isEq?null:name;save();updateEquippedBadge();updateMusic();if(!isEq){S.lastAura={name,chance:aura[1],col:aura[2],glow:aura[3],tier,isBonus:false};updateAuraDisplay();toast("✨ Displaying: "+name);}else toast("Aura removed");renderCollTab();};
      c.appendChild(card);
    });
  } else {
    // ALL ROLLED: collection log, replay opening
    const unlocked=Object.keys(S.collection).sort((a,b)=>{
      const ta=AURAS.find(x=>x[0]===a),tb=AURAS.find(x=>x[0]===b);
      return(tb?tb[1]:0)-(ta?ta[1]:0);
    });
    if(!unlocked.length){c.innerHTML='<div class="empty-msg">Roll auras to fill your collection!</div>';return;}
    unlocked.forEach(name=>{
      const aura=AURAS.find(x=>x[0]===name);if(!aura)return;
      const tier=auraTier(aura[1]);const col=S.collection[name]||{};
      const card=document.createElement("div");card.className="card";
      card.style.borderColor=rgba(aura[2],0.4);
      card.innerHTML=`<div class="tier-label" style="color:${TIER_COLS[tier]}">${TIER_NAMES[tier]}</div><div class="card-name" style="color:${rgb(aura[3])};text-shadow:0 0 5px ${rgb(aura[2])}">${name}</div><div class="card-sub">1 in ${aura[1].toLocaleString()}</div><span class="aura-count">×${col.count||0}</span><button style="margin-top:6px;width:100%;padding:5px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:5px;color:#aaa;font-family:inherit;font-size:9px;cursor:pointer;">▶ Opening</button>`;
      card.querySelector("button").onclick=(e)=>{e.stopPropagation();document.getElementById("overlay").classList.remove("open");if(tier>=3)playCutscene(aura,tier);else if(aura[1]>=10000)playStarCutscene(aura,tier);else{S.lastAura={name,chance:aura[1],col:aura[2],glow:aura[3],tier,isBonus:false};updateAuraDisplay();toast("Viewing: "+name);}};
      c.appendChild(card);
    });
  }
}
function renderTabBar(tabs,onSwitch){
  const bar=document.getElementById("tab-bar");bar.innerHTML="";
  tabs.forEach((t,i)=>{
    const b=document.createElement("button");b.className="tab-btn"+(i===0?" active":"");
    b.textContent=t;
    b.onclick=()=>{
      bar.querySelectorAll(".tab-btn").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");onSwitch(i);
    };
    bar.appendChild(b);
  });
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  BUFF TRAY  (bottom-left icons for active effects)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function updateBuffTray(){
  const tray=document.getElementById("buff-tray");
  if(!tray) return;
  tray.innerHTML="";

  // Day/night buff display
  const isDay=S.isDay;
  const timeDiv=document.createElement("div");
  timeDiv.className="buff-icon";
  timeDiv.style.borderColor=isDay?"rgba(255,200,0,0.4)":"rgba(100,100,255,0.4)";
  const timeRem=Math.ceil(S.dayNightTimer);
  timeDiv.innerHTML="<span class='buff-emoji'>"+(isDay?"☀️":"🌙")+"</span>"+
    "<div class='buff-info'>"+
    "<span class='buff-name'>"+(isDay?"DAYTIME":"NIGHTTIME")+"</span>"+
    "<span class='buff-timer' style='color:"+(isDay?"#ffd700":"#8888ff")+"'>"+timeRem+"s</span>"+
    "</div>";
  tray.appendChild(timeDiv);

  // Equipped glove buffs
  const gearBuffs=[];
  if(S.equipped_R){
    const g=GEARS.find(x=>x&&x.name===S.equipped_R);
    if(g&&(g.luck_add||g.speed_add)){
      const parts=[];
      if(g.luck_add) parts.push('+'+g.luck_add+'% luck');
      if(g.speed_add>0) parts.push('+'+g.speed_add+'% spd');
      if(g.speed_add<0) parts.push(g.speed_add+'% spd');
      const div=document.createElement("div");
      div.className="buff-icon";
      div.style.borderColor="rgba(255,215,0,0.35)";
      div.innerHTML="<span class='buff-emoji'>🧤</span>"+
        "<div class='buff-info'>"+
        "<span class='buff-name' style='color:#ccc'>"+g.name.replace(" Device","").replace(" Gauntlet","").replace(" Glove","")+"</span>"+
        "<span class='buff-timer' style='color:#ffd700'>"+parts.join(' ')+"</span>"+
        "</div>";
      tray.appendChild(div);
    }
  }
  if(S.equipped_L){
    const g=GEARS.find(x=>x&&x.name===S.equipped_L);
    if(g){
      const desc=g.effect||g.name;
      const div=document.createElement("div");
      div.className="buff-icon";
      div.style.borderColor="rgba(180,100,255,0.35)";
      div.innerHTML="<span class='buff-emoji'>🫱</span>"+
        "<div class='buff-info'>"+
        "<span class='buff-name' style='color:#ccc'>"+g.name.replace(" Device","").replace(" Gauntlet","").replace(" (L)","")+"</span>"+
        "<span class='buff-timer' style='color:#c080ff'>"+desc.split('.')[0]+"</span>"+
        "</div>";
      tray.appendChild(div);
    }
  }

  // Active potions
  const POTION_EMOJIS={
    "Lucky Potion":"🍀","Speed Potion":"⚡","Haste Potion I":"🏃","Haste Potion II":"🏃",
    "Haste Potion III":"🏃","Rage Potion":"💢","Diver Potion":"🤿",
    "Fortune I":"🧪","Fortune II":"🧪","Fortune III":"🧪",
    "Fortune Spoid I":"✨","Fortune Spoid II":"✨","Fortune Spoid III":"✨",
    "Lucky Potion L":"🍀","Lucky Potion XL":"🍀","Speed Potion L":"⚡","Speed Potion XL":"⚡",
    "Godly Potion (Zeus)":"⚡","Godly Potion (Poseidon)":"🔱","Godly Potion (Hades)":"💀",
    "Potion of Bound":"🔮","Heavenly Potion":"✨","Godlike Potion":"👑",
    "Oblivion Potion":"🌑","Warp Potion":"⏩","Transcendent Potion":"🌟",
  };

  S.active_potions.forEach(p=>{
    const div=document.createElement("div");
    div.className="buff-icon";
    const isLuck=(p.luck_add||0)>0;
    const isSpeed=(p.speed_add||0)>0;
    div.style.borderColor=isLuck?"rgba(100,200,100,0.4)":"rgba(80,160,255,0.4)";
    const emoji=POTION_EMOJIS[p.name]||"🧪";
    let rem;
    if(p.rollsLeft!==undefined) rem=p.rollsLeft+" rolls";
    else if(p.isRoll) rem="1 roll";
    else rem=Math.max(0,Math.ceil(p.timer/1000))+"s";
    const statTxt=isLuck?"+"+p.luck_add+"%":isSpeed?"+"+p.speed_add+"% spd":"";
    const shortName=p.name.replace(" Potion","").replace("Fortune ","F").replace("Haste ","H").replace("Godly ","G").replace("Transcendent","Trans").replace("Oblivion","Obliv");
    div.innerHTML="<span class='buff-emoji'>"+emoji+"</span>"+
      "<div class='buff-info'>"+
      "<span class='buff-name' title='"+p.name+"'>"+shortName+(statTxt?" "+statTxt:"")+"</span>"+
      "<span class='buff-timer' style='color:"+(isLuck?"#60e880":"#60a0ff")+"'>"+rem+"</span>"+
      "</div>";
    tray.appendChild(div);
  });
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  EVENTS MENU
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function openEvents(){
  document.getElementById("overlay-title").textContent="EVENTS";
  renderTabBar(["🎰 Cosmetic Roulette","🎟️ Item Roulette"],t=>{
    if(t===0) renderCosmeticRoulette();
    else renderItemRoulette();
  });
  renderCosmeticRoulette();
  document.getElementById("overlay").classList.add("open");
}

// ── Roulette shared helpers ───────────────────────────────────────────────────
const COMPANIONS=[
  {id:"cat", name:"Cat", color:"#ffcc88", rarity:"Common", svg:`<svg viewBox="0 0 60 80" width="60" height="80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="cBody" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="#ffe0a0"/><stop offset="100%" stop-color="#d4823a"/></radialGradient>
      <radialGradient id="cHead" cx="38%" cy="32%" r="62%"><stop offset="0%" stop-color="#ffe8b0"/><stop offset="100%" stop-color="#cc7a30"/></radialGradient>
      <radialGradient id="cBelly" cx="50%" cy="40%" r="55%"><stop offset="0%" stop-color="#fff4dd"/><stop offset="100%" stop-color="#f0c880"/></radialGradient>
      <radialGradient id="eyeL" cx="35%" cy="30%" r="60%"><stop offset="0%" stop-color="#4a8a4a"/><stop offset="60%" stop-color="#1a4a1a"/><stop offset="100%" stop-color="#0a200a"/></radialGradient>
      <filter id="softShadow"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.35"/></filter>
    </defs>
    <!-- Tail -->
    <path d="M42 62 Q58 54 55 44 Q52 36 46 40" stroke="#c07030" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M42 62 Q57 53 54 43 Q51 37 46 40" stroke="#e09050" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Body -->
    <ellipse cx="30" cy="54" rx="16" ry="19" fill="url(#cBody)" filter="url(#softShadow)"/>
    <!-- Belly -->
    <ellipse cx="30" cy="57" rx="9" ry="12" fill="url(#cBelly)"/>
    <!-- Belly stripes -->
    <ellipse cx="30" cy="54" rx="4" ry="3" fill="rgba(200,140,60,0.25)"/>
    <ellipse cx="30" cy="60" rx="5" ry="2.5" fill="rgba(200,140,60,0.2)"/>
    <!-- Front paws -->
    <ellipse cx="20" cy="71" rx="6" ry="4" fill="#d4823a"/>
    <ellipse cx="40" cy="71" rx="6" ry="4" fill="#d4823a"/>
    <ellipse cx="20" cy="70" rx="5" ry="3" fill="#ffe0a0"/>
    <ellipse cx="40" cy="70" rx="5" ry="3" fill="#ffe0a0"/>
    <!-- Toe lines -->
    <line x1="17" y1="70" x2="17" y2="73" stroke="#c07030" stroke-width="0.8" opacity="0.6"/>
    <line x1="20" y1="69" x2="20" y2="73" stroke="#c07030" stroke-width="0.8" opacity="0.6"/>
    <line x1="23" y1="70" x2="23" y2="73" stroke="#c07030" stroke-width="0.8" opacity="0.6"/>
    <!-- Ears -->
    <polygon points="16,22 11,10 22,16" fill="#d4823a"/>
    <polygon points="44,22 49,10 38,16" fill="#d4823a"/>
    <polygon points="17,21 13,13 21,17" fill="#f0a060"/>
    <polygon points="43,21 47,13 39,17" fill="#f0a060"/>
    <!-- Head -->
    <ellipse cx="30" cy="28" rx="15" ry="14" fill="url(#cHead)" filter="url(#softShadow)"/>
    <!-- Forehead marking -->
    <path d="M26 20 Q30 17 34 20" stroke="#c07030" stroke-width="1" fill="none" opacity="0.5"/>
    <path d="M28 18 Q30 16 32 18" stroke="#c07030" stroke-width="0.8" fill="none" opacity="0.4"/>
    <!-- Eyes -->
    <ellipse cx="23" cy="27" rx="4" ry="4.5" fill="url(#eyeL)"/>
    <ellipse cx="37" cy="27" rx="4" ry="4.5" fill="url(#eyeL)"/>
    <ellipse cx="23" cy="26" rx="1.5" ry="2" fill="white" opacity="0.7"/>
    <ellipse cx="37" cy="26" rx="1.5" ry="2" fill="white" opacity="0.7"/>
    <ellipse cx="23.8" cy="25.5" rx="0.7" ry="0.9" fill="white" opacity="0.9"/>
    <ellipse cx="37.8" cy="25.5" rx="0.7" ry="0.9" fill="white" opacity="0.9"/>
    <!-- Nose -->
    <path d="M28.5 32 L30 34 L31.5 32 Z" fill="#e87070"/>
    <path d="M30 34 Q28 36 26 35" stroke="#c05050" stroke-width="0.8" fill="none"/>
    <path d="M30 34 Q32 36 34 35" stroke="#c05050" stroke-width="0.8" fill="none"/>
    <!-- Whiskers -->
    <line x1="8" y1="31" x2="22" y2="32" stroke="#888" stroke-width="0.7" opacity="0.7"/>
    <line x1="8" y1="33.5" x2="22" y2="33" stroke="#888" stroke-width="0.7" opacity="0.6"/>
    <line x1="38" y1="32" x2="52" y2="31" stroke="#888" stroke-width="0.7" opacity="0.7"/>
    <line x1="38" y1="33" x2="52" y2="33.5" stroke="#888" stroke-width="0.7" opacity="0.6"/>
  </svg>`},

  {id:"dog", name:"Dog", color:"#c8964a", rarity:"Common", svg:`<svg viewBox="0 0 60 80" width="60" height="80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="dBody" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="#e8b870"/><stop offset="100%" stop-color="#a06830"/></radialGradient>
      <radialGradient id="dHead" cx="38%" cy="32%" r="62%"><stop offset="0%" stop-color="#f0c880"/><stop offset="100%" stop-color="#a87030"/></radialGradient>
      <radialGradient id="dSnout" cx="50%" cy="45%" r="55%"><stop offset="0%" stop-color="#e0a870"/><stop offset="100%" stop-color="#b07840"/></radialGradient>
      <radialGradient id="dEye" cx="35%" cy="30%" r="60%"><stop offset="0%" stop-color="#704020"/><stop offset="60%" stop-color="#301808"/><stop offset="100%" stop-color="#100000"/></radialGradient>
      <filter id="ss2"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/></filter>
    </defs>
    <!-- Tail -->
    <path d="M44 58 Q58 48 56 38" stroke="#a06830" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M44 58 Q57 48 55 38" stroke="#c88040" stroke-width="3" fill="none" stroke-linecap="round"/>
    <!-- Body -->
    <ellipse cx="30" cy="54" rx="17" ry="19" fill="url(#dBody)" filter="url(#ss2)"/>
    <!-- Belly patch -->
    <ellipse cx="30" cy="57" rx="10" ry="12" fill="#f8e0b0"/>
    <!-- Paws -->
    <ellipse cx="19" cy="71" rx="7" ry="4.5" fill="#a06830"/>
    <ellipse cx="41" cy="71" rx="7" ry="4.5" fill="#a06830"/>
    <ellipse cx="19" cy="70" rx="5.5" ry="3.5" fill="#e0b070"/>
    <ellipse cx="41" cy="70" rx="5.5" ry="3.5" fill="#e0b070"/>
    <line x1="16" y1="70" x2="16" y2="73.5" stroke="#906020" stroke-width="0.8" opacity="0.6"/>
    <line x1="19" y1="69" x2="19" y2="73.5" stroke="#906020" stroke-width="0.8" opacity="0.6"/>
    <line x1="22" y1="70" x2="22" y2="73.5" stroke="#906020" stroke-width="0.8" opacity="0.6"/>
    <!-- Floppy ears -->
    <ellipse cx="13" cy="26" rx="7" ry="10" fill="#8a5820" transform="rotate(-20 13 26)"/>
    <ellipse cx="47" cy="26" rx="7" ry="10" fill="#8a5820" transform="rotate(20 47 26)"/>
    <ellipse cx="13" cy="27" rx="4.5" ry="7" fill="#a06830" transform="rotate(-20 13 27)"/>
    <ellipse cx="47" cy="27" rx="4.5" ry="7" fill="#a06830" transform="rotate(20 47 27)"/>
    <!-- Head -->
    <ellipse cx="30" cy="27" rx="16" ry="15" fill="url(#dHead)" filter="url(#ss2)"/>
    <!-- Snout -->
    <ellipse cx="30" cy="33" rx="8" ry="6" fill="url(#dSnout)"/>
    <!-- Eyes -->
    <ellipse cx="23" cy="25" rx="4.5" ry="4.5" fill="url(#dEye)"/>
    <ellipse cx="37" cy="25" rx="4.5" ry="4.5" fill="url(#dEye)"/>
    <ellipse cx="23" cy="24" rx="1.8" ry="2" fill="white" opacity="0.7"/>
    <ellipse cx="37" cy="24" rx="1.8" ry="2" fill="white" opacity="0.7"/>
    <ellipse cx="23.8" cy="23.5" rx="0.8" ry="0.9" fill="white" opacity="0.95"/>
    <ellipse cx="37.8" cy="23.5" rx="0.8" ry="0.9" fill="white" opacity="0.95"/>
    <!-- Nose -->
    <ellipse cx="30" cy="31" rx="3.5" ry="2.5" fill="#1a0a00"/>
    <ellipse cx="29" cy="30.2" rx="1.2" ry="0.8" fill="#555" opacity="0.6"/>
    <!-- Mouth -->
    <path d="M27 34.5 Q30 37.5 33 34.5" stroke="#805028" stroke-width="1" fill="none"/>
  </svg>`},

  {id:"ghost", name:"Ghost", color:"#c8c8ff", rarity:"Common", svg:`<svg viewBox="0 0 60 80" width="60" height="80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="gBody" cx="42%" cy="30%" r="65%"><stop offset="0%" stop-color="#f0f0ff"/><stop offset="60%" stop-color="#c8c8f0"/><stop offset="100%" stop-color="#9898cc"/></radialGradient>
      <radialGradient id="gEye" cx="35%" cy="30%" r="60%"><stop offset="0%" stop-color="#5050bb"/><stop offset="100%" stop-color="#20208a"/></radialGradient>
      <filter id="gGlow"><feGaussianBlur stdDeviation="3" result="blur"/><feComposite in="SourceGraphic" in2="blur" operator="over"/></filter>
      <filter id="ss3"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#6060aa" flood-opacity="0.5"/></filter>
    </defs>
    <!-- Inner glow aura -->
    <ellipse cx="30" cy="35" rx="22" ry="28" fill="rgba(180,180,255,0.12)" filter="url(#gGlow)"/>
    <!-- Ghost body sheet -->
    <path d="M8 30 Q8 10 30 8 Q52 10 52 30 L52 58 Q46 52 40 58 Q34 52 30 58 Q26 52 20 58 Q14 52 8 58 Z" fill="url(#gBody)" filter="url(#ss3)"/>
    <!-- Shading on body -->
    <path d="M16 30 Q14 22 22 18" stroke="rgba(180,180,255,0.5)" stroke-width="1.5" fill="none"/>
    <path d="M12 40 Q10 48 16 54" stroke="rgba(120,120,200,0.3)" stroke-width="1" fill="none"/>
    <!-- Inner glow -->
    <ellipse cx="30" cy="32" rx="12" ry="14" fill="rgba(255,255,255,0.12)"/>
    <!-- Eyes -->
    <ellipse cx="21" cy="30" rx="5.5" ry="6.5" fill="url(#gEye)"/>
    <ellipse cx="39" cy="30" rx="5.5" ry="6.5" fill="url(#gEye)"/>
    <!-- Eye shine -->
    <ellipse cx="20" cy="28.5" rx="2.5" ry="3" fill="rgba(150,150,255,0.5)"/>
    <ellipse cx="38" cy="28.5" rx="2.5" ry="3" fill="rgba(150,150,255,0.5)"/>
    <circle cx="20.5" cy="27.5" r="1.2" fill="white" opacity="0.9"/>
    <circle cx="38.5" cy="27.5" r="1.2" fill="white" opacity="0.9"/>
    <!-- Mouth -->
    <path d="M22 40 Q25 44 30 42 Q35 44 38 40" stroke="#5050aa" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <!-- Cheek blush -->
    <ellipse cx="17" cy="37" rx="4" ry="2.5" fill="rgba(180,140,220,0.3)"/>
    <ellipse cx="43" cy="37" rx="4" ry="2.5" fill="rgba(180,140,220,0.3)"/>
    <!-- Arms -->
    <path d="M8 36 Q2 32 4 26" stroke="#b0b0e8" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M52 36 Q58 32 56 26" stroke="#b0b0e8" stroke-width="5" fill="none" stroke-linecap="round"/>
    <!-- Hand nubs -->
    <circle cx="4" cy="25" r="4" fill="#c0c0ee"/>
    <circle cx="56" cy="25" r="4" fill="#c0c0ee"/>
  </svg>`},

  {id:"star", name:"Star", color:"#ffd700", rarity:"Rare", svg:`<svg viewBox="0 0 60 80" width="60" height="80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="sBody" cx="42%" cy="35%" r="60%"><stop offset="0%" stop-color="#fff0a0"/><stop offset="60%" stop-color="#ffd700"/><stop offset="100%" stop-color="#c89000"/></radialGradient>
      <radialGradient id="sEye" cx="35%" cy="30%" r="60%"><stop offset="0%" stop-color="#7a5000"/><stop offset="100%" stop-color="#3a2000"/></radialGradient>
      <filter id="sGlow"><feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#ffd700" flood-opacity="0.6"/></filter>
    </defs>
    <!-- Glow aura -->
    <ellipse cx="30" cy="35" rx="26" ry="26" fill="rgba(255,215,0,0.1)" filter="url(#sGlow)"/>
    <!-- Small sparkles -->
    <circle cx="8" cy="14" r="2" fill="#fff0a0" opacity="0.8"/>
    <circle cx="52" cy="12" r="1.5" fill="#fff0a0" opacity="0.7"/>
    <circle cx="55" cy="40" r="2" fill="#ffd700" opacity="0.6"/>
    <circle cx="6" cy="42" r="1.5" fill="#ffd700" opacity="0.6"/>
    <!-- Star body -->
    <polygon points="30,8 35,22 50,22 38,31 42,46 30,37 18,46 22,31 10,22 25,22" fill="url(#sBody)" filter="url(#sGlow)"/>
    <!-- Star shading -->
    <polygon points="30,8 35,22 25,22" fill="rgba(255,255,200,0.6)"/>
    <polygon points="10,22 25,22 22,31" fill="rgba(180,130,0,0.3)"/>
    <polygon points="50,22 38,31 42,46" fill="rgba(180,130,0,0.3)"/>
    <!-- Face -->
    <ellipse cx="24" cy="25" rx="3" ry="3.2" fill="url(#sEye)"/>
    <ellipse cx="36" cy="25" rx="3" ry="3.2" fill="url(#sEye)"/>
    <ellipse cx="23.5" cy="24" rx="1.2" ry="1.4" fill="rgba(255,240,180,0.6)"/>
    <ellipse cx="35.5" cy="24" rx="1.2" ry="1.4" fill="rgba(255,240,180,0.6)"/>
    <circle cx="24" cy="23.5" r="0.7" fill="white" opacity="0.9"/>
    <circle cx="36" cy="23.5" r="0.7" fill="white" opacity="0.9"/>
    <path d="M26 30 Q30 33 34 30" stroke="#7a5000" stroke-width="1" fill="none"/>
    <!-- Legs -->
    <rect x="24" y="46" width="5" height="14" rx="2.5" fill="#ffd700"/>
    <rect x="31" y="46" width="5" height="14" rx="2.5" fill="#ffd700"/>
    <!-- Shoes -->
    <ellipse cx="26.5" cy="61" rx="5" ry="3" fill="#c89000"/>
    <ellipse cx="33.5" cy="61" rx="5" ry="3" fill="#c89000"/>
  </svg>`},

  {id:"moon", name:"Moon", color:"#aaaaff", rarity:"Rare", svg:`<svg viewBox="0 0 60 80" width="60" height="80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="mBody" cx="38%" cy="32%" r="62%"><stop offset="0%" stop-color="#e8e8ff"/><stop offset="60%" stop-color="#b8b8f0"/><stop offset="100%" stop-color="#8080cc"/></radialGradient>
      <radialGradient id="mEye" cx="35%" cy="30%" r="60%"><stop offset="0%" stop-color="#5050aa"/><stop offset="100%" stop-color="#202070"/></radialGradient>
      <filter id="mGlow"><feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#8888ff" flood-opacity="0.5"/></filter>
    </defs>
    <!-- Stars around -->
    <circle cx="6" cy="12" r="1.5" fill="#ffffaa" opacity="0.8"/>
    <circle cx="54" cy="8" r="1" fill="#ffffaa" opacity="0.7"/>
    <circle cx="58" cy="32" r="1.5" fill="#ffffaa" opacity="0.6"/>
    <circle cx="4" cy="50" r="1" fill="#ccccff" opacity="0.6"/>
    <!-- Crescent moon body -->
    <path d="M44 16 A22 22 0 1 0 44 54 A16 16 0 1 1 44 16 Z" fill="url(#mBody)" filter="url(#mGlow)"/>
    <!-- Surface shading -->
    <path d="M18 22 Q14 30 16 40" stroke="rgba(180,180,255,0.4)" stroke-width="1.5" fill="none"/>
    <!-- Craters -->
    <circle cx="22" cy="40" r="3.5" fill="none" stroke="rgba(140,140,220,0.5)" stroke-width="1.2"/>
    <circle cx="32" cy="50" r="2.5" fill="none" stroke="rgba(140,140,220,0.4)" stroke-width="1"/>
    <circle cx="16" cy="28" r="2" fill="none" stroke="rgba(140,140,220,0.35)" stroke-width="0.8"/>
    <!-- Face -->
    <ellipse cx="24" cy="27" rx="4" ry="4.2" fill="url(#mEye)"/>
    <ellipse cx="34" cy="27" rx="4" ry="4.2" fill="url(#mEye)"/>
    <ellipse cx="23.5" cy="25.5" rx="1.6" ry="1.8" fill="rgba(180,180,255,0.5)"/>
    <ellipse cx="33.5" cy="25.5" rx="1.6" ry="1.8" fill="rgba(180,180,255,0.5)"/>
    <circle cx="24" cy="25" r="0.8" fill="white" opacity="0.9"/>
    <circle cx="34" cy="25" r="0.8" fill="white" opacity="0.9"/>
    <path d="M22 33 Q28 37 34 33" stroke="#5050aa" stroke-width="1.2" fill="none"/>
    <!-- Base/feet -->
    <ellipse cx="29" cy="68" rx="12" ry="5" fill="#8080cc" opacity="0.7"/>
    <ellipse cx="29" cy="67" rx="10" ry="4" fill="#b0b0e8"/>
    <ellipse cx="29" cy="66" rx="7" ry="2.5" fill="#d8d8ff"/>
  </svg>`},

  {id:"flame", name:"Flame", color:"#ff6030", rarity:"Rare", svg:`<svg viewBox="0 0 60 80" width="60" height="80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="fOuter" cx="50%" cy="70%" r="60%"><stop offset="0%" stop-color="#ff4000"/><stop offset="60%" stop-color="#ff2000"/><stop offset="100%" stop-color="#cc0000"/></radialGradient>
      <radialGradient id="fMid" cx="50%" cy="65%" r="55%"><stop offset="0%" stop-color="#ffaa00"/><stop offset="100%" stop-color="#ff5500"/></radialGradient>
      <radialGradient id="fCore" cx="50%" cy="60%" r="50%"><stop offset="0%" stop-color="#ffffff"/><stop offset="40%" stop-color="#ffee80"/><stop offset="100%" stop-color="#ffaa00"/></radialGradient>
      <filter id="fGlow"><feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#ff4000" flood-opacity="0.7"/></filter>
    </defs>
    <!-- Outer flame -->
    <path d="M30 72 Q10 62 12 44 Q14 30 18 22 Q16 34 24 36 Q18 26 22 14 Q28 24 26 32 Q32 24 30 14 Q36 24 34 32 Q40 26 38 14 Q44 24 42 36 Q48 34 46 22 Q52 30 48 44 Q50 62 30 72 Z" fill="url(#fOuter)" filter="url(#fGlow)"/>
    <!-- Mid flame -->
    <path d="M30 68 Q16 58 18 44 Q20 34 22 28 Q21 36 26 38 Q22 30 26 20 Q30 28 28 36 Q34 28 32 20 Q36 30 34 36 Q38 34 38 28 Q42 34 42 44 Q44 58 30 68 Z" fill="url(#fMid)"/>
    <!-- Inner core -->
    <path d="M30 62 Q22 54 24 44 Q26 36 28 32 Q29 38 30 36 Q31 38 32 32 Q34 36 36 44 Q38 54 30 62 Z" fill="url(#fCore)"/>
    <!-- Face -->
    <ellipse cx="24" cy="44" rx="3.5" ry="3.8" fill="#4a0000" opacity="0.85"/>
    <ellipse cx="36" cy="44" rx="3.5" ry="3.8" fill="#4a0000" opacity="0.85"/>
    <ellipse cx="23.5" cy="43" rx="1.5" ry="1.6" fill="rgba(255,200,100,0.5)"/>
    <ellipse cx="35.5" cy="43" rx="1.5" ry="1.6" fill="rgba(255,200,100,0.5)"/>
    <circle cx="24" cy="42.5" r="0.7" fill="white" opacity="0.8"/>
    <circle cx="36" cy="42.5" r="0.7" fill="white" opacity="0.8"/>
    <path d="M26 50 Q30 54 34 50" stroke="#4a0000" stroke-width="1.2" fill="none"/>
    <!-- Heat shimmer lines -->
    <path d="M20 16 Q22 12 20 8" stroke="rgba(255,150,0,0.4)" stroke-width="1" fill="none"/>
    <path d="M30 12 Q32 8 30 4" stroke="rgba(255,200,0,0.3)" stroke-width="1" fill="none"/>
    <path d="M40 16 Q38 12 40 8" stroke="rgba(255,150,0,0.4)" stroke-width="1" fill="none"/>
  </svg>`},

  {id:"crown", name:"Crown", color:"#ff8c00", rarity:"Epic", svg:`<svg viewBox="0 0 60 80" width="60" height="80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="crHead" cx="38%" cy="35%" r="60%"><stop offset="0%" stop-color="#ffe0b0"/><stop offset="100%" stop-color="#d4a060"/></radialGradient>
      <radialGradient id="crRobe" cx="50%" cy="30%" r="65%"><stop offset="0%" stop-color="#cc2020"/><stop offset="100%" stop-color="#880808"/></radialGradient>
      <radialGradient id="crCrown" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="#ffe060"/><stop offset="60%" stop-color="#ffa800"/><stop offset="100%" stop-color="#cc7000"/></radialGradient>
      <filter id="crGlow"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.4"/></filter>
    </defs>
    <!-- Robe body -->
    <path d="M12 40 Q10 62 14 72 L46 72 Q50 62 48 40 Q40 44 30 43 Q20 44 12 40 Z" fill="url(#crRobe)" filter="url(#crGlow)"/>
    <!-- Robe fur trim bottom -->
    <path d="M14 72 Q22 68 30 70 Q38 68 46 72" stroke="white" stroke-width="3" fill="none" opacity="0.7"/>
    <!-- Ermine dots -->
    <circle cx="22" cy="54" r="2.5" fill="white" opacity="0.5"/>
    <circle cx="30" cy="60" r="2.5" fill="white" opacity="0.5"/>
    <circle cx="38" cy="54" r="2.5" fill="white" opacity="0.5"/>
    <circle cx="26" cy="65" r="2" fill="white" opacity="0.4"/>
    <circle cx="34" cy="65" r="2" fill="white" opacity="0.4"/>
    <!-- Robe clasp -->
    <ellipse cx="30" cy="45" rx="4" ry="3" fill="#ffd700" opacity="0.9"/>
    <ellipse cx="30" cy="45" rx="2.5" ry="2" fill="#ff8c00"/>
    <!-- Head -->
    <ellipse cx="30" cy="26" rx="14" ry="13" fill="url(#crHead)" filter="url(#crGlow)"/>
    <!-- Crown -->
    <rect x="16" y="12" width="28" height="9" rx="1.5" fill="url(#crCrown)"/>
    <!-- Crown points -->
    <polygon points="16,12 16,6 20,12" fill="#ffa800"/>
    <polygon points="27,12 30,5 33,12" fill="#ffa800"/>
    <polygon points="44,12 44,6 40,12" fill="#ffa800"/>
    <!-- Crown gems -->
    <circle cx="18" cy="8" r="2.8" fill="#ff4444"/>
    <circle cx="18" cy="8" r="1.5" fill="#ff8888"/>
    <circle cx="30" cy="6.5" r="2.8" fill="#44aaff"/>
    <circle cx="30" cy="6.5" r="1.5" fill="#88ccff"/>
    <circle cx="42" cy="8" r="2.8" fill="#44dd44"/>
    <circle cx="42" cy="8" r="1.5" fill="#88ff88"/>
    <!-- Crown band highlight -->
    <rect x="16" y="12" width="28" height="3" rx="1" fill="rgba(255,255,200,0.4)"/>
    <!-- Eyes -->
    <ellipse cx="24" cy="26" rx="4" ry="4.2" fill="#3a2000"/>
    <ellipse cx="36" cy="26" rx="4" ry="4.2" fill="#3a2000"/>
    <ellipse cx="23.5" cy="24.5" rx="1.8" ry="2" fill="rgba(255,200,100,0.5)"/>
    <ellipse cx="35.5" cy="24.5" rx="1.8" ry="2" fill="rgba(255,200,100,0.5)"/>
    <circle cx="24" cy="24" r="0.8" fill="white" opacity="0.9"/>
    <circle cx="36" cy="24" r="0.8" fill="white" opacity="0.9"/>
    <!-- Smile -->
    <path d="M25 32 Q30 36 35 32" stroke="#8a5000" stroke-width="1.2" fill="none"/>
  </svg>`},

  {id:"alien", name:"Alien", color:"#60ff80", rarity:"Epic", svg:`<svg viewBox="0 0 60 80" width="60" height="80" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="aHead" cx="38%" cy="32%" r="62%"><stop offset="0%" stop-color="#a0ff90"/><stop offset="60%" stop-color="#60cc60"/><stop offset="100%" stop-color="#308040"/></radialGradient>
      <radialGradient id="aBody" cx="42%" cy="36%" r="60%"><stop offset="0%" stop-color="#80e870"/><stop offset="100%" stop-color="#408040"/></radialGradient>
      <radialGradient id="aEye" cx="35%" cy="30%" r="60%"><stop offset="0%" stop-color="#00ff88"/><stop offset="40%" stop-color="#00aa44"/><stop offset="100%" stop-color="#002010"/></radialGradient>
      <filter id="aGlow"><feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#00ff80" flood-opacity="0.5"/></filter>
    </defs>
    <!-- Antennae -->
    <line x1="22" y1="10" x2="16" y2="2" stroke="#60cc60" stroke-width="1.8"/>
    <line x1="38" y1="10" x2="44" y2="2" stroke="#60cc60" stroke-width="1.8"/>
    <circle cx="16" cy="2" r="3" fill="#00ffcc" filter="url(#aGlow)"/>
    <circle cx="44" cy="2" r="3" fill="#00ffcc" filter="url(#aGlow)"/>
    <circle cx="16" cy="2" r="1.5" fill="white" opacity="0.7"/>
    <circle cx="44" cy="2" r="1.5" fill="white" opacity="0.7"/>
    <!-- Body -->
    <ellipse cx="30" cy="56" rx="12" ry="14" fill="url(#aBody)" filter="url(#aGlow)"/>
    <!-- Belly light -->
    <ellipse cx="30" cy="56" rx="6" ry="7" fill="rgba(0,255,136,0.25)"/>
    <ellipse cx="30" cy="56" rx="3" ry="3.5" fill="rgba(0,255,200,0.5)"/>
    <!-- Arms - spindly -->
    <path d="M18 50 Q8 44 10 36" stroke="#50aa50" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M42 50 Q52 44 50 36" stroke="#50aa50" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <!-- 3-fingered hands -->
    <circle cx="10" cy="35" r="4" fill="#60cc60"/>
    <circle cx="50" cy="35" r="4" fill="#60cc60"/>
    <!-- Legs -->
    <path d="M22 68 Q18 74 20 78" stroke="#50aa50" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M38 68 Q42 74 40 78" stroke="#50aa50" stroke-width="4" fill="none" stroke-linecap="round"/>
    <ellipse cx="20" cy="78" rx="6" ry="3" fill="#408040"/>
    <ellipse cx="40" cy="78" rx="6" ry="3" fill="#408040"/>
    <!-- Big head -->
    <ellipse cx="30" cy="22" rx="18" ry="16" fill="url(#aHead)" filter="url(#aGlow)"/>
    <!-- Head sheen -->
    <ellipse cx="24" cy="16" rx="6" ry="4" fill="rgba(200,255,200,0.25)"/>
    <!-- Giant eyes -->
    <ellipse cx="22" cy="21" rx="7.5" ry="8.5" fill="#001a00"/>
    <ellipse cx="38" cy="21" rx="7.5" ry="8.5" fill="#001a00"/>
    <ellipse cx="22" cy="21" rx="6" ry="7" fill="url(#aEye)" opacity="0.7"/>
    <ellipse cx="38" cy="21" rx="6" ry="7" fill="url(#aEye)" opacity="0.7"/>
    <!-- Eye shine -->
    <ellipse cx="20" cy="18.5" rx="3" ry="3.5" fill="rgba(0,255,150,0.4)"/>
    <ellipse cx="36" cy="18.5" rx="3" ry="3.5" fill="rgba(0,255,150,0.4)"/>
    <circle cx="20.5" cy="17.5" r="1.5" fill="white" opacity="0.9"/>
    <circle cx="36.5" cy="17.5" r="1.5" fill="white" opacity="0.9"/>
    <!-- Slit mouth -->
    <path d="M24 29 Q30 32 36 29" stroke="#204020" stroke-width="1.2" fill="none"/>
    <path d="M26 30 Q30 32.5 34 30" stroke="rgba(0,255,100,0.3)" stroke-width="0.8" fill="none"/>
  </svg>`},
];

const COMP_WEIGHTS={Common:60, Rare:30, Epic:10};

function weightedRoulettePick(items, weightFn){
  const total=items.reduce((s,x)=>s+weightFn(x),0);
  let r=rnd()*total;
  for(const x of items){r-=weightFn(x);if(r<=0)return x;}
  return items[items.length-1];
}

// Draws a spinning horizontal roulette strip then lands on result
function animateRoulette(containerId, items, displayFn, onLand, isSVG=false){
  const container=document.getElementById(containerId);
  if(!container)return;
  container.innerHTML="";

  // Build strip — 40 items cycling, last ~6 are the target
  const ITEM_W=60, VISIBLE=7;
  const picked=onLand(); // decide result first
  const stripItems=[];
  for(let i=0;i<34;i++) stripItems.push(items[Math.floor(rnd()*items.length)]);
  // last 6 lead into result
  for(let i=0;i<5;i++) stripItems.push(items[Math.floor(rnd()*items.length)]);
  stripItems.push(picked);

  const strip=document.createElement("div");
  strip.style.cssText="display:flex;gap:4px;transition:none;will-change:transform;";
  stripItems.forEach(item=>{
    const cell=document.createElement("div");
    cell.style.cssText="width:"+ITEM_W+"px;height:"+ITEM_W+"px;flex-shrink:0;background:rgba(255,255,255,0.07);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:22px;border:2px solid rgba(255,255,255,0.1);overflow:hidden;";
    if(isSVG) cell.innerHTML=displayFn(item);
    else cell.textContent=displayFn(item);
    strip.appendChild(cell);
  });

  const wrapper=document.createElement("div");
  wrapper.style.cssText="overflow:hidden;width:"+(VISIBLE*(ITEM_W+4))+"px;margin:0 auto;position:relative;border-radius:10px;border:2px solid rgba(255,255,255,0.15);background:rgba(0,0,0,0.4);";
  // Center marker
  const marker=document.createElement("div");
  marker.style.cssText="position:absolute;top:0;bottom:0;left:50%;transform:translateX(-50%);width:4px;background:rgba(255,200,0,0.8);z-index:2;border-radius:2px;pointer-events:none;";
  wrapper.appendChild(strip);
  wrapper.appendChild(marker);
  container.appendChild(wrapper);

  // Animate: start offset so center shows item 0, scroll to show result at center
  const centerOffset=Math.floor(VISIBLE/2);
  const totalItems=stripItems.length;
  const targetIdx=totalItems-1; // last item is result
  const startX=0;
  const endX=(targetIdx-centerOffset)*(ITEM_W+4);

  let start=null;
  const duration=3200; // ms
  function ease(t){return t<0.5?4*t*t*t:(t-1)*(2*t-2)*(2*t-2)+1;} // ease in-out cubic

  function frame(ts){
    if(!start)start=ts;
    const elapsed=ts-start;
    const progress=Math.min(1,elapsed/duration);
    const x=startX+(endX-startX)*ease(progress);
    strip.style.transform="translateX(-"+x+"px)";
    if(progress<1){requestAnimationFrame(frame);}
    else{
      strip.style.transform="translateX(-"+endX+"px)";
      // highlight winner
      const cells=strip.querySelectorAll("div");
      cells[targetIdx].style.background="rgba(255,200,0,0.25)";
      cells[targetIdx].style.borderColor="rgba(255,200,0,0.8)";
      setTimeout(()=>container.dispatchEvent(new CustomEvent("landed",{detail:picked})),300);
    }
  }
  requestAnimationFrame(frame);
}

// ── Cosmetic Roulette ─────────────────────────────────────────────────────────
function renderCosmeticRoulette(){
  const c=document.getElementById("overlay-content");
  c.className="";c.style.cssText="padding:10px;display:flex;flex-direction:column;gap:10px;";
  c.innerHTML="";

  // Cost info
  // Equipped companion section at top
  if(S.companions.length>0){
    const eqSection=document.createElement("div");
    eqSection.style.cssText="background:rgba(255,255,255,0.04);border:1px solid rgba(255,200,0,0.2);border-radius:10px;padding:10px;";
    const eqComp=S.equipped_companion?COMPANIONS.find(x=>x.id===S.equipped_companion):null;
    eqSection.innerHTML="<div style='font-size:10px;color:#888;letter-spacing:2px;margin-bottom:8px'>EQUIPPED COMPANION</div>"+
      "<div style='display:flex;align-items:center;gap:10px;flex-wrap:wrap;'>";
    // Show all owned companions as small clickable cards
    S.companions.forEach(id=>{
      const comp=COMPANIONS.find(x=>x.id===id);if(!comp)return;
      const isEq=S.equipped_companion===id;
      const btn=document.createElement("div");
      btn.style.cssText="cursor:pointer;padding:4px;border-radius:8px;border:2px solid "+(isEq?"rgba(255,200,0,0.8)":"rgba(255,255,255,0.1)")+";background:"+(isEq?"rgba(255,200,0,0.1)":"transparent")+";text-align:center;";
      btn.innerHTML=comp.svg+"<div style='font-size:8px;color:"+comp.color+";margin-top:2px'>"+comp.name+"</div>";
      btn.onclick=()=>{S.equipped_companion=isEq?null:id;save();updateCompanion();renderCosmeticRoulette();};
      eqSection.querySelector("div[style*='display:flex']").appendChild(btn);
    });
    if(!S.equipped_companion){
      const none=document.createElement("span");
      none.style.cssText="font-size:10px;color:#444;align-self:center;";
      none.textContent="None equipped — tap to equip";
      eqSection.querySelector("div[style*='display:flex']").appendChild(none);
    }
    eqSection.querySelector("div[style*='display:flex']").style.cssText+="";
    c.appendChild(eqSection);
  }

  const info=document.createElement("div");
  info.style.cssText="background:rgba(255,180,0,0.08);border:1px solid rgba(255,180,0,0.25);border-radius:10px;padding:10px;font-size:11px;color:#aaa;text-align:center;";
  info.innerHTML="<b style='color:#ffd700'>Cosmetic Roulette</b><br>Win a companion to display on your screen!<br><span style='color:#ffd700;font-size:13px'>💰 100 coins per spin</span>";
  c.appendChild(info);

  // Roulette area
  const rouletteArea=document.createElement("div");
  rouletteArea.id="cosmetic-roulette-area";
  rouletteArea.style.cssText="min-height:80px;display:flex;align-items:center;justify-content:center;";
  rouletteArea.innerHTML="<div style='color:#555;font-size:12px;letter-spacing:2px'>Press SPIN to play</div>";
  c.appendChild(rouletteArea);

  // Result display
  const resultDiv=document.createElement("div");
  resultDiv.id="cosmetic-roulette-result";
  resultDiv.style.cssText="text-align:center;font-size:13px;min-height:24px;color:#888;";
  c.appendChild(resultDiv);

  // Odds table
  const odds=document.createElement("div");
  odds.style.cssText="display:grid;grid-template-columns:repeat(4,1fr);gap:5px;";
  COMPANIONS.forEach(comp=>{
    const cell=document.createElement("div");
    cell.style.cssText="background:rgba(255,255,255,0.04);border-radius:8px;padding:6px;text-align:center;border:1px solid rgba(255,255,255,0.07);";
    cell.innerHTML="<div style='display:flex;justify-content:center;margin-bottom:2px'>"+comp.svg+"</div>"+
      "<div style='font-size:9px;color:"+comp.color+"'>"+comp.name+"</div>"+
      "<div style='font-size:8px;color:#555'>"+comp.rarity+"</div>";
    odds.appendChild(cell);
  });
  c.appendChild(odds);

  // Spin button
  const spinBtn=document.createElement("button");
  spinBtn.id="cosmetic-spin-btn";
  spinBtn.style.cssText="padding:14px;background:linear-gradient(145deg,#2a1a00,#aa6600);border:1px solid #ffaa00;border-radius:10px;color:#ffd700;font-family:'Courier New',monospace;font-size:13px;font-weight:bold;cursor:pointer;letter-spacing:2px;";
  spinBtn.textContent="🎰 SPIN — 100 🪙";
  spinBtn.onclick=()=>{
    if(S.coins<100){toast("❌ Need 100 coins!");return;}
    S.coins-=100;updateHUD();save();
    spinBtn.disabled=true;spinBtn.style.opacity="0.5";
    document.getElementById("cosmetic-roulette-result").textContent="";

    animateRoulette("cosmetic-roulette-area",COMPANIONS,
      comp=>comp.svg,
      ()=>weightedRoulettePick(COMPANIONS,comp=>COMP_WEIGHTS[comp.rarity]),
      true // isSVG
    );

    document.getElementById("cosmetic-roulette-area").addEventListener("landed",function handler(e){
      document.getElementById("cosmetic-roulette-area").removeEventListener("landed",handler);
      const comp=e.detail;
      const isNew=!S.companions.includes(comp.id);
      if(isNew) S.companions.push(comp.id);
      S.equipped_companion=comp.id;
      save();updateCompanion();
      document.getElementById("cosmetic-roulette-result").innerHTML=
        "<div style='display:inline-flex;align-items:center;gap:8px'>"+comp.svg+"<span style='color:"+comp.color+";font-size:16px;font-weight:bold'>"+comp.name+"</span></div><br>"+
        "<span style='color:#aaa;font-size:11px'>("+comp.rarity+")</span>"+
        (isNew?"<br><span style='color:#60e880;font-size:11px'>✨ NEW companion unlocked!</span>":
                "<br><span style='color:#888;font-size:11px'>Auto-equipped!</span>");
      spinBtn.disabled=false;spinBtn.style.opacity="1";
    });
  };
  c.appendChild(spinBtn);
}

// ── Item Roulette ─────────────────────────────────────────────────────────────
function renderItemRoulette(){
  const c=document.getElementById("overlay-content");
  c.className="";c.style.cssText="padding:10px;display:flex;flex-direction:column;gap:10px;";
  c.innerHTML="";

  const info=document.createElement("div");
  info.style.cssText="background:rgba(80,80,220,0.08);border:1px solid rgba(80,80,220,0.25);border-radius:10px;padding:10px;font-size:11px;color:#aaa;text-align:center;";
  info.innerHTML="<b style='color:#8080ff'>Item Roulette</b><br>Same loot table as Rare Potion Chest<br>"+
    "<span style='color:#8080ff;font-size:13px'>🎟️ 1 ticket per spin (1 in 10,000 per roll)</span><br>"+
    "<span style='color:#ffd700'>You have: "+S.roulette_tickets+" ticket"+(S.roulette_tickets!==1?"s":"")+"</span>";
  c.appendChild(info);

  const rouletteArea=document.createElement("div");
  rouletteArea.id="item-roulette-area";
  rouletteArea.style.cssText="min-height:80px;display:flex;align-items:center;justify-content:center;";
  rouletteArea.innerHTML="<div style='color:#555;font-size:12px;letter-spacing:2px'>Press SPIN to play</div>";
  c.appendChild(rouletteArea);

  const resultDiv=document.createElement("div");
  resultDiv.id="item-roulette-result";
  resultDiv.style.cssText="text-align:center;font-size:13px;min-height:24px;color:#888;";
  c.appendChild(resultDiv);

  // Show Rare chest odds
  const oddsDiv=document.createElement("div");
  oddsDiv.style.cssText="background:rgba(255,255,255,0.03);border-radius:8px;padding:8px;font-size:9px;color:#555;line-height:1.8;";
  const rareTable=CHEST_TABLES.Rare;
  const totalW=rareTable.reduce((s,r)=>s+r.w,0);
  oddsDiv.innerHTML="<div style='color:#8080ff;font-size:10px;margin-bottom:4px;letter-spacing:2px'>POSSIBLE REWARDS</div>"+
    rareTable.map(row=>{
      const pct=((row.w/totalW)*100).toFixed(1);
      return "<span style='color:#aaa'>"+row.item+"</span> <span style='color:#555'>("+pct+"%)</span>";
    }).join("  ·  ");
  c.appendChild(oddsDiv);

  const spinBtn=document.createElement("button");
  spinBtn.style.cssText="padding:14px;background:linear-gradient(145deg,#0a0a2a,#2020aa);border:1px solid #4040ff;border-radius:10px;color:#8080ff;font-family:'Courier New',monospace;font-size:13px;font-weight:bold;cursor:pointer;letter-spacing:2px;";
  spinBtn.textContent="🎟️ SPIN — 1 Ticket";
  spinBtn.onclick=()=>{
    if(S.roulette_tickets<1){toast("❌ No tickets! (1/10,000 drop chance)");return;}
    S.roulette_tickets--;save();
    // Update ticket count in info
    info.querySelector("span[style*='ffd700']").textContent="You have: "+S.roulette_tickets+" ticket"+(S.roulette_tickets!==1?"s":"");
    spinBtn.disabled=true;spinBtn.style.opacity="0.5";
    document.getElementById("item-roulette-result").textContent="";

    // Pick result using Rare chest table
    const picked=weightedRoulettePick(CHEST_TABLES.Rare,row=>row.w);
    // Build display items for animation (item name abbreviations)
    const displayItems=CHEST_TABLES.Rare.map(r=>r);

    animateRoulette("item-roulette-area",displayItems,
      row=>{
        const emojis={"Lucky Potion":"🍀","Speed Potion":"⚡","Fortune II":"🧪","Fortune III":"🧪",
          "Haste Potion II":"🏃","Godly Potion (Zeus)":"⚡","Godly Potion (Poseidon)":"🔱",
          "Godly Potion (Hades)":"💀","Potion of Bound":"🔮","Warp Potion":"⏩","Transcendent Potion":"🌟"};
        return emojis[row.item]||"📦";
      },
      ()=>picked
    );

    document.getElementById("item-roulette-area").addEventListener("landed",function handler(e){
      document.getElementById("item-roulette-area").removeEventListener("landed",handler);
      const row=e.detail;
      const qty=row.qty();
      S.owned_items[row.item]=(S.owned_items[row.item]||0)+qty;
      save();updateHUD();
      document.getElementById("item-roulette-result").innerHTML=
        "<span style='color:#ffd700;font-size:16px'>+"+qty+"× "+row.item+"</span><br>"+
        "<span style='color:#888;font-size:10px'>Added to your items!</span>";
      spinBtn.disabled=false;spinBtn.style.opacity="1";
    });
  };
  c.appendChild(spinBtn);
}

// ── Companions screen ─────────────────────────────────────────────────────────
function renderCompanions(){
  const c=document.getElementById("overlay-content");
  c.className="grid";c.style.cssText="";c.innerHTML="";

  const banner=document.createElement("div");
  banner.style.cssText="grid-column:1/-1;padding:8px 10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;font-size:10px;margin-bottom:4px;";
  banner.innerHTML="<span style='color:#888;letter-spacing:2px'>EQUIPPED: </span>"+
    (S.equipped_companion?
      "<span style='color:#ffd700'>"+COMPANIONS.find(x=>x.id===S.equipped_companion)?.emoji+" "+COMPANIONS.find(x=>x.id===S.equipped_companion)?.name+"</span>":
      "<span style='color:#444'>None</span>");
  c.appendChild(banner);

  if(!S.companions.length){
    c.innerHTML+='<div class="empty-msg" style="grid-column:1/-1">No companions yet!<br/>Spin the Cosmetic Roulette!</div>';
    return;
  }
  S.companions.forEach(id=>{
    const comp=COMPANIONS.find(x=>x.id===id);if(!comp)return;
    const eq=S.equipped_companion===id;
    const card=document.createElement("div");card.className="card";
    card.style.cssText+="text-align:center;border-color:rgba(255,200,0,"+(eq?"0.7":"0.2")+");"+
      (eq?"background:rgba(255,200,0,0.07);":"");
    card.innerHTML="<div style='display:flex;justify-content:center;margin:4px 0'>"+comp.svg+"</div>"+
      "<div class='card-name' style='color:"+comp.color+"'>"+comp.name+"</div>"+
      "<div class='card-sub'>"+comp.rarity+"</div>"+
      "<button style='margin-top:6px;width:100%;padding:5px;background:"+(eq?"rgba(255,80,80,0.15)":"rgba(255,200,0,0.15)")+
      ";border:1px solid "+(eq?"rgba(255,80,80,0.3)":"rgba(255,200,0,0.3)")+
      ";border-radius:5px;color:"+(eq?"#ff8080":"#ffd700")+
      ";font-family:inherit;font-size:10px;cursor:pointer;'>"+(eq?"Remove":"Equip")+"</button>";
    card.querySelector("button").onclick=(e)=>{
      e.stopPropagation();
      S.equipped_companion=eq?null:id;
      save();updateCompanion();renderCompanions();
    };
    c.appendChild(card);
  });
}

// ── Companion display (bottom-right puppet) ───────────────────────────────────
function updateCompanion(){
  let el=document.getElementById("companion-display");
  if(!el){
    el=document.createElement("div");
    el.id="companion-display";
    // Position above the equipped-aura-badge (badge is bottom:74px right:10px, height ~40px)
    el.style.cssText="position:fixed;bottom:118px;right:6px;width:192px;height:288px;z-index:15;pointer-events:none;transition:opacity 0.5s;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.9));";
    document.body.appendChild(el);
  }
  if(S.equipped_companion){
    const comp=COMPANIONS.find(x=>x.id===S.equipped_companion);
    el.style.opacity="1";
    el.innerHTML=comp?comp.svg:"";
    // Force the SVG to fill the container
    const svgEl=el.querySelector("svg");
    if(svgEl){svgEl.setAttribute("width","100%");svgEl.setAttribute("height","100%");svgEl.style.display="block";}
  } else {
    el.style.opacity="0";
    el.innerHTML="";
  }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  ROLL CHAT LABEL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CHAT_TIER_NAMES=["Common","Uncommon","Rare","Epic","Unique","Legendary","Mythic","Exalted","Transcendent"];
const CHAT_TIER_COLS=["#999","#b070ff","#00e5ff","#ffd700","#ff70ff","#ff5050","#ffff40","#ffffff","#ffffff"];

function addChatEntry(name, chance, col, glow, tier){
  const min = S.chatMinChance || 1;
  if(chance < min) return;

  const chat = document.getElementById("roll-chat");
  if(!chat) return;

  const t = Math.min(tier, CHAT_TIER_NAMES.length-1);
  const tName = CHAT_TIER_NAMES[t];
  const tCol  = CHAT_TIER_COLS[t];
  const nameCol = "rgb("+glow[0]+","+glow[1]+","+glow[2]+")";
  const border  = "rgb("+col[0]+","+col[1]+","+col[2]+")";

  const div = document.createElement("div");
  div.className = "chat-entry";
  div.style.borderLeftColor = border;
  div.innerHTML =
    "<div style='font-size:9px;color:"+tCol+";letter-spacing:2px;text-transform:uppercase'>"+tName+"</div>" +
    "<div style='color:"+nameCol+";font-size:14px;font-weight:bold;text-shadow:0 0 8px "+border+"'>"+name+"</div>" +
    "<div style='color:#555;font-size:10px'>1 in "+chance.toLocaleString()+"</div>";

  // Insert after the title div (index 1), so newest is at top of list
  const title = chat.querySelector("#roll-chat-title");
  const ref = title ? title.nextSibling : null;
  chat.insertBefore(div, ref);

  // Fade and remove after 7s
  setTimeout(function(){
    div.style.opacity = "0";
    setTimeout(function(){ if(div.parentNode) div.parentNode.removeChild(div); }, 700);
  }, 7000);

  // Keep max 7 entries
  while(chat.childElementCount > 20){
    chat.removeChild(chat.lastChild);
  }
