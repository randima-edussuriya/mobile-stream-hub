import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Table, Spinner, Button } from "react-bootstrap";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { hasPermission } from "../../utils/permissions";
import { confirmAction } from "../../utils/confirmAction";

function LeaveManagement() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [leaves, setLeaves] = useState([]);

  const { backendUrl, userData } = useContext(AppContext);
  const navigate = useNavigate();

  /* -----------------------------------------------------------------
        Fetch all leave request records from API
  --------------------------------------------------------------------*/
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError("");
      setLeaves([]);

      const { data } = await axios.get(`${backendUrl}/api/admin/leaves`);
      setLeaves(data.data);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to fetch leave requests. Please try again later.";
      setError(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  /* -----------------------------------------------------------------
        Get status badge class
  --------------------------------------------------------------------*/
  const getStatusBadge = (status) => {
    const badgeClass = {
      pending: "bg-warning text-dark",
      approved: "bg-success",
      rejected: "bg-danger",
    };
    return badgeClass[status] || "bg-secondary";
  };

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

    if (leaves.length === 0) {
      return (
        <tr>
          <td colSpan={7} className="text-danger text-center">
            No leave requests found
          </td>
        </tr>
      );
    }

    return leaves.map((leave) => (
      <tr key={leave.leave_request_id}>
        <td className="fw-bold">{leave.leave_request_id}</td>
        <td>{leave.reason}</td>
        <td className="text-muted">
          {dayjs(leave.start_date).format("YYYY-MM-DD HH:mm")}
        </td>
        <td className="text-muted">
          {dayjs(leave.end_date).format("YYYY-MM-DD HH:mm")}
        </td>
        <td className="text-muted">{leave.requested_by_name}</td>
        <td>
          <span className={`badge ${getStatusBadge(leave.status)}`}>
            {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
          </span>
        </td>
        <td>
          <Link to={`profile/${leave.leave_request_id}`}>
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
            <h4 className="mb-0">Leave Requests</h4>
            {hasPermission(userData.userRole, "leave:add") && (
              <Button
                onClick={() => navigate("add")}
                size="sm"
                className="btn_main_dark shadow"
              >
                <i className="bi bi-plus-circle me-2 fs-6"></i>
                Add New
              </Button>
            )}
          </div>
        </Container>
        <Container className="overflow-y-auto" style={{ maxHeight: "75vh" }}>
          <Table hover striped size="sm" className="shadow">
            <thead className="position-sticky top-0" style={{ zIndex: 20 }}>
              <tr className="fw-bold">
                <th>Leave ID</th>
                <th>Reason</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Requested By</th>
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

export default LeaveManagement;
