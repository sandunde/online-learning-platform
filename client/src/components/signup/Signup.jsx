import { Button, Form, Container, Row, Col } from "react-bootstrap";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import Class from "../../assets/loginClass.jpg";
import "./signup.css";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        password: "",
    });

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
            const response = await fetch("http://localhost:5001/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            console.log(result);
            if (result.user._id) {
                navigate("/login")
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            setFormData({
                email: "",
                name: "",
                password: "",
            });
        }
    };

    return (
        <Container fluid className='landing-screen'>
            <Row>
                <Col xs={12} md={6} className='order-md-1'>
                    <img src={Class} alt='class room' className='background-img' />
                </Col>
                <Col xs={12} md={6} className='landing-content order-md-2'>
                    <div className="center-form">
                        <Form onSubmit={handleSubmit}>
                            <h1>Sign Up Form</h1>
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
                            <Form.Group controlId="formBasicName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="Enter Name"
                                    value={formData.name}
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
                                className="signup-btn"
                            >
                                Register
                            </Button>
                        </Form>
                        <div className="register-section">
                            <p>Or already have an account?</p> 
                            <a href="/login">Login</a>
                            </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Signup;
