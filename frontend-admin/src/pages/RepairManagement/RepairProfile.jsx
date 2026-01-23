import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

function RepairProfile() {
  const { repairId } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [repair, setRepair] = useState(null);

  /* -----------------------------------------------------------------
        Fetch repair detail
  --------------------------------------------------------------------*/
  const fetchRepairDetail = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(
        `${backendUrl}/api/admin/repairs/records/${repairId}`,
      );
      setRepair(data.data);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to fetch repair detail. Please try again later.";
      setError(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      "diagnostics completed": "primary",
      "repair in progress": "warning",
      "repair completed": "success",
    };
    return map[status] || "secondary";
  };

  useEffect(() => {
    fetchRepairDetail();
  }, [repairId]);

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
            <p className="mb-3">{error || "Repair not found"}</p>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Back
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
          <h4 className="text-white">Repair #{repair.repair_id}</h4>
        </Col>
        <Col className="text-end">
          <Button variant="dark" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Col>
      </Row>

      <Row className="g-3">
        {/* Repair Summary */}
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold">
              Repair Summary
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <p className="mb-2">
                    <strong>Repair ID:</strong> {repair.repair_id}
                  </p>
                  <p className="mb-2">
                    <strong>Request ID:</strong> {repair.repair_requests_id}
                  </p>
                </Col>
                <Col md={4}>
                  <p className="mb-2">
                    <strong>Status:</strong>{" "}
                    <Badge bg={getStatusBadge(repair.repair_status)}>
                      {repair.repair_status}
                    </Badge>
                  </p>
                  <p className="mb-2">
                    <strong>Total Cost:</strong> Rs.{" "}
                    {Number(repair.total_cost).toLocaleString()}
                  </p>
                </Col>
                <Col md={4}>
                  <p className="mb-2">
                    <strong>Appointment:</strong>{" "}
                    {dayjs(repair.appointment_date).format("YYYY-MM-DD HH:mm")}
                  </p>
                  <p className="mb-2">
                    <strong>Request Status:</strong> {repair.request_status}
                  </p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Identified Issue</strong>
                    <p className="mb-0 fw-semibold">
                      {repair.identified_issue}
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Identified Device</strong>
                    <p className="mb-0 fw-semibold">
                      {repair.identified_device}
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Request Details */}
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold">
              Original Request
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Issue Description</strong>
                    <p className="mb-0 fw-semibold">
                      {repair.issue_description}
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Device Info</strong>
                    <p className="mb-0 fw-semibold">{repair.device_info}</p>
                  </div>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Created At</strong>
                    <p className="mb-0 fw-semibold">
                      {dayjs(repair.request_created_at).format(
                        "YYYY-MM-DD HH:mm:ss",
                      )}
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Updated At</strong>
                    <p className="mb-0 fw-semibold">
                      {dayjs(repair.request_updated_at).format(
                        "YYYY-MM-DD HH:mm:ss",
                      )}
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Customer Info */}
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold">
              Customer Information
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p className="mb-2">
                    <strong>Customer ID:</strong> {repair.customer_id}
                  </p>
                  <p className="mb-2">
                    <strong>Name:</strong> {repair.customer_name}
                  </p>
                </Col>
                <Col md={6}>
                  <p className="mb-2">
                    <strong>Email:</strong> {repair.customer_email}
                  </p>
                  <p className="mb-0">
                    <strong>Phone:</strong> {repair.customer_phone}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Technician Info */}
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold">
              Technician Information
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p className="mb-2">
                    <strong>Technician ID:</strong> {repair.technician_id}
                  </p>
                  <p className="mb-2">
                    <strong>Name:</strong> {repair.technician_name}
                  </p>
                </Col>
                <Col md={6}>
                  <p className="mb-2">
                    <strong>Email:</strong> {repair.technician_email}
                  </p>
                  <p className="mb-0">
                    <strong>Phone:</strong> {repair.technician_phone}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RepairProfile;
