import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Table, Spinner } from "react-bootstrap";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function DayOffManagement() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dayOffs, setDayOffs] = useState([]);

  const { backendUrl } = useContext(AppContext);

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
          <Link to={`profile/${dayOff.day_off_id}`}>
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
          <h4>Day Off Records</h4>
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
