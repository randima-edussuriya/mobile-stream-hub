import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Row,
  Col,
  Button,
  Spinner,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

function DayOffAdd() {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    reason: "",
    start_date: "",
    end_date: "",
  });
  const [submitting, setSubmitting] = useState(false);

  /* -----------------------------------------------------------------
        Handle Form Input Change
  --------------------------------------------------------------------*/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* -----------------------------------------------------------------
        Get Minimum Date-Time Local for Input
  --------------------------------------------------------------------*/
  const getMinDateTimeLocal = () => {
    const now = new Date();
    now.setDate(now.getDate() + 1); // Add 1 day
    return now.toISOString().split("T")[0] + "T09:00";
  };

  /* -----------------------------------------------------------------
        Handle Form Submit
  --------------------------------------------------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.reason || !formData.start_date || !formData.end_date) {
      toast.error("All fields are required");
      return;
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    if (startDate >= endDate) {
      toast.error("Start date must be before end date");
      return;
    }

    // validate start date
    if (startDate.getHours() < 9 || startDate.getHours() >= 19) {
      toast.error("Start date time must be between 09:00 AM and 06:59 PM");
      return;
    }

    ///validate end date
    if (endDate.getHours() < 9 || endDate.getHours() >= 19) {
      toast.error("End date time must be between 09:00 AM and 06:59 PM");
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await axios.post(`${backendUrl}/api/admin/day-offs`, formData);
      if (data.success) {
        toast.success(data.message || "Day off created successfully");
        navigate(-1);
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to create day off. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col>
          <h4 className="text-white">Add Day Off</h4>
        </Col>
        <Col className="text-end">
          <Button
            variant="dark"
            onClick={() => navigate(-1)}
            disabled={submitting}
          >
            Back
          </Button>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Header className="bg-secondary-subtle fw-semibold">
          Day Off Details
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Reason</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Enter reason for day off"
                disabled={submitting}
              />
            </Form.Group>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Start Date & Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="start_date"
                    value={formData.start_date}
                    min={getMinDateTimeLocal()}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>End Date & Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="end_date"
                    value={formData.end_date}
                    min={getMinDateTimeLocal()}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button
                type="submit"
                size="sm"
                variant="success"
                disabled={submitting}
                className="fw-medium"
              >
                {submitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Saving...
                  </>
                ) : (
                  "Save Day Off"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default DayOffAdd;
