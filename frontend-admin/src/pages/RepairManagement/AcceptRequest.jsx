import axios from "axios";
import { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

function AcceptRequest() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: "diagnostics completed",
    totalCost: "",
    identifiedIssue: "",
    identifiedDevice: "",
  });

  /* -----------------------------------------------------------------
        Handle form input change
  -------------------------------------------------------*/
  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* -----------------------------------------------------------------
        Handle form submission
  -------------------------------------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.status ||
      !formData.totalCost ||
      !formData.identifiedIssue ||
      !formData.identifiedDevice
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${backendUrl}/api/admin/repairs`, {
        repairRequestId: requestId,
        status: formData.status,
        totalCost: Number(formData.totalCost),
        identifiedIssue: formData.identifiedIssue,
        identifiedDevice: formData.identifiedDevice,
      });

      toast.success("Repair acceptance recorded successfully!");
    //   navigate("/repairs");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to create repair record. Please try again later.";
      toast.error(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col>
          <h4 className="text-white">Accept Repair Request #{requestId}</h4>
        </Col>
        <Col className="text-end">
          <Button variant="dark" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Col>
      </Row>

      <Row className="g-3">
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold">
              Repair Details
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        Repair Status
                      </Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="diagnostics completed">
                          Diagnostics Completed
                        </option>
                        <option value="repair in progress">
                          Repair In Progress
                        </option>
                        <option value="repair completed">
                          Repair Completed
                        </option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        Total Cost (Rs.)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        min="0"
                        name="totalCost"
                        value={formData.totalCost}
                        onChange={handleInputChange}
                        placeholder="Enter total cost"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Identified Issue
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="identifiedIssue"
                    value={formData.identifiedIssue}
                    onChange={handleInputChange}
                    placeholder="Describe the identified issue..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Identified Device
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="identifiedDevice"
                    value={formData.identifiedDevice}
                    onChange={handleInputChange}
                    placeholder="Describe the identified device details..."
                  />
                </Form.Group>

                <div className="text-center">
                  <Button
                    variant="none"
                    type="submit"
                    className="btn_main_light_outline"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Repair Details"}
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

export default AcceptRequest;
