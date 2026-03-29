// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// cutscenes.js — All cutscene logic (star, full, Equinox, Pixelation)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  CUTSCENE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let csActive=false,csT=0,csDur=0,csAura=null,csTier=0,csParticles=[],csCtx;

function hsl(h,s,l,a=1){return`hsla(${h},${s}%,${l}%,${a})`;}


// ── Star cutscenes for 10k–1B auras ─────────────────────────────────────
let starCsActive=false, starCsT=0, starCsDur=0, starCsAura=null, starCsTier=0;
let starCsParticles=[];

function playStarCutscene(aura,tier){
  // 10k-999k: 4-point star; 1M-99M: 8-point star; 99M-1B: 8-point + extras
  // 1B+: handled by playCutscene already
  if(starCsActive||csActive) return;
  starCsAura=aura; starCsTier=tier; starCsT=0;
  starCsDur=tier<=1?80:tier<=2?120:180;
  starCsParticles=[];
  const cc=document.getElementById("cs-canvas");
  cc.width=window.innerWidth; cc.height=window.innerHeight;
  csCtx=cc.getContext("2d");
  const [name,chance,col,glow]=aura;
  const fs=Math.min(28,14+tier*2);
  const txtEl=document.getElementById("cs-text");
  txtEl.style.opacity="0";
  document.getElementById("cutscene").classList.add("active");
  document.getElementById("aura-display").style.opacity="0";
  starCsActive=true;
  setTimeout(()=>{txtEl.style.opacity="1";},200);
  txtEl.innerHTML=`
    <div style="font-size:10px;color:#222;margin-top:80px;letter-spacing:3px">· tap to continue ·</div>
  `;
  document.getElementById("cutscene").addEventListener("click",endStarCutscene,{once:true});
}

function endStarCutscene(){
  const txtEl=document.getElementById("cs-text");
  txtEl.style.opacity="0";
  setTimeout(()=>{
    const fl=document.getElementById("cs-flash");
    fl.style.transition="opacity 0.05s"; fl.style.opacity="1";
    setTimeout(()=>{
      document.getElementById("cutscene").classList.remove("active");
      starCsActive=false;
      document.getElementById("aura-display").style.opacity="1";
      updateAuraDisplay();
      onCutsceneDone();
      setTimeout(()=>{fl.style.transition="opacity 0.5s";fl.style.opacity="0";},80);
    },120);
  },300);
}

function drawStar(ctx,cx,cy,r,points,col,glow,t,alpha=1){
  // draw n-pointed star
  ctx.save(); ctx.translate(cx,cy); ctx.rotate(t*0.02);
  ctx.beginPath();
  for(let i=0;i<points*2;i++){
    const a=i/(points*2)*Math.PI*2 - Math.PI/2; // full circle, top-aligned
    const rr=(i%2===0)?r:r*0.4;
    i===0?ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr):ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);
  }
  ctx.closePath();
  ctx.fillStyle=`rgba(${col[0]},${col[1]},${col[2]},${alpha*0.7})`;
  ctx.fill();
  ctx.strokeStyle=`rgba(${glow[0]},${glow[1]},${glow[2]},${alpha})`;
  ctx.lineWidth=2; ctx.stroke();
  ctx.restore();
}

