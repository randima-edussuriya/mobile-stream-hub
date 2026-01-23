import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Spinner,
  Badge,
  Button,
} from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import dayjs from "dayjs";

function RepairRequestProfile() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [repair, setRepair] = useState(null);

  /* -----------------------------------------------------------------
        Fetch repair request details from API
  -------------------------------------------------------*/
  const fetchRepairDetails = async () => {
    try {
      setLoading(true);
      setError("");
      setRepair(null);

      const { data } = await axios.get(
        `${backendUrl}/api/admin/repairs/${requestId}`,
      );
      setRepair(data.data);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to fetch repair request details. Please try again later.";
      setError(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------------------------------
        Get badge variant based on status
  -------------------------------------------------------*/
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: "warning",
      accepted: "success",
      rejected: "danger",
    };
    return statusMap[status] || "secondary";
  };

  useEffect(() => {
    fetchRepairDetails();
  }, [requestId]);

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error || !repair) {
    return (
      <Container className="mt-5">
        <Card className="border-danger">
          <Card.Body className="text-danger text-center">
            <p className="mb-3">{error || "Repair request not found"}</p>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Back to Repairs
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col>
          <h4 className="text-white">
            Repair Request #{repair.repair_requests_id}
          </h4>
        </Col>
        <Col className="text-end">
          <Button variant="dark" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Col>
      </Row>

      <Row className="g-3">
        {/* ------------------------------------------------------
                    Repair Request Details
        ---------------------------------------------------------- */}
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold">
              Repair Request Details
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Request ID</strong>
                    <p className="mb-0 fw-semibold">
                      {repair.repair_requests_id}
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Status</strong>
                    <p className="mb-0">
                      <Badge bg={getStatusBadge(repair.status)}>
                        {repair.status.charAt(0).toUpperCase() +
                          repair.status.slice(1)}
                      </Badge>
                    </p>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Appointment Date</strong>
                    <p className="mb-0 fw-semibold">
                      {dayjs(repair.appointment_date).format(
                        "YYYY-MM-DD HH:mm",
                      )}
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Created Date</strong>
                    <p className="mb-0 fw-semibold">
                      {dayjs(repair.created_at).format("YYYY-MM-DD HH:mm:ss")}
                    </p>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Updated Date</strong>
                    <p className="mb-0 fw-semibold">
                      {dayjs(repair.updated_at).format("YYYY-MM-DD HH:mm:ss")}
                    </p>
                  </div>
                </Col>
              </Row>

              <hr className="my-4" />

              <div className="mb-3">
                <strong className="text-muted">Device Information</strong>
                <p className="mb-0 fw-semibold">{repair.device_info}</p>
              </div>

              <div className="mb-3">
                <strong className="text-muted">Issue Description</strong>
                <p className="mb-0 fw-semibold">{repair.issue_description}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* -------------------------------------------------------
                    Customer Details
        ----------------------------------------------------------- */}
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold">
              Customer Information
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Customer ID</strong>
                    <p className="mb-0 fw-semibold">{repair.customer_id}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Customer Name</strong>
                    <p className="mb-0 fw-semibold">{repair.customer_name}</p>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Email</strong>
                    <p className="mb-0 fw-semibold">{repair.customer_email}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Phone</strong>
                    <p className="mb-0 fw-semibold">{repair.customer_phone}</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* ----------------------------------------------------
                    Technician Details
        -------------------------------------------------------- */}
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold">
              Assigned Technician
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Technician ID</strong>
                    <p className="mb-0 fw-semibold">{repair.technician_id}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Technician Name</strong>
                    <p className="mb-0 fw-semibold">{repair.technician_name}</p>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Email</strong>
                    <p className="mb-0 fw-semibold">
                      {repair.technician_email}
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Phone</strong>
                    <p className="mb-0 fw-semibold">
                      {repair.technician_phone}
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RepairRequestProfile;
