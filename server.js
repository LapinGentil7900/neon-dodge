// ═══════════════════════════════════════════════════════
//  NEON DODGE — SERVER v3
//  Stockage : /data/accounts.json | /data/scores.json
// ═══════════════════════════════════════════════════════
const express = require('express');
const fs      = require('fs');
const path    = require('path');
const crypto  = require('crypto');

const app      = express();
const PORT     = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const ACCS     = path.join(DATA_DIR, 'accounts.json');
const SCORES   = path.join(DATA_DIR, 'scores.json');

// ── Init data folder ──────────────────────────────────
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(ACCS))     fs.writeFileSync(ACCS,   '[]', 'utf8');
if (!fs.existsSync(SCORES))   fs.writeFileSync(SCORES, '[]', 'utf8');

// ── Middleware ─────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Sessions (in-memory, reset on server restart) ─────
// Map: token -> username
const sessions = new Map();

// ── File helpers ───────────────────────────────────────
function readJSON(file) {
    try   { return JSON.parse(fs.readFileSync(file, 'utf8')); }
    catch { return []; }
}
function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

function hashPwd(pwd) {
    return crypto.createHash('sha256')
        .update('nd_salt_v3_' + pwd)
        .digest('hex');
}
function genToken() {
    return crypto.randomBytes(40).toString('hex');
}

function getToday() {
    return new Date().toISOString().slice(0, 10);
}

// ── Daily mission pool ─────────────────────────────────
const DAILY_POOL = [
    { id:'d1', desc:'Atteindre 300 points',    target:300,  type:'score',    reward:200 },
    { id:'d2', desc:'Atteindre 1000 points',   target:1000, type:'score',    reward:400 },
    { id:'d3', desc:'Mourir 3 fois',           target:3,    type:'deaths',   reward:150 },
    { id:'d4', desc:'Enchaîner un combo x5',   target:5,    type:'combo',    reward:250 },
    { id:'d5', desc:'Ramasser 3 power-ups',    target:3,    type:'powerups', reward:200 },
    { id:'d6', desc:'Survivre 45 secondes',    target:45,   type:'survive',  reward:300 },
    { id:'d7', desc:'Atteindre score 500',     target:500,  type:'score',    reward:350 },
];

function randomMission() {
    return DAILY_POOL[Math.floor(Math.random() * DAILY_POOL.length)];
}

function freshAccount(username) {
    return {
        username,
        password:    '',
        credits:     0,
        highScore:   0,
        totalTime:   0,
        deathCount:  0,
        gamesPlayed: 0,
        xp:          0,
        ownedSkins:  ['neon_blue'],
        equippedSkin:'neon_blue',
        achievements:{},
        daily:       { date: getToday(), mission: randomMission(), progress: 0, completed: false },
        createdAt:   new Date().toISOString()
    };
}

function publicAccount(acc) {
    const { password: _, ...pub } = acc;
    return pub;
}

// ── API: Register ──────────────────────────────────────
app.post('/api/register', (req, res) => {
    const { username, password } = req.body || {};

    if (!username || username.length < 3 || username.length > 16)
        return res.json({ ok:false, error:'Pseudo : 3 à 16 caractères' });
    if (!/^[a-zA-Z0-9_\-]+$/.test(username))
        return res.json({ ok:false, error:'Pseudo : lettres, chiffres, _ et - seulement' });
    if (!password || password.length < 4)
        return res.json({ ok:false, error:'Mot de passe trop court (4 min)' });

    const accounts = readJSON(ACCS);
    if (accounts.find(a => a.username.toLowerCase() === username.toLowerCase()))
        return res.json({ ok:false, error:'Ce pseudo est déjà utilisé' });

    const account  = freshAccount(username);
    account.password = hashPwd(password);
    accounts.push(account);
    writeJSON(ACCS, accounts);

    const token = genToken();
    sessions.set(token, username);

    console.log(`[REGISTER] ${username}`);
    res.json({ ok:true, token, account: publicAccount(account) });
});

