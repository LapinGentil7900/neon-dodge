// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
    // Stockage en lowercase pour unicité insensible à la casse
    set: (v) => v.toLowerCase()
  },
  // Pseudo affiché avec la casse originale
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    url: { type: String, default: null },
    publicId: { type: String, default: null } // Cloudinary public_id pour suppression
  },
  credits: {
    type: Number,
    default: 0,
    min: 0
  },
  highScore: {
    type: Number,
    default: 0,
    min: 0
  },
  highScoreLevel: {
    type: String,
    default: 'SÉCURITÉ'
  },
  unlockedSkins: {
    type: [String],
    default: ['neon_blue'] // skin de base offert
  }
}, {
  timestamps: true
});

// Index sur username (déjà unique, mais on force lowercase)
userSchema.index({ username: 1 });

module.exports = mongoose.model('User', userSchema);