function tickStarCutscene(){
  if(!starCsActive) return;
  starCsT++;
  const [name,chance,col,glow]=starCsAura;
  const cc=document.getElementById("cs-canvas");
  const W=cc.width, H=cc.height;
  const cx=W/2, cy=H/2;
  const t=starCsT;
  // fade in over 30 frames, fade out over last 30
  const alpha=Math.min(1,t/30)*Math.min(1,(starCsDur-t)/30);

  // solid dark background
  csCtx.fillStyle="rgba(4,4,14,1)";
  csCtx.fillRect(0,0,W,H);

  const pts=chance>=100000?8:4;

  // grow from 0 to final size, overshoot slightly then settle
  const maxR=Math.min(W,H)*0.28;
  const growT=Math.min(1,t/60);
  const bounce=growT<1?Math.sin(growT*Math.PI)*0.15:0;
  const starR=maxR*(growT+bounce)*alpha;

  if(starR>5){
    // === OUTER GLOW (multiple passes for bloom effect) ===
    for(let pass=3;pass>=0;pass--){
      const gr=csCtx.createRadialGradient(cx,cy,starR*0.5,cx,cy,starR*(2+pass*0.5));
      gr.addColorStop(0,`rgba(${glow[0]},${glow[1]},${glow[2]},${alpha*(0.25-pass*0.05)})`);
      gr.addColorStop(1,"rgba(0,0,0,0)");
      csCtx.beginPath();csCtx.arc(cx,cy,starR*(2+pass*0.5),0,Math.PI*2);
      csCtx.fillStyle=gr;csCtx.fill();
    }

    // === MAIN STAR SHAPE ===
    const rotation=t*0.015;
    // fill
    csCtx.save();csCtx.translate(cx,cy);csCtx.rotate(rotation);
    csCtx.beginPath();
    for(let i=0;i<pts*2;i++){
      const a=i/(pts*2)*Math.PI*2-Math.PI/2;
      const rr=i%2===0?starR:starR*0.38;
      i===0?csCtx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr):csCtx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);
    }
    csCtx.closePath();
    const fillG=csCtx.createRadialGradient(0,0,0,0,0,starR);
    fillG.addColorStop(0,`rgba(${glow[0]},${glow[1]},${glow[2]},${alpha})`);
    fillG.addColorStop(0.6,`rgba(${col[0]},${col[1]},${col[2]},${alpha*0.9})`);
    fillG.addColorStop(1,`rgba(${col[0]},${col[1]},${col[2]},${alpha*0.4})`);
    csCtx.fillStyle=fillG;csCtx.fill();
    // bright stroke
    csCtx.strokeStyle=`rgba(${glow[0]},${glow[1]},${glow[2]},${alpha})`;
    csCtx.lineWidth=2.5;csCtx.stroke();
    csCtx.restore();

    // === INNER COUNTER-ROTATING STAR ===
    csCtx.save();csCtx.translate(cx,cy);csCtx.rotate(-rotation*1.8);
    csCtx.beginPath();
    for(let i=0;i<pts*2;i++){
      const a=i/(pts*2)*Math.PI*2-Math.PI/2;
      const rr=i%2===0?starR*0.5:starR*0.18;
      i===0?csCtx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr):csCtx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);
    }
    csCtx.closePath();
    csCtx.fillStyle=`rgba(${glow[0]},${glow[1]},${glow[2]},${alpha*0.7})`;
    csCtx.fill();
    csCtx.restore();

    // === SPIKE RAYS from star tips ===
    csCtx.save();csCtx.translate(cx,cy);csCtx.rotate(rotation);
    for(let i=0;i<pts;i++){
      const a=i/pts*Math.PI*2-Math.PI/2;
      const x1=Math.cos(a)*starR, y1=Math.sin(a)*starR;
      const x2=Math.cos(a)*starR*1.7, y2=Math.sin(a)*starR*1.7;
      const rayG=csCtx.createLinearGradient(x1,y1,x2,y2);
      rayG.addColorStop(0,`rgba(${glow[0]},${glow[1]},${glow[2]},${alpha*0.8})`);
      rayG.addColorStop(1,`rgba(${glow[0]},${glow[1]},${glow[2]},0)`);
      csCtx.beginPath();csCtx.moveTo(x1,y1);csCtx.lineTo(x2,y2);
      csCtx.strokeStyle=rayG;csCtx.lineWidth=2;csCtx.stroke();
    }
    csCtx.restore();

    // === 8-pt gets extra outer star ring ===
    if(pts===8){
      csCtx.save();csCtx.translate(cx,cy);csCtx.rotate(rotation*0.4+Math.PI/8);
      csCtx.beginPath();
      for(let i=0;i<pts*2;i++){
        const a=i/(pts*2)*Math.PI*2-Math.PI/2;
        const rr=i%2===0?starR*1.4:starR*0.55;
        i===0?csCtx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr):csCtx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);
      }
      csCtx.closePath();
      csCtx.strokeStyle=`rgba(${col[0]},${col[1]},${col[2]},${alpha*0.4})`;
      csCtx.lineWidth=1.5;csCtx.stroke();
      csCtx.restore();
    }
  }

  if(t>=starCsDur) endStarCutscene();
}

