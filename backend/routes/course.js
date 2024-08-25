const express = require("express");
const { addCourse, getCourses, updateCourse, deleteCourse } = require("../controller/course");

const router = express.Router();

router.post("/courses", addCourse);          
router.get("/courses", getCourses);          
router.put("/courses/:id", updateCourse);   
router.delete("/courses/:id", deleteCourse);

module.exports = router;
