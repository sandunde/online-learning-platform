import React, { useEffect, useState } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./admin/AdminDashboard";
import StudentDashboard from "./student/StudentDashboard";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (!result.role) {
          navigate("/login");
        } else {
          setUser(result);
          if (result.role === "admin") {
            fetchStudents();
          }
        }
      } catch (error) {
        console.error(error.message);
        navigate("/login");
      }
    };
    if (token) {
      fetchUser();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      setStudents(result);
    } catch (error) {
      console.error("Error fetching students:", error.message);
    }
  };

  if (!user) return null;

  return (
    <Container className="mt-5">
      {/* <Row>
        <Col className="d-flex justify-content-between align-items-center">
          {user.role === "admin" ? (
            <h1 className="text-center">Admin Dashboard</h1>
          ) : (
            <h1 className="text-center">Student Dashboard</h1>
          )}
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Col>
      </Row> */}
      <Row>
        <Col>
          {user.role === "admin" ? (
            <AdminDashboard
              students={students}
              fetchStudents={fetchStudents}
              token={token}
            />
          ) : (
            <StudentDashboard user={user} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
