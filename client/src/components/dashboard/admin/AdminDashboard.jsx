import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import StudentsTable from './StudentTable';
import CoursesTable from './CourseTable';
import EnrollmentTable from './EnrollmentTable';

const AdminDashboard = ({ token }) => {
    const [activeTab, setActiveTab] = useState('students');
    const [showStudentModal, setShowStudentModal] = useState(false);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
    const [currentStudent, setCurrentStudent] = useState({ name: '', email: '', password: '' });
    const [currentCourse, setCurrentCourse] = useState({ name: '', level: '', description: '' });
    const [currentEnrollment, setCurrentEnrollment] = useState({ courseId: '', studentIds: [] });
    const [studentsList, setStudentsList] = useState([]);
    const [coursesList, setCoursesList] = useState([]);
    const [isEditingStudent, setIsEditingStudent] = useState(false);
    const [isEditingCourse, setIsEditingCourse] = useState(false);
    const [enrollmentsList, setEnrollmentsList] = useState([]);
    const [isEditingEnrollment, setIsEditingEnrollment] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudentsData = async () => {
            try {
                const response = await fetch("http://localhost:5001/api/students", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const result = await response.json();
                if (Array.isArray(result)) {
                    setStudentsList(result);
                } else {
                    console.error("Fetched students data is not an array");
                    setStudentsList([]);
                }
            } catch (error) {
                console.error("Error fetching students:", error.message);
                setStudentsList([]);
            }
        };
        fetchStudentsData();
    }, [token]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch("http://localhost:5001/api/courses", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const result = await response.json();
                if (Array.isArray(result)) {
                    setCoursesList(result);
                } else {
                    console.error("Fetched courses data is not an array");
                    setCoursesList([]);
                }
            } catch (error) {
                console.error("Error fetching courses:", error.message);
                setCoursesList([]);
            }
        };
        fetchCourses();
    }, [token]);

    useEffect(() => {
        if (activeTab === 'enrollments') {
            const fetchEnrollments = async () => {
                try {
                    const response = await fetch("http://localhost:5001/api/enrollments", {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setEnrollmentsList(data);
                } catch (error) {
                    console.error('Error fetching enrollments:', error.message);
                }
            };
            fetchEnrollments();
        }
    }, [activeTab, token]);

    const handleAddOrUpdateStudent = async () => {
        const url = isEditingStudent
            ? `http://localhost:5001/api/students/${currentStudent._id}`
            : "http://localhost:5001/api/students";
        const method = isEditingStudent ? 'PUT' : 'POST';
    
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(currentStudent),
            });
    
            if (response.ok) {
                const updatedStudent = await response.json();
    
                setStudentsList(prevStudentsList => {
                    if (isEditingStudent) {
                        return prevStudentsList.map(student => 
                            student._id === updatedStudent._id ? updatedStudent : student
                        );
                    } else {
                        return [...prevStudentsList, updatedStudent];
                    }
                });
    
                setShowStudentModal(false);
                setCurrentStudent({ name: '', email: '', password: '' });
            } else {
                const result = await response.json();
                console.error("Error:", result.message);
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    };
    
    const handleAddOrUpdateCourse = async () => {
        const url = isEditingCourse
            ? `http://localhost:5001/api/courses/${currentCourse._id}`
            : "http://localhost:5001/api/courses";
        const method = isEditingCourse ? 'PUT' : 'POST';
    
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(currentCourse),
            });
            if (response.ok) {
                const updatedCourse = await response.json();
                if (isEditingCourse) {
                    setCoursesList(coursesList.map(course =>
                        course._id === updatedCourse._id ? updatedCourse : course
                    ));
                } else {
                    setCoursesList([...coursesList, updatedCourse]);
                }
                setShowCourseModal(false);
                setCurrentCourse({ name: '', level: '', description: '' });
            } else {
                const result = await response.json();
                console.error("Error:", result.message);
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    const handleDeleteStudent = async (id) => {
        try {
            const response = await fetch(`http://localhost:5001/api/students/${id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const updatedStudents = studentsList.filter(student => student._id !== id);
                setStudentsList(updatedStudents);
            } else {
                console.error("Error deleting student");
            }
        } catch (error) {
            console.error("Error deleting student:", error.message);
        }
    };

    const handleDeleteCourse = async (id) => {
        try {
            const response = await fetch(`http://localhost:5001/api/courses/${id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const updatedCourses = coursesList.filter(course => course._id !== id);
                setCoursesList(updatedCourses);
            } else {
                console.error("Error deleting course");
            }
        } catch (error) {
            console.error("Error deleting course:", error.message);
        }
    };

    const handleAddOrUpdateEnrollment = async () => {
        const url = isEditingEnrollment
            ? `http://localhost:5001/api/enrollments/enroll/${currentEnrollment._id}`
            : "http://localhost:5001/api/enrollments/enroll";
        const method = isEditingEnrollment ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(currentEnrollment),
            });
            if (response.ok) {
                const updatedEnrollments = await response.json();
                setEnrollmentsList(Array.isArray(updatedEnrollments) ? updatedEnrollments : []);
                setShowEnrollmentModal(false);
                setCurrentEnrollment({ courseId: '', studentIds: [] });
            } else {
                const result = await response.json();
                console.error("Error:", result.message);
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    const handleDeleteEnrollment = async (id) => {
        try {
            const response = await fetch(`http://localhost:5001/api/enrollments/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const updatedEnrollments = await response.json();
                setEnrollmentsList(updatedEnrollments);
            } else {
                const errorText = await response.text();
                console.error("Error response:", errorText);
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    };


    const openStudentModal = (student = {}) => {
        setCurrentStudent(student);
        setIsEditingStudent(!!student._id);
        setShowStudentModal(true);
    };

    const openCourseModal = (course = {}) => {
        setCurrentCourse(course);
        setIsEditingCourse(!!course._id);
        setShowCourseModal(true);
    };

    const openEnrollmentModal = (enrollment = {}) => {
        setCurrentEnrollment({
            courseId: enrollment.courseId || '',
            studentIds: enrollment.students || [],
        });
        setIsEditingEnrollment(!!enrollment._id);
        setShowEnrollmentModal(true);
    };

    return (
        <div>
            <div className="container mt-4">
                <Button variant="primary" onClick={() => setActiveTab('students')}>Students</Button>
                <Button variant="primary" onClick={() => setActiveTab('courses')} className="ms-2">Courses</Button>
                <Button variant="primary" onClick={() => setActiveTab('enrollments')} className="ms-2">Enrollments</Button>
                {activeTab === 'students' && (
                    <>
                        <StudentsTable
                            studentsList={studentsList}
                            openStudentModal={openStudentModal}
                            handleDeleteStudent={handleDeleteStudent}
                        />
                        <Button variant="primary" className="mt-3" onClick={() => openStudentModal()}>Add Student</Button>
                    </>
                )}

                {activeTab === 'courses' && (
                    <>
                        <CoursesTable
                            coursesList={coursesList}
                            openCourseModal={openCourseModal}
                            handleDeleteCourse={handleDeleteCourse}
                        />
                        <Button variant="primary" className="mt-3" onClick={() => openCourseModal()}>Add Course</Button>
                    </>
                )}

                {activeTab === 'enrollments' && (
                    <>
                        <EnrollmentTable
                            enrollmentsList={enrollmentsList}
                            handleDeleteEnrollment={handleDeleteEnrollment}
                            openEnrollmentModal={openEnrollmentModal}
                        />
                        <Button variant="primary" className="mt-3" onClick={() => openEnrollmentModal()}>Add Enrollment</Button>
                    </>
                )}

                <Modal show={showStudentModal} onHide={() => setShowStudentModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{isEditingStudent ? 'Edit Student' : 'Add Student'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentStudent.name}
                                    onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={currentStudent.email}
                                    onChange={(e) => setCurrentStudent({ ...currentStudent, email: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={currentStudent.password}
                                    onChange={(e) => setCurrentStudent({ ...currentStudent, password: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowStudentModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleAddOrUpdateStudent}>
                            {isEditingStudent ? 'Update' : 'Add'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showCourseModal} onHide={() => setShowCourseModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{isEditingCourse ? 'Edit Course' : 'Add Course'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formCourseName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentCourse.name}
                                    onChange={(e) => setCurrentCourse({ ...currentCourse, name: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formLevel">
                                <Form.Label>Level</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentCourse.level}
                                    onChange={(e) => setCurrentCourse({ ...currentCourse, level: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={currentCourse.description}
                                    onChange={(e) => setCurrentCourse({ ...currentCourse, description: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowCourseModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleAddOrUpdateCourse}>
                            {isEditingCourse ? 'Update' : 'Add'}
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showEnrollmentModal} onHide={() => setShowEnrollmentModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{isEditingEnrollment ? 'Edit Enrollment' : 'Add Enrollment'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="enrollmentCourse">
                                <Form.Label>Course</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={currentEnrollment.courseId}
                                    onChange={(e) => setCurrentEnrollment({ ...currentEnrollment, courseId: e.target.value })}
                                >
                                    <option value="">Select a course</option>
                                    {coursesList.map(course => (
                                        <option key={course._id} value={course._id}>{course.name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="enrollmentStudents" className="mt-2">
                                <Form.Label>Students</Form.Label>
                                <Form.Control
                                    as="select"
                                    multiple
                                    value={currentEnrollment.studentIds}
                                    onChange={(e) => setCurrentEnrollment({
                                        ...currentEnrollment,
                                        studentIds: Array.from(e.target.selectedOptions, option => option.value)
                                    })}
                                >
                                    {studentsList.map(student => (
                                        <option key={student._id} value={student._id}>{student.name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEnrollmentModal(false)}>Close</Button>
                        <Button variant="primary" onClick={handleAddOrUpdateEnrollment}>
                            {isEditingEnrollment ? 'Update Enrollment' : 'Add Enrollment'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default AdminDashboard;