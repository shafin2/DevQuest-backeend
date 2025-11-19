import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function() { return !this.googleId; },
    select: false,
  },
  googleId: {
    type: String,
    sparse: true,
  },
  role: {
    type: String,
    enum: ['client', 'pm', 'developer'],
    default: 'client',
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  // Basic profile info
  name: {
    type: String,
    required: true,
  },
  avatar: String,
  
  // Developer/PM specific fields
  skills: [String],
  experience: String,
  portfolio: String,
  github: String,
  linkedin: String,
  bio: String,
  hourlyRate: Number,
  availability: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'not-available'],
  },
  
  // Gamification fields
  xp: {
    type: Number,
    default: 0,
    min: 0,
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
  },
  badges: [{
    badgeId: String,
    name: String,
    earnedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  tasksCompleted: {
    type: Number,
    default: 0,
    min: 0,
  },
  projectsCompleted: {
    type: Number,
    default: 0,
    min: 0,
  },
  
  sessions: [{
    refreshToken: String,
    platform: {
      type: String,
      enum: ['web', 'mobile'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate level based on XP (100 XP per level)
userSchema.methods.updateLevel = function() {
  const newLevel = Math.floor(this.xp / 100) + 1;
  if (newLevel !== this.level) {
    this.level = newLevel;
    return true; // Level up occurred
  }
  return false;
};

// Add XP and check for level up
userSchema.methods.addXP = function(points) {
  this.xp += points;
  const leveledUp = this.updateLevel();
  return { xp: this.xp, level: this.level, leveledUp };
};

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.sessions;
  delete user.__v;
  return user;
};

export default mongoose.model('User', userSchema);
