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

function DayOffManagement() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dayOffs, setDayOffs] = useState([]);

  const { backendUrl, userData } = useContext(AppContext);
  const navigate = useNavigate();

  /* -----------------------------------------------------------------
        Fetch all day off records from API
  --------------------------------------------------------------------*/
  const fetchDayOffs = async () => {
    try {
      setLoading(true);
      setError("");
      setDayOffs([]);

      const { data } = await axios.get(`${backendUrl}/api/admin/day-offs`);
      setDayOffs(data.data);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to fetch day off records. Please try again later.";
      setError(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDayOffs();
  }, []);

  /* -----------------------------------------------------------------
        Delete day off record
  --------------------------------------------------------------------*/
  const handleDelete = async (dayOffId) => {
    const result = await confirmAction(
      "Are you sure you want to delete this day off record?",
    );
    if (!result.isConfirmed) return;

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/admin/day-offs/${dayOffId}`,
      );

      if (data.success) {
        toast.success(data.message || "Day off record deleted successfully");
        fetchDayOffs();
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to delete day off record. Please try again later.";
      toast.error(message);
      console.error(error);
    }
  };

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

    if (dayOffs.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="text-danger text-center">
            No day off records found
          </td>
        </tr>
      );
    }

    return dayOffs.map((dayOff) => (
      <tr key={dayOff.day_off_id}>
        <td className="fw-bold">{dayOff.day_off_id}</td>
        <td>{dayOff.reason}</td>
        <td className="text-muted">
          {dayjs(dayOff.start_date).format("YYYY-MM-DD HH:mm")}
        </td>
        <td className="text-muted">
          {dayjs(dayOff.end_date).format("YYYY-MM-DD HH:mm")}
        </td>
        <td className="text-muted">{dayOff.created_by_name}</td>
        <td>
          <div className="d-flex gap-3 align-items-center">
            <i
              role="button"
              title="Delete Day Off"
              className="bi bi-trash text-danger action_icon"
              onClick={() => handleDelete(dayOff.day_off_id)}
            ></i>
            <Link to={`profile/${dayOff.day_off_id}`}>
              <i
                role="button"
                className="bi-arrow-up-right-square text-primary action_icon"
                title="View Details"
              ></i>
            </Link>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <Container>
      <Container className="bg-secondary-subtle rounded shadow py-3 mt-3">
        <Container className="mb-3">
          <div className="d-flex align-items-center justify-content-between">
            <h4 className="mb-0">Day Off Records</h4>
            {hasPermission(userData.userRole, "dayoff:add") && (
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
                <th>Day Off ID</th>
                <th>Reason</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Created By</th>
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

export default DayOffManagement;
