const express = require('express');
const router = express.Router();
const Course = require('../models/Course'); // Import Course model
const { default: authenticateJWT } = require('../config/middleware');
const User = require('../models/User'); // Import Course model
const Enrollment = require('../models/Enrollment'); // Import Course model

// POST API to create a new course
router.post('/add', async (req, res) => {
    try {
        const { title, fee, courseId, level, trackName, type } = req.body;

        // Create a new course instance
        const newCourse = new Course({
            title,
            fee,
            courseId,
            level,
            trackName,
            type
        });

        // Save the course to the database
        const savedCourse = await newCourse.save();

        // Send the response
        res.status(201).json({
            message: 'Course created successfully',
            data: savedCourse
        });
    } catch (error) {
        console.error('Error creating course:', error.message);
        res.status(500).json({ message: 'Error creating course', error: error.message });
    }
});


// API to Enroll User in a Course
router.post('/enroll', authenticateJWT, async (req, res) => {
    const { userEmail, courseId } = req.body;
    if (!userEmail || !courseId) {
        return res.status(400).json({ error: 'UserEmail and CourseId are required!' });
    }
    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ error: 'User does not exist!' });
        }
        const course = await Course.findOne({ courseId });
        if (!course) {
            return res.status(404).json({ error: 'Course does not exist!' });
        }
        const existingEnrollment = await Enrollment.findOne({ userEmail, courseId });
        if (existingEnrollment) {
            return res.status(400).json({ error: 'User is already enrolled in this course!' });
        }
        const enrollment = new Enrollment({ userEmail, courseId });
        await enrollment.save();
        res.status(201).json({ message: 'User enrolled successfully!' });
    } catch (err) {
        res.status(500).json({ error: 'Server error!' });
    }
});

// API to Get Enrolled Courses
router.get('/enrolledCourses/:userEmail', async (req, res) => {
    const { userEmail } = req.params;
    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ error: 'User does not exist!' });
        }
        const enrollments = await Enrollment.find({ userEmail });
        const courseIds = enrollments.map((enrollment) => enrollment.courseId);
        const courses = await Course.find({ courseId: { $in: courseIds } });
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ error: 'Server error!' });
    }
});
module.exports = router;
