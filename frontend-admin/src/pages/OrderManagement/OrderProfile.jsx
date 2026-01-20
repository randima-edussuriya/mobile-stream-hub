import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const OrderProfile = () => {
  const { backendUrl } = useContext(AppContext);
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [paymentDateValue, setPaymentDateValue] = useState("");

  /*-------------------------------------------------
        fetch order details
  --------------------------------------------------- */
  const fetchOrderDetails = async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(
        `${backendUrl}/api/admin/orders/${orderId}`,
      );
      setOrderData(data.data);
      setPaymentDateValue(
        data.data.payment_date
          ? dayjs(data.data.payment_date).format("YYYY-MM-DD HH:mm:ss")
          : "",
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again later.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /*-------------------------------------------------
        update order payment date
  --------------------------------------------------- */
  const updateOrderPaymentDate = async () => {
    // Validate payment date
    if (!paymentDateValue) {
      toast.error("Please select a payment date");
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `${backendUrl}/api/admin/orders/${orderId}/payment-date`,
        {
          paymentDate: paymentDateValue,
        },
      );
      toast.success("Payment date updated successfully");
      fetchOrderDetails();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update payment date",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /*-------------------------------------------------
        update order status
  --------------------------------------------------- */
  const updateOrderStatus = async (newStatus) => {
    try {
      setLoading(true);
      await axios.put(`${backendUrl}/api/admin/orders/${orderId}/status`, {
        status: newStatus,
      });
      toast.success("Order status updated successfully");
      fetchOrderDetails();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update order status",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /*-------------------------------------------------
        update payment status
  --------------------------------------------------- */
  const updatePaymentStatus = async (newPaymentStatus) => {
    try {
      setLoading(true);
      await axios.put(
        `${backendUrl}/api/admin/orders/${orderId}/payment-status`,
        {
          paymentStatus: newPaymentStatus,
        },
      );
      toast.success("Payment status updated successfully");
      fetchOrderDetails();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update payment status",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const statusOptions = [
    "pending",
    "packaging in progress",
    "ready for pickup",
    "ready for delivery",
    "dispatched",
    "delivered",
  ];

  const paymentOptions = ["pending", "paid", "failed", "refunded"];

  /*-------------------------------------------------
        content render helpers
  --------------------------------------------------- */
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center text-danger">{error}</Container>
    );
  }

  if (!orderData) return null;

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col>
          <h4 className="text-white">Order #{orderData.order_id}</h4>
        </Col>
        <Col className="text-end">
          <Button variant="dark" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Col>
      </Row>

      <Row className="g-3">
        {/* ------------------------------------------------
                    Order Summary
        ---------------------------------------------------- */}
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold">
              Order Summary
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="mb-3">
                  <p className="mb-2">
                    <strong>Order Date:</strong>{" "}
                    {dayjs(orderData.order_date).format("YYYY-MM-DD HH:mm:ss")}
                  </p>
                  <p className="mb-2">
                    <strong>Customer ID:</strong> {orderData.customer_id}
                  </p>
                  <p className="mb-2">
                    <strong>Payment Method:</strong> {orderData.payment_method}
                  </p>
                  <p className="mb-0">
                    <strong>Total: </strong>
                    <span className="text-primary h5 fw-bold">{`Rs. ${Number(orderData.total).toLocaleString()}`}</span>
                  </p>
                </Col>
                <Col md={8}>
                  <Row className="g-3">
                    <Col sm={6}>
                      <Form.Group controlId="orderStatus">
                        <Form.Label className="fw-semibold">
                          Order Status
                        </Form.Label>
                        <Form.Select
                          value={orderData.status}
                          onChange={(e) => {
                            updateOrderStatus(e.target.value);
                          }}
                          disabled={loading}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group controlId="paymentStatus">
                        <Form.Label className="fw-semibold">
                          Payment Status
                        </Form.Label>
                        <Form.Select
                          value={orderData.payment_status}
                          onChange={(e) => {
                            updatePaymentStatus(e.target.value);
                          }}
                          disabled={loading}
                        >
                          {paymentOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mt-3 align-items-center">
                    <Col xs="auto">
                      <Form.Label className="fw-semibold mb-0">
                        Payment Date
                      </Form.Label>
                    </Col>
                    <Col>
                      <Form.Control
                        type="datetime-local"
                        step="1"
                        value={paymentDateValue}
                        onChange={(e) =>
                          setPaymentDateValue(
                            dayjs(e.target.value).format("YYYY-MM-DD HH:mm:ss"),
                          )
                        }
                        disabled={loading}
                      />
                    </Col>
                    <Col xs="auto">
                      <Button
                        variant="none"
                        size="sm"
                        className="btn_main_dark"
                        onClick={() => updateOrderPaymentDate()}
                        disabled={loading}
                      >
                        Update Payment Date
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* ------------------------------------------------
                    Delivery Information
        ---------------------------------------------------- */}
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold">
              Delivery Information
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

        {/* ------------------------------------------------
                    Order Items
        ---------------------------------------------------- */}
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold">
              Order Items
            </Card.Header>
            <Card.Body className="p-0">
              <Table hover responsive className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Discount</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.items?.map((item) => (
                    <tr key={item.item_id}>
                      <td className="fw-semibold">{item.name}</td>
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
      </Row>
    </Container>
  );
};

export default OrderProfile;
