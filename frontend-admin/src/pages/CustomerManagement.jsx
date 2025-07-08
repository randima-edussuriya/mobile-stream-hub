import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Container, Table, Badge, Spinner } from 'react-bootstrap'
import { format } from 'date-fns';

function CustomerManagement() {
    const [Loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            setError('');
            setCustomers([]);
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
    }, [])

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
            customers.map(customer => {
                const localDate = new Date(customer.created_at);
                return (
                    <tr key={customer.customer_id}>
                        <td>{customer.customer_id}</td>
                        <td>{customer.first_name}</td>
                        <td>{customer.last_name}</td>
                        <td>{customer.email}</td>
                        <td>{customer.phone_number}</td>
                        <td>{customer.address}</td>
                        <td>{format(localDate, 'yyyy-MM-dd HH:mm:ss')}</td>
                        {customer.is_active === 1 ? (
                            <>
                                <td><Badge bg="success">Active</Badge></td>
                                <td>
                                    <Button variant='outline-danger' size='sm'>Deactivate</Button>
                                </td>
                            </>
                        ) : (
                            <>
                                <td><Badge bg="danger">Deactive</Badge></td>
                                <td>
                                    <Button variant='outline-success' size='sm'>Active</Button>
                                </td>
                            </>
                        )}

                    </tr>
                )
            })
        )
    }

    return (
        <>
            <Container className='bg-body-tertiary rounded shadow_white py-3'>
                <Container>
                    <h4>Customers</h4>
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
                            {/* <tr>
                                <td>Sample data</td>
                                <td>Sample data</td>
                                <td>Sample data</td>
                                <td>Sample data</td>
                                <td>Sample data</td>
                                <td>Sample data</td>
                                <td>Sample data</td>
                                <td><Badge bg="success">Active</Badge></td>
                                <td>
                                    <Button variant='outline-danger' size='sm'>Deactivate</Button>
                                </td>
                            </tr> */}
                            {/*                             
                            <tr>
                                <td>Sample data</td>
                                <td>Sample data</td>
                                <td>Sample data</td>
                                <td>Sample data</td>
                                <td>Sample data</td>
                                <td>Sample data</td>
                                <td>Sample data</td>
                                
                            </tr> */}
                            {renderTableBody()}
                        </tbody>
                    </Table>
                </Container>
            </Container>
        </>
    )
}

export default CustomerManagement