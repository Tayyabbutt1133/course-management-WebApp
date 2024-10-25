import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import cookieParser from "cookie-parser";
import routes from './routes/routes.js'
import initializeAdmin from './config/adminInit.js';  // Add this import

const app = express();

app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200']
}));
app.use(cookieParser());
app.use(express.json());
app.use("/api", routes);

mongoose.connect("mongodb://localhost:27017/edtech", {})
    .then(() => {
        console.log("connected to database");
        // Initialize admin after database connection
        initializeAdmin();
        app.listen(5000, () => {
            console.log("app is running on port 5000")
        })
    })