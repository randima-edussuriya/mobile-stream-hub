import axios from "axios";
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import dayjs from "dayjs";
import { AppContext } from "../context/AppContext";

function Profile() {
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [staffUser, setStaffUser] = useState({});

  const { backendUrl, userData } = useContext(AppContext);

  const navigate = useNavigate();

  //redirect admin to admin profile page
  if (userData.userRole === "admin") {
    navigate(`/staff-management/profile/${userData.userId}`);
  }

  /*---------------------------------------------------------
        fetch staffUser user profile data
  ------------------------------------------------------------*/
  const fetchStaffUserProfile = async () => {
    try {
      setLoading(true);
      setStaffUser({});
      setError("");
      const { data } = await axios.get(
        `${backendUrl}/api/admin/staff-users/me`
      );
      setStaffUser(data.data);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffUserProfile();
  }, []);

  /*----------------------------------------------------------------
        Render loading state
  ------------------------------------------------------------------*/
  if (Loading) {
    return (
      <Container className="text-center mt-3">
        <Spinner animation="border" role="status" variant="light">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  /*---------------------------------------------------
        Render error state
  ----------------------------------------------------- */
  if (error) {
    return (
      <Container className="bg-secondary-subtle rounded shadow p-3 text-center mt-3">
        <div className="text-end">
          <Button
            className="border-2 shadow"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </div>
        <h5 className="text-danger">{error}</h5>
      </Container>
    );
  }

  return (
    <Container className="bg-secondary-subtle rounded shadow p-3 mt-3">
      <Row>
        <Col>
          <h4>
            {staffUser.first_name} {staffUser.last_name}
          </h4>
          <Form.Check
            type="switch"
            checked={staffUser.is_active}
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
        </Col>
        <Col xs="auto">
          <Button
            className="border-2 shadow"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Col>
      </Row>

      {/* ------------------------------------------------
            Contact details section
      ---------------------------------------------------- */}
      <Row>
        <Col md={6} className="mt-3">
          <h6>Contact</h6>
          <hr className="mt-0 border-1" />
          <Row>
            <Col>
              <Form.Group className="mb-2">
                <Form.Label>First name</Form.Label>
                <Form.Control value={staffUser.first_name} disabled />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-2">
                <Form.Label>Last name</Form.Label>
                <Form.Control value={staffUser.last_name} disabled />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control value={staffUser.email} disabled />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Phone number</Form.Label>
            <Form.Control value={staffUser.phone_number} disabled />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={staffUser.address}
              disabled
            />
          </Form.Group>
        </Col>

        {/* -------------------------------------------------
              Employment details section
        ------------------------------------------------------ */}
        <Col md={6} className="mt-3">
          <h6>Employment</h6>
          <hr className="mt-0" />
          <Form.Group className="mb-2">
            <Form.Label>User ID</Form.Label>
            <Form.Control value={staffUser.staff_id} disabled />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Role</Form.Label>
            <Form.Control value={staffUser.user_role} disabled />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Hire date</Form.Label>
            <Form.Control
              value={dayjs(staffUser.hire_date).format("YYYY-MM-DD HH:mm:ss")}
              disabled
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>NIC</Form.Label>
            <Form.Control value={staffUser.nic_number} disabled />
          </Form.Group>
          <Form.Group className="mb-2"></Form.Group>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
