import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Table, Spinner, Button } from "react-bootstrap";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { hasPermission } from "../../utils/permissions";
import { confirmAction } from "../../utils/confirmAction";

function CouponManagement() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [coupons, setCoupons] = useState([]);

  const { backendUrl, userData } = useContext(AppContext);
  const navigate = useNavigate();

  /* -----------------------------------------------------------------
        Fetch all coupon records from API
  --------------------------------------------------------------------*/
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError("");
      setCoupons([]);

      const { data } = await axios.get(`${backendUrl}/api/admin/coupons`);
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
    fetchCoupons();
  }, []);

  /* -----------------------------------------------------------------
        Delete coupon record
  --------------------------------------------------------------------*/
  const handleDelete = async (couponId) => {
    const result = await confirmAction(
      "Are you sure you want to delete this coupon?",
    );
    if (!result.isConfirmed) return;

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/admin/coupons/${couponId}`,
      );

      if (data.success) {
        toast.success(data.message || "Coupon deleted successfully");
        fetchCoupons();
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to delete coupon. Please try again later.";
      toast.error(message);
      console.error(error);
    }
  };

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

    if (coupons.length === 0) {
      return (
        <tr>
          <td colSpan={8} className="text-danger text-center">
            No coupons found
          </td>
        </tr>
      );
    }

    return coupons.map((coupon) => (
      <tr key={coupon.coupon_code_id}>
        <td className="fw-bold">{coupon.coupon_code_id}</td>
        <td className="fw-bold text-uppercase">{coupon.coupon_code}</td>
        <td>{coupon.discount_type}</td>
        <td>
          {coupon.discount_type === "free shipping"
            ? "-"
            : `Rs. ${coupon.discount_value}`}
        </td>
        <td className="text-muted">
          {dayjs(coupon.expiry_date).format("YYYY-MM-DD HH:mm:ss")}
        </td>
        <td className="text-center">
          <span
            className={
              coupon.is_active ? "badge bg-success" : "badge bg-danger"
            }
          >
            {coupon.is_active ? "Active" : "Inactive"}
          </span>
        </td>
        <td className="text-muted">
          {coupon.used_count}/{coupon.usage_limit}
        </td>
        <td>
          <div className="d-flex gap-3 align-items-center">
            <i
              role="button"
              title="Delete Coupon"
              className="bi bi-trash text-danger action_icon"
              onClick={() => handleDelete(coupon.coupon_code_id)}
            ></i>
            <Link to={`profile/${coupon.coupon_code_id}`}>
              <i
                role="button"
                className="bi-arrow-up-right-square text-primary action_icon"
                title="View Details"
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
          <div className="d-flex align-items-center justify-content-between">
            <h4 className="mb-0">Coupon Management</h4>
            <Button
              onClick={() => navigate("add")}
              size="sm"
              className="btn_main_dark shadow"
            >
              <i className="bi bi-plus-circle me-2 fs-6"></i>
              Add New
            </Button>
          </div>
        </Container>
        <Container className="overflow-y-auto" style={{ maxHeight: "75vh" }}>
          <Table hover striped size="sm" className="shadow">
            <thead className="position-sticky top-0" style={{ zIndex: 20 }}>
              <tr className="fw-bold">
                <th>ID</th>
                <th>Code</th>
                <th>Type</th>
                <th>Discount Value</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Usage</th>
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

export default CouponManagement;
