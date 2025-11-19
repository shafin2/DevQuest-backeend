import Project from '../models/Project.model.js';
import ProjectInvite from '../models/ProjectInvite.model.js';
import User from '../models/User.model.js';
import { sendEmail } from '../services/email.service.js';
import { pmInviteTemplate, developerInviteTemplate } from '../templates/email/index.js';
import AppError from '../utils/AppError.js';

// Client creates a new project
export const createProject = async (req, res, next) => {
  try {
    const { title, description, budget, deadline, techStack, pmEmail } = req.body;

    const project = await Project.create({
      title,
      description,
      budget,
      deadline,
      techStack,
      client: req.user._id,
    });

    // Award XP to client for creating project
    const client = await User.findById(req.user._id);
    const xpResult = client.addXP(50); // 50 XP for creating a project
    await client.save();

    // If PM email provided, send invite
    if (pmEmail) {
      const pm = await User.findOne({ email: pmEmail, role: 'pm' });
      
      if (!pm) {
        return res.status(200).json({
          success: true,
          message: 'Project created successfully. PM not found with that email. +50 XP earned!',
          data: { project, xpEarned: 50, leveledUp: xpResult.leveledUp, newLevel: xpResult.level },
        });
      }

      const invite = await ProjectInvite.create({
        project: project._id,
        invitedBy: req.user._id,
        invitedUser: pm._id,
        role: 'pm',
      });

      // Send email to PM
      const acceptLink = `${process.env.CLIENT_WEB_URL}/invites`;
      const emailHtml = pmInviteTemplate(pm.name, req.user.name, title, description, acceptLink);
      await sendEmail(pm.email, `New Project Invitation: ${title}`, emailHtml);
    }

    res.status(201).json({
      success: true,
      message: pmEmail ? 'Project created and invitation sent. +50 XP earned!' : 'Project created successfully. +50 XP earned!',
      data: { project, xpEarned: 50, leveledUp: xpResult.leveledUp, newLevel: xpResult.level },
    });
  } catch (error) {
    next(error);
  }
};

// Get all projects for current user based on role
export const getMyProjects = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};

    if (req.user.role === 'client') {
      query.client = req.user._id;
    } else if (req.user.role === 'pm') {
      query.projectManager = req.user._id;
    } else if (req.user.role === 'developer') {
      query['teamMembers.user'] = req.user._id;
      query['teamMembers.status'] = 'active';
    }

    if (status) {
      query.status = status;
    }

    const projects = await Project.find(query)
      .populate('client', 'name email avatar')
      .populate('projectManager', 'name email avatar level xp')
      .populate('teamMembers.user', 'name email avatar role level xp skills')
      .sort('-createdAt');

    res.json({
      success: true,
      data: { projects },
    });
  } catch (error) {
    next(error);
  }
};

// Get project by ID with full details
export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id)
      .populate('client', 'name email avatar')
      .populate('projectManager', 'name email avatar level xp badges')
      .populate('teamMembers.user', 'name email avatar role level xp skills badges');

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    // Check if user has access to this project
    const hasAccess = 
      project.client._id.toString() === req.user._id.toString() ||
      project.projectManager?._id.toString() === req.user._id.toString() ||
      project.teamMembers.some(member => 
        member.user._id.toString() === req.user._id.toString() && member.status === 'active'
      );

    if (!hasAccess) {
      return next(new AppError('You do not have access to this project', 403));
    }

    res.json({
      success: true,
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

// Get pending invites for current user
export const getMyInvites = async (req, res, next) => {
  try {
    const invites = await ProjectInvite.find({
      invitedUser: req.user._id,
      status: 'pending',
      expiresAt: { $gt: new Date() },
    })
      .populate('project', 'title description budget deadline techStack status')
      .populate('invitedBy', 'name email avatar')
      .sort('-createdAt');

    res.json({
      success: true,
      data: { invites },
    });
  } catch (error) {
    next(error);
  }
};

// Accept project invite (PM or Developer)
export const acceptInvite = async (req, res, next) => {
  try {
    const { token } = req.params;

    const invite = await ProjectInvite.findOne({ token })
      .populate('project')
      .populate('invitedBy', 'name email');

    if (!invite) {
      return next(new AppError('Invitation not found', 404));
    }

    if (invite.status !== 'pending') {
      return next(new AppError('This invitation has already been processed', 400));
    }

    if (invite.isExpired()) {
      invite.status = 'expired';
      await invite.save();
      return next(new AppError('This invitation has expired', 400));
    }

    if (invite.invitedUser.toString() !== req.user._id.toString()) {
      return next(new AppError('This invitation is not for you', 403));
    }

    const project = invite.project;

    // Update project based on role
    if (invite.role === 'pm') {
      if (project.projectManager) {
        return next(new AppError('This project already has a project manager', 400));
      }
      project.projectManager = req.user._id;
      project.status = 'active';
    } else if (invite.role === 'developer') {
      // Check if already in team
      const alreadyMember = project.teamMembers.some(
        member => member.user.toString() === req.user._id.toString()
      );
      
      if (!alreadyMember) {
        project.teamMembers.push({
          user: req.user._id,
          role: 'developer',
          status: 'active',
        });
      }
    }

    await project.save();

    invite.status = 'accepted';
    invite.acceptedAt = new Date();
    await invite.save();

    res.json({
      success: true,
      message: 'Invitation accepted successfully',
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

// PM invites developers to project
export const inviteDeveloper = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { developerEmail } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    // Only PM of this project can invite
    if (project.projectManager.toString() !== req.user._id.toString()) {
      return next(new AppError('Only the project manager can invite developers', 403));
    }

    const developer = await User.findOne({ email: developerEmail, role: 'developer' });

    if (!developer) {
      return next(new AppError('Developer not found with that email', 404));
    }

    // Check if already invited or in team
    const existingInvite = await ProjectInvite.findOne({
      project: project._id,
      invitedUser: developer._id,
      status: 'pending',
    });

    if (existingInvite) {
      return next(new AppError('Developer already has a pending invitation', 400));
    }

    const alreadyMember = project.teamMembers.some(
      member => member.user.toString() === developer._id.toString()
    );

    if (alreadyMember) {
      return next(new AppError('Developer is already a team member', 400));
    }

    const invite = await ProjectInvite.create({
      project: project._id,
      invitedBy: req.user._id,
      invitedUser: developer._id,
      role: 'developer',
    });

    // Send email
    const acceptLink = `${process.env.CLIENT_WEB_URL}/invites`;
    const emailHtml = developerInviteTemplate(
      developer.name,
      req.user.name,
      project.title,
      project.description,
      project.techStack,
      acceptLink
    );
    await sendEmail(developer.email, `You're invited to join: ${project.title}`, emailHtml);

    res.status(201).json({
      success: true,
      message: 'Invitation sent to developer',
      data: { invite },
    });
  } catch (error) {
    next(error);
  }
};

// Get all developers (for PM to browse and invite)
export const getAllDevelopers = async (req, res, next) => {
  try {
    const { skills, availability } = req.query;
    const query = { role: 'developer' };

    if (skills) {
      query.skills = { $in: skills.split(',') };
    }

    if (availability) {
      query.availability = availability;
    }

    const developers = await User.find(query)
      .select('name email avatar skills experience level xp badges availability bio github linkedin')
      .sort('-level -xp');

    res.json({
      success: true,
      data: { developers },
    });
  } catch (error) {
    next(error);
  }
};
