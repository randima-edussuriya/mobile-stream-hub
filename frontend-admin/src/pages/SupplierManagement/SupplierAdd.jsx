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
} from "react-bootstrap";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

function SupplierAdd() {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
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
        Handle Form Submit
  --------------------------------------------------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone_number ||
      !formData.address
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await axios.post(
        `${backendUrl}/api/admin/suppliers`,
        formData,
      );
      if (data.success) {
        toast.success(data.message || "Supplier added successfully");
        navigate(-1);
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to add supplier. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col>
          <h4 className="text-white">Add Supplier</h4>
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
          Supplier Details
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter supplier name"
                    disabled={submitting}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="supplier@example.com"
                    disabled={submitting}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    disabled={submitting}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
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
                {submitting ? "Saving..." : "Save Supplier"}
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => navigate(-1)}
                disabled={submitting}
                className="fw-medium"
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default SupplierAdd;
