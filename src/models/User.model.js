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

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.sessions;
  delete user.__v;
  return user;
};

export default mongoose.model('User', userSchema);
