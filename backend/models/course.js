import mongoose from "mongoose";

const teacherStudentPairSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

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
    }],
    teacherStudentPairs: [teacherStudentPairSchema]
}, {
    timestamps: true
});

const Course = mongoose.model("Course", courseSchema);

export default Course;