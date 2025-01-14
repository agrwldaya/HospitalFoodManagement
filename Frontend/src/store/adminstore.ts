import { createSlice } from '@reduxjs/toolkit';

const Adminslice = createSlice({
  name: "adminstore",
  initialState: {
    isAuthenticated: false
  },
  reducers: {
    login:(state)=>{
          state.isAuthenticated = true;
    },
    logout: (state) => {
        state.isAuthenticated = false;
    }
  },
});

export default Adminslice;
export const AdminSliceActions = Adminslice.actions;
