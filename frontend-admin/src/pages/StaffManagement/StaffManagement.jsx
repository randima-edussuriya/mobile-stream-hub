import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Container, Table, Badge, Spinner } from 'react-bootstrap'
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';

function StaffManagement() {
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState([]);
  const [isToogleCustomerStatus, setIsToogleCustomerStatus] = useState(false)

  const navigate = useNavigate();

  /* -----------------------------------------------------------------
        Fetch Staff users from API
  --------------------------------------------------------------------*/
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError('');
      setCustomers([]);
      setIsToogleCustomerStatus(false);
      try {
        const res = await axios.get('http://localhost:5000/api/customer');
        if (res.data.success) {
          setCustomers(res.data.data);
        } else {
          setError(res.data.message);
        }
      } catch (error) {
        console.error(error);
        setError('Failed to loading customers');
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers();
  }, [isToogleCustomerStatus])

  /* -----------------------------------------------------------------
        Handle staff user status change
  --------------------------------------------------------------------*/
  const handleStatusChange = async (customerId, newStatus) => {
    const actionText = newStatus ? 'activate' : 'deactivate';

    const confim = await Swal.fire({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
        title: "h5",
      },
      title: `Are you sure to  ${actionText} this customer`,
      showCancelButton: true,
      confirmButtonColor: "#10207A",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${actionText}`,
      width: '17em'
    })

    if (!confim.isConfirmed) return;

    try {
      const res = await axios.put(`http://localhost:5000/api/customer/status/${customerId}`,
        { newStatus: newStatus }
      );
      if (res.data.success) {
        setIsToogleCustomerStatus(true);
        toast.success(res.data.message, { position: 'top-center' })
      } else {
        toast.error(res.data.message, { position: 'top-center' })
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.', { position: 'top-center' })
    }
  }

  /* -----------------------------------------------------------------
        Render staff user data into table
  --------------------------------------------------------------------*/
  const renderTableBody = () => {
    if (Loading) {
      return (
        <tr>
          <td colSpan={9} className='text-center py-3'>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </td>
        </tr>
      )
    }

    if (error) {
      return (
        <tr>
          <td colSpan={9} className='text-danger text-center'>{error}</td>
        </tr>
      )
    }

    if (customers.length === 0) {
      return (
        <tr>
          <td colSpan={9} className='text-danger text-center'>No Customers found</td>
        </tr>
      )
    }

    return (
      customers.map(customer => (
        <tr key={customer.customer_id}>
          <td>{customer.customer_id}</td>
          <td>{customer.first_name}</td>
          <td>{customer.last_name}</td>
          <td>{customer.email}</td>
          <td>{customer.phone_number}</td>
          <td>{customer.address}</td>
          <td>{dayjs(customer.created_at).format('YYYY-MM-DD HH:mm:ss')}</td>
          <td>
            <Badge bg={customer.is_active ? 'success' : 'danger'}>
              {customer.is_active ? 'Active' : 'Deactive'}
            </Badge>
          </td>
          <td>
            <Button
              className='fw-bold'
              variant={customer.is_active ? 'outline-danger' : 'outline-success'}
              size='sm'
              onClick={() => handleStatusChange(customer.customer_id, customer.is_active ? 0 : 1)}
            >
              {customer.is_active ? 'Deactivate' : 'Active'}
            </Button>
          </td>
        </tr >
      ))
    )
  }

  return (
    <>
      <Container className='bg-secondary-subtle rounded shadow_white py-3 mt-3'>
        <Container className='d-flex justify-content-between mb-3'>
          <h4>Customers</h4>
          <Button onClick={() => navigate('/staff-register')} className='btn_main_dark shadow'>
            <i className="bi bi-plus-circle me-2 fs-6"></i>
            Add New
          </Button>
        </Container>
        <Container>
          <Table responsive hover striped className='rounded overflow-hidden shadow'>
            <thead>
              <tr className='fw-bold'>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>E-mail</th>
                <th>Phone No</th>
                <th>Address</th>
                <th>Created At</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {renderTableBody()}
            </tbody>
          </Table>
        </Container>
      </Container>
    </>
  )
}

export default StaffManagement