// ── special cutscene: Equinox (yin-yang, B&W) ────────────────────────────
function tickEquinox(cc,cx,cy){
  const t=csT;
  const W=cc.width,H=cc.height;
  csCtx.fillStyle="#000";csCtx.fillRect(0,0,W,H);

  // slow rotation angle
  const ang=t*0.018;
  const R=Math.min(cx,cy)*0.52;

  csCtx.save();csCtx.translate(cx,cy);csCtx.rotate(ang);

  // main circle — white half
  csCtx.beginPath();csCtx.arc(0,0,R,-Math.PI/2,Math.PI/2);csCtx.lineTo(0,0);
  csCtx.fillStyle="#fff";csCtx.fill();
  // black half
  csCtx.beginPath();csCtx.arc(0,0,R,Math.PI/2,-Math.PI/2);csCtx.lineTo(0,0);
  csCtx.fillStyle="#111";csCtx.fill();

  // top small white bubble (on black side)
  csCtx.beginPath();csCtx.arc(0,-R/2,R/4,0,Math.PI*2);
  csCtx.fillStyle="#fff";csCtx.fill();
  // bottom small black bubble (on white side)
  csCtx.beginPath();csCtx.arc(0,R/2,R/4,0,Math.PI*2);
  csCtx.fillStyle="#111";csCtx.fill();

  // tiny dots
  csCtx.beginPath();csCtx.arc(0,-R/2,R/12,0,Math.PI*2);
  csCtx.fillStyle="#111";csCtx.fill();
  csCtx.beginPath();csCtx.arc(0,R/2,R/12,0,Math.PI*2);
  csCtx.fillStyle="#fff";csCtx.fill();

  // outer ring
  csCtx.beginPath();csCtx.arc(0,0,R,0,Math.PI*2);
  csCtx.strokeStyle="rgba(255,255,255,0.5)";csCtx.lineWidth=2;csCtx.stroke();

  csCtx.restore();

  // outer glow rings (counter-rotate)
  for(let ri=0;ri<5;ri++){
    const rr=R*1.1+ri*18+Math.sin(t*0.04+ri)*5;
    csCtx.save();csCtx.translate(cx,cy);csCtx.rotate(-ang*(1+ri*0.3));
    const pts=8+ri*4;
    for(let i=0;i<pts;i++){
      const a=i/pts*Math.PI*2;
      const bright=i%2===0?255:80;
      csCtx.beginPath();
      csCtx.moveTo(Math.cos(a)*rr*0.85,Math.sin(a)*rr*0.85);
      csCtx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);
      csCtx.strokeStyle=`rgba(${bright},${bright},${bright},${0.4-ri*0.06})`;
      csCtx.lineWidth=1.5;csCtx.stroke();
    }
    csCtx.restore();
  }

  // B&W particles
  if(t%2===0){
    for(let i=0;i<6;i++){
      const a=rnd()*Math.PI*2,sp=rnd()*3+1;
      const white=rnd()<0.5;
      csParticles.push(new P(cx,cy,
        white?[240,240,240]:[30,30,30],
        rnd()*5+2,Math.cos(a)*sp,Math.sin(a)*sp-2,50+rnd()*50));
    }
  }
}

