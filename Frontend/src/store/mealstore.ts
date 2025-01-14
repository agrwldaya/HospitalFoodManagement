import { createSlice } from '@reduxjs/toolkit';
 
const mealSlice = createSlice({
  name: "mealStore",
  initialState: {
    meals: []  
  },
  reducers: {
    addMeal: (state, action) => {
      state.meals= action.payload;
    }
  },
});

export const mealSliceActions = mealSlice.actions;
export default mealSlice;

