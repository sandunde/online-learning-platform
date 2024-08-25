const express = require("express");
const studentController = require("../controller/student");

const router = express.Router();

router.get("/students", studentController.getAllStudents);

router.post("/students", studentController.addStudent);

router.put("/students/:id", studentController.updateStudent);

router.delete("/students/:id", studentController.deleteStudent);

module.exports = router;
