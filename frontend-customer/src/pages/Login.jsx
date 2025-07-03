import React, { useContext } from 'react'
import { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import LoginValidation from '../validations/LoginValidation';
import axios from 'axios';
import { toast } from 'react-toastify'
import { AuthContext } from '../context/authContext';

function Login() {
    const [data, setData] = useState({
        email: '',
        password: '',
    })
    const [errors, setErrors] = useState({});

    const handleInput = (e) => {
        setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const navigate = useNavigate();

    const { login } = useContext(AuthContext)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = LoginValidation(data);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            try {
                const res = await login(data)
                if (res.data.success) {
                    toast.success(res.data.message, { position: "top-center" })
                    navigate('/');
                } else {
                    toast.error(res.data.message, { position: "top-center" });
                }
            } catch (err) {
                console.error(err);
                toast.error('An error occurred', { position: "top-center" });
            }
        }
    }

    return (
        <Container fluid className='d-flex justify-content-center align-items-center bg_light mt-5 py-3'>
            <Container className='col-10 col-sm-6 p-3 bg-white rounded-2'>
                <h3 className='text-center'>Log In</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="text" placeholder="Enter email" name='email' onInput={handleInput} />
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter password" name='password' onInput={handleInput} />
                        {errors.password && <span className='text-danger'>{errors.password}</span>}
                    </Form.Group>

                    <div className='mb-3'>
                        <Button variant='none' className='btn_main_dark me-3' type='submit'>Log In</Button>
                        <Link to={'/signup'} className='btn btn_main_light_outline'>Sign Up</Link>
                    </div>
                </Form>
            </Container>
        </Container>
    )
}

export default Login