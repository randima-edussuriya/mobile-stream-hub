import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  Container,
  Table,
  Spinner,
  Badge,
  Card,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

function MyRepairs() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { backendUrl } = useContext(AppContext);

  /* -----------------------------------------------------------------
        Fetch repairs on component mount
  --------------------------------------------------------------------*/
  useEffect(() => {
    fetchMyRepairs();
  }, []);

  const fetchMyRepairs = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/customer/repair/my-repairs`,
      );
      setRepairs(data.data || []);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        "Failed to fetch repairs. Please try again.";
      setError(errorMsg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------------------------------
        Get status badge variant
  --------------------------------------------------------------------*/
  const getStatusBadge = (status) => {
    const statusMap = {
      "diagnostics completed": "primary",
      "repair in progress": "warning",
      "repair completed": "success",
    };
    return statusMap[status] || "secondary";
  };

  /* -----------------------------------------------------------------
        Render repairs table
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
          <td colSpan={6} className="text-center py-3">
            <span className="text-muted">No repairs found</span>
          </td>
        </tr>
      );
    }

    return repairs.map((repair) => (
      <tr key={repair.repair_id}>
        <td className="fw-bold">{repair.repair_id}</td>
        <td className="text-muted">
          {dayjs(repair.appointment_date).format("YYYY-MM-DD HH:mm")}
        </td>
        <td>{repair.technician_name}</td>
        <td className="fw-medium">
          {repair.identified_device || "Not yet identified"}
        </td>
        <td>
          <Badge bg={getStatusBadge(repair.status)}>
            {repair.status.charAt(0).toUpperCase() + repair.status.slice(1)}
          </Badge>
        </td>
        <td>
          <Link to={`/repair/${repair.repair_id}`}>
            <i
              role="button"
              title="View Details"
              className="bi-arrow-up-right-square text-primary action_icon"
            ></i>
          </Link>
        </td>
      </tr>
    ));
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h4 className="fw-semibold">My Repairs</h4>
        </Col>
      </Row>

      <Card className="shadow">
        <Card.Body className="p-0">
          <div className="overflow-y-auto">
            <Table hover striped size="sm" className="mb-0">
              <thead className="position-sticky top-0" style={{ zIndex: 20 }}>
                <tr className="fw-bold bg-light">
                  <th>Repair ID</th>
                  <th>Appointment Date</th>
                  <th>Technician</th>
                  <th>Identified Device</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{renderTableBody()}</tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default MyRepairs;
