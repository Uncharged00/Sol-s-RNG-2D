// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// data.js — All static game data (auras, gears, biomes, potions, companions)
// Edit this file to change game values, add auras, tweak recipes, etc.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const AURAS=[
  ["Common",2,[160,160,160],[200,200,200],null],
  ["Uncommon",4,[100,200,100],[140,255,140],null],
  ["Good",5,[120,220,120],[160,255,160],null],
  ["Natural",8,[80,180,80],[100,220,100],null],
  ["Rare",16,[60,140,255],[100,180,255],null],
  ["Divinus",32,[200,180,100],[240,220,140],null],
  ["Crystallized",64,[160,220,255],[200,240,255],null],
  ["Rage",128,[220,40,40],[255,80,80],null],
  ["Topaz",150,[255,180,0],[255,220,80],null],
  ["Ruby",350,[255,30,60],[255,100,120],null],
  ["Forbidden",404,[100,0,200],[160,60,255],"Cyberspace"],
  ["Emerald",500,[0,200,80],[60,255,120],null],
  ["Gilded",512,[255,200,0],[255,240,80],"Sandstorm"],
  ["Ink",700,[20,20,40],[80,80,120],null],
  ["Jackpot",777,[255,215,0],[255,255,100],null],
  ["Sapphire",800,[30,100,255],[80,160,255],null],
  ["Aquamarine",900,[0,200,200],[80,255,240],null],
  ["Wind",900,[180,220,255],[220,240,255],"Windy"],
  ["Glacier",768,[140,200,255],[180,230,255],"Snowy"],
  ["Diaboli",1004,[180,0,60],[255,60,120],null],
  ["Precious",1024,[255,160,0],[255,200,80],null],
  ["Magnetic",2048,[60,60,200],[100,100,255],null],
  ["Sidereum",4096,[200,180,255],[220,210,255],null],
  ["Bleeding",4444,[200,0,40],[255,60,100],null],
  ["Flushed",6900,[255,120,180],[255,180,220],null],
  ["Hazard",7000,[255,200,0],[255,240,100],"Corruption"],
  ["Quartz",8192,[220,180,255],[240,210,255],null],
  ["Undead",12000,[60,200,60],[100,255,100],"Hell"],
  ["Corrosive",12000,[100,200,0],[160,255,60],"Corruption"],
  ["Rage: Heated",12800,[255,60,0],[255,140,40],null],
  ["Ink: Leak",14000,[0,0,80],[60,60,180],null],
  ["Powered",16384,[255,255,0],[255,255,120],null],
  ["Solar",50000,[255,180,0],[255,220,80],null],
  ["Lunar",50000,[180,180,255],[220,220,255],null],
  ["Aquatic",40000,[0,180,255],[80,220,255],null],
  ["Starlight",50000,[220,200,255],[240,230,255],"Starfall"],
  ["Flushed: Lobotomy",69000,[255,80,160],[255,160,220],null],
  ["Nautilus",70000,[0,160,200],[60,200,240],"Rainy"],
  ["Hazard: Rays",70000,[255,220,0],[255,255,100],"Corruption"],
  ["Permafrost",73500,[180,220,255],[220,240,255],"Snowy"],
  ["Stormal",90000,[100,100,255],[160,160,255],"Windy"],
  ["Exotic",99999,[0,240,160],[80,255,200],null],
  ["Diaboli: Void",100400,[80,0,160],[160,60,255],null],
  ["Undead: Devil",120000,[255,0,0],[255,80,80],"Hell"],
  ["Comet",120000,[200,200,255],[220,220,255],"Starfall"],
  ["Jade",125000,[0,200,120],[80,255,180],null],
  ["Bounded",200000,[100,0,200],[180,60,255],null],
  ["Eclipse",300000,[255,140,0],[255,200,80],"_craftonly"],
  ["Celestial",350000,[255,220,120],[255,240,180],null],
  ["Krawthuite",850000,[0,160,255],[80,200,255],null],
  ["Arcane",1000000,[160,0,255],[200,80,255],null],
  ["Undefined",1111000,[0,255,180],[80,255,220],"Null"],
  ["Gravitational",2000000,[80,0,200],[160,60,255],null],
  ["Bounded: Unbound",2000000,[140,0,255],[200,80,255],null],
  ["Virtual",2500000,[0,200,255],[80,240,255],"Cyberspace"],
  ["Aquatic: Flame",4000000,[255,100,0],[255,180,60],null],
  ["Poseidon",4000000,[0,100,200],[60,160,255],"Rainy"],
  ["Zeus",4500000,[255,255,100],[255,255,200],null],
  ["Galaxy",5000000,[100,0,200],[180,60,255],"Starfall"],
  ["Hades",6000000,[60,0,100],[140,0,200],"Hell"],
  ["Hypervolt",7500000,[0,255,120],[80,255,180],null],
  ["Starscorge",10000000,[255, 100, 100],[255,150,150],"Starfall"],
  ["Exotic: APEX",9000000,[0,255,180],[80,255,220],null],
  ["CHROMATIC: GENESIS",99999999,[255,100,255],[255,180,255],null],
  ["Starscorge: Radiant",100000000,[255,100,255],[255,180,255],"Starfall"],
  ["Spectraflow",100000000,[255,100,255],[255,180,255],null],
  ["Lily",112000000,[255,100,255],[255,180,255],null],
  ["Overture",150000000,[255,100,255],[255,180,255],null],
  ["Symphony",175000000,[255,100,255],[255,180,255],null],
  ["Twilight: Withering Grace",180000000,[255,100,255],[255,180,255],null],
  ["Felled",180000000,[255,100,255],[255,180,255],"Hell"],
  ["Impeached",200000000,[255,100,255],[255,180,255],"Corruption"],
  ["Lumenpool",220000000,[255,100,255],[255,180,255],"Rainy"],
  ["Hypervolt: Ever-storm",225000000,[255,100,255],[255,180,255],null],
  ["Astral: Zodiac",267200000,[255,100,255],[255,180,255],"Starfall"],
  ["Prophecy",275649430,[255,100,255],[255,180,255],"Heaven"],
  ["Exotic: Void",299999999,[255,100,255],[255,180,255],null],
  ["Overture: History",300000000,[255,100,255],[255,180,255],null],
  ["Bloodlust",300000000,[255,100,255],[255,180,255],"Hell"],
  ["Maelstrom",309999999,[255,100,255],[255,180,255],"Windy"],
  ["Perpetual",315000000,[255,100,255],[255,180,255],null],
  ["Lotusfall",320000000,[255,100,255],[255,180,255],null],
  ["Jazz: Orchestra",336870912,[255,100,255],[255,180,255],null],
  ["Archangel",350000000,[255,100,255],[255,180,255],"Heaven"],
  ["ATLAS",360000000,[200,160,80],[255,210,100],"Sandstorm"],
  ["Flora: Evergreen",370073730,[200,160,80],[255,210,100], null],
  ["CHILLSEAR",360000000,[200,160,80],[255,210,100],"Snowy"],
  ["Abyssal Hunter",400000000,[200,160,80],[255,210,100],"Rainy"],
  ["Gargantua",430000000,[200,160,80],[255,210,100],"Starfall"],
  ["Apostolos",444000000,[200,160,80],[255,210,100],"Sandstorm"],
  ["Kyawthuite: Remembrance",450000000,[200,160,80],[255,210,100],"null"],
  ["Ruins",500000000,[200,160,80],[255,210,100],null],
  ["Matrix: Overdrive",503000000,[200,160,80],[255,210,100],"Cyberspace"],
  ["Sailor: Admiral",540000000,[200,160,80],[255,210,100],"Sandstorm"],
  ["Elude",555555555000,[200,160,80],[255,210,100],"Null"],
  ["Sophyra",570000000,[200,160,80],[255,210,100],null],
  ["MATRIX ▫ REALITY",600000000,[0,255,200],[80,255,230],"Cyberspace"],
  ["Prologue",666616111000,[200,160,80],[255,210,100],"Null"],
  ["Pythios",666666666,[200,160,80],[255,210,100],"Hell"],
  ["Sovereign",750000000,[200,160,80],[255,210,100],null],
  ["Ruins: Withered",800000000,[200,160,80],[255,210,100],null],
  ["Aegis",825000000,[200,160,80],[255,210,100],"Cyberspace"],
  ["Dreamscape",850000000000,[200,160,80],[255,210,100],"Null"],
  ["ASCENDANT",935000000,[200,160,255],[240,200,255],"Heaven"],
  ["GLITCH",12210110000000000,[0,255,120],[80,255,180],"Glitch"],
  ["[OPPRESSION]",220000000000000000,[0,255,120],[80,255,180],"Glitch"],
  ["★",100000000000,[255,255,100],[255,255,200],"Dreamspace"],
  ["★★",1000000000000,[255,255,100],[255,255,200],"Dreamspace"],
  ["★★★",10000000000000,[255,255,100],[255,255,200],"Dreamspace"],
  ["Borealis",13333333000000000,[255,255,100],[255,255,200],"Dreamspace"],
  ["Dreammetric",320000000000000000,[255,255,100],[255,255,200],"Dreamspace"],
  ["NYCTOPHOBIA",1011111010000,[20,0,60],[100,0,180],"Null"],
  ["▣ PIXELATION ▣",1073741824,[0,255,80],[80,255,160],"Cyberspace"],
  ["[ Luminosity ]",1200000000,[255,255,200],[255,255,255],null],
  ["Equinox",2500000000,[255,140,0],[255,220,120],null],
];

