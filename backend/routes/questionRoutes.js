import express from 'express';
import Question from '../models/Question.js';
import { protect } from '../middleware/auth.js';
import { awardPoints } from '../utils/gamification.js';

const router = express.Router();

// @desc    Get all questions (with optional search)
// @route   GET /api/questions
// @access  Private
router.get('/', protect, async (req, res) => {
  const { search, tag } = req.query;
  let query = {};

  if (tag) {
    query.tags = tag;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }

  try {
    const questions = await Question.find(query)
      .populate('user', 'name profileImage department branch role')
      .populate('answers.user', 'name profileImage department branch points')
      .sort({ createdAt: -1 });

    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching questions' });
  }
});

// @desc    Create a new question
// @route   POST /api/questions
// @access  Private
router.post('/', protect, async (req, res) => {
  const { title, content, tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const question = await Question.create({
      user: req.user._id,
      title,
      content,
      tags: tags || [],
    });

    // Award 5 points for asking a question
    await awardPoints(req.user._id, 5);

    const populatedQuestion = await Question.findById(question._id)
      .populate('user', 'name profileImage department branch role');

    res.status(201).json(populatedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error asking question' });
  }
});

// @desc    Add an answer to a question
// @route   POST /api/questions/:id/answers
// @access  Private
router.post('/:id/answers', protect, async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Answer content is required' });
  }

  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const newAnswer = {
      user: req.user._id,
      name: req.user.name,
      profileImage: req.user.profileImage,
      content,
    };

    question.answers.push(newAnswer);
    await question.save();

    // Award 5 points for providing an answer
    await awardPoints(req.user._id, 5);

    const updatedQuestion = await Question.findById(question._id)
      .populate('user', 'name profileImage department branch role')
      .populate('answers.user', 'name profileImage department branch points');

    res.status(201).json(updatedQuestion.answers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error answering question' });
  }
});

// @desc    Mark an answer as the best answer
// @route   PUT /api/questions/:id/answers/:answerId/best
// @access  Private
router.put('/:id/answers/:answerId/best', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Only the question owner can mark the best answer
    if (question.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to select best answer for this question' });
    }

    // Toggle best answer statuses
    let answerUserToReward = null;
    let isNowBest = false;

    question.answers = question.answers.map((ans) => {
      if (ans._id.toString() === req.params.answerId) {
        // Toggle the best answer status
        ans.isBestAnswer = !ans.isBestAnswer;
        isNowBest = ans.isBestAnswer;
        answerUserToReward = ans.user;
      } else {
        // Unmark all other answers
        ans.isBestAnswer = false;
      }
      return ans;
    });

    await question.save();

    // Award/deduct points depending on toggled state
    if (answerUserToReward && isNowBest) {
      // Award 20 points for providing the accepted best answer
      await awardPoints(answerUserToReward, 20);
    }

    const updatedQuestion = await Question.findById(question._id)
      .populate('user', 'name profileImage department branch role')
      .populate('answers.user', 'name profileImage department branch points');

    res.json(updatedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error selecting best answer' });
  }
});

// @desc    Upvote a question
// @route   POST /api/questions/:id/upvote
// @access  Private
router.post('/:id/upvote', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const upvoteIndex = question.upvotes.indexOf(req.user._id);

    if (upvoteIndex > -1) {
      // Already upvoted, remove upvote
      question.upvotes.splice(upvoteIndex, 1);
    } else {
      // Add upvote
      question.upvotes.push(req.user._id);
    }

    await question.save();
    res.json({ upvotesCount: question.upvotes.length, isUpvoted: question.upvotes.includes(req.user._id) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error upvoting question' });
  }
});

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this question' });
    }

    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting question' });
  }
});

export default router;
