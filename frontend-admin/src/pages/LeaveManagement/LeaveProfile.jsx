import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { hasPermission } from "../../utils/permissions";

function LeaveProfile() {
  const { leaveId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, userData } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [leave, setLeave] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLeave, setEditedLeave] = useState(null);
  const [updating, setUpdating] = useState(false);

  /* -----------------------------------------------------------------
        Fetch leave request from API
  --------------------------------------------------------------------*/
  const fetchLeave = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(
        `${backendUrl}/api/admin/leaves/${leaveId}`,
      );

      if (data.success) {
        setLeave(data.data);
      } else {
        setError("Failed to load leave request");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to fetch leave. Please try again later.";
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeave();
  }, [leaveId]);

  /* -----------------------------------------------------------------
        Handle Edit Actions and Cancel
  --------------------------------------------------------------------*/
  const handleEditClick = () => {
    setEditedLeave({
      reason: leave.reason,
      start_date: dayjs(leave.start_date).format("YYYY-MM-DDTHH:mm"),
      end_date: dayjs(leave.end_date).format("YYYY-MM-DDTHH:mm"),
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedLeave(null);
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
        Handle Input Change and Save Changes
  --------------------------------------------------------------------*/
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedLeave((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* -----------------------------------------------------------------
        Handle Save Changes
  --------------------------------------------------------------------*/
  const handleSaveChanges = async () => {
    if (
      !editedLeave.reason ||
      !editedLeave.start_date ||
      !editedLeave.end_date
    ) {
      toast.error("All fields are required");
      return;
    }

    // Validate date order
    const startDate = new Date(editedLeave.start_date);
    const endDate = new Date(editedLeave.end_date);
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
      setUpdating(true);
      setError("");
      const { data } = await axios.put(
        `${backendUrl}/api/admin/leaves/${leaveId}`,
        editedLeave,
      );

      if (data.success) {
        setLeave(data.data);
        setIsEditing(false);
        setEditedLeave(null);
        toast.success("Leave request updated successfully");
      } else {
        setError("Failed to update leave request");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to update leave. Please try again later.";
      setError(message);
      toast.error(message);
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  /* -----------------------------------------------------------------
        Get Status Badge Class, Options
  --------------------------------------------------------------------*/
  const getStatusBadge = (status) => {
    const badgeClass = {
      pending: "bg-warning bg-opacity-50",
      approved: "bg-success bg-opacity-50",
      rejected: "bg-danger bg-opacity-50",
    };
    return badgeClass[status] || "bg-secondary bg-opacity-50";
  };

  const statusOptions = ["pending", "approved", "rejected"];

  /* -----------------------------------------------------------------
        Handle Status Change
  --------------------------------------------------------------------*/
  const handleStatusChange = async (newStatus) => {
    if (newStatus === leave.status) {
      return; // No change
    }

    try {
      setUpdating(true);
      const { data } = await axios.patch(
        `${backendUrl}/api/admin/leaves/${leaveId}/status`,
        { status: newStatus },
      );

      if (data.success) {
        setLeave((prev) => ({
          ...prev,
          status: data.data.status,
          responded_at: data.data.responded_at,
        }));
        toast.success(`Leave request ${newStatus} successfully`);
      } else {
        toast.error("Failed to update leave status");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to update status. Please try again later.";
      toast.error(message);
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

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

  if (error || !leave) {
    return (
      <Container className="mt-5">
        <Card className="border-danger">
          <Card.Body className="text-danger text-center">
            <p className="mb-3">{error || "Leave request not found"}</p>
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
          <h4 className="text-white">
            Leave Request #{leave.leave_request_id}
          </h4>
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
              <span>Leave Request Details</span>
              {!isEditing &&
                hasPermission(userData.userRole, "leave:edit") &&
                leave.status === "pending" && (
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
              {error && (
                <div className="alert alert-danger mb-3" role="alert">
                  {error}
                </div>
              )}
              {isEditing ? (
                <div>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <strong>Reason:</strong>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="reason"
                      value={editedLeave.reason}
                      onChange={handleInputChange}
                      disabled={updating}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <strong>Start Date & Time:</strong>
                        </Form.Label>
                        <Form.Control
                          type="datetime-local"
                          name="start_date"
                          value={editedLeave.start_date}
                          min={getMinDateTimeLocal()}
                          onChange={handleInputChange}
                          disabled={updating}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          <strong>End Date & Time:</strong>
                        </Form.Label>
                        <Form.Control
                          type="datetime-local"
                          name="end_date"
                          value={editedLeave.end_date}
                          min={getMinDateTimeLocal()}
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
                      <strong>Reason:</strong>
                    </p>
                    <p className="text-muted">{leave.reason}</p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-2">
                      <strong>Leave ID:</strong> {leave.leave_request_id}
                    </p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-2">
                      <strong>Start Date & Time:</strong>
                    </p>
                    <p className="text-muted">
                      {dayjs(leave.start_date).format("YYYY-MM-DD HH:mm")}
                    </p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-2">
                      <strong>End Date & Time:</strong>
                    </p>
                    <p className="text-muted">
                      {dayjs(leave.end_date).format("YYYY-MM-DD HH:mm")}
                    </p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-2">
                      <strong>Requested By:</strong> {leave.requested_by_name}
                    </p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-2">
                      <strong>Status:</strong>
                    </p>
                      <Form.Select
                      value={leave.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      disabled={
                        !hasPermission(
                          userData.userRole,
                          "leave:edit-status",
                        ) || updating
                      }
                      className={`fw-semibold w-auto ${getStatusBadge(leave.status)}`}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-2">
                      <strong>Requested At:</strong>
                    </p>
                    <p className="text-muted">
                      {dayjs(leave.requested_at).format("YYYY-MM-DD HH:mm:ss")}
                    </p>
                  </Col>
                  {leave.responded_at && (
                    <Col md={6} className="mb-3">
                      <p className="mb-2">
                        <strong>Responded At:</strong>
                      </p>
                      <p className="text-muted">
                        {dayjs(leave.responded_at).format(
                          "YYYY-MM-DD HH:mm:ss",
                        )}
                      </p>
                    </Col>
                  )}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LeaveProfile;
