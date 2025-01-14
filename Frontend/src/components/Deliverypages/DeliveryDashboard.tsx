'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Truck, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

interface Task {
  _id: string
  staffId: {
    _id: string
    username: string
  }
  taskType: 'Preparation' | 'delivery'
  description: string
  status: 'Pending' | 'In Progress' | 'Completed'
}

const DeliveryDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://hospitalfoodmanagement.onrender.com/api/task/getall', {
        headers: { token }
      })
      setTasks(response.data.filter((task: Task) => task.taskType === 'delivery'))
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const getTaskStatusCounts = () => {
    return tasks.reduce((acc, task) => {
      acc[task.status]++
      return acc
    }, { Pending: 0, 'In Progress': 0, Completed: 0 })
  }

  const taskStatusCounts = getTaskStatusCounts()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'In Progress':
        return <Clock className="h-6 w-6 text-yellow-500" />
      case 'Pending':
        return <AlertTriangle className="h-6 w-6 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Delivery Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Deliveries</h3>
            <Truck className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold">{tasks.length}</p>
        </div>
        {['Pending', 'In Progress', 'Completed'].map((status) => (
          <div key={status} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">{status}</h3>
              {getStatusIcon(status)}
            </div>
            <p className="text-2xl font-bold">{taskStatusCounts[status]}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Delivery Tasks</h2>
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task._id} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="font-medium">{task.description}</p>
                <span className={`px-2 py-1 rounded text-sm ${
                  task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {task.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Assigned to: {task.staffId.username}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DeliveryDashboard

