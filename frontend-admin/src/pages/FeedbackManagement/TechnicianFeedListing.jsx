import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Container, Table, Spinner, Badge, Button } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function TechnicianFeedListing() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  /* -----------------------------------------------------------------
        Fetch all technician feedbacks from API
  --------------------------------------------------------------------*/
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError("");
      setFeedbacks([]);

      const { data } = await axios.get(
        `${backendUrl}/api/admin/feedbacks/technicians`,
      );
      setFeedbacks(data.data);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to fetch technician feedbacks. Please try again later.";
      setError(message);
      toast.error(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------------------------------
        Get rating color based on value
  --------------------------------------------------- */
  const getRatingColor = (rating) => {
    const rate = Number(rating);
    if (rate >= 4.5) return "success";
    if (rate >= 3.5) return "warning text-dark";
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

    if (feedbacks.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="text-danger text-center">
            No technician feedbacks found
          </td>
        </tr>
      );
    }

    return feedbacks.map((feedback) => (
      <tr key={feedback.staff_id}>
        <td className="fw-bold">{feedback.staff_id}</td>
        <td className="fw-medium">{feedback.technician_name}</td>
        <td>
          <Badge bg={getRatingColor(feedback.average_rating)}>
            {Number(feedback.average_rating).toFixed(1)}
          </Badge>
        </td>
        <td className="text-muted">{feedback.total_feedbacks} reviews</td>
        <td>
          <Link
            to={`/feedback-management/technician-feedback/${feedback.staff_id}`}
          >
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
            <h4 className="mb-0">Technician Feedbacks</h4>
            <Button
              variant="none"
              size="sm"
              onClick={() => navigate("/feedback-management")}
              className="btn_main_light_outline"
            >
              <i className="bi bi-caret-right-square-fill me-1"></i>
              Go to Item Feedback
            </Button>
          </div>
        </Container>

        <Container className="overflow-y-auto" style={{ maxHeight: "75vh" }}>
          <Table hover striped size="sm" className="shadow">
            <thead className="position-sticky top-0" style={{ zIndex: 20 }}>
              <tr className="fw-bold">
                <th>Technician ID</th>
                <th>Name</th>
                <th>Average Rating</th>
                <th>Total Reviews</th>
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

export default TechnicianFeedListing;
