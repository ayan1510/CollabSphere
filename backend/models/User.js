import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['employee', 'admin'],
    default: 'employee',
  },
  department: {
    type: String,
    required: true,
    default: 'General',
  },
  skills: {
    type: [String],
    default: [],
  },
  bio: {
    type: String,
    default: '',
  },
  branch: {
    type: String,
    required: true,
    default: 'Headquarters',
  },
  profileImage: {
    type: String,
    default: '',
  },
  points: {
    type: Number,
    default: 0,
  },
  badges: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active',
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
