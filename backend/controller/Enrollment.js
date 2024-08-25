const mongoose = require('mongoose');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

const enrollStudent = async (req, res) => {
    try {
        const { courseId, userId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid Course ID or User ID' });
        }

        const course = await Course.findById(courseId);
        const student = await User.findById(userId);

        if (!course || !student) {
            return res.status(404).json({ message: 'Course or Student not found' });
        }

        let enrollment = await Enrollment.findOne({ course: courseId });

        if (enrollment) {
            if (!enrollment.students.includes(userId)) {
                enrollment.students.push(userId);
            } else {
                return res.status(400).json({ message: 'Student already enrolled in this course' });
            }
        } else {
            enrollment = new Enrollment({
                course: courseId,
                courseName: course.name,
                students: [userId]
            });
        }

        await enrollment.save();
        res.status(201).json({ message: 'Student enrolled successfully', enrollment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getEnrolledStudents = async (req, res) => {
    try {
        const { courseId } = req.params;
        console.log("Received courseId:", courseId);

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'Invalid Course ID' });
        }

        const enrollment = await Enrollment.findOne({ course: courseId }).populate('students', 'name email');
        console.log("Enrollment found:", enrollment);

        if (!enrollment) {
            return res.status(404).json({ message: 'No students found for this course' });
        }

        res.status(200).json({ courseName: enrollment.courseName, students: enrollment.students });
    } catch (error) {
        console.error("Error in getEnrolledStudents:", error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find()
            .populate('students', 'name')
            .exec();

        res.status(200).json(enrollments);
    } catch (error) {
        console.error('Error fetching enrollments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteEnrollment = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Enrollment ID' });
        }

        const enrollment = await Enrollment.findById(id);

        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }

        await Enrollment.findByIdAndDelete(id);

        res.status(200).json({ message: 'Enrollment deleted successfully' });
    } catch (error) {
        console.error('Error deleting enrollment:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = {
    enrollStudent,
    getEnrolledStudents,
    getAllEnrollments,
    deleteEnrollment
};
