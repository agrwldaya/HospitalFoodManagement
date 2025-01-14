import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  taskType: {
    type: String,
    enum: ['Preparation', 'delivery'],
    required: true
  },
  mealTime: {
    type: String,
    enum: ['Morning', 'Evening', 'Night'],
    required: function() {
      return this.taskType === 'Preparation';
    }
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

export default Task;

