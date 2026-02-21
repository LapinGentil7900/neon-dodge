// routes/scores.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// ─── POST /api/scores/submit ──────────────────────────────────────────────────
// Protégé - soumettre un score (impossible sans JWT valide)
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { score, level } = req.body;

    if (typeof score !== 'number' || score < 0 || !isFinite(score)) {
      return res.status(400).json({ error: 'Score invalide.' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });

    let updated = false;
    const creditsEarned = Math.floor(score / 10);
    user.credits += creditsEarned;

    if (score > user.highScore) {
      user.highScore = score;
      user.highScoreLevel = level || 'SÉCURITÉ';
      updated = true;
    }

    await user.save();

    res.json({
      success: true,
      isNewHighScore: updated,
      creditsEarned,
      newCredits: user.credits,
      highScore: user.highScore
    });
  } catch (err) {
    console.error('[SCORE SUBMIT]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ─── GET /api/scores/leaderboard ─────────────────────────────────────────────
// Public - top 15
router.get('/leaderboard', async (req, res) => {
  try {
    const top = await User.find({ highScore: { $gt: 0 } })
      .sort({ highScore: -1 })
      .limit(15)
      .select('displayName profilePicture highScore highScoreLevel');

    res.json(top.map((u, i) => ({
      rank: i + 1,
      displayName: u.displayName,
      avatar: u.profilePicture?.url || null,
      score: u.highScore,
      level: u.highScoreLevel
    })));
  } catch (err) {
    console.error('[LEADERBOARD]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