// ── special cutscene: ▣ PIXELATION ▣ (rainbow) ───────────────────────────
function tickPixelation(cc,cx,cy){
  const t=csT;
  const W=cc.width,H=cc.height;

  // dark bg with shifting rainbow tint
  csCtx.fillStyle=`hsla(${t*2%360},60%,4%,1)`;csCtx.fillRect(0,0,W,H);

  // pixel grid — chunky colored squares marching
  const PS=18;
  const cols=Math.ceil(W/PS)+2,rows=Math.ceil(H/PS)+2;
  for(let row=0;row<rows;row++){
    for(let col=0;col<cols;col++){
      const hue=(col*30+row*20+t*4)%360;
      const bri=Math.sin((col+row)*0.4+t*0.07);
      if(bri>0.3){
        csCtx.fillStyle=`hsla(${hue},100%,55%,${(bri-0.3)*0.35})`;
        csCtx.fillRect(col*PS-PS,row*PS-PS,PS-1,PS-1);
      }
    }
  }

  // rainbow rings (fast spin)
  for(let ri=0;ri<8;ri++){
    const r=40+ri*22+Math.sin(t*0.08+ri)*8;
    csCtx.save();csCtx.translate(cx,cy);
    csCtx.rotate(t*0.025*(ri%2===0?1:-1)*(1+ri*0.2));
    const pts=6+ri*3;
    for(let i=0;i<pts;i++){
      const a=i/pts*Math.PI*2;
      const hue=(i/pts*360+t*6+ri*40)%360;
      csCtx.beginPath();
      csCtx.moveTo(Math.cos(a)*r*0.7,Math.sin(a)*r*0.7);
      csCtx.lineTo(Math.cos(a)*r,Math.sin(a)*r);
      csCtx.strokeStyle=`hsla(${hue},100%,65%,${0.7-ri*0.06})`;
      csCtx.lineWidth=2;csCtx.stroke();
    }
    csCtx.restore();
  }

  // core orb — solid rainbow cycle
  const orbR=28+Math.sin(t*0.1)*4;
  const hueBase=(t*3)%360;
  const orbGr=csCtx.createRadialGradient(cx,cy,0,cx,cy,orbR*2.5);
  orbGr.addColorStop(0,`hsla(${hueBase},100%,80%,1)`);
  orbGr.addColorStop(0.4,`hsla(${(hueBase+60)%360},100%,55%,0.7)`);
  orbGr.addColorStop(1,`hsla(${(hueBase+120)%360},100%,30%,0)`);
  csCtx.beginPath();csCtx.arc(cx,cy,orbR*2.5,0,Math.PI*2);
  csCtx.fillStyle=orbGr;csCtx.fill();
  csCtx.beginPath();csCtx.arc(cx,cy,orbR,0,Math.PI*2);
  csCtx.fillStyle=`hsla(${hueBase},100%,75%,1)`;csCtx.fill();

  // chunky pixel particles
  if(t%2===0){
    for(let i=0;i<8;i++){
      const a=rnd()*Math.PI*2,sp=rnd()*4+2;
      const h=Math.floor(rnd()*360);
      const pCol=[
        Math.round(127+127*Math.cos(h*Math.PI/180)),
        Math.round(127+127*Math.cos((h+120)*Math.PI/180)),
        Math.round(127+127*Math.cos((h+240)*Math.PI/180))
      ];
      csParticles.push(new P(cx,cy,pCol,rnd()*7+3,
        Math.cos(a)*sp,Math.sin(a)*sp-2,55+rnd()*55));
    }
  }

  // scanline glitch strips
  if(t%8<3){
    for(let i=0;i<3;i++){
      const gy=Math.floor(rnd()*H);
      const gh=Math.floor(rnd()*8+2);
      const hh=Math.floor(rnd()*360);
      csCtx.fillStyle=`hsla(${hh},100%,60%,0.15)`;
      csCtx.fillRect(0,gy,W,gh);
    }
  }
}

function flashAndReturn(){
  // White flash then hide cutscene and return to game
  const fl=document.getElementById("cs-flash");
  fl.style.transition="opacity 0.05s";
  fl.style.opacity="1";
  setTimeout(()=>{
    document.getElementById("cutscene").classList.remove("active");
    document.getElementById("cutscene").style.opacity="1";
    document.getElementById("cs-text").style.opacity="1";
    csActive=false;
    csParticles=[];
    document.getElementById("aura-display").style.opacity="1";
    updateAuraDisplay();
    updateEquippedBadge();
    setTimeout(()=>{
      fl.style.transition="opacity 0.6s";
      fl.style.opacity="0";
    },80);
  },120);
}

function triggerFlash(){
  const txtEl=document.getElementById("cs-text");
  txtEl.style.opacity="0";
  setTimeout(()=>{ flashAndReturn(); onCutsceneDone(); }, 400);
}

function playCutscene(aura,tier){
  csAura=aura; csTier=tier; csT=0;
  csDur=[0,0,0,160,200,260,340,440,520][Math.min(tier,8)];
  csParticles=[];
  const cc=document.getElementById("cs-canvas");
  cc.width=window.innerWidth; cc.height=window.innerHeight;
  csCtx=cc.getContext("2d");
  document.getElementById("aura-display").style.opacity="0";
  document.getElementById("cutscene").classList.add("active");
  document.getElementById("cutscene").style.opacity="1";
  document.getElementById("cs-text").innerHTML=
    "<div style='font-size:10px;color:#333;margin-top:80px;letter-spacing:3px'>· tap to continue ·</div>";
  csActive=true;
  document.getElementById("cutscene").addEventListener("click",triggerFlash,{once:true});
}

