import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Best Practice', 'Lesson Learned', 'Success Story', 'Customer Insight', 'Industry Knowledge', 'General'],
    default: 'General',
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    default: null,
  },
  links: {
    type: [String],
    default: [],
  },
  attachments: {
    type: [String],
    default: [],
  },
  pinned: {
    type: Boolean,
    default: false,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [commentSchema],
}, {
  timestamps: true,
});

const Post = mongoose.model('Post', postSchema);
export default Post;
