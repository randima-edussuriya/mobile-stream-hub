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

function DayOffProfile() {
  const { dayOffId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, userData } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dayOff, setDayOff] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDayOff, setEditedDayOff] = useState(null);
  const [updating, setUpdating] = useState(false);

  /* -----------------------------------------------------------------
        Fetch day off record from API
  --------------------------------------------------------------------*/
  const fetchDayOff = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(
        `${backendUrl}/api/admin/day-offs/${dayOffId}`,
      );

      if (data.success) {
        setDayOff(data.data);
      } else {
        setError("Failed to load day off record");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to fetch day off. Please try again later.";
      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDayOff();
  }, [dayOffId]);

  /* -----------------------------------------------------------------
        Handle Edit Actions and Cancel
  --------------------------------------------------------------------*/
  const handleEditClick = () => {
    setEditedDayOff({
      reason: dayOff.reason,
      start_date: dayjs(dayOff.start_date).format("YYYY-MM-DDTHH:mm"),
      end_date: dayjs(dayOff.end_date).format("YYYY-MM-DDTHH:mm"),
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedDayOff(null);
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
    setEditedDayOff((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* -----------------------------------------------------------------
        Handle Save Changes
  --------------------------------------------------------------------*/
  const handleSaveChanges = async () => {
    if (
      !editedDayOff.reason ||
      !editedDayOff.start_date ||
      !editedDayOff.end_date
    ) {
      toast.error("All fields are required");
      return;
    }

    // Validate date order
    const startDate = new Date(editedDayOff.start_date);
    const endDate = new Date(editedDayOff.end_date);
    if (startDate >= endDate) {
      toast.error("Start date must be before end date");
      return;
    }

    // validate start date
    if (startDate.getHours() < 9) {
      toast.error("Start date time must be after 09:00 AM");
      return;
    }

    ///validate end date
    if (endDate.getHours() > 19) {
      toast.error("End date time must be before 07:00 PM");
      return;
    }

    try {
      setUpdating(true);
      setError("");
      const { data } = await axios.put(
        `${backendUrl}/api/admin/day-offs/${dayOffId}`,
        editedDayOff,
      );

      if (data.success) {
        setDayOff(data.data);
        setIsEditing(false);
        setEditedDayOff(null);
        toast.success("Day off updated successfully");
      } else {
        setError("Failed to update day off");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to update day off. Please try again later.";
      setError(message);
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

  if (error || !dayOff) {
    return (
      <Container className="mt-5">
        <Card className="border-danger">
          <Card.Body className="text-danger text-center">
            <p className="mb-3">{error || "Day off not found"}</p>
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
          <h4 className="text-white">Day Off #{dayOff.day_off_id}</h4>
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
              <span>Day Off Details</span>
              {!isEditing &&
                hasPermission(userData.userRole, "dayoff:edit") && (
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
                      value={editedDayOff.reason}
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
                          value={editedDayOff.start_date}
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
                          value={editedDayOff.end_date}
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
                    <p className="text-muted">{dayOff.reason}</p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-2">
                      <strong>Day Off ID:</strong> {dayOff.day_off_id}
                    </p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-2">
                      <strong>Start Date & Time:</strong>
                    </p>
                    <p className="text-muted">
                      {dayjs(dayOff.start_date).format("YYYY-MM-DD HH:mm")}
                    </p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-2">
                      <strong>End Date & Time:</strong>
                    </p>
                    <p className="text-muted">
                      {dayjs(dayOff.end_date).format("YYYY-MM-DD HH:mm")}
                    </p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-2">
                      <strong>Created By:</strong> {dayOff.created_by_name}
                    </p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-2">
                      <strong>Created At:</strong>
                    </p>
                    <p className="text-muted">
                      {dayjs(dayOff.created_at).format("YYYY-MM-DD HH:mm:ss")}
                    </p>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DayOffProfile;
