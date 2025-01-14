 
import { configureStore } from '@reduxjs/toolkit';
import Adminslice from './adminstore';
import patientSlice from './patientstore';
import mealSlice from './mealstore';
 
 
// Configure the store without persistence
const store  = configureStore({
  reducer: {
      adminstore:Adminslice.reducer,
      patientStore:patientSlice.reducer,
      mealStore: mealSlice.reducer
  },
});

export default store
