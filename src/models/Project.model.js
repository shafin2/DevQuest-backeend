import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    projectManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'cancelled'],
      default: 'pending',
    },
    budget: {
      type: Number,
      min: 0,
    },
    deadline: {
      type: Date,
    },
    techStack: [{
      type: String,
      trim: true,
    }],
    totalXP: {
      type: Number,
      default: 0,
      min: 0,
    },
    teamMembers: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      role: {
        type: String,
        enum: ['developer'],
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ['invited', 'active', 'removed'],
        default: 'active',
      },
    }],
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
projectSchema.index({ client: 1, status: 1 });
projectSchema.index({ projectManager: 1, status: 1 });
projectSchema.index({ 'teamMembers.user': 1 });
projectSchema.index({ status: 1, createdAt: -1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;
