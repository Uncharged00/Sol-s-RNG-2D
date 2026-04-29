//  AUDIO ENGINE  —  scheduler-based, drift-free, loops forever
//  Web Audio API only — no files, fully offline
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let AC=null, masterGain=null;
var musicEnabled=true;
let activeThemeKey=null;
// Each theme runner returns a "stop" function
let stopCurrentTheme=null;

// ── AudioContext singleton ────────────────────────────────────────────────
function getAC(){
  if(!AC){
    AC=new(window.AudioContext||window.webkitAudioContext)();
    masterGain=AC.createGain();
    masterGain.gain.value=0;
    masterGain.connect(AC.destination);
  }
  return AC;
}

// ── Low-level helpers ─────────────────────────────────────────────────────
function note(n,oct=4){
  const ns={C:0,'C#':1,D:2,'D#':3,E:4,F:5,'F#':6,G:7,'G#':8,A:9,'A#':10,B:11};
  return 440*Math.pow(2,(ns[n]+(oct-4)*12-9)/12);
}

function makeReverb(ac,secs=2.5,decay=2.0){
  const conv=ac.createConvolver();
  const len=Math.floor(ac.sampleRate*secs);
  const buf=ac.createBuffer(2,len,ac.sampleRate);
  for(let ch=0;ch<2;ch++){
    const d=buf.getChannelData(ch);
    for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,decay);
  }
  conv.buffer=buf;
  return conv;
}

function makeDist(ac,amount=8){
  const ws=ac.createWaveShaper();
  const c=new Float32Array(256);
  for(let i=0;i<256;i++){const x=i/128-1; c[i]=x*(3+amount)/(1+amount*Math.abs(x));}
  ws.curve=c; ws.oversample='2x';
  return ws;
}

// Schedule a single note: type,freq,vol,start,dur,destination,detuneCents
function schedNote(ac,type,freq,vol,t0,dur,dst,det=0){
  const o=ac.createOscillator(), g=ac.createGain();
  o.type=type; o.frequency.value=freq;
  if(det) o.detune.value=det;
  const atk=Math.min(0.04,dur*0.1), rel=Math.min(0.08,dur*0.2);
  g.gain.setValueAtTime(0,t0);
  g.gain.linearRampToValueAtTime(vol,t0+atk);
  g.gain.setValueAtTime(vol,t0+dur-rel);
  g.gain.linearRampToValueAtTime(0,t0+dur);
  o.connect(g); g.connect(dst);
  o.start(t0); o.stop(t0+dur+0.02);
  return o;
}

// White-noise burst
function schedNoise(ac,vol,t0,dur,filterFreq,dst){
  const bufLen=Math.floor(ac.sampleRate*Math.max(dur,0.02));
  const buf=ac.createBuffer(1,bufLen,ac.sampleRate);
  const d=buf.getChannelData(0); for(let i=0;i<bufLen;i++) d[i]=Math.random()*2-1;
  const src=ac.createBufferSource(), g=ac.createGain();
  const f=ac.createBiquadFilter(); f.type='bandpass'; f.frequency.value=filterFreq; f.Q.value=0.8;
  const rel=Math.min(0.04,dur*0.5);
  g.gain.setValueAtTime(vol,t0); g.gain.linearRampToValueAtTime(0,t0+dur);
  src.buffer=buf; src.connect(f); f.connect(g); g.connect(dst);
  src.start(t0); src.stop(t0+dur+0.01);
  return src;
}

// Fade master in/out
function fadeMaster(toVal,dur){
  const ac=getAC();
  masterGain.gain.cancelScheduledValues(ac.currentTime);
  masterGain.gain.linearRampToValueAtTime(toVal,ac.currentTime+dur);
}

// ── Theme runner ──────────────────────────────────────────────────────────
// Each theme is a generator function that yields { scheduleUpTo, stop }
// The scheduler calls scheduleUpTo(ac.currentTime+lookahead) repeatedly.

const LOOKAHEAD=0.3;   // schedule this many seconds ahead
const TICK_MS  =100;   // how often to run scheduler (ms)

