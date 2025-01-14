'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { CheckCircle, Clock, AlertCircle, Truck, Coffee, Utensils, Moon } from 'lucide-react';

interface Task {
  _id: string;
  staffId: {
    _id: string;
    username: string;
  };
  taskType: 'Preparation' | 'delivery';
  mealTime: 'Morning' | 'Evening' | 'Night';
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

const DeliveryStaffTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [updatedStatuses, setUpdatedStatuses] = useState<{ [key: string]: string }>({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/task/getall', {
        headers: { token },
      });
      setTasks(response.data.filter((task: Task) => task.taskType === 'delivery'));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: 'Pending' | 'In Progress' | 'Completed') => {
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/task/update/${taskId}`,
        { status: newStatus },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success('Task status updated successfully');
        fetchTasks(); // Refresh tasks after update
        setUpdatedStatuses((prev) => ({ ...prev, [taskId]: '' }));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
    setUpdatedStatuses((prev) => ({ ...prev, [taskId]: newStatus }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="text-green-500" />;
      case 'In Progress':
        return <Clock className="text-yellow-500" />;
      case 'Pending':
        return <AlertCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  const getMealTimeIcon = (mealTime: string) => {
    switch (mealTime) {
      case 'Morning':
        return <Coffee className="text-blue-500" />;
      case 'Evening':
        return <Utensils className="text-orange-500" />;
      case 'Night':
        return <Moon className="text-indigo-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">Delivery Staff Tasks</h1>
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Your Assigned Tasks</h2>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 space-y-4 sm:space-y-0"
              >
                <div className="flex items-start sm:items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(task.status)}
                    <Truck className="text-blue-500" />
                    {getMealTimeIcon(task.mealTime)}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{task.description}</h3>
                    <p className="text-gray-600 text-sm">Meal Time: {task.mealTime}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <select
                    value={updatedStatuses[task._id] || task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className="w-full sm:w-32 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <button
                    onClick={() => updateTaskStatus(task._id, updatedStatuses[task._id] || task.status)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                  >
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryStaffTasks;
