import { Router } from "express";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import User from '../models/user.js';

const router = Router();

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already Registered!" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        const result = await user.save();

        // Generate JWT Token
        const token = jwt.sign({ _id: result._id }, process.env.JWT_SECRET || "defaultSecret", { expiresIn: '1d' });

        // Set JWT in cookies
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000   // 1 day
        });

        // Send response
        res.status(201).json({
            message: "User registered successfully!",
            user: result
        });

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Login Route (Placeholder)
router.post('/login', async (req, res) => {
    res.send("login user");
});

// Get User Route (Placeholder)
router.get('/user', async (req, res) => {
    res.send("user");
});

export default router;
