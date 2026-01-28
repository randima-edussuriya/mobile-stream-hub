import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Form,
} from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import ErrorProvider from "../../components/ErrorProvider";
import Loader from "../../components/Loader";
import dayjs from "dayjs";
import { confirmAction } from "../../utils/confirmAction";

const OrderDetails = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const { backendUrl } = useContext(AppContext);
  const { orderId } = useParams();
  const navigate = useNavigate();

  /*-------------------------------------------------
        fetch order details
  --------------------------------------------------- */
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(
        `${backendUrl}/api/customer/orders/${orderId}`,
      );
      setOrderData(data.data);
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
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  /*-------------------------------------------------
        render content based on state
  --------------------------------------------------- */
  const renderContent = () => {
    if (loading) return <Loader />;
    if (error) return <ErrorProvider errorMessage={error} />;
    if (!orderData) return null;

    const isPending = orderData.status === "pending";
    const isOnlinePayment = orderData.payment_method === "online";

    const handleCancel = async () => {
      const result = await confirmAction();
      if (!result.isConfirmed) return;
      try {
        setError("");
        await axios.put(`${backendUrl}/api/customer/orders/${orderId}/cancel`, {
          reason: cancelReason.trim(),
        });
        fetchOrderDetails();
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Something went wrong. Please try again later.",
        );
        console.error(err);
      }
    };

    return (
      <Row className="g-3">
        {/* --------------------------------------
              Order Summary
        ------------------------------------------ */}
        <Col md={12}>
          <Card>
            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Order Summary</h5>
              <div>
                <strong>Total Amount:</strong>{" "}
                <span className="h5 fw-bold">
                  Rs. {Number(orderData.total).toLocaleString()}
                </span>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p className="mb-2">
                    <strong>Order ID:</strong> #{orderData.order_id}
                  </p>
                  <p className="mb-2">
                    <strong>Order Date:</strong>{" "}
                    {dayjs(orderData.order_date).format("YYYY-MM-DD HH:mm:ss")}
                  </p>
                  <p className="mb-2">
                    <strong>Order Status:</strong>{" "}
                    <Badge bg={getStatusBadge(orderData.status)}>
                      {orderData.status.charAt(0).toUpperCase() +
                        orderData.status.slice(1)}
                    </Badge>
                  </p>
                </Col>
                <Col md={6}>
                  <p className="mb-2">
                    <strong>Payment Method:</strong> {orderData.payment_method}
                  </p>
                  <p className="mb-2">
                    <strong>Payment Status:</strong>{" "}
                    <Badge bg="secondary">
                      {orderData.payment_status.charAt(0).toUpperCase() +
                        orderData.payment_status.slice(1)}
                    </Badge>
                  </p>
                  <p className="mb-2">
                    <strong>Payment Date:</strong>{" "}
                    {orderData.payment_date
                      ? dayjs(orderData.payment_date).format(
                          "YYYY-MM-DD HH:mm:ss",
                        )
                      : "N/A"}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* --------------------------------------
              Delivery Information
        ------------------------------------------ */}
        <Col md={12}>
          <Card>
            <Card.Header className="bg-light">
              <h5 className="mb-0">Delivery Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p className="mb-2">
                    <strong>Contact Name:</strong> {orderData.contact_name}
                  </p>
                  <p className="mb-2">
                    <strong>Phone Number:</strong> {orderData.phone_number}
                  </p>
                  <p className="mb-2">
                    <strong>Address:</strong>{" "}
                    {`${orderData.street_address}, ${orderData.city}`}
                  </p>
                </Col>
                <Col md={6}>
                  <p className="mb-2">
                    <strong>District:</strong> {orderData.district}
                  </p>
                  <p className="mb-2">
                    <strong>Province:</strong> {orderData.province}
                  </p>
                  <p className="mb-0">
                    <strong>Zip Code:</strong> {orderData.zip_code}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* --------------------------------------
              Order Items
        ------------------------------------------ */}
        <Col md={12}>
          <Card>
            <Card.Header className="bg-light">
              <h5 className="mb-0">Order Items</h5>
            </Card.Header>
            <Card.Body>
              <Table hover responsive className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Item Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Discount</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <Link
                          to={`/products/${item.item_id}`}
                          className="text-decoration-none fw-medium"
                        >
                          <span>{item.name}</span>
                        </Link>
                      </td>
                      <td>Rs. {Number(item.item_price).toLocaleString()}</td>
                      <td>{item.item_quantity}</td>
                      <td>{Number(item.discount)}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* --------------------------------------
              Order cancellation
        ------------------------------------------ */}
        {orderData.status !== "cancelled" && (
          <Col md={12}>
            <Card>
              <Card.Header className="bg-danger-subtle d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Order Cancellation</h5>
              </Card.Header>
              <Card.Body>
                {isOnlinePayment || !isPending ? (
                  <>
                    <div className="text-danger mt-1">
                      Only pending orders can be cancelled.
                    </div>
                    <div className="text-danger mt-1">
                      Online payment orders cannot be cancelled here. Please
                      contact support for assistance.
                    </div>
                  </>
                ) : (
                  <Form className="d-flex flex-column gap-3">
                    <Form.Group controlId="cancelReason">
                      <Form.Label>Reason for cancellation</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Describe why you want to cancel this order"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-end">
                      <Button
                        variant="danger"
                        disabled={!cancelReason.trim()}
                        onClick={handleCancel}
                      >
                        Cancel Order
                      </Button>
                    </div>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    );
  };

  return (
    <Container className="mt-5">
      <Row className="mb-3">
        <Col>
          <h3 className="fw-semibold">Order Details</h3>
        </Col>
        {/* Back Button */}
        <Col xs="auto">
          <Button
            variant="none"
            className="btn_main_dark"
            onClick={() => navigate("/my-orders")}
          >
            Back to Orders
          </Button>
        </Col>
      </Row>

      {renderContent()}
    </Container>
  );
};

export default OrderDetails;
