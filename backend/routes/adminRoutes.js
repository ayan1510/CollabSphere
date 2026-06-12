import express from 'express';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Question from '../models/Question.js';
import Community from '../models/Community.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get system-wide analytics & metrics for Admin Dashboard
// @route   GET /api/admin/metrics
// @access  Private/Admin
router.get('/metrics', protect, admin, async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalCommunities = await Community.countDocuments();

    // Department engagement aggregation
    const departmentBreakdown = await User.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Branch engagement aggregation
    const branchBreakdown = await User.aggregate([
      { $group: { _id: '$branch', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Top skills searched/claimed aggregation
    const topSkills = await User.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    // Top active contributors
    const topContributors = await User.find()
      .sort({ points: -1 })
      .limit(5)
      .select('name email points department branch profileImage badges');

    res.json({
      totals: {
        employees: totalEmployees,
        posts: totalPosts,
        questions: totalQuestions,
        communities: totalCommunities,
      },
      departmentBreakdown,
      branchBreakdown,
      topSkills,
      topContributors,
    });
  } catch (error) {
    console.error('Error fetching admin dashboard metrics:', error);
    res.status(500).json({ message: 'Server error generating metrics report' });
  }
});

// @desc    Get all users list (including suspended, for management table)
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching user database' });
  }
});

// @desc    Toggle User Active/Suspended status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
router.put('/users/:id/status', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Protect against self-suspension
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot suspend your own admin account' });
    }

    user.status = user.status === 'active' ? 'suspended' : 'active';
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      status: user.status,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error modifying user account status' });
  }
});

// @desc    Change user role (Employee <-> Admin)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
router.put('/users/:id/role', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Protect against self-demotion
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot demote your own admin account' });
    }

    user.role = user.role === 'admin' ? 'employee' : 'admin';
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating user credentials' });
  }
});

export default router;
