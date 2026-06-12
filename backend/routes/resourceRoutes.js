import express from 'express';
import Resource from '../models/Resource.js';
import { protect } from '../middleware/auth.js';
import { awardPoints } from '../utils/gamification.js';

const router = express.Router();

// @desc    Get all learning resources
// @route   GET /api/resources
// @access  Private
router.get('/', protect, async (req, res) => {
  const { type, search } = req.query;
  let query = {};

  if (type) {
    query.type = type;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  try {
    const resources = await Resource.find(query)
      .populate('uploadedBy', 'name department branch')
      .sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching resources' });
  }
});

// @desc    Create / upload a new resource
// @route   POST /api/resources
// @access  Private
router.post('/', protect, async (req, res) => {
  const { title, description, type, url } = req.body;

  if (!title || !description || !type || !url) {
    return res.status(400).json({ message: 'Title, description, type, and URL/Link are required' });
  }

  try {
    const resource = await Resource.create({
      title,
      description,
      type,
      url,
      uploadedBy: req.user._id,
    });

    // Award 5 points for uploading educational resources
    await awardPoints(req.user._id, 5);

    const populated = await Resource.findById(resource._id).populate('uploadedBy', 'name department branch');
    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error uploading resource' });
  }
});

// @desc    Track download engagement
// @route   POST /api/resources/:id/download
// @access  Private
router.post('/:id/download', protect, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    resource.downloads += 1;
    await resource.save();

    res.json({ downloads: resource.downloads });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error tracking download' });
  }
});

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Allow deleting if they uploaded it or are admin
    if (resource.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this resource' });
    }

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting resource' });
  }
});

export default router;
