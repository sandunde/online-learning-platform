const express = require('express');
const { enrollStudent, getEnrolledStudents, getAllEnrollments, deleteEnrollment } = require('../controller/Enrollment');

const router = express.Router();

router.post('/enroll', enrollStudent);
router.get('/course/:courseId', getEnrolledStudents);
router.get('/', getAllEnrollments);
router.delete('/:id', deleteEnrollment); 

module.exports = router;
