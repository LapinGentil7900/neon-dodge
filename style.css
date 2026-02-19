/* ═══════════════════════════════════════════
   NEON DODGE — Style v3
   ═══════════════════════════════════════════ */
:root{
    --neon:#00f3ff; --pink:#ff3838; --blue:#0088ff;
    --green:#00ff88; --orange:#ffaa00; --violet:#cc66ff;
    --bg:#050508; --surf:#0c0c12; --border:rgba(0,243,255,.18);
}
*{ box-sizing:border-box; }
body{
    margin:0; background:var(--bg); overflow:hidden;
    font-family:'Orbitron',sans-serif; color:#fff;
    user-select:none; -webkit-user-select:none;
}
body::after{
    content:''; pointer-events:none; position:fixed; inset:0; z-index:9999;
    background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.09) 3px,rgba(0,0,0,.09) 4px);
}

/* ── SCREENS ──────────────────────────────── */
.screen{
    position:absolute; inset:0; display:flex;
    flex-direction:column; justify-content:center; align-items:center;
    background:var(--bg); z-index:10; gap:10px;
}

/* ── NEON TITLE ───────────────────────────── */
.neon-title{
    font-size:clamp(2.5rem,7vw,4.5rem); font-weight:900;
    color:var(--neon); letter-spacing:.12em; margin:0;
    text-shadow:0 0 18px var(--neon),0 0 55px var(--neon),0 0 110px var(--neon);
    animation:ptitle 3s ease-in-out infinite;
}
@keyframes ptitle{
    0%,100%{text-shadow:0 0 18px var(--neon),0 0 55px var(--neon),0 0 110px var(--neon)}
    50%{text-shadow:0 0 35px var(--neon),0 0 90px var(--neon),0 0 190px var(--neon)}
}
.subtitle{ font-size:.58rem; letter-spacing:.4em; color:rgba(0,243,255,.38); margin:-8px 0 6px; }

/* ── USER TAG ─────────────────────────────── */
#user-tag{
    position:absolute; top:14px; right:14px;
    font-size:.55rem; letter-spacing:.08em; color:var(--neon);
    border:1px solid var(--border); padding:5px 12px;
    background:rgba(0,243,255,.04); cursor:pointer; z-index:15;
    transition:all .2s;
}
#user-tag:hover{ background:rgba(0,243,255,.08); }

/* ── MENU ─────────────────────────────────── */
.menu-grid{ display:grid; grid-template-columns:1fr 1fr; gap:10px; width:min(300px,88vw); margin-top:14px; }

