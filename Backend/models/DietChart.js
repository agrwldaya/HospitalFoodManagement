import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  ingredients: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  time: {
    type: String,
    enum: ['Morning', 'Evening', 'Night'],
    required: true
  }
}, {
  timestamps: true
});

const Meal = mongoose.model('Meal', mealSchema);

export default Meal;

