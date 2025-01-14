import express from 'express';
import { createStaff, getAllStaff } from '../controller/staff.controller.js';
 

const staffrouter = express.Router();

staffrouter.get('/getall', getAllStaff);
staffrouter.post('/addstaff', createStaff);

// Add other routes as needed

export default staffrouter;

