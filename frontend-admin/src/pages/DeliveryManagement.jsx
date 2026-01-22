import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  Container,
  Table,
  Spinner,
  Button,
  Form,
  Badge,
} from "react-bootstrap";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

function DeliveryManagement() {
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [errorAreas, setErrorAreas] = useState("");
  const [errorStaff, setErrorStaff] = useState("");
  const [deliveryAreas, setDeliveryAreas] = useState([]);
  const [deliverPersons, setDeliverPersons] = useState([]);
  const [editingCostId, setEditingCostId] = useState(null);
  const [newCost, setNewCost] = useState("");
  const [editingStaffAreaId, setEditingStaffAreaId] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState("");

  const { backendUrl } = useContext(AppContext);

  /* -----------------------------------------------------------------
        Fetch delivery areas from API
  --------------------------------------------------------------------*/
  const fetchDeliveryAreas = async () => {
    setLoadingAreas(true);
    setErrorAreas("");
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/deliveries/areas`,
      );
      setDeliveryAreas(data.data || []);
    } catch (error) {
      setErrorAreas(
        error?.response?.data?.message ||
          "Failed to fetch delivery areas. Please try again.",
      );
      console.error(error);
    } finally {
      setLoadingAreas(false);
    }
  };

  /* -----------------------------------------------------------------
        Fetch deliver person staff from API
  --------------------------------------------------------------------*/
  const fetchDeliverPersons = async () => {
    setLoadingStaff(true);
    setErrorStaff("");
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/deliveries/staff`,
      );
      setDeliverPersons(data.data || []);
    } catch (error) {
      setErrorStaff(
        error?.response?.data?.message ||
          "Failed to fetch deliver persons. Please try again.",
      );
      console.error(error);
    } finally {
      setLoadingStaff(false);
    }
  };

  /* -----------------------------------------------------------------
        Update delivery area cost
  --------------------------------------------------------------------*/
  const handleUpdateCost = async (areaId) => {
    if (!newCost || isNaN(newCost) || parseFloat(newCost) < 0) {
      toast.error("Please enter a valid cost");
      return;
    }

    try {
      const { data } = await axios.put(
        `${backendUrl}/api/admin/deliveries/areas/${areaId}`,
        { cost: parseFloat(newCost) },
      );

      if (data.success) {
        toast.success(data.message);
        setEditingCostId(null);
        setNewCost("");
        fetchDeliveryAreas();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update cost. Please try again.",
      );
      console.error(error);
    }
  };

  /* -----------------------------------------------------------------
        Update area's assigned staff
  --------------------------------------------------------------------*/
  const handleUpdateAreaStaff = async (areaId) => {
    if (!selectedStaffId) {
      toast.error("Please select a staff member");
      return;
    }

    try {
      const { data } = await axios.put(
        `${backendUrl}/api/admin/deliveries/staff/${selectedStaffId}/area`,
        { areaId: areaId },
      );

      if (data.success) {
        toast.success(data.message);
        setEditingStaffAreaId(null);
        setSelectedStaffId("");
        fetchDeliverPersons();
        fetchDeliveryAreas();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to assign staff. Please try again.",
      );
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDeliveryAreas();
    fetchDeliverPersons();
  }, []);

  /* -----------------------------------------------------------------
        Render delivery areas table
  --------------------------------------------------------------------*/
  const renderAreasTable = () => {
    if (loadingAreas) {
      return (
        <tr>
          <td colSpan={6} className="text-center py-3">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </td>
        </tr>
      );
    }

    if (errorAreas) {
      return (
        <tr>
          <td colSpan={6} className="text-danger text-center">
            {errorAreas}
          </td>
        </tr>
      );
    }

    if (deliveryAreas.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="text-center">
            No delivery areas found
          </td>
        </tr>
      );
    }

    return deliveryAreas.map((area) => (
      <tr key={area.deliver_area_id}>
        <td className="fw-bold">{area.deliver_area_id}</td>
        <td>{area.deliver_area_name}</td>
        <td>
          {editingCostId === area.deliver_area_id ? (
            <Form.Control
              type="number"
              step="0.01"
              value={newCost}
              onChange={(e) => setNewCost(e.target.value)}
              style={{ width: "120px" }}
            />
          ) : (
            <span className="fw-semibold">
              Rs. {Number(area.cost).toLocaleString()}
            </span>
          )}
        </td>
        <td>{area.staff_id || <span className="text-muted">-</span>}</td>
        <td>
          {editingStaffAreaId === area.deliver_area_id ? (
            <Form.Select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              style={{ width: "200px" }}
            >
              <option value="">Select Staff</option>
              {deliverPersons.map((person) => (
                <option key={person.staff_id} value={person.staff_id}>
                  {person.first_name} {person.last_name}
                </option>
              ))}
            </Form.Select>
          ) : (
            <span>
              {area.staff_name || (
                <span className="text-muted">Not assigned</span>
              )}
            </span>
          )}
        </td>
        <td>
          {editingCostId === area.deliver_area_id ? (
            <div className="d-flex gap-2">
              <Button
                size="sm"
                variant="success"
                className="fw-semibold"
                onClick={() => handleUpdateCost(area.deliver_area_id)}
              >
                Save Cost
              </Button>
              <Button
                size="sm"
                variant="outline-danger"
                className="fw-semibold"
                onClick={() => {
                  setEditingCostId(null);
                  setNewCost("");
                }}
              >
                Cancel
              </Button>
            </div>
          ) : editingStaffAreaId === area.deliver_area_id ? (
            <div className="d-flex gap-2">
              <Button
                size="sm"
                variant="success"
                className="fw-semibold"
                onClick={() => handleUpdateAreaStaff(area.deliver_area_id)}
              >
                Assign Staff
              </Button>
              <Button
                size="sm"
                variant="outline-danger"
                className="fw-semibold"
                onClick={() => {
                  setEditingStaffAreaId(null);
                  setSelectedStaffId("");
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Button
                size="sm"
                variant="outline-primary"
                className="fw-semibold"
                onClick={() => {
                  setEditingCostId(area.deliver_area_id);
                  setNewCost(area.cost);
                }}
              >
                Edit Cost
              </Button>
              <Button
                size="sm"
                variant="outline-secondary"
                className="fw-semibold"
                onClick={() => {
                  setEditingStaffAreaId(area.deliver_area_id);
                  setSelectedStaffId(area.staff_id || "");
                }}
              >
                Change Staff
              </Button>
            </div>
          )}
        </td>
      </tr>
    ));
  };

  /* -----------------------------------------------------------------
        Render deliver persons table
  --------------------------------------------------------------------*/
  const renderStaffTable = () => {
    if (loadingStaff) {
      return (
        <tr>
          <td colSpan={6} className="text-center py-3">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </td>
        </tr>
      );
    }

    if (errorStaff) {
      return (
        <tr>
          <td colSpan={6} className="text-danger text-center">
            {errorStaff}
          </td>
        </tr>
      );
    }

    if (deliverPersons.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="text-center">
            No deliver persons found
          </td>
        </tr>
      );
    }

    return deliverPersons.map((person) => (
      <tr key={person.staff_id}>
        <td className="fw-bold">{person.staff_id}</td>
        <td>
          {person.first_name} {person.last_name}
        </td>
        <td>{person.email}</td>
        <td>{person.phone_number}</td>
        <td>
          <Badge bg={person.is_active ? "success" : "danger"}>
            {person.is_active ? "Active" : "Inactive"}
          </Badge>
        </td>
        <td>
          <span className="text-primary">
            {person.assigned_areas || (
              <span className="text-muted">Not assigned</span>
            )}
          </span>
        </td>
      </tr>
    ));
  };

  return (
    <Container>
      {/* Delivery Areas Table */}
      <Container className="bg-secondary-subtle rounded shadow py-3 mt-3">
        <Container className="mb-3">
          <h4 className="mb-0">Delivery Areas</h4>
        </Container>
        <Container className="overflow-y-auto" style={{ maxHeight: "40vh" }}>
          <Table hover striped size="sm" className="shadow">
            <thead className="position-sticky top-0" style={{ zIndex: 20 }}>
              <tr className="fw-bold">
                <th>Area ID</th>
                <th>Area Name</th>
                <th>Cost</th>
                <th>Staff ID</th>
                <th>Assigned Staff</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{renderAreasTable()}</tbody>
          </Table>
        </Container>
      </Container>

      {/* Deliver Persons Table */}
      <Container className="bg-secondary-subtle rounded shadow py-3 mt-3">
        <Container className="mb-3">
          <h4 className="mb-0">Deliver Persons</h4>
        </Container>
        <Container className="overflow-y-auto" style={{ maxHeight: "40vh" }}>
          <Table hover striped size="sm" className="shadow">
            <thead className="position-sticky top-0" style={{ zIndex: 20 }}>
              <tr className="fw-bold">
                <th>Staff ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Assigned Areas</th>
              </tr>
            </thead>
            <tbody>{renderStaffTable()}</tbody>
          </Table>
        </Container>
      </Container>
    </Container>
  );
}

export default DeliveryManagement;
