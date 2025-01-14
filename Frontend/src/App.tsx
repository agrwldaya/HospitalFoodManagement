import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import DashboardLayout from './components/Layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import PatientManagement from './components/Adminpages/Patientmanege';
import DietManagement from './components/Adminpages/DietManagement';
import PantryStaffManagement from './components/Adminpages/PantryStaffManagement';
import MealTracker from './components/Adminpages/MealTracker';
import LoginPage from './pages/StratingPage';

import { AdminSliceActions } from './store/adminstore';
import { patientSliceActions } from './store/patientstore';
import { mealSliceActions } from './store/mealstore';
import PantryStaffTasks from './components/Pantrypages/pantrytask';
import DeliveryStaffTasks from './components/Deliverypages/Deliverytask';
import AdminDashboard from './pages/Dashboard';
import PantryDashboard from './components/Pantrypages/PantryDashboard';
import DeliveryDashboard from './components/Deliverypages/DeliveryDashboard';

const queryClient = new QueryClient();

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const isAuthenticated = useSelector((state) => state.adminstore.isAuthenticated);
  const role = localStorage.getItem("role")
  useEffect(() => {
    if (token) {
      dispatch(AdminSliceActions.login());
      fetchAllPatients(token);
      fetchAllMeals(token)
    }
  }, [token, dispatch]);

  const fetchAllPatients = async (token) => {
    try {
      const res = await axios.get("http://localhost:3000/api/patients/getallpatients", {
        headers:{token}, // Proper header format
      });
      if (res.data.success) {
        dispatch(patientSliceActions.addPatient(res.data.patients)); // Use the appropriate action for bulk data
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };
  const fetchAllMeals = async (token) => {
    try {
      const res = await axios.get("http://localhost:3000/api/diet-charts/allmeal");
      if (res.data.success) {
         
        dispatch(mealSliceActions.addMeal(res.data.meals)); // Use the appropriate action for bulk data
      }else{
        console.log("errorrrr")
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        <Routes>
          {/* Login Route - Redirect to Dashboard if already authenticated */}
          <Route
            path="/login"
            element={!isAuthenticated ? <LoginPage /> : <Navigate to={`/${role}-dashboard`}/>}
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="admin-dashboard" element={<AdminDashboard />} />
            <Route path="pantry-dashboard" element={<PantryDashboard />} />
            <Route path="delivery-dashboard" element={<DeliveryDashboard/>} />
            <Route path="patients" element={<PatientManagement />} />
            <Route path="diet-charts" element={<DietManagement />} />
            <Route path="pantry" element={<PantryStaffManagement />} />
            <Route path="delivery" element={<MealTracker />} />
            <Route path="panatry-tasks" element={<PantryStaffTasks/>} />
            <Route path="delivery-tasks" element={<DeliveryStaffTasks/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
