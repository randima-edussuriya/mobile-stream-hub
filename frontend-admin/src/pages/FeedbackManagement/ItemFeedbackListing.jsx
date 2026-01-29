import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Container, Table, Spinner, Badge } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function ItemFeedbackListing() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  const { backendUrl } = useContext(AppContext);

  /* -----------------------------------------------------------------
        Fetch all item feedbacks from API
  --------------------------------------------------------------------*/
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError("");
      setFeedbacks([]);

      const { data } = await axios.get(`${backendUrl}/api/admin/feedbacks`);
      setFeedbacks(data.data);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to fetch feedbacks. Please try again later.";
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
      pending: "secondary",
      accepted: "success",
      rejected: "danger",
    };
    return statusMap[status] || "secondary";
  };

  /* -----------------------------------------------------------------
        Get rating color based on value
  --------------------------------------------------- */
  const getRatingColor = (rating) => {
    const rate = Number(rating);
    if (rate >= 4.5) return "success";
    if (rate >= 3.5) return "warning";
    return "danger";
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  /* -----------------------------------------------------------------
        Render feedbacks data into table
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

    if (feedbacks.length === 0) {
      return (
        <tr>
          <td colSpan={7} className="text-danger text-center">
            No feedbacks found
          </td>
        </tr>
      );
    }

    return feedbacks.map((feedback) => (
      <tr key={feedback.feedback_id}>
        <td className="fw-bold">{feedback.feedback_id}</td>
        <td className="text-muted">
          {dayjs(feedback.feedback_date).format("YYYY-MM-DD HH:mm:ss")}
        </td>
        <td className="text-truncate" style={{ maxWidth: "300px" }}>
          {feedback.message.substring(0, 50)}...
        </td>
        <td className="fw-medium">{feedback.item_name}</td>
        <td>
          <Badge bg={getRatingColor(feedback.rating)}>
            {Number(feedback.rating).toFixed(1)}
          </Badge>
        </td>
        <td>
          <Badge bg={getStatusBadge(feedback.status)}>
            {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
          </Badge>
        </td>
        <td>
          <Link to={`item/${feedback.feedback_id}`}>
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
            <h4 className="mb-0">Item Feedbacks</h4>
          </div>
        </Container>

        <Container className="overflow-y-auto" style={{ maxHeight: "75vh" }}>
          <Table hover striped size="sm" className="shadow">
            <thead className="position-sticky top-0" style={{ zIndex: 20 }}>
              <tr className="fw-bold">
                <th>Feedback ID</th>
                <th>Date</th>
                <th>Message</th>
                <th>Item</th>
                <th>Rating</th>
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

export default ItemFeedbackListing;
