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
    set: (v) => v.toLowerCase()
  },
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
    url:      { type: String, default: null },
    publicId: { type: String, default: null }
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
    default: 'TUTORIAL'
  },
  unlockedSkins: {
    type: [String],
    default: ['neon_blue']
  },
  // ── NOUVEAU ──────────────────────────────────
  role: {
    type: String,
    enum: ['player', 'admin'],
    default: 'player'
  },
  banned: {
    type: Boolean,
    default: false
  },
  pinned: {
    type: Boolean,
    default: false
  },
  bannedReason: {
    type: String,
    default: null
  },
  bannedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

userSchema.index({ username: 1 });

module.exports = mongoose.model('User', userSchema);
