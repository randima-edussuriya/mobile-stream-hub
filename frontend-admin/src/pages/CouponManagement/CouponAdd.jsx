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

function CouponAdd() {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    coupon_code: "",
    discount_type: "fixed amount",
    discount_value: "",
    expiry_date: "",
    usage_limit: "",
    user_group: "all",
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
        Get Minimum Date for Input
  --------------------------------------------------------------------*/
  const getMinDateTimeLocal = () => {
    const now = new Date();
    now.setDate(now.getDate() + 1); // Add 1 day
    return now.toISOString().split("T")[0] + "T00:00";
  };

  /* -----------------------------------------------------------------
        Handle Form Submit
  --------------------------------------------------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.coupon_code ||
      !formData.discount_type ||
      !formData.expiry_date ||
      !formData.user_group ||
      !formData.usage_limit
    ) {
      toast.error("All required fields must be filled");
      return;
    }

    if (formData.discount_type === "fixed amount" && !formData.discount_value) {
      toast.error("Discount value is required for fixed amount type");
      return;
    }

    if (
      formData.discount_type === "fixed amount" &&
      Number(formData.discount_value) <= 0
    ) {
      toast.error("Discount value must be greater than 0");
      return;
    }

    if (
      formData.discount_type === "free shipping" &&
      Number(formData.discount_value) > 0
    ) {
      toast.error("Discount value must be 0 for free shipping type");
      return;
    }

    if (formData.usage_limit && Number(formData.usage_limit) <= 0) {
      toast.error("Usage limit must be greater than 0");
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await axios.post(
        `${backendUrl}/api/admin/coupons`,
        formData,
      );
      if (data.success) {
        toast.success(data.message || "Coupon created successfully");
        navigate(-1);
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to create coupon. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col>
          <h4 className="text-white">Add Coupon</h4>
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
          Coupon Details
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Coupon Code</Form.Label>
              <Form.Control
                type="text"
                name="coupon_code"
                value={formData.coupon_code}
                onChange={handleChange}
                placeholder="Enter coupon code (e.g., SUMMER20)"
                disabled={submitting}
                maxLength="100"
              />
            </Form.Group>

            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Discount Type</Form.Label>
                  <Form.Select
                    name="discount_type"
                    value={formData.discount_type}
                    onChange={handleChange}
                    disabled={submitting}
                  >
                    <option value="fixed amount">Fixed Amount</option>
                    <option value="free shipping">Free Shipping</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Discount Value</Form.Label>
                  <Form.Control
                    type="number"
                    name="discount_value"
                    value={formData.discount_value}
                    onChange={handleChange}
                    placeholder="Enter discount value"
                    disabled={
                      submitting || formData.discount_type === "free shipping"
                    }
                    step="0.01"
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="expiry_date"
                    value={formData.expiry_date}
                    min={getMinDateTimeLocal()}
                    onChange={handleChange}
                    disabled={submitting}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Usage Limit</Form.Label>
                  <Form.Control
                    type="number"
                    name="usage_limit"
                    value={formData.usage_limit}
                    onChange={handleChange}
                    placeholder="Enter usage limit (e.g., 100)"
                    disabled={submitting}
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>User Group</Form.Label>
              <Form.Select
                name="user_group"
                value={formData.user_group}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="all">All Users</option>
                <option value="silver">Silver Members</option>
                <option value="gold">Gold Members</option>
                <option value="platinum">Platinum Members</option>
              </Form.Select>
            </Form.Group>

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
                  "Save Coupon"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CouponAdd;
