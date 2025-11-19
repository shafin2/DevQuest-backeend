import { getStreamClient, createStreamToken } from '../config/streamChat.js';
import Project from '../models/Project.model.js';
import AppError from '../utils/AppError.js';

// Get Stream Chat token for authenticated user
export const getChatToken = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const token = createStreamToken(userId);
    
    if (!token) {
      console.error('❌ Failed to create Stream token. Check STREAM_API_KEY and STREAM_API_SECRET in .env');
      return next(new AppError('Chat service not configured', 503));
    }

    console.log('✅ Stream token created for user:', userId);

    res.json({
      success: true,
      data: { 
        token,
        userId,
        apiKey: process.env.STREAM_API_KEY,
      },
    });
  } catch (error) {
    console.error('❌ Error in getChatToken:', error);
    next(error);
  }
};

// Create a chat channel for a project
export const createProjectChannel = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId)
      .populate('client', 'name email avatar')
      .populate('projectManager', 'name email avatar')
      .populate('teamMembers.user', 'name email avatar');
    
    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    // Check if user has access to this project
    const isClient = project.client._id.toString() === req.user._id.toString();
    const isPM = project.projectManager?._id.toString() === req.user._id.toString();
    const isTeamMember = project.teamMembers.some(
      m => m.user._id.toString() === req.user._id.toString()
    );

    if (!isClient && !isPM && !isTeamMember) {
      return next(new AppError('Access denied to this project', 403));
    }

    const client = getStreamClient();
    if (!client) {
      return next(new AppError('Chat service not configured', 503));
    }

    // Prepare all users for the channel
    const users = [];
    
    // Add client
    if (project.client) {
      users.push({
        id: project.client._id.toString(),
        name: project.client.name,
        image: project.client.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(project.client.name)}&background=random`,
      });
    }
    
    // Add PM
    if (project.projectManager) {
      users.push({
        id: project.projectManager._id.toString(),
        name: project.projectManager.name,
        image: project.projectManager.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(project.projectManager.name)}&background=random`,
      });
    }
    
    // Add active team members
    project.teamMembers
      .filter(m => m.status === 'active')
      .forEach(m => {
        users.push({
          id: m.user._id.toString(),
          name: m.user.name,
          image: m.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.user.name)}&background=random`,
        });
      });

    // Upsert all users in Stream (create or update)
    await Promise.all(
      users.map(user => client.upsertUser(user))
    );

    // Create channel ID from project ID
    const channelId = `project-${projectId}`;
    
    // Get all member IDs
    const memberIds = users.map(u => u.id);

    // Create or get the channel
    const channel = client.channel('team', channelId, {
      name: project.title,
      created_by_id: req.user._id.toString(),
      members: memberIds,
      project_id: projectId,
    });

    await channel.create();

    res.json({
      success: true,
      data: { 
        channelId,
        channelType: 'team',
      },
    });
  } catch (error) {
    console.error('❌ Error in createProjectChannel:', error);
    next(error);
  }
};
