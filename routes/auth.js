// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const User = require('../models/User');

// ─── Cloudinary Upload Config ───────────────────────────────────────────────
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'neon-dodge/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }]
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Format invalide. Accepté : JPG, PNG, WEBP.'));
    }
    cb(null, true);
  }
});

// ─── Rate Limiter Login ──────────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: 'Trop de tentatives. Réessaie dans 15 minutes.' }
});

// ─── Helper : générer token ──────────────────────────────────────────────────
function generateToken(user) {
  return jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// ─── POST /api/auth/register ─────────────────────────────────────────────────
router.post('/register', upload.single('profilePicture'), async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validations de base
    if (!username || !password) {
      return res.status(400).json({ error: 'Pseudo et mot de passe requis.' });
    }
    if (username.trim().length < 3 || username.trim().length > 20) {
      return res.status(400).json({ error: 'Pseudo : 3 à 20 caractères.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Mot de passe : minimum 6 caractères.' });
    }

    // Vérifier unicité (insensible à la casse via le setter lowercase du modèle)
    const existing = await User.findOne({ username: username.toLowerCase() });
    if (existing) {
      // Supprimer l'image uploadée sur Cloudinary si doublon
      if (req.file?.filename) cloudinary.uploader.destroy(req.file.filename);
      return res.status(409).json({ error: `Le pseudo "${username}" est déjà utilisé.` });
    }

    // Hash du mot de passe
    const hashed = await bcrypt.hash(password, 12);

    // Préparer la photo de profil
    const profilePicture = req.file
      ? { url: req.file.path, publicId: req.file.filename }
      : { url: null, publicId: null };

    // Créer l'utilisateur
    const user = await User.create({
      username: username.trim(),
      displayName: username.trim(),
      password: hashed,
      profilePicture,
      credits: 0,
      unlockedSkins: ['neon_blue']
    });

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        credits: user.credits,
        highScore: user.highScore,
        unlockedSkins: user.unlockedSkins,
        profilePicture: user.profilePicture.url
      }
    });
  } catch (err) {
    console.error('[REGISTER]', err.message);
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription.' });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Champs manquants.' });
    }

    // Chercher l'utilisateur (username stocké en lowercase)
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Pseudo ou mot de passe incorrect.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Pseudo ou mot de passe incorrect.' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        credits: user.credits,
        highScore: user.highScore,
        highScoreLevel: user.highScoreLevel,
        unlockedSkins: user.unlockedSkins,
        profilePicture: user.profilePicture.url
      }
    });
  } catch (err) {
    console.error('[LOGIN]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
const authMiddleware = require('../middleware/authMiddleware');
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });
    res.json({
      id: user._id,
      displayName: user.displayName,
      credits: user.credits,
      highScore: user.highScore,
      highScoreLevel: user.highScoreLevel,
      unlockedSkins: user.unlockedSkins,
      profilePicture: user.profilePicture.url
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
