import React from 'react';
import "./LandingPage.css";
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Facebook, Google, Instagram, TwitterX } from "react-bootstrap-icons";
import {useNavigate} from "react-router-dom"
import Class from "../../assets/classView.jpg";

const LandingPage = () => {
    const navigate = useNavigate();

    const handleRegister = () => {
        navigate("/signup")
    }

    const handleLogin = () => {
        navigate("/login")
    }

    return (
        <Container fluid className='landing-screen'>
            <Row>
                <Col xs={12} md={6} className='order-md-1'>
                    <img src={Class} alt='class room' className='background-img' />
                </Col>
                <Col xs={12} md={6} className='landing-content order-md-2'>
                    <h1>Welcome Back!</h1>
                    <p>Start Learning with us</p>
                    <div className='btns'>
                        <Button className='register-btn' onClick={handleRegister}>Register</Button>
                        <Button className='login-btn' onClick={handleLogin}>Login</Button>
                    </div>
                    <h5>Stay connected with us</h5>
                    <div className='social-icons'>
                        <Facebook />
                        <Instagram />
                        <TwitterX />
                        <Google />
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default LandingPage;
