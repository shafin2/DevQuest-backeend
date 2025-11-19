import User from '../models/User.model.js';
import AppError from '../utils/AppError.js';

// Get current user's profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password -sessions');
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Update basic profile info
export const updateBasicInfo = async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Update professional info (for developers and PMs)
export const updateProfessionalInfo = async (req, res, next) => {
  try {
    const { experience, hourlyRate, availability, github, linkedin, portfolio } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.role === 'client') {
      return next(new AppError('Clients cannot update professional info', 403));
    }

    if (experience !== undefined) user.experience = experience;
    if (hourlyRate !== undefined) user.hourlyRate = hourlyRate;
    if (availability) user.availability = availability;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (portfolio !== undefined) user.portfolio = portfolio;

    await user.save();

    res.json({
      success: true,
      message: 'Professional info updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Update skills
export const updateSkills = async (req, res, next) => {
  try {
    const { skills } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    if (user.role === 'client') {
      return next(new AppError('Clients cannot update skills', 403));
    }

    user.skills = skills;
    await user.save();

    res.json({
      success: true,
      message: 'Skills updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
