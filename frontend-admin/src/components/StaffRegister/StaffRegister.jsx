import { useContext, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { AppContext } from "../../context/AppContext";

function StaffRegister({ email, purpose, offOtpVerify }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    nicNo: "",
    address: "",
    staffTypeId: "",
    password: "",
    confirmPassword: "",
  });
  const [stafTypes, setStafTypes] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");

  const { backendUrl } = useContext(AppContext);

  const navigate = useNavigate();

  /* -----------------------------------------------------------------
        Handle form input changes 
  --------------------------------------------------------------------*/
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* -----------------------------------------------------------------
        Handle form reset
  --------------------------------------------------------------------*/
  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phoneNo: "",
      nicNo: "",
      address: "",
      staffTypeId: "",
      password: "",
      confirmPassword: "",
    });
  };

  /* -----------------------------------------------------------------
         Handle form submit
   --------------------------------------------------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate password and confirm password
      setErrorMessage("");
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage("Password and Confirm Password do not match");
        return;
      }
      // Register staff user API call
      const { confirmPassword, ...otherFormdata } = formData;
      await axios.post(`${backendUrl}/api/admin/auth/register`, {
        ...otherFormdata,
        email,
        purpose,
      });
      toast.success("Staff registered successfully");
      navigate("/staff-management");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      // handle otp not verified case
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        offOtpVerify();
      }
      console.error(error);
    }
  };

  /* -----------------------------------------------------------------
        Fetch Staff Types from API
  --------------------------------------------------------------------*/
  const fetchStaffTypes = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/staff-users/staff-types`
      );
      setStafTypes(data.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      console.error(error);
    }
  };
  useEffect(() => {
    fetchStaffTypes();
  }, []);

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center  mt-3 mb-5 py-0 rounded"
    >
      <Container className="col-10 col-sm-6 p-3 rounded bg-secondary-subtle shadow_white">
        <h3 className="text-center mb-3">Step 3 - Staff User Register</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              disabled
              readOnly
              name="email"
              value={email}
              className="bg-success-subtle border-1 border-success shadow"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              name="firstName"
              onChange={handleChange}
              className="shadow"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              name="lastName"
              onChange={handleChange}
              className="shadow"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPhoneNo">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter phone number"
              name="phoneNo"
              onChange={handleChange}
              className="shadow"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupNicNo">
            <Form.Label>NIC Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter NIC number"
              name="nicNo"
              onChange={handleChange}
              className="shadow"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address"
              name="address"
              onChange={handleChange}
              className="shadow"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupStaffType">
            <Form.Label>Staff Type</Form.Label>
            <Form.Select
              value={formData.staffTypeId}
              name="staffTypeId"
              onChange={handleChange}
            >
              <option value="">Select staff type</option>
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

          <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              name="password"
              onChange={handleChange}
              className="shadow"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              name="confirmPassword"
              onChange={handleChange}
              className="shadow"
            />
            {errorMessage && (
              <span className="text-danger">{errorMessage}</span>
            )}
          </Form.Group>

          <div className="mb-3">
            <Button className="btn_main_dark me-3 shadow" type="submit">
              Register
            </Button>
            <Button
              variant="outline-danger"
              className="btn_style me-3 border-2 shadow"
              type="reset"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
        </Form>
      </Container>
    </Container>
  );
}

export default StaffRegister;