// ─── per-aura cutscene draw functions ───────────────────────────────────────
function drawCsDefault(cc,cx,cy,col,glow,t,tier){
  // Solid dark bg
  csCtx.fillStyle="rgba(4,4,16,1)"; csCtx.fillRect(0,0,cc.width,cc.height);
  const alpha=Math.min(1,t/30);
  const R=Math.min(cx,cy)*0.5*(Math.min(1,t/60));
  // Outer glow
  const og=csCtx.createRadialGradient(cx,cy,R*0.3,cx,cy,R*2.5);
  og.addColorStop(0,`rgba(${glow[0]},${glow[1]},${glow[2]},${alpha*0.5})`);
  og.addColorStop(0.4,`rgba(${col[0]},${col[1]},${col[2]},${alpha*0.2})`);
  og.addColorStop(1,"rgba(0,0,0,0)");
  csCtx.beginPath();csCtx.arc(cx,cy,R*2.5,0,Math.PI*2);csCtx.fillStyle=og;csCtx.fill();
  // Central orb
  if(R>5){
    const og2=csCtx.createRadialGradient(cx,cy,0,cx,cy,R);
    og2.addColorStop(0,`rgba(${glow[0]},${glow[1]},${glow[2]},${alpha})`);
    og2.addColorStop(0.5,`rgba(${col[0]},${col[1]},${col[2]},${alpha*0.8})`);
    og2.addColorStop(1,`rgba(${col[0]},${col[1]},${col[2]},0)`);
    csCtx.beginPath();csCtx.arc(cx,cy,R,0,Math.PI*2);csCtx.fillStyle=og2;csCtx.fill();
  }
  // Rotating rings — one per tier level above 3
  const rings=tier-2;
  for(let ri=0;ri<rings;ri++){
    const rr=R*(0.8+ri*0.35)+Math.sin(t*0.06+ri)*8;
    csCtx.save();csCtx.translate(cx,cy);csCtx.rotate(t*0.012*(ri%2===0?1:-1));
    const pts=6+ri*2;
    csCtx.beginPath();
    for(let i=0;i<pts*2;i++){
      const a=i/(pts*2)*Math.PI*2;
      const r2=i%2===0?rr:rr*0.55;
      i===0?csCtx.moveTo(Math.cos(a)*r2,Math.sin(a)*r2):csCtx.lineTo(Math.cos(a)*r2,Math.sin(a)*r2);
    }
    csCtx.closePath();
    csCtx.strokeStyle=`rgba(${glow[0]},${glow[1]},${glow[2]},${alpha*(0.7-ri*0.1)})`;
    csCtx.lineWidth=2; csCtx.stroke();
    // fill with faint color
    csCtx.fillStyle=`rgba(${col[0]},${col[1]},${col[2]},${alpha*0.08})`;
    csCtx.fill();
    csCtx.restore();
  }
  // Spike rays from center
  const spikes=8+(tier-3)*4;
  for(let i=0;i<spikes;i++){
    const a=i/spikes*Math.PI*2+t*0.008;
    const len=R*(1.4+Math.sin(t*0.1+i)*0.2);
    const rg=csCtx.createLinearGradient(cx,cy,cx+Math.cos(a)*len,cy+Math.sin(a)*len);
    rg.addColorStop(0,`rgba(${glow[0]},${glow[1]},${glow[2]},${alpha*0.6})`);
    rg.addColorStop(1,"rgba(0,0,0,0)");
    csCtx.beginPath();csCtx.moveTo(cx,cy);csCtx.lineTo(cx+Math.cos(a)*len,cy+Math.sin(a)*len);
    csCtx.strokeStyle=rg;csCtx.lineWidth=1.5+i%2;csCtx.stroke();
  }
  // Particles around the ring
  if(t%3===0){
    const pRing=R*0.9;
    for(let i=0;i<3+tier;i++){
      const a=rnd()*Math.PI*2;
      const px=cx+Math.cos(a)*pRing*(0.7+rnd()*0.6);
      const py=cy+Math.sin(a)*pRing*(0.7+rnd()*0.6);
      csParticles.push(new P(px,py,rnd()<0.5?col:glow,rnd()*4+2,
        (rnd()-0.5)*2,(rnd()-0.5)*2-0.5,40+rnd()*40));
    }
  }
}

