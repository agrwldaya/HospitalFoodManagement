import Staff from '../models/staff.js';
import Task from '../models/Task.js';
 

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('staffId', 'username role');
    
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { staffId, taskType, mealTime, description } = req.body.newTask;

   
    console.log(req.body)
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({success:false, message: 'Staff not found' });
    }
    
    const newTask = new Task({
      staffId,
      taskType,
      mealTime: taskType === 'Preparation' ? mealTime : undefined,
      description,
      status: 'Pending' // Set default status
    });
    
    const savedTask = await newTask.save();
    res.status(201).json({success:true,
        message:"Task created successfully!",
        savedTask});
  } catch (error) {
    console.log(error)
    res.status(400).json({success:false,message: 'Error creating task', error: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({success:false, message: 'Task not found' });
    }
    res.status(200).json({success:true,
      message:"Task updated successfully!",
      updatedTask});
  } catch (error) {
    res.status(400).json({success:false, message: 'Error updating task status', error: error.message });
  }
};

// Add other CRUD operations as needed

