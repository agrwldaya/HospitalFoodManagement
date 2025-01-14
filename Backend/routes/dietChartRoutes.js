import express from 'express';
import { createMeal, deleteMeal, getAllMeals, getMealById, updateMeal } from '../controller/DiteChartController.js';

const Dite_chartrouter = express.Router();

// Add a new diet chart
Dite_chartrouter.post('/add',createMeal);

// Get a diet chart by ID
Dite_chartrouter.get('/mealbyId/:id', getMealById );

// Update a diet chart
Dite_chartrouter.put('/:id', updateMeal);

// Delete a diet chart
Dite_chartrouter.delete('/:id', deleteMeal);

// Get all diet charts for a specific patient
Dite_chartrouter.get('/allmeal', getAllMeals);

export default Dite_chartrouter;
