import { useContext, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

function Signup({ email, purpose, offOtpVerify }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const { backendUrl } = useContext(AppContext);

  const navigate = useNavigate();

  /* ----------------------------------------------------------------------
                Handle form input changes
    ------------------------------------------------------------------------- */
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* ----------------------------------------------------------------------
                Handle form reset
    ------------------------------------------------------------------------- */
  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phoneNo: "",
      address: "",
      password: "",
      confirmPassword: "",
    });
  };

  /* ----------------------------------------------------------------------
                Handle form submit
    ------------------------------------------------------------------------- */
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
      await axios.post(`${backendUrl}/api/customer/auth/register`, {
        ...otherFormdata,
        email,
        purpose,
      });
      toast.success("Staff registered successfully");
      navigate("/login");
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
  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center  mt-5 py-3"
    >
      <Container className="col-10 col-sm-5 p-3 bg_light rounded-2 shadow">
        <h3 className="text-center">Step 3 - Sign Up</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              value={email}
              disabled
              readOnly
              className="bg-success-subtle"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              name="firstName"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              name="lastName"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPhoneNo">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter phone number"
              name="phoneNo"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address"
              name="address"
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              name="password"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              name="confirmPassword"
              onChange={handleChange}
            />
            {errorMessage && (
              <span className="text-danger">{errorMessage}</span>
            )}
          </Form.Group>

          {/* --------------------------------------------------------------
                                buttons section
                    ------------------------------------------------------------------- */}
          <div className="mb-3">
            <Button className="btn_main_dark me-3 shadow" type="submit">
              Sign Up
            </Button>
            <Button
              variant="outline-danger"
              className="btn_style me-3 border-2 shadow"
              type="reset"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Link to={"/login"} className="btn btn_main_light_outline shadow">
              Log In
            </Link>
          </div>
        </Form>
      </Container>
    </Container>
  );
}

export default Signup;
