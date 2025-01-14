import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';

export const authController = {
    async login(req, res) {
        try {
            const { email, password,role} = req.body;
              
            // Validate input
            if (!email || !password || !role) {
                return res.status(400).json({success:false, message: 'Email and password are required' });
            }
       
            const user = await User.findOne({ email,role });
                
            if (!user) {
                return res.status(401).json({ success:false,message: 'Invalid credentials' });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            console.log(isValidPassword)
            if (!isValidPassword) {
                return res.status(401).json({success:false, message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Update last login timestamp
            user.lastLogin = new Date();
            await user.save();
          
            return res.status(200).json({
                success:true,
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                },
                expiresIn: 24 * 60 * 60, // 24 hours in seconds
            });
        } catch (error) {
            console.error('Login error:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async register(req, res) {
        try {
            const { username, email, password} = req.body;
            
            // Validate input
            if (!username || !email || !password) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const existingUser = await User.findOne({ $or: [{ email }, { username }] });
            if (existingUser) {
                return res.status(400).json({ message: 'Username or email already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                username,
                email,
                password: hashedPassword,
                role:"admin"
            });

            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            await user.save();

            res.status(201).json({
                message: 'User created successfully',
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    token
                },
                
            });
        } catch (error) {
            console.error('Registration error:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};
