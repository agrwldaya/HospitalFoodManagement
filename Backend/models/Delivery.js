import mongoose from 'mongoose';


const DeliverySchema = new mongoose.Schema({
    dietChartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DietChart',
        required: true
    },
    deliveryPersonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PantryStaff',
        required: true
    },
    status: {
        type: String,
        enum: ['assigned', 'in-progress', 'delivered'],
        default: 'assigned'
    },
    deliveryTime: Date,
    notes: String
});

export const Delivery = mongoose.model('Delivery', DeliverySchema);
