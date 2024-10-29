// routes/adminRoutes.js
import { Router } from "express";
import User from '../models/user.js';
import Course from '../models/course.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

// Helper function to verify admin
const verifyAdmin = async (req) => {
    const cookie = req.cookies['jwt'];
    if (!cookie) return null;

    try {
        const claims = jwt.verify(cookie, process.env.JWT_SECRET || "defaultSecret");
        const user = await User.findById(claims._id);
        return user?.role === 'admin' ? user : null;
    } catch (error) {
        return null;
    }
};



// Get admin profile
router.get('/profile', async (req, res) => {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        res.json({
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Teacher Routes

// Add teacher with course
router.post('/teachers', async (req, res) => {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { name, email, password, courseId } = req.body;

        // Validate email format
        if (!email.match(/.+@.+\..+/)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Verify course exists
        if (courseId) {
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const teacher = new User({
            name,
            email,
            password: hashedPassword,
            role: 'teacher'
        });

        await teacher.save();

        // Assign to course if courseId provided
        if (courseId) {
            const course = await Course.findById(courseId);
            course.teachers.push(teacher._id);
            await course.save();
        }

        res.status(201).json({
            message: "Teacher added successfully",
            teacher: {
                id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                role: teacher.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all teachers with their courses
router.get('/teachers', async (req, res) => {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const teachers = await User.find({ role: 'teacher' })
            .select('-password');
        
        // Get courses for each teacher
        const teachersWithCourses = await Promise.all(teachers.map(async (teacher) => {
            const courses = await Course.find({ teachers: teacher._id })
                .select('name description');
            return {
                ...teacher.toJSON(),
                courses
            };
        }));

        res.json(teachersWithCourses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single teacher
router.get('/teachers/:id', async (req, res) => {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const teacher = await User.findOne({ _id: req.params.id, role: 'teacher' })
            .select('-password');
        
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        const courses = await Course.find({ teachers: teacher._id })
            .select('name description');

        res.json({
            ...teacher.toJSON(),
            courses
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete teacher
router.delete('/teachers/:id', async (req, res) => {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const teacher = await User.findOne({ _id: req.params.id, role: 'teacher' });
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        // Remove teacher from any courses they're assigned to
        await Course.updateMany(
            { teachers: req.params.id },
            { $pull: { teachers: req.params.id } }
        );

        // Delete the teacher
        await User.deleteOne({ _id: req.params.id });

        res.json({ message: "Teacher deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Student Routes

// Add student with course
router.post('/students', async (req, res) => {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { name, email, password, courseId } = req.body;

        // Validate email format
        if (!email.match(/.+@.+\..+/)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Verify course exists
        if (courseId) {
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const student = new User({
            name,
            email,
            password: hashedPassword,
            role: 'student'
        });

        await student.save();

        // Assign to course if courseId provided
        if (courseId) {
            const course = await Course.findById(courseId);
            course.students.push(student._id);
            await course.save();
        }

        res.status(201).json({
            message: "Student added successfully",
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                role: student.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all students with their courses
router.get('/students', async (req, res) => {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const students = await User.find({ role: 'student' })
            .select('-password');
        
        // Get courses for each student
        const studentsWithCourses = await Promise.all(students.map(async (student) => {
            const courses = await Course.find({ students: student._id })
                .select('name description');
            return {
                ...student.toJSON(),
                courses
            };
        }));

        res.json(studentsWithCourses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single student
router.get('/students/:id', async (req, res) => {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const student = await User.findOne({ _id: req.params.id, role: 'student' })
            .select('-password');
        
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const courses = await Course.find({ students: student._id })
            .select('name description');

        res.json({
            ...student.toJSON(),
            courses
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Course Routes

// Get all courses with teachers and students
router.get('/courses', async (req, res) => {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const courses = await Course.find()
            .populate('teachers', '-password')
            .populate('students', '-password');

        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single course
router.get('/courses/:id', async (req, res) => {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const course = await Course.findById(req.params.id)
            .populate('teachers', '-password')
            .populate('students', '-password');

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;