// ── API: Login ─────────────────────────────────────────
app.post('/api/login', (req, res) => {
    const { username, password } = req.body || {};
    const accounts = readJSON(ACCS);
    const acc = accounts.find(a => a.username.toLowerCase() === username?.toLowerCase());

    if (!acc)                          return res.json({ ok:false, error:'Compte introuvable' });
    if (acc.password !== hashPwd(password)) return res.json({ ok:false, error:'Mot de passe incorrect' });

    // Refresh daily if needed
    if (!acc.daily || acc.daily.date !== getToday()) {
        acc.daily = { date: getToday(), mission: randomMission(), progress: 0, completed: false };
        writeJSON(ACCS, accounts);
    }

    const token = genToken();
    sessions.set(token, username);

    console.log(`[LOGIN] ${username}`);
    res.json({ ok:true, token, account: publicAccount(acc) });
});

// ── API: Save account data ─────────────────────────────
app.post('/api/save', (req, res) => {
    const { token, data } = req.body || {};
    const username = sessions.get(token);
    if (!username) return res.json({ ok:false, error:'Session invalide — reconnectez-vous' });

    const accounts = readJSON(ACCS);
    const idx = accounts.findIndex(a => a.username.toLowerCase() === username.toLowerCase());
    if (idx < 0) return res.json({ ok:false, error:'Compte introuvable' });

    // Only update whitelisted fields (never password, never username)
    const ALLOWED = ['credits','highScore','totalTime','deathCount','gamesPlayed',
                     'xp','ownedSkins','equippedSkin','achievements','daily'];
    ALLOWED.forEach(k => {
        if (data && data[k] !== undefined) accounts[idx][k] = data[k];
    });
    accounts[idx].lastSeen = new Date().toISOString();
    writeJSON(ACCS, accounts);

    res.json({ ok:true });
});

// ── API: Submit score ──────────────────────────────────
app.post('/api/score', (req, res) => {
    const { token, score, combo } = req.body || {};
    const username = sessions.get(token);
    if (!username) return res.json({ ok:false, error:'Session invalide' });
    if (typeof score !== 'number' || score < 0) return res.json({ ok:false, error:'Score invalide' });

    const scores = readJSON(SCORES);
    scores.push({
        username,
        score:   Math.round(score),
        combo:   combo || 0,
        date:    new Date().toLocaleDateString('fr-FR'),
        ts:      Date.now()
    });
    scores.sort((a, b) => b.score - a.score);
    writeJSON(SCORES, scores.slice(0, 500)); // keep top 500

    console.log(`[SCORE] ${username}: ${score} pts`);
    res.json({ ok:true });
});

// ── API: Leaderboard ───────────────────────────────────
app.get('/api/leaderboard', (_req, res) => {
    const scores = readJSON(SCORES);
    // Best score per player
    const best = {};
    scores.forEach(s => {
        if (!best[s.username] || s.score > best[s.username].score) best[s.username] = s;
    });
    const top = Object.values(best).sort((a, b) => b.score - a.score).slice(0, 30);
    res.json({ ok:true, scores: top });
});

// ── API: Logout ────────────────────────────────────────
app.post('/api/logout', (req, res) => {
    const { token } = req.body || {};
    sessions.delete(token);
    res.json({ ok:true });
});

// ── API: Stats (admin overview) ────────────────────────
app.get('/api/admin/stats', (_req, res) => {
    const accounts = readJSON(ACCS);
    const scores   = readJSON(SCORES);
    res.json({
        players:    accounts.length,
        totalScores: scores.length,
        topScore:   scores[0] || null,
        activeSessions: sessions.size
    });
});

// ── Start ──────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🎮 NEON DODGE server running on port ${PORT}`);
    console.log(`📁 Data stored in: ${DATA_DIR}`);
    console.log(`🌐 Open: http://localhost:${PORT}\n`);
});
