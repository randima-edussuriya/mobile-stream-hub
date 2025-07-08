import React from 'react'
import { useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import staffRegisterValidation from '../../validations/staffRegisterValidation'
import axios from 'axios'
import { toast } from 'react-toastify'

function StaffRegister() {
  const [formData, setData] = useState({
    firstName: '',
    lastName: '',
    phoneNo: '',
    nicNo: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = staffRegisterValidation(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      alert('No errors')
      // try {
      //   const res = await axios.post('http://localhost:5000/api/auth/customer/signup', formData)
      //   if (res.data.success) {
      //     toast.success(res.data.message, { position: "top-center" })
      //     navigate('/login');
      //   } else {
      //     toast.error(res.data.message, { position: "top-center" });
      //   }
      // } catch (err) {
      //   console.error(err);
      //   toast.error('An error occurred', { position: "top-center" });
      // }
    }
  }
  return (
    <Container fluid className='d-flex justify-content-center align-items-center  mt-3 py-0 rounded'>
      <Container className='col-10 col-sm-6 p-3  rounded bg-secondary-subtle shadow_white'>
        <h3 className='text-center mb-3'>Staff User Register</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formGroupFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" placeholder="Enter first name" name='firstName' onChange={handleChange} />
            {errors.firstName && <span className='text-danger'>{errors.firstName}</span>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" placeholder="Enter last name" name='lastName' onChange={handleChange} />
            {errors.lastName && <span className='text-danger'>{errors.lastName}</span>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPhoneNo">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="text" placeholder="Enter phone number" name='phoneNo' onChange={handleChange} />
            {errors.phoneNo && <span className='text-danger'>{errors.phoneNo}</span>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupNicNo">
            <Form.Label>NIC Number</Form.Label>
            <Form.Control type="text" placeholder="Enter NIC number" name='nicNo' onChange={handleChange} />
            {errors.nicNo && <span className='text-danger'>{errors.nicNo}</span>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" placeholder="Enter address" name='address' onChange={handleChange} />
            {errors.address && <span className='text-danger'>{errors.address}</span>}
          </Form.Group>
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
          <Form.Group className="mb-3" controlId="formGroupConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" name='confirmPassword' onChange={handleChange} />
            {errors.confirmPassword && <span className='text-danger'>{errors.confirmPassword}</span>}
          </Form.Group>

          <div className='mb-3'>
            <Button className='btn_main_dark me-3 shadow' type='submit'>Register</Button>
            <Button variant='outline-danger' className='btn_style me-3 border-2 shadow' type='reset'>Reset</Button>
          </div>
        </Form>
      </Container>
    </Container>
  )
}

export default StaffRegister