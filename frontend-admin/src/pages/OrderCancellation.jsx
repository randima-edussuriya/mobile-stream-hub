import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Container, Table, Spinner, Badge } from "react-bootstrap";
import { AppContext } from "../context/AppContext";
import dayjs from "dayjs";

function OrderCancellation() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellations, setCancellations] = useState([]);

  const { backendUrl } = useContext(AppContext);

  /* -----------------------------------------------------------------
        Fetch cancellations from API
  --------------------------------------------------------------------*/
  const fetchCancellations = async () => {
    setLoading(true);
    setError("");
    setCancellations([]);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/orders/cancellations/list`,
      );
      setCancellations(data.data);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again later.",
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCancellations();
  }, []);

  /*-------------------------------------------------
        get badge variant based on cancellation status
  --------------------------------------------------- */
  const getStatusBadge = (status) => {
    const statusMap = {
      cancelled: "dark",
    };
    return statusMap[status] || "secondary";
  };

  /*-------------------------------------------------
        get badge variant based on user_type
  --------------------------------------------------- */
  const getUserTypeBadge = (userType) => {
    const typeMap = {
      staff: "primary",
      customer: "success",
    };
    return typeMap[userType] || "secondary";
  };

  /* -----------------------------------------------------------------
        Render cancellations data into table
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

    if (cancellations.length === 0) {
      return (
        <tr>
          <td colSpan={7} className="text-danger text-center">
            No cancellations found
          </td>
        </tr>
      );
    }

    return cancellations.map((cancellation) => (
      <tr key={cancellation.cancel_id}>
        <td className="fw-bold">{cancellation.order_id}</td>
        <td className="text-muted">
          {dayjs(cancellation.cancel_date).format("YYYY-MM-DD HH:mm:ss")}
        </td>
        <td>
          <Badge bg={getUserTypeBadge(cancellation.user_type)}>
            {cancellation.user_type}
          </Badge>
        </td>
        <td className="fw-semibold">{cancellation.user_id}</td>
        <td>
          <Badge bg={getStatusBadge(cancellation.status)}>
            {cancellation.status}
          </Badge>
        </td>
        <td>{cancellation.reason}</td>
      </tr>
    ));
  };

  return (
    <Container>
      <Container className="bg-secondary-subtle rounded shadow py-3 mt-3">
        <Container className="mb-3">
          <h4>Order Cancellations</h4>
        </Container>
        <Container className="overflow-y-auto" style={{ maxHeight: "75vh" }}>
          <Table hover striped size="sm" className="shadow">
            <thead className="position-sticky top-0" style={{ zIndex: 20 }}>
              <tr className="fw-bold">
                <th>Order ID</th>
                <th>Cancelled Date</th>
                <th>Peformed By</th>
                <th>User ID</th>
                <th>Status</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </Table>
        </Container>
      </Container>
    </Container>
  );
}

export default OrderCancellation;
