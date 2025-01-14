import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    patientId: {
        type: String,
        required: true,
        unique: true
    },
    diseases: [String],
    allergies: [String],
    roomNumber: { type: String, required: true },
    bedNumber: { type: String, required: true },
    floorNumber: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    contactInfo: {
        phone: String,
        email: String
    },
    bloodType:{type:String},
    admissionDate: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'ready', 'delivered'],
        default: 'pending'
    }
});

export const Patient = mongoose.model('Patient', PatientSchema);