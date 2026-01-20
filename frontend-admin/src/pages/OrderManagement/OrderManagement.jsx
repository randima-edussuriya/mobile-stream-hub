import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Table, Spinner, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import dayjs from "dayjs";

function OrderManagement() {
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);

  const { backendUrl } = useContext(AppContext);

  const navigate = useNavigate();

  /* -----------------------------------------------------------------
        Fetch orders from API
  --------------------------------------------------------------------*/
  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    setOrders([]);
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/orders`);
      setOrders(data.data);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again later.",
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /*-------------------------------------------------
        get badge variant based on status
  --------------------------------------------------- */
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: "dark",
      "packaging in progress": "secondary",
      "ready for pickup": "primary",
      "ready for delivery": "primary",
      dispatched: "warning",
      delivered: "success",
      cancelled: "danger",
    };
    return statusMap[status] || "secondary";
  };

  /* -----------------------------------------------------------------
        Render orders data into table
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

    if (orders.length === 0) {
      return (
        <tr>
          <td colSpan={11} className="text-danger text-center">
            No orders found
          </td>
        </tr>
      );
    }

    return orders.map((order) => (
      <tr key={order.order_id}>
        <td className="fw-bold">{order.order_id}</td>
        <td className="text-muted">{dayjs(order.order_date).format("YYYY-MM-DD HH:mm:ss")}</td>
        <td className="fw-semibold">{Number(order.total).toLocaleString()}</td>
        <td>
          <Badge bg={getStatusBadge(order.status)}>{order.status}</Badge>
        </td>
        <td>{order.payment_method}</td>
        <td>{order.customer_id}</td>
        <td>
          <div className="d-flex gap-3 align-items-center">
            <i
              role="button"
              className="bi-arrow-up-right-square text-primary action_icon"
              onClick={() => navigate(`profile/${order.order_id}`)}
            ></i>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <Container>
      <Container className="bg-secondary-subtle rounded shadow py-3 mt-3">
        <Container className="mb-3">
          <h4>Orders</h4>
        </Container>
        <Container className="overflow-y-auto" style={{ maxHeight: "75vh" }}>
          <Table hover striped size="sm" className="shadow">
            <thead className="position-sticky top-0" style={{ zIndex: 20 }}>
              <tr className="fw-bold">
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment Method</th>
                <th>Customer ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </Table>
        </Container>
      </Container>
    </Container>
  );
}

export default OrderManagement;
