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
  Badge,
} from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { confirmAction } from "../../utils/confirmAction";
import { hasPermission } from "../../utils/permissions";
import { use } from "react";

function RepairProfile() {
  const { repairId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, userData } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [repair, setRepair] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
  const [editedValues, setEditedValues] = useState({
    totalCost: "",
    identifiedIssue: "",
    identifiedDevice: "",
  });

  /* -----------------------------------------------------------------
        Fetch repair detail
  --------------------------------------------------------------------*/
  const fetchRepairDetail = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.get(
        `${backendUrl}/api/admin/repairs/records/${repairId}`,
      );
      setRepair(data.data);
      setSelectedTechnicianId(data.data.technician_id);
      setEditedValues({
        totalCost: data.data.total_cost,
        identifiedIssue: data.data.identified_issue,
        identifiedDevice: data.data.identified_device,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to fetch repair detail. Please try again later.";
      setError(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------------------------------
        Fetch active technicians
  --------------------------------------------------------------------*/
  const fetchTechnicians = async () => {
    if (userData?.userRole !== "admin") return;
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/repairs/technicians`,
      );
      setTechnicians(data.data || []);
    } catch (error) {
      console.error("Error fetching technicians:", error);
      toast.error("Failed to fetch technicians list.");
    }
  };

  /* -----------------------------------------------------------------
        Get badge variant based on repair status, request status
  --------------------------------------------------------------------*/
  const getRepairStatusBadge = (status) => {
    const statusMap = {
      "diagnostics completed": "bg-primary bg-opacity-50",
      "repair in progress": "bg-warning bg-opacity-50",
      "repair completed": "bg-success bg-opacity-50",
      cancelled: "bg-danger bg-opacity-50",
    };
    return statusMap[status] || "bg-primary bg-opacity-50";
  };

  const getRequestStatusBadge = (status) => {
    const statusMap = {
      accepted: "success",
      rejected: "danger",
    };
    return statusMap[status] || "secondary";
  };

  /* -----------------------------------------------------------------
        Repair status options
  --------------------------------------------------------------------*/
  const repairStatuses = [
    "diagnostics completed",
    "repair in progress",
    "repair completed",
    "cancelled",
  ];

  /* -----------------------------------------------------------------
        Update repair status
  --------------------------------------------------------------------*/
  const handleStatusChange = async (newStatus) => {
    if (userData?.userRole !== "admin" && newStatus === "cancelled") {
      toast.warning("Only admin users can cancel repairs.");
      return;
    }

    if (newStatus === "cancelled") {
      toast.warning(
        "To cancel the repair, please use the 'Cancel Repair' option in the Danger Zone section.",
      );
      return;
    }
    try {
      setUpdating(true);
      await axios.put(
        `${backendUrl}/api/admin/repairs/records/${repairId}/status`,
        { status: newStatus },
      );
      setRepair({ ...repair, repair_status: newStatus });
      toast.success("Repair status updated successfully.");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to update repair status. Please try again later.";
      toast.error(message);
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  /* -----------------------------------------------------------------
        Save repair details
  --------------------------------------------------------------------*/
  const handleSaveDetails = async () => {
    try {
      setUpdating(true);
      await axios.put(
        `${backendUrl}/api/admin/repairs/records/${repairId}`,
        editedValues,
      );
      setRepair({
        ...repair,
        total_cost: editedValues.totalCost,
        identified_issue: editedValues.identifiedIssue,
        identified_device: editedValues.identifiedDevice,
      });
      setEditing(false);
      toast.success("Repair details updated successfully.");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to update repair details. Please try again later.";
      toast.error(message);
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  /* -----------------------------------------------------------------
        Cancel editing
  --------------------------------------------------------------------*/
  const handleCancelEdit = () => {
    setEditedValues({
      totalCost: repair.total_cost,
      identifiedIssue: repair.identified_issue,
      identifiedDevice: repair.identified_device,
    });
    setEditing(false);
  };

  /* -----------------------------------------------------------------
        Update technician for repair request
  --------------------------------------------------------------------*/
  const handleUpdateTechnician = async () => {
    if (!selectedTechnicianId) {
      toast.error("Please select a technician.");
      return;
    }

    if (selectedTechnicianId === repair.technician_id) {
      toast.info("No changes made.");
      return;
    }

    const result = await confirmAction(
      "Are you sure you want to update the technician for this repair?",
    );
    if (!result.isConfirmed) return;

    try {
      setUpdating(true);
      await axios.put(
        `${backendUrl}/api/admin/repairs/${repair.repair_requests_id}/technician`,
        { technicianId: selectedTechnicianId },
      );
      setRepair({
        ...repair,
        technician_id: selectedTechnicianId,
        technician_name: technicians.find(
          (t) => t.staff_id === parseInt(selectedTechnicianId),
        )?.first_name,
      });
      toast.success("Technician updated successfully.");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to update technician. Please try again later.";
      toast.error(message);
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  /* -----------------------------------------------------------------
        Cancel repair
  --------------------------------------------------------------------*/
  const handleCancelRepair = async () => {
    const result = await confirmAction(
      "Are you sure you want to cancel this repair? This action cannot be undone.",
    );
    if (!result.isConfirmed) return;

    try {
      setUpdating(true);
      await axios.put(
        `${backendUrl}/api/admin/repairs/records/${repairId}/cancel`,
      );
      setRepair({
        ...repair,
        repair_status: "cancelled",
        request_status: "rejected",
      });
      toast.success("Repair cancelled successfully.");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to cancel repair. Please try again later.";
      toast.error(message);
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchRepairDetail();
    fetchTechnicians();
  }, [repairId]);

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

  if (error || !repair) {
    return (
      <Container className="mt-5">
        <Card className="border-danger">
          <Card.Body className="text-danger text-center">
            <p className="mb-3">{error || "Repair not found"}</p>
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
          <h4 className="text-white">Repair #{repair.repair_id}</h4>
        </Col>
        <Col className="text-end">
          <Button variant="dark" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Col>
      </Row>

      <Row className="g-3">
        {/* Repair Summary */}
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold">
              Repair Summary
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <p className="mb-2">
                    <strong>Repair ID:</strong> {repair.repair_id}
                  </p>
                  <p className="mb-2">
                    <strong>Request ID:</strong> {repair.repair_requests_id}
                  </p>
                </Col>
                <Col md={4}>
                  <div className="mb-2">
                    <strong>Status:</strong>
                    <Form.Select
                      value={repair.repair_status}
                      size="sm"
                      onChange={(e) => handleStatusChange(e.target.value)}
                      disabled={
                        updating || repair.repair_status === "cancelled"
                      }
                      className={`mt-1 fw-semibold w-auto ${getRepairStatusBadge(repair.repair_status)}`}
                    >
                      {repairStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div className="mb-2">
                    <strong>Total Cost:</strong>
                    {editing ? (
                      <Form.Control
                        type="number"
                        size="sm"
                        value={editedValues.totalCost}
                        onChange={(e) =>
                          setEditedValues({
                            ...editedValues,
                            totalCost: e.target.value,
                          })
                        }
                        className="mt-1"
                        min="0"
                        step="0.01"
                      />
                    ) : (
                      <span className="ms-2">
                        Rs. {Number(repair.total_cost).toLocaleString()}
                      </span>
                    )}
                  </div>
                </Col>
                <Col md={4}>
                  <p className="mb-2">
                    <strong>Appointment:</strong>{" "}
                    {dayjs(repair.appointment_date).format("YYYY-MM-DD HH:mm")}
                  </p>
                  <p className="mb-2">
                    <strong>Request Status:</strong>{" "}
                    <Badge bg={getRequestStatusBadge(repair.request_status)}>
                      {repair.request_status.charAt(0).toUpperCase() +
                        repair.request_status.slice(1)}
                    </Badge>
                  </p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={12} className="mb-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Repair Details</span>
                    {!editing ? (
                      <Button
                        variant="none"
                        size="sm"
                        onClick={() => setEditing(true)}
                        disabled={updating}
                        className="btn_main_light_outline"
                      >
                        Edit Details
                      </Button>
                    ) : (
                      <div>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={handleSaveDetails}
                          disabled={updating}
                          className="me-2"
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={handleCancelEdit}
                          disabled={updating}
                          className="fw-bold"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Identified Issue</strong>
                    {editing ? (
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={editedValues.identifiedIssue}
                        onChange={(e) =>
                          setEditedValues({
                            ...editedValues,
                            identifiedIssue: e.target.value,
                          })
                        }
                        className="mt-2"
                      />
                    ) : (
                      <p className="mb-0 fw-semibold">
                        {repair.identified_issue}
                      </p>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Identified Device</strong>
                    {editing ? (
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={editedValues.identifiedDevice}
                        onChange={(e) =>
                          setEditedValues({
                            ...editedValues,
                            identifiedDevice: e.target.value,
                          })
                        }
                        className="mt-2"
                      />
                    ) : (
                      <p className="mb-0 fw-semibold">
                        {repair.identified_device}
                      </p>
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Original Request */}
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold">
              Original Request
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Issue Description</strong>
                    <p className="mb-0 fw-semibold">
                      {repair.issue_description}
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Device Info</strong>
                    <p className="mb-0 fw-semibold">{repair.device_info}</p>
                  </div>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Created At</strong>
                    <p className="mb-0 fw-semibold">
                      {dayjs(repair.request_created_at).format(
                        "YYYY-MM-DD HH:mm:ss",
                      )}
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong className="text-muted">Updated At</strong>
                    <p className="mb-0 fw-semibold">
                      {dayjs(repair.request_updated_at).format(
                        "YYYY-MM-DD HH:mm:ss",
                      )}
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Customer Info */}
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold">
              Customer Information
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p className="mb-2">
                    <strong>Customer ID:</strong> {repair.customer_id}
                  </p>
                  <p className="mb-2">
                    <strong>Name:</strong> {repair.customer_name}
                  </p>
                </Col>
                <Col md={6}>
                  <p className="mb-2">
                    <strong>Email:</strong> {repair.customer_email}
                  </p>
                  <p className="mb-0">
                    <strong>Phone:</strong> {repair.customer_phone}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Technician Info */}
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-secondary-subtle fw-semibold">
              Technician Information
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p className="mb-2">
                    <strong>Technician ID:</strong> {repair.technician_id}
                  </p>
                  <p className="mb-2">
                    <strong>Name:</strong> {repair.technician_name}
                  </p>
                </Col>
                <Col md={6}>
                  <p className="mb-2">
                    <strong>Email:</strong> {repair.technician_email}
                  </p>
                  <p className="mb-0">
                    <strong>Phone:</strong> {repair.technician_phone}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Danger Zone */}
        {hasPermission(userData?.userRole, "repair:danger-zone") &&
          repair.repair_status !== "cancelled" && (
            /* Show Danger Zone only to admin users */
            <Col xs={12}>
              <Card className="shadow-sm border-danger">
                <Card.Header className="bg-danger-subtle fw-semibold text-danger">
                  Danger Zone
                </Card.Header>
                <Card.Body>
                  <Row>
                    {/* Change Technician */}
                    <Col md={6} className="mb-3">
                      <div className="border p-3 rounded">
                        <h6 className="fw-bold text-muted mb-3">
                          Change Technician
                        </h6>
                        <Form.Group className="mb-2">
                          <Form.Label className="text-muted">
                            Select New Technician
                          </Form.Label>
                          <Form.Select
                            value={selectedTechnicianId}
                            onChange={(e) =>
                              setSelectedTechnicianId(e.target.value)
                            }
                            disabled={updating}
                          >
                            <option value="">-- Select a Technician --</option>
                            {technicians.map((tech) => (
                              <option key={tech.staff_id} value={tech.staff_id}>
                                {tech.first_name} {tech.last_name} ({tech.email}
                                )
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={handleUpdateTechnician}
                          disabled={updating}
                          className="fw-bold"
                        >
                          Update Technician
                        </Button>
                      </div>
                    </Col>

                    {/* Cancel Repair */}
                    <Col md={6} className="mb-3">
                      <div className="border border-danger p-3 rounded">
                        <h6 className="fw-bold text-danger mb-3">
                          Cancel Repair
                        </h6>
                        <p className="text-muted mb-3 small">
                          This will cancel the repair and reject the repair
                          request. This action cannot be undone.
                        </p>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={handleCancelRepair}
                          disabled={updating}
                          className="fw-bold"
                        >
                          Cancel Repair
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          )}
      </Row>
    </Container>
  );
}

export default RepairProfile;
