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

function RepairProfile() {
  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { backendUrl } = useContext(AppContext);
  const { repairId } = useParams();
  const navigate = useNavigate();

  /* -----------------------------------------------------------------
        Fetch repair details on component mount
  --------------------------------------------------------------------*/
  useEffect(() => {
    fetchRepairDetail();
  }, [repairId]);

  const fetchRepairDetail = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/customer/repair/repairs/${repairId}`,
      );
      setRepair(data.data);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        "Failed to fetch repair details. Please try again.";
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
      "diagnostics completed": "primary",
      "repair in progress": "warning",
      "repair completed": "success",
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

  if (error || !repair) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error || "Repair not found"}</Alert>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Back to Repairs
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h3 className="fw-bold">Repair #{repair.repair_id}</h3>
        </Col>
        {/* Back Button */}
        <Col xs="auto">
          <Button
            variant="none"
            className="btn_main_dark"
            onClick={() => navigate(-1)}
          >
            Back to Repairs
          </Button>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          {/* --------------------------------------------------------
                    Repair Details
        ------------------------------------------------------------ */}
          <Card className="shadow mb-4">
            <Card.Header className="bg-light">
              <Card.Title className="mb-0">Repair Details</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <h6 className="text-muted mb-1">Status</h6>
                  <Badge bg={getStatusBadge(repair.status)}>
                    {repair.status.charAt(0).toUpperCase() +
                      repair.status.slice(1)}
                  </Badge>
                </Col>
                <Col md={6}>
                  <h6 className="text-muted mb-1">Total Cost</h6>
                  <p className="mb-0 fw-semibold">
                    Rs. {repair.total_cost.toLocaleString()}
                  </p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <h6 className="text-muted mb-1">Appointment Date</h6>
                  <p className="mb-0">
                    {dayjs(repair.appointment_date).format("YYYY-MM-DD HH:mm")}
                  </p>
                </Col>
                <Col md={6}>
                  <h6 className="text-muted mb-1">Request ID</h6>
                  <p className="mb-0 fw-semibold">
                    {repair.repair_requests_id}
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
              <Card.Title className="mb-0">Initial Issue & Device</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6 className="text-muted mb-2">Initial Issue Description</h6>
                <p className="border-start ps-3">{repair.issue_description}</p>
              </div>

              <div className="mb-3">
                <h6 className="text-muted mb-2">Device Information</h6>
                <p className="border-start ps-3">{repair.device_info}</p>
              </div>

              <Row className="mb-3">
                <Col md={6}>
                  <h6 className="text-muted mb-2">Created Date</h6>
                  <p className="mb-0">
                    {dayjs(repair.created_at).format("YYYY-MM-DD HH:mm:ss")}
                  </p>
                </Col>
                <Col md={6}>
                  <h6 className="text-muted mb-2">Last Updated</h6>
                  <p className="mb-0">
                    {dayjs(repair.updated_at).format("YYYY-MM-DD HH:mm:ss")}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* --------------------------------------------------------
                    Identified Information
            ------------------------------------------------------------ */}
          <Card className="shadow mb-4">
            <Card.Header className="bg-light">
              <Card.Title className="mb-0">
                Identified Issue & Device
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6 className="text-muted mb-2">Identified Issue</h6>
                <p className="border-start ps-3">{repair.identified_issue}</p>
              </div>

              <div>
                <h6 className="text-muted mb-2">Identified Device Issue</h6>
                <p className="border-start ps-3">{repair.identified_device}</p>
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
              <Card.Title className="mb-0">Technician Information</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6 className="text-muted mb-2">Technician Name</h6>
                <p className="fw-semibold mb-0">{repair.technician_name}</p>
              </div>

              <div className="mb-3">
                <h6 className="text-muted mb-2">Email</h6>
                <p className="mb-0">
                  <a href={`mailto:${repair.technician_email}`}>
                    {repair.technician_email}
                  </a>
                </p>
              </div>

              <div>
                <h6 className="text-muted mb-2">Phone</h6>
                <p className="mb-0">
                  <a href={`tel:${repair.technician_phone}`}>
                    {repair.technician_phone}
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

export default RepairProfile;
