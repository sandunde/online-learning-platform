import { Button, Container, Form, Row, Col, Alert } from "react-bootstrap";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Class from "../../assets/loginClass.jpg";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5001/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            console.log(result);
            if (result.user && result.user._id) {
                navigate("/dashboard");
                localStorage.setItem("token", result.token);
            } else {
                setError("Invalid Credentials");
            }
        } catch (error) {
            console.error(error.message);
            setError("An error occurred. Please try again later.");
        } finally {
            setFormData({
                email: "",
                password: "",
            });
        }
    };

    return (
        <>
            <Container fluid className='landing-screen'>
                <Row>
                    <Col xs={12} md={6} className='order-md-1'>
                        <img src={Class} alt='class room' className='background-img' />
                    </Col>
                    <Col xs={12} md={6} className='landing-content order-md-2'>
                        <div className="center-form">
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <h1>Sign In Form</h1>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="Enter Email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Enter Password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="login-btn"
                                >
                                    Login
                                </Button>
                            </Form>
                            <div className="register-section">
                            <p>Or want to create an account?</p> 
                            <a href="/signup">Register</a>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Login;
