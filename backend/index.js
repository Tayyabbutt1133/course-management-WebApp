import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import cookieParser from "cookie-parser";
import routes from './routes/routes.js';
import adminRoutes from './routes/adminRoutes.js';  // Make sure this matches your file name
import initializeAdmin from './config/adminInit.js';
import initializeCourses from './config/courseInit.js';

const app = express();

app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200']
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api", routes);
app.use("/api/admin", adminRoutes);

mongoose.connect("mongodb://localhost:27017/edtech", {})
    .then(() => {
        console.log("connected to database");
        initializeAdmin();
        initializeCourses();
        
        app.listen(5000, () => {
            console.log("app is running on port 5000")
        })
    })