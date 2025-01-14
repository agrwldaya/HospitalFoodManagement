'use client'

import { useEffect, useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

// Note: We're not actually using mongoose in the client-side component,
// but we'll define the type based on the provided schema


type Patient = {
  id: string
  name: string
  patientId: string
  diseases: string[]
  allergies: string[]
  roomNumber: string
  bedNumber: string
  floorNumber: string
  age: number
  gender: string
  contactInfo: {
    phone: string
    email: string
  }
  bloodType: string
  admissionDate: Date
  status: 'pending' | 'preparing' | 'ready' | 'delivered'
}


export default function PatientManagement() {


  const patientdata= useSelector((state)=>state.patientStore)
  const token = localStorage.getItem('token')
 
  const initialPatients: Patient[] = patientdata.patients
  const [patients, setPatients] = useState<Patient[]>(initialPatients)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null)
  
  
  const [formData, setFormData] = useState<Omit<Patient, 'id'>>({
    name: '',
    patientId: '',
    diseases: [],
    allergies: [],
    roomNumber: '',
    bedNumber: '',
    floorNumber: '',
    age: 0,
    gender: '',
    contactInfo: {
      phone: '',
      email: ''
    },
    bloodType: '',
    admissionDate: new Date(),
    status: 'pending'
  })



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'phone' || name === 'email') {
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [name]: value
        }
      }))
    } else if (name === 'diseases' || name === 'allergies') {
      setFormData(prev => ({
        ...prev,
        [name]: value.split(',').map(item => item.trim())
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    if (currentPatient) {
      setPatients(patients.map(p => p.id === currentPatient.id ? { ...formData, id: currentPatient.id } : p))
    } else {
      setPatients([...patients, { ...formData, id: Date.now().toString() }])
    }
    setIsModalOpen(false)
    setCurrentPatient(null)
    resetForm()

  

  try {
      const response = await axios.post("http://localhost:3000/api/patients/createPatient",formData,{headers:{token}})

      if(response.data.success){
        console.log(response.data)
        toast.success("Patient added successfully!")
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error("Error...")
    }
  }

  // const editPatient = (patient: Patient) => {
  //   setFormData(patient)
  //   setIsModalOpen(true)
  // }

  const deletePatient = async(id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/patients/${id}` ,{headers:{token}})

      if(response.data.success){
        toast.success(response.data.message)
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error("Error...")
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      patientId: '',
      diseases: [],
      allergies: [],
      roomNumber: '',
      bedNumber: '',
      floorNumber: '',
      age: 0,
      gender: '',
      contactInfo: {
        phone: '',
        email: ''
      },
      bloodType: '',
      admissionDate: new Date(),
      status: 'pending'
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Patient Management</h1>
      <button
        onClick={() => {
          resetForm()
          setIsModalOpen(true)
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        <PlusIcon className="inline-block mr-2" />
        Add New Patient
      </button>

      {/* Patient List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Room</th>
              <th className="px-4 py-2">Age</th>
              <th className="px-4 py-2">Gender</th>
              <th className="px-4 py-2">Blood Type</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody> 
            {patients.map(patient => (
              <tr key={patient._id}>
                <td className="border px-4 py-2">{patient.name}</td>
                <td className="border px-4 py-2">{patient.patientId}</td>
                <td className="border px-4 py-2">{`${patient.roomNumber}-${patient.bedNumber}`}</td>
                <td className="border px-4 py-2">{patient.age}</td>
                <td className="border px-4 py-2">{patient.gender}</td>
                <td className="border px-4 py-2">{patient.bloodType}</td>
                <td className="border px-4 py-2 capitalize">{patient.status}</td>
                <td className="border px-4 py-2">
                  {/* <button
                    onClick={() => editPatient(patient)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                  > */}
                    {/* <PencilIcon className="inline-block" /> */}
                  {/* </button> */}
                  <button
                    onClick={() => deletePatient(patient._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    <TrashIcon className="inline-block" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Patient */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h2 className="text-2xl font-bold mb-4">{currentPatient ? 'Edit Patient' : 'Add New Patient'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Patient Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patientId">
                  Patient ID
                </label>
                <input
                  type="text"
                  id="patientId"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="diseases">
                  Diseases (comma-separated)
                </label>
                <input
                  type="text"
                  id="diseases"
                  name="diseases"
                  value={formData.diseases.join(', ')}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="allergies">
                  Allergies (comma-separated)
                </label>
                <input
                  type="text"
                  id="allergies"
                  name="allergies"
                  value={formData.allergies.join(', ')}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="roomNumber">
                    Room Number
                  </label>
                  <input
                    type="text"
                    id="roomNumber"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bedNumber">
                    Bed Number
                  </label>
                  <input
                    type="text"
                    id="bedNumber"
                    name="bedNumber"
                    value={formData.bedNumber}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="floorNumber">
                    Floor Number
                  </label>
                  <input
                    type="text"
                    id="floorNumber"
                    name="floorNumber"
                    value={formData.floorNumber}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.contactInfo.phone}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.contactInfo.email}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bloodType">
                  Blood Type
                </label>
                <input
                  type="text"
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="admissionDate">
                  Admission Date
                </label>
                <input
                  type="date"
                  id="admissionDate"
                  name="admissionDate"
                  value={formData.admissionDate.toISOString().split('T')[0]}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {currentPatient ? 'Update Patient' : 'Add Patient'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

