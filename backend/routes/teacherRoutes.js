import { Router } from "express";
import Course from '../models/course.js';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const router = Router();

// Helper function to verify teacher
const verifyTeacher = async (req) => {
    const cookie = req.cookies['jwt'];
    if (!cookie) return null;

    try {
        const claims = jwt.verify(cookie, process.env.JWT_SECRET || "defaultSecret");
        const user = await User.findById(claims._id);
        return user?.role === 'teacher' ? user : null;
    } catch (error) {
        return null;
    }
};

// Get courses where teacher is assigned
router.get('/courses', async (req, res) => {
    try {
        const teacher = await verifyTeacher(req);
        if (!teacher) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const courses = await Course.find({ teachers: teacher._id })
            .populate('students', 'name email')
            .select('name description duration students teacherStudentPairs');

        // Format response to include only assigned students for each course
        const formattedCourses = courses.map(course => {
            const assignedStudents = course.students.filter(student => 
                course.teacherStudentPairs.some(pair => 
                    pair.teacher.toString() === teacher._id.toString() && 
                    pair.student.toString() === student._id.toString()
                )
            );

            return {
                ...course.toObject(),
                students: assignedStudents
            };
        });

        res.json(formattedCourses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get specific course details for teacher
router.get('/courses/:id', async (req, res) => {
    try {
        const teacher = await verifyTeacher(req);
        if (!teacher) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const course = await Course.findOne({
            _id: req.params.id,
            teachers: teacher._id
        }).populate('students', 'name email');

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Filter students to only show those assigned to this teacher
        const assignedStudents = course.students.filter(student => 
            course.teacherStudentPairs.some(pair => 
                pair.teacher.toString() === teacher._id.toString() && 
                pair.student.toString() === student._id.toString()
            )
        );

        const courseData = course.toObject();
        courseData.students = assignedStudents;

        res.json(courseData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;