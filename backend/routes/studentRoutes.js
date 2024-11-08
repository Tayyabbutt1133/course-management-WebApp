// Create a new file: routes/studentRoutes.js
import { Router } from "express";
import Course from '../models/course.js';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const router = Router();

// Helper function to verify student
const verifyStudent = async (req) => {
    const cookie = req.cookies['jwt'];
    if (!cookie) return null;

    try {
        const claims = jwt.verify(cookie, process.env.JWT_SECRET || "defaultSecret");
        const user = await User.findById(claims._id);
        return user?.role === 'student' ? user : null;
    } catch (error) {
        return null;
    }
};

// Get courses where student is enrolled
router.get('/courses', async (req, res) => {
    try {
        const student = await verifyStudent(req);
        if (!student) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const courses = await Course.find({ students: student._id })
            .populate('teachers', 'name email')
            .select('name description duration teachers teacherStudentPairs');

        // Format response to include only assigned teacher for each course
        const formattedCourses = courses.map(course => {
            const teacherPair = course.teacherStudentPairs.find(
                pair => pair.student.toString() === student._id.toString()
            );

            const assignedTeacher = teacherPair 
                ? course.teachers.find(teacher => teacher._id.toString() === teacherPair.teacher.toString())
                : null;

            return {
                ...course.toObject(),
                assignedTeacher: assignedTeacher ? {
                    _id: assignedTeacher._id,
                    name: assignedTeacher.name,
                    email: assignedTeacher.email
                } : null
            };
        });

        res.json(formattedCourses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get specific course details for student
router.get('/courses/:id', async (req, res) => {
    try {
        const student = await verifyStudent(req);
        if (!student) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const course = await Course.findOne({
            _id: req.params.id,
            students: student._id
        }).populate('teachers', 'name email');

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Get assigned teacher
        const teacherPair = course.teacherStudentPairs.find(
            pair => pair.student.toString() === student._id.toString()
        );

        const assignedTeacher = teacherPair 
            ? course.teachers.find(teacher => teacher._id.toString() === teacherPair.teacher.toString())
            : null;

        const courseData = course.toObject();
        courseData.assignedTeacher = assignedTeacher ? {
            _id: assignedTeacher._id,
            name: assignedTeacher.name,
            email: assignedTeacher.email
        } : null;

        res.json(courseData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;