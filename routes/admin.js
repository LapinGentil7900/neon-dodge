// routes/admin.js
const express         = require('express');
const router          = express.Router();
const User            = require('../models/User');
const authMiddleware  = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.use(authMiddleware, adminMiddleware);

// ─── Liste tous les joueurs ───────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ highScore: -1 });
    res.json(users.map((u, i) => ({
      id:             u._id,
      rank:           i + 1,
      displayName:    u.displayName,
      username:       u.username,
      role:           u.role,
      banned:         u.banned,
      bannedReason:   u.bannedReason,
      credits:        u.credits,
      highScore:      u.highScore,
      highScoreLevel: u.highScoreLevel,
      avatar:         u.profilePicture?.url || null,
      pinned:         u.pinned || false,
      createdAt:      u.createdAt
    })));
  } catch (err) { res.status(500).json({ error: 'Erreur serveur.' }); }
});

// ─── Stats globales ───────────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const totalUsers  = await User.countDocuments();
    const totalBanned = await User.countDocuments({ banned: true });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const topScore    = await User.findOne({ banned: false }).sort({ highScore: -1 }).select('displayName highScore highScoreLevel');
    res.json({ totalUsers, totalBanned, totalAdmins, topScore: topScore ? { name: topScore.displayName, score: topScore.highScore, level: topScore.highScoreLevel } : null });
  } catch (err) { res.status(500).json({ error: 'Erreur serveur.' }); }
});

// ─── Ban ──────────────────────────────────────────────────────────────────────
router.post('/ban', async (req, res) => {
  try {
    const { userId, reason } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Introuvable.' });
    if (user.role === 'admin') return res.status(403).json({ error: 'Impossible de bannir un admin.' });
    if (user._id.toString() === req.userId) return res.status(403).json({ error: 'Impossible de te bannir.' });
    user.banned = true; user.bannedReason = reason || 'Violation des règles'; user.bannedAt = new Date();
    await user.save();
    res.json({ success: true, message: `${user.displayName} banni.` });
  } catch (err) { res.status(500).json({ error: 'Erreur serveur.' }); }
});

// ─── Unban ────────────────────────────────────────────────────────────────────
router.post('/unban', async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).json({ error: 'Introuvable.' });
    user.banned = false; user.bannedReason = null; user.bannedAt = null;
    await user.save();
    res.json({ success: true, message: `${user.displayName} débanni.` });
  } catch (err) { res.status(500).json({ error: 'Erreur serveur.' }); }
});

// ─── Supprimer compte ─────────────────────────────────────────────────────────
router.delete('/delete-user', async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).json({ error: 'Introuvable.' });
    if (user.role === 'admin') return res.status(403).json({ error: 'Impossible de supprimer un admin.' });
    if (user._id.toString() === req.userId) return res.status(403).json({ error: 'Impossible de supprimer ton compte ici.' });
    await User.findByIdAndDelete(req.body.userId);
    res.json({ success: true, message: `Compte de ${user.displayName} supprimé.` });
  } catch (err) { res.status(500).json({ error: 'Erreur serveur.' }); }
});

// ─── Modifier crédits ─────────────────────────────────────────────────────────
router.post('/set-credits', async (req, res) => {
  try {
    const { userId, credits } = req.body;
    if (typeof credits !== 'number' || credits < 0) return res.status(400).json({ error: 'Valeur invalide.' });
    const user = await User.findByIdAndUpdate(userId, { credits }, { new: true });
    if (!user) return res.status(404).json({ error: 'Introuvable.' });
    res.json({ success: true, message: `Crédits de ${user.displayName} : ${credits}` });
  } catch (err) { res.status(500).json({ error: 'Erreur serveur.' }); }
});

// ─── Modifier score ───────────────────────────────────────────────────────────
router.post('/set-score', async (req, res) => {
  try {
    const { userId, score, level } = req.body;
    if (typeof score !== 'number' || score < 0) return res.status(400).json({ error: 'Valeur invalide.' });
    const user = await User.findByIdAndUpdate(userId, { highScore: score, highScoreLevel: level || 'TUTORIAL' }, { new: true });
    if (!user) return res.status(404).json({ error: 'Introuvable.' });
    res.json({ success: true, message: `Score de ${user.displayName} : ${score}` });
  } catch (err) { res.status(500).json({ error: 'Erreur serveur.' }); }
});

// ─── Reset score ──────────────────────────────────────────────────────────────
router.post('/kick-score', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.body.userId, { highScore: 0, highScoreLevel: 'TUTORIAL' }, { new: true });
    if (!user) return res.status(404).json({ error: 'Introuvable.' });
    res.json({ success: true, message: `Score de ${user.displayName} remis à zéro.` });
  } catch (err) { res.status(500).json({ error: 'Erreur serveur.' }); }
});

// ─── Promouvoir / rétrograder ─────────────────────────────────────────────────
router.post('/promote', async (req, res) => {
  try {
    const { userId, role } = req.body;
    if (!['player', 'admin'].includes(role)) return res.status(400).json({ error: 'Rôle invalide.' });
    if (userId === req.userId) return res.status(403).json({ error: 'Impossible de modifier ton propre rôle.' });
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    if (!user) return res.status(404).json({ error: 'Introuvable.' });
    res.json({ success: true, message: `${user.displayName} → ${role}` });
  } catch (err) { res.status(500).json({ error: 'Erreur serveur.' }); }
});

// ─── Épingler / désépingler en tête du classement ────────────────────────────
router.post('/pin', async (req, res) => {
  try {
    const { userId, pin } = req.body;
    const user = await User.findByIdAndUpdate(userId, { pinned: !!pin }, { new: true });
    if (!user) return res.status(404).json({ error: 'Introuvable.' });
    res.json({ success: true, message: `${user.displayName} ${pin ? 'épinglé' : 'désépinglé'}.` });
  } catch (err) { res.status(500).json({ error: 'Erreur serveur.' }); }
});

// ─── Reset classement complet ─────────────────────────────────────────────────
router.post('/reset-leaderboard', async (req, res) => {
  try {
    await User.updateMany({}, { highScore: 0, highScoreLevel: 'TUTORIAL', pinned: false });
    res.json({ success: true, message: 'Classement remis à zéro pour tous les joueurs.' });
  } catch (err) { res.status(500).json({ error: 'Erreur serveur.' }); }
});

module.exports = router;
