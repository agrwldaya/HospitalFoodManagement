'use client'

import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'

interface Staff {
  _id?: string
  username: string
  email: string
  password: string
  role: 'pantry' | 'delivery'
  contact: {
    phone: string
    address: string
  }
}

interface Task {
  _id?: string
  staffId: string
  taskType: 'Preparation' | 'delivery'
  mealTime?: 'Morning' | 'Evening' | 'Night'
  description: string
  status: 'Pending' | 'In Progress' | 'Completed'
}

const StaffManagement: React.FC = () => {
  const token = localStorage.getItem("token")

  const [staff, setStaff] = useState<Staff[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [newStaff, setNewStaff] = useState<Staff>({
    username: '',
    email: '',
    password: '',
    role: 'pantry',
    contact: { phone: '', address: '' }
  })
  const [newTask, setNewTask] = useState<Task>({
    staffId: '',
    taskType: 'Preparation',
    mealTime: undefined,
    description: '',
    status: 'Pending'
  })
  const [showAddStaffForm, setShowAddStaffForm] = useState(false)
  const [showAddTaskForm, setShowAddTaskForm] = useState(false)

  useEffect(() => {
    fetchStaff()
    fetchTasks()
  }, [])

  const fetchStaff = async () => {
    try {
      const response = await axios.get('https://hospitalfoodmanagement.onrender.com/api/staff/getall')
      setStaff(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://hospitalfoodmanagement.onrender.com/api/task/getall')
      setTasks(response.data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('https://hospitalfoodmanagement.onrender.com/api/staff/addstaff', {newStaff}, {headers:{token}})
      if (response.data.success) {
        toast.success(response.data.message)
        fetchStaff()
        setNewStaff({
          username: '',
          email: '',
          password: '',
          role: 'pantry',
          contact: { phone: '', address: '' }
        })
        setShowAddStaffForm(false)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Error adding staff:', error)
      toast.error('Failed to add staff')
    }
  }

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {

      const response = await axios.post('https://hospitalfoodmanagement.onrender.com/api/task/create', {newTask}, {headers:{token}})
      if (response.data.success) {
        toast.success(response.data.message)
        fetchTasks()
        setNewTask({ staffId: '', taskType: 'Preparation', mealTime: undefined, description: '', status: 'Pending' })
        setShowAddTaskForm(false)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error('Error adding task:', error)
      toast.error('Failed to add task')
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">Hospital Staff Management</h1>

        {/* Add Staff Button and Form */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-blue-800">Staff Management</h2>
            <button
              onClick={() => setShowAddStaffForm(!showAddStaffForm)}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              {showAddStaffForm ? 'Cancel' : 'Add New Staff'}
            </button>
          </div>
          {showAddStaffForm && (
            <form onSubmit={handleStaffSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  id="username"
                  value={newStaff.username}
                  onChange={(e) => setNewStaff({...newStaff, username: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({...newStaff, password: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  id="role"
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({...newStaff, role: e.target.value as 'pantry' | 'delivery'})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  <option value="pantry">Pantry</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  value={newStaff.contact.phone}
                  onChange={(e) => setNewStaff({...newStaff, contact: {...newStaff.contact, phone: e.target.value}})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  id="address"
                  value={newStaff.contact.address}
                  onChange={(e) => setNewStaff({...newStaff, contact: {...newStaff.contact, address: e.target.value}})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
                Add Staff
              </button>
            </form>
          )}
        </div>

        {/* Staff List */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Staff List</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Pantry Staff</h3>
              {staff.filter(s => s.role === 'pantry').map((s) => (
                <div key={s._id} className="border-b pb-4 mb-4">
                  <h4 className="text-lg font-medium">{s.username}</h4>
                  <p className="text-gray-600">{s.email}</p>
                  <p className="text-gray-600">{s.contact.phone} - {s.contact.address}</p>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Delivery Staff</h3>
              {staff.filter(s => s.role === 'delivery').map((s) => (
                <div key={s._id} className="border-b pb-4 mb-4">
                  <h4 className="text-lg font-medium">{s.username}</h4>
                  <p className="text-gray-600">{s.email}</p>
                  <p className="text-gray-600">{s.contact.phone} - {s.contact.address}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Task Button and Form */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-blue-800">Task Management</h2>
            <button
              onClick={() => setShowAddTaskForm(!showAddTaskForm)}
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
            >
              {showAddTaskForm ? 'Cancel' : 'Assign New Task'}
            </button>
          </div>
          {showAddTaskForm && (
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <div>
                <label htmlFor="staffId" className="block text-sm font-medium text-gray-700">Staff Member</label>
                <select
                  id="staffId"
                  value={newTask.staffId}
                  onChange={(e) => setNewTask({...newTask, staffId: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  <option value="">Select Staff Member</option>
                  {staff.map((s) => (
                    <option key={s._id} value={s._id}>{s.username} - {s.role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="taskType" className="block text-sm font-medium text-gray-700">Task Type</label>
                <select
                  id="taskType"
                  value={newTask.taskType}
                  onChange={(e) => setNewTask({...newTask, taskType: e.target.value as 'Preparation' | 'delivery'})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                >
                  <option value="Preparation">Preparation</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>
              {newTask.taskType === 'Preparation' && (
                <div>
                  <label htmlFor="mealTime" className="block text-sm font-medium text-gray-700">Meal Time</label>
                  <select
                    id="mealTime"
                    value={newTask.mealTime}
                    onChange={(e) => setNewTask({...newTask, mealTime: e.target.value as 'Morning' | 'Evening' | 'Night'})}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">Select Meal Time</option>
                    <option value="Morning">Morning Meal</option>
                    <option value="Evening">Evening Meal</option>
                    <option value="Night">Night Meal</option>
                  </select>
                </div>
              )}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Task Description</label>
                <input
                  type="text"
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300">
                Assign Task
              </button>
            </form>
          )}
        </div>

        {/* Task List */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Assigned Tasks</h2>
          <div className="space-y-4">
            {tasks.map((task) => {
              const assignedStaff = staff.find(s => s._id === task.staffId._id)
              return (
                <div key={task._id} className="border-b pb-4">
                  <h3 className="text-lg font-medium">{assignedStaff?.username} - {assignedStaff?.role}</h3>
                  <p className="text-gray-600">Task Type: {task.taskType}</p>
                  {task.mealTime && <p className="text-gray-600">Meal Time: {task.mealTime}</p>}
                  <p className="text-gray-600">Description: {task.description}</p>
                  <div className="mt-2">
                    <span className="text-sm font-medium text-gray-700">Status: {task.status} </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffManagement

