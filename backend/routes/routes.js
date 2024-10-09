import { Router } from "express";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"; // Corrected import for jsonwebtoken
import User from '../models/user.js';


const router = Router();


// route created
router.post('/register', async (req, res) => {
    let name = req.body.name
    let email = req.body.email
    let password = req.body.password
    let role = req.body.role
    
    const user = new User({
        name: name,
        email: email,
        password: password,
        role: role
    })

    const result = await user.save();

    res.json({
        user: result
    })

});

router.post('/login', async (req, res) => {
    res.send("login user");
});

router.get('/user', async (req, res) => {
    res.send("user");
});

export default router;