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
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

function MyRepairRequests() {
  const [repairRequests, setRepairRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  /* -----------------------------------------------------------------
        Fetch repair requests on component mount
  --------------------------------------------------------------------*/
  useEffect(() => {
    fetchMyRepairRequests();
  }, []);

  const fetchMyRepairRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/customer/repair/my-requests`,
      );
      setRepairRequests(data.data || []);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        "Failed to fetch repair requests. Please try again.";
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
      pending: "warning",
      accepted: "success",
      rejected: "danger",
    };
    return statusMap[status] || "secondary";
  };

  /* -----------------------------------------------------------------
        Render repair requests table
  --------------------------------------------------------------------*/
  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={5} className="text-center py-3">
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
          <td colSpan={5} className="text-danger text-center">
            {error}
          </td>
        </tr>
      );
    }

    if (repairRequests.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="text-center py-3">
            <span className="text-muted">No repair requests found</span>
          </td>
        </tr>
      );
    }

    return repairRequests.map((request) => (
      <tr key={request.repair_requests_id}>
        <td className="fw-bold">{request.repair_requests_id}</td>
        <td className="text-muted">
          {dayjs(request.appointment_date).format("YYYY-MM-DD HH:mm")}
        </td>
        <td>{request.technician_name}</td>
        <td>
          <Badge bg={getStatusBadge(request.status)}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </Badge>
        </td>
        <td>
          <Button
            variant="none"
            size="sm"
            className="btn_main_dark"
            as={Link}
            to={`/repair/my-requests/${request.repair_requests_id}`}
          >
            View
          </Button>
        </td>
      </tr>
    ));
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h3 className="fw-bold">My Repair Requests</h3>
        </Col>
      </Row>

      <Card className="shadow">
        <Card.Body className="p-0">
          <div className="overflow-y-auto">
            <Table hover striped size="sm" className="mb-0">
              <thead className="position-sticky top-0" style={{ zIndex: 20 }}>
                <tr className="fw-bold bg-light">
                  <th>Request ID</th>
                  <th>Appointment Date</th>
                  <th>Technician</th>
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

export default MyRepairRequests;
