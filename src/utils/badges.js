// Badge definitions with criteria
export const BADGES = {
  FIRST_QUEST: {
    id: 'first_quest',
    name: 'First Quest',
    description: 'Complete your first task',
    icon: '🎯',
    criteria: { tasksCompleted: 1 },
  },
  TASK_WARRIOR: {
    id: 'task_warrior',
    name: 'Task Warrior',
    description: 'Complete 10 tasks',
    icon: '⚔️',
    criteria: { tasksCompleted: 10 },
  },
  TASK_MASTER: {
    id: 'task_master',
    name: 'Task Master',
    description: 'Complete 50 tasks',
    icon: '🏆',
    criteria: { tasksCompleted: 50 },
  },
  LEGEND: {
    id: 'legend',
    name: 'Legend',
    description: 'Complete 100 tasks',
    icon: '👑',
    criteria: { tasksCompleted: 100 },
  },
  LEVEL_5: {
    id: 'level_5',
    name: 'Rising Star',
    description: 'Reach Level 5',
    icon: '⭐',
    criteria: { level: 5 },
  },
  LEVEL_10: {
    id: 'level_10',
    name: 'Elite Adventurer',
    description: 'Reach Level 10',
    icon: '💫',
    criteria: { level: 10 },
  },
  LEVEL_25: {
    id: 'level_25',
    name: 'Epic Hero',
    description: 'Reach Level 25',
    icon: '🌟',
    criteria: { level: 25 },
  },
  XP_500: {
    id: 'xp_500',
    name: 'XP Hunter',
    description: 'Earn 500 total XP',
    icon: '💰',
    criteria: { xp: 500 },
  },
  XP_1000: {
    id: 'xp_1000',
    name: 'XP Collector',
    description: 'Earn 1000 total XP',
    icon: '💎',
    criteria: { xp: 1000 },
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete 5 tasks in one day',
    icon: '⚡',
    criteria: { tasksInDay: 5 },
  },
  PROJECT_STARTER: {
    id: 'project_starter',
    name: 'Quest Giver',
    description: 'Create your first project',
    icon: '📋',
    criteria: { projectsCreated: 1 },
  },
  GUILD_MASTER: {
    id: 'guild_master',
    name: 'Guild Master',
    description: 'Manage 5 projects',
    icon: '👨‍💼',
    criteria: { projectsManaged: 5 },
  },
};

// Check if user qualifies for a badge
export const checkBadgeEligibility = (user, badge) => {
  const criteria = BADGES[badge].criteria;
  
  if (criteria.tasksCompleted && user.tasksCompleted >= criteria.tasksCompleted) {
    return true;
  }
  if (criteria.level && user.level >= criteria.level) {
    return true;
  }
  if (criteria.xp && user.xp >= criteria.xp) {
    return true;
  }
  if (criteria.projectsCreated && user.projectsCreated >= criteria.projectsCreated) {
    return true;
  }
  if (criteria.projectsManaged && user.projectsManaged >= criteria.projectsManaged) {
    return true;
  }
  
  return false;
};

// Get all badges user should have based on their stats
export const getEligibleBadges = (user) => {
  const eligibleBadges = [];
  
  Object.keys(BADGES).forEach(badgeKey => {
    if (checkBadgeEligibility(user, badgeKey)) {
      const badge = BADGES[badgeKey];
      // Check if user doesn't already have this badge
      const hasBadge = user.badges?.some(b => b.badgeId === badge.id);
      if (!hasBadge) {
        eligibleBadges.push(badge);
      }
    }
  });
  
  return eligibleBadges;
};

// Award badges to user (returns newly earned badges)
export const awardBadges = (user) => {
  const newBadges = getEligibleBadges(user);
  
  newBadges.forEach(badge => {
    user.badges.push({
      badgeId: badge.id,
      name: badge.name,
      earnedAt: new Date(),
    });
  });
  
  return newBadges;
};
