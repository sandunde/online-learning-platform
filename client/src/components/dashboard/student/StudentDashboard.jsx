import React, { useState, useEffect } from 'react';
import { Row, Col, Toast, Button } from 'react-bootstrap';
import ClassPic from "../.././../assets/class.jpg";

const StudentDashboard = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/courses");
        const result = await response.json();
        if (Array.isArray(result)) {
          setCourses(result);
        } else {
          console.error("Fetched courses data is not an array");
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching courses:", error.message);
        setCourses([]);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      const response = await fetch("http://localhost:5001/api/enrollments/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id, courseId }),
      });

      if (response.ok) {
        setToastMessage("Successfully enrolled in the course!");
        setToastVariant('success');
      } else {
        setToastMessage("Error enrolling in the course.");
        setToastVariant('danger');
      }
    } catch (error) {
      console.error("Error enrolling in course:", error.message);
      setToastMessage("Error enrolling in the course.");
      setToastVariant('danger');
    } finally {
      setShowToast(true);
    }
  };

  return (
    <div className="text-center mt-5">
      <h1>Hi, {user.name}!</h1>
      <p>Welcome to your student dashboard.</p>

      <div className="mt-4">
        <h2>Available Courses</h2>
        <Row>
          {courses.length === 0 ? (
            <Col>
              <p>No courses available at the moment.</p>
            </Col>
          ) : (
            courses.map(course => (
              <Col xs={12} md={6} lg={4} key={course._id} className="mb-4">
                <div className="card h-100">
                  <img
                    src={course.imageUrl || ClassPic}
                    className="card-img-top"
                    alt={course.name}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">Course Name: <span style={{ color: "gray" }}>{course.name}</span></h5>
                    <p className="card-text">Course Description: <span style={{ color: "gray" }}>{course.description}</span></p>
                    <p className="card-text"><strong>Level:</strong> <span style={{ color: "gray" }}>{course.level}</span></p>
                    <Button
                      variant="primary"
                      className="mt-auto"
                      onClick={() => handleEnroll(course._id)}
                    >
                      Enroll
                    </Button>
                  </div>
                </div>
              </Col>
            ))
          )}
        </Row>
      </div>

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        className={`bg-${toastVariant} text-white position-fixed bottom-0 end-0 m-3`}
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </div>
  );
};

export default StudentDashboard;
