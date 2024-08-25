import React, { useState, useEffect } from 'react';
import { Row, Col, Toast, Button, Dropdown } from 'react-bootstrap';
import ClassPic from "../.././../assets/class.jpg";
import { useNavigate } from 'react-router-dom';
import Avatar from "../../../assets/avatar.jpg"
import "./StudentDashboard.css";
import { Gear } from 'react-bootstrap-icons';

const StudentDashboard = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const navigate = useNavigate();

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

    const fetchEnrollments = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/enrollments/${user._id}`);
        const result = await response.json();
        if (Array.isArray(result)) {
          const enrolled = new Set(result.map(enrollment => enrollment.courseId));
          setEnrolledCourses(enrolled);
        } else {
          console.error("Fetched enrollments data is not an array");
          setEnrolledCourses(new Set());
        }
      } catch (error) {
        console.error("Error fetching enrollments:", error.message);
        setEnrolledCourses(new Set());
      }
    };

    fetchCourses();
    fetchEnrollments();
  }, [user._id]);

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
        setEnrolledCourses(prev => new Set(prev.add(courseId)));
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

  const handleUnenroll = async (courseId) => {
    try {
      const response = await fetch("http://localhost:5001/api/enrollments/unenroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id, courseId }),
      });

      if (response.ok) {
        setToastMessage("Successfully unenrolled from the course!");
        setToastVariant('success');
        setEnrolledCourses(prev => {
          const updated = new Set(prev);
          updated.delete(courseId);
          return updated;
        });
      } else {
        setToastMessage("Error unenrolling from the course.");
        setToastVariant('danger');
      }
    } catch (error) {
      console.error("Error unenrolling from course:", error.message);
      setToastMessage("Error unenrolling from the course.");
      setToastVariant('danger');
    } finally {
      setShowToast(true);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <div className='header mb-5'>
        <h4>Student Dashboard</h4>
        <div className='profile'>
          <h4>Hi, {user.name}!</h4>
          <img src={Avatar} alt="avatar" className='profile-img' />
          <Dropdown>
            <Dropdown.Toggle variant='danger' id="dropdown-basic" className='profile-dropdown'>
              <Gear />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item>My Profile</Dropdown.Item>
              <Dropdown.Item>Enrolled Courses</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className="mt-4">
        <h2 className='text-center mb-4'>Available Courses</h2>
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
                    <a href='#' className="card-text">Read More</a>
                    <Button
                      variant={enrolledCourses.has(course._id) ? 'danger' : 'primary'}
                      className="mt-auto"
                      onClick={() => enrolledCourses.has(course._id) ? handleUnenroll(course._id) : handleEnroll(course._id)}
                    >
                      {enrolledCourses.has(course._id) ? 'Enrolled' : 'Enroll'}
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
