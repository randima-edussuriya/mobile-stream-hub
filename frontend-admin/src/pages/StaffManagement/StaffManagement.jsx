import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Table, Spinner, Form } from "react-bootstrap";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useUserAction } from "../../hooks/useUserAction";

function StaffManagement() {
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [staffUsers, setStaffUsers] = useState([]);

  const { backendUrl, userData } = useContext(AppContext);

  const { handleStatusChange } = useUserAction(backendUrl);

  const navigate = useNavigate();

  /* -----------------------------------------------------------------
        Fetch Staff users from API
  --------------------------------------------------------------------*/
  const fetchStaffUsers = async () => {
    setLoading(true);
    setError("");
    setStaffUsers([]);
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/staff-users`);
      // filter out logged in user from the list
      const filteredUsers = data.data.filter(
        (user) => user.staff_id !== userData.userId
      );
      setStaffUsers(filteredUsers);
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
  }, []);

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
          <Form.Check
            type="switch"
            name="is_active"
            id="is_active"
            checked={staffUser.is_active}
            onChange={() =>
              handleStatusChange(
                "staff",
                staffUser.staff_id,
                !staffUser.is_active,
                fetchStaffUsers
              )
            }
            label={
              <span
                className={`fw-semibold ${
                  staffUser.is_active ? "text-success" : "text-danger"
                }`}
              >
                {staffUser.is_active ? "Active" : "Inactive"}
              </span>
            }
          />
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
          </div>
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
