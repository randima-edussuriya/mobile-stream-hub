import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Badge,
  Button,
  Card,
  Spinner,
} from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);

  const { backendUrl } = useContext(AppContext);

  /*-------------------------------------------------
        fetch customer orders
  --------------------------------------------------- */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(`${backendUrl}/api/customer/orders`);
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

  useEffect(() => {
    fetchOrders();
  }, []);

  /*-------------------------------------------------
        render orders table body
  --------------------------------------------------- */
  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={6} className="text-center py-3">
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
          <td colSpan={6} className="text-danger text-center">
            {error}
          </td>
        </tr>
      );
    }

    if (orders.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="text-center py-3">
            <span className="text-muted">No orders found</span>
          </td>
        </tr>
      );
    }

    return orders.map((order) => (
      <tr key={order.order_id}>
        <td className="fw-bold">#{order.order_id}</td>
        <td className="text-muted">
          {dayjs(order.order_date).format("YYYY-MM-DD HH:mm")}
        </td>
        <td className="fw-semibold">
          Rs. {Number(order.total).toLocaleString()}
        </td>
        <td>{order.payment_method}</td>
        <td>
          <Badge bg={getStatusBadge(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </td>
        <td>
          <Link to={`/my-orders/${order.order_id}`}>
            <i
              role="button"
              title="View Details"
              className="bi-arrow-up-right-square text-primary action_icon"
            ></i>
          </Link>
        </td>
      </tr>
    ));
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h4 className="fw-semibold">My Orders</h4>
        </Col>
      </Row>

      <Card className="shadow">
        <Card.Body className="p-0">
          <div className="overflow-y-auto">
            <Table hover striped size="sm" className="mb-0">
              <thead className="position-sticky top-0" style={{ zIndex: 20 }}>
                <tr className="fw-bold bg-light">
                  <th>Order ID</th>
                  <th>Order Date</th>
                  <th>Total</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{renderTableBody()}</tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MyOrders;
