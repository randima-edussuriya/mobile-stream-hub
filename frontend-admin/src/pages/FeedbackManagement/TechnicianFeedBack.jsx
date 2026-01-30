import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
  Table,
} from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import dayjs from "dayjs";

function TechnicianFeedBack() {
  const { technicianId } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [technicianName, setTechnicianName] = useState("");

  /* -----------------------------------------------------------------
        Fetch technician feedback
  --------------------------------------------------------------------*/
  const fetchTechnicianFeedbacks = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(
        `${backendUrl}/api/admin/feedbacks/technicians/${technicianId}`,
      );
      setFeedbacks(data.data || []);
      setTechnicianName(data.data[0].technician_name || "");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to fetch technician feedback. Please try again later.";
      setError(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    if (technicianId) {
      fetchTechnicianFeedbacks();
    }
  }, [technicianId]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" />
      </Container>
    );
  }

  if (error || !feedbacks) {
    return (
      <Container className="py-5">
        <Row>
          <Col>
            <div className="alert alert-danger" role="alert">
              {error || "Feedbacks not found"}
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
          <h4 className="text-white">
            <span>Feedbacks for Technician </span>
            <small className="text-info fw-semibold">
              (ID: {technicianId} - {technicianName})
            </small>
          </h4>
        </Col>
        <Col className="text-end">
          <Button
            variant="dark"
            onClick={() => navigate("/feedback-management/technician-listing")}
          >
            Back
          </Button>
        </Col>
      </Row>

      {feedbacks.length === 0 ? (
        <Row>
          <Col>
            <Card className="shadow-sm">
              <Card.Body className="text-center py-5">
                <p className="text-muted mb-0">
                  No feedbacks found for this technician
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row className="g-3">
          <Col md={12}>
            <Card className="shadow-sm">
              <Card.Header className="bg-secondary-subtle fw-semibold">
                All Feedbacks ({feedbacks.length})
              </Card.Header>
              <Card.Body className="p-0">
                <div className="overflow-x-auto">
                  <Table hover striped size="sm" className="mb-0">
                    <thead>
                      <tr className="fw-bold small">
                        <th>Feedback ID</th>
                        <th>Date</th>
                        <th>Repair ID</th>
                        <th>Customer ID</th>
                        <th>Customer</th>
                        <th>Rating</th>
                        <th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedbacks.map((feedback) => (
                        <tr key={feedback.feedback_id}>
                          <td className="fw-bold">{feedback.feedback_id}</td>
                          <td className="text-muted small">
                            {dayjs(feedback.feedback_date).format(
                              "YYYY-MM-DD HH:mm:ss",
                            )}
                          </td>
                          <td className="fw-semibold">{feedback.repair_id}</td>
                          <td className="text-primary fw-semibold">
                            {feedback.customer_id}
                          </td>
                          <td className="text-muted small">
                            {feedback.customer_name}
                          </td>
                          <td>
                            <Badge bg={getRatingColor(feedback.rating)}>
                              {Number(feedback.rating).toFixed(1)}
                            </Badge>
                          </td>
                          <td>{feedback.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default TechnicianFeedBack;
