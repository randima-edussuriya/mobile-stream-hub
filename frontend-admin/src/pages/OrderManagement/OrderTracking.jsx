import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Spinner,
  Badge,
} from "react-bootstrap";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

function OrderTracking() {
  const { backendUrl } = useContext(AppContext);
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trackingData, setTrackingData] = useState([]);

  /*-------------------------------------------------
        fetch order tracking
  --------------------------------------------------- */
  const fetchOrderTracking = async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(
        `${backendUrl}/api/admin/orders/${orderId}/tracking`,
      );
      setTrackingData(data.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again later.",
      );
      console.error(err);
      toast.error(
        err?.response?.data?.message || "Failed to load tracking information",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderTracking();
  }, [orderId]);

  /*-------------------------------------------------
        get badge variant based on status
  --------------------------------------------------- */
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: "dark",
      "packaging in progress": "secondary",
      "ready for pickup": "info text-dark",
      "ready for delivery": "primary",
      dispatched: "warning text-dark",
      delivered: "success",
      cancelled: "danger",
    };
    return statusMap[status] || "secondary";
  };

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

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col>
          <h4 className="text-white">Order Tracking - #{orderId}</h4>
        </Col>
        <Col className="text-end">
          <Button variant="dark" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold">
              Status History
            </Card.Header>
            <Card.Body className="p-0">
              {trackingData.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  No tracking history available for this order.
                </div>
              ) : (
                <Table hover responsive className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Status</th>
                      <th>Changed At</th>
                      <th>Changed By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trackingData.map((track) => (
                      <tr key={track.tracking_id}>
                        <td>
                          <Badge bg={getStatusBadge(track.status)}>
                            {track.status.charAt(0).toUpperCase() +
                              track.status.slice(1)}
                          </Badge>
                        </td>
                        <td>
                          {dayjs(track.changed_at).format(
                            "YYYY-MM-DD HH:mm:ss",
                          )}
                        </td>
                        <td className="fw-semibold">
                          <span>{track.changed_by_name} </span>
                          <span className="text-muted">
                            (
                            {track.changed_by_role.charAt(0).toUpperCase() +
                              track.changed_by_role.slice(1)}
                            )
                          </span>
                          <span>
                            <span> ID: </span>
                            <span className="text-muted">
                              ({track.changed_by_id})
                            </span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default OrderTracking;
