import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  Container,
  Card,
  Spinner,
  Badge,
  Row,
  Col,
  Button,
  Alert,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import dayjs from "dayjs";

function RepairRequestProfile() {
  const [repairRequest, setRepairRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { backendUrl } = useContext(AppContext);
  const { requestId } = useParams();
  const navigate = useNavigate();

  /* -----------------------------------------------------------------
        Fetch repair request details on component mount
  --------------------------------------------------------------------*/
  useEffect(() => {
    fetchRepairRequestDetail();
  }, [requestId]);

  const fetchRepairRequestDetail = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/customer/repair/requests/${requestId}`,
      );
      setRepairRequest(data.data);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        "Failed to fetch repair request details. Please try again.";
      setError(errorMsg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------------------------------
        Get status badge variant
  --------------------------------------------------------------------*/
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: "warning",
      accepted: "success",
      rejected: "danger",
    };
    return statusMap[status] || "secondary";
  };

  if (loading) {
    return (
      <Container className="py-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error || !repairRequest) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error || "Repair request not found"}</Alert>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate("/repair/my-requests")}
        >
          Back to Requests
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h4 className="fw-semibold">
            Repair Request #{repairRequest.repair_requests_id}
          </h4>
        </Col>
        {/* Back Button */}
        <Col xs="auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/repair/my-requests")}
          >
            Back to Requests
          </Button>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          {/* --------------------------------------------------------
                    Request Details
        ------------------------------------------------------------ */}
          <Card className="shadow mb-4">
            <Card.Header className="bg-light">
              <h6 className="mb-0 fw-bold text-muted">Request Details</h6>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <h6 className="text-muted mb-1">Status</h6>
                  <Badge bg={getStatusBadge(repairRequest.status)}>
                    {repairRequest.status.charAt(0).toUpperCase() +
                      repairRequest.status.slice(1)}
                  </Badge>
                </Col>
                <Col md={6}>
                  <h6 className="text-muted mb-1">Created Date</h6>
                  <p className="mb-0">
                    {dayjs(repairRequest.created_at).format(
                      "YYYY-MM-DD HH:mm:ss",
                    )}
                  </p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <h6 className="text-muted mb-1">Appointment Date</h6>
                  <p className="mb-0">
                    {dayjs(repairRequest.appointment_date).format(
                      "YYYY-MM-DD HH:mm",
                    )}
                  </p>
                </Col>
                <Col md={6}>
                  <h6 className="text-muted mb-1">Last Updated</h6>
                  <p className="mb-0">
                    {dayjs(repairRequest.updated_at).format(
                      "YYYY-MM-DD HH:mm:ss",
                    )}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* --------------------------------------------------------
                    Issue & Device Information
            ------------------------------------------------------------ */}
          <Card className="shadow mb-4">
            <Card.Header className="bg-light">
              <h6 className="mb-0 fw-bold text-muted">
                Issue & Device Information
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6 className="text-muted mb-2">Issue Description</h6>
                <p className="border-start ps-3">
                  {repairRequest.issue_description}
                </p>
              </div>

              <div>
                <h6 className="text-muted mb-2">Device Information</h6>
                <p className="border-start ps-3">{repairRequest.device_info}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* --------------------------------------------------------
                    Technician Information
        ------------------------------------------------------------ */}
        <Col lg={4}>
          <Card className="shadow">
            <Card.Header className="bg-light">
              <h6 className="mb-0 fw-bold text-muted">
                Technician Information
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6 className="text-muted mb-2">Technician Name</h6>
                <p className="fw-semibold mb-0">
                  {repairRequest.technician_name}
                </p>
              </div>

              <div className="mb-3">
                <h6 className="text-muted mb-2">Email</h6>
                <p className="mb-0">
                  <a href={`mailto:${repairRequest.technician_email}`}>
                    {repairRequest.technician_email}
                  </a>
                </p>
              </div>

              <div>
                <h6 className="text-muted mb-2">Phone</h6>
                <p className="mb-0">
                  <a href={`tel:${repairRequest.technician_phone}`}>
                    {repairRequest.technician_phone}
                  </a>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RepairRequestProfile;
