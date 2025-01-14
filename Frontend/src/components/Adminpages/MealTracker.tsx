'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { CheckCircle, Clock, AlertCircle, Utensils, Coffee, Moon, Truck } from 'lucide-react'

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

const TaskStatusCheck: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/task/getall', {
        headers: { token },
      })
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast.error('Failed to fetch tasks')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="text-green-500" />
      case 'In Progress':
        return <Clock className="text-yellow-500" />
      case 'Pending':
        return <AlertCircle className="text-red-500" />
      default:
        return null
    }
  }

  const getMealTimeIcon = (mealTime?: string) => {
    switch (mealTime) {
      case 'Morning':
        return <Coffee className="text-blue-500" />
      case 'Evening':
        return <Utensils className="text-orange-500" />
      case 'Night':
        return <Moon className="text-indigo-500" />
      default:
        return null
    }
  }

  const getTaskTypeIcon = (taskType: string) => {
    switch (taskType) {
      case 'Preparation':
        return <Utensils className="text-purple-500" />
      case 'delivery':
        return <Truck className="text-blue-500" />
      default:
        return null
    }
  }

  const renderTaskCell = (taskType: 'Preparation' | 'delivery', mealTime?: 'Morning' | 'Evening' | 'Night') => {
    const filteredTasks = tasks.filter(
      (task) => task.taskType === taskType && (taskType === 'delivery' || task.mealTime === mealTime)
    )

    return (
      <td className="border p-2">
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className="mb-2 p-2 bg-gray-100 rounded flex items-center justify-between space-y-2 lg:space-y-0 lg:flex-row flex-col"
          >
            <div className="flex items-center space-x-2">
              {getStatusIcon(task.status)}
              {getTaskTypeIcon(task.taskType)}
              {task.taskType === 'Preparation' && getMealTimeIcon(task.mealTime)}
              <div>
                <p className="font-semibold">{task.staffId.username}</p>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
            </div>
            <span className="text-sm font-medium px-2 py-1 rounded bg-gray-200">{task.status}</span>
          </div>
        ))}
      </td>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">Task Status Check</h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meal Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preparation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {['Morning', 'Evening', 'Night'].map((mealTime) => (
                  <tr key={mealTime}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mealTime}</td>
                    {renderTaskCell('Preparation', mealTime as 'Morning' | 'Evening' | 'Night')}
                    {mealTime === 'Morning' ? renderTaskCell('delivery') : <td></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskStatusCheck
