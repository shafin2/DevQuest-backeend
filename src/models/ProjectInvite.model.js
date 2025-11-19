import mongoose from 'mongoose';
import crypto from 'crypto';

const projectInviteSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    invitedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['pm', 'developer'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'expired'],
      default: 'pending',
    },
    token: {
      type: String,
      unique: true,
      sparse: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
    acceptedAt: {
      type: Date,
    },
    declinedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
projectInviteSchema.index({ project: 1, invitedUser: 1, status: 1 });
projectInviteSchema.index({ invitedUser: 1, status: 1 });
projectInviteSchema.index({ token: 1 });
projectInviteSchema.index({ expiresAt: 1 });

// Generate unique token before saving
projectInviteSchema.pre('save', function(next) {
  if (!this.token) {
    this.token = crypto.randomBytes(32).toString('hex');
  }
  next();
});

// Check if invite is expired
projectInviteSchema.methods.isExpired = function() {
  return this.expiresAt < new Date() || this.status === 'expired';
};

const ProjectInvite = mongoose.model('ProjectInvite', projectInviteSchema);

export default ProjectInvite;