const BIOMES=[
  // dur=seconds, spawnChance=per second natural chance
  // controllerWeight = relative weight when using Strange Controller/Biome Randomizer (0=excluded from controllers)
  // rare=true means it can only be summoned via Cyberspace controller logic (1/5000 special)
  {name:"Normal",    emoji:"🌍",color:[100,100,140],mult:1,  dur:0,   spawnChance:0,        item:null,            itemQty:0, controllerWeight:0,   rare:false},
  {name:"Windy",     emoji:"💨",color:[100,180,255],mult:3,  dur:120, spawnChance:1/500,    item:"Wind Essence",  itemQty:1, controllerWeight:20,  rare:false},
  {name:"Rainy",     emoji:"🌧️",color:[60,120,200], mult:4,  dur:120, spawnChance:1/750,    item:"Rainy Bottle",  itemQty:1, controllerWeight:20,  rare:false},
  {name:"Snowy",     emoji:"❄️",color:[200,220,255],mult:3,  dur:120, spawnChance:1/600,    item:"Icicle",        itemQty:1, controllerWeight:20,  rare:false},
  {name:"Starfall",  emoji:"🌟",color:[200,150,255],mult:10, dur:600, spawnChance:1/7500,   item:"Piece of Star", itemQty:3, controllerWeight:10,  rare:false},
  {name:"Corruption",emoji:"☠️",color:[120,0,200],  mult:20, dur:660, spawnChance:1/9000,   item:"Curruptaine",   itemQty:5, controllerWeight:8,   rare:false},
  {name:"Hell",      emoji:"🔥",color:[255,60,0],   mult:15, dur:666, spawnChance:1/6666,   item:"Eternal Flame", itemQty:3, controllerWeight:10,  rare:false},
  {name:"Sandstorm", emoji:"⏳",color:[200,160,60], mult:4,  dur:120, spawnChance:1/3000,   item:"Hourglass",     itemQty:1, controllerWeight:15,  rare:false},
  {name:"Heaven",    emoji:"🪽",color:[255,255,180],mult:5,  dur:660, spawnChance:1/7777,   item:"Feather Vial",  itemQty:3, controllerWeight:8,   rare:false},
  {name:"Null",      emoji:"Ø", color:[120,120,120],mult:30, dur:99,  spawnChance:1/10100,  item:"NULL",          itemQty:5, controllerWeight:5,   rare:false},
  {name:"Glitch",    emoji:"⚡",color:[0,255,120],  mult:30, dur:164, spawnChance:1/3000000,item:null,            itemQty:0, controllerWeight:2,   rare:false},
  {name:"Dreamspace",emoji:"★", color:[160,100,255],mult:30, dur:192, spawnChance:1/3500000,item:null,            itemQty:0, controllerWeight:2,   rare:false},
  {name:"Cyberspace",emoji:"💾",color:[0,200,255],  mult:50, dur:720, spawnChance:0,        item:null,            itemQty:0, controllerWeight:0,   rare:true},
];

const POTIONS=[
  {name:"Fortune I",   luck_add:150, dur:300, color:[200,200,80],  cost:200},
  {name:"Fortune II",  luck_add:200, dur:420, color:[220,220,100], cost:500},
  {name:"Fortune III", luck_add:250, dur:600, color:[255,255,120], cost:1200},
  {name:"Lucky Potion",luck_add:300, dur:600, color:[255,215,0],   cost:2500},
  {name:"Heavenly",  luck_add:100000,dur:60,color:[255,240,160], cost:100000},
];

const GEARS=[
  // ── RIGHT HAND (T1–T9) ─────────────────────────────────────────────────
  {name:"Luck Glove",       hand:"R",tier:"T1",luck_add:25,   speed_add:0,   coin_mult:1.0,  color:[40,160,40],   cost:500,     effect:"+25% Luck"},
  {name:"Desire Glove",     hand:"R",tier:"T1",luck_add:50,   speed_add:0,   coin_mult:1.0,  color:[80,180,80],   cost:1500,    effect:"+50% Luck"},
  {name:"Solar Device",     hand:"R",tier:"T2",luck_add:50,   speed_add:15,  coin_mult:1.0,  color:[255,180,0],   cost:5000,    effect:"+50% Luck, +15% Speed"},
  {name:"Lunar Device",     hand:"R",tier:"T2",luck_add:0,    speed_add:25,  coin_mult:1.0,  color:[160,160,255], cost:5000,    effect:"+25% Speed"},
  {name:"Shining Star",     hand:"R",tier:"T2",luck_add:50,   speed_add:0,   coin_mult:1.0,  color:[255,240,100], cost:8000,    effect:"+50% Luck (+5× in Starfall)"},
  {name:"Eclipse Device",   hand:"R",tier:"T3",luck_add:50,   speed_add:15,  coin_mult:1.0,  color:[255,140,0],   cost:15000,   effect:"+50% Luck, +15% Speed"},
  {name:"Exo Gauntlet",     hand:"R",tier:"T3",luck_add:100,  speed_add:20,  coin_mult:1.0,  color:[0,200,160],   cost:30000,   effect:"+100% Luck, +20% Speed"},
  {name:"Jackpot Gauntlet", hand:"R",tier:"T3",luck_add:77,   speed_add:7,   coin_mult:1.77, color:[255,215,0],   cost:50000,   effect:"+77% Luck, +7% Speed, +77% Coins"},
  {name:"Frozen Gauntlet",  hand:"R",tier:"T3",luck_add:150,  speed_add:-25, coin_mult:1.0,  color:[160,220,255], cost:40000,   effect:"+150% Luck, -25% Speed"},
  {name:"Windstorm Device", hand:"R",tier:"T4",luck_add:115,  speed_add:25,  coin_mult:1.0,  color:[180,210,255], cost:80000,   effect:"+115% Luck, +25% Speed"},
  {name:"Subzero Device",   hand:"R",tier:"T5",luck_add:150,  speed_add:30,  coin_mult:1.0,  color:[100,200,255], cost:150000,  effect:"+150% Luck, +30% Speed"},
  {name:"Galactic Device",  hand:"R",tier:"T5",luck_add:250,  speed_add:30,  coin_mult:1.0,  color:[80,0,200],    cost:200000,  effect:"+250% Luck, +30% Speed"},
  {name:"Volcanic Device",  hand:"R",tier:"T6",luck_add:290,  speed_add:35,  coin_mult:1.0,  color:[255,80,0],    cost:400000,  effect:"+290% Luck, +35% Speed"},
  {name:"Exoflex Device",   hand:"R",tier:"T6",luck_add:340,  speed_add:35,  coin_mult:1.0,  color:[0,255,160],   cost:600000,  effect:"+340% Luck, +35% Speed"},
  {name:"Hologrammer",      hand:"R",tier:"T7",luck_add:400,  speed_add:40,  coin_mult:1.0,  color:[0,200,255],   cost:1000000, effect:"+400% Luck, +40% Speed"},
  {name:"Ragnaröker",       hand:"R",tier:"T7",luck_add:455,  speed_add:40,  coin_mult:1.0,  color:[200,0,100],   cost:1500000, effect:"+450% Luck, +40% Speed"},
  {name:"Starshaper",       hand:"R",tier:"T8",luck_add:600,  speed_add:50,  coin_mult:1.5,  color:[255,220,80],  cost:3000000, effect:"+600% Luck, +50% Speed"},
  {name:"Neuralyzer",       hand:"R",tier:"T8",luck_add:750,  speed_add:60,  coin_mult:1.0,  color:[0,255,200],   cost:5000000, effect:"+750% Luck, +60% Speed"},
  {name:"Genesis Drive",    hand:"R",tier:"T8",luck_add:1200, speed_add:80,  coin_mult:2.0,  color:[255,255,255], cost:10000000,effect:"+1200% Luck, +80% Speed"},
  {name:"Heavenly Device",  hand:"R",tier:"T9",luck_add:1500, speed_add:120, coin_mult:3.0,  color:[255,240,160], cost:50000000,effect:"+1500% Luck, +120% Speed"},
  // ── LEFT HAND ──────────────────────────────────────────────────────────
  
  {name:"Gemstone Gauntlet",     hand:"L",tier:"T3",bonus_mult:2,   every_bonus:false,luck_add:50, speed_add:0,coin_mult:1.0, color:[100,200,200], cost:40000,   effect:"+80% Luck (randomised each roll)"},
  {name:"Tide Gauntlet",         hand:"L",tier:"T3",bonus_mult:2,   every_bonus:false,luck_add:50,speed_add:0,coin_mult:1.0, color:[0,160,220],   cost:35000,   effect:"+50% Luck, every 6th roll = Rainy"},
  {name:"Flesh Device",          hand:"L",tier:"T5",bonus_mult:1.3, every_bonus:true, luck_add:0, speed_add:0,coin_mult:1.0, color:[200,80,80],   cost:80000,   effect:"Every roll is a Bonus Roll (×1.3)"},
  {name:"Blessed Tide Gauntlet", hand:"L",tier:"T5",bonus_mult:2,   every_bonus:false,luck_add:120,speed_add:10,coin_mult:1.0,color:[0,200,255],  cost:200000,  effect:"+120% Luck, every 6th roll = Starfall"},
  {name:"Gravitational Device",  hand:"L",tier:"T8",bonus_mult:6,   every_bonus:false,luck_add:0, speed_add:0,coin_mult:1.0, color:[100,0,255],   cost:500000,  effect:"Bonus Roll Multiplier: ×6"},
  {name:"Pole Light Core Device",hand:"L",tier:"T9",bonus_mult:0,every_bonus:false,luck_add:500,speed_add:0,coin_mult:1.0,color:[0,180,255],cost:0,effect:"+500% Luck, every 30th roll 5x Polar Shift stacks"},
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  AURA RECIPES  (craft rare auras from materials)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const AURA_RECIPES=[
  {
    aura:"Eclipse",
    desc:"The Eclipse aura. Craft from Solar + Lunar auras.",
    color:[255,140,0],
    glow:[255,200,80],
    ingredients:[
      {name:"Solar",qty:1},
      {name:"Lunar",qty:1},
    ]
  },
  {
    aura:"Atlas : A.T.L.A.S.",
    desc:"Automated Terrestrial Legacy Analysis Sentinel. Digital mutation of ATLAS. Craft-only Glorious aura.",
    color:[0,200,255],
    glow:[80,240,255],
    ingredients:[
      {name:"ATLAS",qty:1},
      {name:"Virtual",qty:3},
      {name:"Comet",qty:2},
      {name:"Powered",qty:5},
      {name:"Gear Basing",qty:10},
    ]
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  TALISMANS  (sold by Rin, 1 slot equippable)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TALISMANS=[
  {
    name:"Sunstone Talisman",
    emoji:"☀️",color:"#ffaa20",
    desc:"+100% Basic Luck (daytime only — always active here)",
    luck_add:100,
    cost:50000,
    effect:()=>100, // flat luck add
  },
  {
    name:"Moonstone Talisman",
    emoji:"🌙",color:"#aabbff",
    desc:"+100% Basic Luck (nighttime only — always active here)",
    luck_add:100,
    cost:50000,
    effect:()=>100,
  },
  {
    name:"Day and Night Talisman",
    emoji:"🌓",color:"#ff8844",
    desc:"+125% Basic Luck permanently",
    luck_add:125,
    cost:250000,
    effect:()=>125,
  },
  {
    name:"Overtime Talisman",
    emoji:"⏱️",color:"#44ff88",
    desc:"+1% Luck per stack (1 stack every 10 min, max 10 = +10% max)",
    luck_add:0,
    cost:0, // earned via quest milestone
    effectDynamic:(stacks)=>stacks,
  },
  {
    name:"Soul Collector's Talisman",
    emoji:"👻",color:"#aaaaff",
    desc:"+0.04% Luck per Lost Soul rolled (max 10,000 stacks = +400%)",
    luck_add:0,
    cost:1000000,
    effectDynamic:(stacks)=>stacks*0.04,
  },
  {
    name:"Soul Master Talisman",
    emoji:"👻",color:"#aaaaff",
    desc:"+0.04% Luck per Lost Soul rolled (max 10,000 stacks = +400%) + 400% luck",
    luck_add:0,
    cost:1000000,
    effectDynamic:(stacks)=>stacks*0.04 + 400,
  },
];

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
    {item:"Lucky Potion",  w:20,qty:()=>Math.ceil(rnd()*5+2)},
    {item:"Speed Potion",  w:20,qty:()=>Math.ceil(rnd()*5+2)},
    {item:"Fortune II",    w:20,qty:()=>1},
    {item:"Fortune III",   w:12,qty:()=>1},
    {item:"Haste Potion II",w:10,qty:()=>1},
    {item:"Godly Potion (Zeus)",w:5,qty:()=>1},
    {item:"Godly Potion (Poseidon)",w:5,qty:()=>1},
    {item:"Godly Potion (Hades)",w:5,qty:()=>1},
    {item:"Potion of Bound",w:2,qty:()=>1},
    {item:"Warp Potion",   w:1, qty:()=>1},
    {item:"Transcendent Potion",w:0.05,qty:()=>1},
  ],
  Mega:[
    {item:"Fortune III",   w:20,qty:()=>Math.ceil(rnd()*3)},
    {item:"Godly Potion (Zeus)",w:15,qty:()=>1},

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  GLOVE DISPLAY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function rRect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);
  ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
  ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);
  ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);
  ctx.closePath();
}

