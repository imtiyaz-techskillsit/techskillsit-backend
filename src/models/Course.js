const mongoose = require('mongoose');

 // Course Schema
const CourseSchema = new mongoose.Schema({
    courseId: { type: Number, required: true, unique: true },
    title: String,
    fee: Number,
    level: Number,
    trackName: String,
    type: String,
});
const Course = mongoose.model('Course', CourseSchema);