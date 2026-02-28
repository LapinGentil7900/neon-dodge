// middleware/adminMiddleware.js
module.exports = function adminMiddleware(req, res, next) {
  if (req.role !== 'admin') {
    return res.status(403).json({ error: 'Accès refusé. Droits administrateur requis.' });
  }
  next();
};
