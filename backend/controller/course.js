const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

async function addCourse(req, res) {
    try {
        const { name, level, description } = req.body;

        if (!name || !level || !description) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newCourse = new Course({ name, level, description });
        await newCourse.save();

        const newEnrollment = new Enrollment({
            course: newCourse._id,
            courseName: newCourse.name,
            students: []
        });
        await newEnrollment.save();

        res.status(201).json(newCourse);
    } catch (error) {
        console.error("Error adding course:", error.message);
        res.status(500).json({ message: "Error adding course" });
    }
}

async function getCourses(req, res) {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        console.error("Error getting courses:", error.message);
        res.status(500).json({ message: "Error getting courses" });
    }
}

async function updateCourse(req, res) {
    try {
        const { id } = req.params;
        const { name, level, description } = req.body;

        const updatedCourse = await Course.findByIdAndUpdate(id, { name, level, description }, { new: true });

        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found." });
        }

        res.status(200).json(updatedCourse);
    } catch (error) {
        console.error("Error updating course:", error.message);
        res.status(500).json({ message: "Error updating course" });
    }
}

async function deleteCourse(req, res) {
    try {
        const { id } = req.params;

        const deletedCourse = await Course.findByIdAndDelete(id);

        if (!deletedCourse) {
            return res.status(404).json({ message: "Course not found." });
        }

        await Enrollment.findOneAndDelete({ course: id });

        res.status(200).json({ message: "Course deleted successfully." });
    } catch (error) {
        console.error("Error deleting course:", error.message);
        res.status(500).json({ message: "Error deleting course" });
    }
}

module.exports = { addCourse, getCourses, updateCourse, deleteCourse };
