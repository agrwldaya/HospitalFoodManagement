import express from 'express';
import { createTask, getAllTasks, updateTaskStatus } from '../controller/Task.controller.js';
 

const taskrouter = express.Router();

taskrouter.get('/getall', getAllTasks);
taskrouter.post('/create', createTask);
taskrouter.patch('/update/:id', updateTaskStatus);

// Add other routes as needed

export default taskrouter;

