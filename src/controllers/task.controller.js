import Task from '../models/Task.model.js';
import Project from '../models/Project.model.js';
import User from '../models/User.model.js';
import AppError from '../utils/AppError.js';
import { awardBadges } from '../utils/badges.js';

// PM creates a task in their project
export const createTask = async (req, res, next) => {
  try {
    const { projectId, title, description, assignedTo, priority, difficulty, xpPoints, dueDate } = req.body;

    // Verify project exists and user is PM
    const project = await Project.findById(projectId);
    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    if (project.projectManager.toString() !== req.user._id.toString()) {
      return next(new AppError('Only the project manager can create tasks', 403));
    }

    // If assignedTo provided, verify they're in the team
    if (assignedTo) {
      const isTeamMember = project.teamMembers.some(
        member => member.user.toString() === assignedTo && member.status === 'active'
      );
      if (!isTeamMember) {
        return next(new AppError('Assigned user is not an active team member', 400));
      }
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignedTo: assignedTo || null,
      priority: priority || 'medium',
      difficulty: difficulty || 'medium',
      xpPoints: xpPoints || 50,
      dueDate: dueDate || null,
    });

    // Update project total XP
    project.totalXP += task.xpPoints;
    await project.save();

    // Award XP to PM for creating task
    const pm = await User.findById(req.user._id);
    const xpResult = pm.addXP(10); // 10 XP for creating a task
    await pm.save();

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email level xp')
      .populate('project', 'title');

    res.status(201).json({
      success: true,
      message: 'Task created successfully. +10 XP earned!',
      data: { task: populatedTask, xpEarned: 10, leveledUp: xpResult.leveledUp, newLevel: xpResult.level },
    });
  } catch (error) {
    next(error);
  }
};

// Get all tasks for a project
export const getProjectTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { status } = req.query;

    // Verify project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return next(new AppError('Project not found', 404));
    }

    // Check if user is client, PM, or team member
    const isClient = project.client.toString() === req.user._id.toString();
    const isPM = project.projectManager?.toString() === req.user._id.toString();
    const isTeamMember = project.teamMembers.some(
      member => member.user.toString() === req.user._id.toString()
    );

    if (!isClient && !isPM && !isTeamMember) {
      return next(new AppError('Access denied to this project', 403));
    }

    const query = { project: projectId };
    if (status) {
      query.status = status;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email level xp avatar')
      .populate('completedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { tasks, count: tasks.length },
    });
  } catch (error) {
    next(error);
  }
};

// Update task (PM can update any field, Developer can update status)
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findById(id).populate('project');
    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    const project = task.project;
    const isPM = project.projectManager?.toString() === req.user._id.toString();
    const isAssignee = task.assignedTo?.toString() === req.user._id.toString();

    // Developers can only update status if they're assigned
    if (!isPM && isAssignee) {
      // Developer can only change status
      if (Object.keys(updates).length !== 1 || !updates.status) {
        return next(new AppError('You can only update task status', 403));
      }
    } else if (!isPM) {
      return next(new AppError('Only PM or assigned developer can update this task', 403));
    }

    // Track old status for XP award logic
    const oldStatus = task.status;
    const newStatus = updates.status;

    // Update task fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        task[key] = updates[key];
      }
    });

    await task.save();

    // If task moved to "done", award XP and badges
    if (oldStatus !== 'done' && newStatus === 'done' && task.assignedTo) {
      const developer = await User.findById(task.assignedTo);
      if (developer) {
        const devXpResult = developer.addXP(task.xpPoints);
        developer.tasksCompleted += 1;
        
        // Check for new badges
        const newBadges = awardBadges(developer);
        
        await developer.save();

        // Award bonus XP to PM (20% of task XP)
        const fullProject = await Project.findById(task.project).populate('client projectManager');
        if (fullProject.projectManager) {
          const pm = await User.findById(fullProject.projectManager._id);
          if (pm) {
            const pmBonus = Math.floor(task.xpPoints * 0.2);
            pm.addXP(pmBonus);
            await pm.save();
          }
        }

        // Award bonus XP to Client (10% of task XP)
        if (fullProject.client) {
          const client = await User.findById(fullProject.client._id);
          if (client) {
            const clientBonus = Math.floor(task.xpPoints * 0.1);
            client.addXP(clientBonus);
            await client.save();
          }
        }

        // Return level-up and badge info if applicable
        if (devXpResult.leveledUp || newBadges.length > 0) {
          return res.status(200).json({
            success: true,
            message: `Task completed! +${task.xpPoints} XP earned${devXpResult.leveledUp ? '. Level Up! 🎉' : ''}${newBadges.length > 0 ? ` New badge${newBadges.length > 1 ? 's' : ''} earned!` : ''}`,
            data: { 
              task: await Task.findById(task._id).populate('assignedTo', 'name email level xp'),
              leveledUp: devXpResult.leveledUp,
              newLevel: developer.level,
              xpEarned: task.xpPoints,
              newBadges: newBadges.map(b => ({ id: b.id, name: b.name, icon: b.icon })),
            },
          });
        }
      }
    }

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email level xp avatar')
      .populate('completedBy', 'name email');

    res.status(200).json({
      success: true,
      message: newStatus === 'done' ? `Task completed! +${task.xpPoints} XP earned` : 'Task updated successfully',
      data: { 
        task: updatedTask,
        xpEarned: newStatus === 'done' ? task.xpPoints : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete task (PM only)
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id).populate('project');
    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    const project = task.project;
    if (project.projectManager?.toString() !== req.user._id.toString()) {
      return next(new AppError('Only the project manager can delete tasks', 403));
    }

    // Update project total XP
    project.totalXP -= task.xpPoints;
    await project.save();

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get developer's tasks (for dashboard)
export const getMyTasks = async (req, res, next) => {
  try {
    const { status } = req.query;

    const query = { assignedTo: req.user._id };
    if (status) {
      query.status = status;
    }

    const tasks = await Task.find(query)
      .populate('project', 'title client projectManager')
      .sort({ dueDate: 1, priority: -1 });

    res.status(200).json({
      success: true,
      data: { tasks, count: tasks.length },
    });
  } catch (error) {
    next(error);
  }
};
