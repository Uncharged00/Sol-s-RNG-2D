// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// draw.js — Canvas rendering: orb, gloves, aura effects, stars
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MAIN DRAW
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function draw(t){
  const W=bgC.width,H=bgC.height;
  bgX.fillStyle="#08081A";bgX.fillRect(0,0,W,H);
  // stars
  const ts=t/1000;
  for(const s of STARS){
    const a=0.25+0.4*Math.sin(ts*s.s+s.x*9);
    bgX.beginPath();bgX.arc(s.x*W,s.y*H,s.r,0,Math.PI*2);
    bgX.fillStyle=rgba([255,255,255],a);bgX.fill();
  }
  // biome tint
  if(S.biomeIdx>0){
    bgX.fillStyle=rgba(BIOMES[S.biomeIdx].color,0.05);bgX.fillRect(0,0,W,H);
  }
  // particles
  S.particles=S.particles.filter(p=>p.life>0);
  if(S.particles.length>120)S.particles=S.particles.slice(-120);
  S.particles.forEach(p=>{p.tick();p.draw(bgX);});
  // aura orb — bigger, with name rendered inside
  if(S.lastAura){
    const {name,col,glow,tier,isBonus}=S.lastAura;
    const cx=W/2,cy=H*0.42;
    const r=58+tier*10+Math.sin(ts*2.2)*6;
    // outer glow halo
    const g=bgX.createRadialGradient(cx,cy,0,cx,cy,r*2.8);
    g.addColorStop(0,rgba(glow,0.9));g.addColorStop(0.35,rgba(col,0.5));g.addColorStop(0.7,rgba(col,0.15));g.addColorStop(1,rgba(col,0));
    bgX.beginPath();bgX.arc(cx,cy,r*2.8,0,Math.PI*2);bgX.fillStyle=g;bgX.fill();
    // orb core
    const inner=bgX.createRadialGradient(cx,cy-r*0.2,r*0.1,cx,cy,r);
    inner.addColorStop(0,rgba([255,255,255],0.9));
    inner.addColorStop(0.4,rgba(glow,0.85));
    inner.addColorStop(1,rgba(col,0.6));
    bgX.beginPath();bgX.arc(cx,cy,r,0,Math.PI*2);bgX.fillStyle=inner;bgX.fill();
    // aura name on orb
    const maxW=r*1.8;
    const nameFontSize=Math.max(11,Math.min(22,r*0.38));
    bgX.save();
    bgX.font=`bold ${nameFontSize}px 'Courier New'`;
    bgX.textAlign='center';bgX.textBaseline='middle';
    bgX.shadowBlur=10;bgX.shadowColor=rgba(col,0.9);
    bgX.fillStyle='rgba(255,255,255,0.95)';
    // word-wrap name if needed
    const words=name.split(' ');
    let lines=[],cur='';
    for(const w of words){
      const test=cur?cur+' '+w:w;
      if(bgX.measureText(test).width>maxW&&cur){lines.push(cur);cur=w;}
      else cur=test;
    }
    if(cur) lines.push(cur);
    const lh=nameFontSize*1.2;
    const startY=cy-(lines.length-1)*lh/2;
    lines.forEach((l,i)=>bgX.fillText(l,cx,startY+i*lh));
    bgX.shadowBlur=0;bgX.restore();
    // Unique aura effect
    // Draw equipped gloves on sides of orb (behind aura effects)
    drawGloves(bgX,cx,cy,r,ts);
    drawAuraEffect(bgX,name,cx,cy,r,ts);
  }
  // cooldown bar handled by visual loop
}


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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  UNIQUE AURA EFFECTS  (drawn on main canvas)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Each effect receives (ctx, cx, cy, r, ts) and draws extra visuals around the orb

