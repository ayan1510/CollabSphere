import express from 'express';
import Post from '../models/Post.js';
import { protect, admin } from '../middleware/auth.js';
import { awardPoints } from '../utils/gamification.js';

const router = express.Router();

// @desc    Get all posts (pinned first, then newest)
// @route   GET /api/posts
// @access  Private
router.get('/', protect, async (req, res) => {
  const { category, community } = req.query;
  let query = {};

  if (category) {
    query.category = category;
  }

  if (community) {
    query.community = community;
  } else if (community === '') {
    // If community parameter is empty string, get posts that have NO community (general feed)
    query.community = null;
  }

  try {
    const posts = await Post.find(query)
      .populate('user', 'name profileImage department branch role')
      .populate('comments.user', 'name profileImage')
      .sort({ pinned: -1, createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching posts' });
  }
});

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
router.post('/', protect, async (req, res) => {
  const { title, content, category, community, links, attachments } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const post = await Post.create({
      user: req.user._id,
      title,
      content,
      category: category || 'General',
      community: community || null,
      links: links || [],
      attachments: attachments || [],
    });

    // Award 10 points for sharing knowledge
    await awardPoints(req.user._id, 10);

    const populatedPost = await Post.findById(post._id).populate('user', 'name profileImage department branch role');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating post' });
  }
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Allow deletion if the user is the creator or an admin
    if (post.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting post' });
  }
});

// @desc    Pin or unpin a post (Admin only)
// @route   PUT /api/posts/:id/pin
// @access  Private/Admin
router.put('/:id/pin', protect, admin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.pinned = !post.pinned;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error pinning post' });
  }
});

// @desc    Like / unlike a post
// @route   POST /api/posts/:id/like
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user._id);

    if (likeIndex > -1) {
      // Already liked, so unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json({ likesCount: post.likes.length, isLiked: post.likes.includes(req.user._id) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error liking post' });
  }
});

// @desc    Add comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
router.post('/:id/comments', protect, async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Comment content is required' });
  }

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      user: req.user._id,
      name: req.user.name,
      profileImage: req.user.profileImage,
      content,
    };

    post.comments.push(newComment);
    await post.save();

    // Award 2 points for commenting / participating
    await awardPoints(req.user._id, 2);

    const updatedPost = await Post.findById(post._id)
      .populate('user', 'name profileImage department branch role')
      .populate('comments.user', 'name profileImage');

    res.status(201).json(updatedPost.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding comment' });
  }
});

// @desc    Delete a comment
// @route   DELETE /api/posts/:id/comments/:commentId
// @access  Private
router.delete('/:id/comments/:commentId', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Allow deletion if the comment writer or admin
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    post.comments.pull({ _id: req.params.commentId });
    await post.save();

    res.json({ message: 'Comment removed successfully', comments: post.comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting comment' });
  }
});

export default router;
