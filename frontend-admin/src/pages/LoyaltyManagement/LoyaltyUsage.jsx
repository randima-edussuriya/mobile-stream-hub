import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Container, Table, Spinner, Badge, Button } from "react-bootstrap";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function LoyaltyUsage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [programs, setPrograms] = useState([]);

  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  /* -----------------------------------------------------------------
        Fetch loyalty programs from API
  --------------------------------------------------------------------*/
  const fetchLoyaltyPrograms = async () => {
    try {
      setLoading(true);
      setError("");
      setPrograms([]);

      const { data } = await axios.get(
        `${backendUrl}/api/admin/loyalty/programs`,
      );
      setPrograms(data.data);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to fetch loyalty programs. Please try again later.";
      setError(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoyaltyPrograms();
  }, []);

  /* -----------------------------------------------------------------
        Get badge color based on badge value
  --------------------------------------------------------------------*/
  const getBadgeColor = (badge) => {
    switch (badge) {
      case "silver":
        return "secondary";
      case "gold":
        return "warning";
      case "platinum":
        return "info";
      default:
        return "light text-dark";
    }
  };

  /* -----------------------------------------------------------------
        Render programs data into table
  --------------------------------------------------------------------*/
  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={8} className="text-center py-3">
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
          <td colSpan={8} className="text-danger text-center">
            {error}
          </td>
        </tr>
      );
    }

    if (programs.length === 0) {
      return (
        <tr>
          <td colSpan={8} className="text-danger text-center">
            No loyalty programs found
          </td>
        </tr>
      );
    }

    return programs.map((program) => (
      <tr key={program.loyalty_id}>
        <td className="fw-bold">{program.loyalty_id}</td>
        <td>{program.customer_id}</td>
        <td className="text-center">{program.total_points}</td>
        <td className="text-center">{program.points_redeemed}</td>
        <td className="text-center">{program.current_points}</td>
        <td className="text-center">
          <Badge bg={getBadgeColor(program.badge)}>
            {program.badge ? program.badge.toUpperCase() : "NO BADGE"}
          </Badge>
        </td>
      </tr>
    ));
  };

  return (
    <Container>
      <Container className="bg-secondary-subtle rounded shadow py-3 mt-3">
        <Container className="mb-3">
          <div className="d-flex align-items-center justify-content-between">
            <h4 className="mb-0">Loyalty Program Usage</h4>
            <Button variant="dark" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        </Container>
        <Container className="overflow-y-auto" style={{ maxHeight: "75vh" }}>
          <Table hover striped size="sm" className="shadow">
            <thead className="position-sticky top-0" style={{ zIndex: 20 }}>
              <tr className="fw-bold">
                <th>ID</th>
                <th>Customer ID</th>
                <th className="text-center">Total Points</th>
                <th className="text-center">Points Redeemed</th>
                <th className="text-center">Current Points</th>
                <th className="text-center">Badge</th>
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </Table>
        </Container>
      </Container>
    </Container>
  );
}

export default LoyaltyUsage;
