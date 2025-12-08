import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Table, Badge, Spinner } from "react-bootstrap";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

function CustomerManagement() {
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customers, setCustomers] = useState([]);
  const [isToogleCustomerStatus, setIsToogleCustomerStatus] = useState(false);

  const { backendUrl } = useContext(AppContext);

  const navigate = useNavigate();

  /* -----------------------------------------------------------------
        Handle customer activity status change
  --------------------------------------------------------------------*/
  const handleStatusChange = async (customerId, isActive) => {
    const actionText = isActive ? "activate" : "deactivate";

    const confim = await Swal.fire({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
        title: "h5",
      },
      title: `Are you sure to  ${actionText} this customer?`,
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
    });

    if (!confim.isConfirmed) return;

    try {
      await axios.put(
        `http://localhost:5000/api/admin/customers/${customerId}/status`,
        { isActive }
      );
      setIsToogleCustomerStatus(true);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      console.error(error);
    }
  };

  /* -----------------------------------------------------------------
        Fetch customer users from API
  --------------------------------------------------------------------*/
  const fetchCustomers = async () => {
    setLoading(true);
    setError("");
    setCustomers([]);
    setIsToogleCustomerStatus(false);
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/customers`);
      setCustomers(data.data);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCustomers();
  }, [isToogleCustomerStatus]);

  /* -----------------------------------------------------------------
        Render customer user data into table
  --------------------------------------------------------------------*/
  const renderTableBody = () => {
    if (Loading) {
      return (
        <tr>
          <td colSpan={11} className="text-center py-3">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={11} className="text-danger text-center">
            {error}
          </td>
        </tr>
      );
    }

    if (customers.length === 0) {
      return (
        <tr>
          <td colSpan={11} className="text-danger text-center">
            No customers found
          </td>
        </tr>
      );
    }

    return customers.map((customer) => (
      <tr key={customer.customer_id}>
        <td>{customer.customer_id}</td>
        <td>
          <strong>
            {customer.first_name} {customer.last_name}
          </strong>
          <div className="text-muted small">{customer.email}</div>
        </td>
        <td>{customer.phone_number}</td>
        <td>{customer.address}</td>
        <td>{dayjs(customer.created_at).format("YYYY-MM-DD HH:mm:ss")}</td>
        <td>
          <Badge bg={customer.is_active ? "success" : "danger"}>
            {customer.is_active ? "Active" : "Deactive"}
          </Badge>
        </td>
        <td>
          <Button
            className="fw-semibold border-2"
            variant={customer.is_active ? "outline-danger" : "outline-success"}
            size="sm"
            onClick={() =>
              handleStatusChange(customer.customer_id, !customer.is_active)
            }
          >
            {customer.is_active ? "Deactivate" : "Active"}
          </Button>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <Container className="bg-secondary-subtle rounded shadow_white py-3 mt-3">
        <Container>
          <h4>Customers</h4>
        </Container>
        <Container className="overflow-y-auto" style={{ maxHeight: "78vh" }}>
          <Table hover striped size="sm" className="shadow">
            <thead className="position-sticky top-0" style={{ zIndex: 20 }}>
              <tr className="fw-bold">
                <th>ID</th>
                <th>Name/ E-mail</th>
                <th>Phone No</th>
                <th>Address</th>
                <th>Created Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </Table>
        </Container>
      </Container>
    </>
  );
}

export default CustomerManagement;
