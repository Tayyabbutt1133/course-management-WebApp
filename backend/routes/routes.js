import { Router } from "express";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import User from '../models/user.js';

const router = Router();


// Register Route - Only for students and teachers
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if role is valid (only student or teacher allowed)
        if (!['student', 'teacher'].includes(role)) {
            return res.status(400).json({ 
                message: "Invalid role. Only student or teacher roles are allowed" 
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        const result = await user.save();

        // Generate JWT
        const token = jwt.sign(
            { _id: result._id },
            process.env.JWT_SECRET || "defaultSecret",
            { expiresIn: '1d' }
        );

        // Set cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });

        // Send response
        res.status(201).json({
            message: "Registration successful!",
            user: {
                id: result._id,
                name: result.name,
                email: result.email,
                role: result.role
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: error.message || "Error during registration" 
        });
    }
});

// Login Route - For all users including admin
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generate JWT
        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET || "defaultSecret",
            { expiresIn: '1d' }
        );

        // Set cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });

        // Send response
        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Error during login" });
    }
});

// Get User Route
router.get('/user', async (req, res) => {
    try {
        const cookie = req.cookies['jwt'];
        if (!cookie) {
            return res.status(401).json({ message: "Unauthenticated" });
        }

        // Verify the JWT
        const claims = jwt.verify(cookie, process.env.JWT_SECRET || "defaultSecret");

        if (!claims) {
            return res.status(401).json({ message: "Unauthenticated" });
        }

        // Find the user by ID from the token claims
        const user = await User.findById(claims._id).select('-password'); // Exclude password from the response

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Send user data
        res.json(user);

    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(401).json({ message: "Unauthenticated" });
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    try {
        // Clear the jwt cookie
        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0), // Expire the cookie immediately
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });

        res.json({ message: "Logout successful!" });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;