import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Badge,
  Spinner,
} from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import dayjs from "dayjs";
import { toast } from "react-toastify";

function ItemFeedbackProfile() {
  const { feedbackId } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  /* -----------------------------------------------------------------
        Fetch feedback detail
  --------------------------------------------------------------------*/
  const fetchFeedbackDetail = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(
        `${backendUrl}/api/admin/feedbacks/${feedbackId}`,
      );
      setFeedback(data.data);
      setNewStatus(data.data.status);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to fetch feedback detail. Please try again later.";
      setError(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------------------------------
        Get badge variant based on status
  --------------------------------------------------- */
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: "secondary",
      accepted: "success",
      rejected: "danger",
    };
    return statusMap[status] || "secondary";
  };

  /* -----------------------------------------------------------------
        Get rating color based on value
  --------------------------------------------------- */
  const getRatingColor = (rating) => {
    const rate = Number(rating);
    if (rate >= 4.5) return "success";
    if (rate >= 3.5) return "warning text-dark";
    return "danger";
  };

  /* -----------------------------------------------------------------
        Feedback status options
  --------------------------------------------------- */
  const feedbackStatuses = ["pending", "accepted", "rejected"];

  /* -----------------------------------------------------------------
        Update feedback status
  --------------------------------------------------- */
  const handleStatusChange = async (status) => {
    if (status === feedback.status) {
      toast.info("No changes detected in status");
      return;
    }

    try {
      setUpdating(true);
      await axios.put(
        `${backendUrl}/api/admin/feedbacks/${feedbackId}/status`,
        { status },
      );
      fetchFeedbackDetail();
      toast.success("Feedback status updated successfully.");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to update feedback status. Please try again later.";
      toast.error(message);
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (feedbackId) {
      fetchFeedbackDetail();
    }
  }, [feedbackId]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" />
      </Container>
    );
  }

  if (error || !feedback) {
    return (
      <Container className="py-5">
        <Row>
          <Col>
            <div className="alert alert-danger" role="alert">
              {error || "Feedback not found"}
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate("/feedback-management")}
            >
              Back to Feedbacks
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col>
          <h4 className="text-white">Feedback #{feedback.feedback_id}</h4>
        </Col>
        <Col className="text-end">
          <Button
            variant="dark"
            onClick={() => navigate("/feedback-management")}
          >
            Back
          </Button>
        </Col>
      </Row>

      <Row className="g-3">
        {/* ------------------------------------------------
                    Feedback Summary
        ---------------------------------------------------- */}
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold">
              Feedback Summary
            </Card.Header>
            <Card.Body>
              <Row className="g-2">
                <Col xs={12} md={6}>
                  <p className="mb-2">
                    <strong>Feedback ID:</strong> {feedback.feedback_id}
                  </p>
                  <p className="mb-2">
                    <strong>Feedback Date:</strong>{" "}
                    {dayjs(feedback.feedback_date).format(
                      "YYYY-MM-DD HH:mm:ss",
                    )}
                  </p>
                  <p className="mb-2">
                    <strong>Rating:</strong>{" "}
                    <Badge bg={getRatingColor(feedback.rating)}>
                      {Number(feedback.rating).toFixed(1)}
                    </Badge>
                  </p>
                  <p className="mb-0">
                    <strong>Current Status:</strong>{" "}
                    <Badge bg={getStatusBadge(feedback.status)}>
                      {feedback.status.charAt(0).toUpperCase() +
                        feedback.status.slice(1)}
                    </Badge>
                  </p>
                </Col>
                <Col xs={12} md={6}>
                  <p className="mb-2">
                    <strong>Item Name:</strong> {feedback.item_name}
                  </p>
                  <p className="mb-2">
                    <strong>Item Brand:</strong> {feedback.item_brand}
                  </p>
                  <p className="mb-2">
                    <strong>Customer:</strong> {feedback.customer_name}
                  </p>
                  <p className="mb-2">
                    <strong>Customer ID:</strong> {feedback.customer_id}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* ------------------------------------------------
                    Feedback Message
        ---------------------------------------------------- */}
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold">
              Feedback Message
            </Card.Header>
            <Card.Body>
              <p className="text-wrap">{feedback.message}</p>
            </Card.Body>
          </Card>
        </Col>

        {/* ------------------------------------------------
                    Status Management
        ---------------------------------------------------- */}
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold">
              Status Management
            </Card.Header>
            <Card.Body>
              <Row className="g-3 align-items-end">
                <Col md={6}>
                  <Form.Group controlId="feedbackStatus">
                    <Form.Label className="fw-semibold">
                      Update Status
                    </Form.Label>
                    <Form.Select
                      value={newStatus}
                      size="sm"
                      onChange={(e) => setNewStatus(e.target.value)}
                      disabled={updating}
                    >
                      {feedbackStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Button
                    variant="none"
                    size="sm"
                    disabled={newStatus === feedback.status || updating}
                    onClick={() => handleStatusChange(newStatus)}
                    className="btn_main_dark"
                  >
                    {updating ? "Updating..." : "Update Status"}
                  </Button>
                </Col>
              </Row>
              {feedback.managed_by_name && (
                <div className="mt-3 pt-3 border-top">
                  <p className="text-muted mb-0">
                    <small>
                      <strong>Last Managed By:</strong>{" "}
                      {feedback.managed_by_name}
                      <strong> ID:</strong> {feedback.managed_by_id}
                    </small>
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ItemFeedbackProfile;
