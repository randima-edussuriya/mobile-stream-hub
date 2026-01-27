import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Row,
  Col,
  Button,
  Table,
  Spinner,
} from "react-bootstrap";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { AppContext } from "../../context/AppContext";

function CouponProfile() {
  const { couponId } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCoupon, setEditedCoupon] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [usageLoading, setUsageLoading] = useState(false);
  const [usageRecords, setUsageRecords] = useState([]);

  /* -----------------------------------------------------------------
        Fetch coupon record from API
  --------------------------------------------------------------------*/
  const fetchCoupon = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(
        `${backendUrl}/api/admin/coupons/${couponId}`,
      );
      setCoupon(data.data);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to fetch coupon details. Please try again later.";
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------------------------------
        Fetch coupon usage records
  --------------------------------------------------------------------*/
  const fetchCouponUsage = async () => {
    try {
      setUsageLoading(true);
      setError("");
      const { data } = await axios.get(
        `${backendUrl}/api/admin/coupons/${couponId}/usage`,
      );
      setUsageRecords(data.data);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to fetch coupon usage records. Please try again later.";
      setError(message);
      console.error(err);
    } finally {
      setUsageLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupon();
    fetchCouponUsage();
  }, [couponId]);

  /* -----------------------------------------------------------------
        Handle Edit Actions and Cancel
  --------------------------------------------------------------------*/
  const handleEditClick = () => {
    setEditedCoupon({
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      expiry_date: dayjs(coupon.expiry_date).format("YYYY-MM-DDTHH:mm"),
      usage_limit: coupon.usage_limit,
      user_group: coupon.user_group,
      is_active: coupon.is_active,
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedCoupon(null);
  };

  /* -----------------------------------------------------------------
        Handle Input Change
  --------------------------------------------------------------------*/
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedCoupon((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* -----------------------------------------------------------------
        Handle Save Changes
  --------------------------------------------------------------------*/
  const handleSaveChanges = async () => {
    if (
      !editedCoupon.discount_type ||
      !editedCoupon.expiry_date ||
      !editedCoupon.usage_limit
    ) {
      toast.error("All required fields must be filled");
      return;
    }

    if (
      editedCoupon.discount_type === "fixed amount" &&
      !editedCoupon.discount_value
    ) {
      toast.error("Discount value is required for fixed amount type");
      return;
    }
    if (
      editedCoupon.discount_type === "fixed amount" &&
      editedCoupon.discount_value <= 0
    ) {
      toast.error("Discount value must be greater than 0");
      return;
    }
    if (
      editedCoupon.discount_type === "free shipping" &&
      editedCoupon.discount_value > 0
    ) {
      toast.error("Discount value must be 0 for free shipping type");
      return;
    }

    const expiryDate = new Date(editedCoupon.expiry_date);
    if (expiryDate <= new Date()) {
      toast.error("Expiry date must be in the future");
      return;
    }
    try {
      setUpdating(true);
      const { data } = await axios.put(
        `${backendUrl}/api/admin/coupons/${couponId}`,
        editedCoupon,
      );
      if (data.success) {
        toast.success(data.message || "Coupon updated successfully");
        setIsEditing(false);
        fetchCoupon();
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to update coupon. Please try again.";
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  /* -----------------------------------------------------------------
        Render Coupon Usage Table
  --------------------------------------------------------------------*/
  const renderUsageTable = () => {
    if (usageLoading) {
      return (
        <tr>
          <td colSpan={4} className="text-center py-3">
            <Spinner animation="border" role="status" size="sm">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </td>
        </tr>
      );
    }

    if (usageRecords.length === 0) {
      return (
        <tr>
          <td colSpan={4} className="text-muted text-center">
            No usage records found
          </td>
        </tr>
      );
    }

    return usageRecords.map((record) => (
      <tr key={record.usage_id}>
        <td className="fw-bold">{record.usage_id}</td>
        <td>{record.order_id}</td>
        <td>{record.customer_id}</td>
        <td className="text-muted">
          {dayjs(record.usage_date).format("YYYY-MM-DD HH:mm:ss")}
        </td>
      </tr>
    ));
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

  if (error || !coupon) {
    return (
      <Container className="py-4">
        <div className="alert alert-danger" role="alert">
          {error || "Coupon not found"}
        </div>
        <Button variant="dark" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col>
          <h4 className="text-white">Coupon #{coupon.coupon_code_id}</h4>
        </Col>
        <Col className="text-end">
          <Button variant="dark" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Col>
      </Row>

      <Row className="g-3">
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold d-flex justify-content-between align-items-center">
              <span>Coupon Details</span>
              {!isEditing && (
                <Button
                  variant="none"
                  size="sm"
                  onClick={handleEditClick}
                  className="btn_main_dark"
                >
                  Edit
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              {isEditing ? (
                <div>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <strong>Coupon Code (Read-only):</strong>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={coupon.coupon_code}
                          disabled
                          className="text-uppercase"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <strong>Discount Type:</strong>
                        </Form.Label>
                        <Form.Select
                          name="discount_type"
                          value={editedCoupon.discount_type}
                          onChange={handleInputChange}
                          disabled={updating}
                        >
                          <option value="fixed amount">Fixed Amount</option>
                          <option value="free shipping">Free Shipping</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <strong>Discount Value (Rs.)</strong>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="discount_value"
                          value={editedCoupon.discount_value}
                          onChange={handleInputChange}
                          disabled={
                            updating ||
                            editedCoupon.discount_type === "free shipping"
                          }
                          step="0.01"
                          min="0"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <strong>Expiry Date:</strong>
                        </Form.Label>
                        <Form.Control
                          type="datetime-local"
                          name="expiry_date"
                          value={editedCoupon.expiry_date}
                          onChange={handleInputChange}
                          disabled={updating}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <strong>Usage Limit:</strong>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          name="usage_limit"
                          value={editedCoupon.usage_limit}
                          onChange={handleInputChange}
                          disabled={updating}
                          min="0"
                          placeholder="0 for unlimited"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <strong>User Group:</strong>
                        </Form.Label>
                        <Form.Select
                          name="user_group"
                          value={editedCoupon.user_group}
                          onChange={handleInputChange}
                          disabled={updating}
                        >
                          <option value="all">All Users</option>
                          <option value="silver">Silver Members</option>
                          <option value="gold">Gold Members</option>
                          <option value="platinum">Platinum Members</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Check
                          type="switch"
                          id="is_active_switch"
                          name="is_active"
                          label={<strong>Active</strong>}
                          checked={editedCoupon.is_active}
                          onChange={handleInputChange}
                          disabled={updating}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex gap-2 justify-content-end">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={handleSaveChanges}
                      disabled={updating}
                      className="fw-medium"
                    >
                      {updating ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={handleCancelEdit}
                      disabled={updating}
                      className="fw-medium"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Row>
                  <Col md={6} className="mb-3">
                    <p className="mb-2">
                      <strong>Coupon Code:</strong>
                    </p>
                    <p className="text-muted text-uppercase fw-bold">
                      {coupon.coupon_code}
                    </p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-2">
                      <strong>Discount Type:</strong>
                    </p>
                    <p className="text-muted">{coupon.discount_type}</p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-2">
                      <strong>Discount Value:</strong>
                    </p>
                    <p className="text-muted">
                      {coupon.discount_type === "free shipping"
                        ? "0"
                        : `Rs. ${coupon.discount_value}`}
                    </p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-2">
                      <strong>Expiry Date:</strong>
                    </p>
                    <p className="text-muted">
                      {dayjs(coupon.expiry_date).format("YYYY-MM-DD HH:mm:ss")}
                    </p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-2">
                      <strong>Usage Limit:</strong>
                    </p>
                    <p className="text-muted">
                      {coupon.usage_limit === 0
                        ? "Unlimited"
                        : coupon.usage_limit}
                    </p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-2">
                      <strong>Used Count:</strong>
                    </p>
                    <p className="text-muted">{coupon.used_count}</p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-2">
                      <strong>User Group:</strong>
                    </p>
                    <p className="text-muted text-capitalize">
                      {coupon.user_group}
                    </p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-2">
                      <strong>Status:</strong>
                    </p>
                    <p>
                      <span
                        className={
                          coupon.is_active
                            ? "badge bg-success"
                            : "badge bg-danger"
                        }
                      >
                        {coupon.is_active ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-2">
                      <strong>Created At:</strong>
                    </p>
                    <p className="text-muted">
                      {dayjs(coupon.created_at).format("YYYY-MM-DD HH:mm:ss")}
                    </p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-2">
                      <strong>Created By:</strong>
                    </p>
                    <p className="text-muted">
                      {`${coupon.created_by_name} (ID: ${coupon.staff_id})`}
                    </p>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold">
              Coupon Usage Records
            </Card.Header>
            <Card.Body className="p-0">
              <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
                <Table hover striped size="sm" className="mb-0">
                  <thead
                    className="position-sticky top-0"
                    style={{ zIndex: 20 }}
                  >
                    <tr className="fw-bold">
                      <th>Usage ID</th>
                      <th>Order ID</th>
                      <th>Customer ID</th>
                      <th>Used Date</th>
                    </tr>
                  </thead>
                  <tbody>{renderUsageTable()}</tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CouponProfile;
