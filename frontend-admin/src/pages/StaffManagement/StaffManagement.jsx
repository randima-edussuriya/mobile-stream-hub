import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Table, Badge, Spinner } from "react-bootstrap";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

function StaffManagement() {
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [staffUsers, setStaffUsers] = useState([]);
  const [isToogleStaffUserStatus, setIsToogleStaffUserStatus] = useState(false);

  const { backendUrl } = useContext(AppContext);

  const navigate = useNavigate();

  /* -----------------------------------------------------------------
        Handle staff user activity status change
  --------------------------------------------------------------------*/
  const handleStatusChange = async (staffUserId, isActive) => {
    const actionText = isActive ? "activate" : "deactivate";

    const confim = await Swal.fire({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
        title: "h5",
      },
      title: `Are you sure to  ${actionText} this staff user?`,
      showCancelButton: true,
      confirmButtonText: `Yes, ${actionText}`,
    });

    if (!confim.isConfirmed) return;

    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${staffUserId}/status`,
        { isActive }
      );
      setIsToogleStaffUserStatus(true);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      console.error(error);
    }
  };

  /* -----------------------------------------------------------------
        Fetch Staff users from API
  --------------------------------------------------------------------*/
  const fetchStaffUsers = async () => {
    setLoading(true);
    setError("");
    setStaffUsers([]);
    setIsToogleStaffUserStatus(false);
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/users`);
      setStaffUsers(data.data);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStaffUsers();
  }, [isToogleStaffUserStatus]);

  /* -----------------------------------------------------------------
        Render staff user data into table
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

    if (staffUsers.length === 0) {
      return (
        <tr>
          <td colSpan={11} className="text-danger text-center">
            No staff users found
          </td>
        </tr>
      );
    }

    return staffUsers.map((staffUser) => (
      <tr key={staffUser.staff_id}>
        <td>{staffUser.staff_id}</td>
        <td>
          <strong>
            {staffUser.first_name} {staffUser.last_name}
          </strong>
          <div className="text-muted small">{staffUser.email}</div>
        </td>
        <td>{staffUser.staff_type_name}</td>
        <td>{staffUser.phone_number}</td>
        <td>{dayjs(staffUser.hire_date).format("YYYY-MM-DD HH:mm:ss")}</td>
        <td>
          <Badge bg={staffUser.is_active ? "success" : "danger"}>
            {staffUser.is_active ? "Active" : "Inactive"}
          </Badge>
        </td>
        <td>
          <div className="d-flex gap-1">
            <Button
              className="btn_main_light_outline"
              variant="none"
              size="sm"
              onClick={() => navigate(`profile/${staffUser.staff_id}`)}
            >
              View
            </Button>
            <Button
              className="fw-semibold border-2"
              variant={
                staffUser.is_active ? "outline-danger" : "outline-success"
              }
              size="sm"
              onClick={() =>
                handleStatusChange(staffUser.staff_id, !staffUser.is_active)
              }
            >
              {staffUser.is_active ? "Deactivate" : "Active"}
            </Button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <Container className="bg-secondary-subtle rounded shadow_white py-3 mt-3">
        <Container
          className="d-flex justify-content-between mb-3 position-sticky top-0"
          style={{ zIndex: 30 }}
        >
          <h4>Staff Users</h4>
          <Button
            onClick={() => navigate("register")}
            className="btn_main_dark shadow"
          >
            <i className="bi bi-plus-circle me-2 fs-6"></i>
            Add New
          </Button>
        </Container>
        <Container className="overflow-y-auto" style={{ maxHeight: "75vh" }}>
          <Table hover striped size="sm" className="shadow">
            <thead className="position-sticky top-0" style={{ zIndex: 20 }}>
              <tr className="fw-bold">
                <th>ID</th>
                <th>Name/ E-mail</th>
                <th>User Role</th>
                <th>Phone No</th>
                <th>Hired Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </Table>
        </Container>
      </Container>
    </>
  );
}

export default StaffManagement;
