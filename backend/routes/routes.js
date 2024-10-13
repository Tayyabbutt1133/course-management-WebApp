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


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const record = await User.findOne({
        email: email
    })

// validating registered user

    if (record)
    {
        res.status(400).send({
            message: "Email is already Registered !"
        })
    }
else
    {
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            role: role
        })
        const result = await user.save();

        // JWT Token
        const { _id } = await result.toJSON()
        
        const token = jwt.sign({ _id: _id }, "secret");
        
        res.cookie( "jwt", token,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000   // 1 day  
        })
        
        res.send({
          message: "success"
      })

        // giving back respond to post request
    res.json({
        user: result
    })

        }
});

router.post('/login', async (req, res) => {
    res.send("login user");
});

router.get('/user', async (req, res) => {
    res.send("user");
});

export default router;