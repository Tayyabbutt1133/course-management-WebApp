import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import cookieParser from "cookie-parser";
import routes from './routes/routes.js'
// creating express app 
const app = express();

// giving access to app to use cor's and cookie parser
app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200']
}));
app.use(cookieParser());

app.use(express.json());
app.use("/api",routes);

mongoose.connect("mongodb://localhost:27017/edtech", {
})
    .then(() => {
        console.log("connected to database");
        app.listen(5000, () => {
            console.log("app is running on port 5000")
        })
})