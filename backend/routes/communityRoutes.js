import express from 'express';
import Community from '../models/Community.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all communities
// @route   GET /api/communities
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const communities = await Community.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(communities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching communities' });
  }
});

// @desc    Create a new community
// @route   POST /api/communities
// @access  Private
router.post('/', protect, async (req, res) => {
  const { name, description, category } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: 'Name and description are required' });
  }

  try {
    const exists = await Community.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: 'A community with this name already exists' });
    }

    const community = await Community.create({
      name,
      description,
      category: category || 'General',
      createdBy: req.user._id,
      members: [req.user._id], // Creator joins by default
    });

    const populated = await Community.findById(community._id).populate('createdBy', 'name');
    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating community' });
  }
});

// @desc    Join or leave a community
// @route   POST /api/communities/:id/join
// @access  Private
router.post('/:id/join', protect, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const memberIndex = community.members.indexOf(req.user._id);

    if (memberIndex > -1) {
      // User is already a member, so leave the community
      community.members.splice(memberIndex, 1);
    } else {
      // Join
      community.members.push(req.user._id);
    }

    await community.save();
    res.json({
      membersCount: community.members.length,
      isMember: community.members.includes(req.user._id),
      members: community.members,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error joining community' });
  }
});

export default router;
