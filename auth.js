// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// auth.js — Supabase authentication and cloud save
// To configure: replace SUPABASE_URL and SUPABASE_KEY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  SUPABASE AUTH
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SUPABASE_URL="https://nuesftiqwqrlofiexhmz.supabase.co";
const SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZXNmdGlxd3FybG9maWV4aG16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MTIxNjIsImV4cCI6MjA4OTQ4ODE2Mn0.Of6JQNGHtVqZAmYQEowT_u9OTBi25o-jAOo8yeE85bs";
let sbClient=null,sbUser=null,sbLoadedOnce=false,_sbJustSignedIn=false;

function initSupabase(){
  try{
    const sb=window.supabase||window.Supabase;
    if(!sb){
      console.error("Supabase library not loaded");
      setTimeout(initSupabase,1000); // retry after 1s
      return;
    }
    sbClient=sb.createClient(SUPABASE_URL,SUPABASE_KEY);
    sbClient.auth.onAuthStateChange((event,session)=>{
      sbUser=session?.user||null;
      updateAuthUI();
      // TOKEN_REFRESHED / INITIAL_SESSION / USER_UPDATED all fire on foreground — ignore them
      // Only act on explicit password sign-in
      if(event==="SIGNED_IN"&&!sbLoadedOnce&&_sbJustSignedIn){
        _sbJustSignedIn=false;
        sbLoadedOnce=true;
        loadCloudSave();
        toast("☁️ Signed in as "+sbUser.email);
      }
      if(event==="SIGNED_OUT"){sbLoadedOnce=false;_sbJustSignedIn=false;toast("👋 Signed out");}
    });
    sbClient.auth.getSession().then(({data:{session}})=>{
      sbUser=session?.user||null;
      updateAuthUI();
      // Load once on startup if already signed in
      if(sbUser&&!sbLoadedOnce){
        sbLoadedOnce=true;
        loadCloudSave();
      }
    });
    console.log("✓ Supabase connected");
  }catch(e){
    console.error("Supabase init error:",e.message);
    toast("❌ Auth error: "+e.message);
  }
}

async function authSignUp(email,password){
  if(!sbClient) return toast("❌ Supabase not configured");
  const {error}=await sbClient.auth.signUp({email,password});
  if(error) toast("❌ "+error.message);
  else toast("✅ Account created! Check email to confirm.");
}

function _doSignIn(){const e=document.getElementById("auth-email"),p=document.getElementById("auth-pass");if(e&&p)authSignIn(e.value,p.value);}
function _doSignUp(){const e=document.getElementById("auth-email"),p=document.getElementById("auth-pass");if(e&&p)authSignUp(e.value,p.value);}

async function authSignIn(email,password){
  if(!sbClient) return toast("❌ Supabase not configured");
  _sbJustSignedIn=true; // flag so onAuthStateChange knows this is a real sign-in
  const {error}=await sbClient.auth.signInWithPassword({email,password});
  if(error){_sbJustSignedIn=false;toast("❌ "+error.message);}
  else{document.getElementById("overlay").classList.remove("open");}
}

async function authSignOut(){
  if(!sbClient) return;
  await sbClient.auth.signOut();
  updateAuthUI();
}

async function saveCloudSave(silent=false){
  if(!sbClient||!sbUser){ if(!silent) toast("❌ Not signed in"); return; }
  const d=JSON.stringify({
    coins:S.coins,rolls:S.rolls,owned_auras:S.owned_auras,owned_items:S.owned_items,
    owned_gears:S.owned_gears,owned_talismans:S.owned_talismans,
    equipped_aura:S.equipped_aura,equipped_R:S.equipped_R,equipped_L:S.equipped_L,
    equipped_talisman:S.equipped_talisman,collection:S.collection,
    companions:S.companions,equipped_companion:S.equipped_companion,
    roulette_tickets:S.roulette_tickets,active_potions:S.active_potions,
    isDay:S.isDay,dayNightTimer:S.dayNightTimer,chatMinChance:S.chatMinChance,
    autoDelete:S.autoDelete,autoEquip:S.autoEquip,talisman_stacks:S.talisman_stacks,
  });
  const {error}=await sbClient.from("saves").upsert({user_id:sbUser.id,save_data:d,updated_at:new Date().toISOString()},{onConflict:"user_id"});
  if(error){ if(!silent) toast("❌ Cloud save failed: "+error.message); }
  else {
    if(!silent) toast("☁️ Progress saved to cloud!");
    else {
      // Subtle flash on coins box for auto-save
      const hc=document.getElementById("hud-coins");
      if(hc){ hc.style.color="#60e880"; setTimeout(()=>hc.style.color="",800); }
    }
  }
}

async function loadCloudSave(){
  if(!sbClient||!sbUser) return;
  const {data,error}=await sbClient.from("saves").select("save_data").eq("user_id",sbUser.id).single();
  if(error||!data) return;
  try{
    const d=JSON.parse(data.save_data);
    Object.assign(S,d);
    updateHUD();updateBiomeBar();updateEquippedBadge();updateAuraDisplay();updateCompanion();
    toast("☁️ Progress loaded from cloud!");
  }catch(e){toast("❌ Failed to load cloud save");}
}

function updateAuthUI(){
  const el=document.getElementById("auth-status");
  if(!el) return;
  if(sbUser){
    el.innerHTML=
      "<div style='color:#60e880;font-size:11px;font-weight:bold'>✅ "+sbUser.email+"</div>"+
      "<div style='display:flex;gap:6px;margin-top:6px'>"+
      "<button onclick='saveCloudSave()' style='flex:1;padding:7px;background:rgba(0,200,100,0.15);border:1px solid rgba(0,200,100,0.3);border-radius:7px;color:#60e880;font-family:inherit;font-size:10px;cursor:pointer'>☁️ Save</button>"+
      "<button onclick='loadCloudSave()' style='flex:1;padding:7px;background:rgba(0,150,255,0.15);border:1px solid rgba(0,150,255,0.3);border-radius:7px;color:#60aaff;font-family:inherit;font-size:10px;cursor:pointer'>⬇️ Load</button>"+
      "<button onclick='authSignOut()' style='flex:1;padding:7px;background:rgba(255,80,80,0.12);border:1px solid rgba(255,80,80,0.25);border-radius:7px;color:#ff8080;font-family:inherit;font-size:10px;cursor:pointer'>Sign Out</button>"+
      "</div>";
  }else{
    el.innerHTML=
      "<div style='display:flex;flex-direction:column;gap:6px'>"+
      "<input id='auth-email' type='email' placeholder='Email' style='padding:7px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:7px;color:#fff;font-family:inherit;font-size:11px;outline:none'/>"+
      "<input id='auth-pass' type='password' placeholder='Password' style='padding:7px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:7px;color:#fff;font-family:inherit;font-size:11px;outline:none'/>"+
      "<div style='display:flex;gap:6px'>"+
      "<button onclick='_doSignIn()' style='flex:1;padding:7px;background:rgba(100,200,100,0.15);border:1px solid rgba(100,200,100,0.3);border-radius:7px;color:#80e880;font-family:inherit;font-size:10px;cursor:pointer'>Sign In</button>"+
      "<button onclick='_doSignUp()' style='flex:1;padding:7px;background:rgba(100,100,255,0.12);border:1px solid rgba(100,100,255,0.25);border-radius:7px;color:#8888ff;font-family:inherit;font-size:10px;cursor:pointer'>Sign Up</button>"+
      "</div></div>";
  }
}
