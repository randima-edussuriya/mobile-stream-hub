import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Container, Table, Badge, Spinner } from 'react-bootstrap'
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';

function CategoryManagement() {
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [isToogleCategoryDelete, setIsToogleCategoryDelete] = useState(false)

  const navigate = useNavigate();

  /* -----------------------------------------------------------------
        Fetch categories from API
  --------------------------------------------------------------------*/
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError('');
      setCategories([]);
      setIsToogleCategoryDelete(false);
      try {
        const res = await axios.get('http://localhost:5000/api/category');
        if (res.data.success) {
          setCategories(res.data.data);
        } else {
          setError(res.data.message);
        }
      } catch (error) {
        console.error(error);
        setError('Failed to loading categories. Please try again.');
      } finally {
        setLoading(false)
      }
    }
    fetchCategories();
  }, [isToogleCategoryDelete])

  /* -----------------------------------------------------------------
        Handle category delete
  --------------------------------------------------------------------*/
  const handleCategoryDelete = async (categoryId) => {
    const confim = await Swal.fire({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
        title: "h5",
      },
      title: `Are you sure to  delete this category`,
      showCancelButton: true,
      confirmButtonColor: "#10207A",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${actionText}`,
      width: '17em'
    })

    if (!confim.isConfirmed) return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/category/${categoryId}`);
      if (res.data.success) {
        setIsToogleCategoryDelete(true);
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
        Render category data into table
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

    if (categories.length === 0) {
      return (
        <tr>
          <td colSpan={9} className='text-danger text-center'>No staff users found</td>
        </tr>
      )
    }

    return (
      categories.map(category => (
        <tr key={category.category_id}>
          <td>{category.category_id}</td>
          <td>{category.category_name}</td>
          <td>{category.category_type}</td>
          <td>
            <Button
              className='fw-bold'
              variant={'outline-danger'}
              size='sm'
              onClick={() => handleCategoryDelete(category.category_id)}
            >
              Delete
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
          <h4>Categories</h4>
          <Button onClick={() => navigate('/category-add')} className='btn_main_dark shadow'>
            <i className="bi bi-plus-circle me-2 fs-6"></i>
            Add New
          </Button>
        </Container>
        <Container>
          <Table responsive hover striped size='sm' className='rounded overflow-hidden shadow'>
            <thead>
              <tr className='fw-bold'>
                <th>ID</th>
                <th>Category Name</th>
                <th>Category Type</th>
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

export default CategoryManagement