import express from 'express';

 
import patientController from '../controller/patient.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const Patientrouter = express.Router();

Patientrouter.use(authMiddleware);

Patientrouter.get('/getallpatients', patientController.getAllPatients);

Patientrouter.get('/getone/:id',patientController.getPatient);

Patientrouter.post('/createPatient',patientController.createPatient);

Patientrouter.put('/update_patient/:id',patientController.updatePatient);

Patientrouter.delete('/:id',patientController.deletePatient);

export default Patientrouter;