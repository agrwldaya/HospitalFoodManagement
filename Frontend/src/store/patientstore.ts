import { createSlice } from '@reduxjs/toolkit';
 
const patientSlice = createSlice({
  name: "patientStore",
  initialState: {
    patients: [] // Renamed to plural for clarity, representing multiple patients
  },
  reducers: {
    addPatient: (state, action) => {
      state.patients= action.payload;
    }
  },
});

export const patientSliceActions = patientSlice.actions;
export default patientSlice;

