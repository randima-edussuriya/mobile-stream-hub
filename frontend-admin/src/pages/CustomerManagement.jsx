import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Table, Spinner, Form } from "react-bootstrap";
import dayjs from "dayjs";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useUserAction } from "../hooks/useUserAction";

function CustomerManagement() {
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customers, setCustomers] = useState([]);
  const [isToogleCustomerStatus, setIsToogleCustomerStatus] = useState(false);

  const { backendUrl } = useContext(AppContext);

  const { handleStatusChange } = useUserAction(backendUrl);

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
          <Form.Check
            type="switch"
            name="is_active"
            id="is_active"
            checked={customer.is_active}
            onChange={() =>
              handleStatusChange(
                "customer",
                customer.customer_id,
                !customer.is_active,
                () => setIsToogleCustomerStatus((prev) => !prev)
              )
            }
            label={
              <span
                className={`fw-semibold ${
                  customer.is_active ? "text-success" : "text-danger"
                }`}
              >
                {customer.is_active ? "Active" : "Inactive"}
              </span>
            }
          />
        </td>
      </tr>
    ));
  };

  return (
    <>
      <Container className="bg-secondary-subtle rounded shadow py-3 mt-3">
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
