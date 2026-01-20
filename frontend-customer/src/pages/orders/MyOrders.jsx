import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Table, Badge, Button } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import ErrorProvider from "../../components/ErrorProvider";
import Loader from "../../components/Loader";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const [loading, setLoading] = useState(false);
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
        render empty orders
  --------------------------------------------------- */
  const renderEmptyOrders = () => (
    <div className="text-center py-5">
      <p className="text-muted mb-3">No orders found</p>
      <p className="text-secondary small">
        You haven't placed any orders yet. Start shopping now!
      </p>
    </div>
  );

  /*-------------------------------------------------
        render orders table
  --------------------------------------------------- */
  const renderOrdersTable = () => (
    <Table hover responsive className="align-middle">
      <thead className="table-light">
        <tr>
          <th>Order ID</th>
          <th>Order Date</th>
          <th>Total</th>
          <th>Payment Method</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.order_id}>
            <td className="fw-semibold">#{order.order_id}</td>
            <td>{dayjs(order.order_date).format("YYYY-MM-DD HH:mm:ss")}</td>
            <td className="fw-semibold">
              Rs. {Number(order.total).toLocaleString()}
            </td>
            <td>{order.payment_method}</td>
            <td>
              <Badge bg={getStatusBadge(order.status)}>{order.status}</Badge>
            </td>
            <td>
              <Button
                variant="none"
                size="sm"
                className="btn_main_dark"
                as={Link}
                to={`/my-orders/${order.order_id}`}
              >
                View
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  /*-------------------------------------------------
        render content based on state
  --------------------------------------------------- */
  const renderContent = () => {
    if (loading) return <Loader />;
    if (error) return <ErrorProvider errorMessage={error} />;
    if (orders.length === 0) return renderEmptyOrders();
    return renderOrdersTable();
  };

  return (
    <Container className="mt-5">
      <Row className="mb-3">
        <Col>
          <h3 className="fw-semibold">My Orders</h3>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="bg-white p-4 rounded">{renderContent()}</div>
        </Col>
      </Row>
    </Container>
  );
};

export default MyOrders;
