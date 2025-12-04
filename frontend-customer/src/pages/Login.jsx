import React, { useContext } from "react";
import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const navigate = useNavigate();

  /* ----------------------------------------------------------------------
                Handle form input changes
    ------------------------------------------------------------------------- */
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* ----------------------------------------------------------------------
                Handle form submit
    ------------------------------------------------------------------------- */
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(
        `${backendUrl}/api/customer/auth/login`,
        formData
      );
      toast.success(data.message);
      setIsLoggedIn(true);
      navigate("/");
      getUserData();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong, Please try again later"
      );
      console.error(error);
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center mt-5 py-3"
    >
      <Container className="col-10 col-sm-4 p-3 bg_light rounded-2 shadow">
        <h3 className="text-center">Log In</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter email"
              name="email"
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
          {/* --------------------------------------------------------------
                                buttons section
                    ------------------------------------------------------------------- */}
          <div className="mb-3">
            <Button
              variant="none"
              className="btn_main_dark me-3 shadow"
              type="submit"
            >
              Log In
            </Button>
            <Link to={"/signup"} className="btn btn_main_light_outline shadow">
              Sign Up
            </Link>
          </div>
        </Form>
      </Container>
    </Container>
  );
}

export default Login;
