import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Post from '../models/Post.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkeyforcompanyportal', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, department, skills, branch, bio, profileImage, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      department: department || 'General',
      skills: skills || [],
      branch: branch || 'Headquarters',
      bio: bio || '',
      profileImage: profileImage || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
      role: role || 'employee', // Can register as admin if needed for development testing
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        skills: user.skills,
        branch: user.branch,
        bio: user.bio,
        profileImage: user.profileImage,
        points: user.points,
        badges: user.badges,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data provided' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      if (user.status === 'suspended') {
        return res.status(403).json({ message: 'Your account has been suspended by an administrator.' });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        skills: user.skills,
        branch: user.branch,
        bio: user.bio,
        profileImage: user.profileImage,
        points: user.points,
        badges: user.badges,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// @desc    Get all users (expert discovery + leaderboard)
// @route   GET /api/users
// @access  Private
router.get('/users', protect, async (req, res) => {
  const { search, department, branch, sort } = req.query;
  let query = { status: 'active' };

  if (department) {
    query.department = department;
  }
  if (branch) {
    query.branch = branch;
  }
  if (search) {
    // Search by name or skills
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { skills: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  try {
    let usersQuery = User.find(query).select('-password');

    if (sort === 'points') {
      usersQuery = usersQuery.sort({ points: -1 });
    } else {
      usersQuery = usersQuery.sort({ createdAt: -1 });
    }

    const users = await usersQuery;
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching experts' });
  }
});

// @desc    Get user profile detail & their posts
// @route   GET /api/users/:id
// @access  Private
router.get('/users/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 });
    res.json({ user, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching user details' });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
router.put('/users/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure they are editing their own profile (or are an admin)
    if (user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this profile' });
    }

    user.name = req.body.name || user.name;
    user.department = req.body.department || user.department;
    user.skills = req.body.skills || user.skills;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.branch = req.body.branch || user.branch;
    user.profileImage = req.body.profileImage || user.profileImage;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      department: updatedUser.department,
      skills: updatedUser.skills,
      branch: updatedUser.branch,
      bio: updatedUser.bio,
      profileImage: updatedUser.profileImage,
      points: updatedUser.points,
      badges: updatedUser.badges,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

export default router;
