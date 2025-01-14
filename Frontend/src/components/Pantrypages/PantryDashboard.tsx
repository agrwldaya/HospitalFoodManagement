'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Utensils, Coffee, Sun, Moon } from 'lucide-react'

interface Task {
  _id: string
  staffId: {
    _id: string
    username: string
  }
  taskType: 'Preparation' | 'delivery'
  mealTime?: 'Morning' | 'Evening' | 'Night'
  description: string
  status: 'Pending' | 'In Progress' | 'Completed'
}

const PantryDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/task/getall', {
        headers: { token }
      })
      setTasks(response.data.filter((task: Task) => task.taskType === 'Preparation'))
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const getTasksByMealTime = (mealTime: string) => {
    return tasks.filter(task => task.mealTime === mealTime)
  }

  const getMealTimeIcon = (mealTime: string) => {
    switch (mealTime) {
      case 'Morning':
        return <Coffee className="h-6 w-6 text-blue-500" />
      case 'Evening':
        return <Sun className="h-6 w-6 text-orange-500" />
      case 'Night':
        return <Moon className="h-6 w-6 text-indigo-500" />
      default:
        return <Utensils className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Pantry Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {['Morning', 'Evening', 'Night'].map((mealTime) => (
          <div key={mealTime} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">{mealTime} Meals</h3>
              {getMealTimeIcon(mealTime)}
            </div>
            <p className="text-2xl font-bold">{getTasksByMealTime(mealTime).length} tasks</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Upcoming Meal Preparations</h2>
        <div className="space-y-4">
          {['Morning', 'Evening', 'Night'].map((mealTime) => (
            <div key={mealTime}>
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                {getMealTimeIcon(mealTime)}
                <span className="ml-2">{mealTime} Meals</span>
              </h3>
              <div className="space-y-2">
                {getTasksByMealTime(mealTime).map(task => (
                  <div key={task._id} className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium">{task.description}</p>
                    <p className="text-sm text-gray-500">Status: {task.status}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PantryDashboard

