// config/courseInit.js
import Course from '../models/course.js';

const initialCourses = [
    {
        name: "Introduction to Programming",
        description: "Learn the basics of programming with JavaScript",
        duration: 8 // weeks
    },
    {
        name: "Web Development Fundamentals",
        description: "HTML, CSS, and JavaScript basics for web development",
        duration: 12
    },
    {
        name: "Database Management",
        description: "Introduction to databases with MongoDB",
        duration: 10
    },
    {
        name: "Human Computer Interaction",
        description: "Interaction of humans with computer",
        duration: 4
    },
    {
        name: "Assembly language",
        description: "Compiler code to interact with computers",
        duration: 6
    },
    {
        name: "Mobile development",
        description: "Understanding fundamentals of mobile interface and development",
        duration: 6
    },
    {
        name: "Theory of automata",
        description: "Compiler code to interact with computers",
        duration: 6
    },
];

const initializeCourses = async () => {
    try {
        const coursesCount = await Course.countDocuments();
        console.log('Current courses count:', coursesCount);
        
        if (coursesCount === 0) {
            const result = await Course.insertMany(initialCourses);
            console.log('✅ Initial courses created successfully:', result);
        } else {
            console.log('ℹ️ Courses already exist in the database');
        }
    } catch (error) {
        console.error('❌ Error initializing courses:', error);
    }
};

export default initializeCourses;