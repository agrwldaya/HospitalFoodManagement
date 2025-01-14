import { Patient } from "../models/Patient.js";

 

export const patientController = {
    // Get all patients
    async getAllPatients(req, res) {
        try {
            console.log("get all patient ")
            const patients = await Patient.find()
                .sort({ admissionDate: -1 });
            res.json({
                success:true,
                patients});
        } catch (error) {
            res.status(500).json({success:false, message: error.message });
        }
    },

    // Get single patient
    async getPatient(req, res) {
        try {
            const patient = await Patient.findById(req.params.id);
            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }
            res.json(patient);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Create patient
    async createPatient(req, res) {
        try {
            const isExist = await Patient.findOne({patientId:req.body.patientId})
            if(isExist){
                return res.status(200).json({
                    success:false,
                    message:"Patient already exist with this patientId"
                });
            }
            const patient = new Patient(req.body);
             
            await patient.save();
            res.status(200).json({
                success:true,
                patient
            });
        } catch (error) {
            console.log(error)
            res.status(400).json({
                success:false,
                message: error.message });
        }
    },

    // Update patient
    async updatePatient(req, res) {
        try {
            const patient = await Patient.findById(req.params.id);
            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }

            Object.assign(patient, req.body);
            await patient.save();
            res.json(patient);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Delete patient
    async deletePatient(req, res) {
        try {
            const patient = await Patient.findByIdAndDelete(req.params.id);
            if (!patient) { 
                return res.status(404).json({ message: 'Patient not found' });
            }

            res.json({success:true, message: 'Patient deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};


export default patientController