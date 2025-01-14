'use client'

import React, { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, X } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { mealSliceActions } from '../../store/mealstore'

interface Meal {
  _id: string
  name: string
  ingredients: string
  instructions: string
  time: 'Morning' | 'Evening' | 'Night'
}

const DietChart: React.FC = () => {
  const allmeals= useSelector((state)=>state.mealStore)
  console.log(allmeals)
  const [meals, setMeals] = useState<Meal[]>(allmeals.meals)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null)

  const token = localStorage.getItem("token")
 
  const addMeal = async(meal: Omit<Meal, '_id'>) => {
    
    setMeals([...meals, { ...meal, _id: Date.now().toString() }])
      try {
        const response = await axios.post(`https://hospitalfoodmanagement.onrender.com/api/diet-charts/add` ,{meal}, {headers:{token}})
        if(response.data.success){
          toast.success(response.data.message)
        }else{
          toast.error(response.data.message)
        }
      } catch (error) {
        toast.error("Error...")
      }
    
  }

  const updateMeal = async(updatedMeal: Meal) => {
    setMeals(meals.map(meal => meal._id === updatedMeal._id ? updatedMeal : meal))

    try {
      const response = await axios.put(`https://hospitalfoodmanagement.onrender.com/api/diet-charts/${updatedMeal._id}` ,{updateMeal})

      if(response.data.success){
        toast.success(response.data.message)
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error("Error...")
    }
  }

  const deleteMeal = async(_id: string) => {
    setMeals(meals.filter(meal => meal._id !== _id))
      try {
        const response = await axios.delete(`https://hospitalfoodmanagement.onrender.com/api/diet-charts/${_id}`)
  
        if(response.data.success){
          toast.success(response.data.message)
        }else{
          toast.error(response.data.message)
        }
      } catch (error) {
        toast.error("Error...")
      }
  }

  const openModal = (meal: Meal | null = null) => {
    setCurrentMeal(meal)
    setIsModalOpen(true)   
  }

  const closeModal = () => {
    setCurrentMeal(null)
    setIsModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">Hospital Diet Chart</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['Morning', 'Evening', 'Night'] as const).map((time) => (
            <div key={time} className="bg-blue-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">{time}</h2>
              {meals
                .filter(meal => meal.time === time)
                .map(meal => (
                  <MealCard
                    key={meal._id}
                    meal={meal}
                    onEdit={() => openModal(meal)}
                    onDelete={() => deleteMeal(meal._id)}
                  />
                ))}
              <button
                onClick={() => openModal({ _id: '', name: '', ingredients: '', instructions: '', time })}
                className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Meal
              </button>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && (
        <MealModal
          meal={currentMeal}
          onClose={closeModal}
          onSave={(meal) => {
            if (meal._id) {
              updateMeal(meal)
            } else {
              addMeal(meal)
            }
            closeModal()
          }}
        />
      )}
    </div>
  )
}

const MealCard: React.FC<{ meal: Meal; onEdit: () => void; onDelete: () => void }> = ({ meal, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{meal.name}</h3>
        <div>
          <button onClick={onEdit} className="text-blue-600 hover:text-blue-800 mr-2">
            <Edit className="w-5 h-5" />
          </button>
          <button onClick={onDelete} className="text-red-600 hover:text-red-800">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600"><strong>Ingredients:</strong> {meal.ingredients}</p>
      <p className="text-sm text-gray-600"><strong>Instructions:</strong> {meal.instructions}</p>
    </div>
  )
}


const MealModal: React.FC<{
  meal: Meal | null
  onClose: () => void
  onSave: (meal: Meal) => void
}> = ({ meal, onClose, onSave }) => {
  const [formData, setFormData] = useState<Meal>(
    meal || { id: '', name: '', ingredients: '', instructions: '', time: 'Morning' }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{meal?.id ? 'Edit' : 'Add'} Meal</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
          <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="ingredients" className="block text-gray-700 font-bold mb-2">Ingredients</label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="instructions" className="block text-gray-700 font-bold mb-2">Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="time" className="block text-gray-700 font-bold mb-2">Time</label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">
            Save Meal
          </button>
        </form>
      </div>
    </div>
  )
}

export default DietChart