function drawGlove(ctx, x, y, size, col, isLeft, squeeze){
  const r=col[0],g=col[1],b=col[2];
  const bright=`rgba(${Math.min(255,r+60)},${Math.min(255,g+60)},${Math.min(255,b+60)},1)`;
  const mid=`rgba(${r},${g},${b},0.85)`;
  const dark=`rgba(${Math.max(0,r-50)},${Math.max(0,g-50)},${Math.max(0,b-50)},0.9)`;
  const glow=`rgba(${r},${g},${b},0.25)`;

  ctx.save();
  ctx.translate(x,y);
  if(isLeft) ctx.scale(-1,1);
  ctx.translate(squeeze*size*0.1,0);

  const S=size*1.3; // 30% bigger than before

  // ── Drop shadow / glow behind glove ──────────────────────────
  ctx.shadowColor=`rgba(${r},${g},${b},0.5)`;
  ctx.shadowBlur=S*0.4;

  // ── CUFF ─────────────────────────────────────────────────────
  const cuffGrad=ctx.createLinearGradient(-S*0.3,S*0.18,S*0.3,S*0.6);
  cuffGrad.addColorStop(0,bright);
  cuffGrad.addColorStop(0.4,mid);
  cuffGrad.addColorStop(1,dark);
  rRect(ctx,-S*0.3,S*0.18,S*0.6,S*0.5,S*0.12);
  ctx.fillStyle=cuffGrad; ctx.fill();
  // Cuff highlight band
  rRect(ctx,-S*0.3,S*0.18,S*0.6,S*0.12,S*0.06);
  ctx.fillStyle=`rgba(${Math.min(255,r+100)},${Math.min(255,g+100)},${Math.min(255,b+100)},0.5)`;
  ctx.fill();
  // Cuff outline
  rRect(ctx,-S*0.3,S*0.18,S*0.6,S*0.5,S*0.12);
  ctx.strokeStyle=bright; ctx.lineWidth=1.5; ctx.stroke();

  ctx.shadowBlur=0;

  // ── PALM ──────────────────────────────────────────────────────
  const palmGrad=ctx.createRadialGradient(-S*0.06,-S*0.06,S*0.02,0,0,S*0.38);
  palmGrad.addColorStop(0,bright);
  palmGrad.addColorStop(0.5,mid);
  palmGrad.addColorStop(1,dark);
  ctx.beginPath();
  ctx.ellipse(0,S*0.02,S*0.32,S*0.4,0,0,Math.PI*2);
  ctx.fillStyle=palmGrad; ctx.fill();
  ctx.strokeStyle=bright; ctx.lineWidth=1.5; ctx.stroke();

  // Palm inner highlight
  ctx.beginPath();
  ctx.ellipse(-S*0.06,-S*0.06,S*0.12,S*0.1,0.3,0,Math.PI*2);
  ctx.fillStyle=`rgba(${Math.min(255,r+120)},${Math.min(255,g+120)},${Math.min(255,b+120)},0.2)`;
  ctx.fill();

  // ── FINGERS ───────────────────────────────────────────────────
  const fDefs=[
    {ox:-S*0.215,oy:-S*0.3,angle:-0.22,fw:S*0.13,fh:S*0.34},
    {ox:-S*0.07, oy:-S*0.34,angle:-0.06,fw:S*0.135,fh:S*0.38},
    {ox: S*0.075,oy:-S*0.33,angle: 0.06,fw:S*0.135,fh:S*0.36},
    {ox: S*0.215,oy:-S*0.28,angle: 0.22,fw:S*0.13,fh:S*0.32},
  ];
  fDefs.forEach((f,i)=>{
    ctx.save();
    ctx.translate(f.ox,f.oy);
    ctx.rotate(f.angle);
    const fGrad=ctx.createLinearGradient(-f.fw*0.5,-f.fh,f.fw*0.5,0);
    fGrad.addColorStop(0,bright);
    fGrad.addColorStop(0.5,mid);
    fGrad.addColorStop(1,dark);
    rRect(ctx,-f.fw*0.5,-f.fh,f.fw,f.fh,S*0.07);
    ctx.fillStyle=fGrad; ctx.fill();
    ctx.strokeStyle=bright; ctx.lineWidth=1.2; ctx.stroke();
    // Finger crease lines
    ctx.strokeStyle=`rgba(${Math.max(0,r-30)},${Math.max(0,g-30)},${Math.max(0,b-30)},0.5)`;
    ctx.lineWidth=0.8;
    [-f.fh*0.35,-f.fh*0.65].forEach(cy=>{
      ctx.beginPath();ctx.moveTo(-f.fw*0.35,cy);ctx.lineTo(f.fw*0.35,cy);ctx.stroke();
    });
    ctx.restore();
  });

  // ── THUMB ────────────────────────────────────────────────────
  ctx.save();
  ctx.translate(-S*0.32,-S*0.04);
  ctx.rotate(-0.55);
  const tGrad=ctx.createLinearGradient(-S*0.08,-S*0.22,S*0.08,0);
  tGrad.addColorStop(0,bright); tGrad.addColorStop(1,dark);
  rRect(ctx,-S*0.075,-S*0.24,S*0.15,S*0.26,S*0.07);
  ctx.fillStyle=tGrad; ctx.fill();
  ctx.strokeStyle=bright; ctx.lineWidth=1.2; ctx.stroke();
  ctx.restore();

  // ── KNUCKLE RIDGES ───────────────────────────────────────────
  fDefs.forEach((f,i)=>{
    if(i===3) return;
    const kx=(fDefs[i].ox+fDefs[i+1].ox)*0.5;
    ctx.beginPath();
    ctx.arc(kx,-S*0.28,S*0.04,0,Math.PI*2);
    ctx.fillStyle=bright; ctx.fill();
  });

  ctx.restore();
}