function runScheduler(scheduleFn){
  // scheduleFn(upTo) — schedules all events up to time upTo, returns true while alive
  let alive=true;
  let tid;
  function tick(){
    if(!alive) return;
    const ac=getAC();
    scheduleFn(ac.currentTime+LOOKAHEAD);
    tid=setTimeout(tick,TICK_MS);
  }
  tick();
  return ()=>{ alive=false; clearTimeout(tid); };
}

// ── Stop everything ───────────────────────────────────────────────────────
function stopMusic(fadeDur=1.4){
  if(stopCurrentTheme){ stopCurrentTheme(); stopCurrentTheme=null; }
  fadeMaster(0,fadeDur);
  activeThemeKey=null;
}

// ── Switch theme ──────────────────────────────────────────────────────────
function playTheme(key){
  if(activeThemeKey===key) return;
  // fade out old
  if(stopCurrentTheme){ stopCurrentTheme(); stopCurrentTheme=null; }
  fadeMaster(0,1.0);
  activeThemeKey=key;
  if(!musicEnabled) return;
  setTimeout(()=>{
    if(activeThemeKey!==key) return; // changed again
    const fn=THEMES[key]||THEMES.default;
    stopCurrentTheme=fn();
    fadeMaster(0.22,1.5);
  },1200);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  THEMES  — each returns a stop() function
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const THEMES={

// ── DEFAULT: chill lo-fi ambient ─────────────────────────────────────────
default(){
  const ac=getAC();
  const rev=makeReverb(ac,3.5,2.2); rev.connect(masterGain);
  const lp=ac.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=1100; lp.Q.value=0.6;
  lp.connect(rev);

  // Cmaj7 chord tones + pentatonic melody
  const CHORD=[note('C',2),note('G',2),note('C',3),note('E',3),note('G',3),note('B',3)];
  const MEL=[note('G',4),note('E',4),note('C',4),note('D',4),note('A',3),note('G',4),note('E',5),note('C',5)];
  const BPM=70, BAR=60/BPM*4, HALF=BAR/2;

  let cursor=ac.currentTime+0.05;
  let bar=0;

  function schedule(upTo){
    while(cursor<upTo){
      // pad: long chord tones overlap 2 bars
      CHORD.forEach((f,i)=> schedNote(ac,'sine',f,0.04+i*0.004,cursor+i*0.07,BAR*2.1,lp));
      // melody: 8 evenly-spaced notes per bar, slight variation each loop
      MEL.forEach((f,i)=>{
        const t=cursor+i*(BAR/MEL.length);
        const variation=(bar%4===3)?note('B',4):f;
        schedNote(ac,'sine',variation,0.065,t,0.45,lp,(Math.random()-0.5)*5);
      });
      // sub-bass pulse every beat
      for(let b=0;b<4;b++) schedNote(ac,'sine',note('C',2),0.07,cursor+b*(BAR/4),(BAR/4)*0.8,lp);
      cursor+=BAR; bar++;
    }
  }
  return runScheduler(schedule);
},

// ── PIXELATION ▣: chiptune, 8-bit chaos ──────────────────────────────────
pixelation(){
  const ac=getAC();
  const dist=makeDist(ac,10);
  const hp=ac.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=180;
  const rev=makeReverb(ac,0.5,3.5);
  dist.connect(hp); hp.connect(rev); rev.connect(masterGain);

  const BPM=150, STEP=60/BPM/2; // 16th notes
  // C minor pentatonic across 3 octaves
  const ARP=[note('C',4),note('Eb',4),note('G',4),note('Bb',4),
             note('C',5),note('G',5),note('Eb',5),note('Bb',5),
             note('C',6),note('Eb',6),note('G',5),note('Bb',4)];
  const BASS=[note('C',3),note('G',2),note('Bb',2),note('F',2),
              note('C',3),note('Eb',3),note('G',2),note('Bb',2)];
  // melodic riff pattern (index into ARP)
  const RIFF=[0,2,4,6,5,3,1,7,8,6,4,2,3,5,7,4];

  let cursor=ac.currentTime+0.05, step=0;
  function schedule(upTo){
    while(cursor<upTo){
      const i=step%RIFF.length;
      const f=ARP[RIFF[i]%ARP.length];
      schedNote(ac,'square',f,0.14,cursor,STEP*0.65,dist);
      // bass every 4 steps
      if(step%4===0) schedNote(ac,'square',BASS[Math.floor(step/4)%BASS.length],0.11,cursor,STEP*3.6,dist);
      // snare (noise) on beats 5 and 13 of 16
      if(step%16===4||step%16===12) schedNoise(ac,0.22,cursor,0.05,5000,hp);
      // kick (low noise) on beats 1 and 9
      if(step%16===0||step%16===8) schedNoise(ac,0.18,cursor,0.08,120,hp);
      // hi-hat every 2 steps
      if(step%2===0) schedNoise(ac,0.10,cursor,0.018,9000,hp);
      cursor+=STEP; step++;
    }
  }
  return runScheduler(schedule);
},

// ── [ Luminosity ]: celestial bell arpeggios ──────────────────────────────
luminosity(){
  const ac=getAC();
  const rev=makeReverb(ac,5,1.5); rev.connect(masterGain);
  const lp=ac.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=5000;
  lp.connect(rev);

  // Cmaj9 spread: C E G B D — across 4 octaves, shimmering
  const ARP=[note('C',4),note('E',4),note('G',4),note('B',4),note('D',5),
             note('G',5),note('B',5),note('E',5),note('C',6),note('B',5),
             note('G',5),note('D',5),note('B',4),note('G',4),note('E',4),note('C',4)];
  const PAD=[note('C',3),note('G',3),note('B',3),note('E',4)];
  const BPM=92, STEP=60/BPM/3; // triplet 8ths
  let cursor=ac.currentTime+0.05, step=0;

  function schedule(upTo){
    while(cursor<upTo){
      // shimmer arpeggio
      const f=ARP[step%ARP.length];
      schedNote(ac,'sine',f,0.08,cursor,STEP*2.8,lp,(step%3===0)?0:(step%3===1?4:-4));
      // octave ghost one step later
      schedNote(ac,'sine',f*2,0.025,cursor+STEP*0.5,STEP*1.5,lp);
      // pad swell every 16 steps
      if(step%16===0) PAD.forEach((pf,i)=> schedNote(ac,'sine',pf,0.04,cursor+i*0.12,STEP*16,lp));
      // sub bass every 12 steps
      if(step%12===0) schedNote(ac,'sine',note('C',2),0.055,cursor,STEP*12,lp);
      cursor+=STEP; step++;
    }
  }
  return runScheduler(schedule);
},

// ── Equinox: yin-yang dual-tone, alternating light/dark ───────────────────
equinox(){
  const ac=getAC();
  const rev=makeReverb(ac,5.5,1.3); rev.connect(masterGain);
  const lp=ac.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2200;
  lp.connect(rev);

  const BPM=52, BAR=60/BPM*4;
  // DAY: Cmaj7 — bright, ascending
  const DAY_CHORD=[note('C',3),note('E',3),note('G',3),note('B',3)];
  const DAY_MEL  =[note('E',4),note('G',4),note('B',4),note('E',5),note('D',5),note('B',4),note('G',4),note('E',4)];
  // NIGHT: Am7b5 — dark, descending
  const NGT_CHORD=[note('A',2),note('C',3),note('Eb',3),note('G',3)];
  const NGT_MEL  =[note('G',4),note('Eb',4),note('C',4),note('A',3),note('Bb',3),note('C',4),note('Eb',4),note('G',4)];

  let cursor=ac.currentTime+0.1, bar=0;
  function schedule(upTo){
    while(cursor<upTo){
      const isDay=(bar%2===0);
      const chord=isDay?DAY_CHORD:NGT_CHORD;
      const mel  =isDay?DAY_MEL:NGT_MEL;
      // pad chord
      chord.forEach((f,i)=> schedNote(ac,'sine',f,isDay?0.055:0.06,cursor+i*0.18,BAR*1.05,lp));
      // slow melody
      mel.forEach((f,i)=>{
        const t=cursor+i*(BAR/mel.length);
        schedNote(ac,'sine',f,0.07,t,BAR/mel.length*0.88,lp,isDay?2:-2);
      });
      // sub bass
      schedNote(ac,'sine',isDay?note('C',2):note('A',1),0.07,cursor,BAR*1.02,lp);
      cursor+=BAR; bar++;
    }
  }
  return runScheduler(schedule);
},

// ── NYCTOPHOBIA: dark ambient dread ──────────────────────────────────────
nyctophobia(){
  const ac=getAC();
  const rev=makeReverb(ac,7,1.0); rev.connect(masterGain);
  const lp=ac.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=600; lp.Q.value=2;
  lp.connect(rev);

  // Tritone drones C + F# + Eb
  const DRONE_FREQS=[note('C',2),note('F#',2),note('Eb',2),note('C',3)];
  const droneOscs=DRONE_FREQS.map((f,i)=>{
    const o=ac.createOscillator(), g=ac.createGain();
    o.type=i%2===0?'sawtooth':'sine'; o.frequency.value=f; o.detune.value=i*3;
    g.gain.value=0.045;
    // LFO tremolo per drone
    const lfo=ac.createOscillator(),lg=ac.createGain();
    lfo.frequency.value=0.08+i*0.03; lg.gain.value=0.02;
    lfo.connect(lg); lg.connect(g.gain); lfo.start();
    o.connect(g); g.connect(lp); o.start();
    return {o,g,lfo};
  });

  // Eerie melodic events scheduled
  const EERIE=[note('C',4),note('F#',4),note('Eb',5),note('Bb',4),note('G#',3)];
  const BPM=36, BEAT=60/BPM;
  let cursor=ac.currentTime+0.1, step=0;
  function schedule(upTo){
    while(cursor<upTo){
      if(step%3===0 && Math.random()<0.65){
        const f=EERIE[Math.floor(Math.random()*EERIE.length)];
        schedNote(ac,'sine',f,0.04,cursor,0.6,rev);
      }
      cursor+=BEAT; step++;
    }
  }
  const stopSched=runScheduler(schedule);
  return ()=>{ stopSched(); droneOscs.forEach(d=>{try{d.o.stop();d.lfo.stop();}catch(e){}}); };
},

// ── MATRIX ▫ REALITY: cold digital pulse ─────────────────────────────────
matrix(){
  const ac=getAC();
  const rev=makeReverb(ac,1.8,2.5); rev.connect(masterGain);
  const bp=ac.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=1400; bp.Q.value=1.5;
  bp.connect(rev);

  const BPM=124, STEP=60/BPM/4; // 16th notes
  // E Phrygian: E F G A B C D
  const SEQ_FREQS=[note('E',4),note('F',4),note('E',4),note('D',4),
                   note('E',4),note('G',4),note('F',4),note('E',4),
                   note('D',4),note('E',4),note('C',4),note('D',4),
                   note('E',4),note('F',4),note('G',4),note('A',4)];
  const BASS=[note('E',2),note('E',2),note('B',1),note('E',2),
              note('A',1),note('E',2),note('D',2),note('E',2)];
  // rhythm gate (0=rest)
  const GATE=[1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,1];

  let cursor=ac.currentTime+0.05, step=0;
  function schedule(upTo){
    while(cursor<upTo){
      const i=step%16;
      if(GATE[i]) schedNote(ac,'sawtooth',SEQ_FREQS[i],0.10,cursor,STEP*0.55,bp);
      if(step%8===0) schedNote(ac,'square',BASS[Math.floor(step/8)%BASS.length],0.10,cursor,STEP*7.5,bp);
      // closed hi-hat every step
      schedNoise(ac,0.08,cursor,0.016,10000,bp);
      // open hat on 5,13
      if(i===4||i===12) schedNoise(ac,0.12,cursor,0.06,7000,bp);
      // kick on 1,9
      if(i===0||i===8) schedNoise(ac,0.16,cursor,0.09,100,bp);
      cursor+=STEP; step++;
    }
  }
  return runScheduler(schedule);
},

// ── ★★★: sparkling Starfall bells ────────────────────────────────────────
stars(){
  const ac=getAC();
  const rev=makeReverb(ac,4.5,1.7); rev.connect(masterGain);
  const lp=ac.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=8000;
  lp.connect(rev);

  // Dmaj9: D F# A C# E
  const ARP=[note('D',5),note('F#',5),note('A',5),note('C#',6),note('E',6),
             note('A',5),note('F#',5),note('D',5),note('C#',5),note('E',5),
             note('A',4),note('F#',4),note('D',4),note('F#',4),note('A',4),note('C#',5)];
  const PAD =[note('D',3),note('A',3),note('F#',3),note('C#',4)];
  const BPM=108, STEP=60/BPM/3;
  let cursor=ac.currentTime+0.05, step=0;

  function schedule(upTo){
    while(cursor<upTo){
      const f=ARP[step%ARP.length];
      schedNote(ac,'sine',f,0.075,cursor,STEP*2.6,lp,(step%2===0)?0:Math.random()*8-4);
      // sparkle octave
      if(step%3===0) schedNote(ac,'sine',f*2,0.025,cursor+STEP*0.4,STEP*1.5,lp);
      // glassy third
      if(step%5===0) schedNote(ac,'triangle',f*1.259,0.03,cursor,STEP*2,lp);
      // pad swell every 16
      if(step%16===0) PAD.forEach((pf,i)=> schedNote(ac,'sine',pf,0.038,cursor+i*0.1,STEP*16,lp));
      // bass
      if(step%12===0) schedNote(ac,'sine',note('D',2),0.05,cursor,STEP*12,lp);
      cursor+=STEP; step++;
    }
  }
  return runScheduler(schedule);
},

// ── ASCENDANT: orchestral swell ───────────────────────────────────────────
ascendant(){
  const ac=getAC();
  const rev=makeReverb(ac,5,1.6); rev.connect(masterGain);
  const lp=ac.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=3000;
  lp.connect(rev);

  const BPM=60, BAR=60/BPM*4;
  // Rising progression: Fmaj7 → Gmaj7 → Amaj7 → Emaj7
  const PROG=[
    [note('F',3),note('A',3),note('C',4),note('E',4)],
    [note('G',3),note('B',3),note('D',4),note('F#',4)],
    [note('A',3),note('C#',4),note('E',4),note('G#',4)],
    [note('E',3),note('G#',3),note('B',3),note('D#',4)],
  ];
  const MEL_PAT=[0,2,3,1,2,3,2,1]; // indices into chord
  let cursor=ac.currentTime+0.1, bar=0;

  function schedule(upTo){
    while(cursor<upTo){
      const chord=PROG[bar%PROG.length];
      // stacked pad with stagger
      chord.forEach((f,i)=> schedNote(ac,'sine',f,0.052,cursor+i*0.15,BAR*1.08,lp,i*2));
      // melody
      MEL_PAT.forEach((ci,i)=>{
        const t=cursor+i*(BAR/MEL_PAT.length);
        const f=chord[ci%chord.length]*2; // up an octave
        schedNote(ac,'sine',f,0.06,t,(BAR/MEL_PAT.length)*0.85,lp);
      });
      // sub bass
      schedNote(ac,'sine',chord[0]/2,0.065,cursor,BAR,lp);
      cursor+=BAR; bar++;
    }
  }
  return runScheduler(schedule);
},

// ── GENESIS / CHROMATIC: pure transcendent tone cluster ──────────────────
genesis(){
  const ac=getAC();
  const rev=makeReverb(ac,8,0.8); rev.connect(masterGain);

  // Pure sine overtone series on C, very slow LFO vibrato
  const FREQS=[note('C',2),note('G',2),note('C',3),note('E',3),
               note('G',3),note('B',3),note('C',4),note('G',4)];
  const oscs=FREQS.map((f,i)=>{
    const o=ac.createOscillator(), g=ac.createGain();
    const lfo=ac.createOscillator(), lg=ac.createGain();
    o.type='sine'; o.frequency.value=f; o.detune.value=i*1.5;
    g.gain.value=0.038;
    lfo.frequency.value=0.04+i*0.008; lg.gain.value=2.5;
    lfo.connect(lg); lg.connect(o.detune); lfo.start();
    o.connect(g); g.connect(rev); o.start();
    return {o,lfo};
  });

  // sparse high tones scheduled
  const HIGH=[note('C',5),note('E',5),note('G',5),note('B',5),note('C',6)];
  let cursor=ac.currentTime+0.1, step=0;
  const BPM=30, BEAT=60/BPM;
  function schedule(upTo){
    while(cursor<upTo){
      if(step%4===0 && Math.random()<0.5){
        const f=HIGH[Math.floor(Math.random()*HIGH.length)];
        schedNote(ac,'sine',f,0.04,cursor,1.2,rev);
      }
      cursor+=BEAT; step++;
    }
  }
  const stopSched=runScheduler(schedule);
  return ()=>{ stopSched(); oscs.forEach(({o,lfo})=>{try{o.stop();lfo.stop();}catch(e){}}); };
},

// ── GLITCH (same key as PIXELATION but wilder) ────────────────────────────
glitch(){
  const ac=getAC();
  const dist=makeDist(ac,14);
  const hp=ac.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=300;
  const rev=makeReverb(ac,0.3,4); rev.connect(masterGain);
  dist.connect(hp); hp.connect(rev);

  const BPM=180, STEP=60/BPM/4;
  const NOTES=[note('C',5),note('Eb',5),note('F#',5),note('G',5),note('Bb',5),
               note('C',6),note('Eb',6),note('G',6),note('Bb',6),note('F#',4)];
  const BASS=[note('C',2),note('F#',2),note('G',2),note('Bb',2)];
  const RIFF=[0,2,4,6,1,3,5,7,8,6,4,2,9,5,3,1];
  let cursor=ac.currentTime+0.05, step=0;
  function schedule(upTo){
    while(cursor<upTo){
      const i=step%16;
      schedNote(ac,'square',NOTES[RIFF[i]%NOTES.length],0.13,cursor,STEP*0.5,dist);
      if(step%4===0) schedNote(ac,'square',BASS[Math.floor(step/4)%BASS.length],0.12,cursor,STEP*3.5,dist);
      // chaotic percussion
      schedNoise(ac,0.12,cursor,0.015,8000,hp);
      if(i%4===0) schedNoise(ac,0.20,cursor,0.07,100,hp);
      if(Math.random()<0.15) schedNoise(ac,0.15,cursor,0.03,3000,hp);
      cursor+=STEP; step++;
    }
  }
  return runScheduler(schedule);
},

}; // end THEMES

// ── Aura → theme mapping ──────────────────────────────────────────────────
const AURA_THEMES={
  "▣ PIXELATION ▣":     "pixelation",
  "[ Luminosity ]":     "luminosity",
  "Equinox":            "equinox",
  "NYCTOPHOBIA":        "nyctophobia",
  "MATRIX ▫ REALITY":   "matrix",
  "★★★":               "stars",
  "ASCENDANT":          "ascendant",
  "GENESIS":            "genesis",
  "CHROMATIC: GENESIS": "genesis",
  "GLITCH":             "glitch",
};

function updateMusic(){
  if(!musicEnabled){ stopMusic(0.8); return; }
  const key=(S.equipped_aura && AURA_THEMES[S.equipped_aura])||"default";
  playTheme(key);
}

// ── Music toggle button ───────────────────────────────────────────────────
(()=>{
  const btn=document.createElement("button");
  btn.id="music-btn";
  btn.textContent="🎵";
  btn.title="Toggle music";
  btn.style.cssText="position:fixed;top:9px;right:9px;background:rgba(0,0,12,0.82);border:1px solid rgba(255,255,255,0.15);border-radius:8px;color:#bbb;font-size:15px;width:34px;height:34px;cursor:pointer;z-index:50;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);padding:0;";
  btn.onclick=()=>{
    musicEnabled=!musicEnabled;
    btn.textContent=musicEnabled?"🎵":"🔇";
    btn.style.opacity=musicEnabled?"1":"0.5";
    if(musicEnabled) updateMusic(); else stopMusic(0.8);
  };
  document.body.appendChild(btn);
})();

// ── Start on first user interaction (browser autoplay policy) ─────────────
let _musicStarted=false;
function _startMusic(){
  if(_musicStarted)return; _musicStarted=true;
  getAC().resume().then(updateMusic);
  document.removeEventListener("pointerdown",_startMusic);
  document.removeEventListener("keydown",_startMusic);
}
document.addEventListener("pointerdown",_startMusic);
document.addEventListener("keydown",_startMusic);


