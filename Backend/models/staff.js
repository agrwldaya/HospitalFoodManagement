import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['pantry', 'delivery'],
    required: true
  },
  contact: {
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true
});

const Staff = mongoose.model('Staff', staffSchema);

export default Staff;

