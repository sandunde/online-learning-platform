const User = require("../models/User");
const bcrypt = require("bcrypt");

async function getAllStudents(req, res) {
    try {
        const students = await User.find({ role: "student" });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving students" });
    }
}
async function addStudent(req, res) {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: "Name, email, and password are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "student",
        });

        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (error) {
        console.error("Error adding user:", error.message);
        res.status(500).json({ message: "Error adding user" });
    }
}
async function updateStudent(req, res) {
    try {
        const { name, email, password, role } = req.body;
        const { id } = req.params;

        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: "Name, email, and password are required." });
        }

        const hashedPassword = password
            ? await bcrypt.hash(password, 10)
            : undefined;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                name,
                email,
                password: hashedPassword || undefined,
                role,
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Student not found." });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(500).json({ message: "Error updating user" });
    }
}

async function deleteStudent(req, res) {
    try {
        const { id } = req.params;

        const student = await User.findByIdAndDelete(id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting student" });
    }
}

module.exports = {
    getAllStudents,
    addStudent,
    updateStudent,
    deleteStudent,
};
