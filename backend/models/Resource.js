import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['pdf', 'video', 'template', 'presentation'],
  },
  url: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  downloads: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
