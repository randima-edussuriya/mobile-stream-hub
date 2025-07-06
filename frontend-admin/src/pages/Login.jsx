import React, { useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import logo from '../assets/icons/logo.png'
import loginValidation from '../validations/loginValidation'
import { useContext } from 'react'
import { AuthContext } from '../context/authContext'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [errors, setError] = useState({})

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const { login } = useContext(AuthContext)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = loginValidation(formData);
    setError(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const res = await login(formData)
        if (res.data.success) {
          toast.success(res.data.message, { position: "top-center" });
          navigate('/home')
        } else {
          toast.error(res.data.message, { position: "top-center" })
        }
      } catch (error) {
        console.error(error);
        toast.error('An error occured', { position: 'top-center' })
      }
    }
  }

  return (
    <Container fluid className='bg-secondary-subtle min-vh-100 d-flex align-items-center justify-content-center'>
      <Container className='col-10 col-sm-4 p-3 bg-white rounded-2 shadow'>
        <Container className='text-center'>
          <img
            src={logo}
            className='img-fluid'
            width='210px'
          />
          <h4 className='my-3'>Log In to Admin Side</h4>
        </Container>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" placeholder="Enter email" name='email' onChange={handleChange} />
            {errors.email && <span className='text-danger'>{errors.email}</span>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" name='password' onChange={handleChange} />
            {errors.password && <span className='text-danger'>{errors.password}</span>}
          </Form.Group>

          <div className='mb-3'>
            <Button variant='none' className='btn_main_dark w-100 shadow' type='submit'>Log In</Button>
          </div>
        </Form>
      </Container>
    </Container>
  )
}

export default Login