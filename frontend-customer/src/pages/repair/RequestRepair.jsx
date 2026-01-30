import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Spinner,
  Row,
  Col,
  Alert,
  Badge,
  ListGroup,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

function RequestRepair() {
  const [technicians, setTechnicians] = useState([]);
  const [loadingTechs, setLoadingTechs] = useState(true);
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [deviceInfo, setDeviceInfo] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [timeValidationError, setTimeValidationError] = useState("");
  const [techFeedback, setTechFeedback] = useState({
    averageRating: "0.0",
    totalFeedbacks: 0,
    feedbacks: [],
  });
  const [loadingTechFeedback, setLoadingTechFeedback] = useState(false);

  const { backendUrl } = useContext(AppContext);

  const navigate = useNavigate();

  /* -----------------------------------------------------------------
        Fetch technicians on component mount
  --------------------------------------------------------------------*/
  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    setLoadingTechs(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/customer/repair/technicians`,
      );
      setTechnicians(data.data || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch technicians. Please try again.",
      );
      console.error(error);
    } finally {
      setLoadingTechs(false);
    }
  };

  /* -----------------------------------------------------------------
        Fetch technician feedback when selected
  --------------------------------------------------------------------*/
  useEffect(() => {
    if (!selectedTechnician) {
      setTechFeedback({
        averageRating: "0.0",
        totalFeedbacks: 0,
        feedbacks: [],
      });
      return;
    }
    fetchTechnicianFeedback(selectedTechnician);
  }, [selectedTechnician]);

  const fetchTechnicianFeedback = async (technicianId) => {
    setLoadingTechFeedback(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/customer/feedback/technicians/${technicianId}`,
      );
      setTechFeedback(
        data.data || { averageRating: "0.0", totalFeedbacks: 0, feedbacks: [] },
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch technician feedback. Please try again.",
      );
      console.error(error);
      setTechFeedback({
        averageRating: "0.0",
        totalFeedbacks: 0,
        feedbacks: [],
      });
    } finally {
      setLoadingTechFeedback(false);
    }
  };

  /* -----------------------------------------------------------------
        Check technician availability when tech or date changes
  --------------------------------------------------------------------*/
  useEffect(() => {
    if (selectedTechnician && appointmentDate) {
      const appointmentDateObj = new Date(appointmentDate);
      const hour = appointmentDateObj.getHours();
      // Check if time is between 9:00 AM (9) and 5:00 PM (17)
      if (hour < 9 || hour >= 17) {
        setTimeValidationError(
          "Appointments can only be scheduled from 9:00 AM to 5:00 PM",
        );
        setIsAvailable(false);
        setAvailabilityMessage("");
      } else {
        setTimeValidationError("");
        checkAvailability();
      }
    } else {
      setIsAvailable(false);
      setAvailabilityMessage("");
      setTimeValidationError("");
    }
  }, [selectedTechnician, appointmentDate]);

  const checkAvailability = async () => {
    setCheckingAvailability(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/customer/repair/availability`,
        {
          params: {
            technicianId: selectedTechnician,
            appointmentDate: appointmentDate,
          },
        },
      );

      setIsAvailable(data.data.isAvailable);
      setAvailabilityMessage(data.message);
    } catch (error) {
      toast.error("Failed to check availability. Please try again.");
      console.error(error);
      setIsAvailable(false);
      setAvailabilityMessage("");
    } finally {
      setCheckingAvailability(false);
    }
  };

  /* -----------------------------------------------------------------
        Handle form submission
  --------------------------------------------------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!selectedTechnician) {
      toast.error("Please select a technician");
      return;
    }

    if (!issueDescription.trim()) {
      toast.error("Please enter issue description");
      return;
    }

    if (!deviceInfo.trim()) {
      toast.error("Please enter device information");
      return;
    }

    if (!appointmentDate) {
      toast.error("Please select appointment date");
      return;
    }

    if (isAvailable === false) {
      toast.error("Selected technician is not available on this date");
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/customer/repair/requests`,
        {
          technicianId: selectedTechnician,
          issueDescription: issueDescription.trim(),
          deviceInfo: deviceInfo.trim(),
          appointmentDate: appointmentDate,
        },
      );

      if (data.success) {
        toast.success("Repair request submitted successfully!");
        // Reset form
        setSelectedTechnician("");
        setAppointmentDate("");
        setIssueDescription("");
        setDeviceInfo("");
        setIsAvailable(false);
        setAvailabilityMessage("");
        navigate("/repair/my-requests");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to submit repair request. Please try again.",
      );
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  /* -----------------------------------------------------------------
        Get minimum date for appointment (tomorrow)
  --------------------------------------------------------------------*/
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <Card.Title className="mb-4">
                <h4 className="fw-semibold">Request Repair Service</h4>
              </Card.Title>

              <Form onSubmit={handleSubmit}>
                {/* Technician Selection */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Select Technician <span className="text-danger">*</span>
                  </Form.Label>
                  {loadingTechs ? (
                    <div className="text-center py-3">
                      <Spinner animation="border" size="sm" />
                    </div>
                  ) : (
                    <Form.Select
                      value={selectedTechnician}
                      onChange={(e) => setSelectedTechnician(e.target.value)}
                      disabled={submitting}
                    >
                      <option value="">-- Choose Technician --</option>
                      {technicians.map((tech) => (
                        <option key={tech.staff_id} value={tech.staff_id}>
                          {tech.first_name} {tech.last_name}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                </Form.Group>

                {/* Technician Feedback */}
                {selectedTechnician && (
                  <Card className="mb-3">
                    <Card.Body>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h6 className="mb-0">Technician Feedback</h6>
                        <Badge bg="secondary">
                          {techFeedback.averageRating} / 5
                        </Badge>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">
                          {techFeedback.totalFeedbacks} reviews
                        </small>
                      </div>

                      {loadingTechFeedback ? (
                        <div className="text-center py-2">
                          <Spinner animation="border" size="sm" />
                        </div>
                      ) : techFeedback.feedbacks.length === 0 ? (
                        <Alert variant="light" className="mb-0">
                          No feedback yet.
                        </Alert>
                      ) : (
                        <ListGroup
                          variant="flush"
                          className="overflow-auto"
                          style={{ maxHeight: "120px" }}
                        >
                          {techFeedback.feedbacks.map((fb) => (
                            <ListGroup.Item key={fb.feedback_id}>
                              <div className="d-flex align-items-center justify-content-between">
                                <strong>
                                  {fb.first_name} {fb.last_name}
                                </strong>
                                <Badge bg="primary">
                                  {Number(fb.rating).toFixed(1)}
                                </Badge>
                              </div>
                              <div className="small text-muted mb-1">
                                {new Date(fb.feedback_date).toLocaleString()}
                              </div>
                              <div>{fb.message}</div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      )}
                    </Card.Body>
                  </Card>
                )}

                {/* Appointment Date */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Appointment Date <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    min={getMinDate() + "T09:00"}
                    disabled={submitting || !selectedTechnician}
                  />
                  {timeValidationError && (
                    <Alert variant="danger" className="mt-2 mb-2 py-2">
                      {timeValidationError}
                    </Alert>
                  )}
                  {!timeValidationError && !appointmentDate && (
                    <Form.Text className="text-muted">
                      Note: Appointments can be scheduled from 9:00 AM to 5:00
                      PM.
                    </Form.Text>
                  )}
                </Form.Group>

                {/* Availability Status */}
                {checkingAvailability && (
                  <div className="text-center mb-3">
                    <Spinner animation="border" size="sm" className="me-2" />
                    <span>Checking availability...</span>
                  </div>
                )}

                {availabilityMessage && !checkingAvailability && (
                  <Alert
                    variant={isAvailable ? "success" : "danger"}
                    className="mb-3"
                  >
                    {availabilityMessage}
                  </Alert>
                )}

                {/* Issue Description */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Issue Description <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder="Describe the issue with your device..."
                    disabled={submitting}
                  />
                </Form.Group>

                {/* Device Information */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    Device Information <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={deviceInfo}
                    onChange={(e) => setDeviceInfo(e.target.value)}
                    placeholder="Enter device model, brand, specifications, etc..."
                    disabled={submitting}
                  />
                </Form.Group>

                {/* Submit Button */}
                <div className="d-grid gap-2">
                  <Button
                    variant="none"
                    size="sm"
                    type="submit"
                    disabled={
                      submitting ||
                      loadingTechs ||
                      isAvailable === false ||
                      !selectedTechnician ||
                      !appointmentDate
                    }
                    className="btn_main_light_outline"
                  >
                    {submitting ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Submitting...
                      </>
                    ) : (
                      "Submit Repair Request"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default RequestRepair;