// Color map for each gear
const GEAR_COLORS={
  "Luck Glove":[40,160,40],"Desire Glove":[80,180,80],"Solar Device":[255,180,0],
  "Lunar Device":[160,160,255],"Shining Star":[255,240,100],"Eclipse Device":[255,140,0],
  "Exo Gauntlet":[0,200,160],"Jackpot Gauntlet":[255,215,0],"Frozen Gauntlet":[160,220,255],
  "Windstorm Device":[180,210,255],"Subzero Device":[100,200,255],"Galactic Device":[80,0,200],
  "Volcanic Device":[255,80,0],"Exoflex Device":[0,255,160],"Hologrammer":[0,200,255],
  "Ragnaröker":[200,0,100],"Starshaper":[255,220,80],"Neuralyzer":[0,255,200],
  "Genesis Drive":[255,255,255],"Heavenly Device":[255,240,160],
  "Jackpot Gauntlet (L)":[255,215,0],"Gemstone Gauntlet":[100,200,200],
  "Tide Gauntlet":[0,160,220],"Flesh Device":[200,80,80],
  "Blessed Tide Gauntlet":[0,200,255],"Gravitational Device":[100,0,255],
};

function drawGloves(ctx, cx, cy, r, ts){
  if(!S.lastAura) return;
  const squeeze=Math.sin(ts*2.5)*0.3+0.5; // breathing squeeze toward orb
  const size=r*0.72;
  const offset=r*1.7;

  if(S.equipped_R){
    const col=GEAR_COLORS[S.equipped_R]||[200,200,200];
    drawGlove(ctx, cx+offset, cy, size, col, false, squeeze);
  }
  if(S.equipped_L){
    const col=GEAR_COLORS[S.equipped_L]||[160,160,255];
    drawGlove(ctx, cx-offset, cy, size, col, true, squeeze);
  }
}
