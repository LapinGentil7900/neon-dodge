// routes/admin.js
const express        = require('express');
const router         = express.Router();
const User           = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Toutes les routes admin nécessitent auth + role admin
router.use(authMiddleware, adminMiddleware);

// ─── GET /api/admin/users ─────────────────────────────────────────────────────
// Liste tous les joueurs avec leurs infos
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users.map(u => ({
      id:           u._id,
      displayName:  u.displayName,
      username:     u.username,
      role:         u.role,
      banned:       u.banned,
      bannedReason: u.bannedReason,
      credits:      u.credits,
      highScore:    u.highScore,
      highScoreLevel: u.highScoreLevel,
      avatar:       u.profilePicture?.url || null,
      createdAt:    u.createdAt
    })));
  } catch (err) {
    console.error('[ADMIN users]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ─── POST /api/admin/ban ──────────────────────────────────────────────────────
// Banne un joueur (désactive son compte)
router.post('/ban', async (req, res) => {
  try {
    const { userId, reason } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId requis.' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });
    if (user.role === 'admin') return res.status(403).json({ error: 'Impossible de bannir un admin.' });
    if (user._id.toString() === req.userId) return res.status(403).json({ error: 'Impossible de te bannir toi-même.' });

    user.banned       = true;
    user.bannedReason = reason || 'Violation des règles';
    user.bannedAt     = new Date();
    await user.save();

    res.json({ success: true, message: `${user.displayName} a été banni.` });
  } catch (err) {
    console.error('[ADMIN ban]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ─── POST /api/admin/unban ────────────────────────────────────────────────────
// Débanne un joueur
router.post('/unban', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId requis.' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });

    user.banned       = false;
    user.bannedReason = null;
    user.bannedAt     = null;
    await user.save();

    res.json({ success: true, message: `${user.displayName} a été débanni.` });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ─── POST /api/admin/kick-score ───────────────────────────────────────────────
// Reset le score d'un joueur (le kick du classement)
router.post('/kick-score', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId requis.' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });
    if (user.role === 'admin') return res.status(403).json({ error: 'Impossible de modifier un admin.' });

    user.highScore      = 0;
    user.highScoreLevel = 'TUTORIAL';
    await user.save();

    res.json({ success: true, message: `Score de ${user.displayName} remis à zéro.` });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ─── POST /api/admin/set-credits ─────────────────────────────────────────────
// Modifie les crédits d'un joueur
router.post('/set-credits', async (req, res) => {
  try {
    const { userId, credits } = req.body;
    if (!userId || credits === undefined) return res.status(400).json({ error: 'userId et credits requis.' });
    if (typeof credits !== 'number' || credits < 0) return res.status(400).json({ error: 'Valeur invalide.' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });

    user.credits = credits;
    await user.save();

    res.json({ success: true, message: `Crédits de ${user.displayName} mis à jour : ${credits}.` });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ─── POST /api/admin/promote ──────────────────────────────────────────────────
// Promouvoit un joueur en admin (ou rétrograde)
router.post('/promote', async (req, res) => {
  try {
    const { userId, role } = req.body;
    if (!userId || !['player', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'userId et role (player|admin) requis.' });
    }
    if (userId === req.userId) return res.status(403).json({ error: 'Impossible de modifier ton propre rôle.' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });

    user.role = role;
    await user.save();

    const label = role === 'admin' ? 'promu Admin' : 'rétrogradé Joueur';
    res.json({ success: true, message: `${user.displayName} a été ${label}.` });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ─── DELETE /api/admin/delete-user ───────────────────────────────────────────
// Supprime définitivement un compte
router.delete('/delete-user', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId requis.' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });
    if (user.role === 'admin') return res.status(403).json({ error: 'Impossible de supprimer un admin.' });
    if (user._id.toString() === req.userId) return res.status(403).json({ error: 'Impossible de supprimer ton propre compte.' });

    await User.findByIdAndDelete(userId);
    res.json({ success: true, message: `Compte de ${user.displayName} supprimé définitivement.` });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────
// Stats globales du jeu
router.get('/stats', async (req, res) => {
  try {
    const totalUsers  = await User.countDocuments();
    const totalBanned = await User.countDocuments({ banned: true });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const topScore    = await User.findOne({ banned: false }).sort({ highScore: -1 }).select('displayName highScore');

    res.json({ totalUsers, totalBanned, totalAdmins, topScore: topScore ? { name: topScore.displayName, score: topScore.highScore } : null });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