function drawCsEquinox(cc,cx,cy,t){
  csCtx.fillStyle=`rgba(4,4,14,1)`; csCtx.fillRect(0,0,cc.width,cc.height);
  const alpha=Math.min(1,t/30);
  const R=Math.min(cx,cy)*0.45*(Math.min(1,t/60));
  if(R<4) return;
  // Yin-yang halves
  csCtx.save();csCtx.translate(cx,cy);csCtx.rotate(t*0.008);
  csCtx.beginPath();csCtx.arc(0,0,R,Math.PI*1.5,Math.PI*0.5);csCtx.fillStyle=`rgba(240,240,240,${alpha})`;csCtx.fill();
  csCtx.beginPath();csCtx.arc(0,0,R,Math.PI*0.5,Math.PI*1.5);csCtx.fillStyle=`rgba(10,10,30,${alpha})`;csCtx.fill();
  csCtx.beginPath();csCtx.arc(0,-R/2,R/2,0,Math.PI*2);csCtx.fillStyle=`rgba(240,240,240,${alpha})`;csCtx.fill();
  csCtx.beginPath();csCtx.arc(0,R/2,R/2,0,Math.PI*2);csCtx.fillStyle=`rgba(10,10,30,${alpha})`;csCtx.fill();
  csCtx.beginPath();csCtx.arc(0,-R/2,R/8,0,Math.PI*2);csCtx.fillStyle=`rgba(10,10,30,${alpha})`;csCtx.fill();
  csCtx.beginPath();csCtx.arc(0,R/2,R/8,0,Math.PI*2);csCtx.fillStyle=`rgba(240,240,240,${alpha})`;csCtx.fill();
  csCtx.beginPath();csCtx.arc(0,0,R,0,Math.PI*2);csCtx.strokeStyle=`rgba(150,150,150,${alpha*0.5})`;csCtx.lineWidth=2;csCtx.stroke();
  csCtx.restore();
  // Orbiting dual rings
  for(let i=0;i<2;i++){
    csCtx.save();csCtx.translate(cx,cy);csCtx.rotate(t*0.015*(i===0?1:-1));
    csCtx.beginPath();csCtx.ellipse(0,0,R*1.5,R*0.35,0,0,Math.PI*2);
    csCtx.strokeStyle=i===0?`rgba(240,240,240,${alpha*0.4})`:`rgba(20,20,60,${alpha*0.8})`;
    csCtx.lineWidth=2;csCtx.stroke();csCtx.restore();
  }
}

function drawCsPixelation(cc,cx,cy,t){
  csCtx.fillStyle=`rgba(0,0,0,0.4)`; csCtx.fillRect(0,0,cc.width,cc.height);
  const alpha=Math.min(1,t/20);
  const PS=12;
  // Expanding pixel ring
  const ringR=Math.min(cx,cy)*0.55*(Math.min(1,t/50));
  for(let x=cx-ringR*1.4;x<cx+ringR*1.4;x+=PS){
    for(let y=cy-ringR*1.4;y<cy+ringR*1.4;y+=PS){
      const d=Math.sqrt((x-cx)**2+(y-cy)**2);
      if(d>ringR*0.7&&d<ringR*1.4){
        const hue=((x+y)*2+(t*30))%360;
        const a=(1-(Math.abs(d-ringR)/ringR*0.7))*alpha*0.8;
        csCtx.fillStyle=`hsla(${hue},100%,55%,${a})`;
        csCtx.fillRect(x,y,PS-1,PS-1);
      }
    }
  }
  // Center flash
  if(t%4<2){
    csCtx.fillStyle=`rgba(${Math.floor(rnd()*255)},${Math.floor(rnd()*255)},${Math.floor(rnd()*255)},0.15)`;
    csCtx.fillRect(cx-50,cy-50,100,100);
  }
}

function tickCutscene(){
  if(!csActive) return;
  csT++;
  const [name,,col,glow]=csAura;
  const cc=document.getElementById("cs-canvas");
  const cx=cc.width/2, cy=cc.height/2;

  if(name==="Equinox") drawCsEquinox(cc,cx,cy,csT);
  else if(name==="▣ PIXELATION ▣") drawCsPixelation(cc,cx,cy,csT);
  else drawCsDefault(cc,cx,cy,col,glow,csT,csTier);

  csParticles=csParticles.filter(p=>p.life>0);
  if(csParticles.length>200)csParticles=csParticles.slice(-200);
  csParticles.forEach(p=>{p.tick();p.draw(csCtx);});

  if(csT>=csDur) triggerFlash();
}

