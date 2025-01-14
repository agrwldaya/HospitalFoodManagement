 
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv/config';
// import helmet from 'helmet';
// import morgan from 'morgan';

// Route imports
import dbconnect from './confing/Database.js';
import Authroute from './routes/auth.route.js';
import Patientrouter from './routes/patient.routes.js';
import Dite_chartrouter from './routes/dietChartRoutes.js';
import taskrouter from './routes/task.route.js';
import staffrouter from './routes/staff.Routes.js';
 

// dotenv.config();
const app = express();

// Middleware
app.use(cors({
    origin:"https://hospital-food-management-two.vercel.app"
}));

app.use(express.json());
// app.use(helmet());
// app.use(morgan('dev'));

// Database connection


// Routes
app.use('/api/auth', Authroute);
app.use('/api/staff',staffrouter );
app.use('/api/task',taskrouter );
app.use('/api/patients', Patientrouter);
app.use('/api/diet-charts', Dite_chartrouter);
// app.use('/api/delivery', deliveryRoutes);

dbconnect();
// Error handling middleware
app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});