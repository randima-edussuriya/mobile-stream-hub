import React, { useContext } from "react";
import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import loginValidation from "../validations/loginValidation";
import { toast } from "react-toastify";
import { AuthContext } from "../context/authContext";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

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
    e.preventDefault();
    const validationErrors = loginValidation(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const res = await login(formData);
        if (res.data.success) {
          toast.success(res.data.message, { position: "top-center" });
          navigate("/");
        } else {
          toast.error(res.data.message, { position: "top-center" });
        }
      } catch (err) {
        console.error(err);
        toast.error("An error occurred", { position: "top-center" });
      }
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
            {errors.email && (
              <span className="text-danger">{errors.email}</span>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              name="password"
              onChange={handleChange}
            />
            {errors.password && (
              <span className="text-danger">{errors.password}</span>
            )}
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
