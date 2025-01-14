import Meal from "../models/DietChart.js";

 

// Get all meals
export const getAllMeals = async (req, res) => {
  try {
    const meals = await Meal.find();

    if(!meals){
        res.status(200).json({success:false});
    }
     
    res.status(200).json({success:true,meals});
  } catch (error) {
    console.log(error)
    res.status(500).json({success:false, message: 'Error fetching meals', error: error.message });
  }
};

// Create a new meal
export const createMeal = async (req, res) => {
  try {
    const {name,ingredients,instructions,time} =req.body.meal;

    const newMeal = new Meal({name,ingredients,instructions,time});
    console.log(newMeal)
     
    const savedMeal = await newMeal.save();

    res.status(200).json({
        success:true,
        message:"Mead added successfully!",
        savedMeal});
  } catch (error) {
    console.log(error)
    res.status(400).json({success:false, message: 'Error creating meal', error: error.message });
  }
};

// Get a single meal by ID
export const getMealById = async (req, res) => {
  try {
  
    const meal = await Meal.findById(req.params.id);
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    res.status(200).json(meal);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meal', error: error.message });
  }
};

// Update a meal
export const updateMeal = async (req, res) => {
  try {
    const updatedMeal = await Meal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedMeal) {
      return res.status(200).json({success:false, message: 'Meal not found' });
    }
    res.status(200).json({success:true, 
        message:"Meal updated successfully!",
        updatedMeal});
  } catch (error) {
    res.status(400).json({success:false, message: 'Error updating meal', error: error.message });
  }
};

// Delete a meal
export const deleteMeal = async (req, res) => {
  try {
    const deletedMeal = await Meal.findByIdAndDelete(req.params.id);
    if (!deletedMeal) {
      return res.status(200).json({success:false, message: 'Meal not found' });
    }
    res.status(200).json({success:true, message: 'Meal deleted successfully' });
  } catch (error) {
    res.status(500).json({success:false, message: 'Error deleting meal', error: error.message });
  }
};

