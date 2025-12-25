import axios from "axios";
import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import dayjs from "dayjs";
import { AppContext } from "../context/AppContext";
import ErrorProvider from "../components/ErrorProvider";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

function Profile() {
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [customer, setCustomer] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    address: "",
  });

  const { backendUrl } = useContext(AppContext);

  const navigate = useNavigate();

  /*---------------------------------------------------------
        fetch customer user profile data
  ------------------------------------------------------------*/
  const fetchCustomerProfile = async () => {
    try {
      setLoading(true);
      setCustomer({});
      setFormData({
        firstName: "",
        lastName: "",
        phoneNo: "",
        address: "",
      });
      setError("");
      const { data } = await axios.get(`${backendUrl}/api/customer/users/me`);
      setCustomer(data.data);
      setFormData({
        firstName: data.data.first_name,
        lastName: data.data.last_name,
        phoneNo: data.data.phone_number,
        address: data.data.address,
      });
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

  const handeleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /*--------------------------------------------------
        handle save updated customer user data
  ---------------------------------------------------- */
  const handleSave = async () => {
    try {
      await axios.put(`${backendUrl}/api/customer/users/me`, formData);
      toast.success("User profile updated successfully");
      setEditing(false);
      fetchCustomerProfile();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCustomerProfile();
  }, []);

  /*----------------------------------------------------------------
        Render loading state
  ------------------------------------------------------------------*/
  if (Loading) {
    return <Loader />;
  }

  /*---------------------------------------------------
        Render error state
  ----------------------------------------------------- */
  if (error) {
    return <ErrorProvider errorMessage={error} />;
  }

  return (
    <Container fluid className="mt-5 py-3">
      <Container className="col-lg-8 bg_light rounded shadow p-3">
        <Row>
          <Col>
            <h4>My Profile</h4>
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
            Personal Information section
      ---------------------------------------------------- */}
        <Row>
          <Col md={6} className="mt-3">
            <h6>Personal Information</h6>
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
              Account Information section
        ------------------------------------------------------ */}
          <Col md={6} className="mt-3">
            <h6>Account Information</h6>
            <hr className="mt-0" />
            <Form.Group className="mb-2">
              <Form.Label>User ID</Form.Label>
              <Form.Control value={customer.customer_id} disabled />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control value={customer.email} disabled />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Registered date</Form.Label>
              <Form.Control
                value={dayjs(customer.created_at).format("YYYY-MM-DD HH:mm:ss")}
                disabled
              />
            </Form.Group>
          </Col>
        </Row>
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
      </Container>
    </Container>
  );
}

export default Profile;
