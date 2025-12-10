import axios from "axios";
import { useContext } from "react";
import { useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import dayjs from "dayjs";
import { useUserAction } from "../../hooks/useUserAction";
import { toast } from "react-toastify";

function StaffProfile() {
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { staffId } = useParams();
  const [editing, setEditing] = useState(false);
  const [staffUser, setStaffUser] = useState({});
  const [stafTypes, setStafTypes] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    nicNo: "",
    address: "",
    staffTypeId: "",
  });

  const { backendUrl } = useContext(AppContext);

  const { handleStatusChange } = useUserAction(backendUrl);

  const navigate = useNavigate();

  /*---------------------------------------------------------
        fetch staffUser user profile data
  ------------------------------------------------------------*/
  const fetchStaffUserProfile = async () => {
    try {
      setStaffUser({});
      setFormData({
        firstName: "",
        lastName: "",
        phoneNo: "",
        nicNo: "",
        address: "",
        staffTypeId: "",
      });
      setError("");
      const { data } = await axios.get(
        `${backendUrl}/api/admin/staff-users/${staffId}`
      );
      setStaffUser(data.data);
      setFormData({
        firstName: data.data.first_name,
        lastName: data.data.last_name,
        phoneNo: data.data.phone_number,
        nicNo: data.data.nic_number,
        address: data.data.address,
        staffTypeId: data.data.staff_type_id,
      });
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      console.error(error);
    }
  };

  /* -------------------------------------------------------
        fetch staff types
  ---------------------------------------------------------- */
  const fetchStaffTypes = async () => {
    try {
      setStafTypes([]);
      setError("");
      const { data } = await axios.get(
        `${backendUrl}/api/admin/staff-users/staff-types`
      );
      setStafTypes(data.data);
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      console.error(error);
    }
  };

  const handeleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /*--------------------------------------------------
        handle save updated staff user data
  ---------------------------------------------------- */
  const handleSave = async () => {
    try {
      await axios.put(
        `${backendUrl}/api/admin/staff-users/${staffId}`,
        formData
      );
      toast.success("Staff user updated successfully");
      setEditing(false);
      loadData();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      console.error(error);
    }
  };

  /*-----------------------------------
        load all data
  ------------------------------------- */
  const loadData = async () => {
    setLoading(true);

    try {
      await Promise.all([fetchStaffTypes(), fetchStaffUserProfile()]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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
      <Container className="bg-secondary-subtle rounded shadow_white p-3 text-center mt-3">
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
    <Container className="bg-secondary-subtle rounded shadow_white p-3 mt-3">
      <Row>
        <Col>
          <h4>
            {staffUser.first_name} {staffUser.last_name}
          </h4>
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
                loadData
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
        </Col>
        <Col xs="auto">
          <Button
            className="me-2 border-2 shadow"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Button
            variant="none"
            className="btn_main_light_outline shadow"
            onClick={() => setEditing((prev) => !prev)}
          >
            {editing ? "Cancel" : "Edit"}
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
                <Form.Control
                  name="firstName"
                  onChange={handeleChange}
                  value={formData.firstName}
                  disabled={!editing}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-2">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  name="lastName"
                  onChange={handeleChange}
                  value={formData.lastName}
                  disabled={!editing}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control value={staffUser.email} disabled />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Phone number</Form.Label>
            <Form.Control
              name="phoneNo"
              onChange={handeleChange}
              value={formData.phoneNo}
              disabled={!editing}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Address</Form.Label>
            <Form.Control
              name="address"
              onChange={handeleChange}
              as="textarea"
              rows={2}
              value={formData.address}
              disabled={!editing}
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
            <Form.Select
              name="staffTypeId"
              onChange={handeleChange}
              value={formData.staffTypeId}
              disabled={!editing}
            >
              {
                /* -----------------------------------------------------------------
                      Render staff types to UI
                --------------------------------------------------------------------*/
                stafTypes.length === 0 ? (
                  <option value="" className="text-danger">
                    Not available staff types
                  </option>
                ) : (
                  stafTypes.map((row) => (
                    <option value={row.staff_type_id} key={row.staff_type_id}>
                      {row.staff_type_name}
                    </option>
                  ))
                )
              }
            </Form.Select>
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
            <Form.Control
              name="nicNo"
              onChange={handeleChange}
              value={formData.nicNo}
              disabled={!editing}
            />
          </Form.Group>
          <Form.Group className="mb-2"></Form.Group>
        </Col>
        {editing && (
          <div className="mt-3 text-center">
            <Button
              variant="none"
              onClick={handleSave}
              className="me-2 btn_main_dark shadow px-5"
            >
              Update
            </Button>
          </div>
        )}
      </Row>
    </Container>
  );
}

export default StaffProfile;
