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

function Coupons() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [coupons, setCoupons] = useState([]);

  const { backendUrl } = useContext(AppContext);

  /* -----------------------------------------------------------------
        Fetch available coupons from API
  --------------------------------------------------------------------*/
  const fetchAvailableCoupons = async () => {
    try {
      setLoading(true);
      setError("");
      setCoupons([]);

      const { data } = await axios.get(`${backendUrl}/api/customer/coupons`);
      setCoupons(data.data);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to fetch coupons. Please try again later.";
      setError(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableCoupons();
  }, []);

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
        Render coupons data into table
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
            ? "Free Shipping"
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

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h3 className="fw-bold">Available Coupons</h3>
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
              <tbody>{renderTableBody()}</tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Coupons;
