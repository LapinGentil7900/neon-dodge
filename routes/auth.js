// routes/auth.js
const express    = require('express');
const router     = express.Router();
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const rateLimit  = require('express-rate-limit');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer     = require('multer');
const User       = require('../models/User');

// ─── Cloudinary Upload ────────────────────────────────────────────────────────
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
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) return cb(new Error('Format invalide. Accepté : JPG, PNG, WEBP.'));
    cb(null, true);
  }
});

// ─── Rate Limiter ─────────────────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Trop de tentatives. Réessaie dans 15 minutes.' }
});

// ─── Helper token ─────────────────────────────────────────────────────────────
function generateToken(user) {
  return jwt.sign(
    { userId: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// ─── Helper réponse utilisateur ───────────────────────────────────────────────
function userPayload(user) {
  return {
    id:             user._id,
    displayName:    user.displayName,
    role:           user.role,
    credits:        user.credits,
    highScore:      user.highScore,
    highScoreLevel: user.highScoreLevel,
    unlockedSkins:  user.unlockedSkins,
    profilePicture: user.profilePicture?.url || null
  };
}

// ─── POST /api/auth/register ──────────────────────────────────────────────────
router.post('/register', upload.single('profilePicture'), async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Pseudo et mot de passe requis.' });
    if (username.trim().length < 3 || username.trim().length > 20) return res.status(400).json({ error: 'Pseudo : 3 à 20 caractères.' });
    if (password.length < 6) return res.status(400).json({ error: 'Mot de passe : minimum 6 caractères.' });

    const existing = await User.findOne({ username: username.toLowerCase() });
    if (existing) {
      if (req.file?.filename) cloudinary.uploader.destroy(req.file.filename);
      return res.status(409).json({ error: `Le pseudo "${username}" est déjà utilisé.` });
    }

    const hashed = await bcrypt.hash(password, 12);
    const profilePicture = req.file
      ? { url: req.file.path, publicId: req.file.filename }
      : { url: null, publicId: null };

    // Premier compte créé = admin automatiquement
    const count = await User.countDocuments();
    const role  = count === 0 ? 'admin' : 'player';

    const user = await User.create({
      username: username.trim(),
      displayName: username.trim(),
      password: hashed,
      profilePicture,
      role,
      credits: 0,
      unlockedSkins: ['neon_blue']
    });

    res.status(201).json({ token: generateToken(user), user: userPayload(user) });
  } catch (err) {
    console.error('[REGISTER]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Champs manquants.' });

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Pseudo ou mot de passe incorrect.' });

    if (user.banned) return res.status(403).json({ error: `Compte banni. Raison : ${user.bannedReason || 'Non précisée'}` });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Pseudo ou mot de passe incorrect.' });

    res.json({ token: generateToken(user), user: userPayload(user) });
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
    res.json(userPayload(user));
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