/* ── BUTTONS ──────────────────────────────── */
.btn{
    padding:13px 16px; border:1px solid var(--neon);
    background:transparent; color:var(--neon);
    font-family:'Orbitron'; font-size:.62rem; letter-spacing:.08em;
    cursor:pointer; transition:all .18s; position:relative; overflow:hidden;
}
.btn::before{
    content:''; position:absolute; inset:0; background:var(--neon);
    transform:scaleX(0); transform-origin:left; transition:transform .18s; z-index:-1;
}
.btn:hover::before{ transform:scaleX(1); }
.btn:hover{ color:#000; }
.btn-blue  { border-color:var(--blue);   color:var(--blue);   }
.btn-blue::before { background:var(--blue); }
.btn-blue:hover   { color:#000; }
.btn-green { border-color:var(--green);  color:var(--green);  }
.btn-green::before{ background:var(--green);}
.btn-green:hover  { color:#000; }
.btn-red   { border-color:var(--pink);   color:var(--pink);   }
.btn-red::before  { background:var(--pink);  }
.btn-red:hover    { color:#fff; }
.btn-orange{ border-color:var(--orange); color:var(--orange); }
.btn-orange::before{background:var(--orange);}
.btn-orange:hover { color:#000; }
.btn-violet{ border-color:var(--violet); color:var(--violet); }
.btn-violet::before{background:var(--violet);}
.btn-violet:hover { color:#000; }
.btn-full{ width:min(290px,88vw); }
.btn-sm  { padding:8px 14px; font-size:.55rem; }

/* ── INPUTS ───────────────────────────────── */
input[type=text],input[type=password],input[type=number]{
    background:var(--surf); border:1px solid var(--border);
    color:#fff; padding:11px 14px; font-family:'Orbitron'; font-size:.62rem;
    outline:none; transition:border-color .2s; width:min(275px,88vw);
}
input:focus{ border-color:var(--neon); box-shadow:0 0 10px rgba(0,243,255,.12); }

/* ── SECTION TITLE ────────────────────────── */
.sc-title{
    font-size:clamp(.75rem,2vw,1rem); letter-spacing:.2em; color:var(--neon);
    margin:0 0 8px; padding-bottom:9px; border-bottom:1px solid var(--border);
    width:min(330px,90vw); text-align:center;
}

/* ── AUTH TABS ────────────────────────────── */
.auth-tabs{ display:flex; width:min(275px,88vw); }
.auth-tab{
    flex:1; padding:9px; text-align:center; cursor:pointer;
    font-size:.58rem; letter-spacing:.1em;
    border:1px solid var(--border); color:rgba(255,255,255,.3);
    transition:all .2s; font-family:'Orbitron';
}
.auth-tab.active{ border-color:var(--neon); color:var(--neon); background:rgba(0,243,255,.05); }
.auth-form{ display:flex; flex-direction:column; gap:8px; width:min(275px,88vw); }

/* ── SHOP ─────────────────────────────────── */
#skin-list{
    display:flex; flex-direction:column; gap:8px;
    width:min(290px,88vw); max-height:330px; overflow-y:auto;
}
#skin-list::-webkit-scrollbar{ width:3px; }
#skin-list::-webkit-scrollbar-thumb{ background:var(--border); }
.btn-skin{
    display:flex; align-items:center; justify-content:space-between;
    padding:11px 14px; border:1px solid rgba(255,255,255,.1);
    background:var(--surf); color:#fff; cursor:pointer;
    font-family:'Orbitron'; font-size:.58rem; letter-spacing:.04em; width:100%;
    transition:border-color .2s;
}
.btn-skin:hover{ border-color:rgba(255,255,255,.3); }
.skin-dot{ width:10px; height:10px; border-radius:50%; flex-shrink:0; }
.skin-badge{ font-size:.48rem; padding:2px 7px; border:1px solid; border-radius:2px; }
.badge-owned   { border-color:var(--green)!important; color:var(--green); }
.badge-equipped{ border-color:var(--neon)!important;  color:var(--neon);  }
.badge-price   { border-color:rgba(255,255,255,.2);   color:rgba(255,255,255,.38); }

/* ── LEADERBOARD ──────────────────────────── */
#lead-list{ width:min(340px,92vw); max-height:340px; overflow-y:auto; }
#lead-list::-webkit-scrollbar{ width:3px; }
#lead-list::-webkit-scrollbar-thumb{ background:var(--border); }
.lead-row{
    display:flex; align-items:center; gap:10px;
    padding:8px 13px; border-bottom:1px solid rgba(255,255,255,.04);
    font-size:.6rem;
}
.lead-rank{ width:22px; color:rgba(255,255,255,.25); font-size:.52rem; }
.lead-rank.gold  { color:#ffd700; }
.lead-rank.silver{ color:#bbb; }
.lead-rank.bronze{ color:#cd7f32; }
.lead-name { flex:1; color:rgba(255,255,255,.8); }
.lead-score{ color:var(--neon); letter-spacing:.04em; }
.lead-date { color:rgba(255,255,255,.2); font-size:.48rem; margin-left:auto; }
.lead-empty{ text-align:center; color:rgba(255,255,255,.2); font-size:.58rem; padding:28px; letter-spacing:.1em; }

/* ── STATS BLOCK ──────────────────────────── */
.stats-block{
    display:grid; grid-template-columns:1fr 1fr; gap:6px;
    width:min(290px,88vw); margin:6px 0;
}
.stat-item{
    background:var(--surf); border:1px solid rgba(255,255,255,.04);
    padding:9px 12px; text-align:center;
}
.stat-val{ font-size:.95rem; color:var(--neon); }
.stat-lbl{ font-size:.48rem; color:rgba(255,255,255,.28); letter-spacing:.1em; margin-top:2px; }

/* ── RANK BAR ─────────────────────────────── */
.rank-bar-wrap{ width:min(275px,88vw); height:4px; background:rgba(255,255,255,.07); margin:4px 0; }
.rank-bar{ height:100%; transition:width .5s; }
.rank-label{ font-size:.55rem; letter-spacing:.14em; }

/* ── ACHIEVEMENTS ─────────────────────────── */
.ach-grid{
    display:grid; grid-template-columns:1fr 1fr; gap:6px;
    width:min(330px,92vw); max-height:340px; overflow-y:auto;
}
.ach-grid::-webkit-scrollbar{ width:3px; }
.ach-grid::-webkit-scrollbar-thumb{ background:var(--border); }
.ach-item{
    padding:8px 10px; background:var(--surf);
    border:1px solid rgba(255,255,255,.05); font-size:.52rem;
}
.ach-item.unlocked{ border-color:rgba(0,243,255,.28); }
.ach-icon{ font-size:.85rem; margin-bottom:2px; }
.ach-name{ color:rgba(255,255,255,.5); line-height:1.3; }
.ach-item.unlocked .ach-name{ color:var(--neon); }
.ach-desc{ color:rgba(255,255,255,.22); margin-top:2px; line-height:1.3; }
.ach-xp  { color:var(--orange); margin-top:3px; }

/* ── DAILY CARD ───────────────────────────── */
.daily-card{
    width:min(290px,88vw); padding:13px 15px;
    background:var(--surf); border:1px solid rgba(255,170,0,.22);
}
.daily-title{ font-size:.48rem; color:var(--orange); letter-spacing:.18em; margin-bottom:5px; }
.daily-desc { font-size:.62rem; color:rgba(255,255,255,.82); margin-bottom:7px; }
.daily-prog-wrap{ height:3px; background:rgba(255,255,255,.07); }
.daily-prog { height:100%; background:var(--orange); transition:width .4s; }
.daily-prog-text{ font-size:.48rem; color:rgba(255,255,255,.28); margin-top:3px; text-align:right; }
.daily-reward   { font-size:.48rem; color:var(--orange); margin-top:5px; }
.daily-done     { font-size:.58rem; color:var(--green); text-align:center; padding:5px; }

/* ── GAME ─────────────────────────────────── */
#layer-game{ position:absolute; inset:0; display:none; }
#gameCanvas { display:block; }

/* ── HUD ──────────────────────────────────── */
#hud{
    position:absolute; top:0; left:0; right:0;
    display:flex; justify-content:space-between; align-items:flex-start;
    padding:13px 17px; pointer-events:none;
}
.hud-l,.hud-r{ display:flex; flex-direction:column; gap:2px; }
.hud-r{ align-items:flex-end; }
.hud-lbl { font-size:.48rem; color:rgba(255,255,255,.22); letter-spacing:.1em; }
.hud-val { font-size:clamp(1.2rem,4vw,2rem); color:var(--neon); text-shadow:0 0 10px var(--neon); }
.hud-hi  { font-size:.58rem; color:rgba(255,255,255,.28); }
.hud-lvl { font-size:.62rem; letter-spacing:.08em; }
.hud-next{ font-size:.48rem; color:rgba(255,255,255,.25); }

/* combo */
#combo-hud{
    position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
    text-align:center; pointer-events:none; display:none; animation:combo-pop .15s ease;
}
@keyframes combo-pop{ from{transform:translate(-50%,-50%) scale(.7)} to{transform:translate(-50%,-50%) scale(1)} }
.combo-num{ font-size:clamp(1.8rem,5vw,3rem); font-weight:900; color:var(--orange); text-shadow:0 0 18px var(--orange); }
.combo-lbl{ font-size:.55rem; color:rgba(255,170,0,.55); letter-spacing:.2em; }

/* level progress */
#level-bar-wrap{ position:absolute; bottom:0; left:0; right:0; height:3px; background:rgba(255,255,255,.04); }
#level-bar{ height:100%; transition:width .3s; }

/* powerup banner */
#pu-hud{
    position:absolute; bottom:20px; left:50%; transform:translateX(-50%);
    font-size:.58rem; letter-spacing:.14em; pointer-events:none;
    display:none; animation:blink-pu 1s ease infinite;
}
@keyframes blink-pu{ 0%,100%{opacity:1} 50%{opacity:.38} }

/* god mode badge */
#god-badge{
    position:absolute; top:13px; left:50%; transform:translateX(-50%);
    font-size:.48rem; color:var(--orange); letter-spacing:.18em;
    border:1px solid var(--orange); padding:3px 10px;
    display:none; pointer-events:none; animation:blink-pu 1s ease infinite;
}

/* fps */
#fps-el{
    position:absolute; bottom:14px; right:14px;
    font-size:.48rem; color:rgba(255,255,255,.2); letter-spacing:.1em;
    display:none; pointer-events:none; z-index:100;
}

/* ── DEATH SCREEN ─────────────────────────── */
#layer-death{
    position:absolute; inset:0; z-index:20; display:none;
    flex-direction:column; justify-content:center; align-items:center;
    gap:7px; background:rgba(0,0,0,.88); animation:fdin .4s ease;
}
@keyframes fdin{ from{opacity:0} to{opacity:1} }
.death-title{
    font-size:clamp(1.8rem,7vw,3.5rem); color:var(--pink); font-weight:900;
    text-shadow:0 0 28px var(--pink); letter-spacing:.2em;
    animation:glitch .22s ease infinite alternate;
}
@keyframes glitch{
    0%{transform:translate(0)}
    40%{transform:translate(-2px,1px)}
    80%{transform:translate(2px,-1px)}
}
.death-score{ font-size:clamp(.9rem,3vw,1.5rem); color:var(--neon); }
.death-sub  { font-size:.58rem; color:rgba(255,255,255,.28); letter-spacing:.1em; }
.death-new  { font-size:.58rem; color:var(--green); letter-spacing:.14em; }
.death-rewards{ display:flex; gap:16px; margin:5px 0; }
.d-rew-val{ font-size:.9rem; }
.d-rew-lbl{ font-size:.44rem; color:rgba(255,255,255,.28); letter-spacing:.1em; }
.death-btns{ display:flex; gap:10px; margin-top:12px; }
.death-daily{ font-size:.52rem; color:var(--orange); }

/* ── DEV PANEL ────────────────────────────── */
#dev-tab{
    position:fixed; top:50%; right:0; z-index:501;
    transform:translateY(-50%) rotate(180deg); writing-mode:vertical-rl;
    background:rgba(255,170,0,.08); border:1px solid rgba(255,170,0,.25);
    border-right:none; color:var(--orange); font-size:.46rem; letter-spacing:.14em;
    padding:10px 6px; cursor:pointer; font-family:'Orbitron'; transition:background .2s;
}
#dev-tab:hover{ background:rgba(255,170,0,.18); }
#dev-panel{
    position:fixed; top:0; right:-330px; width:310px; height:100vh; z-index:500;
    background:rgba(4,4,8,.97); border-left:1px solid rgba(255,170,0,.25);
    display:flex; flex-direction:column; transition:right .28s cubic-bezier(.4,0,.2,1);
}
#dev-panel.open{ right:0; }
.dev-header{
    padding:11px 13px; border-bottom:1px solid rgba(255,170,0,.18);
    display:flex; align-items:center; justify-content:space-between; flex-shrink:0;
}
.dev-htitle{ font-size:.65rem; color:var(--orange); letter-spacing:.18em; }
.dev-hclose{
    background:none; border:none; color:rgba(255,255,255,.3);
    cursor:pointer; font-size:.95rem; line-height:1; padding:0;
    font-family:monospace; transition:color .2s;
}
.dev-hclose:hover{ color:var(--pink); }
#dev-log{
    flex:1; overflow-y:auto; padding:8px 10px;
    font-size:.52rem; font-family:'Courier New',monospace; line-height:1.65;
}
#dev-log::-webkit-scrollbar{ width:3px; }
#dev-log::-webkit-scrollbar-thumb{ background:rgba(255,170,0,.28); }
.ll{ margin-bottom:1px; }
.ts{ color:rgba(255,255,255,.18); margin-right:5px; }
.li{ color:rgba(255,255,255,.45); }
.lg{ color:var(--neon); }
.lw{ color:var(--orange); }
.ls{ color:var(--green); }
.le{ color:var(--pink); }
.lc{ color:var(--violet); }
.lx{ color:rgba(255,255,255,.2); }
/* quick shortcuts */
.dev-shorts{
    padding:7px 9px; border-top:1px solid rgba(255,170,0,.1);
    display:flex; flex-wrap:wrap; gap:4px; flex-shrink:0;
}
.ds{
    font-size:.42rem; color:rgba(255,170,0,.5); border:1px solid rgba(255,170,0,.14);
    padding:2px 6px; cursor:pointer; font-family:'Orbitron'; transition:all .18s;
}
.ds:hover{ color:var(--orange); border-color:var(--orange); }
.ds.danger{ color:rgba(255,56,56,.5); border-color:rgba(255,56,56,.18); }
.ds.danger:hover{ color:var(--pink); border-color:var(--pink); }
/* cmd input */
.dev-cmd{
    display:flex; align-items:center; gap:6px;
    border-top:1px solid rgba(255,170,0,.18); padding:7px 9px; flex-shrink:0;
}
.dev-prompt{ color:var(--orange); font-family:'Courier New'; font-size:.62rem; flex-shrink:0; }
#dev-input{
    flex:1; background:none; border:none; color:#fff;
    font-family:'Courier New'; font-size:.62rem; outline:none; min-width:0;
}
#dev-input::placeholder{ color:rgba(255,255,255,.18); }
.dev-send{
    background:none; border:1px solid rgba(255,170,0,.3); color:var(--orange);
    cursor:pointer; font-size:.52rem; padding:3px 7px; font-family:'Orbitron';
    transition:all .18s; flex-shrink:0;
}
.dev-send:hover{ background:var(--orange); color:#000; }

/* ── NOTIFICATION ─────────────────────────── */
#notif{
    position:fixed; top:52px; left:50%; transform:translateX(-50%);
    background:var(--surf); border:1px solid var(--neon); color:var(--neon);
    font-size:.58rem; letter-spacing:.1em; padding:6px 18px;
    z-index:1000; pointer-events:none; display:none; white-space:nowrap;
}

/* ── ACH POPUP ────────────────────────────── */
#ach-popup{
    position:fixed; bottom:28px; left:18px; z-index:600;
    background:var(--surf); border:1px solid rgba(255,170,0,.4);
    padding:11px 15px; max-width:230px; display:none;
    animation:slide-in .38s ease;
}
@keyframes slide-in{ from{transform:translateX(-250px)} to{transform:translateX(0)} }
.ap-title{ font-size:.44rem; color:var(--orange); letter-spacing:.18em; margin-bottom:3px; }
.ap-name { font-size:.65rem; color:var(--neon); }
.ap-desc { font-size:.48rem; color:rgba(255,255,255,.38); margin-top:2px; }
