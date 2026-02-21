// routes/shop.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Catalogue officiel des skins (source de vérité côté serveur)
const SKINS_CATALOG = [
  { id: 'neon_blue',  name: 'Neon Blue',  color: '#00f3ff', price: 0    },
  { id: 'emerald',    name: 'Emerald',    color: '#00ff88', price: 500  },
  { id: 'ruby',       name: 'Ruby',       color: '#ff3838', price: 1500 },
  { id: 'gold',       name: 'Gold',       color: '#ffd700', price: 3000 },
  { id: 'void',       name: 'Void',       color: '#8800ff', price: 5000 }
];

// ─── GET /api/shop/catalog ───────────────────────────────────────────────────
// Public - renvoie le catalogue avec état débloqué si connecté
router.get('/catalog', async (req, res) => {
  const authHeader = req.headers['authorization'];
  let unlockedSkins = ['neon_blue'];

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('unlockedSkins');
      if (user) unlockedSkins = user.unlockedSkins;
    } catch (_) { /* Token invalide, on continue sans état */ }
  }

  res.json(SKINS_CATALOG.map(s => ({
    ...s,
    unlocked: unlockedSkins.includes(s.id)
  })));
});

// ─── POST /api/shop/buy ──────────────────────────────────────────────────────
// Protégé - acheter un skin
router.post('/buy', authMiddleware, async (req, res) => {
  try {
    const { skinId } = req.body;
    const skin = SKINS_CATALOG.find(s => s.id === skinId);

    if (!skin) {
      return res.status(404).json({ error: 'Skin introuvable.' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });

    // Déjà débloqué ?
    if (user.unlockedSkins.includes(skinId)) {
      return res.status(409).json({ error: 'Ce skin est déjà débloqué.' });
    }

    // Assez de crédits ?
    if (user.credits < skin.price) {
      return res.status(402).json({
        error: `Crédits insuffisants. Tu as ${user.credits} crédits, il en faut ${skin.price}.`
      });
    }

    // Transaction : déduire crédits + ajouter skin
    user.credits -= skin.price;
    user.unlockedSkins.push(skinId);
    await user.save();

    res.json({
      success: true,
      message: `Skin "${skin.name}" débloqué !`,
      newCredits: user.credits,
      unlockedSkins: user.unlockedSkins
    });
  } catch (err) {
    console.error('[SHOP BUY]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
