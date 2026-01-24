import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Table, Spinner, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function RepairManagement() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [repairs, setRepairs] = useState([]);

  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  /* -----------------------------------------------------------------
        Fetch all repair requests from API
  --------------------------------------------------------------------*/
  const fetchRepairs = async () => {
    try {
      setLoading(true);
      setError("");
      setRepairs([]);

      const { data } = await axios.get(`${backendUrl}/api/admin/repairs`);
      setRepairs(data.data);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to fetch repair requests. Please try again later.";
      setError(message);
      toast.error(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------------------------------
        Get badge variant based on status
  --------------------------------------------------- */
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: "primary",
      accepted: "success",
      rejected: "danger",
    };
    return statusMap[status] || "secondary";
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  /* -----------------------------------------------------------------
        Render repairs data into table
  --------------------------------------------------------------------*/
  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={7} className="text-center py-3">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={7} className="text-danger text-center">
            {error}
          </td>
        </tr>
      );
    }

    if (repairs.length === 0) {
      return (
        <tr>
          <td colSpan={7} className="text-danger text-center">
            No repair requests found
          </td>
        </tr>
      );
    }

    return repairs.map((repair) => (
      <tr key={repair.repair_requests_id}>
        <td className="fw-bold">{repair.repair_requests_id}</td>
        <td className="text-muted">
          {dayjs(repair.appointment_date).format("YYYY-MM-DD HH:mm")}
        </td>
        <td>{repair.issue_description}</td>
        <td className="text-muted">{repair.device_info}</td>
        <td className="fw-medium">{repair.technician_name}</td>
        <td>
          <Badge bg={getStatusBadge(repair.status)}>
            {repair.status.charAt(0).toUpperCase() + repair.status.slice(1)}
          </Badge>
        </td>
        <td>
          <Link to={`request-profile/${repair.repair_requests_id}`}>
            <i
              role="button"
              className="bi-arrow-up-right-square text-primary action_icon"
              title="View Details"
            ></i>
          </Link>
        </td>
      </tr>
    ));
  };

  return (
    <Container>
      <Container className="bg-secondary-subtle rounded shadow py-3 mt-3">
        <Container className="mb-3">
          <div className="d-flex align-items-center justify-content-between">
            <h4 className="mb-0">Repair Requests</h4>
            <Button
              variant="none"
              onClick={() => navigate("repairs-listing")}
              className="btn_main_light_outline"
            >
              <i className="bi bi-caret-right-square-fill me-1"></i>
              Go to Repairs
            </Button>
          </div>
        </Container>
        <Container className="overflow-y-auto" style={{ maxHeight: "75vh" }}>
          <Table hover striped size="sm" className="shadow">
            <thead className="position-sticky top-0" style={{ zIndex: 20 }}>
              <tr className="fw-bold">
                <th>Request ID</th>
                <th>Appointment Date</th>
                <th>Issue Description</th>
                <th>Device</th>
                <th>Technician</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </Table>
        </Container>
      </Container>
    </Container>
  );
}

export default RepairManagement;
