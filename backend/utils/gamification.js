import User from '../models/User.js';

export const awardPoints = async (userId, amount) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    user.points += amount;

    // Check badge thresholds
    const badgesToAdd = [];
    if (user.points >= 10 && !user.badges.includes('Initiate Contributor')) {
      badgesToAdd.push('Initiate Contributor');
    }
    if (user.points >= 50 && !user.badges.includes('Knowledge Champion')) {
      badgesToAdd.push('Knowledge Champion');
    }
    if (user.points >= 120 && !user.badges.includes('Top Mentor')) {
      badgesToAdd.push('Top Mentor');
    }
    if (user.points >= 250 && !user.badges.includes('Intellectual Guru')) {
      badgesToAdd.push('Intellectual Guru');
    }

    if (badgesToAdd.length > 0) {
      user.badges = [...user.badges, ...badgesToAdd];
    }

    await user.save();
    return user;
  } catch (error) {
    console.error('Gamification points update error:', error);
    return null;
  }
};
