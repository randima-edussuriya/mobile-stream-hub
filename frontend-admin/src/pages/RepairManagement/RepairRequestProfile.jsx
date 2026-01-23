import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Spinner,
  Button,
  Form,
} from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import dayjs from "dayjs";
import { toast } from "react-toastify";

function RepairRequestProfile() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [repairRequest, setRepairRequest] = useState(null);

  /* -----------------------------------------------------------------
        Fetch repair request details from API
  -------------------------------------------------------*/
  const fetchRepairDetails = async () => {
    try {
      setLoading(true);
      setError("");
      setRepairRequest(null);

      const { data } = await axios.get(
        `${backendUrl}/api/admin/repairs/${requestId}`,
      );
      setRepairRequest(data.data);
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
        Handle status change
  -------------------------------------------------------*/
  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(`${backendUrl}/api/admin/repairs/${requestId}/status`, {
        status: newStatus,
      });
      toast.success("Status updated successfully.");
      fetchRepairDetails();
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update status.";
      toast.error(message);
      console.error(error);
    }
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

  if (error || !repairRequest) {
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
            Repair Request #{repairRequest.repair_requests_id}
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
            <Card.Header className="bg-secondary-subtle fw-semibold d-flex justify-content-between align-items-center">
              <span>Repair Request Details</span>
              <Button
                variant="success"
                disabled={repairRequest.status === "accepted"}
                onClick={() =>
                  navigate(`/repair-management/accept-request/${requestId}`)
                }
              >
                Make Accept
              </Button>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Request ID</strong>
                    <p className="mb-0 fw-semibold">
                      {repairRequest.repair_requests_id}
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Status</strong>
                    <Form.Select
                      value={repairRequest.status}
                      disabled={repairRequest.status === "accepted"}
                      onChange={(e) => handleStatusChange(e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </Form.Select>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Appointment Date</strong>
                    <p className="mb-0 fw-semibold">
                      {dayjs(repairRequest.appointment_date).format(
                        "YYYY-MM-DD HH:mm",
                      )}
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Created Date</strong>
                    <p className="mb-0 fw-semibold">
                      {dayjs(repairRequest.created_at).format(
                        "YYYY-MM-DD HH:mm:ss",
                      )}
                    </p>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Updated Date</strong>
                    <p className="mb-0 fw-semibold">
                      {dayjs(repairRequest.updated_at).format(
                        "YYYY-MM-DD HH:mm:ss",
                      )}
                    </p>
                  </div>
                </Col>
              </Row>

              <hr className="my-4" />

              <div className="mb-3">
                <strong className="text-muted">Device Information</strong>
                <p className="mb-0 fw-semibold">{repairRequest.device_info}</p>
              </div>

              <div className="mb-3">
                <strong className="text-muted">Issue Description</strong>
                <p className="mb-0 fw-semibold">
                  {repairRequest.issue_description}
                </p>
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
                    <p className="mb-0 fw-semibold">
                      {repairRequest.customer_id}
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Customer Name</strong>
                    <p className="mb-0 fw-semibold">
                      {repairRequest.customer_name}
                    </p>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Email</strong>
                    <p className="mb-0 fw-semibold">
                      {repairRequest.customer_email}
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Phone</strong>
                    <p className="mb-0 fw-semibold">
                      {repairRequest.customer_phone}
                    </p>
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
                    <p className="mb-0 fw-semibold">
                      {repairRequest.technician_id}
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Technician Name</strong>
                    <p className="mb-0 fw-semibold">
                      {repairRequest.technician_name}
                    </p>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Email</strong>
                    <p className="mb-0 fw-semibold">
                      {repairRequest.technician_email}
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Phone</strong>
                    <p className="mb-0 fw-semibold">
                      {repairRequest.technician_phone}
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
