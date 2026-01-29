import axios from "axios";
import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Spinner,
  Badge,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

function OrderManagement() {
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [assignedAreas, setAssignedAreas] = useState([]);

  const { backendUrl, userData } = useContext(AppContext);

  // Determine if the user is a deliver person
  const isDeliverPerson = userData?.userRole === "deliver person";

  const navigate = useNavigate();

  /* -----------------------------------------------------------------
        Fetch orders from API with optional filters
  --------------------------------------------------------------------*/
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      setOrders([]);
      const params = {};

      if (selectedDistrict) params.district = selectedDistrict;
      if (selectedStatus) params.status = selectedStatus;

      const { data } = await axios.get(`${backendUrl}/api/admin/orders`, {
        params,
      });
      setOrders(data.data);
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

  /* -----------------------------------------------------------------
        Fetch districts from API for filter options
  --------------------------------------------------------------------*/
  const fetchDistricts = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/orders/districts/list`,
      );
      setDistricts(data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  /* -----------------------------------------------------------------
        Fetch order statuses from API for filter options
  --------------------------------------------------------------------*/
  const fetchStatuses = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/orders/statuses/list`,
      );
      setStatuses(data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  /* -----------------------------------------------------------------
        Fetch assigned delivery areas for deliver person
  --------------------------------------------------------------------*/
  const fetchAssignedAreas = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/deliveries/area-assigned`,
      );
      setAssignedAreas(data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  /*-------------------------------------------------
        get badge variant based on status
  --------------------------------------------------- */
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: "dark",
      "packaging in progress": "secondary",
      "ready for pickup": "info text-dark",
      "ready for delivery": "primary",
      dispatched: "warning text-dark",
      delivered: "success",
      cancelled: "danger",
    };
    return statusMap[status] || "secondary";
  };

  useEffect(() => {
    fetchDistricts();

    if (isDeliverPerson) {
      setStatuses(["ready for delivery"]);
      setSelectedStatus("ready for delivery");
      fetchAssignedAreas();
    } else {
      fetchStatuses();
    }
  }, [isDeliverPerson]);

  useEffect(() => {
    if (!selectedStatus && isDeliverPerson) return;
    fetchOrders();
  }, [selectedDistrict, selectedStatus, isDeliverPerson]);

  /* -----------------------------------------------------------------
        Render orders data into table
  --------------------------------------------------------------------*/
  const renderTableBody = () => {
    if (Loading) {
      return (
        <tr>
          <td colSpan={11} className="text-center py-3">
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
          <td colSpan={11} className="text-danger text-center">
            {error}
          </td>
        </tr>
      );
    }

    if (orders.length === 0) {
      return (
        <tr>
          <td colSpan={11} className="text-danger text-center">
            No orders found
          </td>
        </tr>
      );
    }

    return orders.map((order) => (
      <tr key={order.order_id}>
        <td className="fw-bold">{order.order_id}</td>
        <td className="text-muted">
          {dayjs(order.order_date).format("YYYY-MM-DD HH:mm:ss")}
        </td>
        <td className="fw-semibold">{Number(order.total).toLocaleString()}</td>
        <td>
          <Badge bg={getStatusBadge(order.status)}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </td>
        <td>{order.payment_method}</td>
        <td>{order.district}</td>
        <td>{order.customer_id}</td>
        <td>
          <div className="d-flex gap-3 align-items-center">
            <Link to={`profile/${order.order_id}`}>
              <i
                role="button"
                title="View Details"
                className="bi-arrow-up-right-square text-primary action_icon"
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
          <Row className="align-items-center">
            <Col>
              <h4 className="mb-0">Orders</h4>
            </Col>
            {isDeliverPerson && assignedAreas.length > 0 && (
              <Col xs="auto">
                <span>Your assigned areas: </span>
                <span className="fw-bold text-success">
                  {assignedAreas.join(", ")}
                </span>
              </Col>
            )}
            <Col xs="auto">
              <Form.Select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                }}
              >
                <option value="">All Districts</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col xs="auto">
              <Form.Select
                value={selectedStatus}
                disabled={isDeliverPerson}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                }}
              >
                <option value="">All Statuses</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Container>
        <Container className="overflow-y-auto" style={{ maxHeight: "75vh" }}>
          <Table hover striped size="sm" className="shadow">
            <thead className="position-sticky top-0" style={{ zIndex: 20 }}>
              <tr className="fw-bold">
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment Method</th>
                <th>District</th>
                <th>Customer ID</th>
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

export default OrderManagement;