const AURA_EFFECTS={
  // ── UNIQUE tier (10k-99k) ──────────────────────────────────────────────────
  "Undead":(ctx,cx,cy,r,ts)=>{
    // Green rising soul wisps
    for(let i=0;i<5;i++){const a=i/5*Math.PI*2+ts*0.3;const dist=r*1.4+Math.sin(ts*2+i)*10;const wx=cx+Math.cos(a)*dist,wy=cy+Math.sin(a)*dist-Math.sin(ts*1.5+i)*15;
    const g=ctx.createRadialGradient(wx,wy,0,wx,wy,12);g.addColorStop(0,"rgba(60,255,60,0.7)");g.addColorStop(1,"rgba(60,255,60,0)");ctx.beginPath();ctx.arc(wx,wy,12,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();}},
  "Corrosive":(ctx,cx,cy,r,ts)=>{
    // Acid drip rings expanding outward
    for(let i=0;i<3;i++){const rr=r*(1.2+i*0.4)+((ts*40+i*33)%80);const a=0.15-rr/600;if(a>0){ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);ctx.strokeStyle=`rgba(120,220,0,${a})`;ctx.lineWidth=2;ctx.stroke();}}},
  "Rage: Heated":(ctx,cx,cy,r,ts)=>{
    // Flame tongues licking outward
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2+ts*0.4;const len=r*0.7+Math.sin(ts*3+i*1.3)*20;ctx.beginPath();ctx.moveTo(cx,cy);ctx.quadraticCurveTo(cx+Math.cos(a+0.4)*len*0.6,cy+Math.sin(a+0.4)*len*0.6,cx+Math.cos(a)*len,cy+Math.sin(a)*len);ctx.strokeStyle=`rgba(255,${80+i*20},0,0.6)`;ctx.lineWidth=3;ctx.stroke();}},
  "Ink: Leak":(ctx,cx,cy,r,ts)=>{
    // Ink tendrils spreading
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2+Math.sin(ts*0.5+i)*0.3;const len=r+20+Math.sin(ts*1.2+i*2)*15;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r*0.8,cy+Math.sin(a)*r*0.8);ctx.lineTo(cx+Math.cos(a)*len,cy+Math.sin(a)*len);ctx.strokeStyle=`rgba(40,40,120,0.7)`;ctx.lineWidth=2.5+Math.sin(ts+i);ctx.stroke();}},
  "Powered":(ctx,cx,cy,r,ts)=>{
    // Electric arcs
    for(let i=0;i<4;i++){if(Math.random()<0.3){const a=rnd()*Math.PI*2;ctx.beginPath();ctx.moveTo(cx,cy);let px=cx,py=cy;for(let j=0;j<5;j++){px+=Math.cos(a+rnd()*1-0.5)*r*0.3;py+=Math.sin(a+rnd()*1-0.5)*r*0.3;ctx.lineTo(px,py);}ctx.strokeStyle="rgba(255,255,80,0.8)";ctx.lineWidth=1.5;ctx.stroke();}}},
  "Solar":(ctx,cx,cy,r,ts)=>{
    // Sun ray spikes + corona pulse
    for(let i=0;i<12;i++){const a=i/12*Math.PI*2+ts*0.05;const len=r*1.3+Math.sin(ts*2+i)*10;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);ctx.lineTo(cx+Math.cos(a)*len,cy+Math.sin(a)*len);ctx.strokeStyle=`rgba(255,220,0,0.7)`;ctx.lineWidth=2;ctx.stroke();}},
  "Lunar":(ctx,cx,cy,r,ts)=>{
    // Orbiting crescent moons
    for(let i=0;i<3;i++){const a=i/3*Math.PI*2+ts*0.4;const mx=cx+Math.cos(a)*(r*1.5),my=cy+Math.sin(a)*(r*1.5);ctx.beginPath();ctx.arc(mx,my,8,0,Math.PI*2);ctx.fillStyle="rgba(180,180,255,0.7)";ctx.fill();ctx.beginPath();ctx.arc(mx+5,my-3,6,0,Math.PI*2);ctx.fillStyle="rgba(8,8,26,0.9)";ctx.fill();}},
  "Aquatic":(ctx,cx,cy,r,ts)=>{
    // Water ripple rings + bubbles
    for(let i=0;i<3;i++){const rr=r*(1.1+i*0.35)+((ts*30+i*40)%70);const a=0.2-rr/500;if(a>0){ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);ctx.strokeStyle=`rgba(0,180,255,${a})`;ctx.lineWidth=1.5;ctx.stroke();}}
    for(let i=0;i<4;i++){const a=i*1.57+ts*0.5;const bx=cx+Math.cos(a)*(r*1.2),by=cy+Math.sin(a)*(r*1.2)-10;ctx.beginPath();ctx.arc(bx,by,4,0,Math.PI*2);ctx.strokeStyle="rgba(0,200,255,0.5)";ctx.lineWidth=1.5;ctx.stroke();}},
  "Starlight":(ctx,cx,cy,r,ts)=>{
    // Twinkling star field around orb
    for(let i=0;i<10;i++){const a=i/10*Math.PI*2+ts*0.1;const dist=r*1.3+Math.sin(i*7.3)*r*0.4;const sx=cx+Math.cos(a)*dist,sy=cy+Math.sin(a)*dist;const tw=0.4+0.6*Math.abs(Math.sin(ts*2+i*1.7));ctx.beginPath();ctx.arc(sx,sy,3,0,Math.PI*2);ctx.fillStyle=`rgba(220,200,255,${tw})`;ctx.fill();}},
  "Flushed: Lobotomy":(ctx,cx,cy,r,ts)=>{
    // Pink hearts floating up
    for(let i=0;i<4;i++){const hx=cx+(i-1.5)*r*0.5,hy=cy-r*0.8-((ts*25+i*20)%80);const a=0.8-((ts*25+i*20)%80)/100;if(a>0){ctx.save();ctx.translate(hx,hy);ctx.fillStyle=`rgba(255,100,180,${a})`;ctx.beginPath();ctx.arc(-4,0,5,0,Math.PI*2);ctx.arc(4,0,5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(-8,0);ctx.lineTo(0,10);ctx.lineTo(8,0);ctx.fill();ctx.restore();}}},
  "Nautilus":(ctx,cx,cy,r,ts)=>{
    // Spiral shell pattern
    ctx.beginPath();for(let t=0;t<Math.PI*6;t+=0.1){const rad=r*0.4+t*r*0.08;const x=cx+Math.cos(t+ts*0.3)*rad,y=cy+Math.sin(t+ts*0.3)*rad;t<0.1?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle="rgba(0,160,200,0.4)";ctx.lineWidth=1.5;ctx.stroke();},
  "Hazard: Rays":(ctx,cx,cy,r,ts)=>{
    // Warning stripes — alternating yellow/black rotating wedges
    ctx.save();ctx.translate(cx,cy);ctx.rotate(ts*0.5);
    for(let i=0;i<8;i++){
      const a=i/8*Math.PI*2;
      ctx.beginPath();ctx.moveTo(0,0);
      ctx.arc(0,0,r*1.7,a,a+Math.PI/8);
      ctx.closePath();
      ctx.fillStyle=i%2===0?'rgba(255,200,0,0.25)':'rgba(0,0,0,0.15)';
      ctx.fill();
    }
    // outer warning ring
    ctx.beginPath();ctx.arc(0,0,r*1.7,0,Math.PI*2);
    ctx.strokeStyle='rgba(255,200,0,0.4)';ctx.lineWidth=2;ctx.stroke();
    ctx.restore();},
  "Permafrost":(ctx,cx,cy,r,ts)=>{
    // Ice crystal spikes
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2+ts*0.05;const len=r*1.4;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);ctx.lineTo(cx+Math.cos(a)*len,cy+Math.sin(a)*len);ctx.strokeStyle="rgba(180,230,255,0.7)";ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*len*0.7,cy+Math.sin(a)*len*0.7);ctx.lineTo(cx+Math.cos(a+0.3)*(len*0.5),cy+Math.sin(a+0.3)*(len*0.5));ctx.stroke();}},
  "Stormal":(ctx,cx,cy,r,ts)=>{
    // Wind spiral
    ctx.save();ctx.translate(cx,cy);ctx.rotate(ts*1.2);for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(0,0,r*(1.1+i*0.2),0,Math.PI*1.5);ctx.strokeStyle=`rgba(150,200,255,${0.4-i*0.1})`;ctx.lineWidth=3-i;ctx.stroke();}ctx.restore();},
  "Exotic":(ctx,cx,cy,r,ts)=>{
    // Rainbow shimmer rings
    for(let i=0;i<5;i++){const rr=r*(1.1+i*0.15);const hue=(ts*60+i*72)%360;ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);ctx.strokeStyle=`hsla(${hue},100%,60%,0.3)`;ctx.lineWidth=2;ctx.stroke();}},
  // ── LEGENDARY tier (100k-999k) ─────────────────────────────────────────────
  "Diaboli: Void":(ctx,cx,cy,r,ts)=>{
    // Dark void tendrils
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2+ts*0.2;const len=r*1.5+Math.sin(ts*1.5+i)*20;ctx.beginPath();ctx.moveTo(cx,cy);ctx.quadraticCurveTo(cx+Math.cos(a+0.6)*r,cy+Math.sin(a+0.6)*r,cx+Math.cos(a)*len,cy+Math.sin(a)*len);ctx.strokeStyle=`rgba(80,0,160,0.5)`;ctx.lineWidth=2;ctx.stroke();}},
  "Undead: Devil":(ctx,cx,cy,r,ts)=>{
    // Hellfire pillars
    for(let i=0;i<5;i++){const x=cx+(i-2)*r*0.5,y=cy+r;const h=r*0.6+Math.sin(ts*3+i)*15;ctx.beginPath();ctx.rect(x-6,y-h,12,h);const fg=ctx.createLinearGradient(x,y-h,x,y);fg.addColorStop(0,"rgba(255,0,0,0)");fg.addColorStop(1,"rgba(255,0,0,0.5)");ctx.fillStyle=fg;ctx.fill();}},
  "Comet":(ctx,cx,cy,r,ts)=>{
    // Comet trail
    const angle=ts*0.5;for(let i=0;i<20;i++){const tr=r*1.5+i*8;const tx=cx+Math.cos(angle+Math.PI)*tr,ty=cy+Math.sin(angle+Math.PI)*tr;const ta=0.5-i*0.025;ctx.beginPath();ctx.arc(tx,ty,4-i*0.15,0,Math.PI*2);ctx.fillStyle=`rgba(200,200,255,${ta})`;ctx.fill();}},
  "Jade":(ctx,cx,cy,r,ts)=>{
    // Bamboo-green hexagon rings
    for(let i=0;i<2;i++){ctx.save();ctx.translate(cx,cy);ctx.rotate(ts*0.1+i*Math.PI/6);ctx.beginPath();for(let j=0;j<6;j++){const a=j/6*Math.PI*2;const rr=r*(1.3+i*0.25);j===0?ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr):ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.strokeStyle=`rgba(0,200,120,0.4)`;ctx.lineWidth=2;ctx.stroke();ctx.restore();}},
  "Bounded":(ctx,cx,cy,r,ts)=>{
    // Orbiting constraint rings
    for(let i=0;i<3;i++){ctx.save();ctx.translate(cx,cy);ctx.rotate(ts*(0.3+i*0.2)*(i%2?1:-1));ctx.beginPath();ctx.ellipse(0,0,r*(1.4+i*0.2),r*0.4,0,0,Math.PI*2);ctx.strokeStyle=`rgba(100,0,200,0.4)`;ctx.lineWidth=2;ctx.stroke();ctx.restore();}},
  "Celestial":(ctx,cx,cy,r,ts)=>{
    // Divine light rays + orbiting halos
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2+ts*0.04;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);ctx.lineTo(cx+Math.cos(a)*r*2,cy+Math.sin(a)*r*2);ctx.strokeStyle=`rgba(255,240,180,0.4)`;ctx.lineWidth=1.5;ctx.stroke();}
    ctx.save();ctx.translate(cx,cy);ctx.rotate(ts*0.2);ctx.beginPath();ctx.ellipse(0,0,r*1.5,r*0.3,0,0,Math.PI*2);ctx.strokeStyle="rgba(255,230,120,0.5)";ctx.lineWidth=2;ctx.stroke();ctx.restore();},
  "Krawthuite":(ctx,cx,cy,r,ts)=>{
    // Deep blue crystal shards orbiting
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2+ts*0.35;const sx=cx+Math.cos(a)*r*1.5,sy=cy+Math.sin(a)*r*1.5;ctx.save();ctx.translate(sx,sy);ctx.rotate(a+ts);ctx.beginPath();ctx.moveTo(0,-10);ctx.lineTo(4,5);ctx.lineTo(-4,5);ctx.closePath();ctx.fillStyle="rgba(0,160,255,0.6)";ctx.fill();ctx.restore();}},
  // ── MYTHIC tier (1M-9.9M) ─────────────────────────────────────────────────
  "Arcane":(ctx,cx,cy,r,ts)=>{
    // Magic rune circles
    for(let i=0;i<2;i++){ctx.save();ctx.translate(cx,cy);ctx.rotate(ts*(0.2+i*0.15)*(i%2?1:-1));const pts=6+i*3;for(let j=0;j<pts;j++){const a=j/pts*Math.PI*2;const rr=r*(1.3+i*0.3);ctx.beginPath();ctx.arc(Math.cos(a)*rr,Math.sin(a)*rr,4,0,Math.PI*2);ctx.fillStyle=`rgba(160,0,255,0.6)`;ctx.fill();}ctx.restore();}},
  "Undefined":(ctx,cx,cy,r,ts)=>{
    // Glitchy distortion squares
    for(let i=0;i<5;i++){if(Math.random()<0.2){const gx=cx+(rnd()-0.5)*r*2,gy=cy+(rnd()-0.5)*r*2;const gs=rnd()*20+5;ctx.fillStyle=`rgba(0,255,180,0.2)`;ctx.fillRect(gx,gy,gs,gs);}}},
  "Gravitational":(ctx,cx,cy,r,ts)=>{
    // Gravity lensing rings — concentric ellipses tilting over time
    for(let i=0;i<4;i++){
      ctx.save();ctx.translate(cx,cy);
      ctx.rotate(ts*0.08*(i%2===0?1:-1)+i*0.5);
      ctx.beginPath();ctx.ellipse(0,0,r*(1.3+i*0.2),r*(0.35+i*0.08),0,0,Math.PI*2);
      ctx.strokeStyle=`rgba(80,0,200,${0.45-i*0.08})`;ctx.lineWidth=1.5;ctx.stroke();
      ctx.restore();
    }},
  "Bounded: Unbound":(ctx,cx,cy,r,ts)=>{
    // Breaking chains flying outward
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2+ts*0.5;const dist=r*(1.2+((ts*0.5+i*1.5)%3)*0.3);ctx.beginPath();ctx.arc(cx+Math.cos(a)*dist,cy+Math.sin(a)*dist,5,0,Math.PI*2);ctx.strokeStyle="rgba(140,0,255,0.6)";ctx.lineWidth=2;ctx.stroke();}},
  "Virtual":(ctx,cx,cy,r,ts)=>{
    // Digital grid — clipped to ring around orb
    ctx.save();
    ctx.beginPath();ctx.arc(cx,cy,r*1.8,0,Math.PI*2);
    ctx.arc(cx,cy,r*1.05,0,Math.PI*2,true);
    ctx.clip();
    const grid=18;
    for(let gx=cx-r*1.8;gx<cx+r*1.8;gx+=grid){ctx.beginPath();ctx.moveTo(gx,cy-r*1.8);ctx.lineTo(gx,cy+r*1.8);ctx.strokeStyle="rgba(0,200,255,0.2)";ctx.lineWidth=0.5;ctx.stroke();}
    for(let gy=cy-r*1.8;gy<cy+r*1.8;gy+=grid){ctx.beginPath();ctx.moveTo(cx-r*1.8,gy);ctx.lineTo(cx+r*1.8,gy);ctx.strokeStyle="rgba(0,200,255,0.2)";ctx.lineWidth=0.5;ctx.stroke();}
    ctx.restore();},
  "Aquatic: Flame":(ctx,cx,cy,r,ts)=>{
    // Flame-water dual spiral
    for(let i=0;i<16;i++){const a=i/16*Math.PI*2+ts*0.3;const rad=r*1.3;const fx=cx+Math.cos(a)*rad,fy=cy+Math.sin(a)*rad;const isFlame=i%2===0;ctx.beginPath();ctx.arc(fx,fy,6,0,Math.PI*2);ctx.fillStyle=isFlame?"rgba(255,100,0,0.5)":"rgba(0,150,255,0.5)";ctx.fill();}},
  "Poseidon":(ctx,cx,cy,r,ts)=>{
    // Trident + crashing waves
    for(let i=0;i<3;i++){const rr=r*(1.1+i*0.3)+((ts*20+i*25)%60);const a=0.3-rr/400;if(a>0){ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);ctx.strokeStyle=`rgba(0,120,200,${a})`;ctx.lineWidth=2;ctx.stroke();}}},
  "Zeus":(ctx,cx,cy,r,ts)=>{
    // Lightning bolts in all directions
    for(let i=0;i<6;i++){if(Math.random()<0.15){const a=i/6*Math.PI*2;ctx.beginPath();let lx=cx,ly=cy;ctx.moveTo(lx,ly);for(let s=0;s<4;s++){lx+=Math.cos(a+(rnd()-0.5)*0.6)*r*0.4;ly+=Math.sin(a+(rnd()-0.5)*0.6)*r*0.4;ctx.lineTo(lx,ly);}ctx.strokeStyle="rgba(255,255,80,0.9)";ctx.lineWidth=2;ctx.stroke();}}},
  "Galaxy":(ctx,cx,cy,r,ts)=>{
    // Spiral galaxy arms
    for(let arm=0;arm<2;arm++){ctx.beginPath();for(let t=0;t<Math.PI*4;t+=0.05){const rad=r*0.2+t*r*0.15;const x=cx+Math.cos(t+arm*Math.PI+ts*0.1)*rad,y=cy+Math.sin(t+arm*Math.PI+ts*0.1)*rad;t<0.05?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle=`rgba(100,0,200,0.35)`;ctx.lineWidth=2;ctx.stroke();}},
  "Hades":(ctx,cx,cy,r,ts)=>{
    // Underworld smoke rising
    for(let i=0;i<6;i++){const sx=cx+(i-2.5)*r*0.4;const prog=((ts*20+i*15)%70)/70;const sy=cy+r*(1-prog*2);const a=prog*(1-prog)*2;ctx.beginPath();ctx.arc(sx,sy,8+prog*10,0,Math.PI*2);ctx.fillStyle=`rgba(40,0,60,${a*0.6})`;ctx.fill();}},
  "Exotic: APEX":(ctx,cx,cy,r,ts)=>{
    // Full rainbow burst corona
    for(let i=0;i<24;i++){const a=i/24*Math.PI*2+ts*0.06;const hue=i/24*360;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);ctx.lineTo(cx+Math.cos(a)*r*1.8,cy+Math.sin(a)*r*1.8);ctx.strokeStyle=`hsla(${hue},100%,60%,0.5)`;ctx.lineWidth=2;ctx.stroke();}},
  // ── EXALTED+ tier (10M+) ───────────────────────────────────────────────────
  "GENESIS":(ctx,cx,cy,r,ts)=>{
    // Pure expanding light rings
    for(let i=0;i<5;i++){const rr=r*(1.2+i*0.3)+Math.sin(ts*0.5+i)*10;ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);ctx.strokeStyle=`rgba(255,255,255,${0.4-i*0.06})`;ctx.lineWidth=2-i*0.2;ctx.stroke();}},
  "CHROMATIC: GENESIS":(ctx,cx,cy,r,ts)=>{
    // Chromatic aberration rings
    const offsets=[[3,0,"rgba(255,0,0,0.3)"],[-3,0,"rgba(0,255,255,0.3)"],[0,3,"rgba(0,0,255,0.3)"]];offsets.forEach(([ox,oy,col])=>{ctx.beginPath();ctx.arc(cx+ox,cy+oy,r*1.4,0,Math.PI*2);ctx.strokeStyle=col;ctx.lineWidth=3;ctx.stroke();});},
  "ASCENDANT":(ctx,cx,cy,r,ts)=>{
    // Rising divine pillars of light
    for(let i=0;i<5;i++){const px=cx+(i-2)*r*0.4;const h=r*1.5+Math.sin(ts*0.8+i)*20;const pg=ctx.createLinearGradient(px,cy-h,px,cy+r);pg.addColorStop(0,"rgba(200,160,255,0.5)");pg.addColorStop(1,"rgba(200,160,255,0)");ctx.fillStyle=pg;ctx.fillRect(px-4,cy-h,8,h+r);}},
  "GLITCH":(ctx,cx,cy,r,ts)=>{
    // Digital glitch slices
    for(let i=0;i<4;i++){if(Math.random()<0.25){const gy=cy-r+rnd()*r*2;const gw=r*(0.5+rnd());ctx.fillStyle=`rgba(0,255,120,0.15)`;ctx.fillRect(cx-gw,gy,gw*2,rnd()*10+2);}}},
  "MATRIX ▫ REALITY":(ctx,cx,cy,r,ts)=>{
    // Matrix falling green dots in columns
    for(let i=0;i<8;i++){
      const mx=cx-r*1.4+i*r*0.42;
      const prog=((ts*0.8+i*0.4)%1);
      const my=cy-r+prog*r*2.5;
      const a=Math.sin(prog*Math.PI)*0.7;
      ctx.beginPath();ctx.arc(mx,my,3,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,255,80,${a})`;ctx.fill();
      // trail
      ctx.beginPath();ctx.arc(mx,my-8,2,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,200,60,${a*0.5})`;ctx.fill();
    }},
  "★★★":(ctx,cx,cy,r,ts)=>{
    // 3 big rotating stars
    for(let s=0;s<3;s++){const a=s/3*Math.PI*2+ts*0.3;const sx=cx+Math.cos(a)*r*1.4,sy=cy+Math.sin(a)*r*1.4;ctx.save();ctx.translate(sx,sy);ctx.rotate(ts*(s%2?1:-1));ctx.beginPath();for(let p=0;p<5;p++){const pa=p/5*Math.PI*2-Math.PI/2;const pb=(p+0.5)/5*Math.PI*2-Math.PI/2;ctx.lineTo(Math.cos(pa)*12,Math.sin(pa)*12);ctx.lineTo(Math.cos(pb)*5,Math.sin(pb)*5);}ctx.closePath();ctx.fillStyle="rgba(255,255,100,0.8)";ctx.fill();ctx.restore();}},
  "ATLAS":(ctx,cx,cy,r,ts)=>{
    // Rotating celestial globe rings (latitude/longitude lines) + golden compass rays
    // Globe rings — 3 orbiting ellipses at different tilts
    for(let i=0;i<3;i++){
      ctx.save();ctx.translate(cx,cy);
      ctx.rotate(ts*(0.15+i*0.08)*(i%2===0?1:-1));
      const tilt=i*Math.PI/4;
      ctx.beginPath();ctx.ellipse(0,0,r*1.5,r*0.4*Math.abs(Math.cos(tilt+ts*0.05))+r*0.15,tilt,0,Math.PI*2);
      ctx.strokeStyle=`rgba(200,160,60,${0.5-i*0.1})`;ctx.lineWidth=1.5;ctx.stroke();
      ctx.restore();
    }
    // Compass cardinal rays (N/S/E/W)
    for(let i=0;i<4;i++){
      const a=i/4*Math.PI*2+ts*0.04;
      const len=r*0.6+Math.sin(ts*1.5+i)*r*0.1;
      ctx.save();ctx.translate(cx,cy);
      const grd=ctx.createLinearGradient(0,0,Math.cos(a)*r+len,Math.sin(a)*r+len);
      grd.addColorStop(0,'rgba(255,200,60,0.8)');grd.addColorStop(1,'rgba(255,200,60,0)');
      ctx.beginPath();ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);
      ctx.lineTo(Math.cos(a)*(r+len),Math.sin(a)*(r+len));
      ctx.strokeStyle=grd;ctx.lineWidth=2.5;ctx.stroke();
      // arrowhead
      ctx.beginPath();ctx.arc(Math.cos(a)*(r+len),Math.sin(a)*(r+len),4,0,Math.PI*2);
      ctx.fillStyle='rgba(255,215,0,0.8)';ctx.fill();
      ctx.restore();
    }
    // Orbiting star constellations (small dots in orbit)
    for(let i=0;i<8;i++){
      const a=i/8*Math.PI*2+ts*0.2;
      const dist=r*1.6+Math.sin(i*1.3)*r*0.15;
      ctx.beginPath();ctx.arc(cx+Math.cos(a)*dist,cy+Math.sin(a)*dist,i%3===0?3:1.5,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,240,160,${i%3===0?0.9:0.5})`;ctx.fill();
    }
    // Antique golden glow ring
    const coronaGrd=ctx.createRadialGradient(cx,cy,r,cx,cy,r*1.8);
    coronaGrd.addColorStop(0,'rgba(200,160,60,0.3)');coronaGrd.addColorStop(1,'rgba(200,160,60,0)');
    ctx.beginPath();ctx.arc(cx,cy,r*1.8,0,Math.PI*2);ctx.fillStyle=coronaGrd;ctx.fill();},
  "ATLAS":(ctx,cx,cy,r,ts)=>{
    // Globe held up — rotating meridian lines + orbiting stars
    ctx.save();ctx.translate(cx,cy-r*0.2);
    // globe rings (meridians)
    for(let i=0;i<3;i++){
      ctx.save();ctx.rotate(ts*0.08*(i%2===0?1:-1)+i*Math.PI/3);
      ctx.beginPath();ctx.ellipse(0,0,r*0.9,r*0.3,0,0,Math.PI*2);
      ctx.strokeStyle=`rgba(255,210,100,${0.5-i*0.1})`;ctx.lineWidth=1.5;ctx.stroke();
      ctx.restore();
    }
    // globe outline
    ctx.beginPath();ctx.arc(0,0,r*0.9,0,Math.PI*2);
    ctx.strokeStyle="rgba(255,200,80,0.4)";ctx.lineWidth=2;ctx.stroke();
    ctx.restore();
    // orbiting constellation stars
    for(let i=0;i<5;i++){
      const a=i/5*Math.PI*2+ts*0.2;
      const sx=cx+Math.cos(a)*r*1.6,sy=cy+Math.sin(a)*r*1.6;
      ctx.beginPath();ctx.arc(sx,sy,3,0,Math.PI*2);
      ctx.fillStyle="rgba(255,220,100,0.8)";ctx.fill();
      // connect to next star
      const nb=((i+1)%5)/5*Math.PI*2+ts*0.2;
      ctx.beginPath();ctx.moveTo(sx,sy);
      ctx.lineTo(cx+Math.cos(nb)*r*1.6,cy+Math.sin(nb)*r*1.6);
      ctx.strokeStyle="rgba(255,200,80,0.2)";ctx.lineWidth=1;ctx.stroke();
    }},
  "Atlas : A.T.L.A.S.":(ctx,cx,cy,r,ts)=>{
    // Holographic digital globe — scanlines + glowing grid
    ctx.save();ctx.translate(cx,cy-r*0.2);
    // digital grid rings
    for(let i=0;i<4;i++){
      ctx.save();ctx.rotate(ts*0.12*(i%2===0?1:-1)+i*Math.PI/4);
      ctx.beginPath();ctx.ellipse(0,0,r*0.95,r*0.28,0,0,Math.PI*2);
      ctx.strokeStyle=`rgba(0,220,255,${0.6-i*0.1})`;ctx.lineWidth=1.5;ctx.stroke();
      ctx.restore();
    }
    // holographic shimmer
    const hue=(ts*40)%360;
    ctx.beginPath();ctx.arc(0,0,r*0.95,0,Math.PI*2);
    ctx.strokeStyle=`hsla(${hue},100%,70%,0.5)`;ctx.lineWidth=2;ctx.stroke();
    ctx.restore();
    // scanline flicker
    if(Math.floor(ts*60)%8<2){
      const ly=cy-r+Math.random()*r*2;
      ctx.fillStyle="rgba(0,200,255,0.1)";ctx.fillRect(cx-r*1.5,ly,r*3,3);
    }
    // orbiting data nodes
    for(let i=0;i<6;i++){
      const a=i/6*Math.PI*2+ts*0.3;
      const nx=cx+Math.cos(a)*r*1.5,ny=cy+Math.sin(a)*r*1.5;
      ctx.beginPath();ctx.rect(nx-4,ny-4,8,8);
      ctx.strokeStyle=`rgba(0,220,255,0.7)`;ctx.lineWidth=1.5;ctx.stroke();
    }},
  "NYCTOPHOBIA":(ctx,cx,cy,r,ts)=>{
    // Pulsing dark vignette ring + fear spikes
    const grad=ctx.createRadialGradient(cx,cy,r*1.0,cx,cy,r*2.2);
    grad.addColorStop(0,"rgba(0,0,0,0)");
    grad.addColorStop(1,"rgba(10,0,30,0.7)");
    ctx.beginPath();ctx.arc(cx,cy,r*2.2,0,Math.PI*2);ctx.fillStyle=grad;ctx.fill();
    for(let i=0;i<12;i++){
      const a=i/12*Math.PI*2+ts*0.05;
      const len=r*0.35+Math.abs(Math.sin(ts*1.5+i*1.3))*r*0.35;
      ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);
      ctx.lineTo(cx+Math.cos(a)*(r+len),cy+Math.sin(a)*(r+len));
      ctx.strokeStyle="rgba(80,0,100,0.8)";ctx.lineWidth=2.5;ctx.stroke();
    }},
  "▣ PIXELATION ▣":(ctx,cx,cy,r,ts)=>{
    // Rainbow pixel explosion
    const PS=8;for(let px=-r*1.5;px<r*1.5;px+=PS){for(let py=-r*1.5;py<r*1.5;py+=PS){const dist=Math.sqrt(px*px+py*py);if(dist>r&&dist<r*1.8){const hue=((px+py)*3+(ts*50))%360;const a=(1-(dist-r)/(r*0.8))*0.4;ctx.fillStyle=`hsla(${hue},100%,60%,${a})`;ctx.fillRect(cx+px,cy+py,PS-1,PS-1);}}}},
  "[ Luminosity ]":(ctx,cx,cy,r,ts)=>{
    // 8-point star flare + expanding white rings
    ctx.save();ctx.translate(cx,cy);ctx.rotate(ts*0.03);for(let i=0;i<8;i++){const a=i/8*Math.PI*2;const len=r*1.8+Math.sin(ts*1.2+i)*15;const wg=ctx.createLinearGradient(0,0,Math.cos(a)*len,Math.sin(a)*len);wg.addColorStop(0,"rgba(255,255,255,0.8)");wg.addColorStop(1,"rgba(255,255,255,0)");ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a)*len,Math.sin(a)*len);ctx.strokeStyle=wg;ctx.lineWidth=i%2===0?2:1;ctx.stroke();}ctx.restore();},
  "Eclipse":(ctx,cx,cy,r,ts)=>{
    // Solar eclipse: dark moon disc passing over sun corona + corona rays
    const moonX=cx+Math.sin(ts*0.15)*r*0.4;
    const moonY=cy+Math.cos(ts*0.1)*r*0.2;
    // corona rays
    for(let i=0;i<16;i++){
      const a=i/16*Math.PI*2;
      const len=r*0.5+Math.sin(ts*2+i*0.7)*r*0.15;
      const grd=ctx.createLinearGradient(cx+Math.cos(a)*r,cy+Math.sin(a)*r,cx+Math.cos(a)*(r+len),cy+Math.sin(a)*(r+len));
      grd.addColorStop(0,'rgba(255,200,0,0.7)');grd.addColorStop(1,'rgba(255,100,0,0)');
      ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);ctx.lineTo(cx+Math.cos(a)*(r+len),cy+Math.sin(a)*(r+len));
      ctx.strokeStyle=grd;ctx.lineWidth=2;ctx.stroke();
    }
    // corona glow ring
    const coronaGrd=ctx.createRadialGradient(cx,cy,r,cx,cy,r*1.6);
    coronaGrd.addColorStop(0,'rgba(255,180,0,0.4)');coronaGrd.addColorStop(1,'rgba(255,100,0,0)');
    ctx.beginPath();ctx.arc(cx,cy,r*1.6,0,Math.PI*2);ctx.fillStyle=coronaGrd;ctx.fill();
    // dark moon disc
    ctx.beginPath();ctx.arc(moonX,moonY,r*0.92,0,Math.PI*2);ctx.fillStyle='rgba(8,8,20,0.97)';ctx.fill();
    // thin bright ring where sun peeks out
    ctx.beginPath();ctx.arc(moonX,moonY,r*0.92,0,Math.PI*2);ctx.strokeStyle='rgba(255,220,80,0.6)';ctx.lineWidth=2;ctx.stroke();},
  // ── New biome exclusive auras ──────────────────────────────────────────────
  "Dreamscape":(ctx,cx,cy,r,ts)=>{
    // Dreamy pastel wisps orbiting
    for(let i=0;i<8;i++){
      const a=i/8*Math.PI*2+ts*0.15;
      const dist=r*(1.3+Math.sin(ts*0.8+i)*0.2);
      const hue=(i*45+ts*20)%360;
      ctx.beginPath();ctx.arc(cx+Math.cos(a)*dist,cy+Math.sin(a)*dist,6,0,Math.PI*2);
      ctx.fillStyle=`hsla(${hue},80%,70%,0.5)`;ctx.fill();
    }
    const dg=ctx.createRadialGradient(cx,cy,r*0.5,cx,cy,r*2);
    dg.addColorStop(0,`rgba(160,100,255,0.15)`);dg.addColorStop(1,`rgba(0,0,0,0)`);
    ctx.beginPath();ctx.arc(cx,cy,r*2,0,Math.PI*2);ctx.fillStyle=dg;ctx.fill();},
  "Dreammetric":(ctx,cx,cy,r,ts)=>{
    // Fractal dream rings
    for(let i=0;i<3;i++){
      ctx.save();ctx.translate(cx,cy);ctx.rotate(ts*0.1*(i%2===0?1:-1));
      ctx.beginPath();ctx.ellipse(0,0,r*(1.2+i*0.25),r*(0.4+i*0.1),0,0,Math.PI*2);
      ctx.strokeStyle=`hsla(${(i*120+ts*30)%360},70%,65%,0.5)`;ctx.lineWidth=2;ctx.stroke();
      ctx.restore();
    }},
  "Borealis":(ctx,cx,cy,r,ts)=>{
    // Aurora borealis curtains
    for(let i=0;i<6;i++){
      const x=cx-r*1.5+i*r*0.6;
      const wave=Math.sin(ts*0.5+i*0.8)*r*0.3;
      const hue=(i*40+ts*15)%360;
      ctx.beginPath();ctx.moveTo(x,cy-r*1.2+wave);ctx.lineTo(x,cy+r*0.8);
      ctx.strokeStyle=`hsla(${hue},90%,60%,0.35)`;ctx.lineWidth=12;ctx.stroke();
    }},
  "CHILLSEAR":(ctx,cx,cy,r,ts)=>{
    // Ice-fire dual rings
    for(let i=0;i<16;i++){
      const a=i/16*Math.PI*2+ts*0.2;
      const isIce=i%2===0;
      ctx.beginPath();ctx.arc(cx+Math.cos(a)*r*1.4,cy+Math.sin(a)*r*1.4,5,0,Math.PI*2);
      ctx.fillStyle=isIce?`rgba(100,200,255,0.6)`:`rgba(255,80,0,0.6)`;ctx.fill();
    }},
  "Hypervolt":(ctx,cx,cy,r,ts)=>{
    // Electric storm bolts
    for(let i=0;i<6;i++){if(Math.random()<0.2){
      const a=i/6*Math.PI*2;
      ctx.beginPath();let lx=cx,ly=cy;ctx.moveTo(lx,ly);
      for(let s=0;s<5;s++){lx+=Math.cos(a+(rnd()-0.5)*0.8)*r*0.35;ly+=Math.sin(a+(rnd()-0.5)*0.8)*r*0.35;ctx.lineTo(lx,ly);}
      ctx.strokeStyle="rgba(100,180,255,0.9)";ctx.lineWidth=2;ctx.stroke();}}},
  "Hypervolt: Ever-storm":(ctx,cx,cy,r,ts)=>{
    for(let i=0;i<8;i++){if(Math.random()<0.25){
      const a=i/8*Math.PI*2;
      ctx.beginPath();let lx=cx,ly=cy;ctx.moveTo(lx,ly);
      for(let s=0;s<6;s++){lx+=Math.cos(a+(rnd()-0.5)*0.6)*r*0.35;ly+=Math.sin(a+(rnd()-0.5)*0.6)*r*0.35;ctx.lineTo(lx,ly);}
      ctx.strokeStyle="rgba(60,100,255,0.95)";ctx.lineWidth=2.5;ctx.stroke();}}},
  "Spectraflow":(ctx,cx,cy,r,ts)=>{
    // Rainbow flow
    for(let i=0;i<20;i++){
      const a=i/20*Math.PI*2+ts*0.08;
      const hue=(i*18+ts*40)%360;
      ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);
      ctx.lineTo(cx+Math.cos(a)*r*1.6,cy+Math.sin(a)*r*1.6);
      ctx.strokeStyle=`hsla(${hue},100%,60%,0.5)`;ctx.lineWidth=2;ctx.stroke();
    }},
  "Sovereign":(ctx,cx,cy,r,ts)=>{
    // Royal golden rings
    for(let i=0;i<2;i++){
      ctx.save();ctx.translate(cx,cy);ctx.rotate(ts*0.06*(i===0?1:-1));
      const pts=8;ctx.beginPath();
      for(let j=0;j<pts*2;j++){const a=j/(pts*2)*Math.PI*2;const rr=j%2===0?r*(1.4+i*0.3):r*(1.1+i*0.2);j===0?ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr):ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}
      ctx.closePath();ctx.strokeStyle=`rgba(255,200,0,${0.5-i*0.15})`;ctx.lineWidth=2;ctx.stroke();
      ctx.restore();
    }},
  "Symphony":(ctx,cx,cy,r,ts)=>{
    // Musical wave rings
    for(let i=0;i<24;i++){
      const a=i/24*Math.PI*2;
      const len=r*(0.4+Math.abs(Math.sin(ts*2+i*0.5))*0.5);
      ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);
      ctx.lineTo(cx+Math.cos(a)*(r+len),cy+Math.sin(a)*(r+len));
      ctx.strokeStyle=`rgba(255,160,80,0.5)`;ctx.lineWidth=1.5;ctx.stroke();
    }},
  "Maelstrom":(ctx,cx,cy,r,ts)=>{
    // Spiral storm
    ctx.save();ctx.translate(cx,cy);ctx.rotate(ts*0.4);
    for(let arm=0;arm<3;arm++){
      ctx.beginPath();
      for(let t=0;t<Math.PI*4;t+=0.06){const rad=r*0.15+t*r*0.12;const x=Math.cos(t+arm*Math.PI*2/3)*rad,y=Math.sin(t+arm*Math.PI*2/3)*rad;t<0.06?ctx.moveTo(x,y):ctx.lineTo(x,y);}
      ctx.strokeStyle=`rgba(0,180,255,0.4)`;ctx.lineWidth=2;ctx.stroke();
    }
    ctx.restore();},
  "Starscorge":(ctx,cx,cy,r,ts)=>{
    // Scorch marks + star energy
    for(let i=0;i<8;i++){
      const a=i/8*Math.PI*2+ts*0.04;
      ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);
      ctx.lineTo(cx+Math.cos(a)*r*1.8,cy+Math.sin(a)*r*1.8);
      const sg=ctx.createLinearGradient(cx+Math.cos(a)*r,cy+Math.sin(a)*r,cx+Math.cos(a)*r*1.8,cy+Math.sin(a)*r*1.8);
      sg.addColorStop(0,"rgba(255,120,0,0.7)");sg.addColorStop(1,"rgba(255,200,0,0)");
      ctx.strokeStyle=sg;ctx.lineWidth=3;ctx.stroke();
    }},
  "Starscorge: Radiant":(ctx,cx,cy,r,ts)=>{
    for(let i=0;i<12;i++){
      const a=i/12*Math.PI*2+ts*0.06;
      ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);
      ctx.lineTo(cx+Math.cos(a)*r*2,cy+Math.sin(a)*r*2);
      const sg=ctx.createLinearGradient(cx+Math.cos(a)*r,cy+Math.sin(a)*r,cx+Math.cos(a)*r*2,cy+Math.sin(a)*r*2);
      sg.addColorStop(0,"rgba(255,220,50,0.9)");sg.addColorStop(1,"rgba(255,100,0,0)");
      ctx.strokeStyle=sg;ctx.lineWidth=2.5;ctx.stroke();
    }},
  "Lotusfall":(ctx,cx,cy,r,ts)=>{
    // Falling pink petals
    for(let i=0;i<6;i++){
      const a=i/6*Math.PI*2+ts*0.12;
      const px=cx+Math.cos(a)*r*1.3,py=cy+Math.sin(a)*r*1.3;
      ctx.save();ctx.translate(px,py);ctx.rotate(a+ts*0.5);
      ctx.beginPath();ctx.ellipse(0,0,7,12,0,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,150,180,0.5)`;ctx.fill();
      ctx.restore();
    }},
  "Flora: Evergreen":(ctx,cx,cy,r,ts)=>{
    // Nature green glow + leaves
    const fg=ctx.createRadialGradient(cx,cy,r*0.5,cx,cy,r*2);
    fg.addColorStop(0,"rgba(50,180,50,0.2)");fg.addColorStop(1,"rgba(0,0,0,0)");
    ctx.beginPath();ctx.arc(cx,cy,r*2,0,Math.PI*2);ctx.fillStyle=fg;ctx.fill();
    for(let i=0;i<6;i++){
      const a=i/6*Math.PI*2+ts*0.08;
      ctx.beginPath();ctx.ellipse(cx+Math.cos(a)*r*1.3,cy+Math.sin(a)*r*1.3,8,14,a,0,Math.PI*2);
      ctx.fillStyle=`rgba(60,200,60,0.4)`;ctx.fill();
    }},
  "Prophecy":(ctx,cx,cy,r,ts)=>{
    // Mystical rune circles
    for(let i=0;i<3;i++){
      ctx.save();ctx.translate(cx,cy);ctx.rotate(ts*0.08*(i%2===0?1:-1)+i*Math.PI/3);
      const pts=5+i*2;
      for(let j=0;j<pts;j++){
        const a=j/pts*Math.PI*2;const rr=r*(1.2+i*0.25);
        ctx.beginPath();ctx.arc(Math.cos(a)*rr,Math.sin(a)*rr,4,0,Math.PI*2);
        ctx.fillStyle=`rgba(200,100,255,0.6)`;ctx.fill();
      }
      ctx.restore();
    }},
  "Archangel":(ctx,cx,cy,r,ts)=>{
    // Divine wing light beams
    for(let i=0;i<8;i++){
      const a=i/8*Math.PI*2+ts*0.03;
      const len=r*(1.3+Math.sin(ts*0.8+i)*0.2);
      const ag=ctx.createLinearGradient(cx+Math.cos(a)*r,cy+Math.sin(a)*r,cx+Math.cos(a)*(r+len),cy+Math.sin(a)*(r+len));
      ag.addColorStop(0,"rgba(255,255,200,0.7)");ag.addColorStop(1,"rgba(255,255,200,0)");
      ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);ctx.lineTo(cx+Math.cos(a)*(r+len),cy+Math.sin(a)*(r+len));
      ctx.strokeStyle=ag;ctx.lineWidth=2;ctx.stroke();
    }},
  "Matrix: Overdrive":(ctx,cx,cy,r,ts)=>{
    // Fast green code rain
    for(let i=0;i<10;i++){
      const mx=cx-r*1.4+i*r*0.32;
      const prog=((ts*1.2+i*0.5)%1);
      const my=cy-r+prog*r*2.5;
      ctx.beginPath();ctx.arc(mx,my,4,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,255,80,${Math.sin(prog*Math.PI)*0.8})`;ctx.fill();
    }},
  "Overture":(ctx,cx,cy,r,ts)=>{
    // Grand orchestral crescendo rings
    for(let i=0;i<3;i++){
      const rr=r*(1.1+i*0.3)+Math.sin(ts*0.4+i)*8;
      ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);
      ctx.strokeStyle=`rgba(200,160,80,${0.5-i*0.1})`;ctx.lineWidth=2;ctx.stroke();
    }},
  "Overture: History":(ctx,cx,cy,r,ts)=>{
    for(let i=0;i<4;i++){
      const rr=r*(1.1+i*0.25)+Math.sin(ts*0.3+i)*8;
      ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);
      ctx.strokeStyle=`rgba(220,180,100,${0.6-i*0.1})`;ctx.lineWidth=2.5;ctx.stroke();
    }},
  "Sophyra":(ctx,cx,cy,r,ts)=>{
    // Elegant flowing curves
    ctx.save();ctx.translate(cx,cy);
    for(let arm=0;arm<4;arm++){
      ctx.rotate(Math.PI/2);
      ctx.beginPath();
      for(let t=0;t<Math.PI*2;t+=0.05){const rad=r*(0.5+t*r*0.05);ctx.lineTo(Math.cos(t+ts*0.1)*rad,Math.sin(t+ts*0.1)*rad);}
      ctx.strokeStyle="rgba(255,180,220,0.3)";ctx.lineWidth=1.5;ctx.stroke();
    }
    ctx.restore();},
  "Apostolos":(ctx,cx,cy,r,ts)=>{
    // Holy radiance beams
    for(let i=0;i<12;i++){
      const a=i/12*Math.PI*2;
      const len=r*(1.5+Math.sin(ts+i)*0.2);
      ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r*0.8,cy+Math.sin(a)*r*0.8);
      ctx.lineTo(cx+Math.cos(a)*len,cy+Math.sin(a)*len);
      ctx.strokeStyle=`rgba(255,240,180,${0.4+Math.sin(ts*0.5+i)*0.2})`;ctx.lineWidth=1.5;ctx.stroke();
    }},
  "Lumenpool":(ctx,cx,cy,r,ts)=>{
    // Light pool ripples
    for(let i=0;i<3;i++){
      const rr=r*(1.0+i*0.4)+((ts*0.3+i*0.4)%1)*r*0.5;
      const a=(1-(rr-r)/(r*1.5))*0.3;
      if(a>0){ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);ctx.strokeStyle=`rgba(100,220,255,${a})`;ctx.lineWidth=2;ctx.stroke();}
    }},
  "Aegis":(ctx,cx,cy,r,ts)=>{
    // Shield barrier hexagon
    ctx.save();ctx.translate(cx,cy);ctx.rotate(ts*0.05);
    for(let i=0;i<2;i++){
      ctx.beginPath();
      for(let j=0;j<6;j++){const a=j/6*Math.PI*2;const rr=r*(1.3+i*0.2);j===0?ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr):ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}
      ctx.closePath();ctx.strokeStyle=`rgba(100,160,255,${0.5-i*0.15})`;ctx.lineWidth=2;ctx.stroke();
    }
    ctx.restore();},
  "[OPPRESSION]":(ctx,cx,cy,r,ts)=>{
    // Dark oppressive void rings
    const og=ctx.createRadialGradient(cx,cy,r,cx,cy,r*2.5);
    og.addColorStop(0,"rgba(0,0,0,0)");og.addColorStop(1,"rgba(20,0,40,0.6)");
    ctx.beginPath();ctx.arc(cx,cy,r*2.5,0,Math.PI*2);ctx.fillStyle=og;ctx.fill();
    for(let i=0;i<10;i++){
      const a=i/10*Math.PI*2+ts*0.08;
      const len=r*0.4+Math.sin(ts*1.5+i)*r*0.2;
      ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);
      ctx.lineTo(cx+Math.cos(a)*(r+len),cy+Math.sin(a)*(r+len));
      ctx.strokeStyle="rgba(100,0,150,0.6)";ctx.lineWidth=2;ctx.stroke();
    }},
  "★":(ctx,cx,cy,r,ts)=>{
    // Single big pulsing star
    const pulse=0.85+Math.sin(ts*0.8)*0.15;
    ctx.save();ctx.translate(cx,cy);ctx.rotate(ts*0.06);
    ctx.beginPath();
    for(let i=0;i<10;i++){const a=i/(10)*Math.PI*2-Math.PI/2;const rr=i%2===0?r*1.3*pulse:r*0.5*pulse;i===0?ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr):ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}
    ctx.closePath();ctx.strokeStyle="rgba(255,220,80,0.7)";ctx.lineWidth=2;ctx.stroke();
    ctx.restore();},
  "★★":(ctx,cx,cy,r,ts)=>{
    // Two orbiting stars
    for(let s=0;s<2;s++){
      const a=s*Math.PI+ts*0.25;
      ctx.save();ctx.translate(cx+Math.cos(a)*r*0.8,cy+Math.sin(a)*r*0.8);ctx.rotate(ts*(s%2===0?0.5:-0.5));
      ctx.beginPath();
      for(let i=0;i<10;i++){const fa=i/10*Math.PI*2-Math.PI/2;const rr=i%2===0?r*0.65:r*0.25;i===0?ctx.moveTo(Math.cos(fa)*rr,Math.sin(fa)*rr):ctx.lineTo(Math.cos(fa)*rr,Math.sin(fa)*rr);}
      ctx.closePath();ctx.strokeStyle="rgba(255,220,80,0.7)";ctx.lineWidth=1.5;ctx.stroke();
      ctx.restore();
    }},
  "Perpendicular":(ctx,cx,cy,r,ts)=>{
    for(let i=0;i<4;i++){ctx.save();ctx.translate(cx,cy);ctx.rotate(i*Math.PI/2+ts*0.1);ctx.beginPath();ctx.ellipse(0,0,r*1.3,r*0.3,0,0,Math.PI*2);ctx.strokeStyle="rgba(0,200,200,0.4)";ctx.lineWidth=2;ctx.stroke();ctx.restore();}},
  "Perpetual":(ctx,cx,cy,r,ts)=>{
    // Infinite loop rings
    for(let i=0;i<4;i++){ctx.save();ctx.translate(cx,cy);ctx.rotate(i*Math.PI/2+ts*0.06*(i%2===0?1:-1));ctx.beginPath();ctx.ellipse(0,0,r*(1.2+i*0.1),r*(0.35+i*0.05),0,0,Math.PI*2);ctx.strokeStyle=`rgba(80,160,255,${0.4-i*0.06})`;ctx.lineWidth=1.5;ctx.stroke();ctx.restore();}},
  "Prologue":(ctx,cx,cy,r,ts)=>{
    // Story beginning glow
    const pg=ctx.createRadialGradient(cx,cy,r*0.3,cx,cy,r*2);
    pg.addColorStop(0,"rgba(255,200,100,0.3)");pg.addColorStop(1,"rgba(0,0,0,0)");
    ctx.beginPath();ctx.arc(cx,cy,r*2,0,Math.PI*2);ctx.fillStyle=pg;ctx.fill();},
  "Twilight: Withering Grace":(ctx,cx,cy,r,ts)=>{
    // Twilight dual-tone petals
    for(let i=0;i<6;i++){
      const a=i/6*Math.PI*2+ts*0.08;
      ctx.save();ctx.translate(cx+Math.cos(a)*r*1.3,cy+Math.sin(a)*r*1.3);ctx.rotate(a);
      ctx.beginPath();ctx.ellipse(0,0,6,14,0,0,Math.PI*2);
      ctx.fillStyle=i%2===0?"rgba(180,80,200,0.5)":"rgba(80,120,200,0.5)";ctx.fill();
      ctx.restore();
    }},
  "Sailor: Admiral":(ctx,cx,cy,r,ts)=>{
    // Naval rings expanding
    for(let i=0;i<3;i++){
      const rr=r*(1.1+i*0.3)+((ts*0.25+i*0.3)%1)*r*0.4;
      ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);
      ctx.strokeStyle=`rgba(0,100,200,${0.3-((ts*0.25+i*0.3)%1)*0.3})`;ctx.lineWidth=2;ctx.stroke();
    }},
  "Felled":(ctx,cx,cy,r,ts)=>{
    // Fallen dark embers
    for(let i=0;i<8;i++){
      const a=i/8*Math.PI*2+ts*0.06;
      const d=r*(1.2+Math.sin(ts+i)*0.2);
      ctx.beginPath();ctx.arc(cx+Math.cos(a)*d,cy+Math.sin(a)*d,4,0,Math.PI*2);
      ctx.fillStyle=`rgba(150,50,0,0.6)`;ctx.fill();
    }},
  "Bloodlust":(ctx,cx,cy,r,ts)=>{
    // Blood red pulses
    for(let i=0;i<3;i++){
      const pulse=((ts*0.4+i*0.33)%1);
      const rr=r*(1+i*0.3+pulse*0.5);const a=0.4-pulse*0.4;
      if(a>0){ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);ctx.strokeStyle=`rgba(180,0,0,${a})`;ctx.lineWidth=2.5;ctx.stroke();}
    }},
  "Elude":(ctx,cx,cy,r,ts)=>{
    // Elusive shifting form
    for(let i=0;i<6;i++){
      const a=i/6*Math.PI*2+ts*0.3*(i%2===0?1:-1);
      ctx.beginPath();ctx.arc(cx+Math.cos(a)*r*1.2,cy+Math.sin(a)*r*1.2,5,0,Math.PI*2);
      ctx.fillStyle=`rgba(100,255,200,0.4)`;ctx.fill();
    }},
  "Gargantua":(ctx,cx,cy,r,ts)=>{
    // Massive gravity waves
    for(let i=0;i<5;i++){
      ctx.save();ctx.translate(cx,cy);ctx.rotate(i*Math.PI/5+ts*0.05*(i%2===0?1:-1));
      ctx.beginPath();ctx.ellipse(0,0,r*(1.3+i*0.15),r*(0.3+i*0.05),0,0,Math.PI*2);
      ctx.strokeStyle=`rgba(60,0,120,${0.4-i*0.06})`;ctx.lineWidth=2;ctx.stroke();
      ctx.restore();
    }},
  "Lily":(ctx,cx,cy,r,ts)=>{
    // Lily petals floating
    for(let i=0;i<5;i++){
      const a=i/5*Math.PI*2+ts*0.06;
      ctx.save();ctx.translate(cx+Math.cos(a)*r*1.2,cy+Math.sin(a)*r*1.2);ctx.rotate(a+ts*0.2);
      ctx.beginPath();ctx.ellipse(0,0,7,16,0,0,Math.PI*2);
      ctx.fillStyle="rgba(255,200,220,0.45)";ctx.fill();
      ctx.restore();
    }},
  "Abyssal Hunter":(ctx,cx,cy,r,ts)=>{
    // Deep sea dark tendrils
    for(let i=0;i<8;i++){
      const a=i/8*Math.PI*2+ts*0.1;
      const len=r*0.5+Math.sin(ts*1.5+i)*r*0.3;
      ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);
      ctx.quadraticCurveTo(cx+Math.cos(a+0.5)*r*1.1,cy+Math.sin(a+0.5)*r*1.1,cx+Math.cos(a)*( r+len),cy+Math.sin(a)*(r+len));
      ctx.strokeStyle="rgba(0,40,80,0.7)";ctx.lineWidth=2;ctx.stroke();
    }},
  "Jazz: Orchestra":(ctx,cx,cy,r,ts)=>{
    // Jazz note waves
    for(let i=0;i<20;i++){
      const a=i/20*Math.PI*2;
      const len=r*(0.3+Math.abs(Math.sin(ts*3+i*0.7))*0.5);
      ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);
      ctx.lineTo(cx+Math.cos(a)*(r+len),cy+Math.sin(a)*(r+len));
      ctx.strokeStyle=`rgba(200,140,0,0.45)`;ctx.lineWidth=1.5;ctx.stroke();
    }},
  "Ruins":(ctx,cx,cy,r,ts)=>{
    // Crumbling stone fragments
    for(let i=0;i<8;i++){
      const a=i/8*Math.PI*2+ts*0.04;
      ctx.save();ctx.translate(cx+Math.cos(a)*r*1.3,cy+Math.sin(a)*r*1.3);ctx.rotate(ts*0.2+i);
      ctx.fillStyle="rgba(120,80,40,0.5)";ctx.fillRect(-5,-5,10,10);
      ctx.restore();
    }},
  "Ruins: Withered":(ctx,cx,cy,r,ts)=>{
    for(let i=0;i<10;i++){
      const a=i/10*Math.PI*2+ts*0.05;
      ctx.save();ctx.translate(cx+Math.cos(a)*r*1.3,cy+Math.sin(a)*r*1.3);ctx.rotate(ts*0.15+i);
      ctx.fillStyle="rgba(80,50,20,0.5)";ctx.fillRect(-6,-4,12,8);
      ctx.restore();
    }},
  "Impeached":(ctx,cx,cy,r,ts)=>{
    // Fractured authority rings
    for(let i=0;i<6;i++){
      ctx.save();ctx.translate(cx,cy);ctx.rotate(i*Math.PI/3+ts*0.04);
      ctx.beginPath();ctx.arc(0,0,r*(1.2+i*0.1),i*0.2,i*0.2+Math.PI*1.6);
      ctx.strokeStyle=`rgba(180,0,0,${0.4-i*0.05})`;ctx.lineWidth=2;ctx.stroke();
      ctx.restore();
    }},
  "Pythios":(ctx,cx,cy,r,ts)=>{
    // Snake spiral
    ctx.save();ctx.translate(cx,cy);ctx.rotate(ts*0.2);
    ctx.beginPath();
    for(let t=0;t<Math.PI*6;t+=0.08){const rad=r*0.3+t*r*0.08;ctx.lineTo(Math.cos(t)*rad,Math.sin(t)*rad);}
    ctx.strokeStyle="rgba(0,180,60,0.4)";ctx.lineWidth=2;ctx.stroke();
    ctx.restore();},
  "Kyawthuite: Remembrance":(ctx,cx,cy,r,ts)=>{
    // Deep blue crystalline shards
    for(let i=0;i<8;i++){
      const a=i/8*Math.PI*2+ts*0.2;
      ctx.save();ctx.translate(cx+Math.cos(a)*r*1.4,cy+Math.sin(a)*r*1.4);ctx.rotate(a+ts);
      ctx.beginPath();ctx.moveTo(0,-10);ctx.lineTo(5,6);ctx.lineTo(-5,6);ctx.closePath();
      ctx.fillStyle="rgba(0,120,200,0.6)";ctx.fill();
      ctx.restore();
    }},
  "Astral: Zodiac":(ctx,cx,cy,r,ts)=>{
    // Zodiac constellation pattern
    const stars=12;
    for(let i=0;i<stars;i++){
      const a=i/stars*Math.PI*2+ts*0.04;
      const dist=r*1.5;
      ctx.beginPath();ctx.arc(cx+Math.cos(a)*dist,cy+Math.sin(a)*dist,4,0,Math.PI*2);
      ctx.fillStyle="rgba(200,180,255,0.8)";ctx.fill();
      const nb=(i+1)%stars;const na=nb/stars*Math.PI*2+ts*0.04;
      ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*dist,cy+Math.sin(a)*dist);
      ctx.lineTo(cx+Math.cos(na)*dist,cy+Math.sin(na)*dist);
      ctx.strokeStyle="rgba(200,180,255,0.2)";ctx.lineWidth=1;ctx.stroke();
    }},
  "Exotic: Void":(ctx,cx,cy,r,ts)=>{
    // Void rainbow shimmer
    for(let i=0;i<5;i++){
      const rr=r*(1.1+i*0.18);const hue=(ts*40+i*72)%360;
      ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);
      ctx.strokeStyle=`hsla(${hue},100%,60%,0.3)`;ctx.lineWidth=2;ctx.stroke();
    }},
  "Prologue":(ctx,cx,cy,r,ts)=>{
    const pg=ctx.createRadialGradient(cx,cy,r*0.3,cx,cy,r*2);
    pg.addColorStop(0,"rgba(255,200,100,0.25)");pg.addColorStop(1,"rgba(0,0,0,0)");
    ctx.beginPath();ctx.arc(cx,cy,r*2,0,Math.PI*2);ctx.fillStyle=pg;ctx.fill();},
  "Equinox":(ctx,cx,cy,r,ts)=>{
    // Rotating yin-yang shadow + dual aura rings
    ctx.save();ctx.translate(cx,cy);ctx.rotate(ts*0.15);
    ctx.beginPath();ctx.arc(0,0,r*1.5,-Math.PI/2,Math.PI/2);ctx.strokeStyle="rgba(255,255,255,0.3)";ctx.lineWidth=3;ctx.stroke();
    ctx.beginPath();ctx.arc(0,0,r*1.5,Math.PI/2,-Math.PI/2);ctx.strokeStyle="rgba(0,0,0,0.5)";ctx.lineWidth=3;ctx.stroke();
    ctx.restore();},
};

// Called from draw() after orb is drawn
function drawAuraEffect(ctx,name,cx,cy,r,ts){
  const fn=AURA_EFFECTS[name];
  if(!fn)return;
  ctx.save();
  try{fn(ctx,cx,cy,r,ts);}catch(e){}
  ctx.restore();
}
