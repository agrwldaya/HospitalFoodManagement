import express from 'express';
import { authController } from '../controller/auth.controller.js';
 

const Authroute = express.Router();

Authroute.post('/login', authController.login);
Authroute.post('/register', authController.register);

export default Authroute;