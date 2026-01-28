import axios from "axios";
import { useEffect, useState, useContext } from "react";
import {
  Container,
  Table,
  Spinner,
  Badge,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { AppContext } from "../context/AppContext";
import dayjs from "dayjs";

function CouponsLoyalty() {
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [loyaltyProgram, setLoyaltyProgram] = useState(null);
  const [loyaltyLoading, setLoyaltyLoading] = useState(true);
  const [loyaltyError, setLoyaltyError] = useState("");
  const [couponError, setCouponError] = useState("");

  const { backendUrl } = useContext(AppContext);

  /* -----------------------------------------------------------------
        Fetch loyalty program data
  --------------------------------------------------------------------*/
  const fetchLoyaltyProgram = async () => {
    try {
      setLoyaltyLoading(true);
      setLoyaltyError("");
      const { data } = await axios.get(
        `${backendUrl}/api/customer/loyalty/my-program`,
      );
      setLoyaltyProgram(data.data);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to fetch loyalty information. Please try again later.";
      setLoyaltyError(message);
      console.error(error);
    } finally {
      setLoyaltyLoading(false);
    }
  };

  /* -----------------------------------------------------------------
        Fetch available coupons from API
  --------------------------------------------------------------------*/
  const fetchAvailableCoupons = async () => {
    try {
      setLoading(true);
      setCouponError("");
      setCoupons([]);

      const { data } = await axios.get(`${backendUrl}/api/customer/coupons`);
      setCoupons(data.data);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to fetch coupons. Please try again later.";
      setCouponError(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoyaltyProgram();
    fetchAvailableCoupons();
  }, []);

  /* -----------------------------------------------------------------
        Get badge color for loyalty tier
  --------------------------------------------------------------------*/
  const getLoyaltyBadgeColor = (badge) => {
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
        Get badge color based on discount type
  --------------------------------------------------------------------*/
  const getDiscountBadgeColor = (discountType) => {
    switch (discountType?.toLowerCase()) {
      case "fixed amount":
        return "success";
      case "free shipping":
        return "primary";
      default:
        return "secondary";
    }
  };

  /* -----------------------------------------------------------------
        Get user group color
  --------------------------------------------------------------------*/
  const getUserGroupColor = (userGroup) => {
    switch (userGroup?.toLowerCase()) {
      case "silver":
        return "secondary";
      case "gold":
        return "warning";
      case "platinum":
        return "info";
      case "all":
        return "success";
      default:
        return "light";
    }
  };

  /* -----------------------------------------------------------------
        Render loyalty program info
  --------------------------------------------------------------------*/
  const renderLoyaltyInfo = () => {
    if (loyaltyLoading) {
      return (
        <Card className="shadow mb-4">
          <Card.Body className="text-center py-3">
            <Spinner animation="border" role="status" size="sm">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Card.Body>
        </Card>
      );
    }

    if (loyaltyError) {
      return (
        <Card className="shadow mb-4 border-danger">
          <Card.Body className="text-danger text-center py-3">
            {loyaltyError}
          </Card.Body>
        </Card>
      );
    }

    if (!loyaltyProgram) {
      return null;
    }

    return (
      <Card className="shadow mb-4 bg-light">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={6}>
              <div className="mb-3 mb-md-0">
                <p className="fw-semibold text-muted small mb-2">
                  Your Loyalty Status
                </p>
                <h5 className="mb-3">
                  <Badge bg={getLoyaltyBadgeColor(loyaltyProgram.badge)}>
                    {loyaltyProgram.badge
                      ? loyaltyProgram.badge?.toUpperCase()
                      : "NO BADGE"}
                  </Badge>
                </h5>
              </div>
            </Col>
            <Col md={6}>
              <Row className="text-center">
                <Col xs={6} className="mb-3 mb-md-0">
                  <p className="fw-semibold text-muted small mb-1">
                    Total Points
                  </p>
                  <h6 className="fw-bold">{loyaltyProgram.total_points}</h6>
                </Col>
                <Col xs={6}>
                  <p className="fw-semibold text-muted small mb-1">
                    Available Points
                  </p>
                  <h6 className="fw-bold text-success">
                    {loyaltyProgram.current_points}
                  </h6>
                </Col>
              </Row>
            </Col>
          </Row>
          <hr className="my-2" />
          <Row className="text-center text-muted small">
            <Col xs={6}>
              <p className="mb-0">
                Redeemed:{" "}
                <span className="fw-bold">
                  {loyaltyProgram.points_redeemed}
                </span>
              </p>
            </Col>
            <Col xs={6}>
              <p className="mb-0">
                Last Updated:{" "}
                <span className="fw-bold">
                  {dayjs(loyaltyProgram.updated_at).format(
                    "YYYY-MM-DD HH:mm:ss",
                  )}
                </span>
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  };

  /* -----------------------------------------------------------------
        Render coupons data into table
  --------------------------------------------------------------------*/
  const renderCouponTableBody = () => {
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

    if (couponError) {
      return (
        <tr>
          <td colSpan={6} className="text-danger text-center">
            {couponError}
          </td>
        </tr>
      );
    }

    if (coupons.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="text-center py-3">
            <span className="text-muted">
              No available coupons at this moment
            </span>
          </td>
        </tr>
      );
    }

    return coupons.map((coupon) => (
      <tr key={coupon.coupon_code_id}>
        <td className="fw-bold">{coupon.coupon_code}</td>
        <td>
          <Badge bg={getDiscountBadgeColor(coupon.discount_type)}>
            {coupon.discount_type?.toUpperCase()}
          </Badge>
        </td>
        <td className="text-center">
          {coupon.discount_type?.toLowerCase() === "free shipping"
            ? "-"
            : `${coupon.discount_value}`}
        </td>
        <td className="text-center">
          {dayjs(coupon.expiry_date).format("YYYY-MM-DD HH:mm:ss")}
        </td>
        <td className="text-center">
          {`${coupon.used_count}/${coupon.usage_limit}`}
        </td>
        <td className="text-center">
          <Badge bg={getUserGroupColor(coupon.user_group)}>
            {coupon.user_group?.toUpperCase()}
          </Badge>
        </td>
      </tr>
    ));
  };

  /* -----------------------------------------------------------------
        Main render
  --------------------------------------------------------------------*/
  return (
    <Container className="py-4">
      {renderLoyaltyInfo()}

      <Row className="mb-4">
        <Col>
          <h4 className="fw-semibold">Available Coupons</h4>
        </Col>
      </Row>

      <Card className="shadow">
        <Card.Body className="p-0">
          <div className="overflow-y-auto">
            <Table hover striped size="sm" className="mb-0">
              <thead className="position-sticky top-0" style={{ zIndex: 20 }}>
                <tr className="fw-bold bg-light">
                  <th>Coupon Code</th>
                  <th>Type</th>
                  <th className="text-center">Discount Value</th>
                  <th className="text-center">Expiry Date</th>
                  <th className="text-center">Usage</th>
                  <th className="text-center">For</th>
                </tr>
              </thead>
              <tbody>{renderCouponTableBody()}</tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CouponsLoyalty;
