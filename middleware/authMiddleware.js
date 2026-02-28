// middleware/authMiddleware.js
const jwt  = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant ou malformé.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifier en base que l'utilisateur existe et n'est pas banni
    const user = await User.findById(decoded.userId).select('role banned bannedReason');
    if (!user) return res.status(401).json({ error: 'Utilisateur introuvable.' });
    if (user.banned) return res.status(403).json({ error: `Compte banni. Raison : ${user.bannedReason || 'Non précisée'}` });

    req.userId   = decoded.userId;
    req.username = decoded.username;
    req.role     = user.role;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide ou expiré.' });
  }
};
