'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Users, Utensils, Truck, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

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

interface Staff {
  _id: string
  username: string
  role: 'pantry' | 'delivery'
}

const AdminDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [staff, setStaff] = useState<Staff[]>([])
  const [activeTab, setActiveTab] = useState('tasks')
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchTasks()
    fetchStaff()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/task/getall', {
        headers: { token }
      })
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const fetchStaff = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/staff/getall', {
        headers: { token }
      })
      setStaff(response.data)
    } catch (error) {
      console.error('Error fetching staff:', error)
    }
  }

  const getTaskStatusCounts = () => {
    return tasks.reduce((acc, task) => {
      acc[task.status]++
      return acc
    }, { Pending: 0, 'In Progress': 0, Completed: 0 })
  }

  const taskStatusCounts = getTaskStatusCounts()

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Staff</h3>
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold">{staff.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
            <Utensils className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold">{tasks.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Completed Tasks</h3>
            <CheckCircle className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold">{taskStatusCounts.Completed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Pending Tasks</h3>
            <AlertTriangle className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold">{taskStatusCounts.Pending}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'tasks' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks Overview
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'staff' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('staff')}
          >
            Staff Management
          </button>
        </div>
        <div className="p-4">
          {activeTab === 'tasks' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
              <div className="space-y-2">
                {tasks.slice(0, 5).map(task => (
                  <div key={task._id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div>
                      <p className="font-medium">{task.description}</p>
                      <p className="text-sm text-gray-500">{task.staffId.username} - {task.taskType}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${
                      task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'staff' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Staff List</h2>
              <div className="space-y-2">
                {staff.map(member => (
                  <div key={member._id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <p className="font-medium">{member.username}</p>
                    <span className={`px-2 py-1 rounded text-sm ${
                      member.role === 'pantry' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
