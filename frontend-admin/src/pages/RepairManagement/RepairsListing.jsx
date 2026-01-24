import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Container, Table, Spinner, Badge, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import dayjs from "dayjs";

function RepairsListing() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [repairs, setRepairs] = useState([]);

  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  /* -----------------------------------------------------------------
        Fetch all repairs from API
  --------------------------------------------------------------------*/
  const fetchRepairs = async () => {
    try {
      setLoading(true);
      setError("");
      setRepairs([]);

      const { data } = await axios.get(
        `${backendUrl}/api/admin/repairs/records`,
      );
      setRepairs(data.data);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to fetch repairs. Please try again later.";
      setError(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------------------------------
        Get badge variant based on repair status
  --------------------------------------------------- */
  const getStatusBadge = (status) => {
    const statusMap = {
      "diagnostics completed": "primary",
      "repair in progress": "warning",
      "repair completed": "success",
      "cancelled": "danger",
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
          <td colSpan={6} className="text-center py-3">
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
          <td colSpan={6} className="text-danger text-center">
            {error}
          </td>
        </tr>
      );
    }

    if (repairs.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="text-danger text-center">
            No repairs found
          </td>
        </tr>
      );
    }

    return repairs.map((repair) => (
      <tr key={repair.repair_id}>
        <td className="fw-bold">{repair.repair_id}</td>
        <td className="fw-semibold">{repair.repair_requests_id}</td>
        <td>
          <Badge bg={getStatusBadge(repair.repair_status)}>
            {repair.repair_status}
          </Badge>
        </td>
        <td className="fw-semibold">
          Rs. {Number(repair.total_cost).toLocaleString()}
        </td>
        <td>{repair.technician_name}</td>
        <td className="text-muted">
          {dayjs(repair.appointment_date).format("YYYY-MM-DD HH:mm")}
        </td>
        <td>
          <Link to={`../repair-profile/${repair.repair_id}`}>
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
            <h4 className="mb-0">Repairs</h4>
            <Button
              variant="none"
              onClick={() => navigate("/repair-management")}
              className="btn_main_light_outline"
            >
              <i className="bi bi-caret-right-square-fill me-1"></i>
              Go to Repair Requests
            </Button>
          </div>
        </Container>
        <Container className="overflow-y-auto" style={{ maxHeight: "75vh" }}>
          <Table hover striped size="sm" className="shadow">
            <thead className="position-sticky top-0" style={{ zIndex: 20 }}>
              <tr className="fw-bold">
                <th>Repair ID</th>
                <th>Request ID</th>
                <th>Status</th>
                <th>Total Cost</th>
                <th>Technician</th>
                <th>Appointment</th>
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

export default RepairsListing;
