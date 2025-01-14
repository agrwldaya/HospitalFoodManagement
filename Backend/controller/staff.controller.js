import bcrypt from 'bcrypt';
import Staff from '../models/staff.js';
import { User } from '../models/User.js';

export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find().select('-password');
    res.status(200).json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Error fetching staff', error: error.message });
  }
};

export const createStaff = async (req, res) => {
  const { username, email, password, role, contact } = req.body.newStaff;
        
  // Input validation
  if (!username || !email || !password || !role || !contact) {
    return res.status(200).json({ success: false, message: 'All fields are required' });
  }
  if (!contact.phone || !contact.address) {
    return res.status(200).json({ success: false, message: 'Contact information is incomplete' });
  }

  try {

    // Check for existing user
    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(200).json({ success: false, message: 'Email already exists' });
    }

   
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
   
    // Create new staff and user
    const newStaff = new Staff({ username, email, password: hashedPassword, role,contact });
    const newUser = new User({ username, email, password: hashedPassword, role, contact });

    // Save both documents atomically (if using MongoDB transactions)
    await newStaff.save();
    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Staff added successfully!',
      staff: newStaff,
    });
  } catch (error) {
    console.error('Error creating staff:', error);
    res.status(500).json({ success: false, message: 'Error creating staff', error: error.message });
  }
};
