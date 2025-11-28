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
        Fetch Staff users from API
  --------------------------------------------------------------------*/
  useEffect(() => {
    const fetchStaffUsers = async () => {
      setLoading(true);
      setError("");
      setStaffUsers([]);
      setIsToogleStaffUserStatus(false);
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/users`);
        setStaffUsers(data.data);
      } catch (error) {
        setError(error?.response?.data?.message || "Something went wrong");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaffUsers();
  }, [isToogleStaffUserStatus]);

  /* -----------------------------------------------------------------
        Handle staff user status change
  --------------------------------------------------------------------*/
  const handleStatusChange = async (staffUserId, newStatus) => {
    const actionText = newStatus ? "activate" : "deactivate";

    const confim = await Swal.fire({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
        title: "h5",
      },
      title: `Are you sure to  ${actionText} this staff user`,
      showCancelButton: true,
      confirmButtonColor: "#10207A",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${actionText}`,
      width: "17em",
    });

    if (!confim.isConfirmed) return;

    try {
      const res = await axios.put(
        `http://localhost:5000/api/staff_user/status/${staffUserId}`,
        { newStatus: newStatus }
      );
      if (res.data.success) {
        setIsToogleStaffUserStatus(true);
        toast.success(res.data.message, { position: "top-center" });
      } else {
        toast.error(res.data.message, { position: "top-center" });
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
      });
    }
  };

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
        <td>{staffUser.first_name}</td>
        <td>{staffUser.last_name}</td>
        <td>{staffUser.staff_type_name}</td>
        <td>{staffUser.email}</td>
        <td>{staffUser.phone_number}</td>
        <td>{staffUser.nic_number}</td>
        <td>{staffUser.address}</td>
        <td>{dayjs(staffUser.hire_date).format("YYYY-MM-DD HH:mm:ss")}</td>
        <td>
          <Badge bg={staffUser.is_active ? "success" : "danger"}>
            {staffUser.is_active ? "Active" : "Deactive"}
          </Badge>
        </td>
        <td>
          <Button
            className="fw-bold"
            variant={staffUser.is_active ? "outline-danger" : "outline-success"}
            size="sm"
            onClick={() =>
              handleStatusChange(
                staffUser.staff_id,
                staffUser.is_active ? 0 : 1
              )
            }
          >
            {staffUser.is_active ? "Deactivate" : "Active"}
          </Button>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <Container className="bg-secondary-subtle rounded shadow_white py-3 mt-3">
        <Container className="d-flex justify-content-between mb-3">
          <h4>Staff Users</h4>
          <Button
            onClick={() => navigate("/staff-register")}
            className="btn_main_dark shadow"
          >
            <i className="bi bi-plus-circle me-2 fs-6"></i>
            Add New
          </Button>
        </Container>
        <Container>
          <Table
            responsive
            hover
            striped
            size="sm"
            className="rounded overflow-hidden shadow"
          >
            <thead>
              <tr className="fw-bold">
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>User Role</th>
                <th>E-mail</th>
                <th>Phone No</th>
                <th>NIC No</th>
                <th>Address</th>
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
