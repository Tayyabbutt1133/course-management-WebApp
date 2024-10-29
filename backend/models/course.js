// models/course.js
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Course name is required'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Course description is required']
    },
    duration: {
        type: Number,
        required: [true, 'Course duration is required']
    },
    teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

const Course = mongoose.model("Course", courseSchema);

export default Course;